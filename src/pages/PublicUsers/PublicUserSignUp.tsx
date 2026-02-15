import React, { useState, useEffect, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button/button";
import { Form } from "@/components/ui/form";
import {
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Plus,
  Trash2,
  Users,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { PublicUserStep } from "./PublicUserStep";
import { motion, AnimatePresence } from "framer-motion";

// --- Schemas ---
const userSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  phone_no: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not be greater than 15 digits"),
  email: z.string().email("Invalid email address"),
  reg_num: z
    .string()
    .trim()
    .min(10, "Registration number must be at least 10 digits")
    .max(10, "Registration number must not be greater than 10 digits"),
  branch: z.string().min(1, "Branch is required"),
  year: z.string().min(1, "Year of study is required"),
  gender: z.string().min(1, "Gender is required"),
  college_hostel_status: z.boolean(),
});

// Main form schema includes primary user + friends array
const formSchema = z
  .object({
    primary_user: userSchema,
    friends: z
      .array(userSchema)
      .optional()
      .refine((friends) => {
        return (friends?.length || 0) <= 3;
      }, "You can add a maximum of 3 friends (Total 4 members allowed).")
      .superRefine((friends, ctx) => {
        if (!friends || friends.length === 0) return;

        const checkDuplicates = (
          field: keyof typeof userSchema.shape,
          message: string,
        ) => {
          const values = friends.map((f) => f[field]);
          const uniqueValues = new Set(values);
          if (uniqueValues.size !== values.length) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: message,
              path: [],
            });
          }
        };

        checkDuplicates(
          "reg_num",
          "Duplicate registration numbers found among friends.",
        );
        checkDuplicates(
          "email",
          "Duplicate email addresses found among friends.",
        );
        checkDuplicates(
          "phone_no",
          "Duplicate phone numbers found among friends.",
        );
      }),
  })
  .superRefine((data, ctx) => {
    if (!data.friends || data.friends.length === 0) return;
    const { reg_num, email, phone_no } = data.primary_user;

    data.friends.forEach((friend, index) => {
      if (friend.reg_num === reg_num) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Primary user and friend cannot have the same Registration Number.",
          path: ["friends", index, "reg_num"],
        });
      }
      if (friend.email === email) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Primary user and friend cannot have the same Email.",
          path: ["friends", index, "email"],
        });
      }
      if (friend.phone_no === phone_no) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Primary user and friend cannot have the same Phone Number.",
          path: ["friends", index, "phone_no"],
        });
      }
    });
  });

type FormData = z.infer<typeof formSchema>;

export const PublicUserSignUp: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();

  // Robust check: try 'eventId' first, then fallback to 'id', then 'uuid'
  const eventId = params.eventuuid;

  const [isProcessing, setIsProcessing] = useState(false);
  const [eventFee, setEventFee] = useState<number | null>(null);
  const [eventName, setEventName] = useState<string>("");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Initialize Form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      primary_user: {
        full_name: "",
        phone_no: "",
        email: "",
        reg_num: "",
        branch: "",
        year: "",
        gender: "",
        college_hostel_status: false,
      },
      friends: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "friends",
  });

  // --- Robust Data Fetching ---
  useEffect(() => {
    let isMounted = true;

    if (!eventId) {
      console.error("Event ID missing in URL");
      toast.error("Invalid Event Link");
      return;
    }

    const fetchEventDetails = async () => {
      try {
        console.log(`Fetching event details for ID: ${eventId}`);
        const res = await axios.get(`${API_BASE_URL}/events/${eventId}`);

        if (!isMounted) return;

        // Robust extraction logic
        const data = res.data.data || res.data;
        let fee = data.fee;

        // Handle string/number/null variations
        if (fee === undefined || fee === null) {
          fee = 0;
        } else if (typeof fee === "string") {
          if (fee.toLowerCase() === "free") fee = 0;
          else fee = parseFloat(fee);
        }

        if (isNaN(Number(fee))) fee = 0;

        setEventFee(Number(fee));
        setEventName(data.name || "Event");
      } catch (error) {
        console.error("Failed to fetch event details:", error);
        toast.error("Failed to load event details. Please refresh.");
        if (isMounted) setEventFee(0);
      }
    };

    fetchEventDetails();

    return () => {
      isMounted = false;
    };
  }, [eventId, API_BASE_URL]);

  // Derived State for UI
  const isFeeLoaded = eventFee !== null;
  const currentFee = eventFee ?? 0;

  // Memoize total calculation
  const totalAmount = useMemo(() => {
    const count = 1 + fields.length;
    return count * currentFee;
  }, [fields.length, currentFee]);

  // --- Registration Logic ---
  const handleRegistration = async (data: FormData) => {
    if (!eventId) return;
    setIsProcessing(true);
    const toastId = toast.loading("Initializing registration...");

    try {
      const allUsers = [data.primary_user, ...(data.friends || [])];

      for (const [index, user] of allUsers.entries()) {
        const userLabel = index === 0 ? "Primary User" : `Friend #${index}`;
        toast.loading(`Registering ${userLabel}...`, { id: toastId });

        let userId = null;
        // Fix 1: Ensure uppercase registration number everywhere
        const normalizedRegNum = user.reg_num.toUpperCase().trim();

        // 1. Check if user exists
        try {
          const checkRes = await axios.get(
            `${API_BASE_URL}/public-user/reg-num/${normalizedRegNum}`,
          );
          userId = checkRes.data.data?.uuid || checkRes.data?.uuid;
          console.log(`User Check (${normalizedRegNum}): Found UUID`, userId);
        } catch (error: any) {
          if (error.response?.status !== 404) {
            console.error(`Error checking user ${normalizedRegNum}:`, error);
          }
        }

        // 2. Create User if not found
        if (!userId) {
          const userPayload = {
            reg_num: normalizedRegNum, // Send Uppercase
            name: user.full_name,
            email: user.email,
            gender: user.gender,
            year: user.year,
            branch: user.branch,
            phone_no: user.phone_no,
            college_hostel_status: user.college_hostel_status ? 1 : 0,
          };

          try {
            await axios.post(`${API_BASE_URL}/public-user`, userPayload);

            // Fix 2: Tiny delay to ensure DB write is visible
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Re-fetch
            const refetchRes = await axios.get(
              `${API_BASE_URL}/public-user/reg-num/${normalizedRegNum}`,
            );
            console.log(
              `User Refetch (${normalizedRegNum}): Response`,
              refetchRes.data,
            );

            userId = refetchRes.data.data?.uuid || refetchRes.data?.uuid;

            // If still null, try 'id' just in case backend uses numeric id
            if (!userId)
              userId = refetchRes.data.data?.id || refetchRes.data?.id;
          } catch (createError: any) {
            if (
              createError.response?.status === 409 ||
              createError.response?.data?.message?.includes("Duplicate")
            ) {
              const refetchRes = await axios.get(
                `${API_BASE_URL}/public-user/reg-num/${normalizedRegNum}`,
              );
              userId = refetchRes.data.data?.uuid || refetchRes.data?.uuid;
            } else {
              throw createError;
            }
          }
        }

        if (!userId) {
          // Logs to help you debug if it fails again
          console.error(
            `CRITICAL: Could not resolve User ID for ${normalizedRegNum} after creation.`,
          );
          throw new Error(`Could not resolve User ID for ${normalizedRegNum}`);
        }

        // 3. Create Event Registration
        const registrationPayload = {
          public_user_id: userId,
          event_id: eventId,
          reg_num: normalizedRegNum,
        };

        await axios.post(
          `${API_BASE_URL}/public/event-registrations`,
          registrationPayload,
        );
      }

      toast.success("Registration Successful!", { id: toastId });
      setTimeout(() => navigate("/success"), 1500);
    } catch (error: any) {
      console.error("Registration Cycle Error:", error);
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Please try again.";
      toast.error(msg, { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans relative overflow-hidden flex flex-col items-center">
      {/* Background Blobs */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-lolo-cyan/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-lolo-pink/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Back Button */}
      <button
        className="backdrop-blur-md z-50 absolute top-6 left-6 flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group rounded-full px-4 py-2 border border-white/5 bg-black/20"
        onClick={() => window.history.back()}
      >
        <ArrowLeft
          size={18}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span className="hidden sm:inline font-bold text-sm">Back</span>
      </button>

      <div className="relative z-10 w-full max-w-6xl px-4 pt-24 pb-32">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight text-white">
            Event Registration
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            {eventName
              ? `Registering for ${eventName}`
              : "Register yourself and add friends."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: Form */}
          <div className="lg:col-span-2 space-y-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleRegistration)}
                className="space-y-8"
              >
                {/* PRIMARY USER CARD */}
                <div className="bg-[#09090b] border border-white/10 p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-lolo-pink"></div>
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Users size={20} className="text-lolo-pink" />
                    Primary Registrant
                  </h3>
                  <PublicUserStep form={form} prefix="primary_user" />
                </div>

                {/* FRIENDS LIST */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      Adding Friends
                      <span className="bg-white/10 text-xs px-2 py-0.5 rounded-full text-neutral-300">
                        {fields.length}
                      </span>
                    </h3>
                    <Button
                      type="button"
                      onClick={() =>
                        append({
                          full_name: "",
                          phone_no: "",
                          email: "",
                          reg_num: "",
                          branch: "",
                          year: "",
                          gender: "",
                          college_hostel_status: false,
                        })
                      }
                      disabled={fields.length >= 3}
                      className="bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      size="sm"
                    >
                      <Plus size={16} className="mr-2" />
                      {fields.length >= 3 ? "Max Limit Reached" : "Add Friend"}
                    </Button>
                  </div>

                  <AnimatePresence>
                    {fields.map((field, index) => (
                      <motion.div
                        key={field.id}
                        initial={{ opacity: 0, height: 0, y: 20 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, scale: 0.95 }}
                        className="bg-[#09090b]/50 border border-white/10 p-6 rounded-3xl relative group backdrop-blur-sm"
                      >
                        <div className="absolute top-6 right-6 z-10">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            className="text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>

                        <div className="mb-6">
                          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 bg-white/5 px-3 py-1.5 rounded-md border border-white/5">
                            Friend #{index + 1}
                          </span>
                        </div>

                        <PublicUserStep
                          form={form}
                          prefix={`friends.${index}`}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {fields.length === 0 && (
                    <div className="text-center p-12 border border-dashed border-white/10 rounded-3xl text-neutral-500 text-sm bg-white/[0.02]">
                      <p>Coming alone? No problem.</p>
                      <p className="mt-1 text-xs text-neutral-600">
                        Use the button above if you want to bring a squad.
                      </p>
                    </div>
                  )}
                </div>
              </form>
            </Form>
          </div>

          {/* RIGHT COLUMN: Summary (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <div className="bg-[#09090b]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                {/* Decorative glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-lolo-pink/20 rounded-full blur-[60px] pointer-events-none"></div>

                <h3 className="text-xl font-bold mb-8 flex items-center gap-2 relative z-10">
                  <CreditCard size={20} className="text-emerald-400" />
                  Registration Summary
                </h3>

                <div className="space-y-4 mb-8 relative z-10">
                  {/* Primary Ticket */}
                  <div className="flex justify-between items-center text-sm py-2 border-b border-white/5">
                    <span className="text-neutral-400">Primary Ticket</span>
                    <span className="font-mono font-medium text-white">
                      {isFeeLoaded ? (
                        `₹${currentFee}`
                      ) : (
                        <Loader2 className="w-3 h-3 animate-spin text-neutral-500" />
                      )}
                    </span>
                  </div>

                  {/* Friends Tickets */}
                  <AnimatePresence>
                    {fields.map((_, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex justify-between items-center text-sm py-2 border-b border-white/5"
                      >
                        <span className="text-neutral-400">
                          Friend #{idx + 1}
                        </span>
                        <span className="font-mono font-medium text-white">
                          {isFeeLoaded ? (
                            `₹${currentFee}`
                          ) : (
                            <Loader2 className="w-3 h-3 animate-spin text-neutral-500" />
                          )}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Total */}
                  <div className="flex justify-between items-center text-lg font-bold pt-4">
                    <span>Total Amount</span>
                    <span className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-lolo-pink to-purple-400 font-mono tracking-tight">
                      {isFeeLoaded ? (
                        `₹${totalAmount}`
                      ) : (
                        <Loader2 className="w-6 h-6 animate-spin text-lolo-pink" />
                      )}
                    </span>
                  </div>
                </div>

                {!isFeeLoaded && (
                  <div className="flex items-center justify-center gap-2 p-3 mb-6 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 text-xs">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Fetching latest ticket prices...
                  </div>
                )}

                <Button
                  onClick={form.handleSubmit(handleRegistration)}
                  disabled={isProcessing || !isFeeLoaded}
                  className="w-full h-16 bg-white text-black hover:bg-lolo-pink hover:text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(236,72,153,0.4)] transition-all active:scale-[0.98] text-lg relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Confirm Registration{" "}
                        <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                </Button>

                <p className="text-[10px] text-neutral-500 text-center mt-6 flex items-center justify-center gap-1.5">
                  <AlertCircle size={10} />
                  You will be registered immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

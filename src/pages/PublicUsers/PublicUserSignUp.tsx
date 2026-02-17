import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button/button";
import { Form } from "@/components/ui/form";
import {
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Users,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { PublicUserStep } from "./PublicUserStep";

// --- Schemas ---
const formSchema = z.object({
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

type FormData = z.infer<typeof formSchema>;

export const PublicUserSignUp: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();

  // Robust check: try 'eventuuid' or fallback
  const eventId = params.eventuuid;

  const [isProcessing, setIsProcessing] = useState(false);
  const [eventFee, setEventFee] = useState<number | null>(null);
  const [eventName, setEventName] = useState<string>("");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Initialize Form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      phone_no: "",
      email: "",
      reg_num: "",
      branch: "",
      year: "",
      gender: "",
      college_hostel_status: false,
    },
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

        const data = res.data.data || res.data;
        let fee = data.fee;

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

  const isFeeLoaded = eventFee !== null;
  const currentFee = eventFee ?? 0;

  // --- Registration Logic ---
  const handleRegistration = async (data: FormData) => {
    if (!eventId) return;
    setIsProcessing(true);
    const toastId = toast.loading("Processing registration...");

    try {
      const normalizedRegNum = data.reg_num.toUpperCase().trim();
      let numericUserId = null;

      // 1. Check if user exists
      try {
        console.log(
          `Checking for existing user with Reg Num: ${normalizedRegNum}`,
        );

        const checkRes = await axios.get(
          `${API_BASE_URL}/public-user/reg-num/${normalizedRegNum}`,
        );

        const userData = checkRes.data.data || checkRes.data;

        if (userData) {
          // Prefer ID (numeric) if available, else UUID
          numericUserId = userData.id || userData.uuid;
          console.log(
            `User Check (${normalizedRegNum}): Found ID`,
            numericUserId,
          );
        }
      } catch (error: any) {
        if (error.response?.status !== 404) {
          console.warn(`Warning checking user ${normalizedRegNum}:`, error);
        }
      }

      // 2. Create User if not found
      if (!numericUserId) {
        const userPayload = {
          reg_num: normalizedRegNum,
          name: data.full_name,
          email: data.email,
          gender: data.gender,
          year: data.year,
          branch: data.branch,
          phone_no: data.phone_no,
          college_hostel_status: data.college_hostel_status ? 1 : 0,
        };

        try {
          await axios.post(`${API_BASE_URL}/public-user`, userPayload);

          // Delay to allow DB propagation
          await new Promise((resolve) => setTimeout(resolve, 800));

          console.log(`User created for ${normalizedRegNum}, fetching ID...`);

          // Re-fetch to get ID
          const refetchRes = await axios.get(
            `${API_BASE_URL}/public-user/reg-num/${normalizedRegNum}`,
          );
          console.log(
            `Re-fetch after creation for ${normalizedRegNum}:`,
            refetchRes.data,
          );

          const userData = refetchRes.data.data || refetchRes.data;
          numericUserId = userData.id || userData.uuid;
        } catch (createError: any) {
          // Handle Duplicate Entry race condition gracefully
          if (
            createError.response?.status === 409 ||
            createError.response?.data?.message
              ?.toLowerCase()
              .includes("duplicate") ||
            createError.response?.data?.message
              ?.toLowerCase()
              .includes("already taken")
          ) {
            console.log("User likely exists (duplicate error), re-fetching...");
            const refetchRes = await axios.get(
              `${API_BASE_URL}/public-user/reg-num/${normalizedRegNum}`,
            );
            const userData = refetchRes.data.data || refetchRes.data;
            numericUserId = userData.id || userData.uuid;
          } else {
            // Throw real errors (validation errors on user creation)
            console.error("User Creation Failed:", createError.response?.data);
            throw createError;
          }
        }
      }

      if (!numericUserId) {
        throw new Error(
          `Could not resolve User ID for ${normalizedRegNum}. Please try again.`,
        );
      }

      // 3. Create Event Registration
      const registrationPayload = {
        public_user_id: numericUserId,
        // event_id: eventId,
        reg_num: normalizedRegNum,
        // is_paid: "not_paid",
        // payment_status: "pending",
        // registration_status: "pending",
      };

      await axios.post(
        `${API_BASE_URL}/public/event/${eventId}/registration`,
        registrationPayload,
      );

      toast.success("Registration Successful!", { id: toastId });
      setTimeout(() => {
        navigate("/success-event-registration", {
          state: {
            eventType: "default", // You can derive this from event data if available
            eventName: eventName,
          },
        });
      }, 1000);
    } catch (error: any) {
      console.error("Registration Cycle Error:", error);

      let errorMessage = "Registration failed. Please try again.";

      if (error.response) {
        if (error.response.status === 422 && error.response.data.errors) {
          const firstErrorField = Object.keys(error.response.data.errors)[0];
          const firstErrorMsg = error.response.data.errors[firstErrorField][0];
          errorMessage = `Validation Error: ${firstErrorMsg}`;
        }
        // Handle Server Errors
        else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, { id: toastId, duration: 5000 });
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
              : "Enter your details to register."}
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
                    Participant Details
                  </h3>
                  <PublicUserStep form={form} prefix="" />
                </div>
              </form>
            </Form>
          </div>

          {/* RIGHT COLUMN: Summary (Sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <div className="bg-[#09090b]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-lolo-pink/20 rounded-full blur-[60px] pointer-events-none"></div>

                <h3 className="text-xl font-bold mb-8 flex items-center gap-2 relative z-10">
                  <CreditCard size={20} className="text-emerald-400" />
                  Total Summary
                </h3>

                <div className="space-y-4 mb-8 relative z-10">
                  <div className="flex justify-between items-center text-sm py-2 border-b border-white/5">
                    <span className="text-neutral-400">Registration Fee</span>
                    <span className="font-mono font-medium text-white">
                      {isFeeLoaded ? (
                        `₹${currentFee}`
                      ) : (
                        <Loader2 className="w-3 h-3 animate-spin text-neutral-500" />
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-lg font-bold pt-4">
                    <span>Total Amount</span>
                    <span className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-lolo-pink to-purple-400 font-mono tracking-tight">
                      {isFeeLoaded ? (
                        `₹${currentFee}`
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

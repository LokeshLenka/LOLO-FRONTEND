import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UtrPublicUserStep } from "./UTRPublicUserStep";
import {
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Users,
  CreditCard,
  // QrCode
} from "lucide-react";

type EventResponse = {
  name?: string;
  fee?: number | string | null;
  type?: string | null;
  amount?: number | string | null;
  qr_code_url?: string | null;
};

// --- Helpers ---
function unwrap<T>(res: any): T {
  return (res?.data?.data ?? res?.data) as T;
}

function toNumberFee(val: unknown): number {
  if (val === undefined || val === null) return 0;
  if (typeof val === "number") return Number.isFinite(val) ? val : 0;
  if (typeof val === "string") {
    if (val.trim().toLowerCase() === "free") return 0;
    const n = Number.parseFloat(val);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

export const UtrPublicUserSignUp: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const eventId = params.eventuuid;

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
  const api = useMemo(() => {
    return axios.create({
      baseURL: API_BASE_URL,
      headers: { "Content-Type": "application/json" },
    });
  }, [API_BASE_URL]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [eventFee, setEventFee] = useState<number | null>(null);
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  const isFeeLoaded = eventFee !== null;
  const currentFee = eventFee ?? 0;

  // --- Dynamic Schema ---
  const formSchema = useMemo(() => {
    return z
      .object({
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
        utr_number: z.string().optional(),
      })
      .superRefine((data, ctx) => {
        if (currentFee > 0) {
          const utr = data.utr_number?.trim();

          if (!utr || !/^\d{12}$/.test(utr)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["utr_number"],
              message: "UTR Number must be exactly 12 digits for paid events.",
            });
          }
        }
      });
  }, [currentFee]);

  type FormData = z.infer<typeof formSchema>;

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
      utr_number: "",
    },
  });

  useEffect(() => {
    let isMounted = true;
    if (!eventId) {
      toast.error("Invalid Event Link");
      setEventFee(0);
      return;
    }

    (async () => {
      try {
        const res = await api.get(`/events/${eventId}`);
        const data = unwrap<EventResponse>(res);
        if (!isMounted) return;

        const fee = toNumberFee(data.fee ?? data.amount);
        setEventFee(fee);
        setEventName(data.name || "Event");
        setEventType(data.type || "default");
        setQrCodeUrl(data.qr_code_url || null);
      } catch (e) {
        if (!isMounted) return;
        toast.error("Failed to load event details. Please refresh.");
        setEventFee(0);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [api, eventId]);

  const resolvePublicUserId = async (
    normalizedRegNum: string,
    data: FormData,
  ) => {
    try {
      const checkRes = await api.get(
        `/public-user/reg-num/${normalizedRegNum}`,
      );
      const userData = unwrap<{ id?: number }>(checkRes);
      if (userData?.id) return userData.id;
    } catch (err: any) {
      if (err?.response?.status !== 404) throw err;
    }

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
    await api.post(`/public-user`, userPayload);

    const refetchRes = await api.get(
      `/public-user/reg-num/${normalizedRegNum}`,
    );
    const userData = unwrap<{ id?: number }>(refetchRes);
    if (!userData?.id) {
      throw new Error("Could not resolve Public User ID. Please try again.");
    }
    return userData.id;
  };

  const handleRegistration = async (data: FormData) => {
    if (!eventId) {
      toast.error("Invalid Event Link");
      return;
    }
    if (!isFeeLoaded) {
      toast.error("Please wait, loading event fee...");
      return;
    }
    if (isProcessing) return;

    setIsProcessing(true);
    const toastId = toast.loading("Processing...");

    try {
      const normalizedRegNum = data.reg_num.toUpperCase().trim();
      const publicUserId = await resolvePublicUserId(normalizedRegNum, data);

      const payload: any = {
        public_user_id: publicUserId,
        reg_num: normalizedRegNum,
      };

      if (currentFee > 0 && data.utr_number) {
        payload.utr = data.utr_number;
      }

      const regRes = await api.post(
        `/public/event/${eventId}/registration`,
        payload,
      );
      const regData = unwrap<{
        uuid?: string;
        ticket_code?: string;
        data?: { ticket_code?: string };
      }>(regRes);
      const ticketCode = regData?.ticket_code ?? regData?.data?.ticket_code;

      const isUtrPayment = currentFee > 0;

      toast.success(
        isUtrPayment
          ? "Registration submitted successfully! Awaiting UTR verification."
          : "Registration Successful!",
        { id: toastId },
      );

      navigate("/success-event-registration", {
        state: {
          eventType: eventType || "default",
          eventName: eventName || "Event",
          ticketCode,
          participantName: data.full_name,
          regNum: normalizedRegNum,
          isUtr: isUtrPayment,
          utrNumber: data.utr_number ?? null,
        },
      });
    } catch (error: any) {
      console.error("Registration Error:", error);
      let errorMessage = "Something went wrong. Please try again.";

      if (error?.response?.status === 422 && error?.response?.data?.errors) {
        const firstField = Object.keys(error.response.data.errors)[0];
        errorMessage =
          error.response.data.errors[firstField]?.[0] || errorMessage;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, { id: toastId, duration: 6000 });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans relative overflow-hidden flex flex-col items-center">
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-lolo-cyan/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-lolo-pink/5 rounded-full blur-[120px] pointer-events-none" />

      <button
        className="backdrop-blur-md z-50 absolute top-6 left-6 flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group rounded-full px-4 py-2 border border-white/5 bg-black/20"
        onClick={() => window.history.back()}
        type="button"
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

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleRegistration)}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-[#09090b] border border-white/10 p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-2xl">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Users size={20} className="text-lolo-pink" />
                    Participant Details
                  </h3>
                  <UtrPublicUserStep form={form} />
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-6">
                  <div className="bg-[#09090b]/80 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-lolo-pink/20 rounded-full blur-[60px] pointer-events-none"></div>

                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
                      <CreditCard size={20} className="text-emerald-400" />
                      Payment Details
                    </h3>

                    {currentFee > 0 && (
                      <>
                        {/* ✨ UPDATED: Dark theme QR container with proper contrast */}
                        <div className="mb-6 flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-2xl relative z-10">
                          <div className="w-48 h-48 bg-white flex items-center justify-center rounded-xl mb-5 p-2 shadow-[0_0_20px_rgba(236,72,153,0.15)]">
                            {qrCodeUrl ? (
                              <img
                                src="/qr/lolo_paatashaala_qr.png"
                                alt="Payment QR Code"
                                className="w-full h-full object-contain rounded-lg"
                              />
                            ) : (
                              <div className="text-center text-neutral-400">
                                <img
                                  src="/qr/lolo_paatashaala_qr.png"
                                  alt="Payment QR Code"
                                  className="w-full h-full object-contain rounded-lg"
                                />
                              </div>
                            )}
                          </div>
                          <p className="text-neutral-400 text-xs text-center">
                            Please pay using UPI before proceeding
                          </p>
                        </div>

                        <div className="relative z-10 mb-8">
                          <FormField
                            control={form.control}
                            name="utr_number"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[10px] font-bold uppercase text-neutral-500 tracking-wider ml-1 mb-1.5 block">
                                  UTR NUMBER (12 DIGITS) *
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter UTR after successful payment"
                                    className="bg-white/5 border border-white/10 text-white focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-lolo-pink h-12 rounded-xl placeholder:text-neutral-600 transition-colors text-sm"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-red-400 text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </>
                    )}

                    <div className="space-y-4 mb-8 relative z-10 border-t border-white/10 pt-6">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total Amount</span>
                        <span className="text-3xl text-transparent bg-clip-text bg-gradient-to-r from-lolo-pink to-purple-400 font-mono tracking-tight">
                          {isFeeLoaded ? (
                            currentFee === 0 ? (
                              "Free"
                            ) : (
                              `₹${currentFee}`
                            )
                          ) : (
                            <Loader2 className="w-6 h-6 animate-spin text-lolo-pink" />
                          )}
                        </span>
                      </div>
                    </div>

                    {!isFeeLoaded && (
                      <div className="flex items-center justify-center gap-2 p-3 mb-6 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-200 text-xs relative z-10">
                        <Loader2 className="w-3 h-3 animate-spin" /> Fetching
                        latest ticket prices...
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isProcessing || !isFeeLoaded}
                      className="w-full h-16 bg-white text-black hover:bg-lolo-pink hover:text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(236,72,153,0.4)] transition-all active:scale-[0.98] text-lg relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed z-10"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isProcessing ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />{" "}
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />{" "}
                            {currentFee > 0
                              ? "Confirm Registration"
                              : "Complete Registration"}
                          </>
                        )}
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

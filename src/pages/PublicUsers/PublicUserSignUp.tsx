import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button/button";
import { Form } from "@/components/ui/form";
import { PublicUserStep } from "./PublicUserStep";

import {
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Users,
  CreditCard,
  AlertCircle,
} from "lucide-react";

// --- Razorpay global type ---
declare global {
  interface Window {
    Razorpay?: any;
  }
}

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

type EventResponse = {
  name?: string;
  fee?: number | string | null;
  amount?: number | string | null; // if your API uses amount
};

type PublicUserDto = {
  id?: number;
  uuid?: string;
  name?: string;
  email?: string;
  phone_no?: string;
  reg_num?: string;
};

type CreateRegistrationResponse = {
  uuid?: string;
  data?: { uuid?: string };
};

type CreateOrderResponse = {
  order_id: string;
  amount: number; // paise
  currency: string;
  key: string;
  public_registration_uuid?: string;
  payer_name?: string;
  access_token: string;
  event_name?: string;
  payment_uuid?: string; // optional if your backend returns it
};

async function loadRazorpayScript(): Promise<boolean> {
  if (window.Razorpay) return true;

  return await new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );
    if (existing) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

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

export const PublicUserSignUp: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();

  const eventId = params.eventuuid; // your route param

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

  const api = useMemo(() => {
    return axios.create({
      baseURL: API_BASE_URL,
      headers: { "Content-Type": "application/json" },
    });
  }, [API_BASE_URL]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [eventFee, setEventFee] = useState<number | null>(null);
  const [eventName, setEventName] = useState<string>("");
  // const [paymentAccessToken, setPaymentAccessToken] = useState<string | null>(
  //   null,
  // );

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

  const isFeeLoaded = eventFee !== null;
  const currentFee = eventFee ?? 0;

  // --- Fetch event details ---
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

  // --- Helpers: user resolve/create ---
  const resolvePublicUserId = async (
    normalizedRegNum: string,
    data: FormData,
  ) => {
    // 1) Try fetch existing
    try {
      const checkRes = await api.get(
        `/public-user/reg-num/${normalizedRegNum}`,
      );
      const userData = unwrap<PublicUserDto>(checkRes);

      if (userData?.id) return userData.id;
    } catch (err: any) {
      // ignore 404; throw others
      if (err?.response?.status !== 404) throw err;
    }

    // 2) Create user
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

    // 3) Re-fetch to get numeric id (avoid sending uuid where integer expected)
    const refetchRes = await api.get(
      `/public-user/reg-num/${normalizedRegNum}`,
    );
    const userData = unwrap<PublicUserDto>(refetchRes);

    if (!userData?.id) {
      throw new Error("Could not resolve Public User ID. Please try again.");
    }

    return userData.id;
  };

  // --- Step: create registration ---
  const createPublicRegistration = async (
    publicUserId: number,
    normalizedRegNum: string,
  ) => {
    if (!eventId) throw new Error("Event ID missing");

    const payload = {
      public_user_id: publicUserId,
      reg_num: normalizedRegNum,
    };

    const regRes = await api.post<CreateRegistrationResponse>(
      `/public/event/${eventId}/registration`,
      payload,
    );

    const regData = unwrap<CreateRegistrationResponse>(regRes);

    const uuid = regData?.uuid ?? regData?.data?.uuid;
    if (!uuid) {
      throw new Error("Registration created but UUID not returned by server.");
    }

    return uuid;
  };

  // --- Step: create order (backend should also store pending order/payment row) ---
  const createRazorpayOrder = async (publicRegistrationUuid: string) => {
    const res = await api.post<CreateOrderResponse>(`/payment/create/order`, {
      public_registration_uuid: publicRegistrationUuid,
    });

    const order = unwrap<CreateOrderResponse>(res);

    if (!order.access_token)
      throw new Error("access_token missing from backend");
    sessionStorage.setItem(`rp_token_${order.order_id}`, order.access_token);

    if (!order?.order_id)
      throw new Error("Order ID missing from create-order response.");
    if (!order?.key)
      throw new Error("Razorpay key missing from backend response.");
    if (!order?.amount || order.amount < 100) {
      throw new Error("Order amount invalid (must be at least 100 paise).");
    }

    return order;
  };

  // --- Step: open checkout + confirm payment ---
  const openRazorpayCheckout = async (opts: {
    order: CreateOrderResponse;
    publicRegistrationUuid: string;
    prefill: { name: string; email: string; contact: string };
  }) => {
    const ok = await loadRazorpayScript();
    if (!ok) throw new Error("Failed to load Razorpay checkout script.");

    const { order, publicRegistrationUuid, prefill } = opts;

    const token = sessionStorage.getItem(`rp_token_${order.order_id}`);
    if (!token) throw new Error("Payment token missing. Please retry payment.");

    return await new Promise<void>((resolve, reject) => {
      const rzp = new window.Razorpay({
        key: order.key,
        amount: order.amount, // paise
        currency: order.currency,
        name: order.event_name || eventName || "Event",
        order_id: order.order_id, // IMPORTANT for signature + order binding
        prefill,
        config: {
          display: {
            // Put UPI first in the list
            sequence: ["upi", "card", "netbanking"],
            // Keep default methods visible (don’t replace everything with custom blocks)
            preferences: { show_default_blocks: true },
          },
        },
        handler: async (response: any) => {
          try {
            // Send success payload to backend for signature verification + mark SUCCESS.
            await api.post(`/payment/store/payment`, {
              public_registration_uuid: publicRegistrationUuid,
              razorpay_order_id: order.order_id,
              razorpay_payment_id: response?.razorpay_payment_id,
              razorpay_signature: response?.razorpay_signature,
              gateway_response: response, // optional for logging
              access_token: token,
            });

            resolve();
          } catch (e) {
            reject(e);
          }
        },
      });

      rzp.on("payment.failed", (resp: any) => {
        reject(
          new Error(
            resp?.error?.description ||
              resp?.error?.reason ||
              "Payment failed. Please try again.",
          ),
        );
      });

      rzp.open();
    });
  };

  // --- Main action ---
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

      // A) Resolve user
      const publicUserId = await resolvePublicUserId(normalizedRegNum, data);

      // B) Create registration
      const publicRegistrationUuid = await createPublicRegistration(
        publicUserId,
        normalizedRegNum,
      );

      // C) If free event -> finish
      if (currentFee <= 0) {
        toast.success("Registration Successful!", { id: toastId });
        navigate("/success-event-registration", {
          state: { eventType: "default", eventName: eventName || "Event" },
        });
        return;
      }

      // D) Create Razorpay order (and backend stores order/payment row as pending)
      const order = await createRazorpayOrder(publicRegistrationUuid);

      // E) Open Razorpay + confirm success with backend
      await openRazorpayCheckout({
        order,
        publicRegistrationUuid,
        prefill: {
          name: data.full_name,
          email: data.email,
          contact: data.phone_no,
        },
      });

      toast.success("Payment successful & registration confirmed!", {
        id: toastId,
      });
      navigate("/success-event-registration", {
        state: { eventType: "default", eventName: eventName || "Event" },
      });
    } catch (error: any) {
      console.error("Registration/Payment Error:", error);

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleRegistration)}
                className="space-y-8"
              >
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
                  type="submit"
                  disabled={isProcessing || !isFeeLoaded}
                  className="w-full h-16 ..."
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
                </Button>

                <p className="text-[10px] text-neutral-500 text-center mt-6 flex items-center justify-center gap-1.5">
                  <AlertCircle size={10} />
                  You will be registered immediately (payment required only for
                  paid events).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

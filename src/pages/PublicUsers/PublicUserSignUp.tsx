import React, { useState} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button/button";
import { Form } from "@/components/ui/form";
import {
  ArrowLeft,
  Loader2,
  Search,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { PublicUserStep } from "./PublicUserStep";
// import {
//   Modal,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   useDisclosure,
// } from "@heroui/react";
import { Input } from "@/components/ui/input";

// --- Types for Razorpay ---
interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: string;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

// --- Schemas ---
const checkSchema = z.object({
  reg_num_check: z
    .string()
    .trim()
    .min(10, "Registration number must be at least 10 digits")
    .max(10, "Registration number must not be greater than 10 digits"),
});

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

// --- Utility: Load Script ---
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-sdk")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const PublicUserSignUp: React.FC = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [step, setStep] = useState<"check" | "register">("check");
  const [isProcessing, setIsProcessing] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  // const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // useEffect(() => {
  //   const hasSeenInfo = sessionStorage.getItem("hasSeenRegistrationInfo");
  //   if (!hasSeenInfo) {
  //     onOpen();
  //     sessionStorage.setItem("hasSeenRegistrationInfo", "true");
  //   }
  // }, [onOpen]);

  const checkForm = useForm({
    resolver: zodResolver(checkSchema),
    defaultValues: { reg_num_check: "" },
  });

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

  // --- Core Payment Logic ---
  const handlePayment = async (userData: {
    reg_num: string;
    name: string;
    email: string;
    phone_no: string;
  }) => {
    setIsProcessing(true);
    const toastId = toast.loading("Initializing secure payment...");

    try {
      // 1. Load SDK
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error("Razorpay SDK failed to load. Check your connection.");
      }

      // 2. Create Order on Backend
      // The backend should return { id: 'order_xxx', amount: 50000, key: 'rzp_test_xxx' }
      const orderRes = await axios.post(
        `${API_BASE_URL}/payment/create-order/`,
        {
          reg_num: userData.reg_num,
          event_id: eventId,
        },
      );

      const { id: order_id, amount, key, currency } = orderRes.data;

      // 3. Configure Razorpay Options
      const options: RazorpayOptions = {
        key: key,
        amount: amount,
        currency: currency || "INR",
        name: "SRKR LOLO",
        description: "Event Registration Fee",
        order_id: order_id,
        prefill: {
          name: userData.name,
          email: userData.email,
          contact: userData.phone_no,
        },
        theme: {
          color: "#ec4899", // Matches lolo-pink
        },
        handler: async (response: RazorpayResponse) => {
          // 4. Verify Payment on Backend
          try {
            toast.loading("Verifying payment...", {
              id: toastId,
              duration: 5000,
            });

            const verifyRes = await axios.post(
              `${API_BASE_URL}/verify-payment`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                reg_num: userData.reg_num,
              },
            );

            if (verifyRes.data.success) {
              toast.success("Registration & Payment Successful!", {
                id: toastId,
              });
              setTimeout(() => navigate("/success"), 1500); // Or wherever you want to go
            } else {
              throw new Error("Payment verification failed on server.");
            }
          } catch (verifyError) {
            console.error("Verification Error:", verifyError);
            toast.error(
              "Payment verification failed. Please contact support.",
              { id: toastId, duration: 5000 },
            );
          }
        },
      };

      // 5. Open Modal
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      // Dismiss the "Initializing" toast once modal opens (optional, but cleaner)
      toast.dismiss(toastId);
    } catch (error: any) {
      console.error("Payment Init Error:", error);
      toast.error(error.message || "Could not initiate payment.", {
        id: toastId,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // --- Step 1: Check User ---
  const handleCheck = async (data: { reg_num_check: string }) => {
    setIsProcessing(true);
    const toastId = toast.loading("Checking registration number...");

    try {
      const response = await axios.get(
        `${API_BASE_URL}/public-user/reg-num/${data.reg_num_check}`,
      );

      if (response.status === 200) {
        toast.success("User Found! Proceeding to payment...", { id: toastId });
        // Proceed immediately to payment with fetched user data
        await handlePayment(response.data);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        toast.dismiss(toastId);
        toast.info("New user detected. Please register details.");
        form.setValue("reg_num", data.reg_num_check);
        setStep("register");
      } else {
        toast.error("Error checking user. Please try again.", { id: toastId });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // --- Step 2: Register User ---
  const handleSubmit = async (data: FormData) => {
    setIsProcessing(true);
    const toastId = toast.loading("Saving registration details...");

    try {
      const payload = {
        reg_num: data.reg_num,
        name: data.full_name,
        email: data.email,
        gender: data.gender,
        year: data.year,
        branch: data.branch,
        phone_no: data.phone_no,
        college_hostel_status: data.college_hostel_status ? 1 : 0,
      };

      const response = await axios.post(`${API_BASE_URL}/public-user`, payload);

      if (response.status === 200 || response.status === 201) {
        toast.success("Details saved! Proceeding to payment...", {
          id: toastId,
          duration: 3000,
        });

        // Trigger payment immediately after successful registration
        await handlePayment({
          reg_num: data.reg_num,
          name: data.full_name,
          email: data.email,
          phone_no: data.phone_no,
        });
      }
    } catch (error: any) {
      let errorMessage = "Registration failed.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error("Registration Failed", {
        id: toastId,
        description: errorMessage,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-lolo-pink/30 selection:text-white relative overflow-hidden flex flex-col items-center">
      {/* Background Blobs */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-lolo-cyan/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-lolo-pink/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Back Button */}
      <button
        className="z-50 absolute sm:fixed top-6 left-6 flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group"
        onClick={() => window.history.back()}
      >
        <div className="p-2.5 rounded-full bg-white/5 group-hover:bg-white/10 border border-white/5 transition-all">
          <ArrowLeft size={18} />
        </div>
        <span className="hidden sm:inline font-bold text-sm">
          Back to Events
        </span>
      </button>

      <div className="relative z-10 w-full max-w-4xl px-4 pt-24 pb-12">
        <div className="text-center space-y-3 mb-12 flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tight text-white">
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-purple-400 via-white to-purple-400 bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto]">
                Event
              </span>
            </span>{" "}
            <span className="bg-gradient-to-r from-lolo-pink via-white to-lolo-pink bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto]">
              Registration
            </span>
          </h1>
          {/* <div className="h-1 w-24 bg-lolo-pink mx-auto rounded-full" /> */}
        </div>

        <div className="bg-[#000000] backdrop-blur-xl border border-white/5 p-6 md:p-12 shadow-2xl relative overflow-hidden rounded-3xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-lolo-pink/5 rounded-full blur-[80px] pointer-events-none"></div>

          {step === "check" ? (
            <div className="max-w-md mx-auto relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-3">
                  Already Registered?
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Enter your registration number to proceed to payment, or we'll
                  help you register if you're new.
                </p>
              </div>

              <div className="space-y-6">
                <div className="relative items-center">
                  <Input
                    placeholder="e.g., 2X19CS1234"
                    className="bg-white/5 border border-white/10 text-white focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-lolo-pink h-16 rounded-full placeholder:text-neutral-600 transition-colors pl-10 sm:pl-12 text-lg font-medium"
                    {...checkForm.register("reg_num_check")}
                    disabled={isProcessing}
                    onChange={(e) =>
                      checkForm.setValue("reg_num_check", e.target.value)
                    }
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4 sm:w-5 h-5" />
                </div>
                {checkForm.formState.errors.reg_num_check && (
                  <p className="text-red-400 text-sm text-center">
                    {checkForm.formState.errors.reg_num_check.message}
                  </p>
                )}

                <Button
                  onClick={checkForm.handleSubmit(handleCheck)}
                  disabled={isProcessing}
                  className="w-full h-14 bg-white text-black hover:bg-lolo-pink hover:text-white font-bold rounded-full shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all active:scale-[0.98] text-base"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      Check Status <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-10 relative z-10 animate-in fade-in slide-in-from-right-8 duration-500"
              >
                <div className="flex items-center mb-6">
                  <button
                    type="button"
                    onClick={() => setStep("check")}
                    disabled={isProcessing}
                    className="flex items-center text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Change Reg. Number
                  </button>
                </div>

                <PublicUserStep form={form} />

                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full h-14 bg-white text-black hover:bg-lolo-pink hover:text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all active:scale-[0.98] text-base"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Saving & Initializing Payment...
                    </>
                  ) : (
                    <>
                      Register & Pay <CheckCircle2 className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          )}
        </div>
      </div>

      {/* <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        size="md"
        classNames={{
          base: "bg-[#09090b] text-white sm:rounded-3xl shadow-2xl border-0 ring-1 ring-white/5",
          header: "border-b border-white/5 p-6 md:p-8",
          body: "p-6 md:p-8",
          closeButton:
            "bg-white/5 hover:bg-white/10 active:bg-white/20 text-white/50 hover:text-white top-4 right-4",
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-2">
                <span className="text-2xl font-bold">Registration Info</span>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4 text-sm text-neutral-300">
                  <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                    <p className="leading-relaxed">
                      <span className="text-lolo-pink font-bold block mb-1">
                        1. Payment
                      </span>{" "}
                      You will be prompted to pay via Razorpay immediately after
                      verification or registration.
                    </p>
                  </div>
                  <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                    <p className="leading-relaxed">
                      <span className="text-lolo-pink font-bold block mb-1">
                        2. Data Retention
                      </span>{" "}
                      User data is deleted after{" "}
                      <strong className="text-lolo-pink">30 days</strong> if no
                      payment is made.
                    </p>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal> */}
    </div>
  );
};

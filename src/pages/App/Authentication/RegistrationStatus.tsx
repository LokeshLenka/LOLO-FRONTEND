import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Loader2,
  UserCheck,
  Users,
  ShieldCheck,
  AlertCircle,
  Clock,
  ArrowRight,
  Search,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";

// --- Types ---
interface StatusResponse {
  stage:
    | "rejected"
    | "approved"
    | "pending_assignment"
    | "pending_ebm"
    | "ebm_approved_pending_mh_assignment"
    | "pending_membership_head"
    | "finalizing";
  remarks?: string;
}

const WORKFLOW_STEPS = [
  {
    id: "submitted",
    label: "Application Received",
    description: "Your details have been recorded.",
    icon: Clock,
    matches: ["pending_assignment"],
  },
  {
    id: "ebm_review",
    label: "EBM Review",
    description: "Executive Board Member verification.",
    icon: UserCheck,
    matches: ["pending_ebm"],
  },
  {
    id: "head_review",
    label: "Membership Head Review",
    description: "Final administrative approval.",
    icon: Users,
    matches: ["ebm_approved_pending_mh_assignment", "pending_membership_head"],
  },
  {
    id: "approved",
    label: "Account Activated",
    description: "Login credentials generated.", // Static description
    icon: ShieldCheck,
    matches: ["approved", "finalizing"],
  },
];

export default function RegistrationStatus() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState<StatusResponse | null>(null);
  const [serverMessage, setServerMessage] = useState("");
  const [error, setError] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const checkStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");
    setStatusData(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/registration-status`, {
        params: { email },
      });

      if (response.data.status === "success") {
        setStatusData(response.data.data);
        setServerMessage(response.data.message);
        toast.success("Status retrieved successfully");
      }
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 404) {
        setError("No registration found for this email address.");
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to fetch status. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (stepMatches: string[]) => {
    if (!statusData) return "pending";
    if (statusData.stage === "rejected") return "rejected";

    const currentStageIndex = WORKFLOW_STEPS.findIndex((step) =>
      step.matches.includes(statusData.stage),
    );
    const stepIndex = WORKFLOW_STEPS.findIndex(
      (step) => step.matches === stepMatches,
    );

    if (stepIndex < currentStageIndex) return "completed";
    if (stepIndex === currentStageIndex) return "current";
    return "pending";
  };

  const currentStageIndex = statusData
    ? WORKFLOW_STEPS.findIndex((step) =>
        step.matches.includes(statusData.stage),
      )
    : 0;

  const activeIndex =
    statusData?.stage === "rejected"
      ? 0
      : currentStageIndex === -1
        ? 0
        : currentStageIndex;

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-lolo-pink/30 selection:text-white flex flex-col items-center p-4 relative overflow-hidden pt-24 pb-12">
      {/* Background Blobs */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-lolo-cyan/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-lolo-pink/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="z-10 w-full max-w-2xl relative">
        {/* Header Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12 mt-0 sm:mt-10"
        >
          <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tight text-white">
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-purple-400 via-white to-purple-400 bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto]">
                Check
              </span>
            </span>
            <span className="mx-3 text-lolo-pink">&</span>
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-lolo-pink via-white to-lolo-pink bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto]">
                Status
              </span>
            </span>
          </h1>
          <p className="text-neutral-400 text-lg max-w-lg mx-auto leading-relaxed">
            Enter your registered email to track your approval progress in
            real-time.
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 md:p-10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-lolo-cyan/5 rounded-full blur-[80px] pointer-events-none"></div>

          <form
            onSubmit={checkStatus}
            className="flex flex-col sm:flex-row gap-4 mb-10 relative z-10"
          >
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5" />
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 pl-12 bg-white/5 border-white/10 text-white focus-visible:ring-lolo-pink/50 focus-visible:border-lolo-pink rounded-2xl transition-all placeholder:text-neutral-600 text-base"
                required
              />
              {email && (
                <button
                  type="button"
                  onClick={() => setEmail("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="h-14 px-8 bg-white text-black hover:bg-lolo-pink hover:text-white font-bold rounded-2xl min-w-[140px] shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" /> Checking
                </>
              ) : (
                "Track Status"
              )}
            </Button>
          </form>

          {/* Error State */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-8"
              >
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 flex items-start gap-4 text-red-400">
                  <AlertCircle size={22} className="shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wide mb-1">
                      Error
                    </h4>
                    <span className="text-sm font-medium text-red-300/80">
                      {error}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Rejected State */}
          <AnimatePresence>
            {statusData?.stage === "rejected" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/[0.05] border border-red-500/10 rounded-3xl p-8 text-center space-y-6 mb-6"
              >
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                  <AlertCircle size={40} className="text-red-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Application Rejected
                  </h3>
                  <p className="text-neutral-400 text-sm max-w-xs mx-auto">
                    Unfortunately, your application was not approved at this
                    time.
                  </p>
                </div>
                {statusData.remarks && (
                  <div className="bg-black/40 rounded-2xl p-6 text-left border border-white/5 mt-4">
                    <p className="text-xs font-bold text-red-400 uppercase mb-3 tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>{" "}
                      Reason for Rejection
                    </p>
                    <p className="text-neutral-300 text-sm leading-relaxed whitespace-pre-wrap break-all font-mono bg-white/5 p-3 rounded-lg border border-white/5">
                      {statusData.remarks}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success/Progress State */}
          <AnimatePresence>
            {statusData && statusData.stage !== "rejected" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10"
              >
                <div className="text-center mb-8 pt-6 border-t border-white/5">
                  <div className="inline-block px-4 py-1.5 rounded-full bg-lolo-pink/10 border border-lolo-pink/20 text-lolo-pink text-[10px] font-bold mb-4 uppercase tracking-widest shadow-[0_0_15px_rgba(236,72,153,0.2)]">
                    Current Status
                  </div>
                  <h2 className="text-2xl font-bold text-white leading-snug">
                    {serverMessage}
                  </h2>
                </div>

                {/* Timeline */}
                <div className="relative pl-4 md:pl-6 space-y-0">
                  <div className="absolute left-[35px] md:left-[51px] top-5 bottom-12 w-[2px] bg-white/5 z-0 rounded-full" />

                  <motion.div
                    initial={{ height: 0 }}
                    animate={{
                      height: `${
                        (activeIndex / (WORKFLOW_STEPS.length - 1)) * 100
                      }%`,
                    }}
                    transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
                    className="absolute left-[35px] md:left-[51px] top-5 w-[2px] bg-gradient-to-b from-lolo-pink to-purple-500 z-0 rounded-full origin-top"
                    style={{
                      maxHeight: "calc(100% - 3.5rem)",
                    }}
                  />

                  {WORKFLOW_STEPS.map((step, index) => {
                    const status = getStepStatus(step.matches);
                    const isCompleted = status === "completed";
                    const isCurrent = status === "current";

                    // Logic to check if this is the final "Approved" step
                    const isFinalStep = step.id === "approved";
                    // If it is the final step AND it is current, we consider it "Done" not "Processing"
                    const showProcessing = isCurrent && !isFinalStep;

                    const activeColorClass =
                      "bg-lolo-pink border-lolo-pink text-white shadow-[0_0_20px_rgba(236,72,153,0.5)]";
                    const currentColorClass =
                      "bg-[#09090b] border-lolo-pink text-lolo-pink shadow-[0_0_25px_rgba(236,72,153,0.3)] scale-110 ring-4 ring-lolo-pink/10";
                    const inactiveColorClass =
                      "bg-[#09090b] border-white/10 text-neutral-600";

                    return (
                      <motion.div
                        key={step.id}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative flex gap-4 md:gap-8 pb-12 last:pb-0 group ${
                          status === "pending" ? "opacity-40 grayscale" : ""
                        }`}
                      >
                        {/* Icon Bubble */}
                        <div
                          className={`
                          relative z-10 w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center border-2 transition-all duration-500 shrink-0
                          ${
                            isCompleted
                              ? activeColorClass
                              : isCurrent
                                ? currentColorClass
                                : inactiveColorClass
                          }
                        `}
                        >
                          {isCompleted ? (
                            <CheckCircle2 size={22} strokeWidth={3} />
                          ) : (
                            <step.icon size={22} />
                          )}
                        </div>

                        {/* Text Content */}
                        <div
                          className={`pt-1 md:pt-2 transition-all duration-300 ${
                            isCurrent ? "opacity-100 translate-x-1" : ""
                          }`}
                        >
                          <h3
                            className={`font-bold text-base md:text-xl mb-1.5 ${
                              isCurrent ? "text-lolo-pink" : "text-white"
                            }`}
                          >
                            {step.label}
                          </h3>
                          <p className="text-sm text-neutral-400 leading-relaxed max-w-xs font-medium">
                            {step.description}
                          </p>

                          {/* Show "Processing" ONLY if it's current AND NOT the final approved step */}
                          {showProcessing && (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-md bg-lolo-pink/10 text-lolo-pink text-[10px] font-bold uppercase tracking-wide border border-lolo-pink/20"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-lolo-pink animate-pulse" />
                              Processing
                            </motion.span>
                          )}

                          {/* Show Specific Success Msg for Final Step if Active */}
                          {isFinalStep && isCurrent && (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-xs font-bold text-purple-400 mt-2 tracking-wide"
                            >
                              Credentials have been emailed to you.
                            </motion.p>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Final Success Card */}
                {(statusData.stage === "approved" ||
                  statusData.stage === "finalizing") && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-10 p-8 bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-[2rem] text-center"
                  >
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                      <ShieldCheck size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Account Activated!
                    </h3>
                    <p className="text-emerald-400 font-medium mb-6 text-sm">
                      You are all set! Check your email for login credentials.
                    </p>
                    <Link to="/login">
                      <Button className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl px-10 py-4 h-auto gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] text-base transition-all hover:scale-105">
                        Go to Login <ArrowRight size={18} />
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Back Button */}
        <div className="mt-12 text-center pb-8">
          <Link
            to="/"
            className="text-neutral-500 hover:text-white text-sm font-bold transition-colors uppercase tracking-widest hover:underline decoration-lolo-pink underline-offset-4"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

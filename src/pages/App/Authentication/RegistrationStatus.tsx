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
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";

// --- Types based on Backend Response ---
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
    description: "Login credentials generated.",
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
            "Failed to fetch status. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper to determine step state (completed, current, pending)
  const getStepStatus = (stepMatches: string[]) => {
    if (!statusData) return "pending";
    if (statusData.stage === "rejected") return "rejected";

    const currentStageIndex = WORKFLOW_STEPS.findIndex((step) =>
      step.matches.includes(statusData.stage)
    );
    const stepIndex = WORKFLOW_STEPS.findIndex(
      (step) => step.matches === stepMatches
    );

    if (stepIndex < currentStageIndex) return "completed";
    if (stepIndex === currentStageIndex) return "current";
    return "pending";
  };

  // Calculate active index for the progress line animation
  const currentStageIndex = statusData
    ? WORKFLOW_STEPS.findIndex((step) =>
        step.matches.includes(statusData.stage)
      )
    : 0;

  // Handle cases where stage matches nothing or is rejected
  const activeIndex =
    statusData?.stage === "rejected"
      ? 0
      : currentStageIndex === -1
      ? 0
      : currentStageIndex;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#03a1b0] selection:text-white flex flex-col items-center p-2 sm:p-4 relative overflow-hidden pt-24 pb-12">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(3,161,176,0.08),transparent_70%)] blur-3xl"></div>
      </div>

      <div className="z-10 w-full max-w-2xl relative">
        {/* Header Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-10 mt-0 sm:mt-20"
        >
          <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tight text-white">
            <span className="relative inline-block">
              <span
                className="absolute inset-0 bg-gradient-to-r from-[#03a1b0] via-purple-500 to-[#03a1b0] bg-clip-text text-transparent blur-lg animate-text-shimmer opacity-50"
                aria-hidden="true"
              >
                Check
              </span>
              <span className="relative bg-gradient-to-r from-[#03a1b0] via-white to-[#03a1b0] bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto]">
                Check
              </span>
            </span>
            <span className="mx-3 text-[#03a1b0]">&</span>
            <span className="relative inline-block">
              <span
                className="absolute inset-0 bg-gradient-to-r from-[#03a1b0] via-purple-500 to-[#03a1b0] bg-clip-text text-transparent blur-lg animate-text-shimmer opacity-50"
                aria-hidden="true"
              >
                Status
              </span>
              <span className="relative bg-gradient-to-r from-[#03a1b0] via-white to-[#03a1b0] bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto]">
                Status
              </span>
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Enter your registered email to track your approval progress.
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-[#09090b]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-4 md:p-8 shadow-2xl shadow-[#03a1b0]/5"
        >
          <form
            onSubmit={checkStatus}
            className="flex flex-col sm:flex-row gap-4 mb-8"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 pl-12 bg-white/5 border-white/10 text-white focus-visible:ring-[#03a1b0]/50 focus-visible:border-[#03a1b0] rounded-xl transition-all placeholder:text-gray-600"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="h-12 px-8 bg-[#03a1b0] hover:bg-[#028a96] text-white font-bold rounded-xl min-w-[140px] shadow-lg shadow-[#03a1b0]/20 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" /> Checking
                </>
              ) : (
                "Track"
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
                className="overflow-hidden mb-6"
              >
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 text-red-400">
                  <AlertCircle size={20} className="shrink-0 mt-0.5" />
                  <span className="text-sm font-medium">{error}</span>
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
                className="bg-red-900/10 border border-red-500/20 rounded-2xl p-2 sm:p-8 text-center space-y-4 mb-6"
              >
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
                  <AlertCircle size={32} className="text-red-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Application Rejected
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Unfortunately, your application was not approved.
                  </p>
                </div>
                {statusData.remarks && (
                  <div className="bg-black/40 rounded-xl p-4 text-left border border-white/5 mt-4">
                    <p className="text-xs font-bold text-red-400 uppercase mb-2 tracking-wider">
                      Reason / Remarks
                    </p>
                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap break-all font-mono">
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
                className="space-y-8"
              >
                <div className="text-center mb-8 pt-4 border-t border-white/5">
                  <div className="inline-block px-4 py-1 rounded-full bg-[#03a1b0]/10 border border-[#03a1b0]/20 text-[#03a1b0] text-xs font-bold mb-3 uppercase tracking-wider">
                    Current Status
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white leading-snug">
                    {serverMessage}
                  </h2>
                </div>

                {/* --- NEW TIMELINE IMPLEMENTATION --- */}
                <div className="relative pl-4 md:pl-6 space-y-0">
                  {/* 1. Background Guide Line (Gray) */}
                  {/* Centered relative to icon width. Mobile icon: 40px (center 20px). Desktop icon: 56px (center 28px). */}
                  {/* Offset = Padding Left + Center - 1px (half line width) */}
                  {/* Mobile: 16px + 20px - 1px = 35px. Desktop: 24px + 28px - 1px = 51px */}
                  <div className="absolute left-[35px] md:left-[51px] top-5 bottom-12 w-[2px] bg-white/5 z-0 rounded-full" />

                  {/* 2. Animated Progress Line (Cyan) */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{
                      height: `${
                        (activeIndex / (WORKFLOW_STEPS.length - 1)) * 100
                      }%`,
                    }}
                    transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
                    className="absolute left-[35px] md:left-[51px] top-5 w-[2px] bg-gradient-to-b from-[#03a1b0] to-[#03a1b0]/80 z-0 rounded-full origin-top"
                    style={{
                      // Limit height to avoid overshooting the last icon
                      maxHeight: "calc(100% - 3.5rem)",
                    }}
                  />

                  {WORKFLOW_STEPS.map((step, index) => {
                    const status = getStepStatus(step.matches);
                    const isCompleted = status === "completed";
                    const isCurrent = status === "current";

                    return (
                      <motion.div
                        key={step.id}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative flex gap-4 md:gap-6 pb-10 last:pb-0 group ${
                          status === "pending" ? "opacity-50 grayscale" : ""
                        }`}
                      >
                        {/* Icon Bubble */}
                        <div
                          className={`
                          relative z-10 w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center border-2 transition-all duration-500 shrink-0
                          ${
                            isCompleted
                              ? "bg-[#03a1b0] border-[#03a1b0] text-white shadow-[0_0_15px_rgba(3,161,176,0.4)]"
                              : isCurrent
                              ? "bg-[#09090b] border-[#03a1b0] text-[#03a1b0] shadow-[0_0_20px_rgba(3,161,176,0.2)] scale-110 ring-4 ring-[#03a1b0]/10"
                              : "bg-[#09090b] border-white/10 text-gray-600"
                          }
                        `}
                        >
                          {isCompleted ? (
                            <CheckCircle2 size={20} strokeWidth={3} />
                          ) : (
                            <step.icon size={20} />
                          )}
                        </div>

                        {/* Text Content */}
                        <div
                          className={`pt-1 md:pt-2 transition-all duration-300 ${
                            isCurrent ? "opacity-100 translate-x-1" : ""
                          }`}
                        >
                          <h3
                            className={`font-bold text-base md:text-lg mb-1 ${
                              isCurrent ? "text-[#03a1b0]" : "text-white"
                            }`}
                          >
                            {step.label}
                          </h3>
                          <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                            {step.description}
                          </p>
                          {isCurrent && (
                            <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-md bg-[#03a1b0]/10 text-[#03a1b0] text-[10px] font-bold uppercase tracking-wide"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-[#03a1b0] animate-pulse" />
                              Processing
                            </motion.span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Final Success Message */}
                {(statusData.stage === "approved" ||
                  statusData.stage === "finalizing") && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-6 bg-green-500/5 border border-green-500/20 rounded-2xl text-center"
                  >
                    <p className="text-green-400 font-medium mb-4">
                      You are all set! Check your email for login credentials.
                    </p>
                    <Link to="/login">
                      <Button className="bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl px-8 gap-2 shadow-lg shadow-green-500/20">
                        Go to Login <ArrowRight size={16} />
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-gray-500 hover:text-white text-sm font-medium transition-colors bottom-0"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

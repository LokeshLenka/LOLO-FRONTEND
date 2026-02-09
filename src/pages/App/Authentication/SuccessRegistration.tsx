// src/pages/SuccessRegistration.tsx
import { Link, useLocation, Navigate } from "react-router-dom";
import {
  CheckCircle2,
  ArrowRight,
  Clock,
  ShieldCheck,
  Info,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button/button";
import { motion } from "framer-motion";

export default function SuccessRegistration() {
  const location = useLocation();
  // Retrieve data passed from the signup form
  const state = location.state as { email: string; status: string } | null;

  // If someone tries to access this page directly without registering, redirect them
  if (!state) {
    return <Navigate to="/signup" replace />;
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-lolo-pink/30 selection:text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-lolo-pink/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-4xl w-full bg-white/[0.02] backdrop-blur-2xl border border-white/5 rounded-[2.5rem] py-10 px-6 sm:px-12 text-center shadow-2xl overflow-hidden"
      >
        {/* Subtle Pink Glow inside card */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-lolo-pink/5 rounded-full blur-[80px] pointer-events-none"></div>

        {/* Success Icon */}
        <div className="w-20 h-20 md:w-24 md:h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 border border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <CheckCircle2
              className="w-10 h-10 md:w-12 md:h-12 text-green-500"
              strokeWidth={2.5}
            />
          </motion.div>
        </div>

        <h1 className="text-3xl md:text-5xl font-black mb-4 text-white tracking-tight">
          Application Received!
        </h1>

        <p className="text-neutral-400 mb-8 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
          Your registration has been submitted successfully. We've sent an email
          to <span className="text-white font-bold">{state.email}</span>.
        </p>

        {/* Approval Workflow Info Box */}
        <div className="bg-lolo-pink/[0.03] border border-lolo-pink/20 rounded-2xl py-6 px-4 sm:px-8 mb-8 text-left relative overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-1 bg-lolo-pink/50"></div>
          <div className="flex gap-2 sm:gap-4 items-start">
            <div className="mt-0.5 p-1.5 bg-lolo-pink/10 rounded-full h-fit">
              <Info className="w-5 h-5 text-lolo-pink shrink-0" />
            </div>
            <div className="space-y-3">
              <h3 className="text-lolo-pink font-bold text-base md:text-lg uppercase tracking-wide">
                Next Steps
              </h3>
              <ul className="text-sm md:text-base text-neutral-300 space-y-3 list-disc pl-0 marker:text-lolo-pink">
                <li>
                  Please{" "}
                  <span className="text-white font-bold">
                    check your email regularly
                  </span>{" "}
                  for updates regarding your application status.
                </li>
                <li>
                  An <span className="font-bold text-white">EBM</span>{" "}
                  (Executive Board Member) will review your application soon.
                  They may contact you for further verification.
                </li>
                <li>
                  Once approved, you will receive your{" "}
                  <span className="text-white font-bold">
                    Login Credentials
                  </span>{" "}
                  via email to access the dashboard.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Status Details */}
        <div className="bg-white/[0.02] rounded-2xl p-6 mb-10 border border-white/5 text-left space-y-4">
          <div className="flex items-center gap-4 text-sm md:text-base">
            <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/10">
              <ShieldCheck size={20} className="text-blue-400" />
            </div>
            <div>
              <p className="text-neutral-500 text-xs font-bold uppercase tracking-wider mb-0.5">
                Account Email
              </p>
              <p className="font-bold text-white text-base md:text-lg">
                {state.email}
              </p>
            </div>
          </div>

          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

          <div className="flex items-center gap-4 text-sm md:text-base">
            <div className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/10">
              <Clock size={20} className="text-orange-400" />
            </div>
            <div>
              <p className="text-neutral-500 text-xs font-bold uppercase tracking-wider mb-0.5">
                Current Status
              </p>
              <p className="font-bold capitalize text-orange-300 text-base md:text-lg">
                {state.status.replace(/_/g, " ")}
              </p>
            </div>
          </div>
        </div>

        <Button
          asChild
          className="max-w-md w-full bg-white text-black hover:bg-lolo-pink hover:text-white font-bold h-14 rounded-full transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] text-base md:text-lg group"
        >
          <Link to="/">
            Back to Home{" "}
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>

        <div className="mt-6 text-sm md:text-base flex flex-col justify-center items-center gap-1.5 font-medium">
          <span className="text-neutral-500">
            Want to see what's happening?
          </span>
          <Link
            to="/events"
            className="text-lolo-pink hover:text-white font-bold hover:underline transition-colors"
          >
            Explore Events
          </Link>
        </div>

        <div className="mt-10 pt-8 border-t border-white/5">
          <p className="text-neutral-400 text-sm md:text-base mb-4 font-medium">
            Closed this window? You can track your progress anytime.
          </p>
          <Link to="/registration-status">
            <Button
              variant="outline"
              className="max-w-md w-full border-white/10 bg-white/[0.02] text-neutral-300 hover:text-white hover:border-white/20 hover:bg-white/5 gap-2 h-12 rounded-xl text-sm md:text-base font-bold transition-all"
            >
              <Search size={18} /> Check Application Status
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

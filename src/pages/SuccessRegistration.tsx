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
    <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(3,161,176,0.15),transparent_70%)] blur-3xl"></div>
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-5xl w-full bg-[#09090b]/80 backdrop-blur-2xl border border-white/10 rounded-3xl py-8 px-4 sm:px-8 text-center shadow-2xl shadow-[#03a1b0]/10"
      >
        {/* Success Icon */}
        <div className="w-16 h-16 md:w-20 md:h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 border border-green-500/20">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-green-500" />
          </motion.div>
        </div>

        {/* Updated: Increased heading size on larger screens */}
        <h1 className="text-3xl md:text-4xl font-black mb-2 md:mb-3">
          Application Received!
        </h1>

        {/* Updated: Increased paragraph size on larger screens */}
        <p className="text-gray-400 mb-6 text-sm md:text-base leading-relaxed">
          Your registration has been submitted successfully. We've sent an email
          to <span className="text-white font-medium">{state.email}</span>.
        </p>

        {/* Approval Workflow Info Box */}
        <div className="bg-[#03a1b0]/5 border border-[#03a1b0]/20 rounded-xl py-4 px-2 sm:px-4 mb-6 text-left">
          <div className="flex gap-2 sm:gap-3">
            <Info className="w-4 h-4 sm:h-5 sm:w-5 md:w-6 md:h-6 text-[#03a1b0] shrink-0 mt-0.5" />
            <div className="space-y-2">
              {/* Updated: Increased heading size on larger screens */}
              <h3 className="text-[#03a1b0] font-bold text-sm md:text-base uppercase tracking-wide">
                Next Steps
              </h3>
              {/* Updated: Increased list item size on larger screens */}
              <ul className="text-sm md:text-base text-gray-300 space-y-2 list-disc pl-0 sm:pl-4 marker:text-[#03a1b0]">
                <li>
                  Please{" "}
                  <span className="text-white font-medium">
                    check your email regularly
                  </span>{" "}
                  for updates.
                </li>
                <li>
                  An <span className="font-bold text-white">EBM</span>{" "}
                  (Executive Board Member) will review your application soon.
                  They may contact you for an online or in-person meeting.
                </li>
                <li>
                  Once approved by the EBM and Membership Head, you will receive
                  your{" "}
                  <span className="text-white font-bold">
                    Login Credentials (Username)
                  </span>{" "}
                  via email to access the dashboard.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Status Details */}
        <div className="bg-white/5 rounded-xl p-2 sm:p-4 mb-8 border border-white/5 text-left space-y-3">
          <div className="flex items-center gap-3 text-sm md:text-base">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <ShieldCheck size={16} className="text-blue-400 md:w-5 md:h-5" />
            </div>
            <div>
              <p className="text-gray-400 text-xs md:text-sm font-bold uppercase">
                Account Email
              </p>
              <p className="font-medium text-sm md:text-base">{state.email}</p>
            </div>
          </div>

          <div className="w-full h-[1px] bg-white/10"></div>

          <div className="flex items-center gap-3 text-sm md:text-base">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Clock size={16} className="text-orange-400 md:w-5 md:h-5" />
            </div>
            <div>
              <p className="text-gray-400 text-xs md:text-sm font-bold uppercase">
                Current Status
              </p>
              <p className="font-medium capitalize text-orange-300 text-sm md:text-base">
                {state.status.replace(/_/g, " ")}
              </p>
            </div>
          </div>
        </div>

        <Button
          asChild
          className="max-w-lg w-full bg-[#03a1b0] hover:bg-[#028a96] text-white font-bold h-12 md:h-14 rounded-xl transition-all shadow-lg shadow-[#03a1b0]/20 text-sm md:text-base"
        >
          <Link to="/">
            Back to Home <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </Button>

        {/* Updated: Increased text size on larger screens */}
        <div className="mt-4 text-sm md:text-base flex justify-center items-center gap-1">
          <span className="text-gray-500">Want to see what's happening?</span>
          <Link
            to="/events"
            className="text-[#03a1b0] hover:text-white font-bold hover:underline transition-colors"
          >
            Explore Events
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10">
          {/* Updated: Increased text size on larger screens */}
          <p className="text-gray-400 text-sm md:text-base mb-3">
            Closed this window? You can track your progress anytime.
          </p>
          <Link to="/registration-status">
            <Button
              variant="outline"
              className="max-w-lg w-full border-white/10 !bg-white/5 text-gray-300 hover:text-white gap-2 w-full h-11 md:h-12 text-sm md:text-base"
            >
              <Search size={16} className="md:w-5 md:h-5" /> Check Application
              Status
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

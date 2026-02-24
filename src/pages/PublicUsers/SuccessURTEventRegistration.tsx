import { Link, useLocation, Navigate } from "react-router-dom";
import {
  CheckCircle2,
  ArrowRight,
  Clock,
  ShieldCheck,
  Info,
  Ticket,
  User,
  Hash,
  Hourglass,
  Headset,
  Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button/button";
import { motion } from "framer-motion";

type SuccessState = {
  eventType?: string;
  eventName?: string;
  ticketCode?: string;
  participantName?: string;
  regNum?: string;
  isUtr?: boolean;
  utrNumber?: string | null;
};

export default function SuccessURTEventRegistration() {
  const location = useLocation();
  const state = location.state as SuccessState | null;

  if (!state) {
    return <Navigate to="/" replace />;
  }

  const {
    eventName = "Event",
    ticketCode,
    participantName,
    regNum,
    isUtr = false,
    utrNumber,
  } = state;

  return (
    <div className="min-h-screen bg-[#030303] text-neutral-200 font-sans selection:bg-lolo-pink/30 selection:text-white flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="fixed top-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-lolo-pink/5 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[30rem] bg-[#0A0A0A]/80 backdrop-blur-2xl border border-white/[0.08] rounded-[2rem] p-5 sm:p-10 text-center shadow-2xl overflow-hidden"
      >
        {/* Subtle top inner glow */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-lolo-pink/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Status Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", damping: 15 }}
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-5 border ${isUtr
            ? "bg-amber-500/10 border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.15)]"
            : "bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
            }`}
        >
          {isUtr ? (
            <Hourglass className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" strokeWidth={2} />
          ) : (
            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" strokeWidth={2} />
          )}
        </motion.div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 text-white tracking-tight">
          {isUtr ? "Verifying Payment" : "Ticket Confirmed"}
        </h1>

        <p className="text-neutral-400 mb-6 text-sm leading-relaxed max-w-[24rem] mx-auto">
          {isUtr ? (
            <>Your request for <span className="text-white font-medium">{eventName}</span> is under review.</>
          ) : (
            <>You're all set for <span className="text-white font-medium">{eventName}</span>.</>
          )}
        </p>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className={`rounded-xl p-4 mb-6 text-left border ${isUtr
            ? "bg-amber-500/[0.03] border-amber-500/10"
            : "bg-lolo-pink/[0.03] border-lolo-pink/10"
            }`}
        >
          <div className="flex gap-3 items-center">
            <div className={`p-1.5 rounded-full shrink-0 ${isUtr ? "bg-amber-500/10" : "bg-lolo-pink/10"}`}>
              <Info className={`w-4 h-4 ${isUtr ? "text-amber-400" : "text-lolo-pink"}`} />
            </div>
            <p className="text-xs sm:text-sm text-neutral-300">
              {isUtr
                ? <>Your ticket will be sent to your <span className="text-white font-medium">registered email</span> within <span className="text-white font-medium">24–48 hours</span> once payment is verified.</>
                : <>Show your <span className="text-white font-medium">Ticket Code</span> and <span className="text-white font-medium">College ID</span> at the gate.</>
              }
            </p>
          </div>
        </motion.div>

        {/* Details Grid */}
        <div className="bg-[#121214] rounded-xl mb-8 border border-white/[0.06] overflow-hidden">
          <div className="divide-y divide-white/[0.06]">

            {participantName && (
              <div className="flex items-center gap-3 p-3 sm:p-4">
                <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/10 shrink-0">
                  <User size={16} className="text-blue-400" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">Participant</p>
                  <p className="font-semibold text-white text-sm truncate">{participantName}</p>
                </div>
              </div>
            )}

            {regNum && (
              <div className="flex items-center gap-3 p-3 sm:p-4">
                <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/10 shrink-0">
                  <Hash size={16} className="text-purple-400" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">Registration No</p>
                  <p className="font-mono text-white text-sm tracking-widest">{regNum}</p>
                </div>
              </div>
            )}

            {/* ✨ UTR Number Row — only shown for UTR flow */}
            {isUtr && utrNumber && (
              <div className="flex items-center gap-3 p-3 sm:p-4">
                <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/10 shrink-0">
                  <Receipt size={16} className="text-amber-400" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">UTR Number</p>
                  <p className="font-mono text-amber-300 font-semibold text-sm tracking-widest">{utrNumber}</p>
                </div>
              </div>
            )}

            {ticketCode && (
              <div className="flex items-center gap-3 p-3 sm:p-4">
                <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/10 shrink-0">
                  <Ticket size={16} className="text-emerald-400" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">Ticket Code</p>
                  <p className="font-mono text-emerald-400 font-semibold text-sm tracking-widest">{ticketCode}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 p-3 sm:p-4">
              <div className={`p-2 rounded-lg border shrink-0 ${isUtr ? "bg-amber-500/10 border-amber-500/10" : "bg-emerald-500/10 border-emerald-500/10"
                }`}>
                {isUtr ? <Clock size={16} className="text-amber-400" /> : <ShieldCheck size={16} className="text-emerald-400" />}
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">Payment Status</p>
                <p className={`font-semibold text-sm ${isUtr ? "text-amber-400" : "text-emerald-400"}`}>
                  {isUtr ? "Under Review" : "Confirmed"}
                </p>
              </div>
            </div>

            {/* Support Link */}
            <div className="flex items-center gap-3 p-3 sm:p-4 bg-white/[0.02]">
              <div className="p-2 bg-neutral-800 rounded-lg border border-white/5 shrink-0">
                <Headset size={16} className="text-neutral-400" />
              </div>
              <div className="text-left flex-1 min-w-0 flex items-center justify-between">
                <div>
                  <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">Need Help?</p>
                  <p className="font-medium text-white text-xs sm:text-sm">Contact Support</p>
                </div>
                <a
                  href="mailto:support@lolo.com"
                  className="text-lolo-pink text-xs sm:text-sm font-semibold hover:underline"
                >
                  Email Us
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* CTA */}
        <Button
          asChild
          className="w-full bg-white text-black hover:bg-neutral-200 font-bold h-12 sm:h-14 rounded-xl transition-all text-sm sm:text-base group"
        >
          <Link to="/">
            Return to Home
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}

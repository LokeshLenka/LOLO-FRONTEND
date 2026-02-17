import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Ticket,
  Mail,
  ArrowRight,
  Music,
  Users,
  PartyPopper,
} from "lucide-react";
import { Button } from "@/components/ui/button/button";
import clsx from "clsx";

// --- Types ---
export type EventType = "public" | "music" | "club" | "default";

interface SuccessEventRegistrationProps {
  eventType?: EventType; // Optional, defaults to 'default'
  eventName?: string; // Optional, to personalize the message
}

// --- Theme Config ---
// Customize colors/icons based on event type
const themeConfig: Record<
  EventType,
  {
    gradient: string;
    icon: React.ReactNode;
    accent: string;
    bgGlow: string;
  }
> = {
  music: {
    gradient: "from-purple-500 via-pink-500 to-red-500",
    icon: <Music size={48} className="text-white" />,
    accent: "text-pink-400",
    bgGlow: "bg-pink-500/20",
  },
  club: {
    gradient: "from-blue-500 via-cyan-500 to-teal-400",
    icon: <Users size={48} className="text-white" />,
    accent: "text-cyan-400",
    bgGlow: "bg-cyan-500/20",
  },
  public: {
    gradient: "from-emerald-500 via-green-500 to-lime-400",
    icon: <PartyPopper size={48} className="text-white" />,
    accent: "text-emerald-400",
    bgGlow: "bg-emerald-500/20",
  },
  default: {
    gradient: "from-orange-500 via-amber-500 to-yellow-400",
    icon: <CheckCircle2 size={48} className="text-white" />,
    accent: "text-amber-400",
    bgGlow: "bg-amber-500/20",
  },
};

export const SuccessEventRegistration: React.FC<
  SuccessEventRegistrationProps
> = ({ eventType = "default", eventName }) => {
  const navigate = useNavigate();
  const theme = themeConfig[eventType] || themeConfig.default;

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans flex items-center justify-center relative overflow-hidden p-4">
      {/* Background Ambience */}
      <div
        className={clsx(
          "fixed top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none opacity-30",
          theme.bgGlow,
        )}
      />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none opacity-20" />

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="bg-[#09090b] border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden"
        >
          {/* Top Gradient Bar */}
          <div
            className={clsx(
              "absolute top-0 left-0 w-full h-2 bg-gradient-to-r",
              theme.gradient,
            )}
          />

          <div className="flex flex-col items-center text-center space-y-6">
            {/* Success Icon Circle */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className={clsx(
                "w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br shadow-[0_0_30px_rgba(0,0,0,0.5)]",
                theme.gradient,
              )}
            >
              {theme.icon}
            </motion.div>

            {/* Headings */}
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tight text-white">
                You're In!
              </h1>
              <p className="text-neutral-400 text-lg">
                Registration Confirmed {eventName ? `for ${eventName}` : ""}
              </p>
            </div>

            {/* Info Cards */}
            <div className="w-full space-y-3 pt-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-start gap-4 text-left"
              >
                <div className="p-2 bg-white/5 rounded-lg">
                  <Mail size={20} className={theme.accent} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    Check your Email
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    We've sent a confirmation email with your registration
                    details.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/5 border border-white/5 rounded-xl p-4 flex items-start gap-4 text-left"
              >
                <div className="p-2 bg-white/5 rounded-lg">
                  <Ticket size={20} className={theme.accent} />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    Ticket Generation
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Your official entry ticket will be generated and sent to you
                    within{" "}
                    <span className="text-white font-semibold">
                      24-48 hours
                    </span>
                    .
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="w-full pt-4"
            >
              <Button
                onClick={() => navigate("/events")}
                className="w-full h-14 bg-white text-black hover:bg-neutral-200 font-bold rounded-xl text-base shadow-lg transition-all active:scale-[0.98] group"
              >
                Explore More Events
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-neutral-600 text-xs mt-8"
        >
          Having trouble? Contact support at support@example.com
        </motion.p>
      </div>
    </div>
  );
};

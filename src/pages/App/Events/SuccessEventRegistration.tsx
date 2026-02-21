import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ArrowRight,
  Music,
  Users,
  PartyPopper,
  Download,
  Share2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button/button";
import { toast } from "sonner";
import clsx from "clsx";
import { toPng } from "html-to-image";
import QRCode from "react-qr-code"; // <-- Added QR Code import

export type EventType = "public" | "music" | "club" | "default";

const themeConfig: Record<
  EventType,
  { gradient: string; icon: React.ReactNode; accent: string; bgGlow: string }
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

export const SuccessEventRegistration: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const ticketRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const state = location.state || {};
  const {
    eventType = "default",
    eventName = "Event",
    ticketCode = "PENDING",
    participantName = "Participant",
    regNum = "N/A",
  } = state;

  const theme = themeConfig[eventType as EventType] || themeConfig.default;

  // --- Create the verification URL ---
  const verificationUrl = `${window.location.origin}/${eventType}/verify-ticket/${ticketCode}`;

  const handleDownloadTicket = async () => {
    if (!ticketRef.current) return;
    try {
      setIsDownloading(true);

      const dataUrl = await toPng(ticketRef.current, {
        backgroundColor: "#09090b",
        pixelRatio: 3,
      });

      const link = document.createElement("a");
      link.download = `${eventName.replace(/\s+/g, "_")}_Ticket.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Ticket downloaded successfully!");
    } catch (error) {
      console.error("Ticket generation failed:", error);
      toast.error("Failed to download the ticket.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShareTicket = async () => {
    const shareData = {
      title: `${eventName} Ticket`,
      text: `I just registered for ${eventName}! My Ticket ID is: ${ticketCode}.`,
      url: window.location.origin,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(`${shareData.text} \n${shareData.url}`);
      toast.success("Ticket details copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans flex flex-col items-center justify-center relative overflow-hidden p-4 pt-12 pb-24">
      <div
        className={clsx(
          "fixed top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none opacity-30",
          theme.bgGlow,
        )}
      />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none opacity-20" />

      <div className="w-full max-w-lg relative z-10 space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="bg-[#09090b] border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden"
        >
          <div
            className={clsx(
              "absolute top-0 left-0 w-full h-2 bg-gradient-to-r",
              theme.gradient,
            )}
          />

          <div className="flex flex-col items-center text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className={clsx(
                "w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br shadow-[0_0_30px_rgba(0,0,0,0.5)]",
                theme.gradient,
              )}
            >
              {theme.icon}
            </motion.div>

            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tight text-white">
                You're In!
              </h1>
              <p className="text-neutral-400 text-base">
                Registration Confirmed for{" "}
                <span className="text-white font-medium">{eventName}</span>
              </p>
            </div>

            {/* --- DIGITAL TICKET --- */}
            <div className="w-full mt-4">
              <div
                ref={ticketRef}
                className="relative bg-gradient-to-br from-[#121215] to-[#0a0a0c] border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden"
              >
                <div className="absolute top-1/2 -left-3 w-6 h-6 bg-[#09090b] rounded-full transform -translate-y-1/2 border-r border-white/10 shadow-inner"></div>
                <div className="absolute top-1/2 -right-3 w-6 h-6 bg-[#09090b] rounded-full transform -translate-y-1/2 border-l border-white/10 shadow-inner"></div>

                <div className="border-b border-dashed border-white/20 pb-4 mb-4 text-left">
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">
                    Admit One
                  </p>
                  <h2
                    className={clsx(
                      "text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r",
                      theme.gradient,
                    )}
                  >
                    {eventName}
                  </h2>
                </div>

                <div className="flex justify-between items-end mb-6 text-left">
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] text-neutral-500 uppercase tracking-wider">
                        Participant
                      </p>
                      <p className="font-semibold text-white text-sm">
                        {participantName}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-neutral-500 uppercase tracking-wider">
                        Reg Number
                      </p>
                      <p className="font-mono text-white text-sm">{regNum}</p>
                    </div>
                  </div>
                </div>

                {/* --- QR CODE SECTION --- */}
                <div className="pt-6 border-t border-dashed border-white/20 flex flex-col items-center justify-center space-y-5">
                  <div className="bg-white p-3 rounded-xl shadow-lg border border-white/20">
                    <QRCode
                      value={verificationUrl}
                      size={120}
                      level="H"
                      className="w-full h-auto"
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                  </div>

                  <div className="w-full bg-white/5 p-3 rounded-xl text-center backdrop-blur-sm border border-white/5">
                    <p className="text-[10px] text-neutral-400 uppercase mb-1">
                      Secure Ticket Code
                    </p>
                    <p className="font-mono text-xs sm:text-sm tracking-widest text-white break-all">
                      {ticketCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 w-full pt-4">
              <Button
                onClick={handleDownloadTicket}
                disabled={isDownloading}
                className="flex-1 bg-white text-black hover:bg-neutral-200 font-bold rounded-xl h-12 shadow-lg transition-all active:scale-[0.98]"
              >
                {isDownloading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" /> Download
                  </>
                )}
              </Button>
              <Button
                onClick={handleShareTicket}
                className="flex-1 bg-white/10 text-white hover:bg-white/20 border border-white/10 font-bold rounded-xl h-12 shadow-lg transition-all active:scale-[0.98]"
              >
                <Share2 className="w-5 h-5 mr-2" /> Share
              </Button>
            </div>

            <motion.div className="w-full pt-4">
              <Button
                onClick={() => navigate("/events")}
                className="w-full h-14 bg-transparent text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl text-base transition-all group border border-transparent hover:border-white/10"
              >
                Explore More Events
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <motion.p className="text-center text-neutral-600 text-xs">
          Having trouble? Contact support at{" "}
          <a
            href="mailto:support@example.com"
            className="text-neutral-400 underline"
          >
            support@example.com
          </a>
        </motion.p>
      </div>
    </div>
  );
};

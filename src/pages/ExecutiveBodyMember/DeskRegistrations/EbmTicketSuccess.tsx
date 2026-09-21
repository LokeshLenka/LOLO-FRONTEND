import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Download,
  Share2,
  PlusCircle,
  Loader2,
  // Smartphone,
  // Banknote,
  ShieldCheck,
} from "lucide-react";
import { toPng, toBlob } from "html-to-image";
import QRCode from "react-qr-code";
import { toast } from "sonner";
import { Button } from "@/components/ui/button/button";
import { useAuth } from "@/context/AuthContext";

// ── Professional WhatsApp message ────────────────────────────────────────────
function buildWhatsappMessage({
  attendeeName,
  regNum,
  eventName,
  ticketCode,
  amount,
  method,
  utr,
  cashReceiptNo,
  collectedBy,
}: {
  attendeeName: string;
  regNum: string;
  eventName: string;
  ticketCode: string;
  amount: number;
  method: "UPI_QR" | "CASH";
  utr?: string;
  cashReceiptNo?: string;
  collectedBy: string;
}) {
  const paymentLine =
    method === "UPI_QR"
      ? `*Payment Mode:* UPI\n *UTR Reference:* \`${utr ?? "N/A"}\``
      : `*Payment Mode:* Cash\n *Receipt No:* \`${cashReceiptNo ?? "N/A"}\``;

  const now = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return encodeURIComponent(
    `*SRKR LOLO - Event Registration Confirmation*\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `Dear *${attendeeName}*,\n\n` +
    `Your registration has been successfully confirmed. Please find your ticket details below.\n\n` +
    `*Event:* ${eventName}\n` +
    `*Ticket Code:* \`${ticketCode}\`\n` +
    `*Registration No:* ${regNum}\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n` +
    `*Amount Paid:* ₹${amount}\n` +
    `${paymentLine}\n` +
    `*Date & Time:* ${now}\n` +
    `*Verified by:* ${collectedBy}\n\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n` +
    `*Important:* Please carry this ticket (digital or printed) and your college ID on the day of the event.\n\n` +
    `We look forward to seeing you at *${eventName}*! 🎵\n\n` +
    `Warm regards,\n` +
    `*SRKR LOLO - Events Team*\n`,
  );
}

// ── Detail row ────────────────────────────────────────────────────────────────
function Row({
  label,
  value,
  mono = false,
  accent = false,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex justify-between items-start gap-4 py-2.5 border-b border-white/5 last:border-0">
      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 shrink-0">
        {label}
      </span>
      <span
        className={`text-sm text-right font-semibold break-all ${accent
            ? "text-lolo-pink tracking-widest"
            : mono
              ? "font-mono text-white"
              : "text-white"
          }`}
      >
        {value ?? "—"}
      </span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function EbmTicketSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const ticketRef = useRef<HTMLDivElement>(null);

  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const {
    attendeeName = "Attendee",
    regNum = "N/A",
    phone,
    ticketCode = "PENDING",
    eventName = "Event",
    method = "UPI_QR",
    amount = 0,
    utr,
    cashReceiptNo,
    collectionId,
  } = state ?? {};

  const collectedBy = user?.name ?? user?.username ?? "EBM Staff";
  const verificationUrl = `${window.location.origin}/verify-ticket/${ticketCode}`;

  const whatsappText = buildWhatsappMessage({
    attendeeName,
    regNum,
    eventName,
    ticketCode,
    amount,
    method,
    utr,
    cashReceiptNo,
    collectedBy,
  });

  // ── Capture ticket as PNG blob ────────────────────────────────────────────
  const captureTicket = async (): Promise<Blob | null> => {
    if (!ticketRef.current) return null;
    try {
      const blob = await toBlob(ticketRef.current, {
        backgroundColor: "#09090b",
        pixelRatio: 3,
      });
      return blob;
    } catch {
      return null;
    }
  };

  // ── Download ──────────────────────────────────────────────────────────────
  const handleDownload = async () => {
    if (!ticketRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(ticketRef.current, {
        backgroundColor: "#09090b",
        pixelRatio: 3,
      });
      const link = document.createElement("a");
      link.download = `LOLO_${eventName.replace(/\s+/g, "_")}_${regNum}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Ticket downloaded!");
    } catch {
      toast.error("Download failed. Try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // ── Share via Web Share API (image + message) ─────────────────────────────
  // Uses navigator.share with file if supported, else falls back to WhatsApp link [web:263][web:267]
  const handleShare = async () => {
    setIsSharing(true);
    try {
      const blob = await captureTicket();

      if (blob && navigator.canShare) {
        const file = new File([blob], `LOLO_Ticket_${regNum}.png`, {
          type: "image/png",
          lastModified: Date.now(),
        });

        const sharePayload = {
          title: `SRKR LOLO – ${eventName} Ticket`,
          text: decodeURIComponent(whatsappText).slice(0, 300), // preview text
          files: [file],
        };

        if (navigator.canShare(sharePayload)) {
          await navigator.share(sharePayload);
          toast.success("Shared successfully!");
          return;
        }
      }

      // Fallback: open WhatsApp with message + phone
      const waUrl = phone
        ? `https://wa.me/${phone.replace(/\D/g, "")}?text=${whatsappText}`
        : `https://wa.me/?text=${whatsappText}`;
      window.open(waUrl, "_blank");
    } catch (err: any) {
      if (err?.name !== "AbortError") {
        toast.error("Share failed. Opening WhatsApp instead.");
        const waUrl = phone
          ? `https://wa.me/${phone.replace(/\D/g, "")}?text=${whatsappText}`
          : `https://wa.me/?text=${whatsappText}`;
        window.open(waUrl, "_blank");
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col items-center justify-start px-4 py-10 sm:py-16 relative overflow-hidden">
      {/* Background glow */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-lolo-pink/10 rounded-full blur-[140px] pointer-events-none opacity-40" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-white/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10 space-y-6">
        {/* ── Success header ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-3"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 16 }}
            className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto"
          >
            <CheckCircle2 className="text-green-400 w-8 h-8" />
          </motion.div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Registration Confirmed!
            </h1>
            <p className="text-neutral-500 text-sm mt-1">
              Payment recorded · Ticket ready to share
            </p>
          </div>
        </motion.div>

        {/* ── PRINTABLE TICKET (captured by html-to-image) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div
            ref={ticketRef}
            className="relative bg-gradient-to-br from-[#111114] to-[#0a0a0c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Top gradient bar */}
            <div className="w-full h-1.5 bg-gradient-to-r from-lolo-pink via-purple-500 to-lolo-cyan" />

            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-dashed border-white/10">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-600 mb-1">
                    SRKR LOLO · Official Ticket
                  </p>
                  <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                    {eventName}
                  </h2>
                </div>
                <div className="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                  <ShieldCheck size={12} className="text-green-400" />
                  <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">
                    Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Ticket body */}
            <div className="px-6 py-5 space-y-0">
              <Row label="Attendee" value={attendeeName} />
              <Row label="Reg No" value={regNum} mono />
              {/* <Row label="Gender" value={state?.gender ?? "—"} />
              <Row
                label="Branch / Year"
                value={`${state?.branch ?? "—"} · ${state?.year ?? "—"}`}
              /> */}
              {/* <Row
                label="Payment"
                value={
                  <span className="flex items-center justify-end gap-1.5">
                    {method === "UPI_QR" ? (
                      <>
                        <Smartphone size={12} className="text-lolo-pink" /> UPI
                        / QR
                      </>
                    ) : (
                      <>
                        <Banknote size={12} className="text-lolo-pink" /> Cash
                      </>
                    )}
                  </span>
                }
              /> */}
              {/* {method === "UPI_QR" && utr && (
                <Row label="UTR" value={utr} mono />
              )}
              {method === "CASH" && cashReceiptNo && (
                <Row label="Receipt No" value={cashReceiptNo} mono />
              )}
              <Row label="Amount Paid" value={`₹${amount}`} accent /> */}
              {collectionId && (
                <Row label="Collection ID" value={`#${collectionId}`} mono />
              )}
            </div>

            {/* Dotch notch divider */}
            <div className="relative flex items-center px-0 mx-0">
              <div className="w-5 h-5 bg-[#030303] rounded-full absolute -left-3 border-r border-white/10" />
              <div className="flex-1 border-t border-dashed border-white/10 mx-3" />
              <div className="w-5 h-5 bg-[#030303] rounded-full absolute -right-3 border-l border-white/10" />
            </div>

            {/* QR + ticket code */}
            <div className="px-6 py-5 flex flex-col items-center gap-4">
              <div className="bg-white p-3 rounded-2xl shadow-lg">
                <QRCode
                  value={verificationUrl}
                  size={110}
                  level="H"
                  style={{ display: "block" }}
                />
              </div>

              <div className="w-full bg-white/[0.04] border border-white/5 rounded-xl px-4 py-3 text-center">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-600 mb-1">
                  Ticket Code
                </p>
                <p className="font-mono text-sm tracking-[0.15em] text-lolo-pink font-bold break-all">
                  {ticketCode}
                </p>
              </div>

              <p className="text-[9px] text-neutral-700 text-center leading-relaxed">
                Present this QR code or ticket code at the venue entrance.
                {"\n"}Valid only for the registered participant.
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
              <span className="text-[9px] text-neutral-700 font-mono">
                {new Date().toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
              <span className="text-[9px] text-neutral-700">
                Collected by:{" "}
                <span className="text-neutral-500 font-medium">
                  {collectedBy}
                </span>
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── Action buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3"
        >
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="h-12 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 text-sm"
          >
            {isDownloading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <>
                <Download size={15} /> Download
              </>
            )}
          </Button>

          <Button
            onClick={handleShare}
            disabled={isSharing}
            className="h-12 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all flex items-center justify-center gap-2 text-sm"
          >
            {isSharing ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <>
                <Share2 size={15} /> Share
              </>
            )}
          </Button>
        </motion.div>

        {/* ── WhatsApp direct fallback ── */}
        {phone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <a
              href={`https://wa.me/${phone.replace(/\D/g, "")}?text=${whatsappText}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full h-11 rounded-xl bg-white/[0.03] border border-white/5 text-neutral-400 hover:text-white hover:border-white/10 hover:bg-white/5 transition-all text-sm font-medium"
            >
              <Share2 size={14} />
              Send WhatsApp message only (no image)
            </a>
          </motion.div>
        )}

        {/* ── New registration ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={() =>
              navigate(`/${user?.username}/executive_body_member/desk-sale`)
            }
            className="flex items-center justify-center gap-2 w-full h-11 rounded-xl text-neutral-500 hover:text-white transition-colors text-sm font-medium"
          >
            <PlusCircle size={14} /> Register Another Attendee
          </button>
        </motion.div>
      </div>
    </div>
  );
}

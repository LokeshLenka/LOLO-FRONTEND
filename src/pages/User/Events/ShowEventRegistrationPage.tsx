import * as React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Skeleton,
  Divider,
  Chip,
} from "@heroui/react";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Download,
  Share2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Ticket,
  CreditCard,
  Banknote,
  Copy,
  Loader2,
  // ArrowRight,
  ExternalLink,
} from "lucide-react";

import QRCode from "react-qr-code";
import QRCodeUtil from "qrcode";
import { jsPDF } from "jspdf";
import { toast } from "sonner";

// ==================== CONFIG & TYPES ====================
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Event {
  uuid: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  venue?: string;
  status: string;
  image?: string;
  coordinator1?: string;
  coordinator2?: string;
  fee?: number;
}

interface EventRegistration {
  uuid: string;
  ticket_code: string;
  registered_at: string;
  registration_status: "confirmed" | "pending" | "waitlisted" | "cancelled";
  payment_status: "success" | "pending" | "failed";
  is_paid: boolean;
  payment_reference?: string;
  event: Event;
  user?: { name: string }; // Added basic user type for safety
}

const getAuthToken = () => localStorage.getItem("authToken");
const getUserFromStorage = () => {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
};

const formatDate = (dateString: string, includeTime = false) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    ...(includeTime && { hour: "2-digit", minute: "2-digit" }),
  }).format(date);
};

const formatCurrency = (amount?: number) => {
  if (amount === undefined || amount === null) return "Free";
  if (Number(amount) === 0) return "Free";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
    case "success":
      return "success";
    case "pending":
      return "warning";
    case "waitlisted":
      return "primary";
    case "cancelled":
    case "failed":
      return "danger";
    default:
      return "default";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "confirmed":
    case "success":
      return <CheckCircle2 size={16} />;
    case "pending":
      return <Clock size={16} />;
    case "failed":
    case "cancelled":
      return <XCircle size={16} />;
    default:
      return <AlertCircle size={16} />;
  }
};

const InfoRow = ({ icon: Icon, label, value, className = "" }: any) => (
  <div className={`flex items-start gap-3 ${className}`}>
    <div className="p-2 rounded-lg bg-black/5 dark:bg-white/10 shrink-0 mt-0.5 text-[#03a1b0] dark:text-cyan-400">
      <Icon size={18} />
    </div>
    <div className="flex flex-col min-w-0">
      <span className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        {label}
      </span>
      <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100 mt-0.5 leading-relaxed break-words">
        {value || "N/A"}
      </span>
    </div>
  </div>
);

const DetailSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
    <div className="lg:col-span-2 space-y-6">
      <Skeleton className="w-full aspect-video rounded-3xl" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3 rounded-lg" />
        <Skeleton className="h-4 w-1/2 rounded-lg" />
        <div className="space-y-2 pt-4">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-2/3 rounded" />
        </div>
      </div>
    </div>
    <Skeleton className="h-96 rounded-3xl" />
  </div>
);

// ==================== MAIN COMPONENT ====================

export default function ShowEventRegistrationPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();

  const [registration, setRegistration] =
    React.useState<EventRegistration | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const ticketRef = React.useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [isCopied, setIsCopied] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = getAuthToken();
        const user = getUserFromStorage();
        const role = user?.role;

        if (!token || !role || !uuid) throw new Error("Invalid session");

        const response = await axios.get(
          `${API_BASE_URL}/${role}/event/registrations/${uuid}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setRegistration(response.data.data);
      } catch (err: any) {
        console.error(err);
        if (err.response?.status === 404) {
          setError("Registration not found.");
        } else if (err.response?.status === 403) {
          setError("Access denied.");
        } else {
          setError("Failed to load details.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [uuid]);

  // --- ACTION HANDLERS ---

  const handleDownloadPDF = async () => {
    if (!registration) return;
    setIsDownloading(true);

    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const getUserFromStorage = () => {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
      };

      const user = getUserFromStorage();

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // FIX IS HERE: Added 'as const'
      const colors = {
        primary: [3, 161, 176],
        secondary: [31, 41, 55],
        accent: [245, 247, 250],
        text: {
          dark: [17, 24, 39],
          medium: [107, 114, 128],
          light: [156, 163, 175],
        },
        white: [255, 255, 255],
      } as const;

      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let y = margin;

      const loadImageAsBase64 = (src: string): Promise<string> =>
        new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL("image/png"));
          };
          img.src = src;
        });

      const drawField = (
        label: string,
        value: string,
        x: number,
        yPos: number,
        width: number,
      ) => {
        pdf.setFontSize(8);
        pdf.setTextColor(...colors.text.medium);
        pdf.setFont("helvetica", "bold");
        pdf.text(label.toUpperCase(), x, yPos);

        pdf.setFontSize(11);
        pdf.setTextColor(...colors.text.dark);
        pdf.setFont("helvetica", "normal");

        const wrappedValue = pdf.splitTextToSize(value, width);
        pdf.text(wrappedValue, x, yPos + 5);
        return wrappedValue.length * 5;
      };

      // Header
      pdf.setFillColor(...colors.primary);
      pdf.rect(0, 0, pageWidth, 8, "F");
      y += 15;

      // Accent circle
      pdf.setFillColor(...colors.secondary);
      pdf.circle(margin + 6, y + 6, 6, "F");

      // Load SRKR logo
      const srkrLogo = await loadImageAsBase64("/lolo_logos/Lolo_logo_1.png");

      // Draw logo INSIDE circle
      pdf.addImage(
        srkrLogo,
        "PNG",
        margin + 1.5, // X (centered)
        y + 1.5, // Y (centered)
        9, // Width
        9, // Height
      );

      pdf.setFontSize(14);
      pdf.setTextColor(...colors.text.dark);
      pdf.setFont("helvetica", "bold");
      pdf.text("SRKR LOLO", margin + 16, y + 8);

      pdf.setFontSize(24);
      pdf.setTextColor(...colors.primary);
      pdf.text("TICKET", pageWidth - margin, y + 10, { align: "right" });
      y += 25;

      // Event Hero
      pdf.setFillColor(...colors.accent);
      pdf.roundedRect(margin, y, contentWidth, 45, 3, 3, "F");

      const heroPadding = 10;
      pdf.setFontSize(18);
      pdf.setTextColor(...colors.text.dark);
      pdf.setFont("helvetica", "bold");
      const titleLines = pdf.splitTextToSize(
        registration.event.name,
        contentWidth - heroPadding * 2,
      );
      pdf.text(titleLines, margin + heroPadding, y + 12);

      const eventDate = registration.event.start_date
        ? formatDate(registration.event.start_date, true)
        : "Date TBA";

      pdf.setFontSize(11);
      pdf.setTextColor(...colors.primary);
      pdf.setFont("helvetica", "bold");
      pdf.text(eventDate, margin + heroPadding, y + 25);

      pdf.setFontSize(10);
      pdf.setTextColor(...colors.text.medium);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        `Venue - ${registration.event.venue || "Venue to be announced"}`,
        margin + heroPadding,
        y + 35,
      );
      y += 55;

      // QR Code
      const qrSize = 65;
      const col2Start = margin + qrSize + 15;
      const canvas = document.createElement("canvas");

      const verificationUrl = `${window.location.origin}/verify-ticket/${registration.ticket_code}`;

      await QRCodeUtil.toCanvas(canvas, verificationUrl, {
        width: 400,
        margin: 1,
        color: { dark: "#03a1b0", light: "#ffffff" },
        errorCorrectionLevel: "H",
      });
      const qrImg = canvas.toDataURL("image/png");

      pdf.setDrawColor(230);
      pdf.setLineWidth(0.5);
      pdf.rect(margin, y, qrSize, qrSize);
      pdf.addImage(qrImg, "PNG", margin + 2, y + 2, qrSize - 4, qrSize - 4);

      pdf.setFontSize(8);
      pdf.setTextColor(...colors.text.light);
      pdf.text("SCAN TO VERIFY", margin + qrSize / 2, y + qrSize + 6, {
        align: "center",
      });

      // Ticket Details
      let detailY = y + 5;
      const colWidth = (contentWidth - qrSize - 15) / 2;

      drawField("Attendee", user?.name, col2Start, detailY, colWidth);
      drawField("", "", col2Start + colWidth, detailY, colWidth);
      detailY += 20;

      drawField(
        "Reference ID",
        registration.ticket_code,
        col2Start,
        detailY,
        colWidth * 2,
      );

      detailY += 20;
      pdf.setFontSize(8);
      pdf.setTextColor(...colors.text.medium);
      pdf.text("STATUS", col2Start + colWidth, detailY);

      const statusColor =
        registration.payment_status === "success"
          ? [22, 163, 74] // Green
          : [220, 38, 38]; // Red

      pdf.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
      pdf.roundedRect(col2Start + colWidth, detailY + 2, 25, 6, 2, 2, "F");
      pdf.setFontSize(8);
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.text(
        registration.payment_status.toUpperCase(),
        col2Start + colWidth + 12.5,
        detailY + 6,
        { align: "center" },
      );

      drawField(
        "Price",
        `INR ${registration.event.fee}`,
        col2Start,
        detailY,
        colWidth,
      );

      y += qrSize + 25;

      pdf.setDrawColor(200);
      pdf.setLineDash([3, 3]);
      pdf.line(0, y, pageWidth, y);
      pdf.setLineDash([]);
      y += 10;

      pdf.setFontSize(12);
      pdf.setTextColor(...colors.text.dark);
      pdf.setFont("helvetica", "bold");
      pdf.text("Important Information", margin, y);
      y += 8;

      pdf.setFontSize(9);
      pdf.setTextColor(...colors.text.medium);
      pdf.setFont("helvetica", "normal");

      const termsText = [
        "• Please arrive at least 30 minutes before the event starts for security checks.",
        "• This ticket is non-transferable and must be presented at the entrance.",
        "• Valid ID proof may be required for verification.",
        // "• For support, please contact support@srkrlolo.com",
      ];

      termsText.forEach((line) => {
        pdf.text(line, margin, y);
        y += 6;
      });

      const footerY = pageHeight - 15;
      pdf.setFontSize(8);
      pdf.setTextColor(...colors.text.light);

      // Standard Date formatting for PDF footer
      const now = new Date();
      const dateStr = now.toLocaleDateString() + " " + now.toLocaleTimeString();
      pdf.text(`Generated on ${dateStr}`, margin, footerY);
      pdf.text("Page 1 of 1", pageWidth - margin, footerY, { align: "right" });

      pdf.save(`Ticket-${registration.ticket_code}.pdf`);
      toast.success("Ticket downloaded successfully!");
    } catch (err) {
      console.error("PDF Generation Error:", err);
      toast.error("Failed to generate PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!registration) return;

    const shareData = {
      title: registration.event.name,
      text: `I'm attending ${registration.event.name}!`,
      url: window.location.href,
    };

    if (typeof navigator.share === "function") {
      try {
        await navigator.share(shareData);
      } catch (err) {}
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        toast.error("Failed to copy link.");
      }
    }
  };

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center px-4">
        <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/20 text-red-500">
          <AlertCircle size={48} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {error}
        </h2>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const verificationUrl = registration
    ? `${window.location.origin}/verify-ticket/${registration.ticket_code}`
    : "";

  return (
    <section className="relative w-full min-h-screen mx-auto sm:px-8 lg:px-16 py-8 space-y-6">
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-emerald-500/5 via-teal-500/5 to-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="flex items-center">
        <Button
          variant="light"
          startContent={<ArrowLeft size={20} />}
          className="z-50 bottom-5 fixed text-gray-600 dark:text-gray-300 hover:text-[#03a1b0] hover:dark:text-[#03a1b0] font-semibold pl-0 gap-2 bg-white dark:bg-black rounded-r-lg"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </div>

      {isLoading || !registration ? (
        <DetailSkeleton />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <Card
              shadow="sm"
              className="border border-black/5 dark:border-white/5 bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-3xl overflow-hidden"
            >
              <div className="w-full h-48 sm:h-72 md:h-80 relative bg-gray-100 dark:bg-gray-800">
                <img
                  src={
                    registration.event.image ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(registration.event.name)}&size=800&background=03a1b0&color=fff&bold=true`
                  }
                  alt={registration.event.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardBody className="p-6 sm:p-8 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                  <InfoRow
                    icon={MapPin}
                    label="Venue"
                    value={registration.event.venue || "To be announced"}
                  />
                  <InfoRow
                    icon={Calendar}
                    label="Start Date"
                    value={formatDate(registration.event.start_date, true)}
                  />
                  <InfoRow
                    icon={Clock}
                    label="End Date"
                    value={formatDate(registration.event.end_date, true)}
                  />
                </div>
                <Divider className="opacity-50" />

                <div className="space-y-3 pb-5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    About the Event
                  </h3>
                  <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                    {registration.event.description || (
                      <span className="italic text-gray-400">
                        No detailed description provided.
                      </span>
                    )}
                  </div>
                </div>

                {/* New Call-to-Action Section */}
                <div className="flex items-center justify-between p-4 mt-4 rounded-xl bg-gradient-to-r from-gray-50 to-white dark:from-white/5 dark:to-white/5 border border-black/5 dark:border-white/5">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      View Event Details
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      See what this event was about
                    </p>
                  </div>

                  <Button
                    as={Link}
                    to={`/events/${registration.event.uuid}`}
                    className="bg-white dark:bg-white/10 text-black dark:text-white font-bold border border-black/10 dark:border-white/10 shadow-sm"
                    size="sm"
                    endContent={<ExternalLink size={16} />}
                  >
                    Visit Event
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-10 pb-20">
            <div ref={ticketRef}>
              <Card
                shadow="lg"
                className="border-none bg-gradient-to-b from-white to-gray-50 dark:from-[#18181b] dark:to-black rounded-3xl overflow-hidden relative ring-1 ring-black/5 dark:ring-white/10"
              >
                <div className="h-2 w-full bg-[#03a1b0]" />

                <CardHeader className="flex flex-col items-center pt-8 pb-2 space-y-3 text-center">
                  <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 mb-1">
                    <div
                      style={{
                        height: "auto",
                        margin: "0 auto",
                        maxWidth: 256,
                        width: "100%",
                      }}
                    >
                      <QRCode
                        size={256}
                        style={{
                          height: "auto",
                          maxWidth: "100%",
                          width: "100%",
                        }}
                        value={verificationUrl}
                        viewBox={`0 0 256 256`}
                        fgColor="#03a1b0"
                        bgColor="#ffffff"
                        level="H"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-mono font-black tracking-widest text-gray-900 dark:text-white break-all">
                      {registration.ticket_code}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">
                      Scan to Verify
                    </p>
                  </div>
                </CardHeader>

                <div className="relative flex items-center w-full my-6">
                  <div className="h-6 w-3 bg-[#f3f4f6] dark:bg-black rounded-r-full absolute left-0" />
                  <div className="w-full border-t-2 border-dashed border-gray-200 dark:border-white/10 mx-3" />
                  <div className="h-6 w-3 bg-[#f3f4f6] dark:bg-black rounded-l-full absolute right-0" />
                </div>

                <CardBody className="px-6 pb-8 pt-0 space-y-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/5">
                      <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                        <Ticket size={14} /> Registration
                      </span>
                      <Chip
                        startContent={getStatusIcon(
                          registration.registration_status,
                        )}
                        variant="flat"
                        color={
                          getStatusColor(
                            registration.registration_status,
                          ) as any
                        }
                        size="sm"
                        className="capitalize font-bold"
                      >
                        {registration.registration_status}
                      </Chip>
                    </div>

                    <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/5">
                      <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                        <CreditCard size={14} /> Payment
                      </span>
                      <Chip
                        startContent={getStatusIcon(
                          registration.payment_status,
                        )}
                        variant="flat"
                        color={
                          getStatusColor(registration.payment_status) as any
                        }
                        size="sm"
                        className="capitalize font-bold"
                      >
                        {registration.payment_status}
                      </Chip>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white dark:from-white/5 dark:to-white/5 border border-black/5 dark:border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-lg">
                        <Banknote size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Total Fee
                        </span>
                        <span className="text-lg font-black text-gray-900 dark:text-white">
                          {formatCurrency(registration.event.fee)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Button
                      className="w-full bg-white dark:bg-white/10 text-black dark:text-white border border-black/10 dark:border-white/10 font-bold"
                      startContent={
                        isDownloading ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : (
                          <Download size={18} />
                        )
                      }
                      onClick={handleDownloadPDF}
                      isDisabled={isDownloading}
                    >
                      {isDownloading ? "Saving..." : "PDF"}
                    </Button>

                    <Button
                      className={`w-full font-bold shadow-lg transition-all ${
                        isCopied
                          ? "bg-green-500 text-white"
                          : "bg-[#03a1b0] text-white"
                      }`}
                      startContent={
                        isCopied ? (
                          <CheckCircle2 size={18} />
                        ) : typeof navigator.share === "function" ? (
                          <Share2 size={18} />
                        ) : (
                          <Copy size={18} />
                        )
                      }
                      onClick={handleShare}
                    >
                      {isCopied
                        ? "Copied!"
                        : typeof navigator.share === "function"
                          ? "Share"
                          : "Copy Link"}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

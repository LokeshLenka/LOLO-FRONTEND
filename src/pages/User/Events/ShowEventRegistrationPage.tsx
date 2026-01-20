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
  Tooltip,
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
  User,
  Banknote,
  ArrowRight,
} from "lucide-react";

// 2. Import the QR Generator
import QRCode from "react-qr-code";

// ==================== CONFIG & TYPES ====================
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Matches the "clean" backend response
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
  fee?: number; // Added fee from backend
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
}

// ==================== HELPERS ====================
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
    currency: "INR", // Change to USD or dynamic currency if needed
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

// ==================== SUB-COMPONENTS ====================

const InfoRow = ({
  icon: Icon,
  label,
  value,
  className = "",
}: {
  icon: any;
  label: string;
  value: React.ReactNode;
  className?: string;
}) => (
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

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center px-4">
        <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/20 text-red-500">
          <AlertCircle size={48} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {error}
        </h2>
        <Button
          variant="flat"
          startContent={<ArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </div>
    );
  }

  const verificationUrl = `${window.location.origin}/verify-ticket/${registration?.ticket_code}`;

  return (
    <section className="relative w-full min-h-screen mx-auto sm:px-8 lg:px-16 py-8 space-y-6">
      {/* Background Gradient */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-emerald-500/5 via-teal-500/5 to-cyan-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="flex items-center">
        <Button
          variant="light"
          startContent={<ArrowLeft size={20} />}
          className="z-50 bottom-5 fixed text-gray-600 dark:text-gray-300 hover:text-[#03a1b0] font-semibold pl-0 gap-2 bg-white dark:bg-black rounded-r-lg"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </div>

      {isLoading || !registration ? (
        <DetailSkeleton />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* ================= LEFT: EVENT INFO ================= */}
          <div className="lg:col-span-2 space-y-6">
            <Card
              shadow="sm"
              className="border border-black/5 dark:border-white/5 bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-3xl overflow-hidden"
            >
              {/* Event Image */}
              <div className="w-full h-48 sm:h-72 md:h-80 relative bg-gray-100 dark:bg-gray-800">
                <img
                  src={
                    registration.event.image ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      registration.event.name,
                    )}&size=800&background=03a1b0&color=fff&bold=true`
                  }
                  alt={registration.event.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 p-6 sm:p-8 w-full">
                  <Chip
                    color={
                      registration.event.status === "upcoming"
                        ? "primary"
                        : "default"
                    }
                    variant="solid"
                    size="sm"
                    className="mb-3 border border-white/20 text-white dark:text-black font-bold uppercase tracking-wider shadow-lg"
                  >
                    {registration.event.status}
                  </Chip>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight drop-shadow-md">
                    {registration.event.name}
                  </h1>
                </div>
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

                  {/* <InfoRow
                    icon={User}
                    label="Organizer"
                    value={registration.event.coordinator1 || "Event Coordinator"}
                  /> */}
                </div>

                <Divider className="opacity-50" />

                <div className="space-y-3">
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
                <div className="flex items-center justify-between p-4 mt-4 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/10 dark:to-blue-900/10 border border-cyan-100 dark:border-cyan-800/30">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      Want to see full event details?
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      View schedule, rules, and more info
                    </p>
                  </div>
                  <Button
                    as={Link}
                    to={`/events/${registration.event.uuid}`}
                    className="bg-white dark:bg-white/10 text-[#03a1b0] dark:text-cyan-400 font-bold border border-cyan-200 dark:border-white/10 shadow-sm hover:scale-105 transition-transform"
                    size="sm"
                    endContent={<ArrowRight size={16} />} // Make sure to import ArrowRight from lucide-react
                  >
                    View Event
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* ================= RIGHT: TICKET ================= */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-10">
            <Card
              shadow="lg"
              className="border-none bg-gradient-to-b from-white to-gray-50 dark:from-[#18181b] dark:to-black rounded-3xl overflow-hidden relative ring-1 ring-black/5 dark:ring-white/10"
            >
              {/* Top Accent */}
              <div className="h-2 w-full bg-[#03a1b0]" />

              <CardHeader className="flex flex-col items-center pt-8 pb-2 space-y-3 text-center">
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 mb-1">
                  {/* Actual QR Code Generation */}
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
                      fgColor="#03a1b0" // QR dots color (Keep black for better scanning)
                      bgColor="#ffffff" // Background color
                      level="H" // High error correction
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

              {/* Perforated Line */}
              <div className="relative flex items-center w-full my-6">
                <div className="h-6 w-3 bg-[#f3f4f6] dark:bg-black rounded-r-full absolute left-0" />
                <div className="w-full border-t-2 border-dashed border-gray-200 dark:border-white/10 mx-3" />
                <div className="h-6 w-3 bg-[#f3f4f6] dark:bg-black rounded-l-full absolute right-0" />
              </div>

              <CardBody className="px-6 pb-8 pt-0 space-y-6">
                {/* Status Section */}
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
                        getStatusColor(registration.registration_status) as any
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
                      startContent={getStatusIcon(registration.payment_status)}
                      variant="flat"
                      color={getStatusColor(registration.payment_status) as any}
                      size="sm"
                      className="capitalize font-bold"
                    >
                      {registration.payment_status}
                    </Chip>
                  </div>
                </div>

                {/* Amount Section */}
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

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Tooltip content="Coming Soon">
                    <Button
                      className="w-full bg-white dark:bg-white/10 text-black dark:text-white border border-black/10 dark:border-white/10 font-bold"
                      startContent={<Download size={18} />}
                      isDisabled
                    >
                      PDF
                    </Button>
                  </Tooltip>
                  <Button
                    className="w-full bg-[#03a1b0] text-white font-bold shadow-lg shadow-cyan-500/20"
                    startContent={<Share2 size={18} />}
                    onClick={() => {
                      navigator
                        .share({
                          title: registration.event.name,
                          text: `I'm attending ${registration.event.name}!`,
                          url: window.location.href,
                        })
                        .catch(() => {});
                    }}
                  >
                    Share
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </section>
  );
}

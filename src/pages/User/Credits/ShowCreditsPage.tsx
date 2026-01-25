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
  Clock,
  Share2,
  AlertCircle,
  CheckCircle2,
  Trophy,
  Coins,
  Hash,
  User,
  ExternalLink,
  Copy,
} from "lucide-react";
import { toast } from "sonner";

// ==================== CONFIG & TYPES ====================
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Event {
  id: number;
  uuid: string;
  name: string;
  credits_awarded: number;
  end_date: string;
  image?: string; // Optional if backend sends it
  description?: string; // Optional if backend sends it
}

interface Credit {
  id: number;
  uuid: string;
  user_id: number;
  event_id: number;
  amount: number;
  assigned_by: number;
  created_at: string;
  updated_at: string;
  event: Event;
}

// ==================== HELPERS ====================
const getAuthToken = () => localStorage.getItem("authToken");
const getUserFromStorage = () => {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
};

const formatDate = (dateString: string, includeTime = false) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    ...(includeTime && { hour: "2-digit", minute: "2-digit" }),
  }).format(date);
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
          <Skeleton className="h-4 w-2/3 rounded" />
        </div>
      </div>
    </div>
    <Skeleton className="h-96 rounded-3xl" />
  </div>
);

// ==================== MAIN COMPONENT ====================

export default function ShowCreditPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();

  const [credit, setCredit] = React.useState<Credit | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isCopied, setIsCopied] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = getAuthToken();
        const user = getUserFromStorage();
        const role = user?.role;

        if (!token || !role || !uuid) throw new Error("Invalid session");

        // Assuming endpoint follows REST pattern. Update if your backend uses a different path.
        // If your backend only has a list endpoint, you might need to fetch list and find,
        // but a direct show endpoint is better.
        const response = await axios.get(
          `${API_BASE_URL}/${role}/my/credits/${uuid}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (response.data.success) {
          setCredit(response.data.data);
        } else {
          throw new Error(response.data.message || "Failed to load");
        }
      } catch (err: any) {
        console.error(err);
        if (err.response?.status === 404) {
          setError("Credit record not found.");
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

  const handleShare = async () => {
    if (!credit) return;

    const shareData = {
      title: credit.event.name,
      text: `I earned ${credit.event.name}!`,
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

  return (
    <section className="relative w-full min-h-screen mx-auto sm:px-8 lg:px-16 py-8 ">
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
          className="z-50 bottom-5 fixed text-gray-600 dark:text-gray-300 hover:text-[#03a1b0] hover:dark:text-[#03a1b0] font-semibold pl-0 gap-2 bg-white dark:bg-black rounded-r-lg"
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </div>

      {isLoading || !credit ? (
        <DetailSkeleton />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pb-10">
          {/* ================= LEFT: EVENT CONTEXT ================= */}
          <div className="lg:col-span-2 space-y-6">
            <Card
              shadow="sm"
              className="border border-black/5 dark:border-white/5 bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-3xl overflow-hidden"
            >
              {/* Event Image Placeholder or Fallback */}
              <div className="w-full h-40 sm:h-56 relative bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#03a1b0] to-blue-600 opacity-90" />
                {/* Decorative Pattern */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                    backgroundSize: "24px 24px",
                  }}
                />

                <div className="absolute bottom-0 left-0 p-6 sm:p-8 w-full z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <Chip
                      variant="solid"
                      size="sm"
                      className="bg-white/20 text-white font-bold uppercase tracking-wider backdrop-blur-md border border-white/20"
                    >
                      Event Rewarded
                    </Chip>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight drop-shadow-md line-clamp-2">
                    {credit.event?.name || "Unknown Event"}
                  </h1>
                </div>
              </div>

              <CardBody className="p-6 sm:p-8 space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                  <InfoRow
                    icon={Calendar}
                    label="Date Awarded"
                    value={formatDate(credit.created_at, true)}
                  />
                  <InfoRow
                    icon={Clock}
                    label="Event Date"
                    value={formatDate(credit.event?.end_date)}
                  />
                  <InfoRow
                    icon={User}
                    label="Assigned By"
                    value={`ID: ${credit.assigned_by || "System"}`}
                  />
                  <InfoRow
                    icon={Hash}
                    label="Transaction ID"
                    value={
                      <span className="font-mono text-xs text-gray-500">
                        {credit.uuid}
                      </span>
                    }
                  />
                </div>

                <Divider className="opacity-50" />

                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Trophy size={18} className="text-amber-500" />
                    Achievement Context
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    This credit was awarded for participation in{" "}
                    <span className="font-semibold text-[#03a1b0]">
                      {credit.event?.name}
                    </span>
                    . These credits contribute to your global ranking and can
                    new responsibities and promotions.
                  </p>
                </div>

                {/* Call-to-Action to Event */}
                {credit.event && (
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
                      to={`/events/${credit.event.uuid}`}
                      className="bg-white dark:bg-white/10 text-black dark:text-white font-bold border border-black/10 dark:border-white/10 shadow-sm"
                      size="sm"
                      endContent={<ExternalLink size={16} />}
                    >
                      Visit Event
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* ================= RIGHT: CREDIT CERTIFICATE ================= */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-10">
            <Card
              shadow="lg"
              className="border-none bg-gradient-to-b from-white to-gray-50 dark:from-[#18181b] dark:to-black rounded-3xl overflow-hidden relative ring-1 ring-black/5 dark:ring-white/10"
            >
              {/* Top Decorative Border */}
              <div className="h-2 w-full bg-gradient-to-r from-amber-400 to-amber-600" />

              <CardHeader className="flex flex-col items-center pt-8 pb-4 space-y-4 text-center">
                <div className="relative">
                  {/* Glowing effect behind icon */}
                  <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full" />
                  <div className="relative p-5 bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-700/50 text-amber-600 dark:text-amber-400 shadow-inner">
                    <Coins size={48} strokeWidth={1.5} />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    Credit Voucher
                  </h3>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <span className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">
                      {credit.amount}
                    </span>
                    <span className="text-lg font-bold text-gray-400 mb-1">
                      LP
                    </span>
                  </div>
                </div>
              </CardHeader>

              {/* Perforated Line */}
              <div className="relative flex items-center w-full my-4">
                <div className="h-6 w-3 bg-[#f3f4f6] dark:bg-black rounded-r-full absolute left-0" />
                <div className="w-full border-t-2 border-dashed border-gray-200 dark:border-white/10 mx-3" />
                <div className="h-6 w-3 bg-[#f3f4f6] dark:bg-black rounded-l-full absolute right-0" />
              </div>

              <CardBody className="px-6 pb-8 pt-0 space-y-6">
                {/* Status Section */}
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center p-3 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20">
                    <span className="text-xs font-bold text-green-700 dark:text-green-400 uppercase flex items-center gap-2">
                      <CheckCircle2 size={14} /> Status
                    </span>
                    <span className="text-sm font-bold text-green-700 dark:text-green-400">
                      Credited
                    </span>
                  </div>
                </div>

                {/* Summary Info */}
                <div className="space-y-2">
                  {/* <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Beneficiary</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      You
                    </span>
                  </div> */}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Date</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatDate(credit.created_at)}
                    </span>
                  </div>
                </div>

                {/* Share Button */}
                <div className="grid grid-cols-1 gap-3 pt-2">
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
      )}
    </section>
  );
}

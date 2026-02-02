import * as React from "react";
import TablePagination from "@mui/material/TablePagination";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Skeleton,
} from "@heroui/react";
import Badge from "../../../components/ui/badge/Badge"; // Ensure path matches your structure
import {
  Eye,
  Ticket,
  CreditCard,
  UserCheck,
  Clock,
  XCircle,
  ChevronRight,
  LayoutGrid,
  Hourglass,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  X,
  Calendar,
} from "lucide-react";

// ==================== CONFIG ====================
/**
 * Base URL for API requests.
 * Uses `import.meta.env` (Vite standard). Ensure your .env file has VITE_API_BASE_URL.
 */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

/** Keys used for LocalStorage persistence */
const STORAGE_KEYS = {
  PAGE: "event_registrations_page",
  ROWS: "event_registrations_rows_per_page",
  AUTH: "authToken",
  USER: "user",
} as const;

// ==================== TYPES ====================

/**
 * Represents the Event entity embedded within a registration.
 */
interface Event {
  id: number;
  /** Unique UUID for public URLs and routing */
  uuid: string;
  name: string;
  /** URL for the event cover image. Optional */
  image?: string;
}

/**
 * Represents a user's registration for a specific event.
 */
interface EventRegistration {
  id: number;
  uuid: string;
  user_id: number;
  event_id: number;
  /** Unique ticket string (e.g., "TKT-12345") */
  ticket_code: string;
  /** ISO 8601 Date string */
  registered_at: string;
  /** The status of the registration slot itself */
  registration_status: "confirmed" | "pending" | "waitlisted" | "cancelled";
  /** Payment flag, sometimes returned as string '1'/'0' or boolean by backend */
  is_paid: boolean | string;
  /** The status of the transaction */
  payment_status: "success" | "pending" | "failed";
  payment_reference: string;
  /** Relationship data */
  event: Event;
}

/**
 * Standard backend pagination structure (Laravel/Generic).
 */
interface PaginatedData {
  data: EventRegistration[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

/**
 * Dashboard statistics object.
 */
interface EventRegistrationStats {
  total_registrations: number;
  upcoming_events: number;
  completed_events: number;
  pending_payments: number;
}

/**
 * The top-level API response shape.
 */
interface EventRegistrationApiResponse {
  message: string;
  /** Data can be a paginated object OR a flat array depending on backend serialization */
  data: PaginatedData | EventRegistration[];
  stats: EventRegistrationStats;
}

/**
 * Filter state object.
 */
interface FilterState {
  regStatus: string;
  payStatus: string;
  timeRange: string;
}

// ==================== CONSTANTS ====================

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

// ==================== HELPERS ====================

/**
 * Determines the Badge color based on status string.
 */
const getBadgeColor = (
  status: string,
): "success" | "warning" | "info" | "error" => {
  switch (status) {
    case "confirmed":
    case "success":
      return "success";
    case "pending":
      return "warning";
    case "waitlisted":
      return "info";
    default:
      return "error";
  }
};

/**
 * Returns the Lucide Icon component for a given status.
 */
const getStatusIcon = (type: "reg" | "pay", status: string) => {
  const size = 14;
  if (type === "reg") {
    if (status === "confirmed") return <UserCheck size={size} />;
    if (status === "cancelled") return <XCircle size={size} />;
    return <Clock size={size} />;
  } else {
    if (status === "success") return <CreditCard size={size} />;
    if (status === "failed") return <XCircle size={size} />;
    return <Clock size={size} />;
  }
};

/** Retrieves Auth Token safely */
const getAuthToken = (): string | null =>
  localStorage.getItem(STORAGE_KEYS.AUTH);

/** Retrieves User Object safely */
const getUserFromStorage = (): any => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error("Error parsing user from storage", e);
    return null;
  }
};

const currentUser = getUserFromStorage();

// ==================== CUSTOM HOOKS ====================

/**
 * Debounces a value to reduce API calls or expensive computations.
 * @param value The value to debounce
 * @param delay Delay in ms
 */
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// ==================== SUB-COMPONENTS ====================

/**
 * Skeleton loader for Stat Cards.
 */
const StatCardSkeleton = () => (
  <Card
    shadow="none"
    className="border border-black/5 dark:border-white/5 bg-white/60 dark:bg-white/5 backdrop-blur-sm rounded-2xl h-full overflow-hidden animate-pulse"
  >
    <CardBody className="p-4 sm:p-5 flex flex-row items-center gap-4">
      <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
      <div className="flex flex-col gap-2 flex-1">
        <Skeleton className="h-3 w-20 rounded" />
        <Skeleton className="h-6 w-16 rounded" />
      </div>
    </CardBody>
  </Card>
);

/**
 * Skeleton loader for Event Cards.
 */
const EventCardSkeleton = () => (
  <Card
    shadow="none"
    className="rounded-2xl border border-black/10 dark:border-white/10 bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-sm dark:from-white/[0.08] dark:to-white/[0.02] animate-pulse overflow-hidden"
  >
    <CardHeader className="p-0 overflow-hidden relative aspect-video">
      <Skeleton className="w-full h-full" />
    </CardHeader>
    <CardBody className="p-5 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-3/4 rounded" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-4 w-full rounded" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </CardBody>
  </Card>
);

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: "cyan" | "purple" | "emerald" | "amber";
  isLoading?: boolean;
}

/**
 * Displays a metric in a styled card.
 */
const StatCard = React.memo(
  ({ icon: Icon, label, value, color, isLoading }: StatCardProps) => {
    if (isLoading) return <StatCardSkeleton />;

    const colors = {
      cyan: {
        bg: "bg-cyan-100 dark:bg-cyan-500/20",
        text: "text-cyan-600 dark:text-cyan-400",
        glow: "group-hover:shadow-cyan-500/50",
      },
      purple: {
        bg: "bg-purple-100 dark:bg-purple-500/20",
        text: "text-purple-600 dark:text-purple-400",
        glow: "group-hover:shadow-purple-500/50",
      },
      emerald: {
        bg: "bg-emerald-100 dark:bg-emerald-500/20",
        text: "text-emerald-600 dark:text-emerald-400",
        glow: "group-hover:shadow-emerald-500/50",
      },
      amber: {
        bg: "bg-amber-100 dark:bg-amber-500/20",
        text: "text-amber-600 dark:text-amber-400",
        glow: "group-hover:shadow-amber-500/50",
      },
    };
    const theme = colors[color];

    return (
      <Card
        shadow="none"
        className="group border border-black/5 dark:border-white/5 bg-black/1 dark:bg-white/1 backdrop-blur-sm rounded-2xl h-full overflow-hidden hover:border-black/10 dark:hover:border-white/15 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl"
      >
        <CardBody className="p-4 sm:p-5 flex flex-row items-center gap-4 relative">
          <div
            className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${theme.glow} blur-xl`}
          />
          <div
            className={`p-3 rounded-xl shrink-0 ${theme.bg} relative z-10 group-hover:scale-110 transition-transform duration-500`}
          >
            <Icon size={24} className={theme.text} />
          </div>
          <div className="flex flex-col min-w-0 relative z-10">
            <p className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate">
              {label}
            </p>
            <h4 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white leading-none mt-1 truncate group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-600 group-hover:to-blue-600 transition-all duration-500">
              {value}
            </h4>
          </div>
        </CardBody>
      </Card>
    );
  },
);

/**
 * An expandable badge for status details.
 */
const StatusBadge = React.memo(
  ({ type, status }: { type: "reg" | "pay"; status: string }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const label = type === "reg" ? "Registration" : "Payment";
    const color = getBadgeColor(status);
    const icon = getStatusIcon(type, status);

    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setIsExpanded(!isExpanded);
        }}
        className="group focus:outline-none active:scale-95 transition-transform"
      >
        <Badge size="sm" color={color}>
          <div className="flex items-center gap-1.5 min-w-0">
            {icon}
            <span className="capitalize text-xs tracking-wide">{status}</span>
            <div
              className={`flex items-center overflow-hidden transition-all duration-300 ease-out ${
                isExpanded
                  ? "max-w-[150px] opacity-100 ml-1"
                  : "max-w-0 opacity-0"
              }`}
            >
              <div className="h-3 w-px bg-current opacity-40 mx-1" />
              <span className="text-[10px] uppercase tracking-wider font-medium whitespace-nowrap">
                {label}
              </span>
            </div>
            <ChevronRight
              size={14}
              className={`transition-transform duration-300 ease-out opacity-80 ${
                isExpanded ? "rotate-180" : "rotate-0"
              } ${isExpanded ? "ml-1" : "ml-0.5"}`}
            />
          </div>
        </Badge>
      </button>
    );
  },
);

/**
 * Event card component to display single registration details.
 */
const EventCard = React.memo(({ reg }: { reg: EventRegistration }) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const formattedDate = React.useMemo(() => {
    try {
      return dateFormatter.format(new Date(reg.registered_at));
    } catch (e) {
      return "Invalid Date";
    }
  }, [reg.registered_at]);

  // Use backend image or fallback UI Avatar
  const imageUrl =
    reg.event.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      reg.event.name,
    )}&size=640&background=03a1b0&color=fff&bold=true`;

  return (
    <Card
      shadow="none"
      className="group relative overflow-hidden rounded-2xl select-none transition-all duration-500 ease-out border border-black/10 dark:border-white/10 
                 bg-black/1 dark:bg-white/1
                 backdrop-blur-sm hover:shadow-2xl hover:border-cyan-500/30 dark:hover:border-cyan-500/50 hover:scale-[1.02] hover:-translate-y-1"
    >
      <CardHeader className="p-0 overflow-hidden relative aspect-video">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
        )}
        <img
          src={imageUrl}
          alt={`${reg.event.name} cover`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`object-cover w-full h-full transition-all duration-700 ease-out group-hover:scale-105 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      </CardHeader>

      <CardBody className="p-5 flex flex-col gap-4 relative z-10">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-extrabold tracking-tight !text-black dark:!text-white line-clamp-1 drop-shadow-sm relative">
            {reg.event.name}
          </h3>
          <div className="h-1 w-12 bg-[#03a1b0] rounded-full opacity-80 group-hover:w-24 transition-all duration-500" />
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <StatusBadge type="reg" status={reg.registration_status} />
            <StatusBadge type="pay" status={reg.payment_status} />
          </div>
        </div>

        <div className="flex justify-between items-center text-sm mt-1 p-3 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
          <span className="!text-gray-600 font-bold dark:!text-gray-400 text-xs uppercase flex items-center gap-1">
            <Calendar size={12} />
            Registered On
          </span>
          <span className="!text-black font-black dark:!text-gray-100 font-mono text-sm">
            {formattedDate}
          </span>
        </div>

        <div className="pt-2 grid grid-cols-1 gap-3">
          <Button
            as={Link}
            // Ensure absolute path construction is safe
            to={`/${currentUser?.username || "user"}/event-registrations/${reg.uuid}`}
            className="w-full h-10 font-semibold rounded-lg flex items-center justify-center gap-2 border border-[#03a1b0] text-[#03a1b0] bg-transparent hover:bg-[#03a1b0]/10 dark:border-cyan-500 dark:text-cyan-400 transition-all hover:scale-105"
          >
            <Eye size={18} /> Details
          </Button>
        </div>
      </CardBody>
    </Card>
  );
});

// ==================== MAIN PAGE COMPONENT ====================

/**
 * EventRegistrationCards Component
 *
 * Displays a paginated, filterable grid of event registrations.
 *
 * Features:
 * - Persists pagination state (page/rows) in LocalStorage.
 * - Client-side filtering (Search, Payment Status, Registration Status).
 * - Stats overview.
 */
export default function UserEventRegistrationCards() {
  // ---------------- STATE: Pagination (Persisted) ----------------
  // We initialize state by reading from localStorage to maintain position on refresh.
  const [page, setPage] = React.useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAGE);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [rowsPerPage, setRowsPerPage] = React.useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROWS);
      return saved ? parseInt(saved, 10) : 8;
    } catch {
      return 8;
    }
  });

  // ---------------- STATE: Data ----------------
  const [totalItems, setTotalItems] = React.useState(0);
  const [registrations, setRegistrations] = React.useState<EventRegistration[]>(
    [],
  );
  const [stats, setStats] = React.useState<
    EventRegistrationStats | undefined
  >();

  // ---------------- STATE: Filters & UI ----------------
  const [searchTerm, setSearchTerm] = React.useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [filters, setFilters] = React.useState<FilterState>({
    regStatus: "all",
    payStatus: "all",
    timeRange: "all",
  });
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  // ---------------- STATE: Loading & Error ----------------
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // ---------------- EFFECT: Persistence ----------------
  // Save pagination state whenever it changes
  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAGE, page.toString());
    localStorage.setItem(STORAGE_KEYS.ROWS, rowsPerPage.toString());
  }, [page, rowsPerPage]);

  // ---------------- DATA FETCHING ----------------
  const fetchData = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      const user = getUserFromStorage();
      const role = user?.role;

      if (!token || !role) {
        throw new Error("Authentication credentials missing");
      }

      const endpoint = `/${role}/event/registrations?page=${page + 1}&per_page=${rowsPerPage}`;

      const response = await axios.get<EventRegistrationApiResponse>(
        `${API_BASE_URL}${endpoint}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Handle Stats
      if (response.data.stats) {
        setStats(response.data.stats);
      }

      const rawData = response.data.data;

      // Handle different response structures (Pagination Object vs Flat Array)
      if (Array.isArray(rawData)) {
        setRegistrations(rawData);
        setTotalItems(rawData.length);
      } else if (rawData && typeof rawData === "object" && "data" in rawData) {
        // It is a PaginatedData object
        setRegistrations(rawData.data);
        setTotalItems(rawData.total || 0);
      } else {
        setRegistrations([]);
        setTotalItems(0);
      }
    } catch (err: any) {
      // 404 usually means no registrations found for this page
      if (err.response && err.response.status === 404) {
        setRegistrations([]);
        setTotalItems(0);
      } else {
        console.error("Fetch error:", err);
        setError("Failed to load registrations");
      }
    } finally {
      setIsLoading(false);
    }
  }, [page, rowsPerPage]);

  // Fetch on mount and when pagination changes
  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ---------------- FILTERING LOGIC ----------------
  // Filters apply to the currently loaded page of data (client-side).
  const processedEventRegistrations = React.useMemo(() => {
    if (!registrations) return [];

    return registrations.filter((item) => {
      // Guard clause if event object is missing
      if (!item.event) return false;

      const searchLower = debouncedSearchTerm.toLowerCase();
      const matchesSearch =
        item.event.name.toLowerCase().includes(searchLower) ||
        item.ticket_code.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      if (
        filters.regStatus !== "all" &&
        item.registration_status !== filters.regStatus
      ) {
        return false;
      }
      if (
        filters.payStatus !== "all" &&
        item.payment_status !== filters.payStatus
      ) {
        return false;
      }

      if (filters.timeRange !== "all") {
        const date = new Date(item.registered_at);
        const now = new Date();
        const diffDays = Math.ceil(
          Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
        );
        if (filters.timeRange === "7days" && diffDays > 7) return false;
        if (filters.timeRange === "30days" && diffDays > 30) return false;
        if (filters.timeRange === "90days" && diffDays > 90) return false;
      }
      return true;
    });
  }, [registrations, debouncedSearchTerm, filters]);

  // ---------------- HANDLERS ----------------

  const handleChangePage = React.useCallback((_: unknown, newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleChangeRowsPerPage = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newRows = parseInt(event.target.value, 10);
      setRowsPerPage(newRows);
      setPage(0); // Reset to first page to avoid out-of-bounds
    },
    [],
  );

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ regStatus: "all", payStatus: "all", timeRange: "all" });
    setSearchTerm("");
  };

  const activeFiltersCount = Object.values(filters).filter(
    (v) => v !== "all",
  ).length;

  // ---------------- RENDER ----------------
  return (
    <section className="relative w-full min-h-screen mx-auto px-0 sm:px-16 space-y-8 py-4 sm:py-8">
      {/* Background Gradients */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-emerald-500/5 via-teal-500/5 to-cyan-500/5 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* 1. Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          icon={LayoutGrid}
          label="Total Registrations"
          value={stats?.total_registrations ?? "-"}
          color="cyan"
          isLoading={isLoading}
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed Events"
          value={stats?.completed_events ?? "-"}
          color="emerald"
          isLoading={isLoading}
        />
        <StatCard
          icon={AlertCircle}
          label="Pending Payments"
          value={stats?.pending_payments ?? "-"}
          color="amber"
          isLoading={isLoading}
        />
        <StatCard
          icon={Hourglass}
          label="Upcoming Events"
          value={stats?.upcoming_events ?? "-"}
          color="purple"
          isLoading={isLoading}
        />
      </div>

      {/* 2. Header & Controls */}
      <div className="w-full mx-auto flex flex-col md:flex-row gap-4 items-center justify-between sticky top-16 md:top-20 z-30 py-4 bg-white/80 dark:bg-black/80 backdrop-blur-sm -mx-4 px-4 rounded-b-2xl border-b border-black/5 dark:border-white/5 transition-all">
        <h2 className="text-2xl font-black text-black dark:text-white tracking-tight flex items-center gap-3 whitespace-nowrap group">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 group-hover:scale-110 transition-transform duration-300">
            <Ticket className="text-[#03a1b0] group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <span className="hidden sm:inline">Your Registrations</span>
          <span className="sm:hidden">Registrations</span>
        </h2>

        {/* Search & Filter */}
        <div className="flex gap-2 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 md:w-64 lg:w-80 min-w-0 group">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-10 rounded-lg bg-gray-50 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-[#03a1b0] focus:ring-2 focus:ring-[#03a1b0]/20 outline-none transition-all text-sm text-black dark:text-white placeholder-gray-500"
            />
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 ${
                searchTerm ? "text-[#03a1b0]" : ""
              }`}
              size={16}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Popover */}
          <Popover
            placement="bottom-end"
            isOpen={isFilterOpen}
            onOpenChange={setIsFilterOpen}
          >
            <PopoverTrigger>
              <Button
                className={`h-10 px-4 min-w-fit font-semibold border ${
                  activeFiltersCount > 0
                    ? "text-[#03a1b0] border-[#03a1b0]/30"
                    : "bg-white dark:bg-white/5 border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-300"
                }`}
              >
                <Filter size={16} />
                <span className="hidden sm:inline">Filter</span>
                {activeFiltersCount > 0 && (
                  <span className="ml-1 bg-[#03a1b0] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 px-3 py-3 bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-sm border border-black/10 dark:border-white/10 shadow-2xl rounded-xl">
              <div className="space-y-4 w-full">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-sm text-black dark:text-white">
                    Filter Registrations
                  </h4>
                  <button
                    onClick={clearFilters}
                    className="text-xs text-[#03a1b0] hover:underline flex items-center gap-1"
                  >
                    <XCircle size={12} /> Reset
                  </button>
                </div>

                {/* Status Filters */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    Registration Status
                  </label>
                  <div className="relative group">
                    <select
                      className="appearance-none w-full p-2.5 pr-8 rounded-xl bg-gray-50 dark:bg-[#1f2128] border border-gray-200 dark:border-white/10 text-sm font-medium text-gray-900 dark:text-gray-100 outline-none focus:border-[#03a1b0] focus:ring-2 focus:ring-[#03a1b0]/20 transition-all cursor-pointer hover:border-[#03a1b0]/50"
                      value={filters.regStatus}
                      onChange={(e) =>
                        handleFilterChange("regStatus", e.target.value)
                      }
                    >
                      <option
                        className="bg-white dark:bg-[#18181b]"
                        value="all"
                      >
                        All
                      </option>
                      <option
                        className="bg-white dark:bg-[#18181b]"
                        value="confirmed"
                      >
                        Confirmed
                      </option>
                      <option
                        className="bg-white dark:bg-[#18181b]"
                        value="pending"
                      >
                        Pending
                      </option>
                      <option
                        className="bg-white dark:bg-[#18181b]"
                        value="waitlisted"
                      >
                        Waitlisted
                      </option>
                      <option
                        className="bg-white dark:bg-[#18181b]"
                        value="cancelled"
                      >
                        Cancelled
                      </option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-[#03a1b0] transition-colors">
                      <ChevronRight
                        size={16}
                        className="rotate-90"
                        strokeWidth={2.5}
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Status Filter */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    Payment Status
                  </label>
                  <div className="relative group">
                    <select
                      className="appearance-none w-full p-2.5 pr-8 rounded-xl bg-gray-50 dark:bg-[#1f2128] border border-gray-200 dark:border-white/10 text-sm font-medium text-gray-900 dark:text-gray-100 outline-none focus:border-[#03a1b0] focus:ring-2 focus:ring-[#03a1b0]/20 transition-all cursor-pointer hover:border-[#03a1b0]/50"
                      value={filters.payStatus}
                      onChange={(e) =>
                        handleFilterChange("payStatus", e.target.value)
                      }
                    >
                      <option
                        className="bg-white dark:bg-[#18181b]"
                        value="all"
                      >
                        All
                      </option>
                      <option
                        className="bg-white dark:bg-[#18181b]"
                        value="success"
                      >
                        Success
                      </option>
                      <option
                        className="bg-white dark:bg-[#18181b]"
                        value="pending"
                      >
                        Pending
                      </option>
                      <option
                        className="bg-white dark:bg-[#18181b]"
                        value="failed"
                      >
                        Failed
                      </option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-[#03a1b0] transition-colors">
                      <ChevronRight
                        size={16}
                        className="rotate-90"
                        strokeWidth={2.5}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-[#03a1b0] text-white font-bold h-10 rounded-lg hover:bg-[#028a96] transition-colors shadow-lg"
                  onClick={() => setIsFilterOpen(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* 3. Grid Content */}
      <div className="relative z-10">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : processedEventRegistrations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
            {processedEventRegistrations.map((reg, index) => (
              <div
                key={reg.uuid}
                className="animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <EventCard reg={reg} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl bg-white/50 dark:bg-white/5">
            <Search size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              No registrations found
            </h3>
            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
            <Button
              onClick={clearFilters}
              className="mt-4 bg-[#03a1b0] text-white"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      {/* 4. Enhanced Pagination */}
      <div className="fixed z-30 bottom-8 w-full sm:w-[28%] flex right-0 sm:right-22 items-center py-3 rounded-xl bg-white/70 dark:bg-black/70 backdrop-blur-sm border border-black/5 dark:border-white/5">
        <TablePagination
          component="div"
          count={totalItems}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[12, 24, 50, 100]}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Per Page"
          className="mx-auto"
          sx={{
            color: "inherit",
            ".MuiSvgIcon-root": { color: "inherit" },
            "& .MuiTablePagination-select": { color: "inherit" },
            "& .MuiTablePagination-actions button": {
              transition: "all 0.3s",
              "&:hover": { transform: "scale(1.1)" },
            },
          }}
          slotProps={{
            select: {
              MenuProps: {
                PaperProps: {
                  className:
                    "!bg-black/5 dark:!bg-white/5 !text-black dark:!text-white !backdrop-blur-sm !rounded-lg !shadow-xl",
                  sx: {
                    "& .MuiMenuItem-root.Mui-selected": {
                      bgcolor: "#03a1b0 !important",
                      fontWeight: "bold",
                    },
                    "& .MuiMenuItem-root:hover": {
                      bgcolor: "rgba(3, 161, 176, 0.08) !important",
                      transform: "scale(1.02)",
                    },
                  },
                },
              },
            },
          }}
        />
      </div>
    </section>
  );
}

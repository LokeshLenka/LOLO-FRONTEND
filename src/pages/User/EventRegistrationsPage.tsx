import * as React from "react";
import TablePagination from "@mui/material/TablePagination";
import { Link } from "react-router-dom";
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
import Badge from "../../components/ui/badge/Badge";
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
  Sparkles,
  Calendar,
} from "lucide-react";

// ==================== TYPES ====================
interface EventRegistration {
  uuid: string;
  registered_at: string;
  is_paid: boolean;
  registration_status: "confirmed" | "pending" | "waitlisted" | "cancelled";
  ticket_code: string;
  payment_status: "success" | "pending" | "failed";
  payment_reference: string;
  event: {
    uuid: string;
    name: string;
    image?: string;
  };
}

// ==================== CONSTANTS ====================
const TOTAL = 100;
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

const stock = (seed: string, w = 640, h = 360) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

const make = (i: number): EventRegistration => ({
  uuid: `uuid-${i}`,
  registered_at: new Date(
    Date.now() - Math.floor(Math.random() * 10000000000)
  ).toISOString(),
  is_paid: i % 2 === 0,
  registration_status: (
    ["confirmed", "pending", "waitlisted", "cancelled"] as const
  )[i % 4],
  ticket_code: `LOLO-TICKET-${i}`,
  payment_status: (["success", "pending", "failed"] as const)[i % 3],
  payment_reference: `TXN-${i}`,
  event: {
    uuid: `event-${i}`,
    name: `Event Name ${i + 1}`,
    image: stock(`event-${i}`, 640, 360),
  },
});

const MOCK_DATA = Array.from({ length: TOTAL }, (_, i) => make(i));

const MOCK_STATS = {
  total_registrations: TOTAL,
  upcoming_events: 12,
  completed_events: 88,
  pending_payments: 5,
};

const getBadgeColor = (s: string) => {
  switch (s) {
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

const getStatusIcon = (type: "reg" | "pay", status: string) => {
  if (type === "reg") {
    if (status === "confirmed") return <UserCheck size={14} />;
    if (status === "cancelled") return <XCircle size={14} />;
    return <Clock size={14} />;
  } else {
    if (status === "success") return <CreditCard size={14} />;
    if (status === "failed") return <XCircle size={14} />;
    return <Clock size={14} />;
  }
};

// ==================== CUSTOM HOOKS ====================
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const useRegistrationsFilter = (
  registrations: EventRegistration[],
  searchTerm: string,
  filters: any
) => {
  return React.useMemo(() => {
    return registrations.filter((item) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        item.event.name.toLowerCase().includes(searchLower) ||
        item.ticket_code.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;

      if (
        filters.regStatus !== "all" &&
        item.registration_status !== filters.regStatus
      )
        return false;
      if (
        filters.payStatus !== "all" &&
        item.payment_status !== filters.payStatus
      )
        return false;

      if (filters.timeRange !== "all") {
        const date = new Date(item.registered_at);
        const now = new Date();
        const diffDays = Math.ceil(
          Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (filters.timeRange === "7days" && diffDays > 7) return false;
        if (filters.timeRange === "30days" && diffDays > 30) return false;
        if (filters.timeRange === "90days" && diffDays > 90) return false;
      }
      return true;
    });
  }, [registrations, searchTerm, filters]);
};

// ==================== SKELETON LOADERS ====================
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

// ==================== COMPONENTS ====================
const StatCard = React.memo(
  ({
    icon: Icon,
    label,
    value,
    color,
    isLoading,
  }: {
    icon: any;
    label: string;
    value: string | number;
    color: "cyan" | "purple" | "emerald" | "amber";
    isLoading?: boolean;
  }) => {
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
          {/* Glassmorphism glow effect */}
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
  }
);

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
  }
);

const EventCard = React.memo(({ reg }: { reg: EventRegistration }) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const formattedDate = React.useMemo(
    () => dateFormatter.format(new Date(reg.registered_at)),
    [reg.registered_at]
  );

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
          src={reg.event.image}
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

        <div className="pt-2 grid grid-cols-2 gap-3">
          <Button
            as={Link}
            to={`/tickets/${reg.uuid}`}
            className="w-full h-10 font-semibold rounded-lg flex items-center justify-center gap-2 border border-[#03a1b0] text-[#03a1b0] bg-transparent hover:bg-[#03a1b0]/10 dark:border-cyan-500 dark:text-cyan-400 transition-all hover:scale-105"
          >
            <Eye size={18} /> Details
          </Button>
          <Button
            as={Link}
            to={`/tickets/${reg.uuid}`}
            className="w-full h-10 font-semibold rounded-lg text-white flex items-center justify-center gap-2 bg-[#03a1b0] hover:bg-[#008b99] shadow-md hover:shadow-lg shadow-lg transition-all hover:scale-105"
          >
            <Ticket size={18} /> Ticket
          </Button>
        </div>
      </CardBody>
    </Card>
  );
});

// ==================== MAIN COMPONENT ====================
export default function EventRegistrationCards() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(8);
  const [searchTerm, setSearchTerm] = React.useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [filters, setFilters] = React.useState({
    regStatus: "all",
    payStatus: "all",
    timeRange: "all",
  });
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  // Loading states
  const [isLoadingStats, setIsLoadingStats] = React.useState(true);
  const [isLoadingCards, setIsLoadingCards] = React.useState(true);

  // Simulate data loading
  React.useEffect(() => {
    const statsTimer = setTimeout(() => setIsLoadingStats(false), 1000);
    const cardsTimer = setTimeout(() => setIsLoadingCards(false), 1200);
    return () => {
      clearTimeout(statsTimer);
      clearTimeout(cardsTimer);
    };
  }, []);

  const filteredData = useRegistrationsFilter(
    MOCK_DATA,
    debouncedSearchTerm,
    filters
  );

  const pageItems = React.useMemo(() => {
    const start = page * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [page, rowsPerPage, filteredData]);

  const handleChangePage = React.useCallback((_: any, newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleChangeRowsPerPage = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
    []
  );

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const clearFilters = () => {
    setFilters({ regStatus: "all", payStatus: "all", timeRange: "all" });
    setSearchTerm("");
    setPage(0);
  };

  const activeFiltersCount = Object.values(filters).filter(
    (v) => v !== "all"
  ).length;

  return (
    <section className="relative w-full min-h-screen mx-auto px-0 sm:px-16 space-y-8 py-4 sm:py-8">
      {/* Animated background gradient */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-emerald-500/5 via-teal-500/5 to-cyan-500/5 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* 1. Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          icon={LayoutGrid}
          label="Total Registrations"
          value={MOCK_STATS.total_registrations}
          color="cyan"
          isLoading={isLoadingStats}
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed Events"
          value={MOCK_STATS.completed_events}
          color="emerald"
          isLoading={isLoadingStats}
        />
        <StatCard
          icon={AlertCircle}
          label="Pending Payments"
          value={MOCK_STATS.pending_payments}
          color="amber"
          isLoading={isLoadingStats}
        />
        <StatCard
          icon={Hourglass}
          label="Upcoming Events"
          value={MOCK_STATS.upcoming_events}
          color="purple"
          isLoading={isLoadingStats}
        />
      </div>

      {/* 2. Sticky Header with Glassmorphism */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-16 md:top-20 z-40 py-4 bg-white/80 dark:bg-black/80 backdrop-blur-sm -mx-4 px-4 rounded-b-2xl border-b border-black/5 dark:border-white/5 transition-all">
        <h2 className="text-2xl font-black text-black dark:text-white tracking-tight flex items-center gap-3 whitespace-nowrap group">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 group-hover:scale-110 transition-transform duration-300">
            <Ticket className="text-[#03a1b0] group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <span className="hidden sm:inline">Your Registrations</span>
          <span className="sm:hidden">Registrations</span>
        </h2>

        {/* Search & Filter Controls */}
        <div className="flex gap-2 w-full md:w-auto">
          {/* Enhanced Search Input */}
          <div className="relative flex-1 md:w-64 lg:w-80 min-w-0 group">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              className="w-full h-10 pl-10 pr-10 rounded-lg bg-gray-50 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-[#03a1b0] focus:ring-2 focus:ring-[#03a1b0]/20 outline-none transition-all text-sm text-black dark:text-white placeholder-gray-500 group-hover:border-[#03a1b0]/50"
            />
            <Search
              className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-all ${
                searchTerm ? "text-[#03a1b0] scale-110" : ""
              }`}
              size={16}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors group/btn"
              >
                <X
                  size={14}
                  className="group-hover/btn:rotate-90 transition-transform"
                />
              </button>
            )}
            {searchTerm && (
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 animate-pulse" />
            )}
          </div>

          {/* Enhanced Filter Popover */}
          <Popover
            placement="bottom-end"
            isOpen={isFilterOpen}
            onOpenChange={setIsFilterOpen}
          >
            <PopoverTrigger>
              <Button
                className={`h-10 px-4 min-w-fit shrink-0 font-semibold border transition-all duration-300 group ${
                  activeFiltersCount > 0
                    ? "bg-gradient-to-r from-[#03a1b0]/10 to-cyan-500/10 text-[#03a1b0] border-[#03a1b0]/30 shadow-md scale-105"
                    : "bg-white dark:bg-white/5 border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 hover:scale-105"
                }`}
              >
                <Filter
                  size={16}
                  className={`${
                    activeFiltersCount > 0
                      ? "animate-pulse"
                      : "group-hover:rotate-12"
                  } transition-transform`}
                />
                <span className="hidden sm:inline whitespace-nowrap">
                  Filter
                </span>
                {activeFiltersCount > 0 && (
                  <span className="ml-1 bg-[#03a1b0] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-bounce">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-80 px-3 py-3 bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-sm border border-black/10 dark:border-white/10 shadow-2xl rounded-xl animate-in fade-in slide-in-from-top-2">
              <div className="space-y-4 w-full">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-sm text-black dark:text-white flex items-center gap-2">
                    <Filter size={14} className="text-[#03a1b0]" />
                    Filter Registrations
                  </h4>
                  <button
                    onClick={clearFilters}
                    className="text-xs text-[#03a1b0] hover:underline font-medium flex items-center gap-1 hover:scale-105 transition-transform"
                  >
                    <XCircle size={12} />
                    Reset all
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Registration Status
                  </label>
                  <select
                    className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm text-black dark:text-white outline-none focus:border-[#03a1b0] focus:ring-2 focus:ring-[#03a1b0]/20 transition-all cursor-pointer hover:border-[#03a1b0]/50"
                    value={filters.regStatus}
                    onChange={(e) =>
                      handleFilterChange("regStatus", e.target.value)
                    }
                  >
                    <option value="all" className="bg-white dark:bg-[#18181b]">
                      All Statuses
                    </option>
                    <option
                      value="confirmed"
                      className="bg-white dark:bg-[#18181b]"
                    >
                      Confirmed
                    </option>
                    <option
                      value="pending"
                      className="bg-white dark:bg-[#18181b]"
                    >
                      Pending
                    </option>
                    <option
                      value="waitlisted"
                      className="bg-white dark:bg-[#18181b]"
                    >
                      Waitlisted
                    </option>
                    <option
                      value="cancelled"
                      className="bg-white dark:bg-[#18181b]"
                    >
                      Cancelled
                    </option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Payment Status
                  </label>
                  <select
                    className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm text-black dark:text-white outline-none focus:border-[#03a1b0] focus:ring-2 focus:ring-[#03a1b0]/20 transition-all cursor-pointer hover:border-[#03a1b0]/50"
                    value={filters.payStatus}
                    onChange={(e) =>
                      handleFilterChange("payStatus", e.target.value)
                    }
                  >
                    <option value="all" className="bg-white dark:bg-[#18181b]">
                      All Payments
                    </option>
                    <option
                      value="success"
                      className="bg-white dark:bg-[#18181b]"
                    >
                      Success
                    </option>
                    <option
                      value="pending"
                      className="bg-white dark:bg-[#18181b]"
                    >
                      Pending
                    </option>
                    <option
                      value="failed"
                      className="bg-white dark:bg-[#18181b]"
                    >
                      Failed
                    </option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                    <Calendar size={12} />
                    Date Range
                  </label>
                  <select
                    className="w-full p-2.5 rounded-lg bg-gray-50 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm text-black dark:text-white outline-none focus:border-[#03a1b0] focus:ring-2 focus:ring-[#03a1b0]/20 transition-all cursor-pointer hover:border-[#03a1b0]/50"
                    value={filters.timeRange}
                    onChange={(e) =>
                      handleFilterChange("timeRange", e.target.value)
                    }
                  >
                    <option value="all" className="bg-white dark:bg-[#18181b]">
                      All Time
                    </option>
                    <option
                      value="7days"
                      className="bg-white dark:bg-[#18181b]"
                    >
                      Last 7 Days
                    </option>
                    <option
                      value="30days"
                      className="bg-white dark:bg-[#18181b]"
                    >
                      Last 30 Days
                    </option>
                    <option
                      value="90days"
                      className="bg-white dark:bg-[#18181b]"
                    >
                      Last 3 Months
                    </option>
                  </select>
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-[#03a1b0] to-cyan-600 text-white font-bold h-10 rounded-lg hover:from-[#028a96] hover:to-cyan-700 transition-all shadow-lg shadow-lg hover:scale-105 duration-300"
                  onClick={() => setIsFilterOpen(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* 3. Results Summary */}
      {filteredData.length !== TOTAL && (
        <div className="flex items-center justify-between gap-4 text-sm -mt-4 px-1 animate-in fade-in slide-in-from-top-2 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 p-3 rounded-lg border border-cyan-200 dark:border-cyan-700/30">
          <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Search size={14} className="text-[#03a1b0]" />
            Found <b className="text-[#03a1b0]">{filteredData.length}</b>{" "}
            results
            {debouncedSearchTerm && (
              <span className="text-xs bg-[#03a1b0]/10 px-2 py-0.5 rounded-full text-[#03a1b0] font-medium">
                "{debouncedSearchTerm}"
              </span>
            )}
          </span>
          {(searchTerm || activeFiltersCount > 0) && (
            <button
              onClick={clearFilters}
              className="text-[#03a1b0] hover:underline font-medium flex items-center gap-1 hover:scale-105 transition-all group"
            >
              <XCircle
                size={14}
                className="group-hover:rotate-90 transition-transform"
              />
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* 4. Grid with Loading Skeletons */}
      <div className="relative z-10">
        {isLoadingCards ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        ) : pageItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
            {pageItems.map((reg, index) => (
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
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-white/5 dark:to-white/[0.02] backdrop-blur-sm animate-in fade-in zoom-in">
            <div className="relative">
              <Search size={48} className="text-gray-300 mb-4" />
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              No registrations found
            </h3>
            <p className="text-gray-500 text-sm mt-1 mb-4">
              Try adjusting your search or filters.
            </p>
            <Button
              onClick={clearFilters}
              className="bg-gradient-to-r from-[#03a1b0] to-cyan-600 text-white font-bold hover:scale-105 transition-transform shadow-lg"
            >
              Reset All Filters
            </Button>
          </div>
        )}
      </div>

      {/* 5. Enhanced Pagination */}
      <div className="flex justify-center sm:justify-end items-center py-3 rounded-xl bg-white/70 dark:bg-black/70 backdrop-blur-sm border border-black/5 dark:border-white/5">
        <TablePagination
          component="div"
          count={filteredData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Per Page"
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
                      // color: "#03a1b0",
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

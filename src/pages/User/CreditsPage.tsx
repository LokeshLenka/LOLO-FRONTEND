import * as React from "react";
import TablePagination from "@mui/material/TablePagination";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardBody,
  Button,
  Progress,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Skeleton,
} from "@heroui/react";
import {
  Eye,
  Coins,
  Calendar,
  TrendingUp,
  Zap,
  Star,
  Award,
  Trophy,
  Info,
  ChevronDown,
  Search,
  Filter,
  X,
  XCircle,
  ArrowUpDown,
  Sparkles,
  Activity,
  BarChart3,
  CheckCircle2,
  Lock,
} from "lucide-react";

// ==================== CONFIG ====================\
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Replace with actual URL

// ==================== TYPES ====================
interface Event {
  id: number;
  uuid: string;
  name: string;
  credits_awarded: number;
  end_date: string;
}

interface Credit {
  id: number;
  uuid: string;
  user_id: number;
  event_id: number;
  amount: number;
  created_at: string;
  updated_at: string;
  event: Event;
}

interface CreditStats {
  total_earned: number;
  this_month: number;
  avg_per_event: number;
  events_rewarded: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    credits: Credit[];
    total_credits: number;
    credits_count: number;
  };
}

// ==================== CONSTANTS ====================
const RANKS = [
  {
    name: "Bronze",
    min: 0,
    max: 49,
    color: "text-orange-800 dark:text-orange-400",
    bg: "bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/40 dark:to-orange-800/20",
    border: "border-orange-200 dark:border-orange-700/50",
    glow: "shadow-orange-500/20",
    icon: "🥉",
  },
  {
    name: "Silver",
    min: 50,
    max: 99,
    color: "text-slate-700 dark:text-slate-300",
    bg: "bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800/50 dark:to-slate-700/30",
    border: "border-slate-200 dark:border-slate-600/50",
    glow: "shadow-slate-500/20",
    icon: "🥈",
  },
  {
    name: "Gold",
    min: 100,
    max: 149,
    color: "text-yellow-800 dark:text-yellow-400",
    bg: "bg-gradient-to-br from-yellow-100 to-yellow-50 dark:from-yellow-900/40 dark:to-yellow-800/20",
    border: "border-yellow-200 dark:border-yellow-700/50",
    glow: "shadow-yellow-500/20",
    icon: "🥇",
  },
  {
    name: "Platinum",
    min: 150,
    max: Infinity,
    color: "text-cyan-800 dark:text-cyan-300",
    bg: "bg-gradient-to-br from-cyan-100 to-cyan-50 dark:from-cyan-900/40 dark:to-cyan-800/20",
    border: "border-cyan-200 dark:border-cyan-700/50",
    glow: "shadow-cyan-500/30",
    icon: "💎",
  },
];

const getRankInfo = (credits: number) => {
  const rank =
    RANKS.find((r) => credits >= r.min && credits <= r.max) ||
    RANKS[RANKS.length - 1];
  const nextRank = RANKS[RANKS.indexOf(rank) + 1];

  let progress = 100;
  let nextGoal = 0;

  if (nextRank) {
    const range = nextRank.min - rank.min;
    const current = credits - rank.min;
    progress = (current / range) * 100;
    nextGoal = nextRank.min;
  }

  return { current: rank, next: nextRank, progress, nextGoal };
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

// ==================== HELPERS ====================
const getAuthToken = () => localStorage.getItem("authToken");

const getUserFromStorage = () => {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
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

const useCreditsFilter = (
  credits: Credit[],
  searchTerm: string,
  filters: any,
  sortBy: string
) => {
  return React.useMemo(() => {
    let filtered = credits.filter((item) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = item.event?.name
        .toLowerCase()
        .includes(searchLower);
      if (!matchesSearch) return false;

      if (filters.timeRange !== "all") {
        const date = new Date(item.created_at);
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

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "high_amount":
          return b.amount - a.amount;
        case "low_amount":
          return a.amount - b.amount;
        default:
          return 0;
      }
    });
  }, [credits, searchTerm, filters, sortBy]);
};

// ==================== SKELETONS ====================
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

const CreditCardSkeleton = () => (
  <Card
    shadow="none"
    className="group relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-sm dark:from-white/[0.08] dark:to-white/[0.02] animate-pulse"
  >
    <CardBody className="p-5 flex flex-col h-full justify-between gap-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-3/4 rounded" />
        <Skeleton className="h-1 w-12 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-4 py-2">
        <div className="flex flex-col gap-2 p-3 rounded-xl bg-black/5 dark:bg-white/5">
          <Skeleton className="h-3 w-16 rounded" />
          <Skeleton className="h-6 w-12 rounded" />
        </div>
        <div className="flex flex-col gap-2 p-3 rounded-xl bg-black/5 dark:bg-white/5">
          <Skeleton className="h-3 w-16 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
      </div>
      <Skeleton className="h-11 w-full rounded-lg" />
    </CardBody>
  </Card>
);

// ==================== COMPONENTS ====================
const StatCard = React.memo(
  ({ icon: Icon, label, value, color, isLoading }: any) => {
    if (isLoading) return <StatCardSkeleton />;

    const colors: any = {
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
        className="group border border-black/5 dark:border-white/5 bg-black/2 dark:bg-white/1 backdrop-blur-sm rounded-2xl h-full overflow-hidden hover:border-black/10 dark:hover:border-white/15 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl"
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
  }
);

const RankProgressCard = React.memo(
  ({
    credits,
    onPress,
    isLoading,
  }: {
    credits: number;
    onPress: () => void;
    isLoading?: boolean;
  }) => {
    const { current, next, progress, nextGoal } = getRankInfo(credits);
    const isPlatinum = current.name === "Platinum";
    const [animatedProgress, setAnimatedProgress] = React.useState(0);
    const [isHovered, setIsHovered] = React.useState(false);

    React.useEffect(() => {
      const timer = setTimeout(() => setAnimatedProgress(progress), 100);
      return () => clearTimeout(timer);
    }, [progress]);

    if (isLoading) {
      return (
        <Card className="border-none w-full shadow-xl rounded-2xl overflow-hidden h-full min-h-[180px] bg-gradient-to-br from-gray-900 to-gray-800 animate-pulse">
          <CardBody className="p-6 md:p-8 flex flex-col gap-4">
            <Skeleton className="h-6 w-24 rounded bg-white/10" />
            <Skeleton className="h-10 w-32 rounded bg-white/10" />
            <Skeleton className="h-4 w-full rounded-full bg-white/10" />
          </CardBody>
        </Card>
      );
    }

    return (
      <Card
        isPressable
        onPress={onPress}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`border-none w-full shadow-xl text-white rounded-2xl overflow-hidden relative h-full cursor-pointer transition-all duration-500 ${
          isHovered ? "scale-[1.02] shadow-xl" : ""
        } ${
          isPlatinum
            ? "bg-gradient-to-br from-cyan-600 via-blue-600 to-purple-600"
            : "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
        }`}
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className={`absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] ${
              isHovered ? "animate-pulse" : ""
            }`}
          />
        </div>

        <CardBody className="p-6 md:p-8 relative z-10 flex flex-col justify-between h-full min-h-[180px]">
          <div className="absolute top-4 right-4 group">
            <Info
              size={20}
              className={`opacity-70 transition-all duration-300 ${
                isHovered
                  ? "opacity-100 rotate-12 scale-110"
                  : "hover:opacity-100"
              }`}
            />
          </div>

          <div className="flex justify-between items-start mb-4">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase opacity-70 mb-1 flex items-center gap-2">
                Current Rank
                <span className={`text-2xl`}>{current.icon}</span>
              </p>
              <h3
                className={`text-3xl font-black tracking-tight transition-all duration-300 ${
                  isHovered ? "scale-105 drop-shadow-lg" : ""
                }`}
              >
                {current.name}
              </h3>
            </div>
            <Trophy
              size={40}
              className={`opacity-20 rotate-12 transition-all duration-500 ${
                isHovered ? "opacity-30 rotate-0 scale-110" : ""
              }`}
            />
          </div>

          {!isPlatinum ? (
            <div className="mt-auto space-y-3">
              <div className="flex justify-between text-sm font-bold">
                <span className="flex items-center gap-1">
                  <Activity size={14} className="animate-pulse" />
                  {credits} pts
                </span>
                <span className="opacity-70">
                  {nextGoal} pts ({next?.name})
                </span>
              </div>
              <div className="relative">
                <Progress
                  value={animatedProgress}
                  classNames={{
                    indicator: `bg-gradient-to-r from-white via-cyan-200 to-white transition-all duration-1000 ease-out rounded-full ${
                      isHovered ? "animate-pulse" : ""
                    }`,
                    track: "bg-white/20 rounded-full",
                  }}
                  size="md"
                  className="mb-3 rounded-full"
                  radius="full"
                />
                <div
                  className="absolute -top-8 bg-black/80 text-white text-[10px] px-2 py-1 rounded-md font-bold backdrop-blur-sm"
                  style={{ left: `${Math.min(animatedProgress, 95)}%` }}
                >
                  {Math.round(animatedProgress)}%
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-md border border-white/20 flex gap-4 items-center mt-auto relative overflow-hidden">
              <div className="p-3 bg-white text-cyan-600 rounded-full shadow-lg shrink-0 relative z-10">
                <Award size={20} fill="currentColor" />
              </div>
              <div className="relative z-10">
                <h4 className="font-bold text-sm flex items-center gap-2">
                  Top Tier Reached!{" "}
                  <Sparkles size={14} className="animate-pulse" />
                </h4>
                <p className="text-[10px] opacity-90">
                  You are a legend. Keep it up! 🚀
                </p>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    );
  }
);

const CreditCardItem = React.memo(({ credit }: { credit: Credit }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const formattedDate = React.useMemo(
    () => dateFormatter.format(new Date(credit.created_at)),
    [credit.created_at]
  );

  return (
    <Card
      shadow="none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative overflow-hidden rounded-2xl select-none
      transition-transform transition-shadow duration-300 ease-out
      border border-black/10 dark:border-white/10
      bg-black/1 dark:bg-white/1
      backdrop-blur-sm
      ${
        isHovered
          ? "shadow-xl border-cyan-500/40 dark:border-cyan-500/40 scale-[1.02] -translate-y-1"
          : "hover:shadow-xl "
      }`}
    >
      <CardBody className="p-5 flex flex-col h-full justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-extrabold tracking-tight text-black dark:text-white line-clamp-1">
            {credit.event?.name || "Unknown Event"}
          </h3>
          <div
            className={`h-1 bg-[#03a1b0] rounded-full transition-all duration-300 ${
              isHovered ? "w-24" : "w-12"
            }`}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="flex flex-col gap-1 p-3 rounded-xl border bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5">
            <span className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Coins size={12} /> Earned
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-[#03a1b0]">
                {credit.amount}
              </span>
              <span className="text-xs font-semibold text-gray-400">LP</span>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-1 p-3 rounded-xl border bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5">
            <span className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Calendar size={12} /> Received
            </span>
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
              {formattedDate}
            </span>
          </div>
        </div>

        <Button
          as={Link}
          to={`/tickets/${credit.uuid}`}
          draggable={false}
          className="w-full h-11 font-semibold rounded-lg flex items-center justify-center gap-2
          text-white bg-[#03a1b0] hover:bg-[#008b99]
          transition-transform transition-shadow duration-300
          shadow-md hover:shadow-lg"
        >
          <Eye size={18} />
          <span>View Details</span>
        </Button>
      </CardBody>
    </Card>
  );
});

// ==================== MAIN COMPONENT ====================
export default function CreditsPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(12);
  const [expandedRank, setExpandedRank] = React.useState<string | null>(null);

  // Data States
  const [credits, setCredits] = React.useState<Credit[]>([]);
  const [stats, setStats] = React.useState<CreditStats>({
    total_earned: 0,
    this_month: 0,
    avg_per_event: 0,
    events_rewarded: 0,
  });

  // Loading States
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = React.useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [filters, setFilters] = React.useState({ timeRange: "all" });
  const [sortBy, setSortBy] = React.useState("newest");
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [isSortOpen, setIsSortOpen] = React.useState(false);

  // Fetch Data
  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = getAuthToken();
        const user = getUserFromStorage();
        const role = user?.role;

        if (!token || !role) {
          throw new Error("User not authenticated or role missing");
        }

        const endpoint = `/${role}/credits`;
        const response = await axios.get<ApiResponse>(
          `${API_BASE_URL}${endpoint}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          const { credits, total_credits, credits_count } = response.data.data;

          setCredits(credits);

          // Calculate derived stats
          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();

          const thisMonthCredits = credits
            .filter((c) => {
              const d = new Date(c.created_at);
              return (
                d.getMonth() === currentMonth && d.getFullYear() === currentYear
              );
            })
            .reduce((sum, c) => sum + c.amount, 0);

          const avg =
            credits_count > 0 ? Math.round(total_credits / credits_count) : 0;

          setStats({
            total_earned: total_credits,
            events_rewarded: credits_count,
            this_month: thisMonthCredits,
            avg_per_event: avg,
          });
        }
      } catch (err: any) {
        console.error("Failed to fetch credits:", err);
        setError(err.response?.data?.message || "Failed to load credits");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const processedCredits = useCreditsFilter(
    credits,
    debouncedSearchTerm,
    filters,
    sortBy
  );

  const pageItems = React.useMemo(() => {
    const start = page * rowsPerPage;
    return processedCredits.slice(start, start + rowsPerPage);
  }, [page, rowsPerPage, processedCredits]);

  const handleChangePage = React.useCallback((_: unknown, newPage: number) => {
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
    setFilters({ timeRange: "all" });
    setSearchTerm("");
    setSortBy("newest");
    setPage(0);
  };

  const activeFiltersCount = Object.values(filters).filter(
    (v) => v !== "all"
  ).length;

  const getSortLabel = (value: string) => {
    switch (value) {
      case "newest":
        return "Newest First";
      case "oldest":
        return "Oldest First";
      case "high_amount":
        return "Highest Amount";
      case "low_amount":
        return "Lowest Amount";
      default:
        return "Sort By";
    }
  };

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center flex-col gap-4">
        <h2 className="text-xl font-bold text-red-500">
          Error Loading Credits
        </h2>
        <p className="text-gray-500">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <section
      aria-label="Credits rewarded"
      className="relative w-full min-h-screen mx-auto space-y-8 px-0 sm:px-16 py-4 sm:py-8"
    >
      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-emerald-500/5 via-teal-500/5 to-cyan-500/5 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* 1. Top Section: Stats + Rank Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <StatCard
            icon={Coins}
            label="Total Earned"
            value={stats.total_earned}
            color="cyan"
            isLoading={isLoading}
          />
          <StatCard
            icon={Award}
            label="Events Rewarded"
            value={stats.events_rewarded}
            color="amber"
            isLoading={isLoading}
          />
          <StatCard
            icon={Zap}
            label="Avg per Event"
            value={stats.avg_per_event}
            color="purple"
            isLoading={isLoading}
          />
          <StatCard
            icon={TrendingUp}
            label="This Month"
            value={`+${stats.this_month}`}
            color="emerald"
            isLoading={isLoading}
          />
        </div>
        <div className="lg:col-span-1">
          <RankProgressCard
            credits={stats.total_earned}
            onPress={onOpen}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* 2. Search & Filter Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-16 md:top-20 z-40 py-4 bg-white/80 dark:bg-black/80 backdrop-blur-2xl -mx-4 px-4 rounded-b-2xl border-b border-black/5 dark:border-white/5 transition-all">
        <h2 className="text-2xl font-black text-black dark:text-white tracking-tight flex items-center gap-3 whitespace-nowrap group">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 group-hover:scale-110 transition-transform duration-300">
            <Star className="text-[#03a1b0] group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <span className="hidden sm:inline bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text">
            Credit History
          </span>
          <span className="sm:hidden">Credits</span>
        </h2>

        <div className="flex gap-2 w-full md:w-auto items-center">
          {/* Search Input */}
          <div className="relative flex-1 md:w-56 lg:w-72 min-w-0 group">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
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

          {/* Sort Popover */}
          <Popover
            placement="bottom-end"
            isOpen={isSortOpen}
            onOpenChange={setIsSortOpen}
          >
            <PopoverTrigger>
              <Button className="h-10 px-3 min-w-fit font-semibold border bg-white dark:bg-white/5 border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-300">
                <ArrowUpDown size={16} />
                <span className="hidden sm:inline text-xs">
                  {getSortLabel(sortBy)}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 px-1 py-1 bg-white dark:bg-[#18181b] border border-black/10 dark:border-white/10 shadow-xl rounded-lg">
              <div className="flex flex-col w-full gap-1">
                {[
                  { value: "newest", label: "Newest First" },
                  { value: "oldest", label: "Oldest First" },
                  { value: "high_amount", label: "Highest Amount" },
                  { value: "low_amount", label: "Lowest Amount" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setIsSortOpen(false);
                    }}
                    className={`px-3 py-2.5 text-sm text-left flex items-center gap-2 ${
                      sortBy === option.value
                        ? "text-[#03a1b0] font-bold"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

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
            <PopoverContent className="w-80 px-3 py-3 bg-white dark:bg-[#18181b] border border-black/10 dark:border-white/10 shadow-xl rounded-xl">
              <div className="space-y-4 w-full">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-sm text-black dark:text-white">
                    Filter Credits
                  </h4>
                  <button
                    onClick={clearFilters}
                    className="text-xs text-[#03a1b0] hover:underline flex items-center gap-1"
                  >
                    <XCircle size={12} /> Reset all
                  </button>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar size={12} />
                    Time Range
                  </label>
                  <div className="relative group">
                    <select
                      className="appearance-none w-full p-2.5 pr-8 rounded-xl bg-gray-50 dark:bg-[#1f2128] border border-gray-200 dark:border-white/10 text-sm font-medium text-gray-900 dark:text-gray-100 outline-none focus:border-[#03a1b0] focus:ring-2 focus:ring-[#03a1b0]/20 transition-all cursor-pointer hover:border-[#03a1b0]/50"
                      value={filters.timeRange}
                      onChange={(e) =>
                        handleFilterChange("timeRange", e.target.value)
                      }
                    >
                      <option
                        value="all"
                        className="bg-white dark:bg-[#18181b] text-gray-900 dark:text-gray-100 py-2"
                      >
                        All Time
                      </option>
                      <option
                        value="7days"
                        className="bg-white dark:bg-[#18181b] text-gray-900 dark:text-gray-100 py-2"
                      >
                        Last 7 Days
                      </option>
                      <option
                        value="30days"
                        className="bg-white dark:bg-[#18181b] text-gray-900 dark:text-gray-100 py-2"
                      >
                        Last 30 Days
                      </option>
                      <option
                        value="90days"
                        className="bg-white dark:bg-[#18181b] text-gray-900 dark:text-gray-100 py-2"
                      >
                        Last 3 Months
                      </option>
                    </select>

                    {/* Custom Arrow Icon */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-[#03a1b0] transition-colors">
                      <ChevronDown size={16} strokeWidth={2.5} />
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-[#03a1b0] text-white font-bold h-10 rounded-lg"
                  onClick={() => setIsFilterOpen(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* 3. Cards Grid */}
      <div className="relative z-10">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <CreditCardSkeleton key={i} />
            ))}
          </div>
        ) : pageItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
            {pageItems.map((credit, index) => (
              <div
                key={credit.id}
                className="animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CreditCardItem credit={credit} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl bg-white/50 dark:bg-white/5">
            <Search size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              No credits found
            </h3>
            <Button
              onClick={clearFilters}
              className="mt-4 bg-[#03a1b0] text-white"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      {/* 5. Enhanced Pagination */}
      <div className="flex fixed bottom-10 right-10 justify-center sm:justify-end items-center py-3 rounded-xl bg-white/70 dark:bg-black/70 backdrop-blur-sm border border-black/5 dark:border-white/5">
        <TablePagination
          component="div"
          count={processedCredits.length}
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

      {/* 5. Rank Modal (Fixed Blurring Issue) */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="opaque" // CHANGED: 'opaque' instead of 'blur' prevents double-blur issues
        size="lg"
        hideCloseButton={true}
        classNames={{
          backdrop: "bg-black/80 z-[999999]", // Dark overlay, no blur filter on backdrop
          base: "bg-white dark:bg-[#0F111A] border border-white/10 shadow-2xl z-[1000001]", // Solid background for modal
          wrapper: "z-[1000000]",
        }}
        motionProps={{
          variants: {
            enter: {
              scale: 1,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              scale: 0.95,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          },
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              {/* Header */}
              <ModalHeader className="border-b border-gray-200 dark:border-white/10 px-6 pt-6 pb-4 bg-white dark:bg-[#0F111A]">
                <h3 className="text-2xl font-black text-black dark:text-white flex items-center gap-3">
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <Trophy size={24} className="text-amber-500" />
                  </div>
                  Rank System
                </h3>
              </ModalHeader>

              {/* Body */}
              <ModalBody className="py-6 px-6 space-y-3 bg-white dark:bg-[#0F111A]">
                {RANKS.map((rank) => {
                  const isUnlocked = stats.total_earned >= rank.min;
                  const isExpanded = expandedRank === rank.name;
                  return (
                    <div
                      key={rank.name}
                      onClick={() =>
                        setExpandedRank(isExpanded ? null : rank.name)
                      }
                      className={`cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                        isUnlocked
                          ? `${rank.bg} ${rank.border}`
                          : "opacity-50 border-gray-200 dark:border-white/5 grayscale"
                      }`}
                    >
                      <div className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <span className="text-3xl filter drop-shadow-md">
                            {rank.icon}
                          </span>
                          <div>
                            <h4 className={`text-lg font-bold ${rank.color}`}>
                              {rank.name}
                            </h4>
                            {!isExpanded && (
                              <p className="text-xs text-gray-500 font-medium">
                                {rank.min} -{" "}
                                {rank.max === Infinity ? "∞" : rank.max} LP
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {isUnlocked ? (
                            <span className="flex items-center gap-1 text-xs font-bold bg-white/80 dark:bg-black/20 text-emerald-600 px-2 py-1 rounded-md">
                              <CheckCircle2 size={12} strokeWidth={3} />
                              Unlocked
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs font-bold bg-black/5 dark:bg-white/5 text-gray-500 px-2 py-1 rounded-md">
                              <Lock size={12} />
                              Locked
                            </span>
                          )}
                          <ChevronDown
                            size={16}
                            className={`text-gray-400 transition-transform duration-300 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </div>

                      {/* Expandable Details */}
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-0 animate-in fade-in slide-in-from-top-1">
                          <div className="p-3 rounded-lg bg-white/60 dark:bg-black/20 border border-black/5">
                            <h5 className="text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-2">
                              Requirements
                            </h5>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                              Earn{" "}
                              <span className="font-bold">{rank.min} LP</span>{" "}
                              to unlock this tier.
                            </p>
                            <h5 className="text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-2">
                              Perks
                            </h5>
                            <ul className="space-y-1.5">
                              <li className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                <Star size={12} className="text-amber-500" />{" "}
                                Exclusive Profile Badge
                              </li>
                              <li className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                <Zap size={12} className="text-cyan-500" />{" "}
                                Priority Event Access
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </ModalBody>

              {/* Footer */}
              <ModalFooter className="border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#151720] py-4">
                <Button
                  onPress={onClose}
                  className="w-full bg-[#03a1b0] text-white font-bold h-11 rounded-xl shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-transform"
                >
                  Got it!
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </section>
  );
}

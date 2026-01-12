import * as React from "react";
import TablePagination from "@mui/material/TablePagination";
import { Link } from "react-router-dom";
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
} from "lucide-react";

// ==================== TYPES ====================
interface Credit {
  id: number;
  uuid: string;
  user_id: number;
  event_id: number;
  assigned_by: number;
  amount: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  event: {
    uuid: string;
    name: string;
    credits_awarded: number;
  };
}

// ==================== CONSTANTS ====================
const TOTAL = 99;
const MOCK_USER_CREDITS = 190;

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

const makeCredit = (i: number): Credit => ({
  id: i + 1,
  uuid: `uuid-${i + 1}`,
  user_id: 1000 + i,
  event_id: 2000 + i,
  assigned_by: 3000 + i,
  amount: Math.floor(Math.random() * 500) + 50,
  created_at: new Date(
    Date.now() - Math.floor(Math.random() * 15552000000)
  ).toISOString(),
  updated_at: new Date().toISOString(),
  deleted_at: null,
  event: {
    uuid: `event-uuid-${i + 1}`,
    name: `Hackathon Event ${i + 1}`,
    credits_awarded: Math.random() * 1000 + 10,
  },
});

const MOCK_CREDITS = Array.from({ length: TOTAL }, (_, i) => makeCredit(i));

const MOCK_STATS = {
  total_earned: MOCK_USER_CREDITS,
  this_month: 45,
  avg_per_event: 10,
  events_rewarded: 4,
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
      const matchesSearch = item.event.name.toLowerCase().includes(searchLower);
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

// ==================== ENHANCED COMPONENTS ====================
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
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className={`absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] ${
              isHovered ? "animate-pulse" : ""
            }`}
          />
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-white/20 rounded-full ${
                isHovered ? "animate-ping" : ""
              }`}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
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
            {isHovered && (
              <span className="absolute -bottom-6 right-0 text-[10px] bg-black/50 px-2 py-1 rounded whitespace-nowrap animate-in fade-in slide-in-from-top-1">
                View Details
              </span>
            )}
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
                {/* Progress percentage indicator */}
                <div
                  className="absolute -top-8 bg-black/80 text-white text-[10px] px-2 py-1 rounded-md font-bold backdrop-blur-sm"
                  style={{ left: `${Math.min(animatedProgress, 95)}%` }}
                >
                  {Math.round(animatedProgress)}%
                </div>
              </div>
              <p className="text-xs opacity-80">
                Earn{" "}
                <span className="font-bold text-cyan-300">
                  {nextGoal - credits} more credits
                </span>{" "}
                to reach next tier.
              </p>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-md border border-white/20 flex gap-4 items-center mt-auto relative overflow-hidden">
              {/* Animated shine effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent ${
                  isHovered ? "animate-shimmer" : ""
                }`}
              />
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
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const formattedDate = React.useMemo(
    () => dateFormatter.format(new Date(credit.created_at)),
    [credit.created_at]
  );

  return (
    <Card
      shadow="none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDragStart={(e) => e.preventDefault()}
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
            {credit.event.name}
          </h3>

          <div
            className={`h-1 bg-[#03a1b0] rounded-full transition-all duration-300 ${
              isHovered ? "w-24" : "w-12"
            }`}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 py-2">
          {/* Earned */}
          <div
            className="flex flex-col gap-1 p-3 rounded-xl border
          bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5"
          >
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

          {/* Date */}
          <div
            className="flex flex-col justify-center gap-1 p-3 rounded-xl border
          bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5"
          >
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

  // Loading states
  const [isLoadingStats, setIsLoadingStats] = React.useState(true);
  const [isLoadingCredits, setIsLoadingCredits] = React.useState(true);

  // Search & Filter & Sort States
  const [searchTerm, setSearchTerm] = React.useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [filters, setFilters] = React.useState({ timeRange: "all" });
  const [sortBy, setSortBy] = React.useState("newest");
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [isSortOpen, setIsSortOpen] = React.useState(false);

  // Simulate data loading
  React.useEffect(() => {
    const statsTimer = setTimeout(() => setIsLoadingStats(false), 1000);
    const creditsTimer = setTimeout(() => setIsLoadingCredits(false), 1200);
    return () => {
      clearTimeout(statsTimer);
      clearTimeout(creditsTimer);
    };
  }, []);

  // Use custom hook for filtering
  const processedCredits = useCreditsFilter(
    MOCK_CREDITS,
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

  return (
    <section
      aria-label="Credits rewarded"
      className="relative w-full min-h-screen mx-auto space-y-8 px-0 sm:px-16 py-4 sm:py-8"
    >
      {/* Animated background gradient */}
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
            value={MOCK_STATS.total_earned}
            color="cyan"
            isLoading={isLoadingStats}
          />
          <StatCard
            icon={Award}
            label="Events Rewarded"
            value={MOCK_STATS.events_rewarded}
            color="amber"
            isLoading={isLoadingStats}
          />

          <StatCard
            icon={Zap}
            label="Avg per Event"
            value={MOCK_STATS.avg_per_event}
            color="purple"
            isLoading={isLoadingStats}
          />
          <StatCard
            icon={TrendingUp}
            label="This Month"
            value={`+${MOCK_STATS.this_month}`}
            color="emerald"
            isLoading={isLoadingStats}
          />
        </div>
        <div className="lg:col-span-1">
          <RankProgressCard
            credits={MOCK_USER_CREDITS}
            onPress={onOpen}
            isLoading={isLoadingStats}
          />
        </div>
      </div>

      {/* 2. Sticky Search Header with Glassmorphism */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-16 md:top-20 z-40 py-4 bg-white/80 dark:bg-black/80 backdrop-blur-2xl -mx-4 px-4 rounded-b-2xl border-b border-black/5 dark:border-white/5 transition-all">
        <h2 className="text-2xl font-black text-black dark:text-white tracking-tight flex items-center gap-3 whitespace-nowrap group">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 group-hover:scale-110 transition-transform duration-300">
            <Star className="text-[#03a1b0] group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <span className="hidden sm:inline bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text">
            Credit History
          </span>
          <span className="sm:hidden">Credits</span>
          <BarChart3
            size={20}
            className="text-cyan-500 opacity-50 group-hover:opacity-100 transition-opacity"
          />
        </h2>

        <div className="flex gap-2 w-full md:w-auto items-center">
          {/* Enhanced Search Input with icon animation */}
          <div className="relative flex-1 md:w-56 lg:w-72 min-w-0 group">
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
            {/* Search indicator */}
            {searchTerm && (
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 animate-pulse" />
            )}
          </div>

          {/* Enhanced Sort Dropdown */}
          <Popover
            placement="bottom-end"
            isOpen={isSortOpen}
            onOpenChange={setIsSortOpen}
          >
            <PopoverTrigger>
              <Button className="h-10 px-3 min-w-fit shrink-0 font-semibold border transition-all duration-300 bg-white dark:bg-white/5 border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 hover:border-[#03a1b0]/30 hover:scale-105 group">
                <ArrowUpDown
                  size={16}
                  className="group-hover:rotate-180 transition-transform duration-300"
                />
                <span className="hidden sm:inline whitespace-nowrap text-xs">
                  {getSortLabel(sortBy)}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 px-1 py-1 bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-sm border border-black/10 dark:border-white/10 shadow-xl rounded-lg animate-in fade-in slide-in-from-top-2">
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
                    className={`px-3 py-2.5 text-sm text-left transition-all duration-200 flex items-center gap-2 ${
                      sortBy === option.value
                        ? "bg-gradient-to-r from-[#03a1b0]/20 to-cyan-500/20 text-[#03a1b0] font-bold scale-105 shadow-sm"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:scale-102"
                    }`}
                  >
                    {sortBy === option.value && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#03a1b0] animate-pulse" />
                    )}
                    {option.label}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

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

            <PopoverContent className="w-80 px-3 py-3 bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-sm border border-black/10 dark:border-white/10 shadow-xl rounded-xl animate-in fade-in slide-in-from-top-2">
              <div className="space-y-4 w-full">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-sm text-black dark:text-white flex items-center gap-2">
                    <Filter size={14} className="text-[#03a1b0]" />
                    Filter Credits
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
                  <label className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                    <Calendar size={12} />
                    Time Range
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
                  className="w-full bg-[#03a1b0] text-white font-bold h-10 rounded-lg hover:from-[#028a96] hover:to-cyan-700 transition-all shadow-lg hover:scale-105 duration-300"
                  onClick={() => setIsFilterOpen(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* 3. Results Summary with animation */}
      {processedCredits.length !== TOTAL && (
        <div className="flex items-center justify-between gap-4 text-sm -mt-4 px-1 animate-in fade-in slide-in-from-top-2 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 p-3 rounded-lg border border-cyan-200 dark:border-cyan-700/30">
          <span className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <Search size={14} className="text-[#03a1b0]" />
            Found <b className="text-[#03a1b0]">
              {processedCredits.length}
            </b>{" "}
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
              />{" "}
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* 4. Cards Grid with Loading Skeletons */}
      <div className="relative z-10">
        {isLoadingCredits ? (
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
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-white/5 dark:to-white/[0.02] backdrop-blur-sm animate-in fade-in zoom-in">
            <div className="relative">
              <Search size={48} className="text-gray-300 mb-4" />
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              No credits found
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

      {/* --- Enhanced Rank Info Modal --- */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        size="lg"
        hideCloseButton={true}
        classNames={{
          backdrop: "bg-black/60 backdrop-blur-md z-[999999]",
          wrapper:
            "z-[1000000] flex items-end sm:items-center px-2 sm:px-0 mb-2",
          base: "dark:bg-[#0F111A] bg-white border border-black/5 dark:border-white/10 shadow-xl rounded-2xl z-[1000001] relative w-full sm:w-auto max-h-[90vh] sm:max-h-none",
        }}
        className="overflow-hidden bg-white/95 dark:bg-black/95 backdrop-blur-2xl border border-gray-400 dark:border-white/10 shadow-xl"
      >
        <ModalContent className="max-h-[90vh] sm:max-h-none overflow-y-auto">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-3 border-b border-gray-200 dark:border-white/5 pb-4 px-4 sm:px-6 pt-4 sm:pt-6 sticky top-0 z-20 bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-[#0F111A]/95 dark:to-black/95 backdrop-blur-sm">
                <h3 className="text-xl sm:text-2xl text-black dark:text-white font-black flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 animate-pulse">
                    <Trophy
                      size={24}
                      className="text-amber-600 dark:text-amber-400"
                    />
                  </div>
                  Rank System
                  <Sparkles
                    size={20}
                    className="text-cyan-500 animate-pulse ml-auto"
                  />
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                  Earn credits to unlock new tiers and exclusive rewards. 🚀
                </p>
              </ModalHeader>
              <ModalBody className="py-4 sm:py-6 px-4 sm:px-6">
                <div className="space-y-3">
                  {RANKS.map((rank, idx) => {
                    const isUnlocked = MOCK_USER_CREDITS >= rank.min;
                    const isExpanded = expandedRank === rank.name;
                    return (
                      <div
                        key={rank.name}
                        onClick={() =>
                          setExpandedRank(isExpanded ? null : rank.name)
                        }
                        className={`cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-500 ${
                          isUnlocked
                            ? `${rank.bg} ${rank.border} shadow-lg hover:shadow-xl hover:scale-[1.02]`
                            : "opacity-60 grayscale border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02] hover:opacity-80"
                        }`}
                      >
                        <div className="p-3 sm:p-4 flex justify-between items-start gap-2 sm:gap-4 relative">
                          {isUnlocked && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                          )}

                          <div className="flex items-center gap-2 sm:gap-3 min-w-0 relative z-10">
                            <span className={`text-2xl sm:text-3xl shrink-0`}>
                              {rank.icon}
                            </span>
                            <div className="flex flex-col">
                              <h4
                                className={`text-sm sm:text-lg font-bold ${rank.color} truncate flex items-center gap-2`}
                              >
                                {rank.name}
                                {isUnlocked && (
                                  <Sparkles
                                    size={12}
                                    className="text-cyan-500 animate-pulse"
                                  />
                                )}
                              </h4>
                              {!isExpanded && (
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px] sm:max-w-xs">
                                  Click to view rewards & details
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 relative z-10">
                            <span
                              className={`text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full whitespace-nowrap shrink-0 transition-all duration-300 ${
                                isUnlocked
                                  ? "bg-white/70 dark:bg-black/30 text-black dark:text-white backdrop-blur-sm shadow-md"
                                  : "bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400"
                              }`}
                            >
                              {isUnlocked ? "✓" : "🔒"} {rank.min}
                              {rank.max > 151 ? "+" : ` - ${rank.max}`}
                            </span>
                            <ChevronDown
                              size={16}
                              className={`text-gray-500 transition-transform duration-500 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        </div>
                        <div
                          className={`grid transition-all duration-500 ease-out ${
                            isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0 border-t border-black/5 dark:border-white/5 mt-2 animate-in fade-in slide-in-from-top-2">
                              <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-3 rounded-lg bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/5">
                                  <h5 className="text-[10px] font-bold uppercase text-gray-500 mb-2 flex items-center gap-1">
                                    <Award
                                      size={12}
                                      className="text-cyan-500"
                                    />
                                    Perks & Rewards
                                  </h5>
                                  <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1.5 list-none">
                                    <li className="flex items-start gap-2">
                                      <span className="text-green-500 mt-0.5">
                                        ✓
                                      </span>
                                      <span>
                                        {rank.name === "Platinum"
                                          ? "Official Band Membership Invite"
                                          : "Priority Event Registration"}
                                      </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <span className="text-green-500 mt-0.5">
                                        ✓
                                      </span>
                                      <span>
                                        Exclusive "{rank.name}" Profile Badge
                                      </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                      <span className="text-green-500 mt-0.5">
                                        ✓
                                      </span>
                                      <span>Access to VIP Discord Channel</span>
                                    </li>
                                  </ul>
                                </div>
                                <div className="p-3 rounded-lg bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/5">
                                  <h5 className="text-[10px] font-bold uppercase text-gray-500 mb-2 flex items-center gap-1">
                                    <Info size={12} className="text-blue-500" />
                                    Requirements
                                  </h5>
                                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Earn{" "}
                                    <b className="text-[#03a1b0]">
                                      {rank.min} LP
                                    </b>{" "}
                                    by participating in events and completing
                                    challenges.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ModalBody>
              <ModalFooter className="border-t border-gray-200 dark:border-white/5 pt-3 sm:pt-4 px-4 sm:px-6 pb-4 sm:pb-6 sticky bottom-0 z-20 bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-[#0F111A]/95 dark:to-black/95 backdrop-blur-sm">
                <Button
                  onPress={onClose}
                  className="font-bold rounded-xl px-6 sm:px-8 py-5 sm:py-6 h-10 sm:h-12 w-full bg-[#03a1b0] text-white text-sm sm:text-base shadow-lg transition-all hover:scale-105 group"
                >
                  Got it!
                  <Sparkles
                    size={16}
                    className="ml-2 group-hover:rotate-12 transition-transform"
                  />
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </section>
  );
}

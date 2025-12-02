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
} from "lucide-react";

// ... (Types, Constants, Helper Functions, makeCredit, MOCK_STATS, MOCK_CREDITS remain exactly the same) ...
// For brevity, I'm including the updated Main Component below.
// Assume the helper components (StatCard, RankProgressCard, CreditCardItem) are unchanged from previous version.

// --- Types ---
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

// --- Constants ---
const TOTAL = 99;
const MOCK_USER_CREDITS = 160;

const RANKS = [
  {
    name: "Bronze",
    min: 0,
    max: 49,
    color: "text-orange-800 dark:text-orange-400",
    bg: "bg-orange-100 dark:bg-orange-900/40",
    border: "border-orange-200 dark:border-orange-700/50",
  },
  {
    name: "Silver",
    min: 50,
    max: 99,
    color: "text-slate-700 dark:text-slate-300",
    bg: "bg-slate-100 dark:bg-slate-800/50",
    border: "border-slate-200 dark:border-slate-600/50",
  },
  {
    name: "Gold",
    min: 100,
    max: 149,
    color: "text-yellow-800 dark:text-yellow-400",
    bg: "bg-yellow-100 dark:bg-yellow-900/40",
    border: "border-yellow-200 dark:border-yellow-700/50",
  },
  {
    name: "Platinum",
    min: 150,
    max: 10000,
    color: "text-cyan-800 dark:text-cyan-300",
    bg: "bg-cyan-100 dark:bg-cyan-900/40",
    border: "border-cyan-200 dark:border-cyan-700/50",
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

// --- Components ---

const StatCard = ({ icon: Icon, label, value, color }: any) => {
  const colors: any = {
    cyan: {
      bg: "bg-cyan-100 dark:bg-cyan-500/20",
      text: "text-cyan-600 dark:text-cyan-400",
    },
    purple: {
      bg: "bg-purple-100 dark:bg-purple-500/20",
      text: "text-purple-600 dark:text-purple-400",
    },
    emerald: {
      bg: "bg-emerald-100 dark:bg-emerald-500/20",
      text: "text-emerald-600 dark:text-emerald-400",
    },
    amber: {
      bg: "bg-amber-100 dark:bg-amber-500/20",
      text: "text-amber-600 dark:text-amber-400",
    },
  };
  const theme = colors[color];
  return (
    <Card
      shadow="none"
      className="border border-black/5 dark:border-white/5 bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-2xl h-full overflow-hidden"
    >
      <CardBody className="p-4 sm:p-5 flex flex-row items-center gap-4">
        <div className={`p-3 rounded-xl shrink-0 ${theme.bg}`}>
          <Icon size={24} className={theme.text} />
        </div>
        <div className="flex flex-col min-w-0">
          <p className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate">
            {label}
          </p>
          <h4 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white leading-none mt-1 truncate">
            {value}
          </h4>
        </div>
      </CardBody>
    </Card>
  );
};

const RankProgressCard = ({
  credits,
  onPress,
}: {
  credits: number;
  onPress: () => void;
}) => {
  const { current, next, progress, nextGoal } = getRankInfo(credits);
  const isPlatinum = current.name === "Platinum";
  const [animatedProgress, setAnimatedProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => setAnimatedProgress(progress), 100);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <Card
      isPressable
      onPress={onPress}
      className={`border-none w-full shadow-xl text-white rounded-2xl overflow-hidden relative h-full cursor-pointer hover:scale-[1.01] transition-transform ${
        isPlatinum
          ? "bg-gradient-to-br from-cyan-600 to-blue-700"
          : "bg-gradient-to-br from-gray-900 to-gray-800"
      }`}
    >
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      <CardBody className="p-6 md:p-8 relative z-10 flex flex-col justify-between h-full min-h-[180px]">
        <div className="absolute top-4 right-4">
          <Info
            size={20}
            className="opacity-70 hover:opacity-100 transition-opacity"
          />
        </div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs font-bold uppercase opacity-70 mb-1">
              Current Rank
            </p>
            <h3 className="text-3xl font-black tracking-tight">
              {current.name}
            </h3>
          </div>
          <Trophy size={40} className="opacity-20 rotate-12 mr-10" />
        </div>
        {!isPlatinum ? (
          <div className="mt-auto">
            <div className="flex justify-between text-sm font-bold mb-2">
              <span>{credits} pts</span>
              <span className="opacity-70">
                {nextGoal} pts ({next?.name})
              </span>
            </div>
            <Progress
              value={animatedProgress}
              classNames={{
                indicator:
                  "bg-white transition-all duration-1000 ease-out rounded-full",
                track: "bg-white/20 rounded-full",
              }}
              size="md"
              className="mb-3 rounded-full"
              radius="full"
            />
            <p className="text-xs opacity-80">
              Earn{" "}
              <span className="font-bold">
                {nextGoal - credits} more credits
              </span>{" "}
              to reach next tier.
            </p>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-md border border-white/20 flex gap-4 items-center mt-auto">
            <div className="p-3 bg-white text-cyan-600 rounded-full shadow-lg shrink-0">
              <Award size={20} fill="currentColor" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Top Tier Reached!</h4>
              <p className="text-[10px] opacity-90">You are a legend.</p>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

const CreditCardItem = React.memo(({ credit }: { credit: Credit }) => {
  const formattedDate = React.useMemo(
    () => dateFormatter.format(new Date(credit.created_at)),
    [credit.created_at]
  );
  return (
    <Card
      shadow="none"
      onDragStart={(e) => e.preventDefault()}
      className="group relative overflow-hidden rounded-2xl select-none transition-all duration-500 ease-out hover:shadow-2xl border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-xl backdrop-saturate-150 dark:from-white/[0.08] dark:to-white/[0.02] dark:backdrop-blur-xl dark:backdrop-saturate-150"
    >
      <CardBody className="p-5 flex flex-col h-full justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-extrabold tracking-tight !text-black dark:!text-white line-clamp-1 drop-shadow-sm">
            {credit.event.name}
          </h3>
          <div className="h-1 w-12 bg-[#03a1b0] rounded-full opacity-80" />
        </div>
        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="flex flex-col gap-1 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
            <span className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Coins size={12} /> Earned
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-[#03a1b0] tracking-tight">
                {credit.amount}
              </span>
              <span className="text-xs font-semibold text-gray-400">LP</span>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-1 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
            <span className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Calendar size={12} /> Received
            </span>
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
              {formattedDate}
            </span>
          </div>
        </div>
        <div className="mt-auto">
          <Button
            as={Link}
            to={`/tickets/${credit.uuid}`}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            className="w-full h-11 font-semibold rounded-lg flex items-center justify-center gap-2 bg-[#03a1b0] hover:bg-[#008b99] shadow-md hover:shadow-lg text-white dark:bg-cyan-600 dark:hover:bg-cyan-500 transition-all duration-300"
          >
            <Eye size={18} />
            <span>View Details</span>
          </Button>
        </div>
      </CardBody>
    </Card>
  );
});

// --- Main Component ---
export default function CreditsCard() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [expandedRank, setExpandedRank] = React.useState<string | null>(null);

  // Search & Filter & Sort States
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filters, setFilters] = React.useState({ timeRange: "all" });
  const [sortBy, setSortBy] = React.useState("newest"); // 'newest', 'oldest', 'high_amount', 'low_amount'
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [isSortOpen, setIsSortOpen] = React.useState(false);

  // -- Filtering & Sorting Logic --
  const processedCredits = React.useMemo(() => {
    // 1. Filter
    let filtered = MOCK_CREDITS.filter((item) => {
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

    // 2. Sort
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
  }, [searchTerm, filters, sortBy]);

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
      {/* 1. Top Section: Stats + Rank Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <StatCard
            icon={Coins}
            label="Total Earned"
            value={MOCK_STATS.total_earned}
            color="cyan"
          />
          <StatCard
            icon={TrendingUp}
            label="This Month"
            value={`+${MOCK_STATS.this_month}`}
            color="emerald"
          />
          <StatCard
            icon={Zap}
            label="Avg per Event"
            value={MOCK_STATS.avg_per_event}
            color="purple"
          />
          <StatCard
            icon={Award}
            label="Events Rewarded"
            value={MOCK_STATS.events_rewarded}
            color="amber"
          />
        </div>
        <div className="lg:col-span-1">
          <RankProgressCard credits={MOCK_USER_CREDITS} onPress={onOpen} />
        </div>
      </div>

      {/* 2. Sticky Search Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-16 md:top-20 z-40 py-4 bg-white/90 dark:bg-black/90 backdrop-blur-xl -mx-4 px-4 rounded-b-2xl border-b border-black/5 dark:border-white/5 shadow-sm transition-all">
        <h2 className="text-2xl font-black text-black dark:text-white tracking-tight flex items-center gap-2 whitespace-nowrap">
          <Star className="text-[#03a1b0]" />
          <span className="hidden sm:inline">Credit History</span>
          <span className="sm:hidden">Credits</span>
        </h2>

        <div className="flex gap-2 w-full md:w-auto items-center">
          {/* Search Input */}
          <div className="relative flex-1 md:w-56 lg:w-72 min-w-0">
            <input
              type="text"
              placeholder="Search event..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-[#03a1b0] focus:ring-1 focus:ring-[#03a1b0] outline-none transition-all text-sm text-black dark:text-white placeholder-gray-500"
            />
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <Popover
            placement="bottom-end"
            isOpen={isSortOpen}
            onOpenChange={setIsSortOpen}
          >
            <PopoverTrigger>
              <Button
                className={`h-10 px-3 min-w-fit shrink-0 font-semibold border transition-colors bg-white dark:bg-white/5 border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10`}
              >
                <ArrowUpDown size={16} />
                <span className="hidden sm:inline whitespace-nowrap text-xs">
                  {getSortLabel(sortBy)}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 px-1 py-1 bg-white dark:bg-[#18181b] border border-black/10 dark:border-white/10 shadow-xl rounded-lg">
              <div className="flex flex-col w-full">
                <button
                  onClick={() => {
                    setSortBy("newest");
                    setIsSortOpen(false);
                  }}
                  className={`px-3 py-2 text-sm text-left rounded-md transition-colors ${
                    sortBy === "newest"
                      ? "bg-[#03a1b0]/10 text-[#03a1b0] font-bold"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                  }`}
                >
                  Newest First
                </button>
                <button
                  onClick={() => {
                    setSortBy("oldest");
                    setIsSortOpen(false);
                  }}
                  className={`px-3 py-2 text-sm text-left rounded-md transition-colors ${
                    sortBy === "oldest"
                      ? "bg-[#03a1b0]/10 text-[#03a1b0] font-bold"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                  }`}
                >
                  Oldest First
                </button>
                <button
                  onClick={() => {
                    setSortBy("high_amount");
                    setIsSortOpen(false);
                  }}
                  className={`px-3 py-2 text-sm text-left rounded-md transition-colors ${
                    sortBy === "high_amount"
                      ? "bg-[#03a1b0]/10 text-[#03a1b0] font-bold"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                  }`}
                >
                  Highest Amount
                </button>
                <button
                  onClick={() => {
                    setSortBy("low_amount");
                    setIsSortOpen(false);
                  }}
                  className={`px-3 py-2 text-sm text-left rounded-md transition-colors ${
                    sortBy === "low_amount"
                      ? "bg-[#03a1b0]/10 text-[#03a1b0] font-bold"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                  }`}
                >
                  Lowest Amount
                </button>
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
                className={`h-10 px-4 min-w-fit shrink-0 font-semibold border transition-colors ${
                  activeFiltersCount > 0
                    ? "bg-[#03a1b0]/10 text-[#03a1b0] border-[#03a1b0]/20"
                    : "bg-white dark:bg-white/5 border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10"
                }`}
              >
                <Filter size={16} />
                <span className="hidden sm:inline whitespace-nowrap">
                  Filter
                </span>
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
                    className="text-xs text-[#03a1b0] hover:underline font-medium"
                  >
                    Reset all
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Time Range
                  </label>
                  <select
                    className="w-full p-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm text-black dark:text-white outline-none focus:border-[#03a1b0]"
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
                  className="w-full bg-[#03a1b0] text-white font-bold h-9 rounded-lg hover:bg-[#028a96] transition-colors"
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
      {processedCredits.length !== TOTAL && (
        <div className="flex items-center gap-2 text-sm text-gray-500 -mt-4 px-1 animate-in fade-in slide-in-from-top-2">
          <span>
            Found <b>{processedCredits.length}</b> results
          </span>
          {(searchTerm || activeFiltersCount > 0) && (
            <button
              onClick={clearFilters}
              className="text-[#03a1b0] hover:underline font-medium flex items-center gap-1"
            >
              <XCircle size={14} /> Clear filters
            </button>
          )}
        </div>
      )}

      {/* 4. Cards Grid */}
      <div className="relative z-10">
        {pageItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
            {pageItems.map((credit) => (
              <CreditCardItem key={credit.id} credit={credit} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl bg-white/50 dark:bg-white/5">
            <Search size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              No credits found
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Try adjusting your search or filters.
            </p>
            <Button
              onClick={clearFilters}
              variant="light"
              className="mt-4 text-[#03a1b0] font-bold"
            >
              Reset All Filters
            </Button>
          </div>
        )}
      </div>

      {/* 5. Pagination */}
      <div className="left-0 w-full flex justify-center sm:justify-end items-center py-1 px-1 rounded-md bg-white/50 !text-gray-900 dark:bg-black/50 dark:!text-gray-100 bg-transparent backdrop-blur-md z-10">
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
          }}
          slotProps={{
            select: {
              MenuProps: {
                PaperProps: {
                  className:
                    "!bg-inherit !bg-transparent !text-gray-900 dark:!bg-inherit dark:!text-gray-100 !backdrop-blur-md !rounded-md",
                  sx: {
                    "& .MuiMenuItem-root.Mui-selected": {
                      bgcolor: "rgba(3, 161, 176, 0.12) !important",
                      color: "#03a1b0",
                    },
                  },
                },
              },
            },
          }}
        />
      </div>

      {/* --- Rank Info Modal (Same as previous) --- */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        size="lg"
        hideCloseButton={true}
        classNames={{
          backdrop: "bg-black/60 backdrop-blur-sm z-[999999]",
          wrapper:
            "z-[1000000] flex items-end sm:items-center px-2 sm:px-0 mb-2",
          base: "dark:bg-[#0F111A] bg-white border border-black/5 dark:border-white/10 shadow-2xl rounded-2xl z-[1000001] relative w-full sm:w-auto max-h-[90vh] sm:max-h-none",
        }}
        className="overflow-hidden bg-white/20 !text-gray-900 dark:bg-black/50 dark:!text-gray-100 backdrop-blur-md border border-gray-400 dark:border-white/10 shadow-2xl"
      >
        <ModalContent className="max-h-[90vh] sm:max-h-none overflow-y-auto">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-3 border-b border-gray-200 dark:border-white/5 pb-4 px-4 sm:px-6 pt-4 sm:pt-6 sticky top-0 z-20 bg-inherit">
                <h3 className="text-xl sm:text-2xl text-white font-black flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                    <Trophy
                      size={24}
                      className="text-amber-600 dark:text-amber-400"
                    />
                  </div>{" "}
                  Rank System
                </h3>
                <p className="text-xs sm:text-sm text-white dark:text-gray-400 font-medium leading-relaxed">
                  Earn credits to unlock new tiers and exclusive rewards.
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
                        className={`cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                          isUnlocked
                            ? `${rank.bg} ${rank.border} shadow-sm`
                            : "opacity-60 grayscale border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02]"
                        }`}
                      >
                        <div className="p-3 sm:p-4 flex justify-between items-start gap-2 sm:gap-4">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <span
                              className={`text-lg sm:text-2xl font-black ${rank.color} opacity-80 shrink-0`}
                            >
                              {idx + 1}
                            </span>
                            <div className="flex flex-col">
                              <h4
                                className={`text-sm sm:text-lg font-bold ${rank.color} truncate`}
                              >
                                {rank.name}
                              </h4>
                              {!isExpanded && (
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px] sm:max-w-xs">
                                  Click to view rewards & details
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full whitespace-nowrap shrink-0 ${
                                isUnlocked
                                  ? "bg-white/50 dark:bg-black/20 text-black dark:text-white backdrop-blur-sm"
                                  : "bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400"
                              }`}
                            >
                              {isUnlocked ? "✓" : "🔒"} {rank.min}
                              {rank.max > 99000 ? "+" : `–${rank.max}`}
                            </span>
                            <ChevronDown
                              size={16}
                              className={`text-gray-500 transition-transform duration-300 ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        </div>
                        <div
                          className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                            isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0 border-t border-black/5 dark:border-white/5 mt-2">
                              <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <h5 className="text-[10px] font-bold uppercase text-gray-500 mb-1">
                                    Perks & Rewards
                                  </h5>
                                  <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1 list-disc pl-4">
                                    <li>
                                      {rank.name === "Platinum"
                                        ? "Official Band Membership Invite"
                                        : "Priority Event Registration"}
                                    </li>
                                    <li>
                                      Exclusive "{rank.name}" Profile Badge
                                    </li>
                                    <li>Access to VIP Discord Channel</li>
                                  </ul>
                                </div>
                                <div>
                                  <h5 className="text-[10px] font-bold uppercase text-gray-500 mb-1">
                                    Requirements
                                  </h5>
                                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Earn <b>{rank.min} LP</b> by participating
                                    in events.
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
              <ModalFooter className="border-t border-gray-200 dark:border-white/5 pt-3 sm:pt-4 px-4 sm:px-6 pb-4 sm:pb-6 sticky bottom-0 z-20 bg-inherit">
                <Button
                  onPress={onClose}
                  className="font-bold rounded-xl px-6 sm:px-8 py-5 sm:py-6 h-10 sm:h-12 w-full bg-gradient-to-r from-[#03a1b0] to-cyan-500 text-white text-sm sm:text-base shadow-lg hover:shadow-cyan-500/25 transition-all"
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

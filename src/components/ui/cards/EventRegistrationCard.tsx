import * as React from "react";
import TablePagination from "@mui/material/TablePagination";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Select,
  SelectItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  DateRangePicker,
} from "@heroui/react";
import Badge from "../badge/Badge";
import {
  Eye,
  Ticket,
  CreditCard,
  UserCheck,
  Clock,
  XCircle,
  ChevronRight,
  Calendar,
  LayoutGrid,
  Hourglass,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  X,
} from "lucide-react";

// --- Types & Utilities ---
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

// --- Components ---

const StatCard = ({ icon: Icon, label, value, color }: { icon: any, label: string, value: string | number, color: "cyan" | "purple" | "emerald" | "amber" }) => {
  const colors = {
    cyan: { bg: "bg-cyan-100 dark:bg-cyan-500/20", text: "text-cyan-600 dark:text-cyan-400" },
    purple: { bg: "bg-purple-100 dark:bg-purple-500/20", text: "text-purple-600 dark:text-purple-400" },
    emerald: { bg: "bg-emerald-100 dark:bg-emerald-500/20", text: "text-emerald-600 dark:text-emerald-400" },
    amber: { bg: "bg-amber-100 dark:bg-amber-500/20", text: "text-amber-600 dark:text-amber-400" },
  };
  const theme = colors[color];
  return (
    <Card shadow="none" className="border border-black/5 dark:border-white/5 bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-2xl h-full overflow-hidden">
      <CardBody className="p-4 sm:p-5 flex flex-row items-center gap-4">
        <div className={`p-3 rounded-xl shrink-0 ${theme.bg}`}>
          <Icon size={24} className={theme.text} />
        </div>
        <div className="flex flex-col min-w-0">
          <p className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate">{label}</p>
          <h4 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white leading-none mt-1 truncate">{value}</h4>
        </div>
      </CardBody>
    </Card>
  );
};

const StatusBadge = ({ type, status }: { type: "reg" | "pay"; status: string }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const label = type === "reg" ? "Registration" : "Payment";
  const color = getBadgeColor(status);
  const icon = getStatusIcon(type, status);

  return (
    <button type="button" onClick={(e) => { e.preventDefault(); setIsExpanded(!isExpanded); }} className="group focus:outline-none active:scale-95 transition-transform">
      <Badge size="sm" color={color}>
        <div className="flex items-center gap-1.5 min-w-0">
          {icon}
          <span className="capitalize text-xs tracking-wide">{status}</span>
          <div className={`flex items-center overflow-hidden transition-all duration-300 ease-out ${isExpanded ? "max-w-[150px] opacity-100 ml-1" : "max-w-0 opacity-0"}`}>
            <div className="h-3 w-px bg-current opacity-40 mx-1" />
            <span className="text-[10px] uppercase tracking-wider font-medium whitespace-nowrap">{label}</span>
          </div>
          <ChevronRight size={14} className={`transition-transform duration-300 ease-out opacity-80 ${isExpanded ? "rotate-180" : "rotate-0"} ${isExpanded ? "ml-1" : "ml-0.5"}`} />
        </div>
      </Badge>
    </button>
  );
};

const EventCard = React.memo(({ reg }: { reg: EventRegistration }) => {
  const formattedDate = React.useMemo(() => dateFormatter.format(new Date(reg.registered_at)), [reg.registered_at]);
  return (
    <Card shadow="none" className="group relative overflow-hidden rounded-2xl transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-2xl border border-black/10 dark:border-white/10 bg-gradient-to-br from-white/85 to-white/75 backdrop-blur-xl backdrop-saturate-150 dark:from-white/[0.08] dark:to-white/[0.02] dark:backdrop-blur-xl dark:backdrop-saturate-150">
      <CardHeader className="p-0 overflow-hidden relative aspect-video">
        <img src={reg.event.image} alt={`${reg.event.name} cover`} loading="lazy" className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      </CardHeader>
      <CardBody className="p-5 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-extrabold tracking-tight !text-black dark:!text-white line-clamp-1 drop-shadow-sm">{reg.event.name}</h3>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <StatusBadge type="reg" status={reg.registration_status} />
            <StatusBadge type="pay" status={reg.payment_status} />
          </div>
        </div>
        <div className="flex justify-between items-center text-sm mt-1">
          <span className="!text-gray-800 font-bold dark:!text-gray-400">Registered On</span>
          <span className="!text-black font-black dark:!text-gray-100 font-mono">{formattedDate}</span>
        </div>
        <div className="pt-2 grid grid-cols-2 gap-3">
          <Button as={Link} to={`/tickets/${reg.uuid}`} className="w-full h-10 font-semibold rounded-lg flex items-center justify-center gap-2 border border-[#03a1b0] text-[#03a1b0] bg-transparent hover:bg-[#03a1b0]/10 dark:border-cyan-500 dark:text-cyan-400 transition-colors">
            <Eye size={18} /> Details
          </Button>
          <Button as={Link} to={`/tickets/${reg.uuid}`} className="w-full h-10 font-semibold rounded-lg text-white flex items-center justify-center gap-2 bg-[#03a1b0] hover:bg-[#008b99] shadow-md transition-all">
            <Ticket size={18} /> Ticket
          </Button>
        </div>
      </CardBody>
    </Card>
  );
});

// --- Main Layout ---
export default function EventRegistrationCards() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(8);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filters, setFilters] = React.useState({ regStatus: "all", payStatus: "all", timeRange: "all" });
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  const filteredData = React.useMemo(() => {
    return MOCK_DATA.filter((item) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = item.event.name.toLowerCase().includes(searchLower) || item.ticket_code.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
      if (filters.regStatus !== "all" && item.registration_status !== filters.regStatus) return false;
      if (filters.payStatus !== "all" && item.payment_status !== filters.payStatus) return false;
      if (filters.timeRange !== "all") {
        const date = new Date(item.registered_at);
        const now = new Date();
        const diffDays = Math.ceil(Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        if (filters.timeRange === "7days" && diffDays > 7) return false;
        if (filters.timeRange === "30days" && diffDays > 30) return false;
        if (filters.timeRange === "90days" && diffDays > 90) return false;
      }
      return true;
    });
  }, [searchTerm, filters]);

  const pageItems = React.useMemo(() => {
    const start = page * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [page, rowsPerPage, filteredData]);

  const handleChangePage = (_: any, newPage: number) => { setPage(newPage); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); };
  const handleFilterChange = (key: string, value: string) => { setFilters(prev => ({ ...prev, [key]: value })); setPage(0); };
  const clearFilters = () => { setFilters({ regStatus: "all", payStatus: "all", timeRange: "all" }); setSearchTerm(""); setPage(0); };
  const activeFiltersCount = Object.values(filters).filter(v => v !== "all").length;

  return (
    <section className="relative w-full min-h-screen mx-auto px-0 sm:px-16 space-y-8">
      
      {/* 1. Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard icon={LayoutGrid} label="Total Registrations" value={MOCK_STATS.total_registrations} color="cyan" />
        <StatCard icon={Hourglass} label="Upcoming Events" value={MOCK_STATS.upcoming_events} color="purple" />
        <StatCard icon={CheckCircle2} label="Completed Events" value={MOCK_STATS.completed_events} color="emerald" />
        <StatCard icon={AlertCircle} label="Pending Payments" value={MOCK_STATS.pending_payments} color="amber" />
      </div>

      {/* 2. Sticky Header with Fixes */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-16 md:top-20 z-40 py-4 bg-white/90 dark:bg-black/90 backdrop-blur-xl -mx-4 px-4 rounded-b-2xl border-b border-black/5 dark:border-white/5 shadow-sm transition-all">
        
        {/* Title */}
        <h2 className="text-2xl font-black text-black dark:text-white tracking-tight flex items-center gap-2 whitespace-nowrap">
          <Ticket className="text-[#03a1b0]" /> 
          <span className="hidden sm:inline">Your Registrations</span>
          <span className="sm:hidden">Registrations</span>
        </h2>

        {/* Search & Filter Controls */}
        <div className="flex gap-2 w-full md:w-auto">
          
          {/* Search Input - Adjusted width for tablet */}
          <div className="relative flex-1 md:w-64 lg:w-80 min-w-0">
            <input 
              type="text"
              placeholder="Search event..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-[#03a1b0] focus:ring-1 focus:ring-[#03a1b0] outline-none transition-all text-sm text-black dark:text-white placeholder-gray-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Popover */}
          <Popover placement="bottom-end" isOpen={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger>
              <Button 
                className={`h-10 px-4 min-w-fit shrink-0 font-semibold border transition-colors ${
                  activeFiltersCount > 0 
                    ? "bg-[#03a1b0]/10 text-[#03a1b0] border-[#03a1b0]/20" 
                    : "bg-white dark:bg-white/5 border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10"
                }`}
              >
                <Filter size={16} /> 
                <span className="hidden sm:inline whitespace-nowrap">Filter</span>
                {activeFiltersCount > 0 && (
                  <span className="ml-1 bg-[#03a1b0] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            
            {/* Popover Content - Fixed Dark Mode Options */}
            <PopoverContent className="w-80 px-3 py-3 bg-white dark:bg-[#18181b] border border-black/10 dark:border-white/10 shadow-xl rounded-xl">
              <div className="space-y-4 w-full">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-sm text-black dark:text-white">Filter Registrations</h4>
                  <button onClick={clearFilters} className="text-xs text-[#03a1b0] hover:underline font-medium">
                    Reset all
                  </button>
                </div>
                
                {/* Filter Dropdowns with Dark Mode Fix */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Registration Status</label>
                  <select 
                    className="w-full p-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm text-black dark:text-white outline-none focus:border-[#03a1b0]"
                    value={filters.regStatus}
                    onChange={(e) => handleFilterChange("regStatus", e.target.value)}
                  >
                    <option value="all" className="bg-white dark:bg-[#18181b]">All Statuses</option>
                    <option value="confirmed" className="bg-white dark:bg-[#18181b]">Confirmed</option>
                    <option value="pending" className="bg-white dark:bg-[#18181b]">Pending</option>
                    <option value="waitlisted" className="bg-white dark:bg-[#18181b]">Waitlisted</option>
                    <option value="cancelled" className="bg-white dark:bg-[#18181b]">Cancelled</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Payment Status</label>
                  <select 
                    className="w-full p-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm text-black dark:text-white outline-none focus:border-[#03a1b0]"
                    value={filters.payStatus}
                    onChange={(e) => handleFilterChange("payStatus", e.target.value)}
                  >
                    <option value="all" className="bg-white dark:bg-[#18181b]">All Payments</option>
                    <option value="success" className="bg-white dark:bg-[#18181b]">Success</option>
                    <option value="pending" className="bg-white dark:bg-[#18181b]">Pending</option>
                    <option value="failed" className="bg-white dark:bg-[#18181b]">Failed</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Date Range</label>
                  <select 
                    className="w-full p-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm text-black dark:text-white outline-none focus:border-[#03a1b0]"
                    value={filters.timeRange}
                    onChange={(e) => handleFilterChange("timeRange", e.target.value)}
                  >
                    <option value="all" className="bg-white dark:bg-[#18181b]">All Time</option>
                    <option value="7days" className="bg-white dark:bg-[#18181b]">Last 7 Days</option>
                    <option value="30days" className="bg-white dark:bg-[#18181b]">Last 30 Days</option>
                    <option value="90days" className="bg-white dark:bg-[#18181b]">Last 3 Months</option>
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
      {filteredData.length !== TOTAL && (
        <div className="flex items-center gap-2 text-sm text-gray-500 -mt-4 px-1">
          <span>Found <b>{filteredData.length}</b> results</span>
          {(searchTerm || activeFiltersCount > 0) && (
            <button onClick={clearFilters} className="text-[#03a1b0] hover:underline font-medium flex items-center gap-1">
              <XCircle size={14} /> Clear filters
            </button>
          )}
        </div>
      )}

      {/* 4. Grid */}
      <div className="relative z-10">
        {pageItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
            {pageItems.map((reg) => (
              <EventCard key={reg.uuid} reg={reg} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl bg-white/50 dark:bg-white/5">
            <Search size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No registrations found</h3>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filters.</p>
            <Button onClick={clearFilters} variant="light" className="mt-4 text-[#03a1b0] font-bold">
              Reset All Filters
            </Button>
          </div>
        )}
      </div>

      {/* 5. Pagination */}
      <div className="left-0 w-full rounded-xl flex justify-center sm:justify-end items-center py-1 px-1 bg-white/50 !text-gray-900 dark:bg-black/50 dark:!text-gray-100 bg-transparent backdrop-blur-md z-10">
        <TablePagination
          component="div"
          count={filteredData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Per Page"
          sx={{ color: "inherit", ".MuiSvgIcon-root": { color: "inherit" }, "& .MuiTablePagination-select": { color: "inherit" } }}
          slotProps={{
            select: {
              MenuProps: {
                PaperProps: {
                  className: "!bg-inherit !bg-transparent !text-gray-900 dark:!bg-inherit dark:!text-gray-100 !backdrop-blur-md",
                  sx: { "& .MuiMenuItem-root.Mui-selected": { bgcolor: "rgba(3, 161, 176, 0.12) !important", color: "#03a1b0" } },
                },
              },
            },
          }}
        />
      </div>
    </section>
  );
}

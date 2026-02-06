import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  Clock,
  ArrowRight,
  X,
  AlertCircle,
  Hourglass,
  ChevronDown,
  ArrowUpDown,
  MapPin,
  Star,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@heroui/button";
import TablePagination from "@mui/material/TablePagination";
import axios, { AxiosError } from "axios";

// --- Interfaces ---
interface EventData {
  uuid: string;
  name: string;
  description: string;
  type: "public" | "club" | "music";
  status: "upcoming" | "ongoing" | "completed";
  start_date: string;
  end_date: string;
  venue: string;
  registration_deadline?: string;
  cover_image: string | null;
}

interface LaravelPaginatedResponse {
  current_page: number;
  data: EventData[];
  total: number;
}

interface ApiResponse {
  status: string;
  code: number;
  message: string;
  data: LaravelPaginatedResponse;
}

const CATEGORIES = ["All", "upcoming", "ongoing", "completed"] as const;
const SORT_OPTIONS = [
  { label: "Date (Newest)", value: "date_desc" },
  { label: "Date (Oldest)", value: "date_asc" },
  { label: "Name (A-Z)", value: "name_asc" },
];

// --- Utility Functions ---
const formatEventDate = (dateString?: string) => {
  if (!dateString) return { day: "TBD", month: "", time: "" };
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return { day: "TBD", month: "", time: "" };

  return {
    day: date.getDate().toString(),
    month: date.toLocaleString("en-IN", { month: "short" }).toUpperCase(),
    time: date.toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit" }),
  };
};

const formatDeadline = (dateString?: string) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString("en-IN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// 🎨 CONSISTENT COLOR UTILITIES (Matches EventDetails.tsx)
const getEventTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case "music":
      return "bg-pink-500/10 text-pink-400 border-pink-500/20 shadow-[0_0_10px_rgba(236,72,153,0.1)]";
    case "club":
    case "management":
      return "bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.1)]";
    case "public":
      return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.1)]";
    default:
      return "bg-neutral-500/10 text-neutral-400 border-neutral-500/20";
  }
};

const getEventStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "ongoing":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse";
    case "upcoming":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "completed":
      return "bg-white/5 text-neutral-500 border-white/5";
    default:
      return "bg-white/5 text-neutral-400 border-white/10";
  }
};

const Event: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const perPageParam = parseInt(searchParams.get("per_page") || "9", 10);
  const muiPage = pageParam > 0 ? pageParam - 1 : 0;

  const statusParam = searchParams.get("status") || "All";
  const searchParam = searchParams.get("search") || "";
  const sortParam = searchParams.get("sort") || "date_desc";

  const [eventsData, setEventsData] = useState<LaravelPaginatedResponse | null>(
    null,
  );
  const [heroEvent, setHeroEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localSearch, setLocalSearch] = useState(searchParam);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    setLocalSearch(searchParam);
  }, [searchParam]);

  // --- Data Fetching Logic ---
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const isDefaultView =
        pageParam === 1 &&
        !searchParam &&
        sortParam === "date_desc" &&
        statusParam === "All";

      const itemsToFetch = isDefaultView ? perPageParam + 1 : perPageParam;

      const response = await axios.get<ApiResponse>(`${API_BASE_URL}/events`, {
        params: {
          page: pageParam,
          per_page: itemsToFetch,
          status: statusParam !== "All" ? statusParam : undefined,
          search: searchParam || undefined,
          sort: sortParam,
        },
      });

      if (response.data.data && Array.isArray(response.data.data.data)) {
        const fetchedEvents = response.data.data.data;

        if (isDefaultView && fetchedEvents.length > 0) {
          const latestEvent = [...fetchedEvents].sort(
            (a, b) =>
              new Date(b.start_date).getTime() -
              new Date(a.start_date).getTime(),
          )[0];

          setHeroEvent(latestEvent);
          const gridEvents = fetchedEvents.filter(
            (e) => e.uuid !== latestEvent.uuid,
          );

          setEventsData({
            ...response.data.data,
            data: gridEvents,
          });
        } else {
          setHeroEvent(null);
          setEventsData(response.data.data);
        }
      } else {
        setEventsData(null);
        setError("Unexpected response.");
      }
    } catch (err) {
      const axiosErr = err as AxiosError;
      setError(axiosErr.message || "Failed to load events.");
    } finally {
      setLoading(false);
    }
  }, [
    pageParam,
    perPageParam,
    statusParam,
    searchParam,
    sortParam,
    API_BASE_URL,
  ]);

  useEffect(() => {
    fetchEvents();
    if (pageParam > 1) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [fetchEvents, pageParam]);

  // --- Event Handlers ---
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value);
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (e.target.value) newParams.set("search", e.target.value);
      else newParams.delete("search");
      newParams.set("page", "1");
      return newParams;
    });
  };

  const clearSearch = () => {
    setLocalSearch("");
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.delete("search");
      newParams.set("page", "1");
      return newParams;
    });
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", (newPage + 1).toString());
      return newParams;
    });
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newPerPage = parseInt(event.target.value, 10);
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("per_page", newPerPage.toString());
      newParams.set("page", "1");
      return newParams;
    });
  };

  const handleCategoryChange = (cat: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (cat === "All") newParams.delete("status");
      else newParams.set("status", cat);
      newParams.set("page", "1");
      return newParams;
    });
  };

  const handleSortChange = (val: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("sort", val);
      newParams.set("page", "1");
      return newParams;
    });
    setIsFilterOpen(false);
  };

  const filteredEvents = useMemo(() => {
    if (!eventsData?.data) return [];
    if (!localSearch) return eventsData.data;

    const lowerSearch = localSearch.toLowerCase();
    return eventsData.data.filter(
      (e) =>
        e.name.toLowerCase().includes(lowerSearch) ||
        e.description.toLowerCase().includes(lowerSearch),
    );
  }, [eventsData, localSearch]);

  const totalItems = eventsData?.total || 0;

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-lolo-pink/30 selection:text-white pb-24 relative overflow-hidden">
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-lolo-cyan/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-lolo-pink/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero & Header */}
      <div className="relative overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 pt-24 pb-12 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="relative text-4xl md:text-7xl font-bold mb-6 text-white leading-tight">
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-purple-400 via-white to-purple-400 bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto]">
                  Events
                </span>
              </span>
              <span className="mx-3 text-2xl sm:text-4xl align-middle text-lolo-pink font-club">
                &
              </span>
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-lolo-pink via-white to-lolo-pink bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto]">
                  Stories
                </span>
              </span>
            </h1>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Join the most electrifying events, workshops, and gatherings at
              LOLO.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative max-w-xl mx-auto"
          >
            <input
              type="text"
              placeholder="Search events..."
              value={localSearch}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-10 py-4 bg-white/[0.02] border border-white/5 rounded-full text-white placeholder-neutral-600 focus:outline-none focus:border-white/20 backdrop-blur-xl transition-all shadow-lg text-base"
            />
            <Search
              className="absolute left-5 top-1/2 transform -translate-y-1/2 text-neutral-500"
              size={18}
            />
            {localSearch && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-white/10 text-neutral-500 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Filters & Sorting Bar */}
      <div className="relative z-20 w-full py-6 mb-12 bg-transparent backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="overflow-x-auto no-scrollbar w-full md:w-auto">
            <div className="flex gap-2 min-w-max">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${
                    statusParam === category
                      ? "bg-white text-black border-white"
                      : "bg-white/[0.02] border-white/5 text-neutral-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="relative ml-auto">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.02] border border-white/5 rounded-full text-sm font-medium text-neutral-400 hover:text-white hover:border-white/20 transition-all"
            >
              <ArrowUpDown size={14} />
              <span>Sort</span>
              <ChevronDown
                size={14}
                className={`transition-transform ${
                  isFilterOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-xl overflow-hidden z-50">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSortChange(opt.value)}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors ${
                      sortParam === opt.value
                        ? "text-lolo-pink font-bold bg-white/[0.02]"
                        : "text-neutral-400"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-6 min-h-[50vh] relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="w-10 h-10 animate-spin text-lolo-pink mb-4" />
            <p className="text-neutral-500 font-medium">Loading events...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white/[0.02] rounded-[2.5rem] border border-white/5">
            <AlertCircle className="text-red-400 mb-3" size={32} />
            <p className="text-neutral-300 mb-6 text-lg max-w-md">{error}</p>
            <Button
              onPress={fetchEvents}
              className="bg-white text-black hover:bg-neutral-200 px-8 py-3 rounded-full font-bold transition-all"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Featured Event */}
            {heroEvent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Star
                    className="text-lolo-pink"
                    size={20}
                    fill="currentColor"
                  />
                  <h2 className="text-xl font-bold text-white tracking-wide uppercase">
                    Featured Event
                  </h2>
                </div>

                <div className="group relative bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-lolo-pink/30 transition-all duration-500">
                  <div className="grid lg:grid-cols-2 gap-0">
                    <div className="relative h-[400px] lg:h-[500px] overflow-hidden">
                      <div className="absolute top-6 left-6 z-10 flex flex-wrap gap-2">
                        {/* Featured Tag */}
                        <span className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-white text-black backdrop-blur-md shadow-lg">
                          ⭐ Featured
                        </span>

                        {/* 🎨 TYPE BADGE */}
                        <span
                          className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md ${getEventTypeColor(
                            heroEvent.type,
                          )}`}
                        >
                          {heroEvent.type}
                        </span>

                        {/* 🚦 STATUS BADGE */}
                        <span
                          className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md ${getEventStatusColor(
                            heroEvent.status,
                          )}`}
                        >
                          {heroEvent.status}
                        </span>
                      </div>

                      <img
                        src={
                          heroEvent.cover_image ||
                          "https://via.placeholder.com/800x600"
                        }
                        alt={heroEvent.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      <div className="absolute bottom-6 left-6 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3 flex flex-col items-center min-w-[90px] text-center">
                        <span className="text-xs font-bold text-white uppercase leading-none mb-1">
                          {formatEventDate(heroEvent.start_date).month}
                        </span>
                        <span className="text-3xl font-black text-white leading-none">
                          {formatEventDate(heroEvent.start_date).day}
                        </span>
                      </div>
                    </div>

                    <div className="p-8 lg:p-12 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-6 mb-6 text-neutral-400">
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-lolo-pink" />
                            <span className="text-sm font-medium">
                              {formatEventDate(heroEvent.start_date).time}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-purple-400" />
                            <span className="text-sm font-medium">
                              {heroEvent.venue}
                            </span>
                          </div>
                        </div>

                        <h3 className="text-3xl lg:text-5xl font-bold text-white leading-tight mb-6 group-hover:text-lolo-pink transition-colors">
                          {heroEvent.name}
                        </h3>
                        <p className="text-neutral-400 text-lg leading-relaxed mb-8 line-clamp-3">
                          {heroEvent.description}
                        </p>

                        {formatDeadline(heroEvent.registration_deadline) && (
                          <div className="inline-flex items-center gap-3 px-5 py-4 bg-white/5 border border-white/5 rounded-2xl mb-8">
                            <Hourglass
                              size={18}
                              className={
                                heroEvent.registration_deadline &&
                                new Date(heroEvent.registration_deadline) <
                                  new Date(Date.now() + 86400000 * 2)
                                  ? "text-orange-400"
                                  : "text-lolo-pink"
                              }
                            />
                            <div>
                              <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold block mb-0.5">
                                Registration Deadline
                              </span>
                              <span className="text-sm font-bold text-white">
                                {formatDeadline(
                                  heroEvent.registration_deadline,
                                )}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-8 border-t border-white/5">
                        <Link to={`/events/${heroEvent.uuid}`}>
                          <Button className="w-full sm:w-auto bg-white text-black hover:bg-lolo-pink hover:text-white border-0 rounded-full px-10 h-14 transition-all group-hover:translate-x-1 flex items-center justify-center gap-2 text-base font-bold shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                            View Details <ArrowRight size={18} />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Regular Events Grid */}
            {filteredEvents.length > 0 ? (
              <div className="space-y-8">
                {heroEvent && (
                  <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    <span className="text-sm font-bold text-neutral-500 uppercase tracking-widest">
                      More Events
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredEvents.map((event) => {
                    const eventDate = formatEventDate(event.start_date);
                    const deadline = formatDeadline(
                      event.registration_deadline,
                    );
                    const isDeadlineApproaching = event.registration_deadline
                      ? new Date(event.registration_deadline) <
                        new Date(Date.now() + 86400000 * 2)
                      : false;

                    return (
                      <motion.div
                        key={event.uuid}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="group relative bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-lolo-pink/30 transition-all duration-500 flex flex-col min-h-[500px]"
                      >
                        <div className="relative h-64 overflow-hidden">
                          <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
                            {/* 🎨 TYPE BADGE */}
                            <span
                              className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${getEventTypeColor(
                                event.type,
                              )}`}
                            >
                              {event.type}
                            </span>

                            {/* 🚦 STATUS BADGE */}
                            <span
                              className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${getEventStatusColor(
                                event.status,
                              )}`}
                            >
                              {event.status}
                            </span>
                          </div>

                          <img
                            src={
                              event.cover_image ||
                              "https://via.placeholder.com/800x600"
                            }
                            alt={event.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                          />

                          <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-2 flex flex-col items-center min-w-[70px] text-center">
                            <span className="text-[10px] font-bold text-white uppercase leading-none mb-1">
                              {eventDate.month}
                            </span>
                            <span className="text-2xl font-black text-white leading-none">
                              {eventDate.day}
                            </span>
                          </div>
                        </div>

                        <div className="p-8 flex flex-col flex-grow">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2 text-xs font-bold text-lolo-pink uppercase tracking-wider">
                              <Clock size={14} />
                              <span>{eventDate.time}</span>
                            </div>
                          </div>

                          <h3 className="text-2xl font-bold text-white leading-tight mb-3 line-clamp-2 group-hover:text-lolo-pink transition-colors">
                            {event.name}
                          </h3>
                          <p className="text-neutral-400 text-sm leading-relaxed mb-8 line-clamp-2 flex-grow">
                            {event.description}
                          </p>

                          <div className="pt-6 mt-auto border-t border-white/5 flex items-end justify-between">
                            <div className="flex flex-col gap-1">
                              {deadline ? (
                                <>
                                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold flex items-center gap-1.5">
                                    <Hourglass
                                      size={12}
                                      className={
                                        isDeadlineApproaching
                                          ? "text-orange-400"
                                          : "text-neutral-500"
                                      }
                                    />
                                    Deadline
                                  </span>
                                  <span
                                    className={`text-sm font-bold ${
                                      isDeadlineApproaching
                                        ? "text-orange-300"
                                        : "text-white"
                                    }`}
                                  >
                                    {deadline}
                                  </span>
                                </>
                              ) : (
                                <span className="text-xs text-neutral-600 font-medium">
                                  No registration
                                </span>
                              )}
                            </div>

                            <Link to={`/events/${event.uuid}`}>
                              <Button className="bg-white/5 hover:bg-white hover:text-black text-white border border-white/10 rounded-full w-12 h-12 p-0 flex items-center justify-center transition-all group-hover:scale-110">
                                <ArrowRight size={20} />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ) : (
              !heroEvent && (
                <div className="py-32 text-center bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
                  <Search size={40} className="text-neutral-600 mx-auto mb-4" />
                  <p className="text-neutral-300 text-lg font-bold">
                    No events found
                  </p>
                  <p className="text-neutral-500 mt-2 text-sm">
                    Try adjusting your search or filters.
                  </p>
                  <button
                    onClick={clearSearch}
                    className="text-lolo-pink text-sm mt-6 hover:underline font-bold uppercase tracking-wider"
                  >
                    Clear filters
                  </button>
                </div>
              )
            )}

            {/* Pagination */}
            {totalItems > 0 && (
              <div className="mt-16 flex justify-center">
                <TablePagination
                  component="div"
                  count={totalItems}
                  page={muiPage}
                  onPageChange={handlePageChange}
                  rowsPerPage={perPageParam}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  rowsPerPageOptions={[9, 18, 27]}
                  labelRowsPerPage="Per page:"
                  className="bg-white/[0.02] border border-white/5 rounded-full px-4 text-neutral-400"
                  sx={{
                    color: "inherit",
                    ".MuiSvgIcon-root": { color: "inherit" },
                    "& .MuiTablePagination-selectLabel": { color: "#a3a3a3" },
                    "& .MuiTablePagination-select": {
                      color: "white",
                      fontWeight: "bold",
                    },
                    "& .MuiTablePagination-actions button": {
                      color: "white",
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                    },
                  }}
                  SelectProps={{
                    MenuProps: {
                      PaperProps: {
                        sx: {
                          backgroundColor: "#0a0a0a",
                          color: "white",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "12px",
                          "& .MuiMenuItem-root": {
                            fontSize: "14px",
                            fontWeight: "500",
                            "&:hover": {
                              backgroundColor: "rgba(255,255,255,0.05)",
                            },
                            "&.Mui-selected": {
                              backgroundColor:
                                "rgba(236, 72, 153, 0.2) !important",
                              color: "#ec4899",
                              "&:hover": {
                                backgroundColor:
                                  "rgba(236, 72, 153, 0.3) !important",
                              },
                            },
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Event;

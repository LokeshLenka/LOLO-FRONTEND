import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  Clock,
  MapPin,
  ArrowRight,
  X,
  AlertCircle,
  ChevronDown,
  ArrowUpDown,
  Star,
  Hourglass,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@heroui/button";
import TablePagination from "@mui/material/TablePagination";
import axios, { AxiosError } from "axios";

// --- Interfaces ---
interface ConcertImage {
  uuid: string;
  url: string;
  alt_txt: string;
}

interface ConcertData {
  uuid: string;
  title: string;
  description: string;
  genre: "Rock" | "Jazz" | "Classical" | "Fusion" | "Pop";
  status: "upcoming" | "live" | "archived";
  date: string;
  venue: string;
  duration: string;
  video_url?: string;
  images: ConcertImage[];
  // Added to fix property access error
  registration_deadline?: string;
}

interface LaravelPaginatedResponse {
  current_page: number;
  data: ConcertData[];
  total: number;
}

interface ApiResponse {
  status: number;
  message: string;
  concerts: LaravelPaginatedResponse;
}

const CATEGORIES = ["All", "upcoming", "live", "archived"] as const;
const SORT_OPTIONS = [
  { label: "Date (Newest)", value: "date_desc" },
  { label: "Date (Oldest)", value: "date_asc" },
  { label: "Name (A-Z)", value: "name_asc" },
];

// --- Utility Functions ---

const formatConcertDate = (dateString?: string) => {
  if (!dateString) return { day: "TBD", month: "", time: "", full: "" };
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime()))
    return { day: "TBD", month: "", time: "", full: "" };

  return {
    day: date.getDate().toString(),
    month: date.toLocaleString("en-IN", { month: "short" }).toUpperCase(),
    time: date.toLocaleString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    full: date.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };
};

// FIXED: Added missing function
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

// FIXED: Renamed or created to match usage
const getConcertTypeColor = (genre: ConcertData["genre"]) => {
  switch (genre) {
    case "Rock":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    case "Jazz":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "Fusion":
      return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "Classical":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "Pop":
      return "bg-pink-500/10 text-pink-400 border-pink-500/20";
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  }
};

const Concerts: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const perPageParam = parseInt(searchParams.get("per_page") || "9", 10);
  const muiPage = pageParam > 0 ? pageParam - 1 : 0;

  const statusParam = searchParams.get("status") || "All";
  const searchParam = searchParams.get("search") || "";
  const sortParam = searchParams.get("sort") || "date_desc";

  const [concertsData, setConcertsData] =
    useState<LaravelPaginatedResponse | null>(null);
  const [heroConcert, setHeroConcert] = useState<ConcertData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [localSearch, setLocalSearch] = useState(searchParam);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    setLocalSearch(searchParam);
  }, [searchParam]);

  // --- Data Fetching ---
  const fetchConcerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const isDefaultView =
        pageParam === 1 &&
        !searchParam &&
        sortParam === "date_desc" &&
        statusParam === "All";

      const itemsToFetch = isDefaultView ? perPageParam + 1 : perPageParam;

      const response = await axios.get<ApiResponse>(
        `${API_BASE_URL}/concerts`,
        {
          params: {
            page: pageParam,
            per_page: itemsToFetch,
            status: statusParam !== "All" ? statusParam : undefined,
            search: searchParam || undefined,
            sort: sortParam,
          },
        }
      );

      if (
        response.data.concerts &&
        Array.isArray(response.data.concerts.data)
      ) {
        const fetchedConcerts = response.data.concerts.data;

        if (isDefaultView && fetchedConcerts.length > 0) {
          // Identify Hero (Latest Concert)
          const latestConcert = [...fetchedConcerts].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )[0];

          setHeroConcert(latestConcert);

          const gridConcerts = fetchedConcerts.filter(
            (c) => c.uuid !== latestConcert.uuid
          );

          setConcertsData({
            ...response.data.concerts,
            data: gridConcerts,
          });
        } else {
          setHeroConcert(null);
          setConcertsData(response.data.concerts);
        }
      } else {
        setConcertsData(null);
        setError("Unexpected response format.");
      }
    } catch (err) {
      const axiosErr = err as AxiosError;
      setError(axiosErr.message || "Failed to load concerts.");
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
    fetchConcerts();
    if (pageParam > 1) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [fetchConcerts, pageParam]);

  // --- Handlers ---
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

  const handlePageChange = (_: unknown, newPage: number) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", (newPage + 1).toString());
      return newParams;
    });
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newPerPage = parseInt(event.target.value, 10);
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("per_page", newPerPage.toString());
      newParams.set("page", "1");
      return newParams;
    });
  };

  const filteredConcerts = useMemo(() => {
    if (!concertsData?.data) return [];
    if (!localSearch) return concertsData.data;
    const lowerSearch = localSearch.toLowerCase();
    return concertsData.data.filter(
      (c) =>
        c.title.toLowerCase().includes(lowerSearch) ||
        c.description.toLowerCase().includes(lowerSearch)
    );
  }, [concertsData, localSearch]);

  const totalItems = concertsData?.total || 0;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#03a1b0] selection:text-white pb-20">
      {/* Hero & Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(3,161,176,0.08),transparent_70%)] blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-24 pb-12 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="relative text-4xl md:text-7xl font-black mb-6 tracking-tight text-white">
              <span className="relative inline-block">
                <span
                  className="absolute inset-0 bg-gradient-to-r from-[#03a1b0] via-purple-500 to-[#03a1b0] bg-clip-text text-transparent blur-lg animate-text-shimmer opacity-50 select-none"
                  aria-hidden="true"
                >
                  Concerts
                </span>
                <span className="relative bg-gradient-to-r from-[#03a1b0] via-white to-[#03a1b0] bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto]">
                  Concerts
                </span>
              </span>
              <span className="mx-3 text-2xl sm:text-4xl align-middle text-[#03a1b0]">
                &
              </span>
              <span className="relative inline-block">
                <span
                  className="absolute inset-0 bg-gradient-to-r from-[#03a1b0] via-purple-500 to-[#03a1b0] bg-clip-text text-transparent blur-lg animate-text-shimmer opacity-50 select-none"
                  aria-hidden="true"
                >
                  Performances
                </span>
                <span className="relative bg-gradient-to-r from-[#03a1b0] via-white to-[#03a1b0] bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto]">
                  Performances
                </span>
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
              Relive the electric energy of our past shows and get ready for
              upcoming musical masterpieces.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative max-w-xl mx-auto"
          >
            <input
              type="text"
              placeholder="Search concerts..."
              value={localSearch}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#03a1b0]/50 backdrop-blur-xl transition-all shadow-lg text-base"
            />
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            {localSearch && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Filters & Sorting Bar */}
      <div className="relative z-20 w-full border-b border-white/5 py-6 mb-12 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="overflow-x-auto no-scrollbar w-full md:w-auto">
            <div className="flex gap-2 min-w-max">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all border ${
                    statusParam === category
                      ? "bg-[#03a1b0] border-[#03a1b0] text-white shadow-lg shadow-[#03a1b0]/20"
                      : "bg-transparent border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
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
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all"
            >
              <ArrowUpDown size={16} />
              <span>Sort</span>
              <ChevronDown
                size={14}
                className={`transition-transform ${
                  isFilterOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#0F111A] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSortChange(opt.value)}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors ${
                      sortParam === opt.value
                        ? "text-[#03a1b0] font-bold bg-white/5"
                        : "text-gray-400"
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

      <div className="max-w-7xl mx-auto px-6 min-h-[50vh]">
        {loading ? (
          <div className="space-y-8">
            <div className="h-[500px] bg-white/5 rounded-3xl animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[500px] bg-white/5 rounded-3xl animate-pulse"
                />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle className="text-red-500 mb-2" size={40} />
            <p className="text-gray-300 mb-4 text-lg">{error}</p>
            <Button
              onPress={fetchConcerts}
              className="bg-white/10 hover:bg-white/20 text-white text-base px-6 py-2 rounded-xl"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured Concert - Rendered from separate 'heroConcert' state */}
            {heroConcert && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Star className="text-[#03a1b0]" size={24} fill="#03a1b0" />
                  <h2 className="text-2xl font-bold text-white">
                    Featured Concert
                  </h2>
                </div>

                <div className="group relative bg-[#09090b]/20 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:border-[#03a1b0]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#03a1b0]/20">
                  <div className="grid lg:grid-cols-2 gap-0">
                    <div className="relative h-[400px] lg:h-[500px] overflow-hidden bg-gray-900">
                      <div className="absolute top-6 left-6 z-10 flex flex-wrap gap-2">
                        <span className="px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-[#03a1b0] to-purple-500 text-white backdrop-blur-md shadow-lg">
                          ⭐ Featured
                        </span>
                        <span
                          className={`px-3 py-2 rounded-xl text-sm font-bold uppercase tracking-wider border ${getConcertTypeColor(
                            heroConcert.genre
                          )} backdrop-blur-md`}
                        >
                          {heroConcert.genre}
                        </span>
                        <span className="px-3 py-2 rounded-xl text-sm font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-md border border-white/10">
                          {heroConcert.status}
                        </span>
                      </div>

                      <img
                        src={
                          heroConcert.images?.[0]?.url ||
                          "https://via.placeholder.com/800x600"
                        }
                        alt={heroConcert.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      <div className="absolute bottom-6 left-6 bg-black/10 backdrop-blur-lg border border-white/10 rounded-xl px-5 py-3 flex flex-col items-center min-w-[90px] text-center shadow-xl">
                        <span className="text-sm font-bold text-white uppercase leading-none">
                          {formatConcertDate(heroConcert.date).month}
                        </span>
                        <span className="text-4xl font-black text-white leading-none mt-1">
                          {formatConcertDate(heroConcert.date).day}
                        </span>
                      </div>
                    </div>

                    <div className="p-8 lg:p-10 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-4 mb-4 text-gray-400">
                          <div className="flex items-center gap-2">
                            <Clock size={18} className="text-[#03a1b0]" />
                            <span className="text-sm font-medium">
                              {formatConcertDate(heroConcert.date).time}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={18} className="text-[#03a1b0]" />
                            <span className="text-sm font-medium">
                              {heroConcert.venue}
                            </span>
                          </div>
                        </div>

                        <h3 className="text-3xl lg:text-4xl font-black text-white leading-tight mb-4 group-hover:text-[#03a1b0] transition-colors">
                          {heroConcert.title}
                        </h3>
                        <p className="text-gray-300 text-base lg:text-lg leading-relaxed mb-6 line-clamp-4">
                          {heroConcert.description}
                        </p>

                        {/* Optional Registration Logic for Concerts (if ticketed) */}
                        {formatDeadline(heroConcert.registration_deadline) && (
                          <div className="inline-flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl mb-6">
                            <Hourglass
                              size={18}
                              className={
                                heroConcert.registration_deadline &&
                                new Date(heroConcert.registration_deadline) <
                                  new Date(Date.now() + 86400000 * 2)
                                  ? "text-orange-400"
                                  : "text-[#03a1b0]"
                              }
                            />
                            <div>
                              <span className="text-xs text-gray-500 uppercase tracking-wide font-bold block">
                                Ticket Deadline
                              </span>
                              <span
                                className={`text-sm font-semibold ${
                                  heroConcert.registration_deadline &&
                                  new Date(heroConcert.registration_deadline) <
                                    new Date(Date.now() + 86400000 * 2)
                                    ? "text-orange-300"
                                    : "text-gray-200"
                                }`}
                              >
                                {formatDeadline(
                                  heroConcert.registration_deadline
                                )}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-6 border-t border-white/5">
                        <Link to={`/concerts/${heroConcert.uuid}`}>
                          <Button className="w-full sm:w-auto bg-gradient-to-r from-[#03a1b0] to-purple-500 hover:from-[#028f9c] hover:to-purple-600 text-white border-0 rounded-xl px-8 h-14 transition-all group-hover:translate-x-1 flex items-center justify-center gap-3 text-lg font-bold shadow-lg shadow-[#03a1b0]/20">
                            View Concert Details <ArrowRight size={20} />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Regular Concerts Grid */}
            {filteredConcerts.length > 0 ? (
              <>
                {heroConcert && (
                  <div className="flex items-center gap-3 pt-8">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    <h2 className="text-xl font-bold text-gray-400 uppercase tracking-wider">
                      More Concerts
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredConcerts.map((concert) => {
                    const concertDate = formatConcertDate(concert.date);
                    const deadline = formatDeadline(
                      concert.registration_deadline
                    );
                    const isDeadlineApproaching = concert.registration_deadline
                      ? new Date(concert.registration_deadline) <
                        new Date(Date.now() + 86400000 * 2)
                      : false;

                    return (
                      <motion.div
                        key={concert.uuid}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="group relative bg-[#09090b]/20 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:border-[#03a1b0]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#03a1b0]/10 flex flex-col min-h-[500px]"
                      >
                        <div className="relative h-64 overflow-hidden bg-gray-900">
                          <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
                            <span
                              className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${getConcertTypeColor(
                                concert.genre
                              )} backdrop-blur-md`}
                            >
                              {concert.genre}
                            </span>
                            <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-md border border-white/10">
                              {concert.status}
                            </span>
                          </div>

                          <img
                            src={
                              concert.images?.[0]?.url ||
                              "https://via.placeholder.com/800x600"
                            }
                            alt={concert.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                          />

                          <div className="absolute bottom-4 left-4 bg-black/10 backdrop-blur-lg border border-white/10 rounded-xl px-4 py-2 flex flex-col items-center min-w-[80px] text-center shadow-xl">
                            <span className="text-sm font-bold text-white uppercase leading-none">
                              {concertDate.month}
                            </span>
                            <span className="text-3xl font-black text-white leading-none mt-1">
                              {concertDate.day}
                            </span>
                          </div>
                        </div>

                        <div className="p-6 flex flex-col flex-grow">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
                              <Clock size={16} className="text-[#03a1b0]" />
                              <span>{concertDate.time}</span>
                            </div>
                          </div>

                          <h3 className="text-2xl font-bold text-white leading-tight mb-3 line-clamp-2 group-hover:text-[#03a1b0] transition-colors">
                            {concert.title}
                          </h3>
                          <p className="text-gray-300 text-base leading-relaxed mb-6 line-clamp-2 flex-grow">
                            {concert.description}
                          </p>

                          <div className="pt-5 mt-auto border-t border-white/5 flex items-end justify-between">
                            <div className="flex flex-col gap-1">
                              {deadline ? (
                                <>
                                  <span className="text-xs uppercase tracking-wide text-gray-500 font-bold flex items-center gap-1.5">
                                    <Hourglass
                                      size={14}
                                      className={
                                        isDeadlineApproaching
                                          ? "text-orange-400"
                                          : "text-gray-500"
                                      }
                                    />
                                    Deadline
                                  </span>
                                  <span
                                    className={`text-sm font-semibold ${
                                      isDeadlineApproaching
                                        ? "text-orange-300"
                                        : "text-gray-200"
                                    }`}
                                  >
                                    {deadline}
                                  </span>
                                </>
                              ) : (
                                <span className="text-sm text-gray-500 italic">
                                  No Registration Required
                                </span>
                              )}
                            </div>

                            <Link to={`/concerts/${concert.uuid}`}>
                              <Button className="bg-white/5 hover:bg-[#03a1b0] hover:text-white text-white border border-white/10 rounded-xl px-5 h-12 transition-all group-hover:translate-x-1 flex items-center gap-2 text-base font-medium">
                                Details <ArrowRight size={18} />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            ) : (
              !heroConcert && (
                <div className="py-24 text-center bg-white/[0.02] border border-white/5 rounded-3xl">
                  <Search size={48} className="text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-300 text-xl font-bold">
                    No concerts found
                  </p>
                  <p className="text-gray-500 mt-2">
                    We couldn't find any concerts matching your criteria.
                  </p>
                  <button
                    onClick={clearSearch}
                    className="text-[#03a1b0] text-base mt-4 hover:underline font-medium"
                  >
                    Clear filters
                  </button>
                </div>
              )
            )}

            {/* Pagination */}
            {totalItems > 0 && (
              <div className="mt-12 flex flex-col sm:flex-row justify-center sm:justify-end items-center gap-4">
                <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden w-full sm:w-auto">
                  <TablePagination
                    component="div"
                    count={totalItems}
                    page={muiPage}
                    onPageChange={handlePageChange}
                    rowsPerPage={perPageParam}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    rowsPerPageOptions={[9, 18, 27]}
                    labelRowsPerPage="Per page:"
                    sx={{
                      color: "inherit",
                      width: "100%",
                      ".MuiToolbar-root": {
                        paddingLeft: 2,
                        paddingRight: 2,
                        flexWrap: "wrap",
                        justifyContent: "center",
                      },
                      ".MuiTablePagination-selectLabel": { margin: 0 },
                      ".MuiTablePagination-displayedRows": { margin: 0 },
                      ".MuiSvgIcon-root": { color: "inherit" },
                      ".MuiTablePagination-actions": { marginLeft: 1 },
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Concerts;

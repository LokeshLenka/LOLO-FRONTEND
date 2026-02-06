import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom"; // Added useSearchParams
import { motion } from "framer-motion";
import {
  Search,
  Clapperboard,
  Music,
  Mic2,
  X,
  ArrowRight,
  Film,
  ArrowUpDown, // Added
  ChevronDown, // Added
} from "lucide-react";

// --- Types ---
interface Production {
  id: string;
  uuid: string;
  title: string;
  year: string;
  type: "Feature Film" | "Short Film" | "Music Video" | "Web Series";
  lolo_role: string;
  description: string;
  thumbnail_url: string;
  director: string;
  link?: string;
  created_at?: string; // Optional: needed if you want to sort by date for real data
}

// --- Mock Data ---
const PRODUCTIONS: Production[] = [
  {
    id: "1",
    uuid: "prod-001",
    title: "Subbayya B.Tech ",
    year: "2025",
    type: "Short Film",
    lolo_role: "Original Score & Sound Design",
    director: "Director Name",
    description:
      "A narrative exploring the struggle of a B.Tech graduate for a job and the conflict between his past and present situations. LOLO Studios handled the complete sonic landscape and emotional background score.",
    thumbnail_url: "https://img.youtube.com/vi/FIVPKLOL-3A/maxresdefault.jpg",
    link: "#",
  },
];

const CATEGORIES = [
  "All",
  "Short Film",
  "Feature Film",
  "Music Video",
  "Web Series",
];

// Added Sorting Options
const SORT_OPTIONS = [
  { label: "Newest First", value: "date_desc" },
  { label: "Oldest First", value: "date_asc" },
  { label: "Name (A-Z)", value: "name_asc" },
];

// 🎨 THEME UTILS
const getTypeColor = (type: string) => {
  switch (type) {
    case "Short Film":
      return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "Music Video":
      return "bg-lolo-pink/10 text-lolo-pink border-lolo-pink/20";
    case "Feature Film":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    default:
      return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
  }
};

const getIcon = (role: string) => {
  if (role.includes("Score")) return <Music size={14} />;
  if (role.includes("Vocals")) return <Mic2 size={14} />;
  return <Clapperboard size={14} />;
};

export default function Publication() {
  const [searchParams, setSearchParams] = useSearchParams(); // Hook for URL params
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Sorting State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const sortParam = searchParams.get("sort") || "date_desc";

  const handleSortChange = (val: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("sort", val);
      return newParams;
    });
    setIsFilterOpen(false);
  };

  const filteredWork = useMemo(() => {
    let filtered = PRODUCTIONS.filter((work) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        work.title.toLowerCase().includes(searchLower) ||
        work.description.toLowerCase().includes(searchLower) ||
        work.lolo_role.toLowerCase().includes(searchLower);

      const matchesCategory =
        selectedCategory === "All" || work.type === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Apply Sorting
    return filtered.sort((a, b) => {
      if (sortParam === "name_asc") {
        return a.title.localeCompare(b.title);
      }
      if (sortParam === "date_asc") {
        return parseInt(a.year) - parseInt(b.year); // Simple year sort for now
      }
      // Default: date_desc (Newest First)
      return parseInt(b.year) - parseInt(a.year);
    });
  }, [searchTerm, selectedCategory, sortParam]);

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-lolo-pink/30 selection:text-white pb-20 relative overflow-hidden">
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-lolo-cyan/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-lolo-pink/10 rounded-full blur-[120px] pointer-events-none" />

      {/* 1. Hero & Header */}
      <div className="relative overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-12 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="relative text-4xl md:text-7xl font-bold mb-6 tracking-tight text-white">
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-purple-400 via-white to-purple-400 bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto]">
                  LOLO
                </span>
              </span>
              <span className="mx-3 text-2xl sm:text-4xl align-middle text-lolo-pink font-club">
                &
              </span>
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-lolo-pink via-white to-lolo-pink bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto]">
                  Productions
                </span>
              </span>
            </h1>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              The sonic heartbeat behind SRKR's finest films. From original
              scores to full-scale music production.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative max-w-xl mx-auto"
          >
            <input
              type="text"
              placeholder="Search productions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-10 py-4 bg-white/[0.02] border border-white/5 rounded-full text-white placeholder-neutral-600 focus:outline-none focus:border-white/20 backdrop-blur-xl transition-all shadow-lg text-base"
            />
            <Search
              className="absolute left-5 top-1/2 transform -translate-y-1/2 text-neutral-500"
              size={18}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-white/10 text-neutral-500 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </motion.div>
        </div>
      </div>

      {/* 2. Filter Tabs & Sorting (Sticky) */}
      <div className="sticky top-16 md:top-20 z-20 bg-transparent backdrop-blur-xl py-4 mb-12 transition-all">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Categories */}
          <div className="overflow-x-auto no-scrollbar w-full md:w-auto">
            <div className="flex gap-2 min-w-max">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${
                    selectedCategory === category
                      ? "bg-white text-black border-white"
                      : "bg-white/[0.02] border-white/5 text-neutral-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Sorting Dropdown (Added) */}
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

      {/* 3. Work Grid */}
      <div className="max-w-7xl mx-auto px-6 min-h-[50vh] relative z-10">
        {filteredWork.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredWork.map((work, index) => (
              <motion.div
                key={work.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group relative bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-lolo-pink/30 transition-all duration-500 flex flex-col sm:flex-row h-auto sm:h-80"
              >
                {/* Image Section */}
                <div className="w-full sm:w-2/5 h-56 sm:h-full relative overflow-hidden">
                  <img
                    src={work.thumbnail_url}
                    alt={work.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white border border-white/10 uppercase tracking-wider">
                      {work.year}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${getTypeColor(
                          work.type,
                        )}`}
                      >
                        {work.type}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-lolo-pink transition-colors leading-tight">
                      {work.title}
                    </h3>

                    <p className="text-[10px] font-bold text-neutral-500 mb-4 uppercase tracking-widest">
                      Dir. {work.director}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-neutral-300 mb-4 font-bold bg-white/5 px-3 py-2 rounded-lg w-fit border border-white/5">
                      <span className="text-lolo-pink">
                        {getIcon(work.lolo_role)}
                      </span>
                      <span>{work.lolo_role}</span>
                    </div>

                    <p className="text-neutral-400 text-sm line-clamp-2 leading-relaxed">
                      {work.description}
                    </p>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-auto">
                    <Link
                      to={`/publications/${work.uuid}`}
                      className="flex items-center gap-2 text-sm font-bold text-white hover:text-lolo-pink transition-colors group/link"
                    >
                      View Production Info
                      <ArrowRight
                        size={16}
                        className="group-hover/link:translate-x-1 transition-transform"
                      />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          // Empty State
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-32 text-center bg-white/[0.02] border border-white/5 rounded-[2.5rem]"
          >
            <div className="inline-flex p-5 rounded-full bg-white/5 mb-6">
              <Film size={32} className="text-neutral-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              No productions found
            </h3>
            <p className="text-neutral-500 max-w-md mx-auto mb-6 text-sm">
              We couldn't find any projects matching "{searchTerm}".
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="text-lolo-pink hover:underline font-bold uppercase tracking-wider text-sm"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

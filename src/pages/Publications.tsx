import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  ExternalLink,
  Clapperboard,
  Music,
  Mic2,
  X,
  ArrowRight,
  Play,
  Film,
} from "lucide-react";

// --- Types (Matching the proposed DB structure) ---
interface Production {
  id: string;
  uuid: string;
  title: string;
  year: string;
  type: "Feature Film" | "Short Film" | "Music Video" | "Web Series";
  lolo_role: string; // What did LOLO do? (e.g., "Original Score", "Music Production")
  description: string;
  thumbnail_url: string;
  director: string;
  link?: string;
}

// --- Mock Data ---
const PRODUCTIONS: Production[] = [
  {
    id: "1",
    uuid: "prod-001",
    title: "B.tech Subbayya",
    year: "2025",
    type: "Short Film",
    lolo_role: "Original Score & Sound Design",
    director: "Rajesh Kumar",
    description:
      "A comedic yet touching narrative exploring the pressures of engineering life and youthful ambition in a small town college setting. LOLO produced the entire background score and the viral title track.",
    thumbnail_url:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    link: "#",
  },
  {
    id: "2",
    uuid: "prod-002",
    title: "Echoes of Silence",
    year: "2024",
    type: "Music Video",
    lolo_role: "Music Production & Vocals",
    director: "Sarah Lee",
    description:
      "Visual storytelling for the hit single by The Void. Explored themes of isolation using experimental lighting techniques. Produced, Mixed and Mastered at LOLO Studios.",
    thumbnail_url:
      "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    link: "#",
  },
  {
    id: "3",
    uuid: "prod-003",
    title: "The Last Act",
    year: "2023",
    type: "Feature Film",
    lolo_role: "Background Score",
    director: "K. Viswanath (Tribute)",
    description:
      "A gritty drama about a failing theater troupe. LOLO provided a classical-fusion score that received critical acclaim at local film festivals.",
    thumbnail_url:
      "https://images.unsplash.com/photo-1503095392269-27528ca38925?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "4",
    uuid: "prod-004",
    title: "Campus Chronicles",
    year: "2023",
    type: "Web Series",
    lolo_role: "Title Track Composer",
    director: "Student Council",
    description:
      "The official web series documenting student life at SRKR. The high-energy title track composed by LOLO became the campus anthem.",
    thumbnail_url:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
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

// Helper for styling based on type
const getTypeColor = (type: string) => {
  switch (type) {
    case "Short Film":
      return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "Music Video":
      return "bg-pink-500/10 text-pink-400 border-pink-500/20";
    case "Feature Film":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    default:
      return "bg-[#03a1b0]/10 text-[#03a1b0] border-[#03a1b0]/20";
  }
};

const getIcon = (role: string) => {
  if (role.includes("Score")) return <Music size={14} />;
  if (role.includes("Vocals")) return <Mic2 size={14} />;
  return <Clapperboard size={14} />;
};

export default function Publication() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredWork = useMemo(() => {
    return PRODUCTIONS.filter((work) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        work.title.toLowerCase().includes(searchLower) ||
        work.description.toLowerCase().includes(searchLower) ||
        work.lolo_role.toLowerCase().includes(searchLower);

      const matchesCategory =
        selectedCategory === "All" || work.type === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#03a1b0] selection:text-white pb-20">
      {/* 1. Hero & Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(3,161,176,0.08),transparent_70%)] blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-24 pb-12 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="relative text-4xl md:text-7xl font-black mb-6 tracking-tight text-white">
              <span className="relative inline-block">
                <span className="absolute inset-0 bg-gradient-to-r from-[#03a1b0] via-purple-500 to-[#03a1b0] bg-clip-text text-transparent blur-lg animate-text-shimmer opacity-50 select-none">
                  LOLO
                </span>
                <span className="relative bg-gradient-to-r from-[#03a1b0] via-white to-[#03a1b0] bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto]">
                  LOLO
                </span>
              </span>
              <span className="mx-3 text-2xl sm:text-4xl align-middle text-[#03a1b0]">
                &
              </span>
              <span className="relative inline-block">
                <span className="absolute inset-0 bg-gradient-to-r from-[#03a1b0] via-purple-500 to-[#03a1b0] bg-clip-text text-transparent blur-lg animate-text-shimmer opacity-50 select-none">
                  Productions
                </span>
                <span className="relative bg-gradient-to-r from-[#03a1b0] via-white to-[#03a1b0] bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto]">
                  Productions
                </span>
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
              The sonic heartbeat behind SRKR's finest films. From original
              scores to full-scale music production.
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
              placeholder="Search productions (e.g., B.tech Subbayya)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#03a1b0]/50 backdrop-blur-xl transition-all shadow-lg text-base"
            />
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </motion.div>
        </div>
      </div>

      {/* 2. Filter Tabs (Sticky) */}
      <div className="top-16 md:top-20 z-20 bg-black/90 backdrop-blur-xl border-b border-white/5 py-4 mb-12 transition-all">
        <div className="max-w-7xl mx-auto px-6 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 min-w-max">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all border ${
                  selectedCategory === category
                    ? "bg-[#03a1b0] border-[#03a1b0] text-white shadow-lg shadow-[#03a1b0]/20"
                    : "bg-transparent border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Work Grid */}
      <div className="max-w-7xl mx-auto px-6 min-h-[50vh]">
        {filteredWork.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredWork.map((work, index) => (
              <motion.div
                key={work.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group relative bg-[#09090b]/20 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:border-[#03a1b0]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#03a1b0]/10 flex flex-col sm:flex-row h-auto sm:h-80"
              >
                {/* Image Section (Left Side) */}
                <div className="w-full sm:w-2/5 h-56 sm:h-full relative overflow-hidden">
                  <img
                    src={work.thumbnail_url}
                    alt={work.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black via-black/20 to-transparent opacity-80"></div>

                  {/* Year Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-xs font-bold text-white border border-white/10">
                      {work.year}
                    </span>
                  </div>

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 bg-[#03a1b0]/90 rounded-full flex items-center justify-center text-white shadow-lg backdrop-blur-sm transform scale-75 group-hover:scale-100 transition-transform">
                      <Play size={20} fill="currentColor" />
                    </div>
                  </div>
                </div>

                {/* Content Section (Right Side) */}
                <div className="flex-1 p-6 flex flex-col">
                  <div className="">
                    <div className="flex justify-between items-start mb-3">
                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${getTypeColor(
                          work.type
                        )}`}
                      >
                        {work.type}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-[#03a1b0] transition-colors leading-tight">
                      {work.title}
                    </h3>

                    <p className="text-xs font-medium text-gray-500 mb-4 uppercase tracking-wide">
                      Dir. {work.director}
                    </p>

                    <div className="flex items-center gap-2 text-sm text-gray-200 mb-4 font-semibold bg-white/5 p-2 rounded-lg w-fit border border-white/5">
                      <span className="text-[#03a1b0]">
                        {getIcon(work.lolo_role)}
                      </span>
                      <span>{work.lolo_role}</span>
                    </div>

                    <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
                      {work.description}
                    </p>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-5 mt-1 border-t border-white/5 flex items-center justify-between">
                    <Link
                      to={`/publications/${work.uuid}`}
                      className="flex items-center gap-2 text-sm font-bold text-white hover:text-[#03a1b0] transition-colors group/link"
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
            className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02]"
          >
            <div className="inline-flex p-4 rounded-full bg-white/5 mb-4">
              <Film size={32} className="text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              No productions found
            </h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              We couldn't find any projects matching "{searchTerm}".
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="text-[#03a1b0] hover:underline font-bold"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

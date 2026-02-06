import React, { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom"; // Added useSearchParams
import { motion } from "framer-motion";
import {
  Search,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Music,
  Code,
  Mic2,
  User,
  ArrowRight,
  ArrowUpDown,
  ChevronDown,
  X,
} from "lucide-react";
import { Button } from "@heroui/button";

// --- Interfaces ---
interface SocialLinks {
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  email?: string;
  youtube?: string;
  spotify?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  fullBio?: string;
  socialLinks: SocialLinks;
  category: "coordinator" | "singer" | "instrumentalist" | "technical";
  joinDate?: string;
}

// --- Mock Data ---
const TEAM_MEMBERS: TeamMember[] = [
  // Add your mock data here if needed for testing
];

const CATEGORIES = [
  "All",
  "coordinator",
  "singer",
  "instrumentalist",
  "technical",
] as const;

// Added Sorting Options to match other pages
const SORT_OPTIONS = [
  { label: "Name (A-Z)", value: "name_asc" },
  { label: "Name (Z-A)", value: "name_desc" },
  { label: "Newest Joined", value: "date_desc" },
];

// --- Helper Components ---
const SocialIconLink = ({ href, icon: Icon }: { href?: string; icon: any }) => {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 rounded-full bg-white/5 hover:bg-lolo-pink hover:text-white text-neutral-400 transition-all"
    >
      <Icon size={16} />
    </a>
  );
};

const Team: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State management via URL params
  const categoryParam = searchParams.get("category") || "All";
  const searchParam = searchParams.get("search") || "";
  const sortParam = searchParams.get("sort") || "name_asc";

  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // --- Handlers ---
  const handleCategoryChange = (cat: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (cat === "All") newParams.delete("category");
      else newParams.set("category", cat);
      return newParams;
    });
  };

  const handleSortChange = (val: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("sort", val);
      return newParams;
    });
    setIsFilterOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (val) newParams.set("search", val);
      else newParams.delete("search");
      return newParams;
    });
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.delete("search");
      return newParams;
    });
  };

  // --- Filtering Logic ---
  const filteredMembers = useMemo(() => {
    let result = TEAM_MEMBERS;

    // 1. Filter by Category
    if (categoryParam !== "All") {
      result = result.filter((m) => m.category === categoryParam);
    }

    // 2. Filter by Search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(lowerSearch) ||
          m.role.toLowerCase().includes(lowerSearch),
      );
    }

    // 3. Sort
    result = result.sort((a, b) => {
      if (sortParam === "name_asc") return a.name.localeCompare(b.name);
      if (sortParam === "name_desc") return b.name.localeCompare(a.name);
      // Mock date sort (assuming joinDate string exists, otherwise fallback to name)
      if (sortParam === "date_desc")
        return (b.joinDate || "").localeCompare(a.joinDate || "");
      return 0;
    });

    return result;
  }, [searchTerm, categoryParam, sortParam]);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "singer":
        return <Mic2 size={14} />;
      case "instrumentalist":
        return <Music size={14} />;
      case "technical":
        return <Code size={14} />;
      case "coordinator":
        return <User size={14} />;
      default:
        return <User size={14} />;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "coordinator":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "singer":
        return "bg-lolo-pink/10 text-lolo-pink border-lolo-pink/20";
      case "technical":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default:
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-lolo-pink/30 selection:text-white pb-20 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-lolo-cyan/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-lolo-pink/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <div className="relative overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-12 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight text-white">
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-purple-400 via-white to-purple-400 bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto]">
                  Our
                </span>
              </span>
              <span className="mx-3 text-lolo-pink font-club">&</span>
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-lolo-pink via-white to-lolo-pink bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto]">
                  Team
                </span>
              </span>
            </h1>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              The passionate vocalists, instrumentalists, and tech wizards
              behind every LOLO experience.
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
              placeholder="Search team members..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-10 py-4 bg-white/[0.02] border border-white/5 rounded-full text-white placeholder-neutral-600 focus:outline-none focus:border-white/20 backdrop-blur-xl transition-all shadow-lg text-base"
            />
            <Search
              className="absolute left-5 top-1/2 transform -translate-y-1/2 text-neutral-500"
              size={18}
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={16} className="text-neutral-500 hover:text-white" />
              </button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Filter Bar (Updated UI) */}
      <div className="relative z-20 w-full py-6 mb-12 bg-transparent backdrop-blur-md ">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="overflow-x-auto no-scrollbar w-full md:w-auto">
            <div className="flex gap-2 min-w-max">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border capitalize ${
                    categoryParam === category
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

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 min-h-[50vh] relative z-10">
        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredMembers.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-lolo-pink/30 transition-all duration-500 flex flex-col"
              >
                {/* Image Area */}
                <div className="relative h-72 overflow-hidden bg-neutral-900">
                  {/* Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border backdrop-blur-md flex items-center gap-1.5 ${getCategoryColor(
                        member.category,
                      )}`}
                    >
                      {getCategoryIcon(member.category)}
                      {member.category}
                    </span>
                  </div>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />
                  {/* Social Overlay */}
                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex gap-2 justify-center">
                    <SocialIconLink
                      href={member.socialLinks.linkedin}
                      icon={Linkedin}
                    />
                    <SocialIconLink
                      href={member.socialLinks.github}
                      icon={Github}
                    />
                    <SocialIconLink
                      href={member.socialLinks.instagram}
                      icon={Instagram}
                    />
                    <SocialIconLink
                      href={member.socialLinks.twitter}
                      icon={Twitter}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow text-center">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-lolo-pink transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-4">
                    {member.role}
                  </p>
                  <p className="text-neutral-400 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                    {member.bio}
                  </p>

                  <Link to={`/team/${member.id}`} className="mt-auto w-full">
                    <Button className="w-full bg-white/5 hover:bg-white hover:text-black text-white border border-white/10 rounded-full h-12 text-sm font-bold transition-all shadow-[0_0_20px_rgba(0,0,0,0.2)]">
                      View Profile <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
            <User size={48} className="text-neutral-600 mx-auto mb-4" />
            <p className="text-white text-xl font-bold">
              No team members found
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSearchParams((prev) => {
                  const newParams = new URLSearchParams(prev);
                  newParams.delete("search");
                  newParams.delete("category");
                  return newParams;
                });
              }}
              className="text-lolo-pink mt-4 hover:underline font-bold uppercase tracking-wider text-sm"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Team;

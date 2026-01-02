import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
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
  fullBio?: string; // Extended bio for details page
  socialLinks: SocialLinks;
  category: "coordinator" | "singer" | "instrumentalist" | "technical";
  joinDate?: string;
}

// --- Mock Data (Moved outside for cleaner component) ---
const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "coord1",
    name: "Dr. Vasundara",
    role: "Faculty Coordinator",
    image:
      "https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    bio: "Leading the MEFA department with a vision for student excellence.",
    fullBio: "Dr. Vasundara has over 15 years of experience in academia...",
    socialLinks: { email: "vasundara@college.edu" },
    category: "coordinator",
  },
  {
    id: "singer1",
    name: "The SCS",
    role: "Lead Vocalist",
    image:
      "https://images.unsplash.com/photo-1516280440614-6697288d5d38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    bio: "Soulful voice that captivates every audience at LOLO events.",
    socialLinks: { instagram: "#", spotify: "#" },
    category: "singer",
  },
  {
    id: "inst1",
    name: "Lowell",
    role: "Lead Pianist",
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    bio: "Classical training meets modern improvisation.",
    socialLinks: { instagram: "#" },
    category: "instrumentalist",
  },
  {
    id: "tech1",
    name: "Lokesh Lenka",
    role: "Tech Lead",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    bio: "Web developer, designer, and the brain behind LOLO digital.",
    socialLinks: { linkedin: "#", github: "https://github.com/LokeshLenka" },
    category: "technical",
  },
  // Add more dummy data as needed
];

const CATEGORIES = [
  "All",
  "coordinator",
  "singer",
  "instrumentalist",
  "technical",
] as const;

// --- Helper Components ---
const SocialIconLink = ({ href, icon: Icon }: { href?: string; icon: any }) => {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 rounded-full bg-white/5 hover:bg-[#03a1b0] hover:text-white text-gray-400 transition-all"
    >
      <Icon size={16} />
    </a>
  );
};

const Team: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"name_asc" | "name_desc">(
    "name_asc"
  );

  // --- Filtering Logic ---
  const filteredMembers = useMemo(() => {
    let result = TEAM_MEMBERS;

    // 1. Filter by Category
    if (selectedCategory !== "All") {
      result = result.filter((m) => m.category === selectedCategory);
    }

    // 2. Filter by Search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(lowerSearch) ||
          m.role.toLowerCase().includes(lowerSearch)
      );
    }

    // 3. Sort
    result = result.sort((a, b) => {
      if (sortOrder === "name_asc") return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });

    return result;
  }, [searchTerm, selectedCategory, sortOrder]);

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
        return "bg-pink-500/10 text-pink-400 border-pink-500/20";
      case "technical":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default:
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#03a1b0] selection:text-white pb-20">
      {/* Hero Section (Consistent with Events) */}
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
            <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tight text-white">
              <span className="relative inline-block">
                <span
                  className="absolute inset-0 bg-gradient-to-r from-[#03a1b0] via-purple-500 to-[#03a1b0] bg-clip-text text-transparent blur-lg animate-text-shimmer opacity-50"
                  aria-hidden="true"
                >
                  Our
                </span>
                <span className="relative bg-gradient-to-r from-[#03a1b0] via-white to-[#03a1b0] bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto]">
                  Our
                </span>
              </span>
              <span className="mx-3 text-[#03a1b0]">&</span>
              <span className="relative inline-block">
                <span
                  className="absolute inset-0 bg-gradient-to-r from-[#03a1b0] via-purple-500 to-[#03a1b0] bg-clip-text text-transparent blur-lg animate-text-shimmer opacity-50"
                  aria-hidden="true"
                >
                  Team
                </span>
                <span className="relative bg-gradient-to-r from-[#03a1b0] via-white to-[#03a1b0] bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto]">
                  Team
                </span>
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
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
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-white/10 rounded-full"
              >
                <X size={16} className="text-gray-400" />
              </button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="relative z-20 w-full border-b border-white/5 py-6 mb-12 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="overflow-x-auto no-scrollbar w-full md:w-auto">
            <div className="flex gap-2 min-w-max">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-bold capitalize transition-all border ${
                    selectedCategory === cat
                      ? "bg-[#03a1b0] border-[#03a1b0] text-white shadow-lg shadow-[#03a1b0]/20"
                      : "bg-transparent border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="relative ml-auto">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all"
            >
              <ArrowUpDown size={16} />
              <span>Sort</span>
              <ChevronDown
                size={14}
                className={`transition-transform ${
                  isSortOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isSortOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#0F111A] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
                <button
                  onClick={() => {
                    setSortOrder("name_asc");
                    setIsSortOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 text-gray-300"
                >
                  Name (A-Z)
                </button>
                <button
                  onClick={() => {
                    setSortOrder("name_desc");
                    setIsSortOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 text-gray-300"
                >
                  Name (Z-A)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 min-h-[50vh]">
        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMembers.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative bg-[#09090b]/20 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:border-[#03a1b0]/50 transition-all duration-500 hover:shadow-xl hover:shadow-[#03a1b0]/10 flex flex-col"
              >
                {/* Image Area */}
                <div className="relative h-64 overflow-hidden bg-gray-900">
                  {/* Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border backdrop-blur-md flex items-center gap-1 ${getCategoryColor(
                        member.category
                      )}`}
                    >
                      {getCategoryIcon(member.category)}
                      {member.category}
                    </span>
                  </div>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#03a1b0] transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-sm text-[#03a1b0] font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-400 text-sm line-clamp-3 mb-4 flex-grow leading-relaxed">
                    {member.bio}
                  </p>

                  <Link to={`/team/${member.id}`} className="mt-auto w-full">
                    <Button className="w-full bg-white/5 hover:hover:bg-[#03a1b0] text-white border border-white/10 rounded-xl h-10 text-sm font-medium group-hover:border-[#03a1b0]/30 transition-all">
                      View Profile <ArrowRight size={14} className="ml-2" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-white/[0.02] border border-white/5 rounded-3xl">
            <User size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-300 text-xl font-bold">
              No team members found
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="text-[#03a1b0] mt-2 hover:underline"
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

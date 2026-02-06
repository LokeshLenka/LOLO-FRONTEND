import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Share2,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Mail,
  Globe,
  Calendar,
  MapPin,
  User,
} from "lucide-react";
import { Divider } from "@heroui/react";

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  image: string;
  bio?: string;
  fullBio?: string;
  category: string;
  joinDate?: string;
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    instagram?: string;
    website?: string;
    email?: string;
  };
};

// must come BEFORE usage
// import type { TeamMember } from "@/types";

// type Props = {
//   member: TeamMember;
// };

// MOCK DATA (Replace with API Call)
const MOCK_MEMBER: TeamMember = {
  id: "tech1",
  name: "Lokesh Lenka",
  role: "Web Developer & Sound Engineer",
  image:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  bio: "Short bio here.",
  fullBio: `Lokesh is a versatile talent at LoLo, excelling as a web developer, designer, membership committee head, and mixer handler. His dedication and multifaceted skills are invaluable to our team. 
    
    He has been instrumental in developing the core infrastructure of our event management systems and ensuring crystal clear sound quality during our live performances. When not coding, he is experimenting with new audio mixing techniques.`,
  socialLinks: {
    linkedin: "#",
    github: "#",
    website: "https://lokesh.dev",
    email: "lokesh@example.com",
  },
  category: "technical",
  joinDate: "Joined Sept 2023",
};

const TeamDetails: React.FC = () => {
  // const { id } = useParams<{ id: string }>();
  // const { data: member } = useFetchMember(id);
  const member = MOCK_MEMBER; // Using mock

  if (member)
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Member not found
      </div>
    );

  const SocialLink = ({
    href,
    icon: Icon,
    label,
  }: {
    href?: string;
    icon: any;
    label: string;
  }) => {
    if (!href) return null;
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-[#03a1b0]/30 transition-all group"
      >
        <div className="p-2 bg-[#03a1b0]/10 text-[#03a1b0] rounded-full group-hover:scale-110 transition-transform">
          <Icon size={18} />
        </div>
        <span className="text-sm font-medium text-gray-300 group-hover:text-white">
          {label}
        </span>
      </a>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#03a1b0] selection:text-white pb-20">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 h-16 flex items-center px-6">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <Link
            to="/team"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold group"
          >
            <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
              <ArrowLeft size={16} />
            </div>
            Back to Team
          </Link>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all active:scale-95">
            <Share2 size={18} />
          </button>
        </div>
      </nav>

      {/* Hero Profile Header */}
      <section className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden bg-[#0F111A]">
        <div className="absolute inset-0">
          {/* Background with Blur */}
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover opacity-30 blur-sm scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end gap-8">
            {/* Profile Image (Avatar style) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-40 h-40 md:w-56 md:h-56 rounded-full border-4 border-black overflow-hidden shadow-2xl relative z-10"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            <div className="flex-grow mb-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#03a1b0] text-white mb-3 inline-block">
                  {member.category}
                </span>
                <h1 className="text-4xl md:text-6xl font-black text-white mb-2">
                  {member.name}
                </h1>
                <p className="text-xl text-[#03a1b0] font-medium">
                  {member.role}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Bio & Details */}
        <div className="lg:col-span-2 space-y-10">
          <section>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
              <User className="text-[#03a1b0]" size={24} /> Biography
            </h3>
            <div className="prose prose-invert max-w-none text-gray-300 text-lg leading-relaxed whitespace-pre-line">
              {member.fullBio || member.bio}
            </div>
          </section>

          <Divider className="bg-white/10" />

          {/* Quick Stats / Info */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/5 rounded-xl p-5">
              <h4 className="text-gray-400 text-xs font-bold uppercase mb-1">
                Joined
              </h4>
              <p className="text-white font-medium flex items-center gap-2">
                <Calendar size={16} className="text-[#03a1b0]" />{" "}
                {member.joinDate || "2024"}
              </p>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-xl p-5">
              <h4 className="text-gray-400 text-xs font-bold uppercase mb-1">
                Location
              </h4>
              <p className="text-white font-medium flex items-center gap-2">
                <MapPin size={16} className="text-[#03a1b0]" /> SRKR Campus
              </p>
            </div>
          </section>
        </div>

        {/* Right: Connect / Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 p-6 rounded-3xl bg-[#0F111A] border border-[#03a1b0]/20 shadow-xl">
            <h3 className="text-xl font-bold mb-6 text-white">Connect</h3>
            <div className="grid grid-cols-1 gap-3">
              <SocialLink
                href={member.socialLinks.linkedin}
                icon={Linkedin}
                label="LinkedIn"
              />
              <SocialLink
                href={member.socialLinks.github}
                icon={Github}
                label="GitHub"
              />
              <SocialLink
                href={member.socialLinks.twitter}
                icon={Twitter}
                label="Twitter/X"
              />
              <SocialLink
                href={member.socialLinks.instagram}
                icon={Instagram}
                label="Instagram"
              />
              <SocialLink
                href={member.socialLinks.website}
                icon={Globe}
                label="Portfolio Website"
              />
              <SocialLink
                href={`mailto:${member.socialLinks.email}`}
                icon={Mail}
                label="Email Contact"
              />
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-xs text-gray-500 text-center">
                Contact for collaborations or inquiries related to LoLo events.
              </p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default TeamDetails;

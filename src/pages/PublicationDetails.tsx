import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Share2,
  Play,
  Calendar,
  User,
  Music,
  Video,
  Award,
  ExternalLink,
  Headphones,
} from "lucide-react";
import { Chip, Divider } from "@heroui/react";
import { Button } from "@heroui/button";

// --- Mock Data for Details (Replace with API call) ---
const PUBLICATIONS_DATA = [
  {
    uuid: "prod-001",
    title: "Subbayya B.Tech",
    year: "2025",
    type: "Short Film",
    status: "Released",
    director: "",
    lolo_role: "Original Score & Sound Design",
    description: `
      <p><strong>B.Tech Subbayya</strong> explores the struggle of a B.Tech graduate for a job and the conflict between his past and present situations. A narrative that resonates with every engineering student.</p>
      <p>LOLO Studios handled the complete sonic landscape, from the ambient noises of college life to the emotional background score that underscores the protagonist's journey. The sound design was crucial in highlighting the gritty reality versus the protagonist's dreams.</p>
    `,
    thumbnail_url: "https://img.youtube.com/vi/FIVPKLOL-3A/maxresdefault.jpg",

    trailer_url: "https://www.youtube.com/watch?v=Gq0-IihFBJw",
    full_video_url: "https://www.youtube.com/watch?v=FIVPKLOL-3A",

    credits: [
      // { name: "Santhosh Manapuram", role: "Director", image: null },
      // { name: "Abhilash Nekkalapu", role: "Lead Actor", image: null },
      // { name: "SK Photography", role: "DOP & Editing", image: null },
      { name: "Lowell", role: "Pianoist", image: null },
      { name: "Shanmukh", role: "Guitarist", image: null },
      { name: "Chandra Shekar", role: "Vocalist", image: null },
    ],
    tracks: [
      { title: "The Struggle Theme", duration: "3:12" },
      { title: "Past vs Present", duration: "2:45" },
      { title: "Graduate's Hope", duration: "4:00" },
    ],
  },
];

export default function PublicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // LOGIC UPDATE: Find data based on ID
  const data =
    PUBLICATIONS_DATA.find((p) => p.uuid === id) || PUBLICATIONS_DATA[0];

  // Safe Back Handler
  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    // Check if there is history to go back to (key usually exists in RRD history)
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/publications");
    }
  };

  {
    /* UPDATED LINK LOGIC */
  }
  // <a
  //   href="/publications"
  //   onClick={handleBack}
  //   className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold group cursor-pointer"
  // >
  //   <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
  //     <ArrowLeft size={16} />
  //   </div>
  //   <span className="hidden sm:inline">Back to Publications</span>
  //   <span className="sm:hidden">Back</span>
  // </a>

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#03a1b0] selection:text-white pb-20">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 h-16 flex items-center px-6">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          {/* link to go to previous page */}
          <a
            href="/publications"
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold group cursor-pointer"
          >
            <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
              <ArrowLeft size={16} />
            </div>
            <span className="inline">Back to Publications</span>
          </a>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all">
            <Share2 size={18} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden bg-[#0F111A]">
        <div className="absolute inset-0">
          <img
            src={data.thumbnail_url}
            alt={data.title}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-wrap gap-3 mb-6">
                <Chip className="bg-[#03a1b0] text-white font-bold border-none">
                  {data.type}
                </Chip>
                <Chip variant="bordered" className="border-white/30 text-white">
                  {data.year}
                </Chip>
              </div>

              <h1 className="text-4xl md:text-7xl font-black leading-tight max-w-4xl mb-6 text-white drop-shadow-2xl">
                {data.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-gray-200 font-medium text-lg mb-8">
                <div className="flex items-center gap-2">
                  <User size={20} className="text-[#03a1b0]" />
                  <span>Dir. {data.director}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Music size={20} className="text-[#03a1b0]" />
                  <span>{data.lolo_role}</span>
                </div>
              </div>

              {/* UPDATED BUTTON SECTION */}
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link
                  to={data.full_video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full sm:w-auto bg-white text-black font-bold px-8 py-6 rounded-full hover:bg-gray-200 flex items-center justify-center gap-3 text-lg transition-transform active:scale-95">
                    <Play fill="black" size={20} className="shrink-0" />
                    <span>Watch Film</span>
                  </Button>
                </Link>
                <Link
                  to={data.trailer_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full sm:w-auto bg-white/10 text-white font-bold px-8 py-6 rounded-full hover:bg-white/20 flex items-center justify-center gap-3 text-lg border border-white/10 transition-transform active:scale-95">
                    <Video size={20} className="shrink-0" />
                    <span>Trailer</span>
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Description & Credits */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
              <Award className="text-[#03a1b0]" size={24} /> Production Notes
            </h3>
            <div
              className="prose prose-invert max-w-none text-gray-300 leading-relaxed text-lg"
              dangerouslySetInnerHTML={{ __html: data.description }}
            />
          </section>

          <Divider className="bg-white/10" />

          <section>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
              <User className="text-[#03a1b0]" size={24} /> LOLO Team Credits
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.credits.map((credit, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#03a1b0]/30 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-800 overflow-hidden flex-shrink-0">
                    {credit.image ? (
                      <img
                        src={credit.image}
                        alt={credit.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#03a1b0] text-white font-bold">
                        {credit.name[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">
                      {credit.name}
                    </h4>
                    <p className="text-[#03a1b0] text-sm font-medium uppercase tracking-wide">
                      {credit.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right: Soundtrack / Side Info */}
        {/* <aside className="lg:col-span-1">
          <div className="sticky top-24 p-8 rounded-3xl bg-[#0F111A] border border-[#03a1b0]/30 shadow-2xl shadow-[#03a1b0]/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[#03a1b0]/20 rounded-full text-[#03a1b0]">
                <Headphones size={24} />
              </div>
              <h3 className="text-2xl font-black text-white">
                Original Soundtrack
              </h3>
            </div>

            <div className="space-y-1 mb-6">
              {data.tracks.map((track, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center py-3 border-b border-white/5 hover:bg-white/5 px-2 rounded-lg transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-gray-600 font-mono text-sm group-hover:text-[#03a1b0]">
                      0{idx + 1}
                    </span>
                    <span className="text-gray-300 font-medium group-hover:text-white">
                      {track.title}
                    </span>
                  </div>
                  <span className="text-gray-500 text-xs">
                    {track.duration}
                  </span>
                </div>
              ))}
            </div>

            <Button className="w-full bg-white/5 hover:bg-[#1DB954] hover:text-white hover:border-transparent text-gray-300 border border-white/10 font-bold py-6 rounded-xl flex items-center justify-center gap-2 transition-all">
              Stream on Spotify <ExternalLink size={18} />
            </Button>
          </div>
        </aside> */}
      </main>
    </div>
  );
}

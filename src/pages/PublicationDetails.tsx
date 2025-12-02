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
const PUBLICATION_DATA = {
  uuid: "prod-001",
  title: "B.tech Subbayya",
  year: "2025",
  type: "Short Film",
  status: "Released",
  director: "Rajesh Kumar",
  lolo_role: "Original Score & Sound Design",
  description: `
    <p><strong>B.tech Subbayya</strong> is a comedic yet touching narrative exploring the pressures of engineering life and youthful ambition in a small town college setting.</p>
    <p>LOLO Studios was approached to handle the complete sonic landscape of the film. From the bustling canteen ambient noises to the emotional climax in the exam hall, the sound design was crafted to immerse the audience in the protagonist's world.</p>
    <p>The project features an original soundtrack with 3 songs and a background score that blends traditional instruments with modern synth-wave elements to represent the clash between tradition and technology.</p>
  `,
  thumbnail_url:
    "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  trailer_url: "https://youtube.com",
  full_video_url: "#",
  credits: [
    {
      name: "Karthik R.",
      role: "Music Director",
      image: "https://i.pravatar.cc/150?u=1",
    },
    {
      name: "Sneha P.",
      role: "Lead Vocalist",
      image: "https://i.pravatar.cc/150?u=2",
    },
    {
      name: "Arun Kumar",
      role: "Sound Engineer",
      image: "https://i.pravatar.cc/150?u=3",
    },
    { name: "LOLO Ensemble", role: "Backing Vocals", image: null },
  ],
  tracks: [
    { title: "The Engineering Anthem", duration: "3:45" },
    { title: "Subbayya's Theme (Sad)", duration: "2:10" },
    { title: "Victory Lap", duration: "4:00" },
  ],
};

export default function PublicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = PUBLICATION_DATA;

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
                <Button className="w-full sm:w-auto bg-white text-black font-bold px-8 py-6 rounded-full hover:bg-gray-200 flex items-center justify-center gap-3 text-lg transition-transform active:scale-95">
                  <Play fill="black" size={20} className="shrink-0" />
                  <span>Watch Film</span>
                </Button>
                <Button className="w-full sm:w-auto bg-white/10 text-white font-bold px-8 py-6 rounded-full hover:bg-white/20 flex items-center justify-center gap-3 text-lg border border-white/10 transition-transform active:scale-95">
                  <Video size={20} className="shrink-0" />
                  <span>Trailer</span>
                </Button>
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
        <aside className="lg:col-span-1">
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
        </aside>
      </main>
    </div>
  );
}

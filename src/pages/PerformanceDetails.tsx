import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  Share2,
  ArrowLeft,
  PlayCircle,
  Video,
  ListMusic,
  Mic2,
  Music,
  CheckCircle2,
  Info,
  Globe,
  Disc,
} from "lucide-react";
import { Button } from "@heroui/button";
import { Divider, Avatar } from "@heroui/react";

// --- Interfaces ---
interface Song {
  id: number;
  title: string;
  duration: string;
  artist?: string;
  is_original?: boolean;
}

interface Performer {
  name: string;
  role: string;
  avatar_url?: string;
}

interface ConcertDetailData {
  uuid: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  duration: string;
  genre: "Rock" | "Jazz" | "Classical" | "Fusion" | "Pop" | "Synthwave";
  video_url?: string;
  poster_url: string;
  setlist: Song[];
  performers: Performer[];
  images: string[];
}

// --- Styles Helper ---
// Swapped to Cyan/Teal based themes or neutral alternatives
const getGenreColor = (genre: string) => {
  switch (genre) {
    case "Rock":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    case "Jazz":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "Fusion":
      return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "Synthwave":
      // Using Cyan for Synthwave to match new theme
      return "bg-[#03a1b0]/10 text-[#03a1b0] border-[#03a1b0]/20";
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  }
};

const ConcertDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [concert, setConcert] = useState<ConcertDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Mock Fetch
  useEffect(() => {
    const fetchConcert = async () => {
      try {
        setLoading(true);
        // --- SIMULATED DATA ---
        setTimeout(() => {
          setConcert({
            uuid: "1",
            title: "Neon Nights: Live at the Arena",
            description:
              "An electrifying night of synthwave and retro-pop hits. The band performed their entire sophomore album alongside crowd favorites. The visual production featured a custom light show synchronized with the beat, creating an unforgettable atmosphere.",
            date: "2025-11-15T20:00:00",
            venue: "University Main Auditorium",
            duration: "1h 45m",
            genre: "Synthwave",
            video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            poster_url:
              "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200",
            setlist: [
              {
                id: 1,
                title: "Intro / Awakening",
                duration: "3:45",
                is_original: true,
              },
              {
                id: 2,
                title: "Midnight City",
                duration: "4:12",
                artist: "M83",
              },
              {
                id: 3,
                title: "Cyber Heart",
                duration: "3:50",
                is_original: true,
              },
              {
                id: 4,
                title: "Analog Dreams",
                duration: "4:05",
                is_original: true,
              },
              { id: 5, title: "Guitar Solo", duration: "2:15" },
              { id: 6, title: "The Final Countdown", duration: "5:10" },
            ],
            performers: [
              {
                name: "Alex Rhythm",
                role: "Guitar",
                avatar_url: "https://i.pravatar.cc/150?u=1",
              },
              {
                name: "Sarah Keys",
                role: "Synths",
                avatar_url: "https://i.pravatar.cc/150?u=2",
              },
              {
                name: "Mike Beat",
                role: "Drums",
                avatar_url: "https://i.pravatar.cc/150?u=3",
              },
            ],
            images: [
              "https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=600",
              "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600",
              "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=600",
            ],
          });
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchConcert();
  }, [id, API_BASE_URL]);

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/concerts");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-[#03a1b0] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 animate-pulse">
          Loading Concert Details...
        </p>
      </div>
    );

  if (!concert)
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-2">Concert Not Found</h2>
        <Link to="/concerts" className="text-[#03a1b0] hover:underline">
          Return to Concerts
        </Link>
      </div>
    );

  const eventDate = new Date(concert.date);
  const dateStr = eventDate.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = eventDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#03a1b0] selection:text-white pb-20">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 h-16 flex items-center px-6">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <a
            href="/concerts"
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold group cursor-pointer"
          >
            <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
              <ArrowLeft size={16} />
            </div>
            <span className="inline">Back to Concerts</span>
          </a>

          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setShowToast(true);
              setTimeout(() => setShowToast(false), 2000);
            }}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all active:scale-95"
            title="Share"
          >
            <Share2 size={18} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden bg-[#0F111A]">
        <div className="absolute inset-0">
          <img
            src={concert.poster_url}
            alt={concert.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-wrap gap-3 mb-6">
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${getGenreColor(
                    concert.genre
                  )} backdrop-blur-md`}
                >
                  {concert.genre}
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-white/10 text-white border border-white/10 backdrop-blur-md">
                  Live Performance
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black leading-tight max-w-4xl mb-6 text-white drop-shadow-xl">
                {concert.title}
              </h1>

              <div className="flex flex-wrap gap-y-4 gap-x-8 text-gray-200 font-medium text-sm md:text-base">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-full">
                    <Calendar size={20} className="text-[#03a1b0]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold">
                      Date
                    </p>
                    <p>{dateStr}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-full">
                    <Clock size={20} className="text-[#03a1b0]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold">
                      Time
                    </p>
                    <p>{timeStr}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-full">
                    <MapPin size={20} className="text-[#03a1b0]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-bold">
                      Venue
                    </p>
                    <p>{concert.venue}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT COLUMN: Details & Description */}
        <div className="lg:col-span-2 space-y-12">
          {/* About Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
              <Info className="text-[#03a1b0]" size={24} /> About the Concert
            </h3>
            <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed text-lg">
              <p>{concert.description}</p>
            </div>
          </motion.section>

          <Divider className="bg-white/10" />

          {/* Video Player */}
          {concert.video_url && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                <Video className="text-[#03a1b0]" size={24} /> Official
                Recording
              </h3>
              <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
                <iframe
                  width="100%"
                  height="100%"
                  src={concert.video_url}
                  title="Concert Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0"
                />
              </div>
            </motion.section>
          )}

          {/* Concert Stats */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
              <Music className="text-[#03a1b0]" size={24} /> Performance Stats
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex items-start gap-4">
                <Globe className="text-gray-400 mt-1" size={20} />
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">
                    Genre
                  </p>
                  <p className="text-white font-medium capitalize">
                    {concert.genre}
                  </p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex items-start gap-4">
                <Clock className="text-gray-400 mt-1" size={20} />
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">
                    Duration
                  </p>
                  <p className="text-white font-medium">{concert.duration}</p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex items-start gap-4">
                <Disc className="text-yellow-500 mt-1" size={20} />
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">
                    Total Tracks
                  </p>
                  <p className="text-white font-medium">
                    {concert.setlist.length} Songs
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Performers (Grid style like Coordinators) */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
              <Mic2 className="text-[#03a1b0]" size={24} /> Performers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {concert.performers.map((perf, idx) => (
                <div
                  key={idx}
                  className="bg-white/5 border border-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors group flex items-center gap-4"
                >
                  <Avatar
                    src={perf.avatar_url}
                    className="w-12 h-12 border border-white/10"
                    isBordered
                  />
                  <div>
                    <h4 className="font-bold text-white text-lg">
                      {perf.name}
                    </h4>
                    <p className="text-xs text-[#03a1b0] uppercase font-bold tracking-wider">
                      {perf.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Gallery */}
          {concert.images.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-6 text-white">
                Gallery Highlights
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {concert.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="group relative rounded-xl overflow-hidden h-48 border border-white/10"
                  >
                    <img
                      src={img}
                      alt={`Gallery ${idx}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </div>

        {/* RIGHT COLUMN: Setlist Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-6 rounded-3xl bg-[#0F111A] border border-[#03a1b0]/30 shadow-2xl shadow-[#03a1b0]/10 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#03a1b0]/20 rounded-full blur-[60px]"></div>

                <h3 className="text-xl font-black mb-6 text-white relative z-10 flex items-center gap-2">
                  <ListMusic size={20} className="text-[#03a1b0]" /> Setlist
                </h3>

                <div className="space-y-1 relative z-10">
                  {concert.setlist.map((song, idx) => (
                    <div
                      key={song.id}
                      className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-default border border-transparent hover:border-white/5"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <span className="text-gray-600 font-mono text-xs w-4 shrink-0">
                          {(idx + 1).toString().padStart(2, "0")}
                        </span>
                        <div className="truncate">
                          <p className="font-bold text-sm text-gray-200 group-hover:text-white truncate">
                            {song.title}
                          </p>
                          {song.artist && (
                            <p className="text-[10px] text-gray-500 truncate">
                              by {song.artist}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {song.is_original && (
                          <span className="text-[8px] font-bold uppercase bg-[#03a1b0]/20 text-[#03a1b0] px-1.5 py-0.5 rounded">
                            Orig
                          </span>
                        )}
                        <span className="text-xs text-gray-500 font-mono">
                          {song.duration}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
                  <Button
                    size="lg"
                    className="w-full font-bold bg-[#03a1b0] hover:bg-[#028f9c] text-white shadow-lg h-12 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <PlayCircle size={18} /> Play All Tracks
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </aside>
      </main>

      <AnimatePresence>
        {showToast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-white text-black px-5 py-4 rounded-xl shadow-2xl font-bold flex items-center gap-3 border border-gray-200"
          >
            <CheckCircle2 size={20} className="text-green-600" />
            <span>Link copied to clipboard!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConcertDetails;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Share2,
  Clock,
  MapPin,
  Calendar,
  Info,
  Mic2,
  ListMusic,
  PlayCircle,
  Disc,
  CheckCircle2,
  ZoomIn,
} from "lucide-react";
import { Avatar } from "@heroui/react";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Zoom, Thumbnails } from "yet-another-react-lightbox/plugins";
import "yet-another-react-lightbox/plugins/thumbnails.css";

// --- Mock Interfaces (Reuse from List) ---
// (Ideally import these from a types file)
interface ConcertDetailsData {
  uuid: string;
  title: string;
  description: string;
  genre: "Rock" | "Jazz" | "Classical" | "Fusion" | "Pop";
  status: "upcoming" | "live" | "archived";
  date: string;
  venue: string;
  duration: string;
  images: string[]; // Simplification for gallery
  setlist: {
    id: string;
    title: string;
    artist?: string;
    duration: string;
    is_original?: boolean;
  }[];
  performers: { name: string; role: string; avatar_url?: string }[];
}

const ConcertDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [concert, setConcert] = useState<ConcertDetailsData | null>(null);
  const [loading, setLoading] = useState(true);

  // --- Mock Data Fetching ---
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setConcert({
        uuid: id || "1",
        title: "Neon Nights: Live at the Arena",
        description:
          "Experience the electrifying fusion of synth-wave and rock as LOLO takes the stage for a night of unforgettable melodies and high-octane performances.",
        genre: "Fusion",
        status: "archived",
        date: "2025-11-15T20:00:00",
        venue: "SRKR Open Air Theatre",
        duration: "2h 30m",
        images: [
          "https://via.placeholder.com/800x600",
          "https://via.placeholder.com/800x600",
          "https://via.placeholder.com/800x600",
        ],
        performers: [
          {
            name: "Chandra Shekar",
            role: "Vocals",
            avatar_url: "https://i.pravatar.cc/150?u=1",
          },
          {
            name: "Shanmukh",
            role: "Guitar",
            avatar_url: "https://i.pravatar.cc/150?u=2",
          },
          {
            name: "Lowell",
            role: "Keys",
            avatar_url: "https://i.pravatar.cc/150?u=3",
          },
        ],
        setlist: [
          {
            id: "1",
            title: "Intro: The Awakening",
            duration: "3:45",
            is_original: true,
          },
          {
            id: "2",
            title: "Blinding Lights",
            artist: "The Weeknd",
            duration: "3:20",
          },
          {
            id: "3",
            title: "Midnight City",
            duration: "4:00",
            is_original: true,
          },
        ],
      });
      setLoading(false);
    }, 1000);
  }, [id]);

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
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-lolo-pink border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!concert) return null;

  const dateObj = new Date(concert.date);
  const dateStr = dateObj.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  // const timeStr = dateObj.toLocaleTimeString("en-IN", {
  //   hour: "2-digit",
  //   minute: "2-digit",
  // });

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-lolo-pink/30 selection:text-white pb-20 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-lolo-pink/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#030303]/80 backdrop-blur-xl border-b border-white/5 h-16 flex items-center px-6">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <a
            href="#"
            onClick={handleBack}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm font-bold group"
          >
            <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
              <ArrowLeft size={16} />
            </div>
            <span>Back to Concerts</span>
          </a>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setShowToast(true);
              setTimeout(() => setShowToast(false), 2000);
            }}
            className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-full transition-all active:scale-95"
          >
            <Share2 size={18} />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden bg-[#030303]">
        <div className="absolute inset-0">
          <img
            src={concert.images[0]}
            alt={concert.title}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#030303]/90 via-[#030303]/40 to-transparent"></div>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-10">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-lolo-pink/10 text-lolo-pink border border-lolo-pink/20 backdrop-blur-md">
                  {concert.genre}
                </span>
                <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/5 text-white border border-white/10 backdrop-blur-md">
                  {concert.status}
                </span>
              </div>

              <h1 className="text-4xl md:text-7xl font-bold leading-tight max-w-4xl mb-8 text-white drop-shadow-xl">
                {concert.title}
              </h1>

              <div className="flex flex-wrap gap-y-6 gap-x-10 text-neutral-200 font-medium text-sm md:text-base">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/5 rounded-full border border-white/5">
                    <Calendar size={20} className="text-lolo-pink" />
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider mb-0.5">
                      Date
                    </p>
                    <p>{dateStr}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/5 rounded-full border border-white/5">
                    <MapPin size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider mb-0.5">
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
        <div className="lg:col-span-2 space-y-16">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
              <Info className="text-lolo-pink" size={24} /> About the Concert
            </h3>
            <p className="text-neutral-400 leading-relaxed text-lg">
              {concert.description}
            </p>
          </motion.section>

          <Divider className="bg-white/5" />

          {/* Details Grid */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-3xl p-6 flex items-start gap-5">
                <Clock className="text-blue-400 mt-1" size={22} />
                <div>
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                    Duration
                  </p>
                  <p className="text-white font-bold text-lg">
                    {concert.duration}
                  </p>
                </div>
              </div>
              <div className="bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-3xl p-6 flex items-start gap-5">
                <Disc className="text-yellow-400 mt-1" size={22} />
                <div>
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                    Total Tracks
                  </p>
                  <p className="text-white font-bold text-lg">
                    {concert.setlist.length} Songs
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Performers */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
              <Mic2 className="text-lolo-pink" size={24} /> Performers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {concert.performers.map((perf, idx) => (
                <div
                  key={idx}
                  className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:bg-white/[0.04] transition-colors flex items-center gap-4"
                >
                  <Avatar
                    src={perf.avatar_url}
                    className="w-12 h-12 border border-white/10"
                    isBordered
                  />
                  <div>
                    <h4 className="font-bold text-white text-base">
                      {perf.name}
                    </h4>
                    <p className="text-[10px] text-lolo-pink uppercase font-bold tracking-widest">
                      {perf.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Gallery */}
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
                  onClick={() => setLightboxIndex(idx)}
                  className="group relative rounded-2xl overflow-hidden h-48 border border-white/5 cursor-zoom-in"
                >
                  <img
                    src={img}
                    alt={`Gallery ${idx}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white/10 backdrop-blur-md p-3 rounded-full text-white">
                      <ZoomIn size={20} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-8 rounded-[2.5rem] bg-white/[0.02] backdrop-blur-xl border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-lolo-pink/10 rounded-full blur-[60px]"></div>

                <h3 className="text-xl font-bold mb-6 text-white relative z-10 flex items-center gap-2">
                  <ListMusic size={20} className="text-lolo-pink" /> Setlist
                </h3>

                <div className="space-y-1 relative z-10">
                  {concert.setlist.map((song, idx) => (
                    <div
                      key={song.id}
                      className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-default"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <span className="text-neutral-600 font-mono text-xs w-4 shrink-0">
                          {(idx + 1).toString().padStart(2, "0")}
                        </span>
                        <div className="truncate">
                          <p className="font-bold text-sm text-neutral-300 group-hover:text-white truncate">
                            {song.title}
                          </p>
                          {song.artist && (
                            <p className="text-[10px] text-neutral-500 truncate">
                              by {song.artist}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {song.is_original && (
                          <span className="text-[8px] font-bold uppercase bg-lolo-pink/20 text-lolo-pink px-1.5 py-0.5 rounded">
                            Orig
                          </span>
                        )}
                        <span className="text-xs text-neutral-500 font-mono">
                          {song.duration}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
                  <Button
                    size="lg"
                    className="w-full font-bold bg-white text-black hover:bg-lolo-pink hover:text-white shadow-[0_0_20px_rgba(255,255,255,0.1)] h-14 text-base rounded-full transition-all flex items-center justify-center gap-2 group"
                  >
                    <PlayCircle
                      size={18}
                      className="transition-transform group-hover:scale-110"
                    />{" "}
                    Play All Tracks
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </aside>
      </main>

      {/* Lightbox & Toast Components */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-white text-black px-6 py-4 rounded-full shadow-2xl font-bold flex items-center gap-3 border border-white/20"
          >
            <CheckCircle2 size={20} className="text-green-600" />{" "}
            <span>Link copied!</span>
          </motion.div>
        )}
      </AnimatePresence>
      <Lightbox
        index={lightboxIndex}
        slides={concert.images.map((src) => ({ src }))}
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        plugins={[Zoom, Thumbnails]}
        styles={{ container: { backgroundColor: "rgba(0, 0, 0, 0.95)" } }}
        zoom={{ maxZoomPixelRatio: 3 }}
      />
    </div>
  );
};

export default ConcertDetails;

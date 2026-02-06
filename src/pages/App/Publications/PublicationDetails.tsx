import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Share2,
  Play,
  User,
  Music,
  Video,
  Award,
  CheckCircle2,
} from "lucide-react";
import { Chip, Divider } from "@heroui/react";
import { Button } from "@heroui/button";

// --- Mock Data ---
const PUBLICATIONS_DATA = [
  {
    uuid: "prod-001",
    title: "Subbayya B.Tech",
    year: "2025",
    type: "Short Film",
    status: "Released",
    director: "Santhosh Manapuram",
    lolo_role: "Original Score & Sound Design",
    description: `
      <p><strong>B.Tech Subbayya</strong> explores the struggle of a B.Tech graduate for a job and the conflict between his past and present situations. A narrative that resonates with every engineering student.</p>
      <p>LOLO Studios handled the complete sonic landscape, from the ambient noises of college life to the emotional background score that underscores the protagonist's journey. The sound design was crucial in highlighting the gritty reality versus the protagonist's dreams.</p>
    `,
    thumbnail_url: "https://img.youtube.com/vi/FIVPKLOL-3A/maxresdefault.jpg",
    trailer_url: "https://www.youtube.com/watch?v=Gq0-IihFBJw",
    full_video_url: "https://www.youtube.com/watch?v=FIVPKLOL-3A",
    credits: [
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
  const [showToast, setShowToast] = useState(false);

  const data =
    PUBLICATIONS_DATA.find((p) => p.uuid === id) || PUBLICATIONS_DATA[0];

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/publications");
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-lolo-pink/30 selection:text-white pb-20 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-lolo-cyan/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-lolo-pink/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#030303]/80 backdrop-blur-xl border-b border-white/5 h-16 flex items-center px-6">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <a
            href="/publications"
            onClick={handleBack}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm font-bold group cursor-pointer"
          >
            <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
              <ArrowLeft size={16} />
            </div>
            <span className="inline">Back to Publications</span>
          </a>

          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setShowToast(true);
              setTimeout(() => setShowToast(false), 2000);
            }}
            className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-full transition-all active:scale-95"
            title="Share"
          >
            <Share2 size={18} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden bg-[#030303]">
        <div className="absolute inset-0">
          <img
            src={data.thumbnail_url}
            alt={data.title}
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
                <Chip className="bg-lolo-pink text-white font-bold border-none">
                  {data.type}
                </Chip>
                <Chip variant="bordered" className="border-white/30 text-white">
                  {data.year}
                </Chip>
              </div>

              <h1 className="text-4xl md:text-7xl font-bold leading-tight max-w-4xl mb-6 text-white drop-shadow-2xl">
                {data.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-neutral-200 font-medium text-lg mb-8">
                <div className="flex items-center gap-2">
                  <User size={20} className="text-lolo-pink" />
                  <span>Dir. {data.director}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Music size={20} className="text-purple-400" />
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
                  <Button className="w-full sm:w-auto bg-white text-black font-bold px-8 py-6 rounded-full hover:bg-lolo-pink hover:text-white flex items-center justify-center gap-3 text-lg transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                    <Play fill="currentColor" size={20} className="shrink-0" />
                    <span>Watch Film</span>
                  </Button>
                </Link>
                <Link
                  to={data.trailer_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full sm:w-auto bg-white/10 text-white font-bold px-8 py-6 rounded-full hover:bg-white/20 flex items-center justify-center gap-3 text-lg border border-white/10 transition-all backdrop-blur-md">
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
      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
        {/* Left: Description & Credits */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
              <Award className="text-lolo-pink" size={24} /> Production Notes
            </h3>
            <div
              className="prose prose-invert max-w-none text-neutral-400 leading-relaxed text-lg"
              dangerouslySetInnerHTML={{ __html: data.description }}
            />
          </section>

          <Divider className="bg-white/5" />

          <section>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
              <User className="text-lolo-pink" size={24} /> LOLO Team Credits
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {data.credits.map((credit, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-5 p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-lolo-pink/30 transition-colors backdrop-blur-sm"
                >
                  <div className="w-14 h-14 rounded-full bg-neutral-900 overflow-hidden flex-shrink-0 border border-white/10">
                    {credit.image ? (
                      <img
                        src={credit.image}
                        alt={credit.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-lolo-pink/20 text-lolo-pink font-bold text-xl">
                        {credit.name[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg leading-tight mb-1">
                      {credit.name}
                    </h4>
                    <p className="text-purple-400 text-xs font-bold uppercase tracking-widest">
                      {credit.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <AnimatePresence>
          {showToast && (
            <motion.div
              key="toast"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 right-6 z-50 bg-white text-black px-6 py-4 rounded-full shadow-2xl font-bold flex items-center gap-3 border border-white/20"
            >
              <CheckCircle2 size={20} className="text-green-600" />
              <span>Link copied to clipboard!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

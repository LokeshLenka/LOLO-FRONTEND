import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Zoom, Thumbnails } from "yet-another-react-lightbox/plugins";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { Camera, ZoomIn } from "lucide-react";

// --- Types ---
type Photo = {
  src: string;
  category: string;
  alt: string;
};

// --- Mock Data ---
const PHOTOS: Photo[] = [
  {
    src: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200",
    category: "Concerts",
    alt: "Live DJ Set",
  },
  {
    src: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800",
    category: "Studio",
    alt: "Recording Microphone",
  },
  {
    src: "https://images.unsplash.com/photo-1501612780327-45045538702b?q=80&w=1200",
    category: "Concerts",
    alt: "Crowd Hands",
  },
  {
    src: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200",
    category: "Studio",
    alt: "Synth Setup",
  },
  {
    src: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=800",
    category: "Concerts",
    alt: "Stage Lighting",
  },
  {
    src: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=800",
    category: "Events",
    alt: "Club Neon",
  },
  {
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200",
    category: "Team",
    alt: "Team Collaboration",
  },
  {
    src: "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=800",
    category: "Events",
    alt: "Audience Cheering",
  },
];

const CATEGORIES = ["All", "Concerts", "Studio", "Events", "Team"];

export default function Gallery() {
  const [index, setIndex] = useState(-1);
  const [filter, setFilter] = useState("All");

  const filteredPhotos =
    filter === "All"
      ? PHOTOS
      : PHOTOS.filter((photo) => photo.category === filter);

  // Helper to determine bento grid classes based on index
  // This creates a pattern: Big, Small, Small, Wide, Small...
  const getBentoClass = (idx: number) => {
    const pattern = idx % 6;
    if (pattern === 0) return "md:col-span-2 md:row-span-2"; // Big Square
    if (pattern === 3) return "md:col-span-2"; // Wide Rectangle
    return "md:col-span-1"; // Standard Square
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-lolo-pink selection:text-white pb-20 pt-24 relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-lolo-cyan/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-lolo-pink/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-lolo-cyan text-xs font-bold uppercase tracking-widest mb-4"
          >
            <Camera size={14} />
            <span>Visual Archive</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-6xl font-bold mb-4"
          >
            Moments in <br />
            <span className="text-lolo-pink font-club">Motion</span>
          </motion.h1>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 border ${
                filter === cat
                  ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  : "bg-white/5 text-neutral-400 border-white/10 hover:border-white/30 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Simple Bento Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-3 auto-rows-[250px] gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredPhotos.map((photo, i) => (
              <motion.div
                layout
                key={photo.src} // Using src as key for simplicity
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={() => setIndex(i)}
                className={`group relative rounded-3xl overflow-hidden border border-white/10 bg-neutral-900 cursor-zoom-in ${getBentoClass(
                  i
                )}`}
              >
                {/* Image */}
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-full text-white">
                    <ZoomIn size={24} />
                  </div>
                </div>

                {/* Text Label */}
                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white font-bold">{photo.alt}</p>
                  <span className="text-lolo-cyan text-xs uppercase font-bold tracking-wider">
                    {photo.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox Preview */}
        <Lightbox
          index={index}
          slides={filteredPhotos}
          open={index >= 0}
          close={() => setIndex(-1)}
          plugins={[Zoom, Thumbnails]}
          styles={{
            container: { backgroundColor: "rgba(0, 0, 0, 0.95)" },
            thumbnail: { border: "1px solid rgba(255,255,255,0.2)" },
          }}
          zoom={{ maxZoomPixelRatio: 3 }}
        />
      </div>
    </div>
  );
}

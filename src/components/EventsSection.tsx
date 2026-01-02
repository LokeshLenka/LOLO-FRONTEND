import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  ArrowUpRight,
  Play,
  Film,
  Music,
  Mic2,
  Headphones,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import SectionHeader from "./HomeSectionHeader";

// --- Types ---
type CategoryType = "Concert" | "Short Film" | "Jam Session" | "Release";

interface SpotlightItemProps {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  image: string;
  status: "upcoming" | "live" | "new" | "featured";
  category: CategoryType;
  link: string;
}

// --- Icons Helper ---
const getCategoryIcon = (category: CategoryType) => {
  switch (category) {
    case "Concert":
      return <Mic2 size={14} />;
    case "Short Film":
      return <Film size={14} />;
    case "Jam Session":
      return <Music size={14} />;
    case "Release":
      return <Headphones size={14} />;
    default:
      return <Calendar size={14} />;
  }
};

// --- Spotlight Card Component ---
const SpotlightCard: React.FC<{ item: SpotlightItemProps }> = ({ item }) => {
  const statusColors = {
    upcoming: "bg-lolo-cyan/20 text-lolo-cyan border-lolo-cyan/20",
    live: "bg-lolo-red/20 text-lolo-red border-lolo-red/20 animate-pulse",
    new: "bg-lolo-pink/20 text-lolo-pink border-lolo-pink/20",
    featured: "bg-purple-500/20 text-purple-400 border-purple-500/20",
  };

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="group relative flex-shrink-0 w-[85vw] sm:w-[300px] md:w-[380px] h-[450px] md:h-[480px] rounded-[2rem] overflow-hidden border border-white/10 bg-neutral-900/50 backdrop-blur-sm transition-all duration-500 hover:border-white/20 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]"
    >
      {/* Image Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-[0.5] group-hover:brightness-[0.4]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
      </div>

      {/* Play/Action Overlay Icon */}
      <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform duration-300">
          {item.category === "Concert" || item.category === "Jam Session" ? (
            <ArrowUpRight size={32} className="text-white" />
          ) : (
            <Play size={32} className="text-white ml-1 fill-white" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-between p-7">
        {/* Top Tags */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <span
              className={`self-start px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                statusColors[item.status]
              }`}
            >
              {item.status === "live" && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-lolo-red mr-1.5 animate-pulse" />
              )}
              {item.status}
            </span>
          </div>

          <div className="px-3 py-1 rounded-full border border-white/10 bg-black/40 backdrop-blur-md flex items-center gap-1.5 text-xs text-gray-300 font-medium">
            {getCategoryIcon(item.category)}
            {item.category}
          </div>
        </div>

        {/* Bottom Info */}
        <div>
          {/* Meta Info Line */}
          <div className="flex items-center gap-3 text-gray-400 text-xs mb-3 font-medium uppercase tracking-wide">
            <span>{item.subtitle}</span>
            <span className="w-1 h-1 rounded-full bg-gray-600"></span>
            <span>{item.meta}</span>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-white mb-4 leading-tight group-hover:text-lolo-pink transition-colors line-clamp-2">
            {item.title}
          </h3>

          {/* Hover Line */}
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="w-0 h-full bg-lolo-pink group-hover:w-full transition-all duration-500 ease-out"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Section Component ---
const EventsSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Mixed Data
  const spotlightItems: SpotlightItemProps[] = [
    {
      id: "1",
      title: "Weekend LoLo: Acoustic Night",
      subtitle: "This Saturday, 6 PM",
      meta: "Campus Cafe",
      image:
        "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      status: "upcoming",
      category: "Concert",
      link: "/events/weekend-lolo",
    },
    {
      id: "2",
      title: "B.Tech Subbayya Screening",
      subtitle: "Feb 14, 2025",
      meta: "Auditorium",
      image:
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      status: "new",
      category: "Short Film",
      link: "/publications/prod-001",
    },
    {
      id: "3",
      title: "Open Jam Session: Rock",
      subtitle: "Every Friday",
      meta: "Music Room",
      image:
        "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      status: "live",
      category: "Jam Session",
      link: "/events/jam",
    },
    {
      id: "4",
      title: "The Last Bencher OST Release",
      subtitle: "Coming Soon",
      meta: "Spotify",
      image:
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      status: "featured",
      category: "Release",
      link: "/publications/prod-002",
    },
    {
      id: "5",
      title: "Tech Meets Music Workshop",
      subtitle: "Mar 01, 2025",
      meta: "Seminar Hall",
      image:
        "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      status: "upcoming",
      category: "Jam Session",
      link: "/events/workshop",
    },
  ];

  // --- Scroll Handlers ---
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  // --- Sync Active Index with Scroll ---
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollPosition = scrollRef.current.scrollLeft;
    // Assuming card width + gap is approx 300 + 24 on mobile, or calculate dynamically
    // A simplified approach for mobile where card is 85vw
    const cardWidth =
      scrollRef.current.children[0]?.getBoundingClientRect().width || 300;
    const gap = 24;
    const newIndex = Math.round(scrollPosition / (cardWidth + gap));

    // Only update if changed to prevent unnecessary renders
    if (
      newIndex !== activeIndex &&
      newIndex >= 0 &&
      newIndex < spotlightItems.length
    ) {
      setActiveIndex(newIndex);
    }
  };

  // --- Auto Scroll Effect for Mobile ---
  useEffect(() => {
    // Only run on small screens
    if (window.innerWidth >= 768) return;

    const interval = setInterval(() => {
      if (!isPaused && scrollRef.current) {
        const nextIndex = (activeIndex + 1) % spotlightItems.length;

        // Calculate next scroll position
        const cardWidth =
          scrollRef.current.children[0]?.getBoundingClientRect().width || 0;
        const gap = 24;
        const nextScrollLeft = nextIndex * (cardWidth + gap);

        scrollRef.current.scrollTo({
          left: nextScrollLeft,
          behavior: "smooth",
        });

        // State update happens via onScroll handler,
        // but we force it here for immediate feedback loops
        if (nextIndex === 0) {
          // If looping back to start, snap/smooth logic is handled by scrollTo
        }
      }
    }, 3000); // 3 seconds delay

    return () => clearInterval(interval);
  }, [activeIndex, isPaused, spotlightItems.length]);

  return (
    <section className="py-24 md:py-32 bg-[#020202] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute right-0 top-1/4 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col md:flex-row items-end justify-between gap-6">
        <SectionHeader
          title={
            <>
              In The <span className="font-club text-lolo-pink">Spotlight</span>
            </>
          }
          subtitle="From weekend jams to original film scores. Discover the latest noise we're making on and off campus."
        />

        {/* Desktop Navigation Buttons */}
        <div className="hidden md:flex gap-3">
          <button
            onClick={scrollLeft}
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all active:scale-95"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            onClick={scrollRight}
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all active:scale-95"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onTouchStart={() => setIsPaused(true)} // Pause on interaction
        onTouchEnd={() => setTimeout(() => setIsPaused(false), 2000)} // Resume after delay
        className="flex gap-6 overflow-x-auto pb-12 px-6 md:px-[calc((100vw-80rem)/2+1.5rem)] snap-x snap-mandatory scroll-smooth no-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {spotlightItems.map((item, index) => (
          <div key={item.id} className="snap-center">
            <Link to={item.link}>
              <SpotlightCard item={item} />
            </Link>
          </div>
        ))}
      </div>

      {/* Mobile Indicators (Dots) */}
      <div className="md:hidden flex justify-center items-center gap-2 mt-2 mb-8">
        {spotlightItems.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === activeIndex ? "w-8 bg-lolo-pink" : "w-1.5 bg-white/20"
            }`}
          />
        ))}
      </div>

      {/* Mobile "View All" CTA */}
      <div className="md:hidden flex justify-center">
        <Link to="/events">
          <button className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 hover:bg-white hover:text-black transition-all group text-sm font-bold">
            <span>Explore All Works</span>
            <ArrowUpRight size={16} />
          </button>
        </Link>
      </div>
    </section>
  );
};

export default EventsSection;

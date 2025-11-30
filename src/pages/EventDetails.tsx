import React from "react";
import { useParams, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  User,
  Share2,
  ArrowLeft,
  Ticket,
  CheckCircle2,
  Info,
} from "lucide-react";
import { Button } from "@heroui/button";
import { Chip, Avatar, AvatarGroup, Divider } from "@heroui/react";

// --- Mock Data for Details (In a real app, fetch based on ID) ---
const EVENT_DETAILS = {
  id: "1",
  title: "LoLo Band Live at SRKR Engineering College Annual Day",
  excerpt:
    "Join us for an electrifying evening of music featuring the college's top talent. Experience a fusion of rock, classical, and pop hits.",
  description: `
    <p>Get ready for the most anticipated musical event of the year! The LOLO Band is back with a bang, bringing you an unforgettable night of rhythm and soul. Featuring a lineup of the college's most talented musicians, this concert promises to be a sonic journey through various genres.</p>
    <p>From high-energy rock anthems to soothing classical melodies and chart-topping pop hits, there's something for everyone. Don't miss this chance to witness live performances, solo acts, and instrumental battles that will leave you mesmerized.</p>
    <h3>Event Highlights:</h3>
    <ul>
      <li>Live performance by the 12-piece LOLO Ensemble.</li>
      <li>Special guest appearance by alumni artists.</li>
      <li>Fusion set combining Carnatic vocals with Jazz instrumentation.</li>
      <li>Grand finale tribute to rock legends.</li>
    </ul>
  `,
  author: "LOLO Official",
  date: "March 15, 2025",
  time: "6:00 PM - 10:00 PM",
  location: "Open Air Theatre, SRKR Campus",
  price: "Free for Students",
  image:
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
  category: "Upcoming",
  tags: ["Music", "Concert", "Live Band", "Cultural"],
  organizers: [
    {
      name: "Alex Rhythm",
      role: "Lead Vocalist",
      img: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    },
    {
      name: "Sarah Key",
      role: "Event Manager",
      img: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    },
    {
      name: "Mike Drum",
      role: "Tech Lead",
      img: "https://i.pravatar.cc/150?u=a04258114e29026302d",
    },
  ],
};

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // In a real app: const event = useFetchEvent(id);
  const event = EVENT_DETAILS; // Using mock data directly
  const [showToast, setShowToast] = React.useState(false);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#03a1b0] selection:text-white pb-20">
      {/* 1. Back Button & Header Navigation */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 h-16 flex items-center px-6">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <Link
            to="/events"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold group"
          >
            <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
              <ArrowLeft size={16} />
            </div>
            Back to Events
          </Link>

          <button
            onClick={async () => {
              const shareData = {
                title: event.title,
                text: event.excerpt,
                url: window.location.href,
              };

              // Helper function to handle copying
              const copyToClipboard = () => {
                navigator.clipboard.writeText(window.location.href);
                setShowToast(true);
                setTimeout(() => setShowToast(false), 2000);
              };

              if (navigator.share) {
                try {
                  await navigator.share(shareData);
                } catch (err) {
                  // Fallback: If share fails or is cancelled, copy to clipboard
                  console.log(
                    "Share failed or cancelled, copying to clipboard..."
                  );
                  copyToClipboard();
                }
              } else {
                // Fallback: Native share not supported
                copyToClipboard();
              }
            }}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all active:scale-95"
            title="Share Event"
          >
            <Share2 size={18} />
          </button>
        </div>
      </nav>

      {/* 2. Hero Section (Parallax-like feel) */}
      <section className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex gap-3 mb-4">
                <Chip
                  size="sm"
                  classNames={{
                    base: "bg-[#03a1b0] text-white font-bold border-none",
                  }}
                >
                  {event.category}
                </Chip>
                <Chip
                  size="sm"
                  variant="bordered"
                  classNames={{
                    base: "border-white/30 text-white font-medium",
                  }}
                >
                  {event.tags[0]}
                </Chip>
              </div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight max-w-4xl mb-4 text-white drop-shadow-lg">
                {event.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-gray-200 text-sm md:text-base font-medium">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-[#03a1b0]" />
                  {event.date}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-[#03a1b0]" />
                  {event.location}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Content Grid */}
      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT COLUMN: Main Content */}
        <div className="lg:col-span-2 space-y-10">
          {/* About Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Info className="text-[#03a1b0]" size={24} /> About the Event
            </h3>
            <div
              className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-400 prose-li:text-gray-400 prose-strong:text-white"
              dangerouslySetInnerHTML={{ __html: event.description }}
            />
          </motion.section>

          <Divider className="bg-white/10" />

          {/* Organizers / Speakers */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-2xl font-bold mb-6">Organizers & Artists</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {event.organizers.map((person, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                >
                  <Avatar
                    src={person.img}
                    size="lg"
                    isBordered
                    color="secondary"
                  />
                  <div>
                    <h4 className="font-bold text-white">{person.name}</h4>
                    <p className="text-xs text-[#03a1b0] font-medium">
                      {person.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Gallery / Preview (Placeholder) */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold mb-6">Event Gallery</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-64">
              <div className="rounded-xl bg-white/5 h-full col-span-2 animate-pulse"></div>
              <div className="rounded-xl bg-white/5 h-full animate-pulse"></div>
            </div>
          </motion.section>
        </div>

        {/* RIGHT COLUMN: Sticky Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Registration Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="p-6 rounded-2xl bg-[#0F111A] border border-[#03a1b0]/20 shadow-2xl shadow-[#03a1b0]/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#03a1b0]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <h3 className="text-xl font-black mb-2">Registration Open</h3>
                <div className="flex items-end gap-2 mb-6">
                  <span className="text-3xl font-bold text-[#03a1b0]">
                    Free
                  </span>
                  <span className="text-gray-500 text-sm mb-1 line-through">
                    ₹200
                  </span>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3 text-sm text-gray-300">
                    <Clock
                      size={18}
                      className="text-[#03a1b0] shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="font-bold text-white">Date & Time</p>
                      <p>{event.date}</p>
                      <p className="text-xs text-gray-500">{event.time}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-gray-300">
                    <MapPin
                      size={18}
                      className="text-[#03a1b0] shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="font-bold text-white">Location</p>
                      <p>{event.location}</p>
                    </div>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full font-bold bg-[#03a1b0] text-white shadow-lg shadow-[#03a1b0]/25 hover:shadow-[#03a1b0]/40 transition-all"
                >
                  Register Now <Ticket size={18} />
                </Button>

                <p className="text-xs text-center text-gray-500 mt-4">
                  Limited seats available. Registration closes soon.
                </p>
              </div>
            </motion.div>

            {/* Attendees Preview */}
            {/* <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
              <h4 className="font-bold mb-4 text-sm uppercase text-gray-400 tracking-wider">
                Who's Going
              </h4>
              <div className="flex items-center justify-between">
                <AvatarGroup max={4} size="sm">
                  <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                  <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
                  <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                  <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
                  <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
                </AvatarGroup>
                <span className="text-xs font-bold text-[#03a1b0]">
                  +124 others
                </span>
              </div>
            </div> */}

            {/* Tags */}
            {/* <div className="flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-lg bg-white/5 text-xs font-medium text-gray-400 border border-white/5"
                >
                  #{tag}
                </span>
              ))}
            </div> */}
          </div>
        </aside>
      </main>
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-white text-black px-4 py-3 rounded-xl shadow-2xl font-bold flex items-center gap-2"
          >
            <CheckCircle2 size={18} className="text-green-600" />
            Link copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventDetails;

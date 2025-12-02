import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  Share2,
  ArrowLeft,
  Ticket,
  CheckCircle2,
  Info,
  User,
  Phone,
  Globe,
  Users,
  Trophy,
  CreditCard,
} from "lucide-react";
import { Button } from "@heroui/button";
import { Chip, Divider } from "@heroui/react";
import axios from "axios";

// --- Interfaces ---
interface EventImage {
  uuid: string;
  url: string;
  alt_txt: string;
  img_type: string;
}

interface Coordinator {
  name: string;
  phone: string;
  role: string;
}

interface EventDetailsData {
  uuid: string;
  name: string;
  description: string;
  type: "public" | "club" | "music";
  status: "upcoming" | "ongoing" | "completed";
  start_date: string;
  end_date: string;
  venue: string;
  fee: number;
  credits_awarded: number;
  registration_deadline: string;
  max_participants: number;
  registration_mode: string;
  registration_place: string;
  images: EventImage[];
  coordinators: (Coordinator | null)[];
}

// --- Styles Helper ---
const getEventTypeColor = (type: string) => {
  switch (type) {
    case "club":
      return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "music":
      return "bg-pink-500/10 text-pink-400 border-pink-500/20";
    case "public":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  }
};

const EventDetails: React.FC = () => {
  // FIX: All Hooks must be declared at the top level, BEFORE any return statements
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!id) return;
      try {
        const response = await axios.get(
          `http://localhost:8000/api/events/${id}`
        );
        setEvent(response.data.data || response.data);
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  // Safe Back Handler
  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/events");
    }
  };

  // --- Conditional Renders (Must be AFTER hooks) ---

  if (loading)
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-[#03a1b0] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 animate-pulse">Loading Event Details...</p>
      </div>
    );

  if (!event)
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
        <Link to="/events" className="text-[#03a1b0] hover:underline">
          Return to Events
        </Link>
      </div>
    );

  // Date Formatter
  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);
  const deadlineDate = new Date(event.registration_deadline);

  const dateStr = startDate.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const timeStr = `${startDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })} - ${endDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;

  const activeCoordinators = event.coordinators.filter(
    (c): c is Coordinator => c !== null
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#03a1b0] selection:text-white pb-20">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 h-16 flex items-center px-6">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <a
            href="/events"
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold group cursor-pointer"
          >
            <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
              <ArrowLeft size={16} />
            </div>
            <span className="inline">Back to Events</span>
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
            src={
              event.images[0]?.url || "https://via.placeholder.com/1920x1080"
            }
            alt={event.name}
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
                  className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${getEventTypeColor(
                    event.type
                  )} backdrop-blur-md`}
                >
                  {event.type} Only
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-white/10 text-white border border-white/10 backdrop-blur-md">
                  {event.status}
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-black leading-tight max-w-4xl mb-6 text-white drop-shadow-xl">
                {event.name}
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
                    <p>{event.venue}</p>
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
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
              <Info className="text-[#03a1b0]" size={24} /> About the Event
            </h3>
            <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed text-lg">
              <p>{event.description}</p>
            </div>
          </motion.section>

          <Divider className="bg-white/10" />

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
              <Ticket className="text-[#03a1b0]" size={24} /> Event Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex items-start gap-4">
                <Globe className="text-gray-400 mt-1" size={20} />
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">
                    Reg. Mode
                  </p>
                  <p className="text-white font-medium capitalize">
                    {event.registration_mode}
                  </p>
                  <p className="text-sm text-gray-400">
                    {event.registration_place}
                  </p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex items-start gap-4">
                <Users className="text-gray-400 mt-1" size={20} />
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">
                    Capacity
                  </p>
                  <p className="text-white font-medium">
                    {event.max_participants} Participants
                  </p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex items-start gap-4">
                <Trophy className="text-yellow-500 mt-1" size={20} />
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">
                    Credits Awarded
                  </p>
                  <p className="text-white font-medium">
                    {event.credits_awarded} Points
                  </p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex items-start gap-4">
                <CreditCard className="text-green-500 mt-1" size={20} />
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">
                    Entry Fee
                  </p>
                  <p className="text-white font-medium">
                    {event.fee > 0 ? `₹${event.fee}` : "Free Entry"}
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {activeCoordinators.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                <User className="text-[#03a1b0]" size={24} /> Coordinators
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {activeCoordinators.map((coord, idx) => (
                  <div
                    key={idx}
                    className="bg-white/5 border border-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-[#03a1b0]/20 rounded-full flex items-center justify-center text-[#03a1b0] mb-3 group-hover:scale-110 transition-transform">
                      <User size={20} />
                    </div>
                    <h4 className="font-bold text-white text-lg">
                      {coord.name}
                    </h4>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">
                      {coord.role.replace(/_/g, " ")}
                    </p>

                    <a
                      href={`tel:${coord.phone}`}
                      className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-[#03a1b0] transition-colors mt-2"
                    >
                      <Phone size={14} /> {coord.phone}
                    </a>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-6 text-white">Gallery</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {event.images.map((img) => (
                <div
                  key={img.uuid}
                  className="group relative rounded-xl overflow-hidden h-48 border border-white/10"
                >
                  <img
                    src={img.url}
                    alt={img.alt_txt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* RIGHT COLUMN: Registration Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-8 rounded-3xl bg-[#0F111A] border border-[#03a1b0]/30 shadow-2xl shadow-[#03a1b0]/10 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#03a1b0]/20 rounded-full blur-[60px]"></div>

                <h3 className="text-2xl font-black mb-2 text-white relative z-10">
                  Registration Open
                </h3>

                <div className="flex items-baseline gap-2 mb-8 relative z-10">
                  <span className="text-4xl font-bold text-[#03a1b0]">
                    {event.fee > 0 ? `₹${event.fee}` : "Free"}
                  </span>
                  {event.fee > 0 && (
                    <span className="text-gray-500 text-sm">per person</span>
                  )}
                </div>

                <div className="space-y-5 mb-8 relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 w-2 h-2 rounded-full bg-[#03a1b0]"></div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">
                        Deadline
                      </p>
                      <p className="text-white font-medium">
                        {deadlineDate.toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-sm text-red-400 font-medium">
                        {deadlineDate.toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1 w-2 h-2 rounded-full bg-[#03a1b0]"></div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">
                        Status
                      </p>
                      <p className="text-white font-medium capitalize">
                        {event.status}
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full font-bold bg-[#03a1b0] hover:bg-[#028a96] text-white shadow-lg shadow-[#03a1b0]/20 h-14 text-lg rounded-xl transition-all relative z-10"
                >
                  Register Now <Ticket size={20} className="ml-2" />
                </Button>

                <p className="text-xs text-center text-gray-500 mt-4 relative z-10">
                  Limited to {event.max_participants} seats. Secure your spot
                  now.
                </p>
              </div>
            </motion.div>
          </div>
        </aside>
      </main>

      <AnimatePresence>
        {showToast && (
          <motion.div
            key="toast" // FIX: Added unique key for AnimatePresence
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

export default EventDetails;

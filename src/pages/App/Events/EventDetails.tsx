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
  ZoomIn,
} from "lucide-react";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/react";
import axios from "axios";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Zoom, Thumbnails } from "yet-another-react-lightbox/plugins";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { toast } from "sonner";

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

// --- 🎨 CONSISTENT COLOR UTILITIES ---
const getEventTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case "music":
      return "bg-pink-500/10 text-pink-400 border-pink-500/20 shadow-[0_0_10px_rgba(236,72,153,0.1)]";
    case "club":
    case "management":
      return "bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.1)]";
    case "public":
      return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.1)]";
    default:
      return "bg-neutral-500/10 text-neutral-400 border-neutral-500/20";
  }
};

const getEventStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "ongoing":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse";
    case "upcoming":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "completed":
      return "bg-white/5 text-neutral-500 border-white/5";
    default:
      return "bg-white/5 text-neutral-400 border-white/10";
  }
};

const EventDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const APP_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!id) return;
      try {
        const response = await axios.get(`${APP_BASE_URL}/events/${id}`);
        setEvent(response.data.data || response.data);
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEventDetails();
  }, [id]);

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/events");
    }
  };

  function handleRegistration() {
    // Placeholder for registration logic
    if (!event) {
      toast.error(
        "Something Went Wrong!.Please refresh the page and try again later.",
      );
      return;
    }

    if (event.status !== "upcoming") {
      toast.error(
        "Registration is closed for this event. Please check other events.",
      );
      return;
    }

    if (event.registration_mode.toLowerCase() === "offline") {
      toast.warning(
        "This event requires offline registration. Please visit the registration desk.",
      );
    }

    if (
      event.registration_mode.toLowerCase() === "online" &&
      event.type.toLowerCase() === "public"
    ) {
      // Redirect to registration page or open registration modal
      navigate(`/event/${event.uuid}/public-user/register`);
    }
  }

  if (loading)
    return (
      <div className="min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-lolo-pink border-t-transparent rounded-full animate-spin"></div>
        <p className="text-neutral-400 animate-pulse font-medium">Loading...</p>
      </div>
    );

  if (!event)
    return (
      <div className="min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
        <Link to="/events" className="text-lolo-pink hover:underline">
          Return to Events
        </Link>
      </div>
    );

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
    (c): c is Coordinator => c !== null,
  );

  const lightboxSlides = event.images.map((img) => ({
    src: img.url,
    alt: img.alt_txt,
  }));

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-lolo-pink/30 selection:text-white pb-20 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-lolo-pink/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#030303]/80 backdrop-blur-xl border-b border-white/5 h-16 flex items-center px-6">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <a
            href=""
            onClick={handleBack}
            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm font-bold group cursor-pointer"
          >
            <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
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
            className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-full transition-all active:scale-95"
            title="Share"
          >
            <Share2 size={18} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden bg-[#030303]">
        <div className="absolute inset-0">
          <img
            src={
              event.images[0]?.url || "https://via.placeholder.com/1920x1080"
            }
            alt={event.name}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/60 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#030303]/90 via-transparent to-transparent"></div>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-10">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-wrap gap-3 mb-6">
                {/* 🎨 TYPE BADGE */}
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md ${getEventTypeColor(
                    event.type,
                  )}`}
                >
                  {event.type} Only
                </span>

                {/* 🚦 STATUS BADGE */}
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md ${getEventStatusColor(
                    event.status,
                  )}`}
                >
                  {event.status}
                </span>
              </div>

              <h1 className="text-4xl md:text-7xl font-bold leading-tight max-w-4xl mb-8 text-white drop-shadow-xl">
                {event.name}
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
                    <Clock size={20} className="text-lolo-pink" />
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider mb-0.5">
                      Time
                    </p>
                    <p>{timeStr}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-white/5 rounded-full border border-white/5">
                    <MapPin size={20} className="text-lolo-pink" />
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider mb-0.5">
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
      <main className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
        <div className="lg:col-span-2 space-y-16">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
              <Info className="text-lolo-pink" size={24} /> About the Event
            </h3>
            <div className="prose prose-invert max-w-none text-neutral-400 leading-relaxed text-lg">
              <p>{event.description}</p>
            </div>
          </motion.section>

          <Divider className="bg-white/5" />

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-8 flex items-center gap-2 text-white">
              <Ticket className="text-lolo-pink" size={24} /> Event Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: Globe,
                  label: "Reg. Mode",
                  val: event.registration_mode,
                  sub: event.registration_place,
                  color: "text-blue-400",
                },
                {
                  icon: Users,
                  label: "Capacity",
                  val: `${event.max_participants} Participants`,
                  color: "text-purple-400",
                },
                {
                  icon: Trophy,
                  label: "Credits",
                  val: `${event.credits_awarded} Points`,
                  color: "text-yellow-400",
                },
                {
                  icon: CreditCard,
                  label: "Entry Fee",
                  val: event.fee > 0 ? `₹${event.fee}` : "Free Entry",
                  color: "text-green-400",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-3xl p-6 flex items-start gap-5 hover:border-white/10 transition-colors"
                >
                  <item.icon className={`${item.color} mt-1`} size={22} />
                  <div>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                      {item.label}
                    </p>
                    <p className="text-white font-bold text-lg capitalize">
                      {item.val}
                    </p>
                    {item.sub && (
                      <p className="text-sm text-neutral-500 mt-0.5">
                        {item.sub}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {activeCoordinators.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                <User className="text-lolo-pink" size={24} /> Coordinators
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {activeCoordinators.map((coord, idx) => (
                  <div
                    key={idx}
                    className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:bg-white/[0.04] transition-colors group"
                  >
                    <div className="w-12 h-12 bg-pink-500/10 rounded-full flex items-center justify-center text-lolo-pink mb-4 group-hover:scale-110 transition-transform">
                      <User size={20} />
                    </div>
                    <h4 className="font-bold text-white text-lg">
                      {coord.name}
                    </h4>
                    <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest mb-3">
                      {coord.role.replace(/_/g, " ")}
                    </p>
                    <a
                      href={`tel:${coord.phone}`}
                      className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
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
              {event.images.map((img, index) => (
                <div
                  key={img.uuid}
                  onClick={() => setLightboxIndex(index)}
                  className="group relative rounded-2xl overflow-hidden h-48 border border-white/5 cursor-zoom-in"
                >
                  <img
                    src={img.url}
                    alt={img.alt_txt}
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
          <div className="sticky top-24 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="p-8 rounded-[2.5rem] bg-white/[0.02] backdrop-blur-xl border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-lolo-pink/10 rounded-full blur-[60px]"></div>

                <h3 className="text-2xl font-bold mb-2 text-white relative z-10">
                  Registration Open
                </h3>

                <div className="flex items-baseline gap-2 mb-8 relative z-10">
                  <span className="text-4xl font-bold text-white">
                    {event.fee > 0 ? `₹${event.fee}` : "Free"}
                  </span>
                  {event.fee > 0 && (
                    <span className="text-neutral-500 text-sm">per person</span>
                  )}
                </div>

                <div className="space-y-6 mb-8 relative z-10">
                  <div className="flex items-start gap-4">
                    <div className="mt-1.5 w-2 h-2 rounded-full bg-lolo-pink shadow-[0_0_10px_rgba(236,72,153,0.5)]"></div>
                    <div>
                      <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-0.5">
                        Deadline
                      </p>
                      <p className="text-white font-medium">
                        {deadlineDate.toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-sm text-red-400 font-medium mt-0.5">
                        {deadlineDate.toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    {/* 🚦 Status Dot: Dynamic color based on status */}
                    <div
                      className={`mt-1.5 w-2 h-2 rounded-full ${
                        event.status === "upcoming"
                          ? "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                          : event.status === "ongoing"
                            ? "bg-amber-400 animate-pulse"
                            : "bg-neutral-500"
                      }`}
                    ></div>
                    <div>
                      <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-0.5">
                        Status
                      </p>
                      {/* 🚦 Status Text: Uses consistent function */}
                      <span
                        className={`text-xs font-bold uppercase tracking-wide py-0.5 px-2 rounded-md ${getEventStatusColor(
                          event.status,
                        )}`}
                      >
                        {event.status}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full font-bold bg-white text-black hover:bg-lolo-pink hover:text-white shadow-[0_0_20px_rgba(255,255,255,0.1)] h-14 text-base rounded-full transition-all relative z-10 group"
                  onPress={handleRegistration}
                >
                  Register Now
                  <Ticket
                    size={18}
                    className="ml-2 transition-transform group-hover:rotate-12"
                  />
                </Button>
                <p className="text-[10px] text-center text-neutral-500 mt-4 uppercase tracking-widest relative z-10">
                  Limited to {event.max_participants} seats
                </p>
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
            className="fixed bottom-6 right-6 z-50 bg-white text-black px-6 py-4 rounded-full shadow-2xl font-bold flex items-center gap-3 border border-white/20"
          >
            <CheckCircle2 size={20} className="text-green-600" />
            <span>Link copied to clipboard!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <Lightbox
        index={lightboxIndex}
        slides={lightboxSlides}
        open={lightboxIndex >= 0}
        close={() => setLightboxIndex(-1)}
        plugins={[Zoom, Thumbnails]}
        styles={{
          container: { backgroundColor: "rgba(0, 0, 0, 0.95)" },
          thumbnail: { border: "1px solid rgba(255,255,255,0.2)" },
        }}
        zoom={{ maxZoomPixelRatio: 3 }}
      />
    </div>
  );
};

export default EventDetails;

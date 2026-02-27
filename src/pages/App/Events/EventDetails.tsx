import React, { useEffect, useState, useMemo, memo } from "react";
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
  User,
  Phone,
  Globe,
  Users,
  Trophy,
  CreditCard,
} from "lucide-react";
import { Button } from "@heroui/button";
import axios from "axios";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Zoom, Thumbnails } from "yet-another-react-lightbox/plugins";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { toast } from "sonner";
import SectionHeader from "@/components/HomeSectionHeader";

// --- Types ---
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

export type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

interface EventDetailsData {
  uuid: string;
  name: string;
  description: string;
  type: "public" | "club" | "music";
  status: EventStatus;
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
  current_participants?: number;
}

// --- Enterprise Registration Card ---
const useEventStatus = (status: EventStatus, deadline: Date) => {
  return useMemo(() => {
    const config = {
      upcoming: {
        color: "bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]",
        label: "Upcoming",
        ariaLabel: "Event status: Upcoming",
      },
      ongoing: {
        color:
          "bg-amber-400 animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.5)]",
        label: "Ongoing",
        ariaLabel: "Event status: Ongoing",
      },
      completed: {
        color: "bg-neutral-500",
        label: "Completed",
        ariaLabel: "Event status: Completed",
      },
      cancelled: {
        color: "bg-red-500",
        label: "Cancelled",
        ariaLabel: "Event status: Cancelled",
      },
    };

    const isExpired = deadline < new Date();

    return {
      ...config[status],
      isExpired,
      isRegistrationOpen:
        !isExpired && status !== "completed" && status !== "cancelled",
    };
  }, [status, deadline]);
};

const RegistrationCard = memo<{
  event: EventDetailsData;
  onRegister: () => void;
  isLoading?: boolean;
}>(({ event, onRegister, isLoading = false }) => {
  const deadline = useMemo(
    () => new Date(event.registration_deadline),
    [event.registration_deadline],
  );

  const statusConfig = useEventStatus(event.status, deadline);
  const currentParticipants = event.current_participants ?? 0;
  const seatsRemaining = Math.max(
    0,
    event.max_participants - currentParticipants,
  );
  // const capacityPercentage = Math.min(
  //   100,
  //   (currentParticipants / event.max_participants) * 100,
  // );

  return (
    // ✨ FIX: Sticky positioning needs a defined height container in grid
    <div className="sticky top-24 space-y-6">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <article className="p-8 rounded-3xl bg-white/[0.04] border border-white/5 shadow-2xl relative overflow-hidden backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-lolo-pink/5 via-transparent to-transparent pointer-events-none" />

          <h3 className="text-2xl font-bold mb-2 text-white relative z-10">
            {statusConfig.isRegistrationOpen
              ? "Registrations Open"
              : "Registration Closed"}
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
              <div
                className={`mt-1.5 w-2 h-2 rounded-full ${statusConfig.isExpired ? "bg-red-500" : "bg-lolo-pink"} shadow-[0_0_10px_rgba(236,72,153,0.5)]`}
              />
              <div>
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-0.5">
                  Deadline
                </p>
                <time dateTime={deadline.toISOString()} className="block">
                  <p className="text-white font-medium">
                    {deadline.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <p
                    className={`text-sm font-medium mt-0.5 ${statusConfig.isExpired ? "text-red-400" : "text-lolo-pink"}`}
                  >
                    {deadline.toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </time>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div
                className={`mt-1.5 w-2 h-2 rounded-full ${statusConfig.color}`}
              />
              <div>
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-0.5">
                  Status
                </p>
                <span
                  className={`inline-flex text-xs font-bold uppercase tracking-wide py-1 px-2.5 rounded-md ${
                    statusConfig.label === "Upcoming"
                      ? "bg-emerald-500/10 text-emerald-400"
                      : statusConfig.label === "Ongoing"
                        ? "bg-amber-500/10 text-amber-400"
                        : "bg-neutral-500/10 text-neutral-400"
                  }`}
                >
                  {statusConfig.label}
                </span>
              </div>
            </div>
          </div>

          {statusConfig.isRegistrationOpen && (
            <Button
              onClick={onRegister}
              disabled={isLoading || seatsRemaining === 0}
              size="lg"
              className="hidden lg:flex w-full py-7 px-6 bg-white hover:text-white text-black hover:bg-lolo-pink disabled:from-neutral-700 disabled:cursor-not-allowed font-bold rounded-full transition-all duration-300 relative z-10"
            >
              {isLoading
                ? "Processing..."
                : seatsRemaining === 0
                  ? "Registration Full"
                  : "Register Now"}
            </Button>
          )}

          <p className="text-sm text-center text-neutral-500 mt-4 uppercase tracking-widest relative z-10">
            Limited to {event.max_participants} seats
          </p>
        </article>
      </motion.div>
    </div>
  );
});

// --- Main Component ---
const EventDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const DESCRIPTION_PREVIEW_LENGTH = 300;
  const APP_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const getEventTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "music":
        return "bg-pink-500/10 text-pink-400 border-pink-500/20";
      case "club":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      default:
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
    }
  };

  const getEventStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "ongoing":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse";
      case "upcoming":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      default:
        return "bg-white/5 text-neutral-400 border-white/10";
    }
  };

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!id) return;
      try {
        const response = await axios.get(`${APP_BASE_URL}/events/${id}`);
        setEvent(response.data.data);
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
    if (window.history.length > 1) navigate(-1);
    else navigate("/events");
  };

  const handleRegistration = async () => {
    if (!event) return;
    setIsRegistering(true);
    await new Promise((r) => setTimeout(r, 600));

    if (event.status !== "upcoming") {
      toast.error("Registration is closed for this event.");
      setIsRegistering(false);
      return;
    }

    if (event.registration_mode.toLowerCase() === "offline") {
      toast.warning("This event requires offline registration.");
      setIsRegistering(false);
      return;
    }
    
    const deadline = new Date(event.registration_deadline);
    if (deadline < new Date()) {
      toast.error("The registration deadline for this event has passed.");
      setIsRegistering(false);
      return;
    }

    if (
      event.registration_mode.toLowerCase() === "online" &&
      event.type.toLowerCase() === "public"
    ) {
      navigate(`/events/${event.uuid}/public-user/register`);
    }
    setIsRegistering(false);
  };

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

  const isSameDay = startDate.toDateString() === endDate.toDateString();

  const dateStr = startDate.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = isSameDay
    ? `${startDate.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      })}, ${startDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })} - ${endDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    : `${startDate.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      })}, ${startDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })} - ${endDate.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      })}, ${endDate.toLocaleTimeString([], {
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
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-lolo-pink/30 selection:text-white pb-32 lg:pb-12 relative">
      <div className="absolute bottom-0 right-0 w-[800px] h-[500px] bg-lolo-cyan/5 rounded-full blur-[399px] pointer-events-none" />
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
          >
            <Share2 size={18} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={"/images/events/paatashaala.jpeg"}
            alt={event.name}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/60 to-transparent" />
        </div>
        <div className="relative w-full p-6 md:p-12 z-10 h-full flex flex-col justify-end">
          <div className="max-w-7xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-wrap gap-3 mb-6">
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md ${getEventTypeColor(event.type)}`}
                >
                  {event.type}
                </span>
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-md ${getEventStatusColor(event.status)}`}
                >
                  {event.status}
                </span>
              </div>
              <h1 className="text-4xl md:text-7xl font-bold leading-tight max-w-4xl mb-8 text-white drop-shadow-xl">
                {event.name}
              </h1>

              {/* ✨ FIX: Restored Venue and Duration Details */}
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
                      Duration
                    </p>
                    <p className="whitespace-nowrap">{timeStr}</p>
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
              {/* End of Restored Section */}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10 -mt-8">
        <div className="lg:col-span-2 space-y-14 pt-8">
          {/* About Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-8">
              <SectionHeader
                title={
                  <>
                    <span className="font-club text-lolo-pink lg:text-4xl">
                      About The Event
                    </span>
                  </>
                }
              />
            </div>
            <div className="prose prose-invert max-w-none text-neutral-400 leading-relaxed text-lg">
              <p className="whitespace-pre-wrap">
                {event.description.length > DESCRIPTION_PREVIEW_LENGTH &&
                !isDescriptionExpanded
                  ? event.description.slice(0, DESCRIPTION_PREVIEW_LENGTH) +
                    "..."
                  : event.description}
              </p>
              {event.description.length > DESCRIPTION_PREVIEW_LENGTH && (
                <button
                  onClick={() =>
                    setIsDescriptionExpanded(!isDescriptionExpanded)
                  }
                  className="mt-4 text-lolo-pink hover:text-pink-300 font-semibold text-base transition-colors flex items-center gap-2 group"
                >
                  {isDescriptionExpanded ? "Read Less" : "Read More..."}
                </button>
              )}
            </div>
          </motion.section>

          {/* <Divider className="bg-white" /> */}

          {/* Details Grid */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-8">
              <SectionHeader
                title={
                  <>
                    <span className="font-club text-lolo-pink lg:text-4xl">
                      Event Details
                    </span>
                  </>
                }
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: Globe,
                  label: "Reg. Mode",
                  val: event.registration_mode,
                  sub: event.registration_place,
                  // Store the full border class you want to apply
                  borderColor: "border-l-blue-400",
                  iconColor: "text-blue-400",
                },
                {
                  icon: Users,
                  label: "Capacity",
                  val: `${event.max_participants} Participants`,
                  borderColor: "border-l-purple-400",
                  iconColor: "text-purple-400",
                },
                {
                  icon: Trophy,
                  label: "Credits",
                  val: `${event.credits_awarded} Points`,
                  borderColor: "border-l-yellow-400",
                  iconColor: "text-yellow-400",
                },
                {
                  icon: CreditCard,
                  label: "Entry Fee",
                  val: event.fee > 0 ? `₹${event.fee}` : "Free Entry",
                  borderColor: "border-l-green-400",
                  iconColor: "text-green-400",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  // Use the full class string directly
                  className={`border-l rounded-r-xl rounded-l-xl bg-white/[0.03] h-20 border-l-lolo-pink p-5 flex items-center gap-5 transition-all hover:bg-white/[0.05]`}
                >
                  <div
                    className={`p-3 rounded-full bg-white/5 ${item.iconColor}`}
                  >
                    <item.icon size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                      {item.label}
                    </p>
                    <p className="text-white font-bold text-lg capitalize leading-tight">
                      {item.val}
                    </p>
                    {item.sub && (
                      <p className="text-xs text-neutral-400 mt-1 font-medium">
                        {item.sub}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Coordinators */}
          {activeCoordinators.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {/* <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                <User className="text-lolo-pink" size={24} /> Coordinators
              </h3> */}

              <div className="flex items-center gap-3 mb-8">
                <SectionHeader
                  title={
                    <>
                      <span className="font-club text-lolo-pink lg:text-4xl">
                        Coordinators
                      </span>
                    </>
                  }
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {activeCoordinators.map((coord, idx) => (
                  <div
                    key={idx}
                    // className="bg-white/[0.05] border-2 border-white/5 rounded-3xl p-5 hover:bg-white/[0.04] transition-colors group"
                    className="border-l rounded-r-lg rounded-l-lg bg-white/1 border-l-lolo-pink p-4 transition-colors group flex flex-col items-center text-center gap-2"
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

          {/* Gallery */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <SectionHeader
              title={
                <>
                  <span className="font-club text-lolo-pink lg:text-4xl drop-shadow-[0_0_10px_rgba(236,72,153,0.4)] flex items-center gap-2 justify-center">
                    Gallery
                  </span>
                </>
              }
            />
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
                  {/* ... zoom icon overlay ... */}
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Desktop Sidebar with Sticky Card */}
        {/* ✨ FIX: Ensure full height and NO overflow hidden in parent chain */}
        <aside className="lg:col-span-1 h-full">
          <RegistrationCard
            event={event}
            onRegister={handleRegistration}
            isLoading={isRegistering}
          />
        </aside>
      </main>

      {/* Mobile Sticky Footer */}
      <AnimatePresence mode="wait">
        <motion.div
          key="mobile-footer"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="lg:hidden fixed bottom-0 left-0 right-0 px-4 py-4 bg-[#030303]/90 backdrop-blur-xl border-t border-white/10 z-50 flex items-center justify-between gap-4 safe-area-bottom"
        >
          <div className="flex flex-col">
            <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">
              Total Fee
            </span>
            <span className="text-xl font-bold text-white">
              {event.fee > 0 ? `₹${event.fee}` : "Free"}
            </span>
          </div>
          <Button
            size="lg"
            className="flex-1 font-bold bg-white text-black hover:bg-lolo-pink hover:text-white shadow-lg h-12 rounded-full"
            onPress={handleRegistration}
            disabled={isRegistering}
          >
            {isRegistering ? "Processing..." : "Register Now"}{" "}
            <Ticket size={18} className="ml-2" />
          </Button>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showToast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 z-[60] bg-white text-black px-6 py-4 rounded-full shadow-2xl font-bold flex items-center gap-3 border border-white/20"
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

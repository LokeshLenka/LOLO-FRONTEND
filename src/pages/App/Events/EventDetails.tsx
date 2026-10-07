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
  AlertTriangle,
} from "lucide-react";
import { Button } from "@heroui/button";
import axios from "axios";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Zoom, Thumbnails } from "yet-another-react-lightbox/plugins";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { toast } from "sonner";
import SectionHeader from "@/components/HomeSectionHeader";
import { eventImageSrc, handleEventImageError } from "@/lib/event-images";

// Temporarily hold registrations: set to false to re-enable all buttons.
const REGISTRATIONS_HELD: boolean = true;

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
  max_participants: number | null;
  registration_mode: string;
  registration_place: string;
  images: EventImage[];
  coordinators: (Coordinator | null)[];
  current_participants?: number;
  seats_remaining?: number | null;
  is_full?: boolean;
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

// --- Capacity helpers ---
const CAPACITY_UNLIMITED = Number.POSITIVE_INFINITY;

const getSeatsRemaining = (
  event: Pick<
    EventDetailsData,
    "max_participants" | "current_participants" | "seats_remaining"
  >,
): number => {
  if (typeof event.seats_remaining === "number") return event.seats_remaining;

  if (
    typeof event.max_participants !== "number" ||
    !Number.isFinite(event.max_participants)
  ) {
    return CAPACITY_UNLIMITED;
  }

  const current = event.current_participants ?? 0;
  return Math.max(0, event.max_participants - current);
};

const FULL_NOTICE_TITLE = "Registrations Closed";
const FULL_NOTICE_MESSAGE =
  "Registrations are closed for this event because the maximum number of participants has been reached.";

// --- Shared card dressing: monochrome black surfaces with neutral depth ---
const CardTopLeak = memo(() => (
  <>
    <div className="pointer-events-none absolute inset-x-10 top-0 z-20 h-px bg-gradient-to-r from-transparent via-slate-300/25 to-transparent" />
    <div className="pointer-events-none absolute -top-24 left-1/2 z-0 h-44 w-3/4 -translate-x-1/2 rounded-full bg-white/[0.025] blur-3xl" />
  </>
));

const CardAurora = memo(() => {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-36 overflow-hidden rounded-b-[1.75rem] [mask-image:linear-gradient(to_bottom,transparent,black_55%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_55%)]">
      {/* dotted texture */}
      <div className="event-dot-grid absolute inset-0 opacity-30" />
      {/* Registration card keeps the expressive LoLo gradient as its focal accent. */}
      <div className="animate-aurora-a absolute -bottom-10 -left-8 h-36 w-56 rounded-full bg-violet-600/45 blur-[50px]" />
      <div className="animate-aurora-b absolute -bottom-12 left-1/3 h-40 w-64 rounded-full bg-fuchsia-500/40 blur-[60px]" />
      <div className="animate-aurora-c absolute -bottom-10 -right-8 h-36 w-56 rounded-full bg-cyan-400/30 blur-[50px]" />
      <div className="animate-aurora-wash absolute inset-0 bg-gradient-to-t from-violet-700/20 via-fuchsia-600/[0.07] to-transparent" />
      <div className="absolute inset-x-8 bottom-[2px] h-4 rounded-full bg-gradient-to-r from-violet-500/0 via-fuchsia-400/40 to-cyan-300/30 blur-lg" />
    </div>
  );
});

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
  const seatsRemaining = getSeatsRemaining(event);
  const isFull = seatsRemaining === 0;
  const isRegistrationOpen = statusConfig.isRegistrationOpen && !isFull;
  const hasCapacityLimit = Number.isFinite(seatsRemaining);
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
        <article className="group relative overflow-hidden rounded-[1.75rem] border border-white/12 bg-[#050505] p-8 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)] ring-1 ring-inset ring-white/[0.05] transition-colors duration-500 hover:border-white/25">
          <CardTopLeak />

          <h3 className="text-2xl font-bold mb-2 text-white relative z-10">
            {isRegistrationOpen
              ? "Registrations Open"
              : isFull
                ? FULL_NOTICE_TITLE
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

          {isRegistrationOpen && (
            <Button
              onClick={onRegister}
              disabled={isLoading || REGISTRATIONS_HELD}
              size="lg"
              className="hidden lg:flex w-full py-7 px-6 bg-white hover:text-white text-black hover:bg-lolo-pink disabled:from-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-700 disabled:text-neutral-400 font-bold rounded-full transition-all duration-300 relative z-10"
            >
              {isLoading ? "Processing..." : "Register Now"}
            </Button>
          )}

          {!isRegistrationOpen && (
            <div
              role="status"
              className={`flex items-start gap-3 rounded-2xl border p-4 relative z-10 ${
                isFull
                  ? "border-amber-400/40 bg-amber-500/10"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <AlertTriangle
                size={18}
                className={`mt-0.5 shrink-0 ${isFull ? "text-amber-400" : "text-neutral-400"}`}
              />
              <div>
                <p
                  className={`text-sm font-bold ${isFull ? "text-amber-300" : "text-white"}`}
                >
                  {isFull ? FULL_NOTICE_TITLE : "Registration Closed"}
                </p>
                <p className="text-xs mt-1 leading-relaxed text-neutral-300">
                  {isFull
                    ? FULL_NOTICE_MESSAGE
                    : "Registrations for this event are no longer accepting new entries."}
                </p>
              </div>
            </div>
          )}

          <p className="text-sm text-center text-neutral-300 mt-4 uppercase tracking-widest relative z-10">
            {hasCapacityLimit
              ? isFull
                ? `Fully booked · ${event.max_participants} seats`
                : `Limited to ${event.max_participants} seats`
              : "Limited seats available"}
          </p>
          <CardAurora />
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
  }, [id, APP_BASE_URL]);

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.history.length > 1) navigate(-1);
    else navigate("/events");
  };

  const handleRegistration = async () => {
    if (!event) return;

    if (REGISTRATIONS_HELD) {
      toast.error("Registrations are temporarily on hold. Please check back later.");
      return;
    }

    if (getSeatsRemaining(event) === 0) {
      toast.error(FULL_NOTICE_MESSAGE);
      return;
    }

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

  const deadline = new Date(event.registration_deadline);
  const isExpired = deadline < new Date();
  const isRegistrationOpen =
    !isExpired && event.status !== "completed" && event.status !== "cancelled";

  const seatsRemaining = getSeatsRemaining(event);
  const isFull = seatsRemaining === 0;

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
    src: eventImageSrc(img.url),
    alt: img.alt_txt,
  }));

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-lolo-pink/30 selection:text-white pb-32 lg:pb-12 relative">
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
            disabled={REGISTRATIONS_HELD}
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setShowToast(true);
              setTimeout(() => setShowToast(false), 2000);
            }}
            className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-full transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            <Share2 size={18} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[540px] md:min-h-[620px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={eventImageSrc(event.images[0]?.url)}
            onError={handleEventImageError}
            alt={event.name}
            className="w-full h-full object-cover opacity-55 scale-[1.02]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,3,3,.98)_0%,rgba(3,3,3,.68)_42%,rgba(3,3,3,.18)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/30" />
        </div>
        <div className="relative w-full px-6 py-16 md:px-12 md:py-20 z-10 min-h-[540px] md:min-h-[620px] flex items-end">
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
              <h1 className="text-4xl md:text-7xl lg:text-[5.5rem] font-bold leading-[0.98] tracking-[-0.045em] max-w-5xl mb-9 text-white drop-shadow-xl">
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
      <main className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10 -mt-2 lg:-mt-8">
        <div className="lg:col-span-2 space-y-20 pt-8">
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
                    <span className="font-original-surfer text-lolo-pink lg:text-4xl">
                      About The Event
                    </span>
                  </>
                }
              />
            </div>
            <div className="max-w-3xl text-neutral-300 leading-[1.8] text-lg">
              <p className="whitespace-pre-wrap">
                {event.description.length > DESCRIPTION_PREVIEW_LENGTH &&
                !isDescriptionExpanded &&
                !REGISTRATIONS_HELD
                  ? event.description.slice(0, DESCRIPTION_PREVIEW_LENGTH) +
                    "..."
                  : event.description}
              </p>
              {event.description.length > DESCRIPTION_PREVIEW_LENGTH && (
                <button
                  disabled={REGISTRATIONS_HELD}
                  onClick={() =>
                    setIsDescriptionExpanded(!isDescriptionExpanded)
                  }
                  className="mt-4 text-lolo-pink hover:text-pink-300 font-semibold text-base transition-colors flex items-center gap-2 group disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-lolo-pink"
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
                    <span className="font-original-surfer text-lolo-pink lg:text-4xl">
                      Event Details
                    </span>
                  </>
                }
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
              {[
                {
                  icon: Globe,
                  label: "Reg. Mode",
                  val: event.registration_mode,
                },
                {
                  icon: Users,
                  label: "Capacity",
                  val: `${event.max_participants} Participants`,
                },
                {
                  icon: Trophy,
                  label: "Credits",
                  val: `${event.credits_awarded} Points`,
                },
                {
                  icon: CreditCard,
                  label: "Entry Fee",
                  val: event.fee > 0 ? `₹${event.fee}` : "Free Entry",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-[1.25rem] border border-white/12 bg-[#050505] p-5 shadow-[0_16px_50px_-20px_rgba(0,0,0,0.9)] ring-1 ring-inset ring-white/[0.05] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)]"
                >
                  <div className="pointer-events-none absolute inset-x-8 top-0 z-20 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent blur-[0.5px]" />
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
                      <item.icon size={22} className="text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-1">
                        {item.label}
                      </p>
                      <p className="text-white font-extrabold text-xl capitalize leading-tight truncate">
                        {item.val}
                      </p>
                    </div>
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
                      <span className="font-original-surfer text-lolo-pink lg:text-4xl">
                        Coordinators
                      </span>
                    </>
                  }
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
                {activeCoordinators.map((coord, idx) => {
                  const initials = coord.name
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join("")
                    .toUpperCase();
                  return (
                    <div
                      key={idx}
                      className="group relative overflow-hidden rounded-[1.25rem] border border-white/12 bg-[#050505] p-5 shadow-[0_16px_50px_-20px_rgba(0,0,0,0.9)] ring-1 ring-inset ring-white/[0.05] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25 hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)]"
                    >
                      <div className="pointer-events-none absolute inset-x-8 top-0 z-20 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent blur-[0.5px]" />
                      <div className="relative z-10 flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-full bg-gradient-to-br from-white/25 to-white/5 flex items-center justify-center text-white font-extrabold text-sm shrink-0 shadow-lg group-hover:scale-105 transition-transform"
                          aria-hidden="true"
                        >
                          {initials || <User size={20} />}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-white text-base leading-snug truncate">
                            {coord.name}
                          </h4>
                          <p className="mt-0.5 text-xs text-neutral-400 font-medium capitalize truncate">
                            {coord.role.replace(/_/g, " ")}
                          </p>
                        </div>
                      </div>
                      <div className="relative z-10 mt-4 flex items-center justify-between gap-3">
                        <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                          Tap to call
                        </span>
                        <a
                          href={`tel:${coord.phone}`}
                          aria-label={`Call ${coord.name}`}
                          title={`Call ${coord.name}`}
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white transition-all hover:border-white/40 hover:bg-white/15 active:scale-95"
                        >
                          <Phone size={16} />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          )}

          {/* Gallery */}
          {event.images.length > 0 && (
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
                    className="group relative rounded-[1.25rem] overflow-hidden h-48 border border-white/12 cursor-zoom-in shadow-[0_16px_50px_-20px_rgba(0,0,0,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/25"
                  >
                    <img
                      src={eventImageSrc(img.url)}
                      onError={handleEventImageError}
                      alt={img.alt_txt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    />
                    {/* ... zoom icon overlay ... */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 rounded-b-[1.25rem] bg-gradient-to-t from-slate-950/55 via-slate-900/10 to-transparent opacity-70" />
                  </div>
                ))}
              </div>
            </motion.section>
          )}
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
        {isRegistrationOpen && (
          <motion.div
            key="mobile-footer"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="lg:hidden fixed bottom-0 left-0 right-0 px-4 py-4 bg-[#030303]/90 backdrop-blur-xl border-t border-white/10 z-50 flex items-center justify-between gap-4 safe-area-bottom"
          >
            {isFull ? (
              <div
                role="status"
                className="w-full flex items-start gap-3 rounded-2xl border border-amber-400/40 bg-amber-500/10 px-4 py-3"
              >
                <AlertTriangle
                  size={18}
                  className="text-amber-400 mt-0.5 shrink-0"
                />
                <div>
                  <p className="text-sm font-bold text-amber-300">
                    {FULL_NOTICE_TITLE}
                  </p>
                  <p className="text-xs text-neutral-300 mt-0.5 leading-relaxed">
                    {FULL_NOTICE_MESSAGE}
                  </p>
                </div>
              </div>
            ) : (
              <>
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
                  className="flex-1 font-bold bg-white text-black hover:bg-lolo-pink hover:text-white disabled:bg-neutral-700 disabled:text-neutral-400 disabled:cursor-not-allowed shadow-lg h-12 rounded-full transition-all"
                  onPress={handleRegistration}
                  disabled={isRegistering || REGISTRATIONS_HELD}
                >
                  {isRegistering ? "Processing..." : "Register Now"}
                  {!isRegistering && <Ticket size={18} className="ml-2" />}
                </Button>
              </>
            )}
          </motion.div>
        )}
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

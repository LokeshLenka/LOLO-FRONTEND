import "./App.css";
import {
  Route,
  Routes,
  useLocation, // Now safe to use directly in App
  Navigate,
  Outlet,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import SignUp from "./pages/SignUp";
import MainLayout from "./layouts/MainLayout";
import { AuthProvider, useAuth } from "./context/AuthContext";
import NotFound from "./pages/OtherPages/NotFound";
import Login from "./pages/Login";
import { ScrollToTop } from "./components/common/ScrollToTop";
// ... other imports ...
import UserDashboard from "./pages/Dashboards/UserDashboard";
import AppLayout from "./layouts/AppLayout";
import Home from "./pages/Home";
import EventRegistrationCards from "./components/ui/cards/EventRegistrationCard";
import CreditsCard from "./components/ui/cards/CreditsCard";
import UserProfilePage from "./pages/UserProfilePage";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Publication from "./pages/Publications";
import PublicationDetails from "./pages/PublicationDetails";
import Team from "./pages/Team";
import TeamDetails from "./pages/TeamDetails";
import AdminLogin from "./pages/Admin/AdminLogin";
import SuccessRegistration from "./pages/SuccessRegistration";
import { Toaster } from "sonner";
import GlobalLoader from "./components/GlobalLoader";
import RegistrationStatus from "./pages/RegistrationStatus";
import MusicProfile from "./pages/profile/MusicProfile";
import DetailedTimeline from "./components/DetailedTimeline";
import AboutUs from "./components/AboutUs";
import ContactUs from "./components/ContactUs";
import FAQ from "./pages/FAQ";
import Gallery from "./components/Gallery";
import {
  Calendar,
  Mail,
  MapPin,
  Mic2,
  Music,
  Phone,
  Star,
  Users,
} from "lucide-react";
import ConcertGallery from "./pages/Performances";
import ConcertDetails from "./pages/PerformanceDetails";

// --- Private Route Component ---
function PrivateRoute() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

// --- Main App Component ---
function App() {
  // 1. Safe to use here because <BrowserRouter> is in main.tsx
  const location = useLocation();

  const MOCK_PROFILE_DATA = {
    uuid: "550e8400-e29b-41d4-a716-446655440000",
    username: "alex.rhythm",
    email: "alex@lolo.band",
    full_name: "Alex Rhythm",
    role_label: "Music",
    sub_role_label: "Lead Guitarist",
    promoted_role_label: "Band Captain",
    is_active: true,
    last_login_at: "2023-10-27T10:30:00Z",

    personal_details: [
      {
        label: "Email Address",
        value: "alex@lolo.band",
        icon: Mail,
      },
      {
        label: "Phone Number",
        value: "+91 98765 43210",
        icon: Phone,
      },
      {
        label: "Location",
        value: "Bhimavaram, IN",
        icon: MapPin,
      },
      {
        label: "Joined On",
        value: "Dec 02, 2024",
        icon: Calendar,
      },
    ],

    role_specific_details: {
      title: "Musician Profile",
      icon: Music,
      fields: [
        {
          label: "Primary Instrument",
          value: "Electric Guitar (Fender Strat)",
          icon: Music,
          highlight: true,
        },
        {
          label: "Secondary Skill",
          value: "Backing Vocals",
          icon: Mic2,
        },
        {
          label: "Stage Experience",
          value: "3 Years",
          icon: Star,
        },
        {
          label: "Jam Group",
          value: "The Resonators",
          icon: Users,
        },
      ],
    },

    abilities: [
      "view_dashboard",
      "manage_events",
      "access_equipment_room",
      "publish_content",
    ],
  };

  return (
    <AuthProvider>
      <GlobalLoader />
      <ScrollToTop />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/performances" element={<ConcertGallery />} />

            <Route path="/publications" element={<Publication />} />
            <Route path="/team" element={<Team />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/gallery" element={<Gallery />} />

            <Route path="/timeline-detail" element={<DetailedTimeline />} />
          </Route>

          {/* Independent Pages */}
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/performances/:id" element={<ConcertDetails />} />
          <Route path="/publications/:id" element={<PublicationDetails />} />
          <Route path="/team/:id" element={<TeamDetails />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Dashboard Routes */}
          <Route element={<PrivateRoute />}>
            <Route path=":id/dashboard" element={<AppLayout />}>
              <Route index element={<UserDashboard />} />
              <Route
                path="event-registrations"
                element={<EventRegistrationCards />}
              />
              <Route path="credits" element={<CreditsCard />} />
              <Route
                path="profile"
                element={<UserProfilePage data={MOCK_PROFILE_DATA} />}
              />
            </Route>
          </Route>

          <Route path="/success" element={<SuccessRegistration />} />
          <Route path="/registration-status" element={<RegistrationStatus />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route path="/test/music" element={<MusicProfile />} />
          {/* <Route path="/admin/dashboard" element={<AdminLogin />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>

      <Toaster
        position="top-right"
        toastOptions={{
          className:
            "bg-[#09090b]/90 backdrop-blur-xl border border-white/10 text-white shadow-2xl shadow-black/50 rounded-2xl",
          classNames: {
            toast:
              "group toast group-[.toaster]:bg-[#09090b]/90 group-[.toaster]:backdrop-blur-xl group-[.toaster]:border-white/10 group-[.toaster]:text-white group-[.toaster]:shadow-2xl group-[.toaster]:rounded-2xl group-[.toaster]:font-sans",
            title:
              "group-[.toast]:!text-white font-semibold group-[.toast]:ml-3",
            description:
              "group-[.toast]:!text-white/70 group-[.toast]:font-medium group-[.toast]:ml-3",
            actionButton:
              "group-[.toast]:bg-[#03a1b0] group-[.toast]:text-white font-semibold",
            cancelButton:
              "group-[.toast]:bg-white/10 group-[.toast]:text-white font-semibold",
            error:
              "group-[.toaster]:!border-red-500/20 group-[.toaster]:!bg-red-900/20 group-[.toaster]:text-white",
            success:
              "group-[.toaster]:!border-green-500/20 group-[.toaster]:!bg-green-900/20 group-[.toaster]:text-white",
            warning:
              "group-[.toaster]:!border-orange-500/20 group-[.toaster]:!bg-orange-900/20 group-[.toaster]:text-white",
            info: "group-[.toaster]:!border-[#03a1b0]/20 group-[.toaster]:!bg-[#03a1b0]/20 group-[.toaster]:text-white",
          },
          style: {
            background: "rgba(9, 9, 11, 0.8)",
            color: "white",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            paddingLeft: "25px",
          },
        }}
        icons={{
          success: (
            <div className="p-1 bg-green-500/10 rounded-full border border-green-500/20 mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgb(34 197 94)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
          ),
          error: (
            <div className="p-1 bg-red-500/10 rounded-full border border-red-500/20 mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgb(239 68 68)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m15 9-6 6" />
                <path d="m9 9 6 6" />
              </svg>
            </div>
          ),
          loading: (
            <div className="p-1 bg-white/5 rounded-full border border-white/10 mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-spin text-[#03a1b0]"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            </div>
          ),
        }}
      />
    </AuthProvider>
  );
}

export default App;

import "./App.css";
import {
  Route,
  Routes,
  useLocation,
  Navigate,
  Outlet,
  useParams,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// --- Layouts & Providers ---
import MainLayout from "./layouts/MainLayout";
import AppLayout from "./layouts/AppLayout";
import { AuthProvider, useAuth } from "./context/AuthContext";
import GlobalLoader from "./components/GlobalLoader";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { Toaster } from "sonner";

// --- Public Pages ---
import Events from "./pages/App/Events/Events";
import EventDetails from "./pages/App/Events/EventDetails";
import Concerts from "./pages/App/Concerts/Performances";
import ConcertDetails from "./pages/App/Concerts/PerformanceDetails";
import Publication from "./pages/App/Publications/Publications";
import PublicationDetails from "./pages/App/Publications/PublicationDetails";
import Team from "./pages/App/Team/Team";
import TeamDetails from "./pages/App/Team/TeamDetails";
import AboutUs from "./pages/App/Support/AboutUs";
import ContactUs from "./pages/App/Support/ContactUs";
import FAQ from "./pages/App/Support/FAQ";
import Gallery from "./pages/App/Gallery/Gallery";
import TechTeam from "./pages/App/Developers/TechTeam";
import DeveloperHub from "./pages/App/Developers/DeveloperHub";
import NotFound from "./pages/OtherPages/NotFound";

// --- Auth & Registration Pages ---
import Login from "./pages/App/Authentication/Login";
import SignUp from "./pages/App/Authentication/SignUp";
import AdminLogin from "./pages/Admin/AdminLogin";
import SuccessRegistration from "./pages/App/Authentication/SuccessRegistration";
import RegistrationStatus from "./pages/App/Authentication/RegistrationStatus";

// --- Dashboard Components ---
import UserDashboard from "./pages/User/UserDashboard";
import EBMDashboard from "./pages/ExecutiveBodyMember/EBMDashboard";
import EventRegistrationCards from "./pages/User/Events/EventRegistrationsPage";
import UserProfilePage from "./pages/User/UserProfilePage";
import MusicProfile from "./pages/profile/MusicProfile";

// --- Icons & Mock Data ---
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
import EBMPendingApprovals from "./pages/ExecutiveBodyMember/EBMPendingApprovals";
import CreditsPage from "./pages/User/Credits/CreditsPage";
import Home from "./pages/App/Home/Home";
import ShowEventRegistrationPage from "./pages/User/Events/ShowEventRegistrationPage";
import ShowCreditPage from "./pages/User/Credits/ShowCreditsPage";

// --- Helper Components ---

// 1. Private Route Wrapper
function PrivateRoute() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <GlobalLoader />;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

// 2. Role-Based Dashboard Router
// Decides whether to show EBM Dashboard or fallback based on URL param
function RoleBasedDashboardRouter() {
  const { role } = useParams();

  // Normalize role string (e.g. handle casing if needed)
  const normalizedRole = role?.toLowerCase();

  // Check for Executive Body Member or related roles
  if (
    ["executive_body_member", "membership_head", "credit_manager"].includes(
      normalizedRole || "",
    )
  ) {
    return <EBMDashboard />;
  }

  // Default fallback if role is unrecognized (or can map to others like 'music')
  return <UserDashboard />;
}

// --- Main App Component ---
function App() {
  const location = useLocation();

  // Mock Profile Data (Keep existing)
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
      { label: "Email Address", value: "alex@lolo.band", icon: Mail },
      { label: "Phone Number", value: "+91 98765 43210", icon: Phone },
      { label: "Location", value: "Bhimavaram, IN", icon: MapPin },
      { label: "Joined On", value: "Dec 02, 2024", icon: Calendar },
    ],
    role_specific_details: {
      title: "Musician Profile",
      icon: Music,
      fields: [
        {
          label: "Primary Instrument",
          value: "Electric Guitar",
          icon: Music,
          highlight: true,
        },
        { label: "Secondary Skill", value: "Backing Vocals", icon: Mic2 },
        { label: "Stage Experience", value: "3 Years", icon: Star },
        { label: "Jam Group", value: "The Resonators", icon: Users },
      ],
    },
    abilities: ["view_dashboard", "manage_events"],
  };

  return (
    <AuthProvider>
      <GlobalLoader />
      <ScrollToTop />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />

            {/* Feature Pages */}
            <Route path="events" element={<Events />} />
            <Route path="concerts" element={<Concerts />} />
            <Route path="publications" element={<Publication />} />
            <Route path="team" element={<Team />} />
            <Route path="gallery" element={<Gallery />} />

            {/* Info Pages */}
            <Route path="about" element={<AboutUs />} />
            <Route path="contact" element={<ContactUs />} />
            <Route path="faq" element={<FAQ />} />

            {/* Technical Pages */}
            <Route path="tech-team" element={<TechTeam />} />
            <Route path="api-docs" element={<DeveloperHub />} />
            <Route path="timeline-detail" element={<Home />} />
          </Route>
          {/* ================= INDEPENDENT PUBLIC PAGES ================= */}
          {/* Details Pages (Full Screen or different layout) */}
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/concerts/:id" element={<ConcertDetails />} />
          <Route path="/publications/:id" element={<PublicationDetails />} />
          <Route path="/team/:id" element={<TeamDetails />} />
          {/* Auth & Status Pages */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/success" element={<SuccessRegistration />} />
          <Route path="/registration-status" element={<RegistrationStatus />} />
          {/* Test Route */}
          <Route path="/test/music" element={<MusicProfile />} />
          {/* ================= PROTECTED DASHBOARD ROUTES ================= */}
          // Replace your existing routes with these role-specific routes:
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              {/* Standard User Dashboard */}
              <Route path="/:username/dashboard" element={<UserDashboard />} />

              {/* Shared Pages */}
              <Route
                path="/:username/event-registrations"
                element={<EventRegistrationCards />}
              />
              <Route
                path="/:username/event-registrations/:uuid"
                element={<ShowEventRegistrationPage />}
              />
              <Route path="/:username/credits" element={<CreditsPage />} />
              
              <Route
                path="/:username/credits/:uuid"
                element={<ShowCreditPage   />}
              />

              <Route
                path="/:username/profile"
                element={<UserProfilePage data={MOCK_PROFILE_DATA} />}
              />

              {/* EBM Routes */}
              <Route
                path="/:username/executive_body_member/dashboard"
                element={<EBMDashboard />}
              />
              <Route
                path="/:username/executive_body_member/dashboard/pending-approvals"
                element={<EBMPendingApprovals />}
              />

              {/* Management Head (MH) Routes */}
              {/* <Route path="/:username/mh/dashboard" element={<MHDashboard />} /> */}
              {/* <Route path="/:username/mh/approvals" element={<MHApprovals />} /> */}

              {/* Credit Manager (CM) Routes */}
              {/* <Route path="/:username/cm/dashboard" element={<CMDashboard />} /> */}
              {/* <Route path="/:username/cm/credits" element={<CMCreditsPage />} /> */}
            </Route>
          </Route>
          {/* ================= 404 FALLBACK ================= */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          // ... (Keep existing styling configuration)
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

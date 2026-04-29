import "./App.css";
import { Route, Routes, useLocation, Navigate, Outlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// --- Layouts & Providers ---
import MainLayout from "./layouts/MainLayout";
import AppLayout from "./layouts/AppLayout";
import MHAppLayout from "./layouts/membership-head/MHAppLayout";
import { AuthProvider, useAuth } from "./context/AuthContext";
import GlobalLoader from "./components/GlobalLoader";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { Toaster } from "sonner";

// --- Public Pages ---
// import Home from "./pages/App/Home/Home";
import Homev1 from "./pages/App/Home/Homev1";
import Events from "./pages/App/Events/Events";
import EventDetails from "./pages/App/Events/EventDetails";
// import Concerts from "./pages/App/Concerts/Performances";
import ConcertDetails from "./pages/App/Concerts/PerformanceDetails";
import Publication from "./pages/App/Publications/Publications";
import PublicationDetails from "./pages/App/Publications/PublicationDetails";
import Team from "./pages/App/Team/Team";
import TeamDetails from "./pages/App/Team/TeamDetails";
import AboutUs from "./pages/App/Support/AboutUs";
import ContactUs from "./pages/App/Support/ContactUs";
import FAQ from "./pages/App/Support/FAQ";
import Gallery from "./pages/App/Gallery/Gallery";
import TermsOfServicePage from "./pages/OtherPages/TermsOfService";
import PrivacyPolicyPage from "./pages/OtherPages/PrivacyPolicy";
import RefundPolicyPage from "./pages/OtherPages/RefundPolicy";
import NotFound from "./pages/OtherPages/NotFound";

// --- Auth & Registration Pages ---
import Login from "./pages/App/Authentication/Login";
// import SignUp from "./pages/App/Authentication/SignUp";
import SignupsClosed from "./pages/App/Authentication/SignUpsClosed";
import AdminLogin from "./pages/Admin/AdminLogin";
import SuccessRegistration from "./pages/App/Authentication/SuccessRegistration";
import RegistrationStatus from "./pages/App/Authentication/RegistrationStatus";
import { UtrPublicUserSignUp } from "./pages/PublicUsers/UTRPublicUserSignUp";
import SuccessURTEventRegistration from "./pages/PublicUsers/SuccessURTEventRegistration";
import { FailedEventRegistration } from "./pages/App/Events/FailedEventRegistration";
import TicketVerifier from "./pages/User/TicketVerifier";

// --- Standard User Components ---
import UserDashboard from "./pages/User/UserDashboard";
import UserProfilePage from "./pages/User/UserProfilePage";
import CreditsPage from "./pages/User/Credits/CreditsPage";
import ShowCreditPage from "./pages/User/Credits/ShowCreditsPage";
import UserEventRegistrationCards from "./pages/User/Events/UserEventRegistrationsPage";
import ShowEventRegistrationPage from "./pages/User/Events/ShowEventRegistrationPage";

// --- Executive Body Member (EBM) Components ---
import EBMDashboard from "./pages/ExecutiveBodyMember/EBMDashboard";
import CreateEvent from "./pages/ExecutiveBodyMember/Events/CreateEvent";
import MyEvents from "./pages/ExecutiveBodyMember/Events/MyEvents";
import EventRegistrationsPage from "./pages/ExecutiveBodyMember/EventRegistrations/EventRegistrationsPage";
// import ShowUTREventRegistrations from "./pages/ExecutiveBodyMember/EventRegistrations/ShowUTREventRegistrations";
import EBMPendingApprovals from "./pages/ExecutiveBodyMember/EBMPendingApprovals";
import ApplicantDetailsPage from "./pages/ExecutiveBodyMember/Users/ApplicationDetails";
import ApprovalHistoryDetailsPage from "./pages/ExecutiveBodyMember/Users/ApprovalHistoryDetailsPage";
// import EbmDeskSale from "./pages/ExecutiveBodyMember/DeskRegistrations/EbmDeskSale";
// import EbmCollectionsList from "./pages/ExecutiveBodyMember/DeskRegistrations/EbmCollectionsList";
// import EbmTicketSuccess from "./pages/ExecutiveBodyMember/DeskRegistrations/EbmTicketSuccess";

// --- Membership Head (MH) Components ---
import MHDashboard from "./pages/MembershipHead/Dashboard/MHDashboard";
import MHUserManagement from "./pages/MembershipHead/Users/MHUserManagement";
import PendingApprovals from "./pages/MembershipHead/Approvals/PendingApprovals";
import MyApprovals from "./pages/MembershipHead/Approvals/MyApprovals";
import { UserStatsCards } from "./components/ui/shared/users/UserStatsCards";

// --- Credit Manager (CM) Components ---
// import CMDashboard from "./pages/CreditManager/CMDashboard";
// import CreditEventRegistrationsPage from "./pages/CreditManager/CreditEventRegistrationsPage";
// import CMDashboard from "./pages/CreditManager/CMDashboard";
// import EventRegistrationsListPage from "./pages/CreditManager/EventRegistrationsListPage";
// import RegistrationDetailPage from "./pages/CreditManager/RegistrationDetailPage";

// --- Helper Components ---

// 1. Private Route Wrapper
function PrivateRoute() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <GlobalLoader />;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

// --- Main App Component ---
function App() {
  const location = useLocation();

  // Wrapper to pass state as props
  const SuccessWrapper = () => {
    return <SuccessURTEventRegistration />;
  };

  return (
    <AuthProvider>
      <GlobalLoader />
      <ScrollToTop />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Homev1 />} />
            <Route path="home" element={<Homev1 />} />
            <Route path="homev1" element={<Homev1 />} />
            {/* Feature Pages */}
            <Route path="events" element={<Events />} />
            {/* <Route path="concerts" element={<Concerts />} /> */}
            <Route path="publications" element={<Publication />} />
            <Route path="team" element={<Team />} />
            <Route path="gallery" element={<Gallery />} />
            {/* Info Pages */}
            <Route path="about" element={<AboutUs />} />
            <Route path="contact" element={<ContactUs />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="terms-of-service" element={<TermsOfServicePage />} />
            <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="refund-policy" element={<RefundPolicyPage />} />

            {/* Technical Pages */}
            {/* <Route path="tech-team" element={<TechTeam />} />
            <Route path="api-docs" element={<DeveloperHub />} />
            <Route path="timeline-detail" element={<Home />} /> */}
          </Route>
          {/* ================= INDEPENDENT PUBLIC PAGES ================= */}
          {/* Details Pages (Full Screen or different layout) */}
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/concerts/:id" element={<ConcertDetails />} />
          <Route path="/publications/:id" element={<PublicationDetails />} />
          <Route path="/team/:id" element={<TeamDetails />} />
          {/* ----------------------------------------------------------------- */}
          {/* Auth & Status Pages */}
          {/* ----------------------------------------------------------------- */}
          <Route path="/signup" element={<SignupsClosed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/success" element={<SuccessRegistration />} />
          <Route path="/registration-status" element={<RegistrationStatus />} />
          {/* For Public users(not a part of club) */}
          {/* <Route path="/public-user/register" element={<PublicUserSignUp />} /> */}
          <Route
            path="/events/:eventuuid/public-user/register"
            element={<UtrPublicUserSignUp />}
          />
          <Route
            path="/success-event-registration"
            element={
              // Wrap with a small component to extract location state if needed
              <SuccessWrapper />
            }
          />
          <Route
            path="/failed-event-registration"
            element={<FailedEventRegistration />}
          />
          <Route path="/verify-ticket" element={<TicketVerifier />} />
          {/* Test Route */}
          {/* <Route path="/test/music" element={<MusicProfile />} /> */}

          {/* ================= PROTECTED DASHBOARD ROUTES ================= */}

          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              {/* Standard User Dashboard */}
              <Route path="/:username/dashboard" element={<UserDashboard />} />
              {/* Shared Pages */}
              <Route
                path="/:username/event-registrations"
                element={<UserEventRegistrationCards />}
              />
              <Route
                path="/:username/event-registrations/:uuid"
                element={<ShowEventRegistrationPage />}
              />
              <Route path="/:username/credits" element={<CreditsPage />} />
              <Route
                path="/:username/credits/:uuid"
                element={<ShowCreditPage />}
              />
              <Route path="/:username/profile" element={<UserProfilePage />} />

              {/* EBM Routes */}
              <Route
                path="/:username/executive_body_member/dashboard"
                element={<EBMDashboard />}
              />
              <Route
                path="/:username/executive_body_member/create-event"
                element={<CreateEvent />}
              />
              <Route
                path="/:username/executive_body_member/my-events"
                element={<MyEvents />}
              />
              <Route
                path="/:username/executive_body_member/event-registrations"
                element={<EventRegistrationsPage />}
              />
              {/* <Route
                path="/:username/executive_body_member/event-registrations/:uuid"
                element={<ShowUTREventRegistrations />}
              /> */}

              <Route
                path="/:username/executive_body_member/register-member"
                // element={}
              />
              <Route
                path="/:username/executive_body_member/my-registrations"
                // element={<MyRegistrations />}
              />
              <Route
                path="/:username/executive_body_member/pending-approvals/view-application/user/:uuid"
                element={<ApplicantDetailsPage />}
              />
              <Route
                path="/:username/executive_body_member/dashboard/pending-approvals"
                element={<EBMPendingApprovals />}
              />
              <Route
                path="/:username/executive_body_member/approvals-history/"
                element={<ApprovalHistoryDetailsPage />}
              />
              {/* <Route
                path="/:username/executive_body_member/desk-sale"
                element={<EbmDeskSale />}
              />
              <Route
                path="/:username/executive_body_member/collections"
                element={<EbmCollectionsList />}
              />
              <Route
                path="/:username/executive_body_member/ticket-success"
                element={<EbmTicketSuccess />}
              /> */}
            </Route>

            {/* Management Head (MH) Routes */}
            <Route element={<MHAppLayout />}>
              <Route
                path="/:username/membership_head/dashboard"
                element={<MHDashboard />}
              />
              <Route
                path="/:username/membership_head/pending-approvals"
                element={<PendingApprovals />}
              />
              <Route
                path="/:username/membership_head/approval-history"
                element={<MyApprovals />}
              />
              <Route
                path="/:username/membership_head/users"
                element={<MHUserManagement />}
              />
              <Route
                path="/:username/membership_head/user-stats"
                element={<UserStatsCards />}
              />
              {/* <Route path="/:username/mh/approvals" element={<MHApprovals />} /> */}
              {/* Credit Manager (CM) Routes */}
              {/* <Route path="/:username/cm/dashboard" element={<CMDashboard />} /> */}
              {/* <Route path="/:username/cm/credits" element={<CMCreditsPage />} /> */}
            </Route>
            {/* <Route element={<MHAppLayout />}>
              <Route
                path="/:username/credit_manager/dashboard"
                element={<CMDashboard />}
              />

              <Route
                path="/:username/credit_manager/event-registrations"
                element={<EventRegistrationsListPage />}
              />
              <Route
                path="/:username/credit_manager/registrations/:registrationUuid"
                element={<RegistrationDetailPage />}
              />

              <Route
                path="/:username/credit-manager/events/:eventUuid/registrations"
                element={<CreditEventRegistrationsPage />}
              />

            </Route> */}
          </Route>
          {/* ================= 404 FALLBACK ================= */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>

      {/* Toast Notifications */}
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

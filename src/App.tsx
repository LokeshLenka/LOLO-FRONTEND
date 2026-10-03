import "./App.css";
import { Suspense, lazy } from "react";
import { Route, Routes, useLocation, Navigate, Outlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

// --- Layouts & Providers (eager: app shell renders instantly) ---
import MainLayout from "./layouts/MainLayout";
import AppLayout from "./layouts/AppLayout";
import MHAppLayout from "./layouts/membership-head/MHAppLayout";
import { AuthProvider, useAuth } from "./context/AuthContext";
import GlobalLoader from "./components/GlobalLoader";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { Toaster } from "sonner";

// --- Public Pages (lazy: one chunk per route) ---
// import Home from "./pages/App/Home/Home";
const Homev1 = lazy(() => import("./pages/App/Home/Homev1"));
const Events = lazy(() => import("./pages/App/Events/Events"));
const EventDetails = lazy(() => import("./pages/App/Events/EventDetails"));
// import Concerts from "./pages/App/Concerts/Performances";
const ConcertDetails = lazy(
  () => import("./pages/App/Concerts/PerformanceDetails"),
);
const Publication = lazy(() => import("./pages/App/Publications/Publications"));
const PublicationDetails = lazy(
  () => import("./pages/App/Publications/PublicationDetails"),
);
// import Team from "./pages/App/Team/Team";
const TeamDetails = lazy(() => import("./pages/App/Team/TeamDetails"));
const AboutUs = lazy(() => import("./pages/App/Support/AboutUs"));
const ContactUs = lazy(() => import("./pages/App/Support/ContactUs"));
const FAQ = lazy(() => import("./pages/App/Support/FAQ"));
const Gallery = lazy(() => import("./pages/App/Gallery/Gallery"));
const TermsOfServicePage = lazy(
  () => import("./pages/OtherPages/TermsOfService"),
);
const PrivacyPolicyPage = lazy(
  () => import("./pages/OtherPages/PrivacyPolicy"),
);
const RefundPolicyPage = lazy(() => import("./pages/OtherPages/RefundPolicy"));
const NotFound = lazy(() => import("./pages/OtherPages/NotFound"));

// --- Auth & Registration Pages (lazy) ---
const Login = lazy(() => import("./pages/App/Authentication/Login"));
// const SignUp = lazy(() => import("./pages/App/Authentication/SignUp"));
import SignupsClosed from "./pages/App/Authentication/SignUpsClosed";
const AdminLogin = lazy(() => import("./pages/Admin/AdminLogin"));
const SuccessRegistration = lazy(
  () => import("./pages/App/Authentication/SuccessRegistration"),
);
const RegistrationStatus = lazy(
  () => import("./pages/App/Authentication/RegistrationStatus"),
);
const UtrPublicUserSignUp = lazy(() =>
  import("./pages/PublicUsers/UTRPublicUserSignUp").then((m) => ({
    default: m.UtrPublicUserSignUp,
  })),
);
const SuccessURTEventRegistration = lazy(
  () => import("./pages/PublicUsers/SuccessURTEventRegistration"),
);
const FailedEventRegistration = lazy(() =>
  import("./pages/App/Events/FailedEventRegistration").then((m) => ({
    default: m.FailedEventRegistration,
  })),
);
const TicketVerifier = lazy(() => import("./pages/User/TicketVerifier"));
const MemberTicketsPage = lazy(() => import("./pages/User/MemberTicketsPage"));

// --- Standard User Components (lazy) ---
const UserDashboard = lazy(() => import("./pages/User/UserDashboard"));
const UserProfilePage = lazy(() => import("./pages/User/UserProfilePage"));
const CreditsPage = lazy(() => import("./pages/User/Credits/CreditsPage"));
const ShowCreditPage = lazy(
  () => import("./pages/User/Credits/ShowCreditsPage"),
);
const UserEventRegistrationCards = lazy(
  () => import("./pages/User/Events/UserEventRegistrationsPage"),
);
const ShowEventRegistrationPage = lazy(
  () => import("./pages/User/Events/ShowEventRegistrationPage"),
);

// --- Executive Body Member (EBM) Components (lazy) ---
const EBMDashboard = lazy(
  () => import("./pages/ExecutiveBodyMember/EBMDashboard"),
);
const CreateEvent = lazy(
  () => import("./pages/ExecutiveBodyMember/Events/CreateEvent"),
);
const MyEvents = lazy(
  () => import("./pages/ExecutiveBodyMember/Events/MyEvents"),
);
const EventRegistrationsPage = lazy(
  () =>
    import("./pages/ExecutiveBodyMember/EventRegistrations/EventRegistrationsPage"),
);
// import ShowUTREventRegistrations from "./pages/ExecutiveBodyMember/EventRegistrations/ShowUTREventRegistrations";
const EBMPendingApprovals = lazy(
  () => import("./pages/ExecutiveBodyMember/EBMPendingApprovals"),
);
const ApplicantDetailsPage = lazy(
  () => import("./pages/ExecutiveBodyMember/Users/ApplicationDetails"),
);
const ApprovalHistoryDetailsPage = lazy(
  () => import("./pages/ExecutiveBodyMember/Users/ApprovalHistoryDetailsPage"),
);
// import EbmDeskSale from "./pages/ExecutiveBodyMember/DeskRegistrations/EbmDeskSale";
// import EbmCollectionsList from "./pages/ExecutiveBodyMember/DeskRegistrations/EbmCollectionsList";
// import EbmTicketSuccess from "./pages/ExecutiveBodyMember/DeskRegistrations/EbmTicketSuccess";

// --- Membership Head (MH) Components (lazy) ---
const MHDashboard = lazy(
  () => import("./pages/MembershipHead/Dashboard/MHDashboard"),
);
const MHUserManagement = lazy(
  () => import("./pages/MembershipHead/Users/MHUserManagement"),
);
const PendingApprovals = lazy(
  () => import("./pages/MembershipHead/Approvals/PendingApprovals"),
);
const MyApprovals = lazy(
  () => import("./pages/MembershipHead/Approvals/MyApprovals"),
);
const UserStatsCards = lazy(() =>
  import("./components/ui/shared/users/UserStatsCards").then((m) => ({
    default: m.UserStatsCards,
  })),
);

// --- Credit Manager (CM) Components (lazy) ---
const CMDashboard = lazy(() => import("./pages/CreditManager/CMDashboard"));
const CreditEventRegistrationsPage = lazy(
  () => import("./pages/CreditManager/CreditEventRegistrationsPage"),
);
const EventsListPage = lazy(
  () => import("./pages/CreditManager/EventsListPage"),
);
const RegistrationDetailPage = lazy(
  () => import("./pages/CreditManager/RegistrationDetailPage"),
);
// --- Admin (lazy) ---
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/Admin/AdminUsers"));
const AdminAnalytics = lazy(() => import("./pages/Admin/AdminAnalytics"));
const AdminEventsFull = lazy(() => import("./pages/Admin/AdminEventsFull"));
const AdminApprovals = lazy(() => import("./pages/Admin/AdminApprovals"));
const AdminTeam = lazy(() => import("./pages/Admin/AdminTeam"));
const AdminUserApprovalMgmt = lazy(
  () => import("./pages/Admin/AdminUserApprovalMgmt"),
);
const AdminRegistrationsFull = lazy(
  () => import("./pages/Admin/AdminRegistrationsFull"),
);
const AdminTicketsPage = lazy(() => import("./pages/Admin/AdminTicketsPage"));
const AdminUsersByRole = lazy(() => import("./pages/Admin/AdminUsersByRole"));
const AdminSettings = lazy(() => import("./pages/Admin/AdminSettings"));
const AdminLayout = lazy(() => import("./layouts/admin/AdminLayout"));

// --- Helper Components ---

// 1. Private Route Wrapper
function PrivateRoute() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <GlobalLoader />;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

// Chunk-load placeholder while a lazy route resolves
function RouteFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-zinc-400 dark:text-[#667085]" />
    </div>
  );
}

// --- Main App Component ---
function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <GlobalLoader />
      <ScrollToTop />

      <AnimatePresence mode="wait">
        <Suspense fallback={<RouteFallback />}>
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
              {/* <Route path="team" element={<Team />} /> */}
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
            <Route
              path="/registration-status"
              element={<RegistrationStatus />}
            />
            {/* For Public users(not a part of club) */}
            {/* <Route path="/public-user/register" element={<PublicUserSignUp />} /> */}
            <Route
              path="/events/:eventuuid/public-user/register"
              element={<UtrPublicUserSignUp />}
            />
            <Route
              path="/success-event-registration"
              element={<SuccessURTEventRegistration />}
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
                <Route
                  path="/:username/dashboard"
                  element={<UserDashboard />}
                />
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
                <Route
                  path="/:username/profile"
                  element={<UserProfilePage />}
                />
                <Route
                  path="/:username/tickets"
                  element={<MemberTicketsPage />}
                />
                <Route
                  path="/:username/verify-ticket"
                  element={<TicketVerifier />}
                />

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
                <Route
                  path="/:username/executive_body_member/verify-ticket"
                  element={<TicketVerifier />}
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

                {/* Credit Manager (CM) Routes */}
                <Route
                  path="/:username/credit_manager/dashboard"
                  element={<CMDashboard />}
                />
                <Route
                  path="/:username/credit_manager/events"
                  element={<EventsListPage />}
                />
                <Route
                  path="/:username/credit_manager/registrations/:registrationUuid"
                  element={<RegistrationDetailPage />}
                />
                <Route
                  path="/:username/credit_manager/events/:eventUuid/registrations"
                  element={<CreditEventRegistrationsPage />}
                />
                <Route
                  path="/:username/credit_manager/verify-ticket"
                  element={<TicketVerifier />}
                />
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
                <Route
                  path="/:username/membership_head/verify-ticket"
                  element={<TicketVerifier />}
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
                path="/:username/credit_manager/registrations/:registrationUuid"
                element={<RegistrationDetailPage />}
              />

              <Route
                path="/:username/credit-manager/events/:eventUuid/registrations"
                element={<CreditEventRegistrationsPage />}
              />

            </Route> */}
            </Route>
            {/* ================= ADMIN ROUTES — full api.php coverage ================= */}
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/admin/events" element={<AdminEventsFull />} />
              <Route path="/admin/approvals" element={<AdminApprovals />} />
              <Route path="/admin/team" element={<AdminTeam />} />
              <Route
                path="/admin/user-approvals"
                element={<AdminUserApprovalMgmt />}
              />
              <Route
                path="/admin/registrations"
                element={<AdminRegistrationsFull />}
              />
              <Route path="/admin/tickets" element={<AdminTicketsPage />} />
              <Route
                path="/admin/users-by-role"
                element={<AdminUsersByRole />}
              />
              <Route path="/admin/settings" element={<AdminSettings />} />
              {/* legacy aliases */}
              <Route path="/admin/team-profiles" element={<AdminTeam />} />
              <Route
                path="/admin/event-registrations"
                element={<AdminRegistrationsFull />}
              />
            </Route>

            {/* ================= 404 FALLBACK ================= */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
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

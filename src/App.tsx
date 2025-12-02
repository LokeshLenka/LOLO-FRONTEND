import { useState, useEffect } from "react";
import "./App.css";
import {
  Route,
  Routes,
  useLocation, // Import useLocation
  Navigate,
  Outlet,
} from "react-router-dom";
import { AnimatePresence } from "motion/react";
import SignUp from "./pages/SignUp";
import MainLayout from "./layouts/MainLayout";
import { AuthProvider, useAuth } from "./context/AuthContext";
import NotFound from "./pages/OtherPages/NotFound";
import Login from "./pages/Login";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { Settings } from "lucide-react";
import UserDashboard from "./pages/Dashboards/UserDashboard";
import AppLayout from "./layouts/AppLayout";
import Home from "./pages/Home";
import EventRegistrationsTable from "./components/ui/table/EventRegistrationsTable";
import CreditsTable from "./components/ui/table/CreditsTable";
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

function PrivateRoute() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null; // or a spinner
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function App() {
  // 1. Get the current location object
  const location = useLocation();

  return (
    <AuthProvider>
      <ScrollToTop />

      {/* 2. Pass location to AnimatePresence (optional but good for mode="wait") */}
      <AnimatePresence mode="wait">
        {/* 3. Key the Routes with location.pathname to force re-render on route change */}
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/publications" element={<Publication />} />
            <Route path="/team" element={<Team />} />
          </Route>

          {/* Independent Pages */}
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/publications/:id" element={<PublicationDetails />} />
          <Route path="/team/:id" element={<TeamDetails />} />

          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Dashboard Routes */}
          {/* <Route element={<PrivateRoute />}> */}
          <Route path="/dashboard" element={<AppLayout />}>
            <Route index element={<UserDashboard />} />
            <Route
              path="event-registrations"
              element={<EventRegistrationCards />}
            />
            <Route path="credits" element={<CreditsCard />} />
            <Route path="profile" element={<UserProfilePage />} />
          </Route>
          {/* </Route> */}

          <Route path="*" element={<NotFound />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
        </Routes>
      </AnimatePresence>
    </AuthProvider>
  );
}

export default App;

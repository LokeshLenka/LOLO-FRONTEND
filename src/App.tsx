import { useState, useEffect } from "react";
import "./App.css";
import {
  Route,
  Router,
  Routes,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AnimatePresence } from "motion/react";
import SignUp from "./pages/SignUp";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/Login";
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

function PrivateRoute() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null; // or a spinner
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function App() {
  return (
    // <AuthProvider>
    <AnimatePresence mode="wait">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        {/* <Route element={<PrivateRoute />}> */}
        <Route path="/dashboard" element={<AppLayout />}>
          <Route index element={<UserDashboard />} />
          <Route
            path="event-registrations"
            element={<EventRegistrationsTable />}
          />
          <Route path="credits" element={<CreditsTable />} />
          {/* </Route> */}
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
    // </AuthProvider>
  );
}

export default App;

import { useState, useEffect } from "react";
import "./App.css";
import { Route, Router, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import SignUp from "./pages/SignUp";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import NotFound from "./pages/OtherPages/NotFound";
import Login from "./pages/Login";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { Settings } from "lucide-react";
import UserDashboard from "./pages/Dashboards/UserDashboard";
import AppLayout from "./layouts/AppLayout";
import Home from "./pages/Home";

function App() {
  return (
    <AuthProvider>
      <AnimatePresence mode="wait">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
          </Route>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<AppLayout />}>
            {/* <Route index element={<Profile />} /> */}
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </AuthProvider>
  );
}

export default App;

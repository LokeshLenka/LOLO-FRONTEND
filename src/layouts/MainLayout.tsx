import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LogIn,
  User,
  Home,
  CalendarClock,
  Clapperboard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/button";
import { useAuth } from "@/context/AuthContext";
import Logo from "../components/Logo";
import Lolo_logo_1 from "../assets/logos/Lolo_logo_1.png";
import NavDropdown from "@/components/NavDropdown";
import Footer from "@/pages/Footer";

// Navigation Configuration
const NAV_ITEMS = [
  { label: "Home", path: "/", icon: Home },
  { label: "Events", path: "/events", icon: CalendarClock },
  { label: "Publications", path: "/publications", icon: Clapperboard },
];

const MainLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  // Optimized scroll handler
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white min-w-full selection:bg-lolo-pink selection:text-white">
      {/* Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full 
        ${
          scrolled
            ? "bg-black/80 backdrop-blur-md shadow-lg border-b border-white/5"
            : "bg-transparent"
        }`}
      >
        <div className="w-full mx-auto px-4 py-3 lg:px-10">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center justify-center space-x-2 z-50"
            >
              <img
                src={Lolo_logo_1}
                alt="LoLo Logo"
                className="h-14 w-14 hover:scale-105 transition-transform duration-300"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 lg:space-x-12">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors duration-300 hover:text-lolo-pink
                    ${
                      location.pathname === item.path
                        ? "text-lolo-pink"
                        : "text-white/90"
                    }`}
                >
                  {item.label}
                </Link>
              ))}

              <NavDropdown />

              {user ? (
                <Link to={`/${user}/dashboard`}>
                  <Button className="bg-transparent border border-lolo-cyan text-lolo-cyan px-6 hover:bg-lolo-cyan hover:text-black transition-all font-semibold rounded-full">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <div className="flex items-center space-x-6">
                  <Link
                    to="/login"
                    className="text-sm font-medium hover:text-lolo-pink transition-colors"
                  >
                    Login
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-lolo-pink text-white border border-lolo-pink px-5 py-2 rounded-full hover:bg-black hover:text-lolo-pink transition-all font-medium shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:shadow-[0_0_25px_rgba(236,72,153,0.5)]">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white z-50 p-2 active:scale-95 transition-transform"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              // FIXED: Added max-h and overflow-y-auto to allow scrolling on small screens
              className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10 overflow-y-auto max-h-[90dvh] min-h-[90vh]"
            >
              {/* FIXED: Added pb-24 (padding bottom) so buttons clear the phone screen bottom edge */}
              <div className="px-4 py-6 space-y-2 pb-20">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors
                      ${
                        location.pathname === item.path
                          ? "bg-lolo-pink/10 text-lolo-pink"
                          : "text-white hover:bg-white/5"
                      }`}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}

                {/* Mobile Dropdown */}
                <div className="px-4 py-2">
                  <NavDropdown isMobile={true} />
                </div>

                <div className="h-px bg-white/10 my-4 mx-4" />

                {/* Auth Buttons Section */}
                {user ? (
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-3 px-4 py-3 text-lolo-cyan hover:bg-lolo-cyan/10 rounded-xl transition-colors"
                  >
                    <User size={20} />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                ) : (
                  <div className="space-y-4 px-2 pt-4">
                    <Link
                      to="/login"
                      className="flex items-center justify-center space-x-2 w-full py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-white"
                    >
                      <LogIn size={18} />
                      <span className="font-medium">Login</span>
                    </Link>

                    <Link to="/signup" className="block w-full">
                      <Button className="w-full bg-lolo-pink py-6 rounded-xl font-bold text-white shadow-lg shadow-lolo-pink/20 active:scale-[0.98]">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;

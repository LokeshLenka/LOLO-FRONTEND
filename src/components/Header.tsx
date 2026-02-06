// src/components/Header.tsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  User,
  CalendarClock,
  Clapperboard,
  Home,
  LogIn,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NavDropdown from "@/components/NavDropdown";
import Lolo_logo_1 from "@/assets/logos/Lolo_logo_1.png";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  scrolled: boolean;
}

const NAV_ITEMS = [
  { label: "Home", path: "/", icon: Home },
  { label: "Events", path: "/events", icon: CalendarClock },
  { label: "Concerts", path: "/concerts", icon: Clapperboard },
  { label: "Publications", path: "/publications", icon: Clapperboard },
];

const Header: React.FC<HeaderProps> = ({ scrolled }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = (useAuth && useAuth()) || { user: null };
  const location = useLocation();

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -10, transition: { duration: 0.2 } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  /**
   * HEADER CLASS LOGIC:
   * 1. If Menu is OPEN -> Solid Background (matches app theme) to hide content behind.
   * 2. If SCROLLED -> Blurry semi-transparent black.
   * 3. Default (Top) -> Transparent.
   */
  const headerClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full border-b  ${
    isMenuOpen
      ? "bg-[#000000] border-white/10 py-3" // SOLID COLOR when menu is open
      : scrolled
        ? "bg-white/1 backdrop-blur-md border-white/10 shadow-md py-3"
        : "bg-transparent border-transparent py-4"
  }`;

  return (
    <header className={headerClasses}>
      <div className="w-full mx-auto px-4 lg:px-10 ">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 z-50 relative"
            onClick={() => setIsMenuOpen(false)}
          >
            <img
              src={Lolo_logo_1}
              alt="LoLo Logo"
              className="h-10 w-10 md:h-12 md:w-12 hover:scale-105 transition-transform duration-300 object-contain"
            />
            <span className="hidden md:inline text-lg font-bold tracking-tight text-white">
              SRKR LOLO
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-10">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-md font-medium transition-colors duration-300 hover:text-lolo-pink ${
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
              <Link to={`/${user.username}/dashboard`}>
                <button className="px-6 py-2.5 rounded-full border border-white/20 bg-white/5 text-white font-bold hover:border-lolo-pink hover:text-lolo-pink hover:bg-lolo-pink/10 transition-all shadow-[0_0_10px_rgba(0,0,0,0.2)]">
                  Dashboard
                </button>
              </Link>
            ) : (
              <div className="flex items-center space-x-6">
                <Link
                  to="/login"
                  className="text-neutral-300 hover:text-lolo-pink transition-colors"
                >
                  Login
                </Link>
                <Link to="/signup">
                  <button className="bg-white text-black px-6 py-2.5 rounded-full hover:bg-lolo-pink hover:text-white transition-all duration-300 ease-in-out shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(236,72,153,0.4)]">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile controls */}
          <div className="flex items-center gap-4 md:hidden">
            {user && (
              <Link to="/profile" className="text-white">
                <User size={20} />
              </Link>
            )}

            <button
              className="text-white z-50 p-1 active:scale-95 transition-transform"
              onClick={() => setIsMenuOpen((s) => !s)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileMenuVariants}
            className="absolute top-full left-0 w-full bg-[#000000] border-t border-white/10 overflow-y-auto max-h-[calc(100vh-80px)] shadow-2xl md:hidden flex flex-col z-50 min-h-screen"
          >
            <div className="px-4 py-6 space-y-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all active:scale-[0.98] ${
                    location.pathname === item.path
                      ? "bg-lolo-pink/10 text-lolo-pink font-bold"
                      : "text-neutral-300 hover:bg-white/5 hover:text-white font-medium"
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              ))}

              <div className="px-2 py-2">
                <NavDropdown isMobile />
              </div>

              <div className="h-px bg-white/10 my-6 mx-4" />

              <div className="px-2 space-y-4">
                {user ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center space-x-2 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98]"
                  >
                    <User size={18} className="text-lolo-pink" />
                    <span>Go to Dashboard</span>
                  </Link>
                ) : (
                  <div className="flex flex-col gap-4">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <button className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-4 rounded-full transition-all active:scale-[0.98]">
                        <LogIn size={18} className="text-neutral-400" />
                        <span>Login</span>
                      </button>
                    </Link>

                    <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                      <button className="w-full bg-white text-black hover:bg-lolo-pink hover:text-white font-bold py-4 rounded-full shadow-[0_4px_14px_0_rgba(255,255,255,0.1)] transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                        <span>Sign Up</span>
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom spacer for safe area scrolling */}
            <div className="pb-32" />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;

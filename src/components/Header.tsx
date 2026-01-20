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
  const headerClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full border-b ${
    isMenuOpen
      ? "bg-gray-900 border-white/10 py-3" // SOLID COLOR when menu is open
      : scrolled
      ? "bg-black/80 backdrop-blur-md border-white/10 shadow-md py-3"
      : "bg-transparent border-transparent py-4"
  }`;

  return (
    <header className={headerClasses}>
      <div className="w-full mx-auto px-4 lg:px-10">
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
                <button className="border border-lolo-cyan text-lolo-cyan px-6 py-2 hover:bg-lolo-cyan hover:text-black transition-all rounded-full text-md font-medium">
                  Dashboard
                </button>
              </Link>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-md font-medium hover:text-lolo-pink transition-colors text-white"
                >
                  Login
                </Link>
                <Link to="/signup">
                  <button className="bg-lolo-pink text-white border border-lolo-pink px-5 py-2 rounded-full hover:bg-black hover:text-lolo-pink transition-all font-medium text-md shadow-[0_0_15px_rgba(236,72,153,0.3)]">
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
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileMenuVariants}
            // CHANGED: bg-[#030303] (Solid) instead of bg-black/95 (Transparent)
            className="absolute top-full left-0 w-full bg-gray-900 border-t border-white/10 overflow-y-auto max-h-[calc(100vh-80px)] shadow-2xl md:hidden flex flex-col"
          >
            <div className="px-4 py-6 space-y-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                    location.pathname === item.path
                      ? "bg-lolo-pink/10 text-lolo-pink"
                      : "text-white hover:bg-white/5"
                  }`}
                >
                  <item.icon size={18} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}

              <div className="px-2 py-2">
                <NavDropdown isMobile />
              </div>

              <div className="h-px bg-white/10 my-4 mx-4" />

              <div className="px-2">
                {user ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 text-lolo-cyan hover:bg-lolo-cyan/10 rounded-xl transition-colors"
                  >
                    <User size={18} />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                ) : (
                  <div className="flex flex-col gap-3 px-2">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center space-x-2 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-white"
                    >
                      <LogIn size={16} />
                      <span className="font-medium">Login</span>
                    </Link>

                    <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                      <button className="w-full bg-lolo-pink py-3 rounded-xl font-bold text-white shadow-lg active:scale-[0.98]">
                        Sign Up
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
            {/* Added extra padding at bottom for mobile scrolling safety */}
            <div className="pb-60" />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;

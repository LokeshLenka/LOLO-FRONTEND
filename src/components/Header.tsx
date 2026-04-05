// src/components/Header.tsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, CalendarClock, Clapperboard, Home, LogIn } from "lucide-react";
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
  { label: "Publications", path: "/publications", icon: Clapperboard },
];

const Header: React.FC<HeaderProps> = ({ scrolled }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = (useAuth && useAuth()) || { user: null };
  const location = useLocation();

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

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ${
        scrolled ? "backdrop-blur-xl" : "backdrop-blur-sm"
      } ${
        scrolled
          ? "bg-white/10 border-b border-white/20"
          : "bg-white/5 border-b border-white/10"
      }`}
    >
      <div className="w-full mx-auto px-4 lg:px-10 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Link to="/" className="flex items-center space-x-3 z-50 relative">
              <img
                src={Lolo_logo_1}
                alt="LoLo Logo"
                className="h-10 w-10 md:h-12 md:w-12 object-contain filter drop-shadow-[0_0_8px_rgba(255,0,255,0.6)]"
              />
              <span className="hidden md:inline text-lg font-bold tracking-tight text-white drop-shadow-lg">
                SRKR LOLO
              </span>
            </Link>
          </motion.div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {NAV_ITEMS.map((item) => (
              <motion.div key={item.path} whileHover={{ y: -2 }}>
                <Link
                  to={item.path}
                  className={`text-sm font-medium transition-all duration-300 px-4 py-2 rounded-lg relative group ${
                    location.pathname === item.path
                      ? "text-neon-pink"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {item.label}
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="navUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan to-neon-pink rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan/0 to-neon-pink/0 group-hover:from-cyan/10 group-hover:to-neon-pink/10 transition-all duration-300 -z-10" />
                </Link>
              </motion.div>
            ))}

            <div className="ml-2">
              <NavDropdown />
            </div>

            {user ? (
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link to={`/${user.username}/dashboard`}>
                  <button className="ml-4 px-6 py-2 rounded-xl glassmorphic hover:glow-cyan-pink transition-all duration-300 text-white font-medium text-sm hover:border-cyan/50 group">
                    <span className="flex items-center gap-2">
                      <User size={16} className="group-hover:text-neon-pink transition-colors" />
                      Dashboard
                    </span>
                  </button>
                </Link>
              </motion.div>
            ) : (
              <div className="flex items-center space-x-3 ml-6">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link to="/login">
                    <button className="text-white/80 hover:text-white px-4 py-2 rounded-lg transition-colors duration-300">
                      Login
                    </button>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link to="/signup">
                    <button className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan to-neon-pink text-white font-bold hover:shadow-[0_0_20px_rgba(255,0,255,0.6)] transition-all duration-300">
                      Sign Up
                    </button>
                  </Link>
                </motion.div>
              </div>
            )}
          </nav>

          {/* Mobile controls */}
          <div className="flex items-center gap-4 md:hidden">
            {user && (
              <motion.div whileHover={{ scale: 1.1 }}>
                <Link to={`/${user.username}/dashboard`} className="text-white">
                  <User size={20} />
                </Link>
              </motion.div>
            )}

            <motion.button
              className="text-white z-50 p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setIsMenuOpen((s) => !s)}
              aria-label="Toggle menu"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 w-full glassmorphic-dark border-t border-white/10 md:hidden flex flex-col z-40 backdrop-blur-xl"
          >
            <div className="px-4 py-6 space-y-2">
              {NAV_ITEMS.map((item, idx) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      location.pathname === item.path
                        ? "bg-gradient-to-r from-cyan/20 to-neon-pink/20 text-neon-pink font-bold border border-neon-pink/30"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                </motion.div>
              ))}

              <div className="px-2 py-2">
                <NavDropdown isMobile />
              </div>

              <div className="h-px bg-white/10 my-4 mx-4" />

              <div className="px-2 space-y-3">
                {user ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link
                      to={`/${user.username}/dashboard`}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center space-x-2 w-full glassmorphic text-white font-bold py-3 rounded-lg transition-all hover:glow-cyan-pink"
                    >
                      <User size={18} className="text-neon-pink" />
                      <span>Go to Dashboard</span>
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div
                    className="flex flex-col gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <button className="w-full flex items-center justify-center gap-2 glassmorphic text-white font-bold py-3 rounded-lg transition-all hover:bg-white/20">
                        <LogIn size={18} />
                        <span>Login</span>
                      </button>
                    </Link>

                    <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                      <button className="w-full bg-gradient-to-r from-cyan to-neon-pink text-white font-bold py-3 rounded-lg transition-all hover:shadow-[0_0_20px_rgba(255,0,255,0.6)]">
                        Sign Up
                      </button>
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>

            <div className="pb-6" />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;

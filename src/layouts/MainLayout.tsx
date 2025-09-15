import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Menu, X, Music, LogIn, User } from "lucide-react";
import { motion } from "framer-motion";
// import { useAuth } from '../contexts/AuthContext';
import Logo from "../components/Logo";

const MainLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const user = null; // Temporary placeholder, replace with actual user object from context
  const location = useLocation();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Navbar */}
      <header
        className={`fixed top-4 left-0 right-0 z-50 transition-all duration-300 w-[95%] rounded-lg justify-center mx-auto max-h-20 bg-transparent
             ${
               scrolled
                 ? "bg-black/40 backdrop-blur-sm shadow-lg"
                 : "bg-transparent"
             }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <Logo size={40} />
              <span className="text-2xl font-bold gradient-text">LoLo</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-12">
              <Link
                to="/"
                className={`hover:text-lolo-pink transition-colors ${
                  location.pathname === "/" ? "text-lolo-pink" : "text-white"
                }`}
              >
                Home
              </Link>
              <Link
                to="/events"
                className={`hover:text-lolo-pink transition-colors ${
                  location.pathname === "/events"
                    ? "text-lolo-pink"
                    : "text-white"
                }`}
              >
                Events
              </Link>
              <Link
                to="/blog"
                className={`hover:text-lolo-pink transition-colors ${
                  location.pathname.includes("/blog")
                    ? "text-lolo-pink"
                    : "text-white"
                }`}
              >
                Blog
              </Link>
              {user ? (
                <Link
                  to="/dashboard"
                  className="btn btn-primary border-2 border-lolo-cyan px-4 py-2 hover:text-lolo-cyan rounded-md"
                >
                  Dashboard
                </Link>
              ) : (
                <div className="flex items-center space-x-12">
                  <Link
                    to="/login"
                    className="hover:text-lolo-pink transition-colors border-2 border-lolo-pink px-4 py-2 rounded-md"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="btn btn-primary bg-lolo-pink px-4 py-2 rounded-md hover:bg-lolo-pink/60"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-gray-900 border-t border-gray-800"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                <Link
                  to="/"
                  className={`flex items-center space-x-2 py-2 ${
                    location.pathname === "/" ? "text-lolo-pink" : "text-white"
                  }`}
                >
                  <Music size={18} />
                  <span>Home</span>
                </Link>
                <Link
                  to="/events"
                  className={`flex items-center space-x-2 py-2 ${
                    location.pathname === "/events"
                      ? "text-lolo-pink"
                      : "text-white"
                  }`}
                >
                  <Music size={18} />
                  <span>Events</span>
                </Link>
                <Link
                  to="/blog"
                  className={`flex items-center space-x-2 py-2 ${
                    location.pathname.includes("/blog")
                      ? "text-lolo-pink"
                      : "text-white"
                  }`}
                >
                  <Music size={18} />
                  <span>Blog</span>
                </Link>
                {user ? (
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-2 py-2 text-lolo-cyan"
                  >
                    <User size={18} />
                    <span>Dashboard</span>
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="flex items-center space-x-2 py-2"
                    >
                      <LogIn size={18} />
                      <span>Login</span>
                    </Link>
                    <Link
                      to="/signup"
                      className="btn btn-primary w-full text-center"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Logo size={30} />
                <span className="text-xl font-bold gradient-text">LoLo</span>
              </div>
              <p className="text-gray-400">Makes You Say "YoYo"</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="text-gray-400 hover:text-lolo-pink transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blog"
                    className="text-gray-400 hover:text-lolo-pink transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="text-gray-400 hover:text-lolo-pink transition-colors"
                  >
                    Login
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-lolo-pink transition-colors"
                >
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-lolo-pink transition-colors"
                >
                  <span className="sr-only">Instagram</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-lolo-pink transition-colors"
                >
                  <span className="sr-only">YouTube</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} LoLo Music. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;

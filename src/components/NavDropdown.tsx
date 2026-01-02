// src/components/NavDropdown.tsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronDown,
  Users,
  HelpCircle,
  Sparkles,
  ClipboardCheck,
  Handshake,
  Mail,
  Image,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavDropdownProps {
  isMobile?: boolean;
}

export default function NavDropdown({ isMobile = false }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (isMobile) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const toggleDropdown = () => setIsOpen((s) => !s);

  const menuItems = [
    {
      section: "Community",
      items: [
        { label: "Our Team", path: "/team", icon: Users },
        {
          label: "Registration Status",
          path: "/registration-status",
          icon: ClipboardCheck,
        },
      ],
    },
    {
      section: "Support",
      items: [
        { label: "About Us", path: "/about", icon: Handshake },
        { label: "Contact Us", path: "/contact", icon: Mail },
        { label: "FAQ", path: "/faq", icon: HelpCircle },
      ],
    },
  ];

  const containerVariants = isMobile
    ? {
        hidden: { opacity: 0, height: 0, overflow: "hidden" },
        visible: { opacity: 1, height: "auto", transition: { duration: 0.2 } },
      }
    : {
        hidden: { opacity: 0, y: 8, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.14 } },
      };

  const isGalleryActive = location.pathname === "/gallery";

  return (
    <div
      ref={dropdownRef}
      className={`${isMobile ? "w-full" : "relative"} inline-block`}
    >
      <button
        onClick={toggleDropdown}
        className={`
          flex items-center space-x-1 transition-colors duration-200 font-medium outline-none
          ${
            isMobile
              ? "w-full py-3 px-4 justify-between rounded-xl hover:bg-white/5"
              : ""
          }
          ${
            isOpen && !isMobile
              ? "text-lolo-pink"
              : "text-white hover:text-lolo-pink"
          }
        `}
      >
        <div className="flex items-center">
          {isMobile && <Sparkles size={18} className="mr-3" />}
          <span className="text-md">More</span>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.18 }}
        >
          <ChevronDown size={14} className={isMobile ? "ml-2" : ""} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={containerVariants}
            className={`
              ${
                isMobile
                  ? "relative w-full ml-0 border-l-2 border-white/10 pl-2 mt-1"
                  : "absolute right-0 mt-3 w-64 rounded-2xl border border-white/10 bg-gray-900 shadow-2xl z-[100]"
              }
            `}
          >
            <div className={` ${isMobile ? "py-1" : "py-2"}`}>
              {menuItems.map((group, gIdx) => (
                <div key={group.section}>
                  {gIdx > 0 && <div className="h-[1px] bg-white/5 mx-4 my-2" />}

                  <div className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    {group.section}
                  </div>

                  <ul className="space-y-1 px-2">
                    {group.items.map((item) => {
                      const isActive = location.pathname === item.path;
                      const Icon = item.icon;
                      return (
                        <li key={item.path}>
                          <Link
                            to={item.path}
                            className={`
                              flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 group
                              ${
                                isActive
                                  ? "bg-lolo-pink/10 text-lolo-pink"
                                  : "text-gray-300 hover:bg-white/5 hover:text-white"
                              }
                            `}
                            onClick={() => isMobile && setIsOpen(false)} // This usually handled by parent closing, but good for safety
                          >
                            <div
                              className={`p-1.5 rounded-md transition-colors ${
                                isActive
                                  ? "bg-lolo-pink/20 text-lolo-pink"
                                  : "bg-white/5 text-gray-400 group-hover:text-white group-hover:bg-white/10"
                              }`}
                            >
                              <Icon size={16} />
                            </div>
                            <span className="font-medium text-sm">
                              {item.label}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}

              {isMobile && (
                <div>
                  <div className="h-[1px] bg-white/5 mx-4 my-2" />
                  <div className="px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Media
                  </div>
                  <ul className="space-y-1 px-2">
                    <li>
                      <Link
                        to="/gallery"
                        className={`
                          flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 group
                          ${
                            isGalleryActive
                              ? "bg-lolo-pink/10 text-lolo-pink"
                              : "text-gray-300 hover:bg-white/5 hover:text-white"
                          }
                        `}
                      >
                        <div className="p-1.5 rounded-md bg-white/5 text-gray-400">
                          <Image size={16} />
                        </div>
                        <span className="font-medium text-sm">Gallery</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              )}

              {!isMobile && (
                <div className="px-2 mt-2 pb-2">
                  <div className="h-[1px] bg-white/5 mx-4 mb-2" />
                  <Link
                    to="/gallery"
                    className="flex items-center justify-between px-3 py-2.5 mx-1 rounded-xl bg-gradient-to-r from-lolo-pink/10 to-lolo-cyan/10 border border-white/5 hover:border-white/20 transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-lolo-pink" />
                      <span className="text-sm font-bold text-white">
                        Gallery
                      </span>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronDown,
  Users,
  HelpCircle,
  Sparkles,
  ClipboardCheck,
  Handshake,
  Mail,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavDropdownProps {
  isMobile?: boolean;
}

export default function NavDropdown({ isMobile = false }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close dropdown when clicking outside (Desktop only)
  useEffect(() => {
    if (isMobile) return;
    
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile]);

  // Close dropdown on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const menuItems = [
    {
      section: "Community",
      items: [
        { label: "Our Team", path: "/team", icon: Users },
        { label: "Registration Status", path: "/registration-status", icon: ClipboardCheck },
      ],
    },
    {
      section: "Support",
      items: [
        { label: "About Us", path: "/about-us", icon: Handshake },
        { label: "Contact Us", path: "/contact", icon: Mail },
        { label: "FAQ", path: "/faq", icon: HelpCircle },
      ],
    },
  ];

  // Animation variants based on view mode
  const containerVariants = isMobile 
    ? {
        hidden: { height: 0, opacity: 0 },
        visible: { height: "auto", opacity: 1, transition: { duration: 0.3 } }
      }
    : {
        hidden: { opacity: 0, y: 10, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2 } }
      };

  return (
    <div className={`${isMobile ? "w-full" : "relative"}`} ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={`
          flex items-center space-x-1 transition-colors duration-300 font-medium
          ${isMobile ? "w-full py-2 justify-start" : ""}
          ${isOpen ? "text-lolo-pink" : "text-white hover:text-lolo-pink"}
        `}
      >
        {/* Icon for mobile consistency */}
        {isMobile && <Sparkles size={18} className="mr-2" />}
        <span>More</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} className={isMobile ? "ml-2" : ""} />
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
              ${isMobile 
                ? "relative w-full border-l-2 border-white/10 ml-2 pl-2 overflow-hidden" 
                : "absolute right-0 mt-4 w-64 rounded-2xl border border-white/10 bg-[#09090b]/80 backdrop-blur-2xl shadow-2xl shadow-black/50 overflow-hidden z-50"
              }
            `}
          >
            <div className={isMobile ? "py-1" : "py-2"}>
              {menuItems.map((group, groupIndex) => (
                <div key={group.section}>
                  {groupIndex > 0 && <div className="h-[1px] bg-white/5 mx-4 my-2" />}
                  
                  <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
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
                              flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                              ${isActive ? "bg-lolo-pink/10 text-lolo-pink" : "text-gray-300 hover:bg-white/5 hover:text-white"}
                            `}
                          >
                            <div className={`p-1.5 rounded-lg transition-colors ${isActive ? "bg-lolo-pink/20 text-lolo-pink" : "bg-white/5 text-gray-400 group-hover:text-white group-hover:bg-white/10"}`}>
                              <Icon size={16} />
                            </div>
                            <span className="font-medium text-sm">{item.label}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}

              {!isMobile && (
                <div className="px-2 mt-2 pb-2">
                  <Link to="/gallery" className="flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-lolo-pink/20 to-lolo-cyan/20 border border-white/10 hover:border-white/20 transition-all group">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-lolo-cyan" />
                      <span className="text-sm font-bold text-white">Gallery</span>
                    </div>
                    <ChevronDown size={14} className="-rotate-90 text-gray-400 group-hover:translate-x-1 transition-transform" />
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

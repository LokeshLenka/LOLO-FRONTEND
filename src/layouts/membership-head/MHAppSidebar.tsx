import React, { useMemo } from "react";
import SidebarWidget from "../SidebarWidget";
import { Link } from "react-router-dom";
import LOLO_Logo_1 from "../../assets/logos/Lolo_logo_1.png";
import { MoreHorizontal } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import { useAuth } from "@/context/AuthContext";
import { getNavItemsForUser } from "@/components/sidebar/config";
import { SidebarMenuItem } from "@/components/sidebar/SidebarMenuItem";

const MHAppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { user, profile } = useAuth();

  const navItems = useMemo(() => {
    return getNavItemsForUser(user, profile);
  }, [user, profile, window.location.pathname]);

  const sidebarWidth =
    isExpanded || isMobileOpen || isHovered ? "w-[290px]" : "w-[90px]";
  const showContent = isExpanded || isMobileOpen || isHovered;

  return (
    <aside
      className={`fixed z-50 top-0 left-0 min-h-screen bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300 ease-in-out
        ${sidebarWidth}
        ${
          isMobileOpen
            ? "translate-x-0 shadow-2xl dark:shadow-zinc-900/50"
            : "-translate-x-full lg:translate-x-0"
        }
      `}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* --- Header --- */}
      <div
        className={`h-20 flex items-center ${
          showContent ? "px-6" : "justify-center"
        }`}
      >
        <Link to="/" className="flex items-center gap-3">
          <img
            src={LOLO_Logo_1}
            alt="LOLO"
            className="w-8 h-8 object-contain"
          />
          {showContent && (
            <span
              className="font-bold text-xl tracking-tight text-zinc-950 dark:text-zinc-50"
              style={{ fontFamily: "astro, sans-serif" }}
            >
              SRKR LOLO
            </span>
          )}
        </Link>
      </div>

      {/* --- Menu --- */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-4 px-4">
        <div className="mb-2">
          {!showContent ? (
            <div className="flex justify-center mb-4 text-zinc-400 dark:text-zinc-500">
              <MoreHorizontal size={20} />
            </div>
          ) : (
            <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4 px-2">
              Menu
            </h3>
          )}

          <ul className="space-y-1">
            {navItems.map((item, idx) => (
              <SidebarMenuItem
                key={idx}
                item={item}
                isExpanded={isExpanded}
                isMobileOpen={isMobileOpen}
                isHovered={isHovered}
              />
            ))}
          </ul>
        </div>
      </div>

      {/* --- Widget --- */}
      {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
    </aside>
  );
};

export default MHAppSidebar;

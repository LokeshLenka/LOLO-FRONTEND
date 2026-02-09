import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, Circle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// --- Types ---
export interface NavItem {
  name: string;
  path?: string;
  icon?: React.ReactNode;
  subItems?: NavItem[];
}

interface SidebarMenuItemProps {
  item: NavItem;
  isExpanded: boolean;
  isMobileOpen: boolean;
  isHovered: boolean;
  depth?: number;
}

// --- Helper: Recursively check if item (or any child) is active ---
const checkIsActive = (
  item: NavItem,
  currentPath: string,
  currentSearch: string,
): boolean => {
  // 1. Separate path and query params from the Item's definition
  const itemPath = item.path?.split("?")[0] || "";
  const itemQueryString = item.path?.includes("?")
    ? item.path.split("?")[1]
    : "";

  // 2. Check if this specific item matches the current URL
  if (item.path) {
    // A. Check Path Match (Exact match OR Prefix match for nested routes, ignoring root '/')
    const isPathMatch =
      currentPath === itemPath ||
      (itemPath !== "/" && currentPath.startsWith(itemPath));

    if (isPathMatch) {
      // B. Check Query Param Match (Only if the menu item strictly defines them)
      if (itemQueryString) {
        const currentParams = new URLSearchParams(currentSearch);
        const itemParams = new URLSearchParams(itemQueryString);

        let allParamsMatch = true;
        itemParams.forEach((val, key) => {
          if (currentParams.get(key) !== val) {
            allParamsMatch = false;
          }
        });

        if (allParamsMatch) return true;
      } else {
        // If menu item has NO params, simple path match is enough
        return true;
      }
    }
  }

  // 3. Recursive Check: Is any child active?
  if (item.subItems) {
    return item.subItems.some((sub) =>
      checkIsActive(sub, currentPath, currentSearch),
    );
  }

  return false;
};

// --- Main Component ---
export const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  item,
  isExpanded,
  isMobileOpen,
  isHovered,
  depth = 0,
}) => {
  const location = useLocation();
  const showContent = isExpanded || isMobileOpen || isHovered;

  // Calculate if this folder should be "Active" (highlighted text/open state)
  const isActive = useMemo(
    () => checkIsActive(item, location.pathname, location.search),
    [item, location.pathname, location.search],
  );

  // Initialize open state based on activity
  const [isOpen, setIsOpen] = useState(isActive);

  // Sync state: If a child becomes active (e.g. user navigated), force open
  useEffect(() => {
    if (isActive) {
      setIsOpen(true);
    }
  }, [isActive]);

  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  // Indentation logic for nested levels
  const paddingLeft = depth > 0 ? `${depth * 12 + 12}px` : "12px";

  // Calculate if the specific LINK is active (Leaf node check only)
  const isLinkActive = useMemo(() => {
    if (!item.path) return false;

    // Parse item logic
    const itemPath = item.path.split("?")[0];
    const itemQuery = item.path.includes("?") ? item.path.split("?")[1] : "";

    // Path check
    const isPath =
      location.pathname === itemPath ||
      (itemPath !== "/" && location.pathname.startsWith(itemPath));

    // Query check
    if (itemQuery) {
      const currentParams = new URLSearchParams(location.search);
      const itemParams = new URLSearchParams(itemQuery);
      let match = true;
      itemParams.forEach((val, key) => {
        if (currentParams.get(key) !== val) match = false;
      });
      return isPath && match;
    }
    return isPath;
  }, [item.path, location.pathname, location.search]);

  // Styles for leaf links
  const linkClasses = `
    group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
    ${
      isLinkActive
        ? "bg-cyan-50/10 text-cyan-600 dark:text-cyan-400 font-medium"
        : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
    }
  `;

  // --- RENDER: FOLDER (Item with SubItems) ---
  if (item.subItems && item.subItems.length > 0) {
    return (
      <li className="mb-1">
        <button
          onClick={toggleMenu}
          className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-colors duration-200 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white ${
            isActive ? "text-cyan-600 dark:text-cyan-400 font-medium" : ""
          }`}
          style={{ paddingLeft: showContent ? paddingLeft : "12px" }}
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="flex-shrink-0">
              {item.icon ? (
                item.icon
              ) : (
                // Use a smaller circle/dot for nested items without icons
                <Circle size={6} className={depth > 0 ? "opacity-50" : ""} />
              )}
            </span>
            {showContent && (
              <span className="truncate text-sm">{item.name}</span>
            )}
          </div>

          {showContent && (
            <span className="flex-shrink-0 transition-transform duration-200">
              {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </span>
          )}
        </button>

        <AnimatePresence>
          {isOpen && showContent && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden space-y-1 mt-1"
            >
              {item.subItems.map((subItem, idx) => (
                <SidebarMenuItem
                  key={`${subItem.name}-${idx}`}
                  item={subItem}
                  isExpanded={isExpanded}
                  isMobileOpen={isMobileOpen}
                  isHovered={isHovered}
                  depth={depth + 1}
                />
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </li>
    );
  }

  // --- RENDER: LINK (Leaf Node) ---
  return (
    <li className="mb-1">
      <Link
        to={item.path || "#"}
        className={linkClasses}
        style={{ paddingLeft: showContent ? paddingLeft : "12px" }}
      >
        <span className="flex-shrink-0">
          {item.icon ? (
            item.icon
          ) : (
            <Circle size={6} className={depth > 0 ? "opacity-50" : ""} />
          )}
        </span>
        {showContent && <span className="truncate text-sm">{item.name}</span>}
      </Link>
    </li>
  );
};

import React, { useRef, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";

interface MenuItemProps {
  item: any;
  isExpanded: boolean;
  isMobileOpen: boolean;
  isHovered: boolean;
}

export const SidebarMenuItem: React.FC<MenuItemProps> = ({ item, isExpanded, isMobileOpen, isHovered }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;
  const showText = isExpanded || isHovered || isMobileOpen;

  // Auto-expand if child is active
  useEffect(() => {
    if (item.subItems?.some((sub: any) => isActive(sub.path))) {
      setIsOpen(true);
    }
  }, [location.pathname, item.subItems]);

  const baseClasses = `
    flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer mb-1
    ${!showText ? "justify-center" : ""}
  `;

  const activeClasses = "bg-[#03a1b0]/10 text-[#03a1b0]";
  const inactiveClasses = "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200";

  // --- Render Submenu Parent ---
  if (item.subItems) {
    const isParentActive = item.subItems.some((sub: any) => isActive(sub.path));
    
    return (
      <li>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`${baseClasses} w-full ${isOpen || isParentActive ? activeClasses : inactiveClasses}`}
        >
          <span className={`${isOpen || isParentActive ? "text-[#03a1b0]" : "text-gray-500"}`}>
            {item.icon}
          </span>
          
          {showText && (
            <>
              <span className="flex-1 text-left font-medium text-sm">{item.name}</span>
              <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </>
          )}
        </button>

        {showText && (
          <div
            ref={contentRef}
            style={{ height: isOpen ? contentRef.current?.scrollHeight : 0 }}
            className="overflow-hidden transition-[height] duration-300 ease-in-out"
          >
            <ul className="pl-10 pr-2 pt-1 pb-2 space-y-1">
              {item.subItems.map((sub: any) => (
                <li key={sub.path}>
                  <Link
                    to={sub.path}
                    className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                      isActive(sub.path)
                        ? "text-[#03a1b0] bg-[#03a1b0]/5 font-medium"
                        : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                    }`}
                  >
                    {sub.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </li>
    );
  }

  // --- Render Single Link ---
  const isLinkActive = isActive(item.path);
  
  return (
    <li>
      <Link
        to={item.path}
        className={`${baseClasses} ${isLinkActive ? activeClasses : inactiveClasses}`}
      >
        <span className={`${isLinkActive ? "text-[#03a1b0]" : "text-gray-500 group-hover:text-gray-900"}`}>
          {item.icon}
        </span>
        {showText && <span className="font-medium text-sm">{item.name}</span>}
      </Link>
    </li>
  );
};

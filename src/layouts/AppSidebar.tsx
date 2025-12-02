import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import LOLO_Logo_1 from "../assets/logos/Lolo_logo_1.png";

// Assume these icons are imported from an icon library
import { ChevronDownIcon, HorizontaLDots } from "../icons";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";
import {
  CircleStar,
  CircleUser,
  ClipboardPenLine,
  LayoutGrid,
} from "lucide-react";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <LayoutGrid />,
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <ClipboardPenLine />,
    name: "Event Registrations",
    path: "/dashboard/event-registrations",
  },
  {
    icon: <CircleStar />,
    name: "Credits",
    path: "/dashboard/credits",
  },
  {
    icon: <CircleUser />,
    name: "My Profile",
    path: "/dashboard/profile",
  },
];

const othersItems: NavItem[] = [];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "bg-[#03a1b0]/10 text-[#03a1b0] dark:bg-white/5 dark:text-white" // Updated active colors
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200" // Updated inactive colors
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "text-[#03a1b0]" // Updated icon active color
                    : "text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-200"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <span
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-[#03a1b0]" // Updated chevron color
                      : ""
                  }`}
                >
                  <ChevronDownIcon />
                </span>
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path)
                    ? "bg-[#03a1b0]/10 text-[#03a1b0] dark:bg-[#03a1b0]/20 dark:text-[#03a1b0]" // Updated active link colors
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200" // Updated inactive link colors
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "text-[#03a1b0]" // Updated active icon color
                      : "text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-200"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "text-[#03a1b0] font-semibold bg-[#03a1b0]/5" // Updated submenu active
                          : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200" // Updated submenu inactive
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "text-green-600 bg-green-100"
                                : "text-gray-500 bg-gray-100"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "text-purple-600 bg-purple-100"
                                : "text-gray-500 bg-gray-100"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${
          isMobileOpen
            ? "translate-x-0 !bg-white/95 !text-gray-900 dark:!bg-gray-900/95 dark:!text-gray-100 backdrop-blur-xl shadow-2xl" // Updated Mobile Overlay Colors
            : "-translate-x-full"
        }
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        {isExpanded || isHovered || isMobileOpen ? (
          <>
            <Link
              to="/"
              className="dark:hidden flex justify-center items-center group"
            >
              <img
                className="h-8 w-8 transition-transform group-hover:scale-110"
                src={LOLO_Logo_1}
                alt="Logo"
              />
              <span
                className="m-auto ml-2 text-sm text-black"
                style={{ fontFamily: "astro" }}
              >
                SRKR LOLO
              </span>
            </Link>
            <Link
              to="/"
              className="hidden dark:flex justify-center items-center group"
            >
              <img
                className="h-8 w-8 transition-transform group-hover:scale-110"
                src={LOLO_Logo_1}
                alt="Logo"
              />
              <span
                className="m-auto ml-2 text-sm text-white"
                style={{ fontFamily: "astro" }}
              >
                SRKR LOLO
              </span>
            </Link>
          </>
        ) : (
          <Link to="/">
            <img src={LOLO_Logo_1} alt="Logo" width={40} height={40} />
          </Link>
        )}
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <span className="size-6">
                    <HorizontaLDots />
                  </span>
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
      </div>
    </aside>
  );
};

export default AppSidebar;

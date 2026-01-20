import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Dropdown } from "../ui/dropdown/Dropdown";
import {
  Check,
  CircleUserRound,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [profilesOpen, setProfilesOpen] = useState(false);

  const { user, profile, getPromotedRoleLabel } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // --- 1. Fix Path Generation Logic ---
  const getDashboardPath = (roleType: "primary" | "promoted") => {
    // Ensure we have a username, otherwise fallback to generic
    const username = user?.username || "user";

    if (roleType === "primary") {
      // Standard Dashboard: /2507070003/dashboard
      return `/${username}/dashboard`;
    }

    if (roleType === "promoted" && profile?.promoted_role) {
      // Promoted Dashboard: /2507070003/executive_body_member/dashboard
      return `/${username}/${profile.promoted_role}/dashboard`;
    }

    return "/dashboard";
  };

  // --- 2. Build Available Profiles ---
  const availableProfiles = [];

  // Primary Profile (Management/Music)
  if (profile?.primary_role) {
    availableProfiles.push({
      id: profile.primary_role,
      label:
        profile.primary_role.charAt(0).toUpperCase() +
        profile.primary_role.slice(1),
      path: getDashboardPath("primary"),
      type: "primary",
    });
  }

  // Promoted Profile (EBM, Credit Manager, etc.)
  if (profile?.has_promoted_role && profile.promoted_role) {
    availableProfiles.push({
      id: profile.promoted_role,
      label: getPromotedRoleLabel(),
      path: getDashboardPath("promoted"),
      type: "promoted",
    });
  }

  // Determine Active Profile
  // We check if the current path *contains* the promoted role string for the promoted profile
  // Otherwise default to primary
  const activeProfileId =
    availableProfiles.find((p) => location.pathname.includes(p.id))?.id ||
    profile?.primary_role;

  function toggleDropdown() {
    setIsOpen(!isOpen);
    if (isOpen) setProfilesOpen(false);
  }

  function closeDropdown() {
    setIsOpen(false);
    setProfilesOpen(false);
  }

  function handleProfileClick(path: string) {
    navigate(path);
    closeDropdown();
  }
  {
    return (
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center gap-3 text-gray-700 dropdown-toggle dark:text-gray-400 group"
        >
          <span className="h-10 w-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-[#03a1b0] group-hover:bg-[#03a1b0]/10 transition-colors shadow-sm">
            <CircleUserRound size={24} />
          </span>

          <div className="hidden md:block text-left">
            <span className="block text-sm font-bold text-gray-900 dark:text-white truncate max-w-[120px]">
              {user?.name || user?.username}
            </span>
            <span className="block text-xs text-gray-500 dark:text-gray-400 capitalize truncate max-w-[120px]">
              {profile?.primary_role || "Member"}
            </span>
          </div>
          {profile?.has_promoted_role && (
            <svg
              className={`hidden md:block stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
              width="18"
              height="20"
              viewBox="0 0 18 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
        <Dropdown
          isOpen={isOpen}
          onClose={closeDropdown}
          className="absolute right-0 mt-3 w-72 flex flex-col rounded-2xl border border-gray-200 bg-white p-2 shadow-2xl dark:border-gray-800 dark:bg-[#18181b] z-50 transform origin-top-right transition-all"
        >
          <div className="px-4 py-3 mb-2 border-b border-gray-100 dark:border-white/5">
            <span className="block text-sm font-bold text-gray-900 dark:text-white truncate">
              {user?.name || user?.username}
            </span>
            <span className="block text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email}
            </span>
          </div>

          <ul className="flex flex-col gap-1">
            <li className="relative">
              {profile?.has_promoted_role && (
                <button
                  type="button"
                  onClick={() => setProfilesOpen((s) => !s)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${
                  profilesOpen
                    ? "bg-gray-50 text-gray-900 dark:bg-white/5 dark:text-white"
                    : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5"
                }`}
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard size={18} className="text-gray-400" />
                    <span>Switch Dashboard</span>
                  </div>
                  <ChevronRight
                    size={16}
                    className={`text-gray-400 transition-transform duration-200 ${
                      profilesOpen ? "rotate-90" : ""
                    }`}
                  />
                </button>
              )}

              {profilesOpen && (
                <div className="mt-1 ml-4 pl-3 border-l-2 border-gray-100 dark:border-white/10 space-y-1 animate-in slide-in-from-top-2 duration-200">
                  {availableProfiles.map((p) => {
                    const isActive = activeProfileId === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => handleProfileClick(p.path)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors text-left
                        ${
                          isActive
                            ? "bg-[#03a1b0]/10 text-[#03a1b0] font-semibold"
                            : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/5"
                        }`}
                      >
                        <span className="truncate">{p.label}</span>
                        {isActive && (
                          <Check
                            size={14}
                            className="text-[#03a1b0] shrink-0"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </li>

            {/* <li>
            <button
              onClick={() => navigate("/settings")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-white/5 transition-colors"
            >
              <User size={18} className="text-gray-400" />
              Account Settings
            </button>
          </li> */}

            {/* <li className="mt-1 pt-1 border-t border-gray-100 dark:border-white/5">
            <DropdownItem
              onItemClick={() => {
                logout();
                closeDropdown();
              }}
              tag="button"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={18} />
              Sign Out
            </DropdownItem>
          </li> */}
          </ul>
        </Dropdown>
      </div>
    );
  }
}

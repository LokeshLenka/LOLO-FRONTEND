import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, ShieldCheck, CalendarDays, Ticket, LogOut, Menu, X, Settings, BarChart3, Layers, Sparkles, UsersRound, ClipboardList, Crown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const navItems = [
  { label: "Overview", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Approvals", to: "/admin/approvals", icon: ShieldCheck },
  { label: "User Approvals", to: "/admin/user-approvals", icon: ClipboardList },
  { label: "Team Profiles", to: "/admin/team", icon: Crown },
  { label: "Events", to: "/admin/events", icon: CalendarDays },
  { label: "Registrations", to: "/admin/registrations", icon: Layers },
  { label: "Tickets", to: "/admin/tickets", icon: Ticket },
  { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
  { label: "By Role", to: "/admin/users-by-role", icon: UsersRound },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

export function AdminSidebar({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (v: boolean)=>void }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleLogout = () => { logout(); navigate("/admin/login"); };

  return (
    <>
      <button onClick={()=>setMobileOpen(!mobileOpen)} className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-none bg-white dark:bg-[#14261F] border border-[#BFE9E0] dark:border-[#1E3D32] shadow-md text-[#17463C] dark:text-[#EAF6F4]">
        {mobileOpen ? <X size={18}/> : <Menu size={18}/>}
      </button>
      <aside className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-[#BFE9E0] dark:border-[#1E3D32] bg-white dark:bg-[#14261F] transition-all duration-300 ${collapsed ? "w-[78px]" : "w-[264px]"} ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex h-[64px] items-center gap-3 px-4 border-b border-[#BFE9E0] dark:border-[#1E3D32]">
          <div className="w-9 h-9 rounded-none flex items-center justify-center" style={{background:"linear-gradient(135deg,#1E8277,#17463C)"}}>
            <Sparkles size={16} className="text-white"/>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-[15px] font-bold tracking-tight text-[#17463C] dark:text-[#EAF6F4] leading-none">LOLO Admin</div>
              <div className="text-[11px] font-medium tracking-widest uppercase text-[#1E8277]">Control Centre</div>
            </div>
          )}
          <button onClick={()=>setCollapsed(!collapsed)} className="hidden lg:flex w-7 h-7 items-center justify-center rounded-none border border-[#BFE9E0] dark:border-[#1E3D32] text-[#4A7A6E] hover:bg-[#EAF6F4] dark:hover:bg-[#1B342D]">
            <Menu size={14}/>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1 admin-scrollbar">
          {navItems.map(item=>{
            return (
              <NavLink key={item.to} to={item.to} className={({isActive})=> `flex items-center gap-3 px-3 py-2.5 rounded-none text-sm font-medium transition-all ${isActive ? "bg-[#1E8277] text-white shadow-sm" : "text-[#17463C] dark:text-[#EAF6F4] hover:bg-[#EAF6F4] dark:hover:bg-[#1B342D]"}`}>
                <item.icon size={18} className="shrink-0"/>
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[#BFE9E0] dark:border-[#1E3D32] space-y-3">
          {!collapsed && (
            <div className="rounded-none p-4 border border-[#BFE9E0] dark:border-[#1E3D32]" style={{background:"linear-gradient(135deg,#EAF6F4 0%,#91E9D7 60%,#3CCCB3 100%)"}}>
              <div className="text-sm font-bold text-[#17463C]">Need help?</div>
              <div className="text-xs text-[#17463C]/80 mt-1">Docs & audit logs in Settings.</div>
            </div>
          )}
          <button onClick={handleLogout} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-none text-sm font-semibold border border-[#BFE9E0] dark:border-[#1E3D32] text-[#17463C] dark:text-[#EAF6F4] hover:bg-[#EAF6F4] dark:hover:bg-[#1B342D] transition-colors ${collapsed ? "justify-center" : ""}`}>
            <LogOut size={16}/> {!collapsed && "Sign out"}
          </button>
        </div>
      </aside>
    </>
  );
}

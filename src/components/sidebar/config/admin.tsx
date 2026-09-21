import { LayoutDashboard, Users, BarChart3, CalendarDays, Layers, Ticket, ShieldCheck, Settings } from "lucide-react";
export type AdminNavItem = { label:string; to:string; icon:any };
export function getAdminNavItems(): AdminNavItem[] {
  return [
    { label:"Overview", to:"/admin/dashboard", icon:LayoutDashboard },
    { label:"Users", to:"/admin/users", icon:Users },
    { label:"Analytics", to:"/admin/analytics", icon:BarChart3 },
    { label:"Events", to:"/admin/events", icon:CalendarDays },
    { label:"Registrations", to:"/admin/registrations", icon:Layers },
    { label:"Tickets", to:"/admin/tickets", icon:Ticket },
    { label:"Approvals", to:"/admin/approvals", icon:ShieldCheck },
    { label:"Settings", to:"/admin/settings", icon:Settings },
  ];
}

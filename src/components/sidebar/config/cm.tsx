import { CalendarRange, LayoutDashboard, ScanLine } from "lucide-react";

export const getCMNavItems = (basePath: string) => [
  {
    icon: <LayoutDashboard />,
    name: "Credit Dashboard",
    path: `${basePath}/dashboard`,
  },
  {
    icon: <CalendarRange />,
    name: "Events",
    path: `${basePath}/events`,
  },
  {
    icon: <ScanLine />,
    name: "Verify Ticket",
    path: `${basePath}/verify-ticket`,
  },
];

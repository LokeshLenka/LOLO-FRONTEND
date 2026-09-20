import { CalendarRange, LayoutDashboard } from "lucide-react";

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
];

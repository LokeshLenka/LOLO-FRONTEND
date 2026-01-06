import {
  Coins,
  ClipboardCheck,
  ListFilter,
  LayoutDashboard,
} from "lucide-react";

export const getCMNavItems = (basePath: string) => [
  {
    icon: <LayoutDashboard />,
    name: "Credit Dashboard",
    path: `${basePath}/dashboard`,
  },
  {
    icon: <ClipboardCheck />,
    name: "Registrations",
    path: `${basePath}/event-registrations`, // View all registrations to assign credits
  },
  {
    icon: <Coins />,
    name: "Credit Management",
    subItems: [
      { name: "Manage Credits", path: `${basePath}/manage-credits` },
      { name: "Batch Update", path: `${basePath}/batch-credits` },
    ],
  },
  {
    icon: <ListFilter />,
    name: "Reports",
    path: `${basePath}/credit-reports`,
  },
];

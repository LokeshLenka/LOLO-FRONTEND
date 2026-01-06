import {
  LayoutGrid,
  ClipboardPenLine,
  CircleStar,
  CircleUser,
} from "lucide-react";

export const getCommonNavItems = (basePath: string) => [
  {
    icon: <LayoutGrid />,
    name: "Dashboard",
    path: `${basePath}/dashboard`,
  },
  {
    icon: <ClipboardPenLine />,
    name: "Event Registrations",
    path: `${basePath}/event-registrations`,
  },
  {
    icon: <CircleStar />,
    name: "Credits",
    path: `${basePath}/credits`,
  },
  {
    icon: <CircleUser />,
    name: "My Profile",
    path: `${basePath}/profile`,
  },
];

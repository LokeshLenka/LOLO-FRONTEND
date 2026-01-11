import {
  CheckCircle2,
  UserPlus,
  CalendarPlus,
  LayoutDashboard,
} from "lucide-react";

export const getEBMNavItems = (basePath: string) => [
  {
    icon: <LayoutDashboard />,
    name: "EBM Dashboard",
    path: `${basePath}/dashboard`,
  },
  {
    icon: <CheckCircle2 />,
    name: "User Approvals",
    subItems: [
      {
        name: "Pending Approvals",
        path: `${basePath}/dashboard/pending-approvals`,
      },
      { name: "My Approvals", path: `${basePath}/approvals-history` },
    ],
  },
  {
    icon: <CalendarPlus />,
    name: "Events",
    subItems: [
      { name: "Create Event", path: `${basePath}/create-event` }, // Links to modal or page
      { name: "My Events", path: `${basePath}/my-events` },
      { name: "Registrations", path: `${basePath}/event-registrations` },
    ],
  },
  {
    icon: <UserPlus />,
    name: "Member Onboarding",
    subItems: [
      { name: "Register New Member", path: `${basePath}/register-member` },
      { name: "My Registrations", path: `${basePath}/my-registrations` },
    ],
  },
];

import {
  CheckCircle2,
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
      { name: "Event Registrations", path: `${basePath}/event-registrations` },
      { name: "My Events", path: `${basePath}/my-events` },
      { name: "Create Event", path: `${basePath}/create-event` },
    ],
  },
  // {
  //   icon: <CalendarPlus />,
  //   name: "Desk Registrations",
  //   subItems: [
  //     { name: "Register An Attendee", path: `${basePath}/desk-sale` },
  //     // { name: "View Registrations", path: `${basePath}/collections` },
  //   ],
  // },
  // {
  //   icon: <UserPlus />,
  //   name: "Member Onboarding",
  //   subItems: [
  //     { name: "Register New Member", path: `${basePath}/register-member` },
  //     { name: "My Registrations", path: `${basePath}/my-registrations` },
  //   ],
  // },
];

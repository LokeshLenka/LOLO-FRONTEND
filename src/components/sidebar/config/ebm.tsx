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
      {
        name: "Club Events",
        // 'subItems' here indicates a nested folder structure

        subItems: [
          { name: "My Club Events", path: `${basePath}/my-events?type!=public` },

          {
            name: "Club Registrations",
            path: `${basePath}/event-registrations?type=!public`,
          },
        ],
      },
      {
        name: "Public Events",
        subItems: [
          { name: "My Public Events", path: `${basePath}/my-events?type=public` },

          {
            name: "Public Registrations",
            path: `${basePath}/event-registrations?type=public`,
          },
        ],
      },
      { name: "Create Event", path: `${basePath}/create-event` },
      { name: "My Events", path: `${basePath}/my-events` },
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

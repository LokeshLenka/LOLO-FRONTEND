import {
  ShieldCheck,
  Users,
  LayoutDashboard,
} from "lucide-react";

export const getMHNavItems = (basePath: string) => [
  {
    icon: <LayoutDashboard />,
    name: "Overview",
    path: `${basePath}/dashboard`,
  },
  {
    icon: <ShieldCheck />,
    name: "Requests",
    subItems: [
      { name: "To Review", path: `${basePath}/pending-approvals` },
      { name: "Activity Log", path: `${basePath}/approval-history` },
    ],
  },
  {
    icon: <Users />,
    name: "Members",
    path: `${basePath}/users`,
  },

  // subItems: [
  //   { name: "All Users", path: `${basePath}/users` },
  //   { name: "User Stats", path: `${basePath}/user-stats` },
  // ],
  // {
  //   icon: <UserCog />,
  //   name: "Promotions",
  //   subItems: [
  //     { name: "Promote to EBM", path: `${basePath}/promote/ebm` },
  //     { name: "Promote to CM", path: `${basePath}/promote/credit-manager` },
  //     { name: "Depromote User", path: `${basePath}/depromote` },
  //   ],
  // },
  // {
  //   icon: <BarChart3 />,
  //   name: "Team Profiles",
  //   path: `${basePath}/team-profiles`,
  // },
];

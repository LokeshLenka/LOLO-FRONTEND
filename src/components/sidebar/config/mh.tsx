import { 
  ShieldCheck, 
  Users, 
  UserCog, 
  BarChart3, 
  LayoutDashboard,
  UserMinus
} from "lucide-react";

export const getMHNavItems = (basePath: string) => [
  {
    icon: <LayoutDashboard />,
    name: "Head Dashboard",
    path: `${basePath}/dashboard`,
  },
  {
    icon: <ShieldCheck />,
    name: "Approvals",
    subItems: [
        { name: "Pending Requests", path: `${basePath}/pending-approvals` },
        { name: "History", path: `${basePath}/approval-history` }
    ]
  },
  {
    icon: <Users />,
    name: "User Management",
    subItems: [
        { name: "All Users", path: `${basePath}/users` },
        { name: "User Stats", path: `${basePath}/user-stats` }
    ]
  },
  {
    icon: <UserCog />,
    name: "Promotions",
    subItems: [
        { name: "Promote to EBM", path: `${basePath}/promote/ebm` },
        { name: "Promote to CM", path: `${basePath}/promote/credit-manager` },
        { name: "Depromote User", path: `${basePath}/depromote` }
    ]
  },
  {
    icon: <BarChart3 />,
    name: "Team Profiles",
    path: `${basePath}/team-profiles`
  }
];

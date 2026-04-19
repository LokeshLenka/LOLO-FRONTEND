// src/components/membership-head/UserStatsCards.tsx
import { useUserStats } from "@/hooks/useUsers";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Clock,
  ShieldCheck,
  Music,
  Briefcase,
  TrendingUp,
} from "lucide-react";

export function UserStatsCards() {
  const { stats, isLoading, isError } = useUserStats();

  // REMOVED: if (isError) return null;

  const statItems = [
    {
      title: "Total Users",
      value: stats?.total_users ?? "-",
      icon: Users,
      description: "All registered members",
    },
    {
      title: "Pending Approvals",
      value: stats?.pending_approvals ?? "-",
      icon: Clock,
      description: "Requires action",
      highlight:
        (stats?.pending_approvals ?? 0) > 0
          ? "text-amber-500"
          : "text-zinc-500",
    },
    {
      title: "Approved Users",
      value: stats?.approved_users ?? "-",
      icon: ShieldCheck,
      description: "Fully verified members",
    },
    {
      title: "New This Week",
      value: stats?.recent_registrations_by_last_week ?? "-",
      icon: TrendingUp,
      description: "Recent registrations",
    },
    {
      title: "Music Division",
      value: stats?.music_users ?? "-",
      icon: Music,
      description: "Musicians & performers",
    },
    {
      title: "Management Division",
      value: stats?.management_users ?? "-",
      icon: Briefcase,
      description: "Organizers & planners",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {statItems.map((stat, index) => (
        <Card
          key={index}
          className={`rounded-none border-zinc-200 dark:border-zinc-800 shadow-none bg-background ${isError ? "opacity-50" : ""}`}
        >
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 truncate pr-2">
                {stat.title}
              </p>
              <stat.icon
                className={`h-4 w-4 shrink-0 ${stat.highlight || "text-zinc-400 dark:text-zinc-500"}`}
              />
            </div>
            <div>
              {isLoading ? (
                <div className="h-7 w-12 bg-zinc-100 dark:bg-zinc-800 animate-pulse mt-1 mb-1 rounded-none" />
              ) : (
                <div
                  className={`text-2xl font-bold ${stat.highlight || "text-zinc-950 dark:text-zinc-50"}`}
                >
                  {stat.value}
                </div>
              )}
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 truncate">
                {isError ? "Failed to load" : stat.description}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

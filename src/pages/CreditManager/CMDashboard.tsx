import { motion, type Variants } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  Coins,
  CircleDollarSign,
  CalendarRange,
  ArrowUpRight,
  Users,
  Music,
  AlertTriangle,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { useCMDashboard } from "@/hooks/useCMDashboard";
import { CreditStatsCard } from "@/components/credit-manager/CreditStatsCard";
import { EventCreditProgressList } from "@/components/credit-manager/EventCreditProgress";
import { RecentActivityFeed } from "@/components/credit-manager/RecentActivityFeed";

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: "easeOut" },
  },
};

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.18, ease: "easeOut" },
  },
};

export default function CMDashboard() {
  const navigate = useNavigate();
  const { username = "" } = useParams<{ username: string }>();
  const { dashboard, isLoading, isError, refresh } = useCMDashboard();

  const stats = dashboard?.stats;
  const eventsProgress = dashboard?.events_progress ?? [];
  const recentActivity = dashboard?.recent_activity ?? [];

  if (isLoading) {
    return (
      <motion.div variants={pageVariants} initial="hidden" animate="visible" className="space-y-6">
        <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 dark:border-gray-800 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-gray-400">Credit Manager</p>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-gray-100">Dashboard</h1>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div key={i} variants={itemVariants}>
              <div className="h-24 animate-pulse border border-zinc-200 bg-zinc-50 dark:border-gray-800 dark:bg-gray-800 rounded-none" />
            </motion.div>
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2 h-64 animate-pulse border border-zinc-200 bg-zinc-50 dark:border-gray-800 dark:bg-gray-800 rounded-none" />
          <div className="h-64 animate-pulse border border-zinc-200 bg-zinc-50 dark:border-gray-800 dark:bg-gray-800 rounded-none" />
        </div>
      </motion.div>
    );
  }

  if (isError || !dashboard) {
    return (
      <motion.div variants={pageVariants} initial="hidden" animate="visible" className="space-y-6">
        <Card className="rounded-none border-zinc-200 shadow-none dark:border-gray-800">
          <CardContent className="p-8 text-center text-sm text-red-600 dark:text-red-400">
            Failed to load dashboard data.
            <Button variant="outline" onClick={() => refresh()} className="ml-2 rounded-none">
              Retry
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 dark:border-gray-800 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-gray-400">Credit Manager</p>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-gray-100">Dashboard</h1>
          <p className="text-sm text-zinc-500 dark:text-gray-400">
            Overview of credit assignment activity, event progress, and pending work.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => refresh()} className="rounded-none border-zinc-300 dark:border-gray-700">
            Refresh
          </Button>
          <Button
            onClick={() => navigate(`/${username}/credit_manager/events`)}
            className="rounded-none bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            View Events
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <motion.div variants={itemVariants}>
          <CreditStatsCard
            title="Total Credits"
            value={stats?.total_credits?.toFixed(2) ?? "0.00"}
            icon={<Coins className="h-4 w-4" />}
            hint="Credits assigned across all events"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <CreditStatsCard
            title="Credited Registrations"
            value={stats?.credited_registrations ?? 0}
            icon={<CircleDollarSign className="h-4 w-4" />}
            hint="Registrations with assigned credits"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <CreditStatsCard
            title="Pending Assignments"
            value={stats?.pending_assignments ?? 0}
            icon={<AlertTriangle className="h-4 w-4" />}
            hint="Eligible members still uncredited"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <CreditStatsCard
            title="Active Events"
            value={stats?.active_events ?? 0}
            icon={<CalendarRange className="h-4 w-4" />}
            hint="Events in credit workflow"
          />
        </motion.div>
      </motion.div>

      <Separator className="my-4" />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="rounded-none border-zinc-200 shadow-none dark:border-gray-800 xl:col-span-2">
          <CardHeader className="border-b border-zinc-200 px-5 py-4 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold tracking-tight">Event Credit Progress</CardTitle>
              <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-gray-400">
                <span>Total events: {eventsProgress.length}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {eventsProgress.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 dark:text-gray-400">
                <CalendarRange className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No completed events found</p>
                <p className="text-xs mt-1">Events will appear here after they end</p>
              </div>
            ) : (
              <EventCreditProgressList
                events={eventsProgress}
                onEventClick={(event) => navigate(`/${username}/credit_manager/events/${event.event_uuid}/registrations`)}
              />
            )}
          </CardContent>
        </Card>

        <Card className="rounded-none border-zinc-200 shadow-none dark:border-gray-800">
          <CardHeader className="border-b border-zinc-200 px-5 py-4 dark:border-gray-800">
            <CardTitle className="text-base font-semibold tracking-tight">Eligible Members</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-4">
            <div className="border border-zinc-200 dark:border-gray-800 rounded-none p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-zinc-950 dark:text-gray-100">Management</span>
                </div>
                <span className="text-lg font-semibold text-zinc-950 dark:text-gray-100">
                  {stats?.total_management_members ?? 0}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-gray-400 mt-1">Eligible for all events without registration</p>
            </div>

            <div className="border border-zinc-200 dark:border-gray-800 rounded-none p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Music className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-medium text-zinc-950 dark:text-gray-100">Music</span>
                </div>
                <span className="text-lg font-semibold text-zinc-950 dark:text-gray-100">
                  {stats?.total_music_members ?? 0}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-gray-400 mt-1">Require event registration for credits</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <RecentActivityFeed activities={recentActivity} />
    </motion.div>
  );
}
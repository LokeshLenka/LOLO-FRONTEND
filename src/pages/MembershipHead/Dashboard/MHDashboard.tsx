// src/pages/membership-head/Dashboard.tsx
import { motion, type Variants } from "framer-motion"; // Imported Variants type
import { useMHDashboard } from "@/hooks/useMHDashboard";

import {
  Users,
  UserCheck,
  Clock,
  ShieldAlert,
  ShieldCheck,
  Briefcase,
  UserCog,
  RefreshCw,
  //   Chip,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "@/context/AuthContext";

// Explicitly typed as Variants to fix the TypeScript error
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "tween", ease: "easeOut", duration: 0.4 },
  },
};

export default function MHDashboard() {
  const { user, getPromotedRoleLabel } = useAuth();
  const { stats, loading, error, refreshStats } = useMHDashboard();

  if (loading) {
    return (
      <div className="flex h-full min-h-[50vh] items-center justify-center text-zinc-500">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          Loading dashboard...
        </motion.div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex flex-col h-full min-h-[50vh] items-center justify-center space-y-4 text-zinc-500">
        <p>{error || "Failed to load statistics."}</p>
        <Button
          variant="outline"
          onClick={refreshStats}
          className="rounded-none border-zinc-200 text-zinc-900 hover:bg-zinc-100"
        >
          Try Again
        </Button>
      </div>
    );
  }

  // Mapped exactly to your DashboardStats interface
  const kpiCards = [
    { title: "Pending Approvals", value: stats.pending_approvals, icon: Clock },
    { title: "Total Approvals", value: stats.total_approvals, icon: UserCheck },
    {
      title: "Assigned to Me",
      value: stats.assigned_user_count,
      icon: UserCog,
    },
    { title: "Total Active Users", value: stats.total_users, icon: Users },
  ];

  const roleCards = [
    { title: "Exec. Body Members", value: stats.total_ebms, icon: Briefcase },
    {
      title: "Membership Heads",
      value: stats.total_memberships,
      icon: ShieldAlert,
    },
    {
      title: "Credit Managers",
      value: stats.total_credit_managers,
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="space-y-8 px-4 py-6 pb-16">
      <motion.div
        // initial={{ opacity: 0, y: 10 }}
        // animate={{ opacity: 1, y: 0 }}
        // transition={{ duration: 0.8, delay: 0.2 }}
        className="flex items-center justify-between text-black dark:text-white"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {getPromotedRoleLabel()}
          </h1>
          <p className="text-sm mt-1">
            Welcome back, {user?.name}. Here is what's happening in your club.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={refreshStats}
          className="rounded-none h-9 px-3"
        >
          <RefreshCw className="mr-2 h-4 w-4 text-black dark:text-white" />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </motion.div>

      <h2 className="text-sm font-semibold tracking-wider text-zinc-900 dark:text-zinc-100 uppercase mb-4">
        Queue & Overview
      </h2>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {kpiCards.map((card, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <Card className="rounded-none border-zinc-200 dark:border-zinc-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-500">
                  {card.title}
                </CardTitle>
                <card.icon className="h-4 w-4 text-zinc-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-semibold text-zinc-950 dark:text-zinc-50">
                  {card.value}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <h2 className="text-sm font-semibold tracking-wider text-zinc-900 dark:text-zinc-100 uppercase mb-4">
        Analytics & Distribution
      </h2>
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        {/* Trend Chart */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="show"
          className="col-span-7 lg:col-span-4"
        >
          <Card className="rounded-none border-zinc-200 dark:border-zinc-800 h-full">
            <CardHeader>
              <CardTitle className="text-base font-medium text-zinc-900 dark:text-zinc-100">
                Approval Trend (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent className="pl-0">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={stats.approval_trend}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e4e4e7"
                    />
                    <XAxis
                      dataKey="date"
                      stroke="#a1a1aa"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", {
                          weekday: "short",
                        })
                      }
                    />
                    <YAxis
                      stroke="#a1a1aa"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 0,
                        border: "1px solid #e4e4e7",
                        boxShadow: "none",
                      }}
                      itemStyle={{ color: "#18181b" }}
                      labelStyle={{ color: "#71717a" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#03a1b0"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#03a1b0" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Roles Distribution */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="show"
          className="col-span-7 lg:col-span-3 flex flex-col gap-4 w-full"
        >
          {roleCards.map((card, idx) => (
            <Card
              key={idx}
              className="rounded-none border-zinc-200 dark:border-zinc-800 flex-1 flex flex-col justify-center"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-500">
                  {card.title}
                </CardTitle>
                <card.icon className="h-4 w-4 text-zinc-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
                  {card.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

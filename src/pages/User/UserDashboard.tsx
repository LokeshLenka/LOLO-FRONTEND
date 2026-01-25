// src/pages/UserDashboard.tsx
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardBody, Button, Chip, Spinner, Tooltip } from "@heroui/react";
import {
  TrendingUp,
  Ticket,
  Coins,
  ArrowRight,
  ShieldAlert,
  Clock,
  Calendar,
  TrendingDown,
  Award,
  Activity,
} from "lucide-react";
import { toast } from "sonner";

// --- Types from Backend API ---
interface CreditGrowthData {
  month: string;
  month_label: string;
  credits_earned: number;
  cumulative_total: number;
  assignment_count: number;
}

interface ProfileDetails {
  name: string;
  email: string;
  joined_at: string;
  is_active: boolean;
  role: string;
  sub_role: string | null;
  management_level: string;
  promoted_role: string | null;
}

interface Profile {
  details: ProfileDetails;
  approval: {
    status: string;
    approved_at: string | null;
  };
}

interface Analytics {
  credits: {
    balance: number;
    assignments_count: number;
    last_earned: string | null;
    growth_timeline: CreditGrowthData[];
  };
  events: {
    total_registered: number;
    confirmed: number;
    pending_payment_count: number;
  };
  security: {
    last_login: string | null;
    recent_failed_attempts: number;
    account_risk: "HIGH" | "LOW";
  };
}

interface DashboardData {
  profile: Profile;
  analytics: Analytics;
}

interface User {
  username: string;
  name: string;
  email: string;
  uuid: string;
  role: string;
}

// --- Components ---
const StatCard = ({
  icon: Icon,
  label,
  value,
  subValue,
  trend,
  colorClass,
}: any) => (
  <Card
    shadow="none"
    className="border border-black/5 dark:border-white/5 bg-black/1 dark:bg-white/1 backdrop-blur-sm rounded-2xl h-full hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
  >
    <CardBody className="p-5 flex flex-col justify-between h-full">
      <div className="flex justify-between items-start">
        <div
          className={`p-3 rounded-xl ${colorClass} bg-opacity-10 text-opacity-100 transition-transform duration-300 hover:scale-110`}
        >
          {/* <Icon size={24} className={colorClass.replace("text-", "bg-")} /> */}
          <Icon size={24} className="text-white" />
        </div>
        {trend && (
          <Chip
            size="sm"
            variant="flat"
            color="success"
            className="text-xs font-bold rounded-full"
          >
            +{trend}%
          </Chip>
        )}
      </div>
      <div className="mt-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          {label}
        </p>
        <h4 className="text-3xl font-black text-black dark:text-white mt-1">
          {value}
        </h4>
        {subValue && (
          <p className="text-xs font-medium text-gray-500 mt-1">{subValue}</p>
        )}
      </div>
    </CardBody>
  </Card>
);

const getUserFromStorage = (): User | null => {
  const raw = localStorage.getItem("user");
  return raw ? (JSON.parse(raw) as User) : null;
};

// Enhanced Credit Growth Chart Component
const CreditGrowthChart = ({ data }: { data: CreditGrowthData[] }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"earned" | "cumulative">(
    "cumulative",
  );

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400">
        <div className="text-center">
          <Activity size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">No credit history available yet</p>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(
    ...data.map((d) =>
      viewMode === "earned" ? d.credits_earned : d.cumulative_total,
    ),
  );

  // Calculate growth percentage
  const firstValue = data[0]?.cumulative_total || 0;
  const lastValue = data[data.length - 1]?.cumulative_total || 0;
  const growthPercentage =
    firstValue > 0
      ? (((lastValue - firstValue) / firstValue) * 100).toFixed(1)
      : 0;

  return (
    <div className="space-y-4">
      {/* Header with Toggle */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Chip
            size="sm"
            variant="flat"
            className={`font-bold cursor-pointer transition-all ${
              viewMode === "cumulative"
                ? "bg-[#03a1b0]/20 text-[#03a1b0]"
                : "bg-gray-100 dark:bg-white/5"
            }`}
            onClick={() => setViewMode("cumulative")}
          >
            Cumulative
          </Chip>
          <Chip
            size="sm"
            variant="flat"
            className={`font-bold cursor-pointer transition-all ${
              viewMode === "earned"
                ? "bg-purple-500/20 text-purple-600 dark:text-purple-400"
                : "bg-gray-100 dark:bg-white/5"
            }`}
            onClick={() => setViewMode("earned")}
          >
            Monthly
          </Chip>
        </div>

        {viewMode === "cumulative" && (
          <Chip
            size="sm"
            variant="flat"
            color={Number(growthPercentage) >= 0 ? "success" : "danger"}
            startContent={
              Number(growthPercentage) >= 0 ? (
                <TrendingUp size={12} />
              ) : (
                <TrendingDown size={12} />
              )
            }
            className="font-bold"
          >
            {growthPercentage}%
          </Chip>
        )}
      </div>

      {/* Chart */}
      <div className="relative">
        <div className="flex items-end gap-1.5 md:gap-2 h-48 w-full">
          {data.map((item, i) => {
            const value =
              viewMode === "earned"
                ? item.credits_earned
                : item.cumulative_total;
            const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
            const isHovered = hoveredIndex === i;

            return (
              <Tooltip
                key={i}
                content={
                  <div className="p-2 space-y-1">
                    <p className="font-bold text-xs">{item.month_label}</p>
                    <div className="text-[10px] space-y-0.5">
                      <p>
                        Earned: <strong>{item.credits_earned} LP</strong>
                      </p>
                      <p>
                        Total: <strong>{item.cumulative_total} LP</strong>
                      </p>
                      <p>
                        Assignments: <strong>{item.assignment_count}</strong>
                      </p>
                    </div>
                  </div>
                }
                placement="top"
                className="backdrop-blur-sm"
              >
                <div
                  className="w-full flex flex-col justify-end group relative h-full cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Bar */}
                  <div
                    className={`w-full rounded-t-lg transition-all duration-300 relative overflow-hidden ${
                      viewMode === "earned"
                        ? "bg-gradient-to-t from-purple-500 to-purple-400"
                        : "bg-gradient-to-t from-[#03a1b0] to-cyan-400"
                    } ${
                      isHovered
                        ? "opacity-100 shadow-lg"
                        : "opacity-60 group-hover:opacity-90"
                    }`}
                    style={{ height: `${height}%` }}
                  >
                    {/* Animated shine effect */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-transparent via-white/30 to-transparent transition-opacity duration-300 ${
                        isHovered ? "opacity-100" : "opacity-0"
                      }`}
                    />

                    {/* Value label on hover */}
                    {isHovered && height > 20 && (
                      <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white drop-shadow-md whitespace-nowrap">
                        {value} LP
                      </span>
                    )}
                  </div>

                  {/* Indicator dot for non-zero values */}
                  {value > 0 && !isHovered && (
                    <div
                      className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-1.5 h-1.5 rounded-full ${
                        viewMode === "earned" ? "bg-purple-500" : "bg-[#03a1b0]"
                      } opacity-0 group-hover:opacity-100 transition-opacity`}
                    />
                  )}
                </div>
              </Tooltip>
            );
          })}
        </div>

        {/* X-axis labels - Show every other month or first/last */}
        <div className="flex justify-between mt-3 px-1">
          {data.map((item, i) => {
            const showLabel =
              i === 0 ||
              i === data.length - 1 ||
              (data.length <= 6 && i % 1 === 0) ||
              (data.length > 6 && i % 2 === 0);

            return (
              <div
                key={i}
                className="flex-1 text-center"
                style={{ maxWidth: `${100 / data.length}%` }}
              >
                {showLabel && (
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                    {item.month_label}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-black/5 dark:border-white/5">
        <div className="text-center p-2 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-700/30">
          <p className="text-[10px] text-gray-600 dark:text-gray-400 font-bold uppercase">
            This Month
          </p>
          <p className="text-lg font-black text-[#03a1b0] mt-0.5">
            {data[data.length - 1]?.credits_earned || 0}
          </p>
        </div>
        <div className="text-center p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700/30">
          <p className="text-[10px] text-gray-600 dark:text-gray-400 font-bold uppercase">
            Avg/Month
          </p>
          <p className="text-lg font-black text-purple-600 dark:text-purple-400 mt-0.5">
            {Math.round(
              data.reduce((sum, d) => sum + d.credits_earned, 0) / data.length,
            )}
          </p>
        </div>
        <div className="text-center p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/30">
          <p className="text-[10px] text-gray-600 dark:text-gray-400 font-bold uppercase">
            Total
          </p>
          <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
            {data[data.length - 1]?.cumulative_total || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Main Dashboard ---
export default function UserDashboard() {
  const { username } = useParams();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState("");

  const QUOTES = [
    "Music gives a soul to the universe, wings to the mind, flight to the imagination.",
    "Where words fail, music speaks.",
    "Life is like a beautiful melody, only the lyrics are messed up.",
    "Music is the divine way to tell beautiful, poetic things to the heart.",
    "Without music, life would be a mistake.",
  ];

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch real dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!username) return;

      try {
        const localStoredRole = getUserFromStorage()?.role;
        console.log("Local role:", localStoredRole);

        let role = localStoredRole;

        if (!role) {
          const roleResponse = await axios.get(`${API_BASE_URL}/my-role`);
          role = roleResponse.data.role;
        }

        const dashboardResponse = await axios.get(
          `${API_BASE_URL}/${role}/dashboard`,
        );

        setData(dashboardResponse.data.data);
        console.log("Dashboard data fetched:", dashboardResponse.data.data);
      } catch (error: any) {
        console.error("Dashboard fetch error:", error);
        toast.error(
          error.response?.data?.message || "Failed to load dashboard",
        );
      } finally {
        setLoading(false);
        toast.dismiss();
      }
    };

    fetchDashboardData();
  }, [username, API_BASE_URL]);

  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-[#03a1b0]"></div>
        <p className="pl-4 text-[#03a1b0]">Loading dashboard...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <ShieldAlert size={64} className="text-gray-400 mx-auto" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Dashboard Unavailable
            </h2>
            <p className="text-gray-500">Unable to load your dashboard data.</p>
          </div>
        </div>
      </div>
    );
  }

  const profile = data.profile.details;
  const analytics = data.analytics;
  const credits = analytics.credits.balance;

  return (
    <section className="w-full min-h-screen py-4 md:py-6 lg:py-8 px-0 sm:px-16 mx-auto space-y-6 md:space-y-8">
      {/* 1. Welcome & Quote Section */}
      <div className="flex flex-col gap-4 md:gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-4xl font-semibold text-black dark:text-white tracking-tight truncate">
              Hi, {profile.name}
              {/* 👋 */}
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
              <span className="text-gray-500 text-xs sm:text-sm font-medium capitalize">
                {profile.role.replace("_", " ")}
              </span>
              {profile.promoted_role && (
                <>
                  <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block" />
                  <span className="text-amber-600 dark:text-amber-400 font-bold text-xs sm:text-sm truncate bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-md capitalize">
                    {profile.promoted_role.replace("_", " ")}
                  </span>
                </>
              )}
              {profile.sub_role && (
                <Chip
                  size="sm"
                  color="secondary"
                  variant="flat"
                  className="text-xs capitalize"
                >
                  {profile.sub_role.replace("_", " ")}
                </Chip>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
              <Calendar size={14} />
              {profile.is_active ? "Active" : "Inactive"} • Joined{" "}
              {new Date(profile.joined_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <Button
            as={Link}
            to="/events"
            className="bg-black/90 dark:bg-white text-white dark:text-black font-bold px-4  h-10 sm:h-12 rounded-lg hover:scale-105 transition-all"
          >
            Find Events
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Button>
        </div>

        {/* Quote Banner */}
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="col-span-1">
          <StatCard
            icon={Coins}
            label="Lifetime Credits"
            value={credits.toLocaleString() + " LP"}
            subValue={`${analytics.credits.assignments_count} assignments`}
            colorClass="bg-[#03a1b0]"
          />
        </div>
        <div className="col-span-1">
          <StatCard
            icon={Ticket}
            label="Event Registrations"
            value={analytics.events.total_registered}
            subValue={`${analytics.events.confirmed} confirmed`}
            colorClass="bg-purple-500"
          />
        </div>
        <div className="col-span-1">
          <StatCard
            icon={Clock}
            label="Pending Payments"
            value={analytics.events.pending_payment_count}
            subValue="Complete to earn credits"
            colorClass="bg-amber-500"
          />
        </div>
      </div>

      {/* 3. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {/* Credit Growth Chart */}
          <Card
            shadow="none"
            className="border border-black/5 dark:border-white/5 bg-black/1 dark:bg-white/1 backdrop-blur-sm rounded-2xl overflow-hidden hover:shadow-lg transition-all"
          >
            <CardBody className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-black dark:text-white flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
                    <TrendingUp size={20} className="text-[#03a1b0]" />
                  </div>
                  Credit Growth
                </h3>
                <Chip
                  size="sm"
                  variant="flat"
                  startContent={<Calendar size={12} />}
                  className="font-bold bg-[#03a1b0]/10 text-[#03a1b0]"
                >
                  Last 12 Months
                </Chip>
              </div>

              <CreditGrowthChart data={analytics.credits.growth_timeline} />
            </CardBody>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6 md:space-y-8 text-gray-900 dark:text-white">
          {/* Profile Quick Stats */}
          <Card
            shadow="none"
            className="border border-black/5 dark:border-white/5 bg-black/1 dark:bg-white/1 backdrop-blur-sm rounded-2xl hover:shadow-lg hover:scale-[1.02] transition-all"
          >
            <CardBody className="p-6">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                Profile Status{" "}
                <Chip
                  size="sm"
                  color={
                    data.profile.approval.status === "admin_approved"
                      ? "success"
                      : "warning"
                  }
                >
                  {data.profile.approval.status.replace("_", " ")}
                </Chip>
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Email
                  </span>
                  <span className="font-medium truncate ml-2">
                    {profile.email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Management Level
                  </span>
                  <span className="capitalize font-medium">
                    {profile.management_level}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Status
                  </span>
                  <span
                    className={`font-medium ${
                      profile.is_active ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {profile.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <Button
                as={Link}
                to={`/${username}/profile`}
                className="w-full mt-6 bg-[#03a1b0] text-white font-bold h-11 rounded-lg hover:scale-105 transition-all group"
              >
                View Full Profile
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Button>
            </CardBody>
          </Card>

          {/* Last Activity Card */}
          {analytics.credits.last_earned && (
            <Card
              shadow="none"
              className="border border-black/5 dark:border-white/5 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/10 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg "
            >
              <CardBody className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                    <Award
                      size={20}
                      className="text-emerald-600 dark:text-emerald-400"
                    />
                  </div>
                  <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-100">
                    Last Credit Earned
                  </h4>
                </div>
                <p className="text-xs text-emerald-800 dark:text-emerald-200 font-mono">
                  {new Date(analytics.credits.last_earned).toLocaleString(
                    "en-US",
                    {
                      dateStyle: "medium",
                      timeStyle: "short",
                    },
                  )}
                </p>
              </CardBody>
            </Card>
          )}
        </div>
      </div>

      {/* 4. Security Alert */}
      {analytics.security.account_risk === "HIGH" && (
        <Card
          shadow="none"
          className="border-l-4 border-red-500 bg-gradient-to-r from-red-50 to-red-50/50 dark:from-red-900/20 dark:to-red-900/10 border border-red-200 dark:border-red-800 backdrop-blur-sm hover:shadow-lg transition-all rounded-2xl sm:w-[50%] w-full "
        >
          <CardBody className="flex items-start gap-4 p-6">
            <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30 shrink-0">
              <ShieldAlert size={28} className="text-red-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-lg text-red-900 dark:text-red-100">
                  Security Alert
                </h3>
                <Chip size="sm" color="danger" variant="flat">
                  Action Required
                </Chip>
              </div>
              <p className="text-sm text-red-800 dark:text-red-200 mb-2">
                <strong>{analytics.security.recent_failed_attempts}</strong>{" "}
                failed login attempts detected in the last 7 days.
              </p>
              <p className="text-xs text-red-700 dark:text-red-300 flex items-center gap-1">
                <Clock size={12} />
                Last login:{" "}
                {analytics.security.last_login
                  ? new Date(analytics.security.last_login).toLocaleString(
                      "en-US",
                      {
                        dateStyle: "medium",
                        timeStyle: "short",
                      },
                    )
                  : "Never"}
              </p>
            </div>
          </CardBody>
        </Card>
      )}
    </section>
  );
}

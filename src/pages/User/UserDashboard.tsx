import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardBody,
  Button,
  Chip,
  Progress,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
} from "@heroui/react";
import {
  TrendingUp,
  Ticket,
  Coins,
  Calendar,
  ArrowRight,
  Activity,
  Trophy,
  Star,
  Zap,
  Music,
  ShieldAlert,
  Info,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

// --- Types from Backend API ---
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

// --- Rank System (Same as before) ---
const RANKS = [
  {
    name: "Bronze",
    min: 0,
    max: 49,
    color: "text-orange-800 dark:text-orange-400",
    bg: "bg-orange-100 dark:bg-orange-900/40",
    border: "border-orange-200 dark:border-orange-700/50",
  },
  {
    name: "Silver",
    min: 50,
    max: 99,
    color: "text-slate-700 dark:text-slate-300",
    bg: "bg-slate-100 dark:bg-slate-800/50",
    border: "border-slate-200 dark:border-slate-600/50",
  },
  {
    name: "Gold",
    min: 100,
    max: 149,
    color: "text-yellow-800 dark:text-yellow-400",
    bg: "bg-yellow-100 dark:bg-yellow-900/40",
    border: "border-yellow-200 dark:border-yellow-700/50",
  },
  {
    name: "Platinum",
    min: 150,
    max: 10000,
    color: "text-cyan-800 dark:text-cyan-300",
    bg: "bg-cyan-100 dark:bg-cyan-900/40",
    border: "border-cyan-200 dark:border-cyan-700/50",
  },
];

const getRankInfo = (credits: number) => {
  const rank =
    RANKS.find((r) => credits >= r.min && credits <= r.max) ||
    RANKS[RANKS.length - 1];
  const nextRank = RANKS[RANKS.indexOf(rank) + 1];
  let progress = 100;
  let nextGoal = 0;

  if (nextRank) {
    const range = rank.max - rank.min;
    const current = credits - rank.min;
    progress = (current / range) * 100;
    nextGoal = nextRank.min;
  }

  return { current: rank, next: nextRank, progress, nextGoal };
};

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
    className="border border-black/5 dark:border-white/5 bg-black/1 dark:bg-white/1 backdrop-blur-lg rounded-2xl h-full hover:shadow-lg transition-all duration-300 hover:scale-105"
  >
    <CardBody className="p-5 flex flex-col justify-between h-full ">
      <div className="flex justify-between items-start">
        <div
          className={`p-3 rounded-md ${colorClass} bg-opacity-10 text-opacity-100`}
        >
          <Icon size={24} className={colorClass.replace("bg-", "text-")} />
        </div>
        {trend && (
          <Chip
            size="sm"
            variant="flat"
            color="success"
            className="text-xs font-bold rounded-2xl"
          >
            +{trend}%
          </Chip>
        )}
      </div>
      <div className="mt-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          {label}
        </p>
        <h4 className={`text-3xl font-black text-black dark:text-white mt-1`}>
          {value}
        </h4>
        {subValue && (
          <p className="text-xs font-medium text-gray-500 mt-1">{subValue}</p>
        )}
      </div>
    </CardBody>
  </Card>
);

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
  ];

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch real dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!username) return;

      try {
        const response = await axios.get(`${API_BASE_URL}/dashboard`);
        setData(response.data.data);
      } catch (error: any) {
        console.error("Dashboard fetch error:", error);
        toast.error(
          error.response?.data?.message || "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [username]);

  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <Spinner size="lg" color="primary" />
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
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
            <p className="text-sm text-gray-500 mt-2">
              {profile.is_active ? "Active" : "Inactive"} • Joined{" "}
              {new Date(profile.joined_at).toLocaleDateString()}
            </p>
          </div>
          <Button
            as={Link}
            to="/events"
            className="bg-black dark:bg-white text-white dark:text-black font-bold px-4 sm:px-6 h-10 sm:h-12 rounded-md shadow-lg hover:scale-105 transition-transform text-sm sm:text-base whitespace-nowrap shrink-0"
          >
            Find Events <ArrowRight size={16} />
          </Button>
        </div>

        {/* Quote Banner */}
        <div className="p-4 md:p-6 rounded-sm bg-gradient-to-r from-[#03a1b0]/10 to-transparent border-l-4 border-[#03a1b0] flex gap-4 items-center">
          <Music size={24} className="text-[#03a1b0] shrink-0 opacity-50" />
          <p className="text-sm md:text-base font-serif italic text-gray-700 dark:text-gray-300">
            "{quote}"
          </p>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="col-span-1">
          <StatCard
            icon={Coins}
            label="Lifetime Credits"
            value={analytics.credits.balance.toLocaleString() + " LP"}
            subValue={`+${analytics.credits.assignments_count} assignments`}
            colorClass="bg-[#03a1b0] text-cyan-100 dark:text-cyan-900"
          />
        </div>
        <div className="col-span-1">
          <StatCard
            icon={Ticket}
            label="Event Registrations"
            value={analytics.events.total_registered}
            subValue={`${analytics.events.confirmed} confirmed`}
            colorClass="bg-purple-500 text-white dark:text-purple-900"
          />
        </div>
        <div className="col-span-1">
          <StatCard
            icon={Clock}
            label="Pending Payments"
            value={analytics.events.pending_payment_count}
            subValue="Complete payment to earn credits"
            colorClass="bg-amber-500 text-white dark:text-amber-900"
          />
        </div>
      </div>

      {/* 3. Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {/* Credit Growth Chart (Static for now) */}
          <Card className="border border-black/5 dark:border-white/5 bg-black/1 dark:bg-white/1 backdrop-blur-xl rounded-2xl p-2 hover:scale-105 transition-all duration-300 hover:shadow-lg">
            <CardBody className="p-6">
              <div className="flex justify-between items-center mb-6 text-gray-900 dark:text-white">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <TrendingUp size={20} className="text-[#03a1b0]" />
                  Credit Growth
                </h3>
                <Chip size="sm" variant="flat" className="font-bold rounded-md">
                  Lifetime
                </Chip>
              </div>
              <div className="flex items-end gap-2 md:gap-4 h-32 w-full">
                {/* Simple static bars - replace with real chart later */}
                {[0, 10, 25, 40, 30, 50, credits].map((val, i) => (
                  <div
                    key={i}
                    className="w-full flex flex-col justify-end group relative h-full"
                  >
                    <div
                      className="w-full bg-[#03a1b0] rounded-t-md opacity-40 group-hover:opacity-100 transition-all duration-300 relative"
                      style={{ height: `${Math.min((val / 100) * 100, 100)}%` }}
                    />
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6 md:space-y-8 text-gray-900 dark:text-white">
          {/* Profile Quick Stats */}
          <Card className="border border-black/5 dark:border-white/5 bg-black/1 dark:bg-white/1 backdrop-blur-xl rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-300">
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
                  <span className="font-medium">{profile.email}</span>
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
                variant="light"
                className="w-full mt-6 font-bold text-xs uppercase tracking-widest hover:text-[#03a1b0] rounded-md"
              >
                View Profile
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* 4. Security Alert */}
      {analytics.security.account_risk === "HIGH" && (
        <Card className="border-l-4 border-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 sm:w-[50%] w-full rounded-2xl">
          <CardBody className="flex items-start gap-4 p-6">
            <div>
              <h3 className="font-bold text-lg text-red-900 dark:text-red-100 mb-1">
                <ShieldAlert
                  size={32}
                  className="text-red-500 mt-0.5 shrink-0"
                />
                Security Alert
              </h3>
              <p className="text-sm text-red-800 dark:text-red-200">
                {analytics.security.recent_failed_attempts} failed login
                attempts in last 7 days.
              </p>
              <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                Last login:{" "}
                {analytics.security.last_login
                  ? new Date(analytics.security.last_login).toLocaleString()
                  : "Never"}
              </p>
            </div>
          </CardBody>
        </Card>
      )}
    </section>
  );
}

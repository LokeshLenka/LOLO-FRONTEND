import * as React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  Button,
  Avatar,
  Chip,
  Progress,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
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
  Info,
  Medal,
} from "lucide-react";
import type { ClassNames } from "@emotion/react";

// --- Constants & Types ---

const QUOTES = [
  "Music gives a soul to the universe, wings to the mind, flight to the imagination.",
  "Where words fail, music speaks.",
  "Life is like a beautiful melody, only the lyrics are messed up.",
  "Music is the divine way to tell beautiful, poetic things to the heart.",
];

const RANKS = [
  {
    name: "Bronze",
    min: 0,
    max: 49,
    // Light Mode: Text-Orange-800 / Dark Mode: Text-Orange-400
    color: "text-orange-800 dark:text-orange-400",
    // Light Mode: bg-orange-100 / Dark Mode: bg-orange-900/40
    bg: "bg-orange-100 dark:bg-orange-900/40",
    border: "border-orange-200 dark:border-orange-700/50",
  },
  {
    name: "Silver",
    min: 50,
    max: 99,
    // Light Mode: Text-Slate-700 / Dark Mode: Text-Slate-300
    color: "text-slate-700 dark:text-slate-300",
    // Light Mode: bg-slate-100 / Dark Mode: bg-slate-800/50
    bg: "bg-slate-100 dark:bg-slate-800/50",
    border: "border-slate-200 dark:border-slate-600/50",
  },
  {
    name: "Gold",
    min: 100,
    max: 149,
    // Light Mode: Text-Yellow-800 / Dark Mode: Text-Yellow-400
    color: "text-yellow-800 dark:text-yellow-400",
    // Light Mode: bg-yellow-100 / Dark Mode: bg-yellow-900/40
    bg: "bg-yellow-100 dark:bg-yellow-900/40",
    border: "border-yellow-200 dark:border-yellow-700/50",
  },
  {
    name: "Platinum",
    min: 150,
    max: 10000,
    // Light Mode: Text-Cyan-800 / Dark Mode: Text-Cyan-300
    color: "text-cyan-800 dark:text-cyan-300",
    // Light Mode: bg-cyan-100 / Dark Mode: bg-cyan-900/40
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

const MOCK_USER_CREDITS = 99;

const MOCK_DATA = {
  user: {
    name: "Bhavya Sree",
    role: "Management",
    promoted_role: "Executive Body Member",
    avatar_url:
      "https://ui-avatars.com/api/?name=Alex+Rhythm&background=03a1b0&color=fff",
  },
  stats: {
    total_credits: MOCK_USER_CREDITS,
    credits_trend: 15,
    events_attended: 12,
    profile_completion: 85,
  },
  upcoming_event: {
    id: "evt-1",
    name: "Winter Jazz Fest 2025",
    date: "Dec 12, 2025 • 6:00 PM",
    image: "https://picsum.photos/seed/jazz/800/400",
  },
  recent_credits: [
    { id: 1, event_name: "Battle of Bands", amount: 50, date: "2d ago" },
    { id: 2, event_name: "Tech Talk Org", amount: 30, date: "1w ago" },
    { id: 3, event_name: "Guitar Workshop", amount: 20, date: "2w ago" },
  ],
  credit_history: [40, 65, 50, 80, 95, 120, 150],
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
    className="border border-black/5 dark:border-white/5 bg-white/60 dark:bg-white/5 backdrop-blur-lg rounded-2xl h-full"
  >
    <CardBody className="p-5 flex flex-col justify-between h-full">
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

const RankProgressCard = ({
  credits,
  onPress,
}: {
  credits: number;
  onPress: () => void;
}) => {
  const { current, next, progress, nextGoal } = getRankInfo(credits);
  const isPlatinum = current.name === "Platinum";

  // Animation State
  const [animatedProgress, setAnimatedProgress] = React.useState(0);

  React.useEffect(() => {
    // Delay slightly to allow component to mount, then animate to target
    const timer = setTimeout(() => setAnimatedProgress(progress), 100);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <Card
      isPressable
      onPress={onPress}
      className={`border-none w-full shadow-xl text-white rounded-2xl overflow-hidden relative h-full cursor-pointer hover:scale-[1.01] transition-transform ${
        isPlatinum
          ? "bg-gradient-to-br from-cyan-600 to-blue-700"
          : "bg-gradient-to-br from-gray-900 to-gray-800"
      }`}
    >
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

      <CardBody className="p-6 md:p-8 relative z-10 flex flex-col justify-between h-full">
        <div className="absolute top-4 right-4">
          <Info size={20} />
        </div>
        <div className="flex justify-between items-start mb-4 ">
          <div>
            <p className="text-xs font-bold uppercase opacity-70 mb-1">
              Current Rank
            </p>
            <h3 className="text-3xl font-black tracking-tight">
              {current.name}
            </h3>
          </div>
          <Trophy size={40} className="opacity-20 rotate-12 mr-10" />
          {/* <Medal size={40} className="opacity-20 -rotate-12 mr-10" /> */}
        </div>

        {!isPlatinum ? (
          <div className="mt-auto">
            <div className="flex justify-between text-sm font-bold mb-2">
              <span>{credits} pts</span>
              <span className="opacity-70">
                {nextGoal} pts ({next?.name})
              </span>
            </div>
            <Progress
              value={animatedProgress}
              classNames={{
                indicator:
                  "bg-white transition-all duration-1000 ease-out rounded-full",
                track: "bg-white/20 rounded-full",
              }}
              size="md"
              className="mb-3 rounded-full"
              radius="full"
            />
            <p className="text-xs opacity-80">
              Earn{" "}
              <span className="font-bold">
                {nextGoal - credits} more credits
              </span>{" "}
              to reach next tier.
            </p>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-md border border-white/20 flex gap-4 items-center mt-auto">
            <div className="p-3 bg-white text-cyan-600 rounded-full shadow-lg shrink-0">
              <Music size={20} fill="currentColor" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Band Invite Unlocked!</h4>
              <p className="text-[10px] opacity-90">
                You are eligible for the University Band.
              </p>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

// --- Main Dashboard ---

export default function UserDashboard() {
  const [quote, setQuote] = React.useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { user, stats, upcoming_event, recent_credits, credit_history } =
    MOCK_DATA;

  React.useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  return (
    <section className="w-full min-h-screen py-4 md:py-6 lg:py-8 px-0 sm:px-16 mx-auto space-y-6 md:space-y-8">
      {/* 1. Welcome & Quote Section */}
      <div className="flex flex-col gap-4 md:gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          {/* ... inside the User Info div ... */}
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-4xl font-semibold text-black dark:text-white tracking-tight truncate">
              Hi, {user.name.split(" ")[0]}
            </h1>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
              <span className="text-gray-500 text-xs sm:text-sm font-medium">
                {user.role}
              </span>

              {user.promoted_role && (
                <>
                  {/* Replaced dot with a vertical divider line */}
                  <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block" />

                  {/* On mobile, it might wrap, so we hide the divider and just use spacing or a new line */}
                  <span className="text-amber-600 dark:text-amber-400 font-bold text-xs sm:text-sm truncate bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-md">
                    {user.promoted_role}
                  </span>
                </>
              )}
            </div>
          </div>

          <Button
            as={Link}
            to="/events"
            className="bg-black dark:bg-white text-white dark:text-black font-bold px-4 sm:px-6 h-10 sm:h-12 rounded-md shadow-lg hover:scale-105 transition-transform text-sm sm:text-base whitespace-nowrap shrink-0"
          >
            Find Events <ArrowRight size={16} />
          </Button>
        </div>

        {/* Random Quote Banner */}
        <div className="p-4 md:p-6 rounded-sm bg-gradient-to-r from-[#03a1b0]/10 to-transparent border-l-4 border-[#03a1b0] flex gap-4 items-center">
          <Music size={24} className="text-[#03a1b0] shrink-0 opacity-50" />
          <p className="text-sm md:text-base font-serif italic text-gray-700 dark:text-gray-300">
            "{quote}"
          </p>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* 
           MOBILE: All cards (including Rank) are col-span-1 (Standard Size)
           DESKTOP (lg): Rank card expands to col-span-2
        */}
        <div className="col-span-1">
          <StatCard
            icon={Coins}
            label="Total Credits"
            value={stats.total_credits + " LP "}
            subValue="Lifetime Earnings"
            // trend={stats.credits_trend}
            colorClass="bg-[#03a1b0] text-cyan-100 dark:text-cyan-900 "
          />
        </div>
        <div className="col-span-1">
          <StatCard
            icon={Ticket}
            label="Events Attended"
            value={stats.events_attended}
            subValue="Active Participant"
            colorClass="bg-purple-500 text-white dark:text-purple-900"
          />
        </div>

        <div className="col-span-1 sm:col-span-2 lg:col-span-2">
          <RankProgressCard credits={stats.total_credits} onPress={onOpen} />
        </div>
      </div>

      {/* 3. Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* LEFT COLUMN (2/3) */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {/* Chart Area */}
          <Card className="border border-black/5 dark:border-white/5 bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-2">
            <CardBody className="p-6">
              <div className="flex justify-between items-center mb-6 text-gray-900 dark:text-white">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <TrendingUp size={20} className="text-[#03a1b0]" />
                  Credit Growth
                </h3>
                <Chip size="sm" variant="flat" className="font-bold rounded-md">
                  Last 7 Months
                </Chip>
              </div>
              {/* Simple Bar Chart */}
              <div className="flex items-end gap-2 md:gap-4 h-32 w-full">
                {credit_history.map((val, i) => (
                  <div
                    key={i}
                    className="w-full flex flex-col justify-end group relative h-full"
                  >
                    <div
                      className="w-full bg-[#03a1b0] rounded-t-md opacity-40 group-hover:opacity-100 transition-all duration-300 relative"
                      style={{ height: `${(val / 150) * 100}%` }}
                    ></div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Featured Event */}
          <div>
            <h3 className="text-lg font-bold mb-4 ml-1 text-gray-900 dark:text-white">
              Recommended For You
            </h3>
            <div className="relative group rounded-2xl overflow-hidden shadow-2xl aspect-[16/7]">
              <img
                src={upcoming_event.image}
                alt="Event"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <Chip
                    size="sm"
                    color="danger"
                    variant="shadow"
                    classNames={{ base: "font-bold rounded-md" }}
                  >
                    Featured
                  </Chip>
                  <span className="text-sm font-medium flex items-center gap-1 opacity-90 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-md">
                    <Calendar size={14} /> {upcoming_event.date}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black mb-4">
                  {upcoming_event.name}
                </h2>
                <Button className="bg-white text-black font-bold rounded-md px-6">
                  Register Now
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (1/3) */}
        <div className="space-y-6 md:space-y-8 text-gray-900 dark:text-white">
          {/* Recent Activity */}
          <Card className="border border-black/5 dark:border-white/5 bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden">
            <CardBody className="p-6">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Activity size={20} className="text-orange-500" /> Recent
                Activity
              </h3>
              <div className="space-y-6 relative">
                <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-white/10 z-10"></div>
                {recent_credits.map((credit) => (
                  <div
                    key={credit.id}
                    className="flex items-center justify-between group relative"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-black border-4 border-gray-50 dark:border-gray-900 flex items-center justify-center text-[#03a1b0] shadow-sm z-10">
                        <Zap size={16} fill="currentColor" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-black dark:text-white">
                          {credit.event_name}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">
                          {credit.date}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-black text-green-500 bg-green-500/10 px-2 py-1 rounded-md">
                      +{credit.amount}
                    </span>
                  </div>
                ))}
              </div>
              <Button
                as={Link}
                to="credits"
                variant="light"
                className=" w-full mt-5 text-gray-400 font-bold text-xs uppercase tracking-widest hover:text-[#03a1b0] rounded-md"
              >
                View All History
              </Button>
            </CardBody>
          </Card>

          {/* Bonus Card */}
          <Card className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white border-none shadow-2xl shadow-purple-500/30 rounded-2xl overflow-hidden ">
            <div className="absolute -right-4 -top-4 bg-white/10 w-24 h-24 rounded-full blur-xl"></div>
            <CardBody className="p-8 text-center relative z-10 flex flex-col items-center justify-center min-h-[200px]">
              <div className="mb-4 p-4 bg-white/10 rounded-full backdrop-blur-md border border-white/20 shadow-lg">
                <Star size={32} className="text-yellow-300 fill-yellow-300" />
              </div>
              <h3 className="text-xl font-black mb-2">You're on fire! 🔥</h3>
              <p className="text-sm opacity-90 leading-relaxed mb-6">
                Attend <b>1 more event</b> this month to unlock the "Dedicated"
                badge.
              </p>
              <Button
                size="sm"
                className="bg-white text-purple-600 font-bold px-8 py-5 rounded-md shadow-lg hover:scale-105 transition-transform"
              >
                See Rewards
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* --- Rank Info Modal --- */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        size="lg"
        hideCloseButton={true}
        classNames={{
          backdrop: "bg-black/60 backdrop-blur-sm z-[999999]",
          wrapper:
            "z-[1000000] flex items-end sm:items-center px-2 sm:px-0 mb-2",
          base: "dark:bg-[#0F111A] bg-white border border-black/5 dark:border-white/10 shadow-2xl rounded-2xl z-[1000001] relative w-full sm:w-auto max-h-[90vh] sm:max-h-none",
        }}
        className="overflow-hidden bg-white/20 !text-gray-900 dark:bg-black/50 dark:!text-gray-100 backdrop-blur-md border border-gray-400 dark:border-white/10 shadow-2xl"
      >
        <ModalContent className="max-h-[90vh] sm:max-h-none overflow-y-auto">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-3 border-b border-gray-200 dark:border-white/5 pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
                <h3 className="text-xl sm:text-2xl text-white font-black flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                    <Trophy
                      size={24}
                      className="text-amber-600 dark:text-amber-400"
                    />
                  </div>
                  Rank System
                </h3>
                <p className="text-xs sm:text-sm text-white dark:text-gray-400 font-medium leading-relaxed">
                  Earn credits to unlock new tiers and exclusive rewards.
                  Progress through ranks to gain special perks!
                </p>
              </ModalHeader>
              <ModalBody className="py-4 sm:py-6 px-4 sm:px-6">
                <div className="space-y-3">
                  {RANKS.map((rank, idx) => {
                    const isUnlocked = stats.total_credits >= rank.min;
                    return (
                      <div
                        key={rank.name}
                        className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 ${
                          isUnlocked
                            ? `${rank.bg} ${rank.border} shadow-sm`
                            : "opacity-60 grayscale border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02]"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2 sm:gap-4 mb-2">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <span
                              className={`text-lg sm:text-2xl font-black ${rank.color} opacity-80 shrink-0`}
                            >
                              {idx + 1}
                            </span>
                            <h4
                              className={`text-sm sm:text-lg font-bold ${rank.color} truncate`}
                            >
                              {rank.name}
                            </h4>
                          </div>
                          <span
                            className={`text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full whitespace-nowrap shrink-0 ${
                              isUnlocked
                                ? "bg-white/50 dark:bg-black/20 text-black dark:text-white backdrop-blur-sm"
                                : "bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400"
                            }`}
                          >
                            {isUnlocked ? "✓" : "🔒"} {rank.min}
                            {rank.max > 1000 ? "+" : `–${rank.max}`}
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                          {rank.name === "Platinum"
                            ? "🎸 Exclusive invitation to the University Band & Permanent Membership."
                            : "🏆 Unlocks new badges, profile flair, and priority event registration."}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </ModalBody>
              <ModalFooter className="border-t border-gray-200 dark:border-white/5 pt-3 sm:pt-4 px-4 sm:px-6 pb-4 sm:pb-6">
                <Button
                  onPress={onClose}
                  className="font-bold rounded-xl px-6 sm:px-8 py-5 sm:py-6 h-10 sm:h-12 w-full bg-gradient-to-r from-[#03a1b0] to-cyan-500 text-white text-sm sm:text-base shadow-lg hover:shadow-cyan-500/25 transition-all"
                >
                  Got it!
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </section>
  );
}

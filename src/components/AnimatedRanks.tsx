import React, { useState } from "react";
import {
  motion,
  type Variants,
  AnimatePresence,
  LayoutGroup,
} from "framer-motion";

// Defined types for better structure
type RankTier = {
  name: string;
  range: string;
  color: string;
  barColor: string;
  gradient: string;
  border: string;
  icon: string;
  perks: string[];
};

type RankData = {
  music: RankTier[];
  management: RankTier[];
};

const RANK_DATA: RankData = {
  music: [
    {
      name: "Bronze",
      range: "0 - 49 Credits",
      color: "text-orange-400",
      barColor: "bg-orange-400",
      gradient: "from-orange-500/10 to-orange-900/5",
      border: "border-orange-500/20",
      icon: "🥉",
      perks: [
        "Access to general workshops",
        "Voting rights for song selection",
        "Official Club Badge",
      ],
    },
    {
      name: "Silver",
      range: "50 - 99 Credits",
      color: "text-slate-300",
      barColor: "bg-slate-300",
      gradient: "from-slate-500/10 to-slate-900/5",
      border: "border-slate-400/20",
      icon: "🥈",
      perks: [
        "Backstage Access Pass",
        "Priority registration for events",
        "Merchandise Discount (10%)",
      ],
    },
    {
      name: "Gold",
      range: "100 - 149 Credits",
      color: "text-yellow-400",
      barColor: "bg-yellow-400",
      gradient: "from-yellow-500/10 to-yellow-900/5",
      border: "border-yellow-500/20",
      icon: "🥇",
      perks: [
        "Perform in 'Gold' tier slots",
        "1-on-1 Mentorship Session",
        "Featured Artist Profile",
      ],
    },
    {
      name: "Platinum",
      range: "150+ Credits",
      color: "text-cyan-300",
      barColor: "bg-cyan-300",
      gradient: "from-cyan-500/10 to-cyan-900/5",
      border: "border-cyan-500/20",
      icon: "💎",
      perks: [
        "Club Leadership Eligibility",
        "Studio Recording Time",
        "All-Access VIP Pass",
      ],
    },
  ],
  management: [
    {
      name: "Bronze",
      range: "0 - 49 Credits",
      color: "text-orange-400",
      barColor: "bg-orange-400",
      gradient: "from-orange-500/10 to-orange-900/5",
      border: "border-orange-500/20",
      icon: "📋",
      perks: [
        "Event Volunteer Badge",
        "Access to planning meetings",
        "Logistics voting rights",
      ],
    },
    {
      name: "Silver",
      range: "50 - 99 Credits",
      color: "text-slate-300",
      barColor: "bg-slate-300",
      gradient: "from-slate-500/10 to-slate-900/5",
      border: "border-slate-400/20",
      icon: "🤝",
      perks: [
        "Team Lead Role",
        "Backstage Logistics Access",
        "Certificate of Appreciation",
      ],
    },
    {
      name: "Gold",
      range: "100 - 149 Credits",
      color: "text-yellow-400",
      barColor: "bg-yellow-400",
      gradient: "from-yellow-500/10 to-yellow-900/5",
      border: "border-yellow-500/20",
      icon: "💼",
      perks: [
        "Budget Management Access",
        "Event Strategy Workshops",
        "LinkedIn Recommendation",
      ],
    },
    {
      name: "Platinum",
      range: "150+ Credits",
      color: "text-cyan-300",
      barColor: "bg-cyan-300",
      gradient: "from-cyan-500/10 to-cyan-900/5",
      border: "border-cyan-500/20",
      icon: "👔",
      perks: [
        "Core Council Membership",
        "Signature Authority",
        "Event Director Role",
      ],
    },
  ],
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const AnimatedRanks = () => {
  const [activeCategory, setActiveCategory] = useState<keyof RankData>("music");

  return (
    <div className="w-full max-w-7xl mx-auto px-4 flex flex-col items-center">
      {/* Category Toggle */}
      <div className="mb-12 bg-white/5 backdrop-blur-md p-1.5 rounded-full border border-white/10 relative z-20">
        <LayoutGroup>
          <div className="flex gap-2">
            {(["music", "management"] as const).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`
                  relative px-8 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 capitalize
                  ${
                    activeCategory === category
                      ? "text-white"
                      : "text-gray-400 hover:text-white"
                  }
                `}
              >
                {activeCategory === category && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute inset-0 bg-white/10 border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)] rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                <span className="relative z-10">{category}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>
      </div>

      {/* Ranks Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory} // Force re-render on category change
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
        >
          {RANK_DATA[activeCategory].map((rank) => (
            <motion.div
              key={rank.name}
              variants={itemVariants}
              className={`relative p-8 rounded-[2rem] border ${rank.border} bg-gradient-to-br ${rank.gradient} backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex flex-col h-full group hover:-translate-y-2 transition-transform duration-500 overflow-hidden`}
            >
              {/* Subtle liquid shine overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="flex justify-between items-start mb-6 relative z-10">
                <h3
                  className={`text-3xl font-bold ${rank.color} tracking-tight`}
                >
                  {rank.name}
                </h3>
                <span className="text-4xl filter drop-shadow-lg grayscale group-hover:grayscale-0 transition-all duration-500">
                  {rank.icon}
                </span>
              </div>

              <p className="text-sm text-gray-400 font-mono mb-8 bg-black/40 px-4 py-1.5 rounded-full w-fit border border-white/5 backdrop-blur-md">
                {rank.range}
              </p>

              <div className="flex-1 relative z-10">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">
                  Unlocked Perks
                </p>
                <ul className="space-y-3">
                  {rank.perks.map((perk, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm text-gray-300 leading-snug"
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${rank.barColor} shadow-[0_0_8px_currentColor]`}
                      ></div>
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AnimatedRanks;

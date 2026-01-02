import React from "react";
import { motion, type Variants } from "framer-motion";

const RANKS = [
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
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const AnimatedRanks = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }} // Trigger slightly earlier
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto px-4"
    >
      {RANKS.map((rank) => (
        <motion.div
          key={rank.name}
          variants={itemVariants}
          // Liquid Glass Effect
          className={`relative p-8 rounded-[2rem] border ${rank.border} bg-gradient-to-br ${rank.gradient} backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex flex-col h-full group hover:-translate-y-2 transition-transform duration-500 overflow-hidden`}
        >
          {/* Subtle liquid shine overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div className="flex justify-between items-start mb-6 relative z-10">
            <h3 className={`text-3xl font-bold ${rank.color} tracking-tight`}>
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
  );
};

export default AnimatedRanks;

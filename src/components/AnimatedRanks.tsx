// src/components/AnimatedRanks.tsx
import React from "react";
import { motion } from "framer-motion";

const RANKS = [
  {
    name: "Bronze",
    range: "0 - 49 Credits",
    color: "text-orange-400",
    gradient: "from-orange-900/20 to-orange-800/5",
    border: "border-orange-500/30",
    icon: "🥉",
  },
  {
    name: "Silver",
    range: "50 - 99 Credits",
    color: "text-slate-300",
    gradient: "from-slate-800/50 to-slate-700/10",
    border: "border-slate-400/30",
    icon: "🥈",
  },
  {
    name: "Gold",
    range: "100 - 149 Credits",
    color: "text-yellow-400",
    gradient: "from-yellow-900/20 to-yellow-800/5",
    border: "border-yellow-500/30",
    icon: "🥇",
  },
  {
    name: "Platinum",
    range: "150+ Credits",
    color: "text-cyan-300",
    gradient: "from-cyan-900/20 to-cyan-800/5",
    border: "border-cyan-500/30",
    icon: "💎",
  },
];

const AnimatedRanks = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl mx-auto px-4">
      {RANKS.map((rank, i) => (
        <motion.div
          key={rank.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
          className={`relative p-6 rounded-2xl border ${rank.border} bg-gradient-to-br ${rank.gradient} backdrop-blur-sm overflow-hidden group hover:-translate-y-2 transition-transform duration-300`}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-6xl grayscale-0">
            {rank.icon}
          </div>
          <h3 className={`text-2xl font-bold ${rank.color} mb-1`}>
            {rank.name}
          </h3>
          <p className="text-sm text-gray-400 font-mono">{rank.range}</p>
          <div className="mt-4 w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 1, delay: 0.5 + i * 0.2 }}
              className={`h-full bg-current ${rank.color}`}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AnimatedRanks;

import React from "react";
import { motion } from "framer-motion";
import {
  Server,
  Layout,
  ArrowRight,
  Github,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

// 1. Define the Props Interface
interface DocCardProps {
  title: string;
  desc: string;
  icon: LucideIcon; // Correct type for Lucide-React icons
  color: string; // e.g., "from-pink-500 to-transparent"
  link: string;
  delay: number;
}

// 2. The Card Component
const DocCard: React.FC<DocCardProps> = ({
  title,
  desc,
  icon: Icon, // Rename 'icon' prop to 'Icon' so we can use it as a component tag <Icon />
  color,
  link,
  delay,
}) => {
  const isExternal = link.startsWith("http");

  return (
    <motion.a
      href={link}
      target={isExternal ? "_blank" : "_self"}
      rel={isExternal ? "noopener noreferrer" : undefined}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="relative group p-8 rounded-[2.5rem] bg-neutral-900/50 border border-white/10 backdrop-blur-md overflow-hidden cursor-pointer flex flex-col justify-between h-[310px]"
    >
      {/* Dynamic Hover Gradient using the 'color' prop */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
      />

      <div className="relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          {/* Render the passed Icon */}
          <Icon className="text-white w-7 h-7" />
        </div>

        <h3 className="text-3xl font-bold text-white mb-3">{title}</h3>
        <p className="text-neutral-400 leading-relaxed text-lg max-w-sm">
          {desc}
        </p>
      </div>

      <div className="relative z-10 flex items-center gap-2 text-white font-bold text-sm mt-auto group-hover:translate-x-2 transition-transform">
        View Documentation <ArrowRight className="w-4 h-4" />
      </div>
    </motion.a>
  );
};

// 3. Main Page Component
const DeveloperHub = () => {
  return (
    <div className="min-h-screen bg-[#030303] text-white pt-24 pb-20 relative overflow-hidden flex flex-col justify-center">
      {/* Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-lolo-pink/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-lolo-cyan/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 w-full">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-lolo-cyan text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Github className="w-3 h-3" />
            <span>Open Source</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            LOLO <span className="text-lolo-pink font-club">Docs</span>
          </motion.h1>

          <p className="text-neutral-400 text-xl">
            Everything you need to build, contribute, and extend the platform.
          </p>
        </div>

        {/* --- USAGE OF THE COMPONENT --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {/* Card 1: Frontend */}
          <DocCard
            title="Frontend Guide"
            desc="Setup the React ecosystem. Learn about our component library, Framer Motion animations, and UI architecture."
            icon={Layout}
            color="from-lolo-pink to-transparent"
            link="https://github.com/LokeshLenka/LOLO-FRONTEND"
            delay={0.2}
          />

          {/* Card 2: Backend */}
          <DocCard
            title="Backend API"
            desc="Explore the Laravel API. Authentication, database schemas, Docker setup, and endpoint references."
            icon={Server}
            color="from-lolo-cyan to-transparent"
            link="http://localhost:8000/docs/index.html"
            delay={0.3}
          />
        </div>

        {/* Footer Link */}
        <div className="text-center">
          <a
            href="https://github.com/LokeshLenka"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors text-sm"
          >
            <BookOpen className="w-4 h-4" />
            View Contributing Guidelines (CONTRIBUTING.md)
          </a>
        </div>
      </div>
    </div>
  );
};

export default DeveloperHub;

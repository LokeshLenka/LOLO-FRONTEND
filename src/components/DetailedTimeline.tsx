import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Define the shape of our detailed data
interface DetailedEvent {
  date: string;
  title: string;
  category: "Music" | "Tech" | "Management" | "Milestone";
  description: string;
}

const DETAILED_HISTORY: DetailedEvent[] = [
  {
    date: "Aug 15, 2023",
    title: "Concept Initiation",
    category: "Milestone",
    description:
      "First brainstorming session for SRKR LOLO held in the dorms. The core idea of a student-led music platform was born.",
  },
  {
    date: "Sep 02, 2023",
    title: "Core Team Formation",
    category: "Management",
    description:
      "Recruited 5 key members for technical, creative, and logistics roles. Roles assigned based on individual strengths.",
  },
  {
    date: "Oct 10, 2023",
    title: "Prototype Development",
    category: "Tech",
    description:
      "Started coding the React/Laravel stack. First commit pushed to GitHub for the event management portal.",
  },
  {
    date: "Nov 05, 2023",
    title: "First Open Mic Night",
    category: "Music",
    description:
      "Pilot event held at the campus cafeteria. 20+ performers registered using the beta version of the LOLO app.",
  },
  {
    date: "Dec 01, 2023",
    title: "Official Club Approval",
    category: "Milestone",
    description:
      "Received official letter of approval from college administration. Allocated budget and practice room access.",
  },
  {
    date: "Jan 20, 2024",
    title: "IoT Stage Integration",
    category: "Tech",
    description:
      "Successfully tested Arduino-based lighting system that syncs with live music beats.",
  },
];

const categoryColors = {
  Music: "bg-pink-500 text-pink-100",
  Tech: "bg-blue-500 text-blue-100",
  Management: "bg-amber-500 text-amber-100",
  Milestone: "bg-emerald-500 text-emerald-100",
};

const DetailedTimeline = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#030303] text-neutral-200 p-6 md:p-12 font-sans relative overflow-hidden">
      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-purple-900/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-cyan-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Navigation Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-16 mt-5 pl-5"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mt-5">
              Detailed History
            </h1>
            <p className="text-gray-400 text-sm">
              A granular look at our growth
            </p>
          </div>
        </motion.div>

        {/* Timeline Content */}
        <div className="relative border-l border-neutral-800 ml-4 md:ml-6 space-y-12 pb-20">
          {DETAILED_HISTORY.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-8 md:pl-12"
            >
              {/* Timeline Dot */}
              <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full bg-neutral-600 ring-4 ring-[#030303]" />

              {/* Content Card */}
              <div className="group relative bg-neutral-900/50 border border-white/5 p-6 rounded-2xl hover:border-white/10 hover:bg-neutral-900/80 transition-all duration-300">
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                  <span className="font-mono text-sm text-lolo-cyan font-medium">
                    {event.date}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${
                      categoryColors[event.category]
                    }`}
                  >
                    {event.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-lolo-cyan transition-colors">
                  {event.title}
                </h3>

                <p className="text-neutral-400 leading-relaxed text-sm md:text-base">
                  {event.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
          </div>
    </div>
  );
};

export default DetailedTimeline;

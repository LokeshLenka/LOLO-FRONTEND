import { motion } from "framer-motion";
import {
  Code2,
  Cpu,
  Server,
  GitBranch,
  Github,
  Linkedin,
  ArrowRight,
  Sparkles,
} from "lucide-react";

type TechMember = {
  name: string;
  role: string;
  track: "Frontend" | "Backend" | "DevOps" | "Design" | "Mobile" | "Full Stack";
  skills: string[];
  github?: string;
  linkedin?: string;
};

const TEAM: TechMember[] = [
  {
    name: "Lokesh Lenka",
    role: "Tech Lead / Full Stack",
    track: "Full Stack",
    skills: [
      "Database Architect",
      "Laravel",
      "React",
      "API Design",
      "Tailwind",
    ],
    github: "https://github.com/LokeshLenka",
    linkedin: "https://www.linkedin.com/in/lenka-lokesh/",
  },
];

const TrackPill = ({ track }: { track: TechMember["track"] }) => {
  const map: Record<TechMember["track"], string> = {
    Frontend: "bg-lolo-pink/15 text-lolo-pink border-lolo-pink/20",
    Backend: "bg-lolo-cyan/15 text-lolo-cyan border-lolo-cyan/20",
    DevOps: "bg-white/10 text-white border-white/15",
    Design: "bg-lolo-pink/10 text-neutral-200 border-white/10",
    Mobile: "bg-lolo-cyan/10 text-neutral-200 border-white/10",
    "Full Stack":
      "bg-gradient-to-r from-lolo-pink/15 to-lolo-cyan/15 text-white border-white/10",
  };

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1",
        "text-[10px] font-extrabold uppercase tracking-wider",
        map[track],
      ].join(" ")}
    >
      {track}
    </span>
  );
};

const Avatar = ({ name }: { name: string }) => {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  return (
    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
      <span className="text-white font-black">{initials}</span>
    </div>
  );
};

const MemberCard = ({
  member,
  index,
}: {
  member: TechMember;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.05 * index, duration: 0.5 }}
      className="p-6 rounded-[2rem] bg-neutral-900/50 border border-white/10 backdrop-blur-md relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-lolo-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-4 min-w-0">
            <Avatar name={member.name} />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-white font-extrabold leading-tight truncate">
                  {member.name}
                </h4>
                <TrackPill track={member.track} />
              </div>
              <p className="text-neutral-400 text-sm mt-1">{member.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {member.github && (
              <a
                href={member.github}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 grid place-items-center hover:border-white/20 transition-colors"
                aria-label={`${member.name} GitHub`}
              >
                <Github className="w-4 h-4 text-white" />
              </a>
            )}
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 grid place-items-center hover:border-white/20 transition-colors"
                aria-label={`${member.name} LinkedIn`}
              >
                <Linkedin className="w-4 h-4 text-white" />
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {member.skills.map((s) => (
            <span
              key={s}
              className="text-xs font-bold text-neutral-300 bg-white/5 border border-white/10 rounded-full px-3 py-1"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const TechTeam = () => {
  return (
    <section className="relative py-24 bg-[#030303] overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-0 w-[520px] h-[520px] bg-lolo-pink/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[520px] h-[520px] bg-lolo-cyan/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            The Builders Behind <br />
            <span className="text-lolo-pink font-club">LOLO Platform</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-neutral-400 text-lg leading-relaxed"
          >
            The tech team designs, ships, and maintains LOLO — from UI systems
            to APIs and deployments.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Big: Mission */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-2 p-8 md:p-10 rounded-[2.5rem] bg-neutral-900/50 border border-white/10 backdrop-blur-md relative overflow-hidden group flex flex-col justify-between"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-lolo-pink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-lolo-pink/10 flex items-center justify-center mb-6">
                <Sparkles className="text-lolo-pink w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Product-first Engineering
              </h3>
              <p className="text-neutral-400 leading-relaxed max-w-lg">
                We build fast, accessible experiences for campus music — with
                clean architecture, reusable components, and reliable releases.
              </p>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-[2.5rem] bg-neutral-900/50 border border-white/10 backdrop-blur-md relative overflow-hidden group flex flex-col justify-between"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-lolo-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-lolo-cyan/10 flex items-center justify-center mb-6">
                <GitBranch className="text-lolo-cyan w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                How we ship
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-neutral-300 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-lolo-cyan" />
                  Component-driven UI
                </div>
                <div className="flex items-center gap-3 text-neutral-300 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-lolo-cyan" />
                  API-first backend
                </div>
                <div className="flex items-center gap-3 text-neutral-300 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-lolo-cyan" />
                  Iterative releases
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tracks */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="p-8 rounded-[2.5rem] bg-neutral-900/50 border border-white/10 backdrop-blur-md hover:border-lolo-pink/30 transition-colors group"
          >
            <Code2 className="text-lolo-pink w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
            <h4 className="text-xl font-bold text-white mb-2">Frontend</h4>
            <p className="text-neutral-400 text-sm">
              Design systems, motion, performance, responsive UI.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="p-8 rounded-[2.5rem] bg-neutral-900/50 border border-white/10 backdrop-blur-md hover:border-lolo-cyan/30 transition-colors group"
          >
            <Server className="text-lolo-cyan w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
            <h4 className="text-xl font-bold text-white mb-2">Backend</h4>
            <p className="text-neutral-400 text-sm">
              Auth, APIs, data modeling, reliability & security.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35 }}
            className="p-8 rounded-[2.5rem] bg-neutral-900/50 border border-white/10 backdrop-blur-md hover:border-white/20 transition-colors group"
          >
            <Cpu className="text-white w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
            <h4 className="text-xl font-bold text-white mb-2">DevOps</h4>
            <p className="text-neutral-400 text-sm">
              Deployments, monitoring, CI/CD, infra automation.
            </p>
          </motion.div>
        </div>

        {/* Members */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-[2rem] bg-white/[0.02] border border-white/10 backdrop-blur-md px-4 py-6 md:p-12"
        >
          <div className="flex items-start justify-between gap-6 flex-wrap mb-8">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                Meet the tech team
              </h3>
              <p className="text-neutral-400 mt-2">
                Builders, maintainers, and contributors powering LOLO.
              </p>
            </div>

            <a
              href="https://github.com/LokeshLenka/LOLO-FRONTEND"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-lolo-cyan font-bold text-sm hover:underline"
            >
              View repository <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TEAM.map((m, i) => (
              <MemberCard key={m.name} member={m} index={i} />
            ))}
          </div>

          {/* <div className="mt-10 pt-6 border-t border-white/10 flex items-start gap-3 text-neutral-500 text-sm">
            <Shield className="w-4 h-4 mt-0.5 text-neutral-600" />
            <p>
              Tip: Keep GitHub/LinkedIn optional per member — the card layout
              stays clean even when links are missing.
            </p>
          </div> */}
        </motion.div>
      </div>
    </section>
  );
};

export default TechTeam;

import { motion } from "framer-motion";
import {
  Music,
  Mic2,
  Users,
  Briefcase,
  Github,
  ArrowRight,
  Code,
  ArrowUpRight,
} from "lucide-react";
// import DetailedTimeline from "./DetailedTimeline";

const AboutUs = () => {
  return (
    <>
      <section className="relative py-24 bg-[#030303] overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-lolo-pink/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-lolo-cyan/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="mb-20 text-center max-w-3xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              Defining the Future of <br />
              <span className="text-lolo-pink font-club">Campus Music</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-neutral-400 text-lg leading-relaxed"
            >
              SRKR LOLO is a officially recognized{" "}
              <strong>Music Band & Club</strong> that bridges the gap between
              academic life and creative expression.
            </motion.p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
            {/* ROW 1: Sonic Ecosystem (2 cols) + Our Tribe (1 col) */}

            {/* 1. Large Card - Core Identity */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="md:col-span-2 p-8 md:p-10 rounded-[2.5rem] bg-neutral-900/50 border border-white/10 backdrop-blur-md relative overflow-hidden group flex flex-col justify-between"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-lolo-pink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-lolo-pink/10 flex items-center justify-center mb-6">
                  <Music className="text-lolo-pink w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  The Sonic Ecosystem
                </h3>
                <p className="text-neutral-400 leading-relaxed max-w-lg">
                  We are more than just performers. From composing original
                  scores for short films to hosting major live concerts and
                  interactive workshops, we are a fully functional music
                  production ecosystem within the college.
                </p>
              </div>
            </motion.div>

            {/* 2. Moved Card: Our Tribe */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="md:col-span-1 p-8 rounded-[2.5rem] bg-neutral-900/50 border border-white/10 backdrop-blur-md flex flex-col justify-between group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-lolo-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-lolo-cyan/10 flex items-center justify-center mb-6">
                  <Users className="text-lolo-cyan w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Our Tribe
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-neutral-300 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-lolo-cyan" />
                    Official Club Status
                  </div>
                  <div className="flex items-center gap-3 text-neutral-300 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-lolo-cyan" />
                    25+ Active Members
                  </div>
                  <div className="flex items-center gap-3 text-neutral-300 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-lolo-cyan" />
                    Student Led
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ROW 2: Music + Management + GitHub */}

            {/* 3. Small Card - Music Wing */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-8 rounded-[2.5rem] bg-neutral-900/50 border border-white/10 backdrop-blur-md hover:border-lolo-pink/30 transition-colors group"
            >
              <Mic2 className="text-lolo-pink w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="text-xl font-bold text-white mb-2">Music Wing</h4>
              <p className="text-neutral-400 text-sm">
                The creative heart. Concerts, production, vocal training.
              </p>
            </motion.div>

            {/* 4. Small Card - Management Wing */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="p-8 rounded-[2.5rem] bg-neutral-900/50 border border-white/10 backdrop-blur-md hover:border-lolo-cyan/30 transition-colors group"
            >
              <Briefcase className="text-lolo-cyan w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="text-xl font-bold text-white mb-2">
                Management Wing
              </h4>
              <p className="text-neutral-400 text-sm">
                The backbone. Event ops, logistics, marketing.
              </p>
            </motion.div>

            {/* 5. Moved Card: Open Source */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="p-8 rounded-[2.5rem] bg-neutral-900/50 border border-white/10 backdrop-blur-md relative overflow-hidden group flex flex-col justify-between hover:border-lolo-cyan/30 transition-colors cursor-pointer"
              onClick={() =>
                window.open(
                  "https://github.com/LokeshLenka/LOLO-FRONTEND ",
                  "_blank"
                )
              }
            >
              {/* Hover Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-lolo-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Github className="text-white w-5 h-5" />
                  </div>
                  <div className="bg-lolo-cyan/20 px-2.5 py-1 rounded-full border border-lolo-cyan/20">
                    <span className="text-[10px] font-bold text-lolo-cyan uppercase tracking-wider">
                      Open Source
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2">
                  Built by Students
                </h3>
                <div className="flex items-center gap-1 text-neutral-400 text-xs font-bold group-hover:text-lolo-cyan transition-colors mt-auto">
                  Contribute{" "}
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* --- ELABORATIVE TEXT SECTION --- */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-[2rem] bg-white/[0.02] border border-white/10 backdrop-blur-md p-8 md:p-12"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Our story, in a few lines
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Left: Narrative */}
              <div>
                <p className="text-neutral-300 leading-relaxed mb-6 text-lg">
                  SRKR LOLO began as a simple idea in a dorm room: a collective
                  of passionate musicians and engineers wanting to bridge the
                  gap between rigorous academic life and creative expression.
                </p>
                <p className="text-neutral-400 leading-relaxed">
                  What started as jam sessions evolved into a movement. On{" "}
                  <span className="text-lolo-cyan font-semibold">
                    Dec 2, 2024
                  </span>
                  , the college administration officially recognized us as a
                  Music Band & Club, granting us the resources to scale our
                  vision.
                </p>
              </div>

              {/* Right: What we do + Contribute */}
              <div className="space-y-8">
                <div>
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-lolo-pink"></span>
                    What we actually do
                  </h4>
                  <ul className="space-y-3 text-neutral-400 text-sm">
                    <li className="flex items-start gap-3">
                      <ArrowUpRight className="w-4 h-4 text-neutral-600 mt-0.5 shrink-0" />
                      <span>
                        Producing original scores & soundtracks for student
                        short films.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <ArrowUpRight className="w-4 h-4 text-neutral-600 mt-0.5 shrink-0" />
                      <span>
                        Organizing live concerts, and cultural nights.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <ArrowUpRight className="w-4 h-4 text-neutral-600 mt-0.5 shrink-0" />
                      <span>
                        {" "}
                        conducting workshops on music production, vocals, and
                        event management.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                    <Code className="w-4 h-4 text-lolo-cyan" />
                    Tech & Contribution
                  </h4>
                  <p className="text-neutral-500 text-sm mb-3">
                    We believe in open collaboration. This platform itself is a
                    testament to that.
                  </p>
                  <a
                    href="https://github.com/LokeshLenka/LOLO-FRONTEND"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-lolo-cyan font-bold text-sm hover:underline"
                  >
                    Check out the repository <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* <DetailedTimeline /> */}
    </>
  );
};

export default AboutUs;

// import DetailedTimeline from "@/components/DetailedTimeline";
import { motion } from "framer-motion";
import { Music, Mic2, Users, Briefcase, Sparkles } from "lucide-react";

const AboutUs = () => {
  return (
    <>
      <section className="relative py-24 bg-[#030303] overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-lolo-cyan/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-lolo-pink/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="mb-20 text-center max-w-3xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight"
            >
              Defining the Future of <br />
              <span className="text-lolo-pink font-club">Campus Music</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-neutral-400 text-lg leading-relaxed max-w-2xl mx-auto"
            >
              SRKR LOLO is a officially recognized{" "}
              <strong className="text-white">Music Band & Club</strong> that
              bridges the gap between academic life and creative expression.
            </motion.p>
            {/* Legal & Ownership (for compliance) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="max-w-3xl mx-auto mb-10"
            >
              <div className="p-6 md:p-7 rounded-[2.0rem] bg-white/[0.02] border border-white/5 backdrop-blur-xl">
                <p className="text-neutral-400 text-sm leading-relaxed">
                  <span className="text-white font-bold">Platform owner:</span>{" "}
                  SRKR Engineering College.
                </p>
                <p className="text-neutral-400 text-sm leading-relaxed mt-2">
                  <span className="text-white font-bold">Operated by:</span>{" "}
                  SRKR LOLO (official music club) under SRKR oversight.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(200px,auto)]">
            {/* 1. Large Card - Sonic Ecosystem (Spans 2 cols, 2 rows) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="md:col-span-2 md:row-span-2 p-8 md:p-12 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-xl relative overflow-hidden group flex flex-col justify-between"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-lolo-pink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-lolo-pink/10 flex items-center justify-center mb-8">
                  <Music className="text-lolo-pink w-7 h-7" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">
                  The Sonic Ecosystem
                </h3>
                <p className="text-neutral-400 text-lg leading-relaxed mb-8 max-w-md">
                  We are more than just performers. From composing original
                  scores for short films to hosting major live concerts and
                  interactive workshops, we are a fully functional music
                  production ecosystem within the college.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <Sparkles className="w-5 h-5 text-purple-400 mb-2" />
                    <h4 className="font-bold text-white text-sm">
                      Original Scores
                    </h4>
                    <p className="text-xs text-neutral-500">
                      Short films & events
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <Mic2 className="w-5 h-5 text-lolo-pink mb-2" />
                    <h4 className="font-bold text-white text-sm">
                      Live Concerts
                    </h4>
                    <p className="text-xs text-neutral-500">
                      Campus-wide shows
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 2. Music Wing (1 col) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-xl hover:bg-white/[0.04] transition-colors group flex flex-col justify-between h-full"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6">
                  <Mic2 className="text-purple-400 w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">
                  Music Wing
                </h4>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  The creative heart. Production, vocal training, and
                  instrumental mastery.
                </p>
              </div>
            </motion.div>

            {/* 3. Management Wing (1 col) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-xl hover:bg-white/[0.04] transition-colors group flex flex-col justify-between h-full"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
                  <Briefcase className="text-blue-400 w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">
                  Management Wing
                </h4>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  The backbone. Event operations, logistics, marketing, and
                  execution.
                </p>
              </div>
            </motion.div>

            {/* 4. Our Tribe (Updated to span 3 cols) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="md:col-span-3 p-8 rounded-[2.5rem] bg-gradient-to-br from-white/[0.05] to-transparent border border-white/5 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-8"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-lolo-pink/10 rounded-xl">
                  <Users className="text-lolo-pink w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    Our Tribe
                  </h3>
                  <p className="text-neutral-400 text-sm">
                    A growing community
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full md:w-auto">
                <div className="flex flex-col md:items-end p-4 md:p-0 bg-white/5 md:bg-transparent rounded-xl md:rounded-none">
                  <span className="text-neutral-500 text-xs font-bold uppercase tracking-wider mb-1">
                    Status
                  </span>
                  <span className="text-white font-bold text-lg flex items-center gap-2">
                    Official Club <span className="text-lolo-pink">✓</span>
                  </span>
                </div>
                <div className="flex flex-col md:items-end p-4 md:p-0 bg-white/5 md:bg-transparent rounded-xl md:rounded-none">
                  <span className="text-neutral-500 text-xs font-bold uppercase tracking-wider mb-1">
                    Members
                  </span>
                  <span className="text-white font-bold text-lg">
                    25+ Active
                  </span>
                </div>
                <div className="flex flex-col md:items-end p-4 md:p-0 bg-white/5 md:bg-transparent rounded-xl md:rounded-none">
                  <span className="text-neutral-500 text-xs font-bold uppercase tracking-wider mb-1">
                    Leadership
                  </span>
                  <span className="text-white font-bold text-lg">
                    Student Led
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        {/* <DetailedTimeline /> */}
      </section>
    </>
  );
};

export default AboutUs;

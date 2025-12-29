import React from "react";
import { Link } from "react-router-dom";
import { Headphones, Mic2, Award, Play, Disc3, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@heroui/button";
import FloatingLines from "../components/FloatingLines";

// --- Enterprise Component: Section Header ---
// Reusable component to ensure typographic consistency across sections
const SectionHeader: React.FC<{ title: React.ReactNode; subtitle: string }> = ({
  title,
  subtitle,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="text-center mb-16 md:mb-24"
  >
    <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
      {title}
    </h2>
    <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed antialiased">
      {subtitle}
    </p>
  </motion.div>
);

const Home: React.FC = () => {
  return (
    <>
      {/* 
        Enterprise Note: ideally move font imports to index.html or a dedicated Typography component 
        to prevent re-injection on re-renders, but keeping here for portability as requested.
      */}

      <div className="min-h-screen bg-[#030303] text-white w-full overflow-x-hidden font-sans selection:bg-lolo-pink selection:text-white">
        {/* --- HERO SECTION --- */}
        <section className="relative h-[100dvh] min-h-[800px] flex items-center justify-center overflow-hidden">
          {/* Layer 1: Interactive Background */}
          <div className="absolute inset-0 !z-10 opacity-70 pointer-events-none">
            {/* Note: FloatingLines must handle its own canvas resize for enterprise stability */}
            <FloatingLines />
          </div>

          {/* Layer 2: Ambient Lighting (Performance Optimized with will-change) */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-lolo-pink/20 rounded-full blur-[120px] mix-blend-screen opacity-20 will-change-transform" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-lolo-cyan/20 rounded-full blur-[120px] mix-blend-screen opacity-20 will-change-transform" />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-100 mix-blend-overlay z-0" />
          </div>

          {/* Layer 3: Main Content */}
          <div className="relative z-20 w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center h-full">
            {/* Semantic Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 -mt-14"
            >
              <div className="inline-flex h-8 items-center gap-2 px-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lolo-cyan opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-lolo-cyan"></span>
                </span>
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-300 ">
                  The Future of Campus Music
                </span>
              </div>
            </motion.div>

            {/* H1 Headline */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // Custom bezier for premium feel
              className="max-w-5xl mx-auto mb-8 relative"
            >
              <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[1.1] text-white">
                <span className="block font-sans mb-2">Unleash Your</span>
                <span className="font-club text-transparent bg-clip-text bg-gradient-to-r from-lolo-pink via-white to-lolo-cyan animate-gradient-x py-2 block drop-shadow-2xl">
                  Inner Rhythm
                </span>
              </h1>
            </motion.div>

            {/* Subtext */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-2xl mx-auto mb-4 sm:mb-12"
            >
              {/* <p className="text-lg sm:text-xl text-white/95 font-light leading-relaxed">
                SRKR LOLO is where campus energy meets professional sound.
                Connecting artists, fans, and creators in one immersive
                ecosystem.
              </p> */}
              <p className="text-lg sm:text-xl text-white/95 font-light leading-relaxed">
                Blending cultures and hearts, turning campus energy into music
                that lives beyond the stage.
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
            >
              <Link
                to="/signup"
                className="w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-lolo-pink focus:ring-offset-2 focus:ring-offset-black rounded-full"
              >
                <Button className="w-full sm:w-auto px-10 py-8 rounded-full bg-white text-black font-bold text-lg hover:bg-gray-100 transition-all duration-300 border-none group shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                  Join the Community
                  <ArrowRight
                    size={20}
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                  />
                </Button>
              </Link>

              <Link
                to="/events"
                className="w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-lolo-cyan focus:ring-offset-2 focus:ring-offset-black rounded-full"
              >
                <Button className="w-full sm:w-auto px-10 py-8 rounded-full bg-white/5 text-white font-medium text-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-md">
                  Explore Events
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* --- FEATURES SECTION --- */}
        <section className="py-24 md:py-32 bg-[#050505] relative z-20">
          <div className="max-w-7xl mx-auto px-6">
            <SectionHeader
              title={
                <>
                  Why{" "}
                  <span className="font-club text-lolo-pink text-4xl md:text-6xl ml-2 align-middle">
                    SRKR LOLO?
                  </span>
                </>
              }
              subtitle="We are redefining how campus talent is discovered, celebrated, and amplified."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  icon: Headphones,
                  color: "text-lolo-pink",
                  bg: "from-lolo-pink/20",
                  border: "border-lolo-pink/20",
                  title: "Contemporary Fusion",
                  desc: "Seamlessly blending genres for a refreshingly experimental sound that breaks traditional boundaries.",
                },
                {
                  icon: Disc3,
                  color: "text-lolo-cyan",
                  bg: "from-lolo-cyan/20",
                  border: "border-lolo-cyan/20",
                  title: "Immersive Soundscapes",
                  desc: "Experience energetic rhythms and melodic storytelling crafted by the best local talent.",
                },
                {
                  icon: Award,
                  color: "text-lolo-red",
                  bg: "from-lolo-red/20",
                  border: "border-lolo-red/20",
                  title: "Resonant Community",
                  desc: "More than just music—it's about connecting audiences across generations and backgrounds.",
                },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group p-8 rounded-3xl glass-panel hover:bg-white/[0.07] transition-all duration-500"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.bg} to-transparent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border ${feature.border}`}
                  >
                    <feature.icon size={28} className={feature.color} />
                  </div>
                  <h3
                    className={`text-xl font-bold mb-3 text-white group-hover:${feature.color} transition-colors`}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-sm lg:text-base">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- ABOUT SECTION (Grid Layout) --- */}
        <section className="py-24 md:py-32 bg-black relative overflow-hidden z-20">
          {/* Decorative Elements */}
          <div className="absolute right-0 top-1/3 w-[500px] h-[500px] bg-lolo-cyan/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                  About <span className="font-club text-lolo-pink">LoLo</span>{" "}
                  Music
                </h2>
                <div className="space-y-6 text-lg text-gray-400 leading-relaxed">
                  <p>
                    Founded in 2024, LoLo Music is revolutionizing the campus
                    auditory experience. We combine cutting-edge technology with
                    raw musical artistry to create a platform that doesn't just
                    play music—it launches careers.
                  </p>
                  <p>
                    We believe music is more than sound; it's a shared journey.
                    Our platform connects student artists with their biggest
                    fans, creating a feedback loop of creativity and excitement.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-white/10">
                  {[
                    { val: "10M+", label: "Streams" },
                    { val: "50K+", label: "Artists" },
                    { val: "24/7", label: "Live Radio" },
                  ].map((stat, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <span className="text-2xl md:text-3xl font-bold text-white">
                        {stat.val}
                      </span>
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Visual Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative group"
              >
                {/* Glow Effect */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-lolo-pink via-lolo-cyan to-lolo-pink opacity-30 blur-2xl group-hover:opacity-50 transition duration-1000 animate-gradient-xy" />

                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-white/10 bg-gray-900">
                  <img
                    src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                    alt="Music Studio Session"
                    loading="lazy"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500 flex items-center justify-center">
                    <button
                      aria-label="Play Video"
                      className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center hover:scale-110 hover:bg-white hover:text-black transition-all duration-300 text-white shadow-2xl"
                    >
                      <Play size={32} className="ml-1 fill-current" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- INSTITUTIONAL TRUST --- */}
        <section className="py-24 bg-[#080808] border-t border-white/5 z-20 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="relative rounded-[2.5rem] overflow-hidden bg-gray-900 border border-white/10 isolate">
              {/* Background Image */}
              <img
                src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80"
                className="absolute inset-0 w-full h-full object-cover opacity-30 -z-10"
                alt="SRKR Campus"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/90 to-transparent -z-10" />

              <div className="p-12 md:p-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
                <div className="max-w-2xl">
                  <h3 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                    Proudly Powered by <br /> SRKR Engineering College
                  </h3>
                  <p className="text-xl text-gray-300 mb-8 font-light">
                    Where academic excellence fuels creative innovation.
                    Discover the campus that started it all.
                  </p>
                  <a
                    href="https://srkrec.edu.in/"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-block"
                  >
                    <Button className="px-8 py-6 rounded-full bg-white text-black font-bold border-none transition-all shadow-lg hover:shadow-cyan-500/20">
                      Visit College Website
                    </Button>
                  </a>
                </div>

                {/* Floating Badge */}
                {/* <div className="hidden md:flex flex-col items-center justify-center w-36 h-36 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl animate-float">
                  <Award size={36} className="text-lolo-cyan mb-2" />
                  <span className="text-xs font-bold text-center leading-tight text-white/90">
                    Top Tier
                    <br />
                    Innovation
                  </span>
                </div> */}
              </div>
            </div>
          </div>
        </section>

        {/* --- FOOTER CTA --- */}
        <section className="py-32 bg-black relative flex items-center justify-center z-20 overflow-hidden">
          {/* Background Radial */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.1),transparent_70%)] pointer-events-none" />

          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
              Ready to make some{" "}
              <span className="font-club text-lolo-pink relative inline-block">
                Noise?
                {/* Underline decoration */}
                <svg
                  className="absolute w-full h-3 bottom-0 left-0 text-lolo-cyan -z-10 opacity-70"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 5 Q 50 10 100 5"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                  />
                </svg>
              </span>
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Join thousands of students and creators shaping the future of
              sound.
            </p>
            <Link to="/signup">
              <Button className="px-12 py-8 rounded-full bg-gradient-to-r from-lolo-pink to-lolo-cyan text-white text-xl font-bold hover:shadow-[0_0_50px_rgba(236,72,153,0.4)] transition-all duration-500 border-none hover:scale-105 active:scale-95">
                Get Started Now
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;

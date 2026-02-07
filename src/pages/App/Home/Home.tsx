import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Music,
  Users,
  Mic2,
  Disc3,
  Award,
  Headphones,
  CalendarDays,
} from "lucide-react";
import { Button } from "@heroui/button";
import EventsSection from "@/components/EventsSection";
import SectionHeader from "@/components/HomeSectionHeader";
import FloatingLines from "@/components/FloatingLines";
import AnimatedRanks from "@/components/AnimatedRanks";
import { Timeline } from "@/components/Timeline";

// --- COMPONENT: Rhythmic Audio Visualizer (Hero) ---
// const AudioVisualizer = () => {
//   return (
//     <div className="flex items-end justify-center gap-1 h-16 sm:h-24 mb-6 opacity-60">
//       {[...Array(12)].map((_, i) => (
//         <motion.div
//           key={i}
//           className="w-2 sm:w-3 bg-gradient-to-t from-lolo-pink to-lolo-cyan rounded-full"
//           animate={{
//             height: ["20%", "80%", "40%", "100%", "30%"],
//           }}
//           transition={{
//             duration: 1.2,
//             repeat: Infinity,
//             repeatType: "reverse",
//             ease: "easeInOut",
//             delay: i * 0.1, // Stagger effect
//           }}
//         />
//       ))}
//     </div>
//   );
// };

// --- COMPONENT: Floating Music Particles (Background) ---
// --- COMPONENT: Floating Music Particles (Background) ---

// --- COMPONENT: Sound Wave Divider ---
const SoundWaveDivider = () => (
  <div className="w-full h-16 sm:h-24 overflow-hidden leading-[0] transform translate-y-1">
    <svg
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className="relative block w-[calc(100%+1.3px)] h-full"
    >
      <path
        d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
        opacity=".25"
        className="fill-lolo-pink"
      ></path>
      <path
        d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
        opacity=".5"
        className="fill-lolo-cyan"
      ></path>
      <path
        d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
        className="fill-[#080808]"
      ></path>
    </svg>
  </div>
);
const Home: React.FC = () => {
  // Timeline Data
  const timelineData = [
    {
      title: "Formation",
      content: (
        <div>
          <p className="text-neutral-400 text-sm sm:text-base md:text-lg font-normal mb-8 leading-relaxed">
            SRKR LOLO began as a collective of passionate musicians and students
            wanting to bridge the gap between academic life and creative
            expression.
          </p>
        </div>
      ),
    },
    {
      title: "Dec 2, 2024",
      content: (
        <div>
          <p className="text-neutral-400 text-sm sm:text-base md:text-lg font-normal mb-8 leading-relaxed">
            The college administration officially recognized SRKR LOLO as a
            legit Music Band & Club. This marked the beginning of a structured
            era with Faculty Coordinators and a dedicated student body.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/5 py-5 px-5 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
              <h4 className="text-white font-bold mb-1">Music Wing</h4>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Concerts & Production
              </p>
            </div>
            <div className="bg-white/5 py-5 px-5 rounded-xl border border-white/10 hover:border-white/20 transition-colors">
              <h4 className="text-white font-bold mb-1">Management Wing</h4>
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Events & Operations
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "The Present",
      content: (
        <div>
          <p className="text-neutral-400 text-sm sm:text-base md:text-lg font-normal mb-4 leading-relaxed">
            We are now a fully functional ecosystem producing music for short
            films, hosting workshops, and performing at major college events
            like Hackathons.
          </p>
          <ul className="grid grid-cols-1 gap-2">
            {[
              "Short Film Scores",
              "Live Concerts",
              "Interactive Workshops",
            ].map((item) => (
              <li
                key={item}
                className="flex items-center text-gray-400 text-sm"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-lolo-pink mr-3"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-[#030303] text-white w-full selection:bg-lolo-pink selection:text-white overflow-x-hidden font-poppins">
      {/* Floating Music Elements (Background) */}
      {/* <FloatingMusicParticles /> */}

      {/* --- HERO SECTION --- */}
      <section className="relative h-[100dvh] min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Layer 1: Interactive Background (Restored) */}
        <div className="absolute inset-0 !z-10 opacity-70">
          <FloatingLines />
        </div>

        {/* Layer 2: Ambient Lighting */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-lolo-pink/20 rounded-full blur-[120px] mix-blend-screen opacity-20 will-change-transform" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-lolo-cyan/20 rounded-full blur-[120px] mix-blend-screen opacity-20 will-change-transform" />
          <div className="absolute inset-0 bg-[url('/noise.png')] !opacity-100 mix-blend-overlay z-0" />
        </div>

        {/* Layer 3: Main Content */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-5 flex flex-col items-center justify-center text-center h-full">
          {/* New Audio Visualizer */}
          {/* <AudioVisualizer /> */}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 sm:mb-8"
          >
            <div className="inline-flex h-8 sm:h-9 items-center gap-2 sm:gap-3 px-4 sm:px-5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl shadow-lg shadow-black/20 hover:border-white/20 transition-colors cursor-default">
              <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lolo-cyan opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-lolo-cyan"></span>
              </span>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-gray-300">
                The Future of Campus Music
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-6xl mx-auto mb-6 sm:mb-8 relative px-2"
          >
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[1.1] text-white">
              <span className="block font-club mb-2 text-white/90">
                Unleash
              </span>
              <span className="font-club text-transparent bg-clip-text bg-gradient-to-r from-lolo-pink via-white to-lolo-cyan animate-gradient-x pb-6 block drop-shadow-2xl">
                Your Rhythm
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl mx-auto mb-8 sm:mb-10 px-4"
          >
            <p className="text-base sm:text-xl md:text-2xl text-white/80 font-light leading-relaxed">
              Blending cultures and hearts, turning campus energy into music
              that lives beyond the stage.
            </p>
          </motion.div>

          {/* Reverted Buttons for Club/Community Context */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto px-4"
          >
            <Link to="/signup" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto px-8 py-6 sm:py-7 rounded-full bg-white text-black font-bold text-base sm:text-lg hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-all duration-300 border-none group">
                Join the Community
                <ArrowRight
                  size={20}
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                />
              </Button>
            </Link>

            <Link to="/events" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto px-8 py-6 sm:py-7 rounded-full bg-transparent text-white font-medium text-base sm:text-lg border border-white/20 hover:bg-white/10 hover:border-white/40 transition-all duration-300 backdrop-blur-sm">
                Explore Events
              </Button>
            </Link>
          </motion.div>

          {/* Scroll Indicator */}
          {/* <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50 hidden md:block"
          >
            <ChevronDown className="text-white/50" />
          </motion.div> */}
        </div>
      </section>

      {/* --- SOUND WAVE DIVIDER --- */}
      <SoundWaveDivider />

      {/* --- SPOTLIGHT / EVENTS SECTION --- */}
      <EventsSection />

      {/* --- ABOUT LOLO SECTION --- */}
      <section className="py-24 md:py-32 bg-[#020202] relative z-20">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="md:w-1/2"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 tracking-tight">
                About <span className="font-club text-lolo-pink">LoLo</span>{" "}
                Music
              </h2>

              <div className="space-y-4 sm:space-y-6 text-gray-400 text-base sm:text-lg leading-relaxed font-light">
                <p>
                  <strong className="text-white">
                    Living Out Loud Originals (LOLO)
                  </strong>{" "}
                  is SRKR's premier contemporary fusion band and music club.
                  Born from a passion for blending Indian Classical rhythms with
                  modern Rock and Pop beats, we exist to create an infectious,
                  genre-transcending sound that makes you say{" "}
                  <span className="text-white font-medium italic">"YoYo"</span>!
                </p>
                <p>
                  More than just a band, we are a movement. We provide a
                  platform for students to de-stress, build confidence, and find
                  their unique musical identity.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 sm:mt-10">
                {/* Artists Section */}
                <div className="flex items-center space-x-4 px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] backdrop-blur-sm">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-lolo-pink/10 flex items-center justify-center flex-shrink-0">
                    {/* Changed Music -> Mic2 to represent the Artist/Performer */}
                    <Mic2 size={20} className="text-lolo-pink" />
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-white">
                      10+
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">
                      Artists
                    </div>
                  </div>
                </div>

                {/* Events Section */}
                <div className="flex items-center space-x-4 px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] backdrop-blur-sm">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-lolo-cyan/10 flex items-center justify-center flex-shrink-0">
                    {/* Changed Mic2 -> CalendarDays to represent the Event/Date */}
                    <CalendarDays size={20} className="text-lolo-cyan" />
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-white">
                      15+
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">
                      Events
                    </div>
                  </div>
                </div>

                {/* Productions Section */}
                <div className="flex items-center space-x-4 px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] backdrop-blur-sm">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-lolo-red/10 flex items-center justify-center flex-shrink-0">
                    {/* Changed Play -> Clapperboard to represent Production/Studio Work */}
                    <Users size={20} className="text-lolo-red" />
                  </div>
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-white">
                      25+
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">
                      Team Memebers
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="md:w-1/2 w-full mt-10 md:mt-0"
            >
              <div className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden group border border-white/5 shadow-2xl">
                {/* <video
                  autoPlay={true}
                  loop={true}
                  muted={true}
                  playsInline={true}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                >
                  <source src="/ee.mp4" type="video/mp4" />
                </video> */}

                <img src="/cover.jpg"></img>

                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>

                <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10">
                  <blockquote className="text-xl sm:text-3xl font-club text-white leading-relaxed mb-4 drop-shadow-lg">
                    "To grow together, <br /> we must{" "}
                    <span className="text-lolo-pink">play together</span>."
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="h-0.5 w-8 sm:w-12 bg-lolo-pink"></div>
                    <span className="text-xs sm:text-sm font-bold tracking-widest uppercase text-gray-400">
                      Our Philosophy
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- COLLEGE SECTION --- */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-16 sm:py-24">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/srkr/image.png" // Ensure this path is correct
            className="w-full h-full object-cover filter brightness-[0.3] scale-105"
            alt="SRKR Engineering College Campus"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-black/50 to-transparent"></div>
          {/* Subtle vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030303_100%)] opacity-80"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-left"
            >
              {/* Badges */}
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-3 py-1 rounded-full border border-white/20 bg-white/10 text-[10px] font-bold tracking-widest uppercase backdrop-blur-md">
                  Est. 1980
                </span>
                <span className="px-3 py-1 rounded-full border border-lolo-cyan/30 bg-lolo-cyan/10 text-lolo-cyan text-[10px] font-bold tracking-widest uppercase backdrop-blur-md">
                  NAAC A+ (3.42 CGPA)
                </span>
                <span className="px-3 py-1 rounded-full border border-white/20 bg-white/10 text-[10px] font-bold tracking-widest uppercase backdrop-blur-md">
                  Autonomous
                </span>
              </div>

              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight text-white drop-shadow-lg font-sans leading-tight">
                SRKR Engineering <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                  College
                </span>
              </h2>

              <p className="text-base sm:text-lg text-gray-300 mb-8 leading-relaxed font-light drop-shadow-md border-l-2 border-lolo-pink pl-6">
                Pioneering technical excellence for{" "}
                <strong className="text-white">45 years</strong>. Spanning 30
                acres of green land, we foster a creative, confident, and
                logical approach to nation-building. From the AICTE IDEA Lab to
                our Business Incubation Centre, we bridge the gap between
                academic rigor and entrepreneurial innovation.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-6 mb-10 border-t border-white/10 pt-8">
                <div>
                  <h4 className="text-3xl font-bold text-white">45</h4>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                    Years of Excellence
                  </p>
                </div>
                <div>
                  <h4 className="text-3xl font-bold text-white">14</h4>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                    Centres of Excellence
                  </p>
                </div>
                <div>
                  <h4 className="text-3xl font-bold text-white">Top 49</h4>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                    IDEA Labs in India
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <a
                  href="https://srkrec.edu.in"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-white text-black border-none rounded-full px-8 py-6 text-base font-bold hover:scale-105 transition-all ease-in-out shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                    Visit Official Website
                  </Button>
                </a>
                <div className="flex items-center gap-3 px-6 py-2 rounded-full border border-white/10 bg-black/20 backdrop-blur-sm">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/e/eb/All_India_Council_for_Technical_Education_logo.png"
                    className="h-8 opacity-80 grayscale hover:grayscale-0 transition-all"
                    alt="AICTE"
                  />
                  <div className="w-px h-8 bg-white/10"></div>
                  <span className="text-xs text-gray-400 font-medium">
                    UGC Approved
                    <br />
                    JNTUK Affiliated
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Right: Glass Card with Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              {/* Corrected Gradient Glow - using theme variables */}
              <div className="absolute -inset-1 bg-gradient-to-r from-lolo-pink/20 to-lolo-cyan/20 opacity-50 blur-2xl rounded-[2.5rem]"></div>

              <div className="relative p-10 rounded-[2.5rem] bg-neutral-900/60 backdrop-blur-xl border border-white/10 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Why We Thrive Here
                </h3>

                <ul className="space-y-6">
                  {[
                    {
                      title: "Research Hub",
                      desc: "Recognized as SIRO by Ministry of Science & Technology.",
                      icon: "🔬",
                    },
                    {
                      title: "Innovation",
                      desc: "MSME Business Incubation Centre & i-Hub for Startups.",
                      icon: "💡",
                    },
                    {
                      title: "Global Reach",
                      desc: "Collaborations with German Varsities & Indo-European Synchronization.",
                      icon: "🌍",
                    },
                    {
                      title: "Vibrant Campus",
                      desc: "Home to 20+ active clubs including Coding, Cine, and Music.",
                      icon: "🎭",
                    },
                  ].map((item, i) => (
                    <li key={i} className="flex gap-4 items-start">
                      <span className="flex-shrink-0 w-10 h-10 rounded-full bg-lolo-cyan/10 border border-lolo-cyan/20 flex items-center justify-center text-lg text-lolo-cyan">
                        {item.icon}
                      </span>
                      <div>
                        <h4 className="text-white font-bold text-sm">
                          {item.title}
                        </h4>
                        <p className="text-gray-400 text-sm leading-snug">
                          {item.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- WHY LOLO (FEATURES GRID) --- */}
      <section className="py-16 sm:py-24 md:py-32 bg-[#050505] relative z-20">
        <div className="max-w-7xl mx-auto px-5">
          <SectionHeader
            title={
              <>
                Why{" "}
                <span className="font-club text-lolo-pink text-4xl md:text-6xl ml-2 align-middle px-2">
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
                bg: "bg-lolo-pink/10",
                border: "border-lolo-pink/20",
                title: "Contemporary Fusion",
                desc: "Seamlessly blending genres for a refreshingly experimental sound that breaks traditional boundaries.",
              },
              {
                icon: Disc3,
                color: "text-lolo-cyan",
                bg: "bg-lolo-cyan/10",
                border: "border-lolo-cyan/20",
                title: "Immersive Soundscapes",
                desc: "Experience energetic rhythms and melodic storytelling crafted by the best talent.",
              },
              {
                icon: Award,
                color: "text-lolo-red",
                bg: "bg-lolo-red/10",
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
                className="group p-8 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm hover:backdrop-blur-xl hover:bg-white/[0.05] transition-all duration-500 relative overflow-hidden flex flex-col"
              >
                {/* Gradient Glow Blob */}
                <div
                  className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 ${feature.color.replace(
                    "text-",
                    "bg-"
                  )}`}
                />
                <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-5 mb-6 sm:mb-8">
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${feature.bg} flex items-center justify-center mb-4 sm:mb-0 group-hover:scale-110 transition-transform duration-500 border ${feature.border}`}
                  >
                    <feature.icon size={28} className={feature.color} />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {feature.title}
                    </h3>
                  </div>
                </div>
                <p className="text-gray-400 leading-relaxed text-sm sm:text-base font-light">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- OUR ECOSYSTEM --- */}
      {/* --- OUR ECOSYSTEM (UPDATED VISUALS) --- */}
      <section className="py-16 sm:py-24 md:py-32 bg-[#080808] relative z-20 overflow-hidden">
        {/* Ambient Background Glows */}
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-lolo-pink/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-lolo-cyan/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-5 relative z-10">
          <SectionHeader
            title={
              <>
                Our{" "}
                <span className="font-club text-lolo-pink text-4xl md:text-6xl ml-2 align-middle px-2">
                  Ecosystem
                </span>
              </>
            }
            subtitle="A unified platform where creativity meets management. Discover your role."
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Card 1: Music & Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group relative overflow-hidden rounded-[2.5rem] bg-[#0A0A0A] border border-white/5 flex flex-col h-full hover:border-lolo-pink/50 transition-all duration-500 hover:shadow-[0_0_50px_-12px_rgba(236,72,153,0.3)]"
            >
              {/* Card Background Texture */}
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

              {/* Header Gradient */}
              <div className="h-48 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-b from-lolo-pink/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(236,72,153,0.2),transparent_70%)] group-hover:scale-110 transition-transform duration-700" />

                {/* Icon Container */}
                <div className="relative z-10 w-20 h-20 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-md group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 group-hover:border-lolo-pink/30">
                  <Music
                    size={36}
                    className="text-lolo-pink drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]"
                  />
                </div>
              </div>

              <div className="p-10 flex-grow flex flex-col relative z-10">
                <div className="mb-6">
                  <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-lolo-pink transition-colors duration-300">
                    Music & Performance
                  </h3>
                  <div className="h-0.5 w-12 bg-white/10 rounded-full group-hover:w-24 group-hover:bg-lolo-pink transition-all duration-500" />
                </div>

                <p className="text-gray-400 mb-8 text-lg font-light leading-relaxed flex-grow">
                  From the recording studio to the main stage. Join a community
                  of vocalists, instrumentalists, and producers shaping the
                  campus sound.
                </p>

                <div className="flex flex-wrap gap-3 mt-auto">
                  {["Live Concerts", "Film Scoring", "Jam Sessions"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm text-gray-300 group-hover:border-lolo-pink/20 group-hover:bg-lolo-pink/5 transition-colors cursor-default"
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </div>
            </motion.div>

            {/* Card 2: Management & Ops */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group relative overflow-hidden rounded-[2.5rem] bg-[#0A0A0A] border border-white/5 flex flex-col h-full hover:border-lolo-cyan/50 transition-all duration-500 hover:shadow-[0_0_50px_-12px_rgba(34,211,238,0.3)]"
            >
              {/* Card Background Texture */}
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

              {/* Header Gradient */}
              <div className="h-48 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-b from-lolo-cyan/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.2),transparent_70%)] group-hover:scale-110 transition-transform duration-700" />

                {/* Icon Container */}
                <div className="relative z-10 w-20 h-20 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 group-hover:border-lolo-cyan/30">
                  <Users
                    size={36}
                    className="text-lolo-cyan drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                  />
                </div>
              </div>

              <div className="p-10 flex-grow flex flex-col relative z-10">
                <div className="mb-6">
                  <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-lolo-cyan transition-colors duration-300">
                    Management & Ops
                  </h3>
                  <div className="h-0.5 w-12 bg-white/10 rounded-full group-hover:w-24 group-hover:bg-lolo-cyan transition-all duration-500" />
                </div>

                <p className="text-gray-400 mb-8 text-lg font-light leading-relaxed flex-grow">
                  The architects of experience. Master the art of event
                  planning, team leadership, and marketing in a real-world
                  environment.
                </p>

                <div className="flex flex-wrap gap-3 mt-auto">
                  {[
                    "Event Planning & Organising",
                    "Team Leadership",
                    "Marketing",
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-sm text-gray-300 group-hover:border-lolo-cyan/20 group-hover:bg-lolo-cyan/5 transition-colors cursor-default"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-16 flex justify-center">
            <Link to="/team" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto px-10 py-6 rounded-full bg-white text-black font-bold text-lg hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300 ease-in-out border-none group">
                View Our Team
                <ArrowRight
                  size={20}
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* --- CREDIT SYSTEM --- */}
      <section className="py-16 sm:py-24 md:py-32 bg-[#050505] border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[400px] bg-lolo-pink/5 blur-[120px] rounded-full pointer-events-none" />
        <SectionHeader
          title={
            <>
              Rise Through The{" "}
              <span className="font-club text-lolo-pink text-4xl md:text-6xl ml-2 align-middle px-2">
                Ranks
              </span>
            </>
          }
          subtitle="Earn credits, unlock perks, and build your legacy."
        />

        {/* title="Rise Through The Ranks" */}

        <AnimatedRanks />
      </section>

      {/* --- TIMELINE SECTION --- */}
      <section className="bg-[#030303] relative z-20">
        <Timeline data={timelineData} />
      </section>

      {/* --- FOOTER CTA --- */}
      <section className="py-16 sm:py-24 md:py-32 bg-black relative flex items-center justify-center z-20 overflow-hidden border-t border-white/10 px-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.15),transparent_70%)] pointer-events-none" />
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <SectionHeader
            title={
              <>
                Join the{" "}
                <span className="font-club text-lolo-pink text-4xl md:text-6xl ml-2 align-middle px-2">
                  Family
                </span>
              </>
            }
            subtitle="Your musical journey starts here. Join us and make some noise!"
          />
          <Link to="/signup">
            <Button className="w-full sm:w-auto px-10 sm:px-14 py-6 sm:py-8 rounded-full border text-white text-lg sm:text-xl font-bold hover:shadow-[0_0_60px_rgba(236,72,153,0.5)] transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

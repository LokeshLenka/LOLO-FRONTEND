import React, { useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  Music,
  Users,
  Mic2,
  Disc3,
  Award,
  Headphones,
  CalendarDays,
  ArrowUpRight,
  Zap,
} from "lucide-react";
import { Button } from "@heroui/button";

// Internal Component Imports
import SectionHeader from "@/components/HomeSectionHeader";
// import AnimatedRanks from "@/components/AnimatedRanks";
import { Timeline } from "@/components/Timeline";

// --- CONFIGURATION & DATA ---
const STATS = [
  {
    label: "Active Artists",
    value: "10+",
    icon: Mic2,
    color: "text-lolo-pink",
  },
  {
    label: "Events Hosted",
    value: "15+",
    icon: CalendarDays,
    color: "text-lolo-cyan",
  },
  {
    label: "Team Members",
    value: "25+",
    icon: Users,
    color: "text-lolo-red",
  },
];

const FEATURES = [
  {
    title: "Contemporary Fusion",
    desc: "Seamlessly blending genres for a refreshingly experimental sound that breaks traditional boundaries.",
    icon: Headphones,
    icon_color: "text-lolo-pink",
  },
  {
    title: "Immersive Soundscapes",
    desc: "Experience energetic rhythms and melodic storytelling crafted by the best talent.",
    icon: Disc3,
    icon_color: "text-lolo-cyan",
  },
  {
    title: "Resonant Community",
    desc: "More than just music—it's about connecting audiences across generations.",
    icon: Award,
    icon_color: "text-lolo-red",
  },
];

const TIMELINE_DATA = [
  {
    title: "Formation",
    content: (
      <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
        SRKR LOLO began as a collective of passionate musicians wanting to
        bridge the gap between academic life and creative expression.
      </p>
    ),
  },
  {
    title: "Official Recognition",
    content: (
      <div className="space-y-4">
        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
          The college administration officially recognized SRKR LOLO as a
          legitimate Music Band & Club, establishing a structured era with
          Faculty Coordinators.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h4 className="text-white text-sm font-bold">Music Wing</h4>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">
              Concerts & Production
            </p>
          </div>
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h4 className="text-white text-sm font-bold">Management Wing</h4>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">
              Ops & Marketing
            </p>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "The Present",
    content: (
      <div className="space-y-4">
        <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
          A fully functional ecosystem producing music for short films,
          workshops, and major hackathons.
        </p>
      </div>
    ),
  },
];

// --- SUB-COMPONENTS ---

const Marquee = () => (
  <div className="relative flex overflow-hidden py-4 bg-white/1 border-y border-white/10 z-20">
    <div className="animate-marquee whitespace-nowrap flex gap-12 min-w-full relative z-10">
      {[...Array(10)].map((_, i) => (
        <span
          key={i}
          className="text-xs md:text-xl font-black uppercase tracking-widest flex items-center gap-4 text-white/80"
        >
          LIVING<span className="text-neutral-400">●</span>
          OUT<span className="text-neutral-400">●</span>
          LOUD <span className="text-neutral-400">●</span>
          ORIGINALS <span className="text-neutral-400">●</span>
        </span>
      ))}
    </div>
  </div>
);

const HeroSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Mouse Spotlight
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-[#000000]"
    >
      {/* 1. Dynamic Background (Neon Noir) */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-[#EC4899] rounded-full blur-[150px] mix-blend-screen animate-blob opacity-30" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-[#06B6D4] rounded-full blur-[150px] mix-blend-screen animate-blob animation-delay-2000 opacity-30" />
      </div>

      {/* 2. Noise Texture */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />

      {/* 3. Spotlight */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(236, 72, 153, 0.08), transparent 80%)`,
        }}
      />

      {/* 4. Content */}
      <motion.div
        style={{ y: yText, opacity: opacityText }}
        className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
        >
          <Zap size={14} className="text-lolo-pink fill-[#EC4899]" />
          <span className="text-xs font-bold tracking-widest text-white/90 uppercase">
            Official SRKR Music Club
          </span>
        </motion.div>

        {/* Animated Typography (Preserved) */}
        <div className="flex flex-col items-center w-full max-w-[95vw] mx-auto z-20 relative">
          {/* Line 1: LIVING OUT (Always one line) */}
          <h1 className="text-[14vw] sm:text-[10vw] leading-[1.15] sm:leading-[0.95] font-black tracking-[0.10rem] sm:tracking-[0.20rem] text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/50 mix-blend-overlay select-none text-center whitespace-nowrap">
            {["LIVING", "OUT"].map((word, i) => (
              <motion.span
                key={`l1-${i}`}
                className="inline-block mr-[2vw] sm:mr-[1.5vw]"
                initial={{ opacity: 0, y: 100, rotate: 5 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.1,
                }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* Line 2 & 3 Mobile / Line 2 Desktop */}
          <h1 className="text-[14vw] sm:text-[10vw] leading-[1.15] sm:leading-[0.95] font-black tracking-[0.10rem] sm:tracking-[0.20rem] text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/50 mix-blend-overlay select-none text-center">
            {/* LOUD: Block on mobile (forces line break), Inline on desktop */}
            <motion.span
              className="block sm:inline-block mr-0 sm:mr-[1.5vw]"
              initial={{ opacity: 0, y: 100, rotate: 5 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.2, // Delays after line 1
              }}
            >
              LOUD
            </motion.span>

            {/* ORIGINALS: Block on mobile (forces line break), Inline on desktop */}
            <motion.span
              className="block sm:inline-block"
              initial={{ opacity: 0, y: 100, rotate: 5 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.3, // Delays after LOUD
              }}
            >
              ORIGINALS
            </motion.span>
          </h1>
        </div>
        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-8 max-w-xl text-sm md:text-xl text-neutral-400 font-light"
        >
          Blending <span className="text-lolo-pink font-medium">cultures</span>{" "}
          and
          <span className="text-lolo-cyan font-medium"> hearts </span>
          , turning campus energy into music that lives beyond the stage.
          <br />
        </motion.p>
        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-10 w-full sm:w-auto px-4 sm:px-0"
        >
          <Link to="/signup" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-10 rounded-full bg-white text-black text-base sm:text-lg font-bold hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all border-none">
              Join the Community
            </Button>
          </Link>

          <Link to="/events" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-10 rounded-full bg-transparent text-white text-base sm:text-lg border border-white/20 hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              Explore Events
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

const AboutSection = () => (
  <section className="py-24 bg-[#000000] relative z-20">
    <div className="container mx-auto px-4 sm:px-6">
      <SectionHeader
        title={
          <>
            About <span className="font-club text-lolo-pink">LOLO</span>
          </>
        }
        subtitle="The story behind the sound."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-12">
        {/* Main Text Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-7 bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-8 sm:p-12 relative overflow-hidden group hover:border-white/20 transition-colors"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#EC4899]/5 blur-[80px] rounded-full group-hover:bg-[#EC4899]/10 transition-colors duration-700" />
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-6">
            More than a band
          </h3>
          <div className="space-y-6 text-neutral-400 text-md sm:text-lg font-light leading-relaxed">
            <p>
              <strong className="text-white font-medium">
                Living Out Loud Originals (LOLO)
              </strong>{" "}
              is SRKR's premier contemporary fusion ecosystem. Born from a
              passion for blending Indian Classical rhythms with modern Rock and
              Pop beats.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-10 pt-10 border-t border-white/5">
            {STATS.map((stat, idx) => (
              <div key={idx}>
                <div
                  className={`text-xl sm:text-3xl font-bold text-white mb-1`}
                >
                  {stat.value}
                </div>
                <div
                  className={`text-[8px] sm:text-xs uppercase tracking-wider font-medium ${stat.color}`}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Visual Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-5 relative rounded-[2rem] overflow-hidden min-h-[400px] border border-white/5"
        >
          <img
            src="/cover.jpg"
            alt="LOLO Live Performance"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105 opacity-80 hover:opacity-100"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/20 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            {/* <Sparkles className="text-lolo-cyan mb-4" size={16} /> */}
            <p className="text-sm sm:text-xl text-white font-club leading-snug">
              "To grow together, we must{" "}
              <span className="text-lolo-cyan">play together</span>."
            </p>
          </div>
        </motion.div>

        {/* Features Row */}
        {FEATURES.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + idx * 0.1 }}
            className="lg:col-span-4 bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-8 hover:border-white/20 transition-colors group flex flex-col gap-4"
          >
            {/* Header: Icon + Title */}
            <div className="flex flex-row items-center gap-5">
              <div
                className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)] shrink-0 ${feature.icon_color}`}
              >
                <feature.icon size={24} />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-white leading-tight">
                {feature.title}
              </h4>
            </div>

            {/* Description */}
            <p className="text-sm text-neutral-400 leading-relaxed">
              {feature.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const EcosystemSection = () => (
  <section className="py-32 bg-[#000000] relative z-20 border-t border-white/10">
    <div className="container mx-auto px-4 sm:px-6">
      <div className="mb-16 md:flex md:justify-between md:items-end">
        <div className="max-w-2xl">
          <SectionHeader
            title={
              <span>
                Our <span className="font-club text-[#06B6D4]">Ecosystem</span>
              </span>
            }
            subtitle="Where creativity meets management."
          />
        </div>
        <Link to="/team" className="hidden md:inline-block">
          <Button className="rounded-full bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-all">
            Meet the Team <ArrowRight size={16} className="ml-2" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          {
            title: "Music & Performance",
            icon: Music,
            desc: "Join vocalists and producers shaping the campus sound.",
            tags: ["Live Concerts", "Film Scoring"],
            color: "text-[#EC4899]",
            image:
              "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=2070&auto=format&fit=crop",
          },
          {
            title: "Management & Ops",
            icon: Users,
            desc: "Master event planning and marketing in a real-world environment.",
            tags: ["Event Planning", "Marketing"],
            color: "text-[#06B6D4]",
            image:
              "https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=2462&auto=format&fit=crop",
          },
        ].map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative h-[450px] rounded-[2.5rem] overflow-hidden bg-[#000000] border border-white/10 transition-all hover:border-white/30"
          >
            <div className="absolute inset-0 z-0">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-110 transition-all duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/80 to-transparent" />
            </div>

            <div className="absolute inset-0 p-10 flex flex-col justify-between z-10">
              <div className="flex justify-between items-start">
                <div
                  className={`p-4 rounded-2xl bg-[#000000]/60 border border-white/10 backdrop-blur-md group-hover:scale-110 transition-transform duration-500`}
                >
                  <card.icon size={32} className={card.color} />
                </div>
                <ArrowUpRight className="text-white group-hover:text-white transition-colors" />
              </div>

              <div>
                <h3 className="text-xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
                  {card.title}
                </h3>
                <p className="text-md sm:text-xl text-neutral-300 mb-8 font-light drop-shadow-md">
                  {card.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-full text-[9px] sm:text-sm font-medium bg-[#000000]/60 text-white/90 border border-white/20 backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Homev1: React.FC = () => {
  return (
    <div className="bg-[#000000] text-white w-full selection:bg-lolo-pink selection:text-white overflow-x-hidden font-poppins">
      <HeroSection />

      <Marquee />

      <AboutSection />

      <EcosystemSection />

      {/* <section className="py-24 bg-[#000000] border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#EC4899]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <SectionHeader
            title={
              <>
                Rise Through The{" "}
                <span className="font-club text-lolo-pink">Ranks</span>
              </>
            }
            subtitle="Earn credits, unlock perks, and build your legacy."
          />
          <div className="mt-12">
            <AnimatedRanks />
          </div>
        </div>
      </section> */}

      <section className="bg-[#000000] py-24 relative z-20">
        <Timeline data={TIMELINE_DATA} />
      </section>

      {/* UPDATED FOOTER CTA */}
      <section className="py-40 bg-[#000000] relative flex items-center justify-center z-20 overflow-hidden border-t border-white/10 px-5">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-30 pointer-events-none mix-blend-overlay"></div>
        {/* Glow behind the CTA */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#EC4899]/10 to-[#06B6D4]/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-6xl font-black text-white mb-6 leading-none">
              Join Now <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC4899] via-white to-[#06B6D4] animate-gradient-x">
                {/* Legacy. */}
              </span>
            </h2>
            <p className="text-md sm:text-lg text-neutral-400 mb-10 font-light max-w-2xl mx-auto">
              {/* Join the ecosystem where music meets management. */}
              Your musical journey starts here. Join us and make some noise!
            </p>
            <Link to="/signup">
              <Button className="px-4 sm:px-6 py-6 rounded-full bg-white text-black text-lg font-bold hover:scale-105 hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] transition-all duration-300 border-none">
                Get Started Now <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Homev1;

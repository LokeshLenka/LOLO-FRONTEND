import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Star, Zap, Music, Users, Calendar, Sparkles } from "lucide-react";

const Home: React.FC = () => {
  const containerRef = useRef(null);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
    hover: {
      y: -10,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div ref={containerRef} className="w-full">
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen flex items-center justify-center pt-32 px-4 md:px-0"
      >
        <div className="relative max-w-5xl mx-auto text-center">
          {/* Hero glow effect */}
          <motion.div
            animate={{
              background: [
                "radial-gradient(circle at 30% 50%, rgba(0,217,255,0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 70% 50%, rgba(255,0,255,0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 30% 50%, rgba(0,217,255,0.3) 0%, transparent 50%)",
              ],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute inset-0 rounded-full blur-3xl -z-10"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span
              className="inline-block px-4 py-2 rounded-full mb-6 text-sm font-semibold"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "#00D9FF",
              }}
            >
              Welcome to SRKR LOLO
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            style={{
              backgroundImage: "linear-gradient(to right, #00D9FF, white, #FF00FF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Experience Music Like Never Before
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Join India&apos;s most vibrant music community. Discover events, connect with artists, and create unforgettable memories.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255,0,255,0.6)" }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-xl text-white font-bold text-lg transition-all duration-300"
              style={{
                background: "linear-gradient(to right, #00D9FF, #FF00FF)",
              }}
            >
              Explore Events
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-xl text-white font-bold text-lg transition-all duration-300"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(0, 217, 255, 0.5)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255, 255, 255, 0.3)";
              }}
            >
              Learn More
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 text-white/60">
            <span className="text-sm">Scroll to explore</span>
            <div className="w-6 h-10 border border-white/30 rounded-full flex items-start justify-center p-2">
              <motion.div
                className="w-1 h-2 rounded-full"
                style={{ background: "#00D9FF" }}
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-20 px-4 md:px-0"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{
                backgroundImage: "linear-gradient(to right, #00D9FF, #FF00FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Why Choose SRKR LOLO?
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Discover the platform built for music lovers and passionate artists
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Sparkles,
                title: "Live Events",
                description: "Experience world-class concerts and performances",
              },
              {
                icon: Users,
                title: "Community",
                description: "Connect with thousands of music enthusiasts",
              },
              {
                icon: Music,
                title: "Artist Hub",
                description: "Platform for emerging and established artists",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true }}
                className="p-8 rounded-2xl cursor-pointer group relative overflow-hidden transition-all duration-300"
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <div
                  className="absolute inset-0 transition-all duration-300"
                  style={{
                    background: "linear-gradient(to bottom right, rgba(0,217,255,0), rgba(255,0,255,0))",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "linear-gradient(to bottom right, rgba(0,217,255,0.1), rgba(255,0,255,0.1))";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "linear-gradient(to bottom right, rgba(0,217,255,0), rgba(255,0,255,0))";
                  }}
                />
                <div className="relative z-10">
                  <div
                    className="mb-4 p-3 rounded-lg w-fit"
                    style={{
                      background: "linear-gradient(to bottom right, rgba(0,217,255,0.2), rgba(255,0,255,0.2))",
                    }}
                  >
                    <feature.icon className="w-6 h-6" style={{ color: "#00D9FF" }} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                  <p className="text-white/70">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Events Showcase */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-20 px-4 md:px-0"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{
                backgroundImage: "linear-gradient(to right, #FF00FF, #00D9FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Upcoming Events
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((event, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5, boxShadow: "0 0 40px rgba(255,0,255,0.3)" }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="rounded-2xl overflow-hidden group cursor-pointer"
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <div
                  className="h-48 flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: "linear-gradient(to bottom right, rgba(0,217,255,0.2), rgba(255,0,255,0.2))",
                  }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute w-32 h-32 rounded-full blur-2xl opacity-30"
                    style={{
                      background: "linear-gradient(to right, #00D9FF, #FF00FF)",
                    }}
                  />
                  <Calendar className="w-16 h-16 relative z-10" style={{ color: "#FF00FF" }} />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-white">Event {event}</h3>
                  <p className="text-white/70 mb-4">Premium music experience with top artists and performers</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold" style={{ color: "#00D9FF" }}>
                      12 Apr, 2025
                    </span>
                    <motion.button whileHover={{ x: 5 }} style={{ color: "#FF00FF" }}>
                      →
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Ecosystem Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-20 px-4 md:px-0"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{
                backgroundImage: "linear-gradient(to right, #00D9FF, #FF00FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Our Ecosystem
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl p-8 md:p-12"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{
                      background: "linear-gradient(to bottom right, rgba(0,217,255,0.2), rgba(255,0,255,0.2))",
                    }}
                  >
                    <Zap className="w-6 h-6" style={{ color: "#00D9FF" }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-white">Event Management</h3>
                    <p className="text-white/70">Discover, book, and manage events seamlessly</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{
                      background: "linear-gradient(to bottom right, rgba(0,217,255,0.2), rgba(255,0,255,0.2))",
                    }}
                  >
                    <Star className="w-6 h-6" style={{ color: "#FF00FF" }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-white">Artist Network</h3>
                    <p className="text-white/70">Connect with talented performers and creators</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{
                      background: "linear-gradient(to bottom right, rgba(0,217,255,0.2), rgba(255,0,255,0.2))",
                    }}
                  >
                    <Users className="w-6 h-6" style={{ color: "#00D9FF" }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-white">Community Hub</h3>
                    <p className="text-white/70">Join discussions and share your passion for music</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{
                      background: "linear-gradient(to bottom right, rgba(0,217,255,0.2), rgba(255,0,255,0.2))",
                    }}
                  >
                    <Music className="w-6 h-6" style={{ color: "#FF00FF" }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-white">Content Library</h3>
                    <p className="text-white/70">Access exclusive videos, articles, and guides</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-20 px-4 md:px-0 mb-20"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="rounded-2xl p-12 text-center relative overflow-hidden"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <motion.div
              animate={{
                background: [
                  "radial-gradient(circle at 0% 0%, rgba(0,217,255,0.2) 0%, transparent 50%)",
                  "radial-gradient(circle at 100% 100%, rgba(255,0,255,0.2) 0%, transparent 50%)",
                  "radial-gradient(circle at 0% 0%, rgba(0,217,255,0.2) 0%, transparent 50%)",
                ],
              }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute inset-0"
            />
            <div className="relative z-10">
              <h2
                className="text-4xl font-bold mb-4"
                style={{
                  backgroundImage: "linear-gradient(to right, #00D9FF, #FF00FF)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Ready to Join?
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Be part of India&apos;s most exciting music community
              </p>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(255,0,255,0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 rounded-xl text-white font-bold text-lg transition-all duration-300"
                style={{
                  background: "linear-gradient(to right, #00D9FF, #FF00FF)",
                }}
              >
                Get Started Now
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;

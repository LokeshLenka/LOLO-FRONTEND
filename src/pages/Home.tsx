import React from "react";
import { Link } from "react-router-dom";
import { Music, Headphones, Mic2, Award, Play, Disc3 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@heroui/button";

// Import the FloatingLines component
// Make sure the path matches where you created the file
import FloatingLines from "../components/FloatingLines";

const Home: React.FC = () => {
  return (
    <>
      <div className="min-h-screen bg-black text-white w-full overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Background Layers */}
          <div className="absolute inset-0 z-0">
            {/* Musical instruments background image */}
            <div
              className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-20"
              style={{
                backgroundImage: "url('/musical-ins.png')",
                backgroundSize: "contain",
                backgroundPosition: "center",
                marginTop: "100px",
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-80"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,255,0.1),transparent_70%)]"></div>

            {/* Floating Lines Component added here */}
            <div className="absolute inset-0">
              <FloatingLines />
            </div>
          </div>

          <div className="flex justify-center mx-auto p-4 z-10 top-1/2 transform">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center "
            >
              <div className="mt-10 sm:mt-0">
                <div className="">
                  <h1 className="text-7xl sm:text-7xl md:text-8xl lg:text-8xl xl:text-9xl font-bold -rotate-6">
                    <span style={{ fontFamily: "'OdeErik'" }}>Unleash</span>
                  </h1>
                  <p className="text-4xl sm:text-5xl md:text-5xl text-center -rotate-6 -mt-4 sm:-mt-6">
                    <span style={{ fontFamily: "'OdeErik'" }}>
                      Your talent at
                    </span>
                  </p>
                </div>

                <p
                  className="text-5xl sm:text-6xl md:text-7xl text-center font-bold mb-6 sm:mb-8"
                  style={{ fontFamily: "'astro'" }}
                >
                  SRKR LOLO
                </p>
              </div>

              <p className="text-lg sm:text-xl md:text-2xl mt-6 sm:mt-8 md:mt-10 text-gray-300 max-w-2xl leading-relaxed">
                Make you say
                <span className="font-black bg-gradient-to-r from-lolo-pink via-lolo-cyan to-lolo-red bg-clip-text text-transparent">
                  {" "}
                  YoYo!{" "}
                </span>
                <br></br>
                Blending cultures and hearts, turning campus energy into music
                that lives beyond the stage.
              </p>

              <div className="flex flex-col sm:flex-row justify-start gap-3 sm:gap-4 mt-8 sm:mt-10 w-full">
                <Button className="w-[90%] sm:w-[40%] mx-auto border-2 border-lolo-pink px-6 sm:px-8 py-6 rounded-md hover:bg-lolo-pink/50 transition-all duration-300 bg-black/10 backdrop-blur-xs shadow-lg">
                  <Link to="/signup" className="text-base sm:text-lg">
                    Join LoLo
                  </Link>
                </Button>
                <Button className="w-[90%] sm:w-[40%] mx-auto border-2 border-lolo-cyan px-6 sm:px-8 py-6 rounded-md hover:bg-lolo-cyan/50 transition-all duration-300 bg-black/10 backdrop-blur-xs shadow-lg">
                  <Link to="/events" className="text-base sm:text-lg">
                    Explore Events
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Floating Musical Symbols */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Note 1 - Top Left */}
            <motion.div
              className="absolute top-20 left-10 text-lolo-pink opacity-35"
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Music size={24} />
            </motion.div>

            {/* Note 2 - Top Right */}
            <motion.div
              className="absolute top-32 right-16 text-lolo-cyan opacity-40"
              animate={{
                y: [0, 15, 0],
                rotate: [0, -8, 8, 0],
                scale: [1, 0.9, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            >
              <Music size={20} />
            </motion.div>

            {/* Note 3 - Middle Left */}
            <motion.div
              className="absolute top-1/2 left-8 text-lolo-red opacity-30"
              animate={{
                y: [0, -25, 0],
                x: [0, 10, 0],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            >
              <Music size={28} />
            </motion.div>

            {/* Note 4 - Middle Right */}
            <motion.div
              className="absolute top-1/3 right-8 text-lolo-pink opacity-35"
              animate={{
                y: [0, 20, 0],
                x: [0, -15, 0],
                rotate: [0, -12, 12, 0],
              }}
              transition={{
                duration: 9,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 3,
              }}
            >
              <Music size={22} />
            </motion.div>

            {/* Note 5 - Bottom Left */}
            <motion.div
              className="absolute bottom-40 left-20 text-lolo-cyan opacity-32"
              animate={{
                y: [0, -30, 0],
                rotate: [0, 15, -15, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 4,
              }}
            >
              <Music size={26} />
            </motion.div>

            {/* Note 6 - Bottom Right */}
            <motion.div
              className="absolute bottom-32 right-12 text-lolo-red opacity-37"
              animate={{
                y: [0, 25, 0],
                rotate: [0, -15, 15, 0],
                scale: [1, 0.8, 1],
              }}
              transition={{
                duration: 6.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 5,
              }}
            >
              <Music size={24} />
            </motion.div>

            {/* Headphones Symbol - Center Left */}
            <motion.div
              className="absolute top-3/8 left-90 text-lolo-pink opacity-38"
              animate={{
                y: [0, -20, 0],
                rotate: [0, -10, 10, 0],
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 8.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              }}
            >
              <Headphones size={30} />
            </motion.div>

            <motion.div
              className="absolute bottom-1/5 right-90 text-lolo-pink opacity-38"
              animate={{
                y: [0, -20, 0],
                rotate: [0, -10, 10, 0],
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 8.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              }}
            >
              <Headphones size={30} />
            </motion.div>

            <motion.div
              className="absolute bottom-0 left-90 text-lolo-pink opacity-38"
              animate={{
                y: [0, -20, 0],
                rotate: [0, -10, 10, 0],
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 8.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              }}
            >
              <Headphones size={30} />
            </motion.div>

            {/* Musical Note Symbol - Top Center */}
            <motion.div
              className="absolute top-16 left-1/2 transform -translate-x-1/2 text-lolo-cyan opacity-36"
              animate={{
                y: [0, -15, 0],
                rotate: [0, 8, -8, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 7.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2.5,
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </motion.div>

            {/* Treble Clef Symbol - Center Right */}
            <motion.div
              className="absolute top-2/5 right-20 text-lolo-red opacity-33"
              animate={{
                y: [0, 18, 0],
                rotate: [0, -6, 6, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 9.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 3.5,
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </motion.div>

            <motion.div
              className="absolute top-3/5 left-20 text-lolo-red opacity-33"
              animate={{
                y: [0, 18, 0],
                rotate: [0, -6, 6, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 9.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 3.5,
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </motion.div>

            <motion.div
              className="absolute bottom-1/3 right-90 text-lolo-red opacity-33"
              animate={{
                y: [0, 18, 0],
                rotate: [0, -6, 6, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 9.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 3.5,
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </motion.div>
            {/* Small floating dots for extra ambiance */}
            <motion.div
              className="absolute top-40 left-1/4 w-2 h-2 bg-lolo-pink rounded-full opacity-50"
              animate={{
                y: [0, -40, 0],
                opacity: [0.5, 0.2, 0.5],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute top-60 right-1/3 w-1.5 h-1.5 bg-lolo-cyan rounded-full opacity-45"
              animate={{
                y: [0, 35, 0],
                opacity: [0.45, 0.15, 0.45],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            />
            <motion.div
              className="absolute bottom-60 left-1/3 w-2 h-2 bg-lolo-red rounded-full opacity-40"
              animate={{
                y: [0, -30, 0],
                opacity: [0.4, 0.1, 0.4],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 4,
              }}
            />
          </div>

          {/* ANIMATED CIRCLES REMOVED HERE */}
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-900">
          <div className="min- mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What is{" "}
                <span className="font-black bg-gradient-to-r from-lolo-pink via-lolo-cyan to-lolo-red bg-clip-text text-transparent">
                  LOLO
                </span>{" "}
                ?
              </h2>
              <div className="w-52 h-1 bg-lolo-pink mx-auto flex self-center"></div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="card group"
              >
                <div className="w-16 h-16 rounded-full bg-lolo-pink bg-opacity-20 flex items-center justify-center mb-6 group-hover:bg-opacity-30 transition-all duration-300">
                  <Headphones size={32} className="text-lolo-pink" />
                </div>
                <h3 className="text-xl font-bold mb-3">
                  Redefining Contemporary Fusion
                </h3>
                <p className="text-gray-400">
                  Seamlessly blending genres for a refreshingly experimental
                  sound.
                </p>
              </motion.div>

              {/* Feature 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="card group"
              >
                <div className="w-16 h-16 rounded-full bg-lolo-cyan bg-opacity-20 flex items-center justify-center mb-6 group-hover:bg-opacity-30 transition-all duration-300">
                  <Disc3 size={32} className="text-lolo-cyan" />
                </div>
                <h3 className="text-xl font-bold mb-3">
                  Immersive Soundscapes{" "}
                </h3>
                <p className="text-gray-400">
                  Energetic rhythms, melodic storytelling, and bold
                  experimentation.
                </p>
              </motion.div>

              {/* Feature 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="card group"
              >
                <div className="w-16 h-16 rounded-full bg-lolo-red bg-opacity-20 flex items-center justify-center mb-6 group-hover:bg-opacity-30 transition-all duration-300">
                  <Award size={32} className="text-lolo-red" />
                </div>
                <h3 className="text-xl font-bold mb-3">Music That Resonates</h3>
                <p className="text-gray-400">
                  Connecting audiences across generations and backgrounds
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 bg-black">
          <div className="min- mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="md:w-1/2"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  About <span className="gradient-text">LoLo</span> Music
                </h2>
                <p className="text-gray-300 mb-6">
                  Founded in 2024, LoLo Music is revolutionizing how people
                  experience and interact with music. Our platform combines
                  cutting-edge technology with a passion for musical artistry to
                  create an immersive experience that makes you say "YoYo" with
                  excitement.
                </p>
                <p className="text-gray-300 mb-6">
                  We believe music is more than just sound—it's a journey, a
                  community, and a way of life. That's why we've built a
                  platform that not only delivers exceptional audio quality but
                  also connects artists with fans in meaningful ways.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-full bg-lolo-pink bg-opacity-20 flex items-center justify-center">
                      <Music size={20} className="text-lolo-pink" />
                    </div>
                    <span className="text-gray-300">10M+ Tracks</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-full bg-lolo-cyan bg-opacity-20 flex items-center justify-center">
                      <Mic2 size={20} className="text-lolo-cyan" />
                    </div>
                    <span className="text-gray-300">50K+ Artists</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-full bg-lolo-red bg-opacity-20 flex items-center justify-center">
                      <Play size={20} className="text-lolo-red" />
                    </div>
                    <span className="text-gray-300">24/7 Streaming</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="md:w-1/2"
              >
                <div className="relative">
                  <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-lolo-pink via-lolo-cyan to-lolo-red opacity-30 blur-lg"></div>
                  <div className="relative aspect-video rounded-xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                      alt="Music Studio"
                      className=" h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-lolo-pink bg-opacity-80 flex items-center justify-center cursor-pointer hover:bg-opacity-100 transition-all duration-300">
                        <Play size={36} className="text-white ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* College Section */}
        <section className="py-20 bg-gray-900 relative overflow-hidden">
          <div className="min- mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Left: College Image Area (2/3 width on large screens) */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="lg:col-span-2"
              >
                <a
                  href="https://srkrec.edu.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all duration-300">
                    <img
                      src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                      alt="SRKR College Campus"
                      className=" h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-white text-xl font-bold mb-2">
                        SRKR Engineering College
                      </h3>
                      <p className="text-gray-300 text-sm">
                        Click to visit our website
                      </p>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="w-12 h-12 bg-lolo-pink bg-opacity-80 rounded-full flex items-center justify-center group-hover:bg-opacity-100 transition-all duration-300">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </a>
              </motion.div>

              {/* Right: Parallax Content Area (1/3 width on large screens) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="lg:col-span-1"
              >
                <div className="relative h-full min-h-[400px] bg-gradient-to-br from-lolo-pink/20 via-lolo-cyan/20 to-lolo-red/20 rounded-xl p-8 backdrop-blur-sm border border-white/10">
                  {/* Parallax effect background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-lolo-pink/10 via-transparent to-lolo-red/10 rounded-xl opacity-50"></div>

                  <div className="relative z-10 h-full flex flex-col justify-center">
                    <h3 className="text-2xl font-bold mb-6 gradient-text">
                      Campus Life at SRKR
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-lolo-pink bg-opacity-30 flex items-center justify-center">
                          <Music size={18} className="text-white mx-auto" />
                        </div>
                        <span className="text-gray-300">Music & Arts</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-lolo-cyan bg-opacity-30 flex items-center justify-center">
                          <Award size={18} className="text-white mx-auto" />
                        </div>
                        <span className="text-gray-300">
                          Academic Excellence
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-lolo-red bg-opacity-30 flex items-center justify-center">
                          <Mic2 size={18} className="text-white mx-auto" />
                        </div>
                        <span className="text-gray-300">Innovation Hub</span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mt-6">
                      Discover the vibrant campus life at SRKR Engineering
                      College, where tradition meets innovation.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-black relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,255,0.1),transparent_70%)]"></div>
          </div>

          <div className="min- mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Ready to Experience <span className="gradient-text">LoLo</span>?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of music lovers who have already discovered the
                future of music streaming.
              </p>
              <Link
                to="/register"
                className="btn btn-primary text-lg px-10 py-3"
              >
                Get Started Today
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;

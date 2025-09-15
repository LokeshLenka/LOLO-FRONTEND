import React from "react";
import { Link } from "react-router-dom";
import { Music, Headphones, Mic2, Award, Play, Disc3 } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "../components/Logo";

const Home: React.FC = () => {
  return (
    <>
      <div className="min-h-screen bg-black text-white w-full">
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-80"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,255,0.1),transparent_70%)]"></div>
          </div>

          {/* <Player
            autoplay
            loop
            src={musicNotes}
            style={{ width: "300px", height: "300px", position: "absolute", top: "20%", left: "10%" }}
          /> */}

          <div className="container mx-auto px-4 z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              {/* LOGO */}
              {/* <div className="flex justify-center mb-6">
                <Logo size={120} />
              </div> */}
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="gradient-text">SRKR LOLO</span> Music
                <br />
              </h1>
              <p className="text-lg">Living Out Loud Originals</p>
              <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
                Makes You Say "YoYo" - Experience music like never before with
                our revolutionary platform.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/register"
                  className="btn btn-primary text-lg px-8 py-3"
                >
                  Join LoLo
                </Link>
                <Link to="/blog" className="btn btn-outline text-lg px-8 py-3">
                  Explore Blog
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Animated circles */}
          <div className="absolute -bottom-60 sm:-bottom-64 md:-bottom-48 lg:-bottom-32 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] border-2 border-lolo-pink rounded-full animate-pulse-slow shadow-[0px_0px_50px_5px,inset_0px_0px_50px_5px] shadow-lolo-pink"></div>

          <div
            className="absolute -bottom-40 sm:-bottom-48 md:-bottom-36 lg:-bottom-20 left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] border-2 border-lolo-cyan rounded-full animate-pulse-slow shadow-[0px_0px_30px_3px,inset_0px_0px_30px_3px] shadow-lolo-cyan"
            style={{ animationDelay: "0.5s" }}
          ></div>

          <div
            className="absolute -bottom-20 sm:-bottom-40 md:-bottom-28 lg:-bottom-16 left-1/2 transform -translate-x-1/2 w-[400px] h-[400px] border border-lolo-red rounded-full animate-pulse-slow shadow-[0px_0px_20px_2px,inset_0px_0px_20px_2px] shadow-lolo-red"
            style={{ animationDelay: "1s" }}
          ></div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose <span className="gradient-text">LoLo</span>
              </h2>
              <div className="w-24 h-1 bg-lolo-pink mx-auto"></div>
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
                  Premium Sound Quality
                </h3>
                <p className="text-gray-400">
                  Experience crystal clear audio with our high-definition sound
                  technology that brings your music to life.
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
                <h3 className="text-xl font-bold mb-3">Exclusive Content</h3>
                <p className="text-gray-400">
                  Access exclusive tracks, remixes, and behind-the-scenes
                  content from your favorite artists.
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
                <h3 className="text-xl font-bold mb-3">Rewards Program</h3>
                <p className="text-gray-400">
                  Earn credits and upgrade your membership tier from Bronze to
                  Platinum for exclusive perks and benefits.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4">
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
                  Founded in 2025, LoLo Music is revolutionizing how people
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
                      className="w-full h-full object-cover"
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

        {/* Membership Tiers */}

        {/* CTA Section */}
        <section className="py-20 bg-black relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,255,0.1),transparent_70%)]"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
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

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Mail, Instagram, ArrowRight, ChevronDown } from "lucide-react";

const ContactUs = () => {
  const [role, setRole] = useState("Student");
  const [customRole, setCustomRole] = useState("");

  return (
    <section className="relative py-24 bg-[#030303] overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-lolo-cyan/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-lolo-pink/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left Side: Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col pt-4"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Let's Make Some <br />
              <span className="text-lolo-pink font-club">Noise Together</span>
            </h2>
            <p className="text-neutral-400 text-lg mb-12 leading-relaxed max-w-md">
              Whether you're a student wanting to audition, a brand looking to
              sponsor, or just a fan — we want to hear from you.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 group-hover:border-lolo-pink/30 transition-all duration-300">
                  <MapPin className="text-white w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">
                    Visit Us
                  </h3>
                  <p className="text-neutral-500 text-sm leading-relaxed">
                    SRKR Engineering College
                    <br />
                    Bhimavaram, Andhra Pradesh, 534204
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 group-hover:border-lolo-cyan/30 transition-all duration-300">
                  <Mail className="text-white w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">
                    Email Us
                  </h3>
                  <a
                    href="mailto:bandloloplays0707@gmail.com"
                    className="text-neutral-500 hover:text-lolo-cyan transition-colors text-sm"
                  >
                    bandloloplays0707@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 group-hover:border-pink-500/30 transition-all duration-300">
                  <Instagram className="text-white w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">Socials</h3>
                  <a
                    href="https://www.instagram.com/lolo.band.official/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-neutral-500 hover:text-pink-400 transition-colors text-sm"
                  >
                    @lolo.band.official
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Enhanced Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/[0.02] backdrop-blur-xl border border-white/5 p-8 md:p-10 rounded-[2.5rem]"
          >
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Name Input */}
                <div className="space-y-2 group relative">
                  <label className="text-xs uppercase tracking-wider font-bold text-neutral-500 group-focus-within:text-lolo-cyan transition-colors">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder-neutral-700 focus:outline-none focus:border-lolo-cyan transition-colors duration-300"
                    placeholder="Jane Doe"
                  />
                  {/* Animated Border Bottom */}
                  {/* <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-lolo-cyan transition-all duration-500 group-focus-within:w-full" /> */}
                </div>

                {/* Role Select */}
                <div className="space-y-2 group relative">
                  <label className="text-xs uppercase tracking-wider font-bold text-neutral-500 group-focus-within:text-lolo-cyan transition-colors">
                    I am a
                  </label>
                  <div className="relative">
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:outline-none focus:border-lolo-cyan transition-colors duration-300 appearance-none cursor-pointer"
                    >
                      <option className="bg-neutral-900 text-neutral-300">
                        Student
                      </option>
                      <option className="bg-neutral-900 text-neutral-300">
                        Musician
                      </option>
                      <option className="bg-neutral-900 text-neutral-300">
                        Faculty
                      </option>
                      <option className="bg-neutral-900 text-neutral-300">
                        Sponsor
                      </option>
                      <option className="bg-neutral-900 text-neutral-300">
                        Others
                      </option>
                    </select>
                    <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-600 pointer-events-none w-4 h-4 group-hover:text-white transition-colors" />
                  </div>
                  {/* <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-lolo-cyan transition-all duration-500 group-focus-within:w-full" /> */}
                </div>
              </div>

              {/* Dynamic Role Specification Input */}
              <AnimatePresence>
                {role === "Others" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-2 group relative">
                      <label className="text-xs uppercase tracking-wider font-bold text-lolo-pink group-focus-within:text-white transition-colors">
                        Please Specify Role
                      </label>
                      <input
                        type="text"
                        value={customRole}
                        onChange={(e) => setCustomRole(e.target.value)}
                        className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder-neutral-700 focus:outline-none focus:border-lolo-pink transition-colors duration-300"
                        placeholder="e.g. Alumni, Sound Engineer..."
                        autoFocus
                      />
                      {/* <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-lolo-pink transition-all duration-500 group-focus-within:w-full" /> */}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Input */}
              <div className="space-y-2 group relative">
                <label className="text-xs uppercase tracking-wider font-bold text-neutral-500 group-focus-within:text-lolo-cyan transition-colors">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder-neutral-700 focus:outline-none focus:border-lolo-cyan transition-colors duration-300"
                  placeholder="jane@example.com"
                />
                {/* <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-lolo-cyan transition-all duration-500 group-focus-within:w-full" /> */}
              </div>

              {/* Message Input */}
              <div className="space-y-2 group relative">
                <label className="text-xs uppercase tracking-wider font-bold text-neutral-500 group-focus-within:text-lolo-cyan transition-colors">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder-neutral-700 focus:outline-none focus:border-lolo-cyan transition-colors duration-300 resize-none leading-relaxed"
                  placeholder="Tell us about your project, idea, or just say hi..."
                />
                {/* <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-lolo-cyan transition-all duration-500 group-focus-within:w-full" /> */}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button className="group w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold text-sm hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all duration-300">
                  Send Message
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;

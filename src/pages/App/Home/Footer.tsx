import { Link } from "react-router-dom";
import { Instagram, Youtube, Mail, Phone, MapPin, Heart } from "lucide-react";
import { motion } from "framer-motion";
import Lolo_logo_1 from "@/assets/logos/Lolo_logo_1.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();



  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="relative pt-20 pb-8 px-4 md:px-0 border-t border-white/10"
    >
      {/* Gradient overlay background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan/5 to-neon-pink/5 pointer-events-none" />

      <div className="relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Main footer content */}
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand section */}
            <motion.div variants={itemVariants} className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={Lolo_logo_1}
                  alt="LoLo Logo"
                  className="h-10 w-10 object-contain drop-shadow-[0_0_8px_rgba(255,0,255,0.5)]"
                />
                <h3 className="text-lg font-bold text-white">SRKR LOLO</h3>
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-6">
                Empowering the next generation of campus artists through music, community, and creative expression.
              </p>

              {/* Social links */}
              <div className="flex gap-3">
                {[
                  {
                    icon: Instagram,
                    href: "https://www.instagram.com/lolo.band.official/",
                    label: "Instagram",
                  },
                  {
                    icon: Youtube,
                    href: "https://www.youtube.com/@LoLoBandOfficial",
                    label: "YouTube",
                  },
                ].map((social, idx) => (
                  <motion.a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-lg glassmorphic hover:glow-cyan-pink transition-all duration-300"
                  >
                    <social.icon size={18} className="text-cyan" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Platform links */}
            <motion.div variants={itemVariants}>
              <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-cyan to-neon-pink rounded-full" />
                Platform
              </h4>
              <ul className="space-y-2">
                {[
                  { label: "Home", link: "/" },
                  { label: "Events", link: "/events" },
                  { label: "Publications", link: "/publications" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.link}
                      className="text-white/70 hover:text-cyan transition-colors duration-300 text-sm"
                    >
                      → {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Community links */}
            <motion.div variants={itemVariants}>
              <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-neon-pink to-cyan rounded-full" />
                Community
              </h4>
              <ul className="space-y-2">
                {[
                  { label: "Team", link: "/team" },
                  { label: "Join the Club", link: "/signup" },
                  { label: "Contact", link: "/contact" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.link}
                      className="text-white/70 hover:text-neon-pink transition-colors duration-300 text-sm"
                    >
                      → {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact section */}
            <motion.div variants={itemVariants}>
              <h4 className="text-white font-bold mb-4">Contact Us</h4>
              <div className="space-y-3">
                <a
                  href="mailto:bandloloplays0707@gmail.com"
                  className="flex items-center gap-2 text-white/70 hover:text-cyan transition-colors text-sm"
                >
                  <Mail size={16} className="text-cyan" />
                  bandloloplays0707@gmail.com
                </a>
                <a
                  href="tel:+918333042318"
                  className="flex items-center gap-2 text-white/70 hover:text-cyan transition-colors text-sm"
                >
                  <Phone size={16} className="text-cyan" />
                  +91 8333042318
                </a>
                <div className="flex items-start gap-2 text-white/70 text-sm">
                  <MapPin size={16} className="text-cyan mt-0.5 flex-shrink-0" />
                  <div>
                    SRKR Engineering College
                    <br />
                    Bhimavaram, AP 534204
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8" />

          {/* Bottom footer */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row items-center justify-between gap-4 text-white/60 text-sm"
          >
            <div className="flex items-center gap-2">
              <span>&copy; {currentYear} SRKR LOLO Music Club</span>
              <Heart size={14} className="text-neon-pink" />
              <span>All rights reserved</span>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              {[
                { label: "Privacy Policy", link: "/privacy-policy" },
                { label: "Terms of Service", link: "/terms-of-service" },
              ].map((item, i) => (
                <Link
                  key={i}
                  to={item.link}
                  className="text-white/60 hover:text-cyan transition-colors duration-300"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="text-cyan">srkrlolo.in</div>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;

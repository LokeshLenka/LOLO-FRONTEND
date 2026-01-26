import { Link } from "react-router-dom";
import { Instagram, Youtube, Heart } from "lucide-react";
import Lolo_logo_1 from "@/assets/logos/Lolo_logo_1.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#020202] text-white border-t border-white/5 overflow-hidden pt-20">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-lolo-pink/5 blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          {/* Brand & Newsletter Column (Span 5) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md">
                <img
                  src={Lolo_logo_1}
                  alt="LoLo Logo"
                  className="h-6 w-6 object-contain"
                />
              </div>
              <span className="text-2xl font-bold tracking-tight">
                SRKR LOLO
              </span>
            </div>

            <p className="text-gray-400 leading-relaxed max-w-md font-light">
              Empowering the next generation of campus artists. We provide the
              stage, the studio, and the community you need to amplify your
              sound.
            </p>

            {/* Newsletter Input */}
            {/* <div className="max-w-md">
              <label className="block text-xs font-bold uppercase text-gray-500 mb-3 tracking-wider">
                Stay in the loop
              </label>
              <div className="flex group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-white/5 border border-white/10 border-r-0 rounded-l-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:bg-white/10 transition-colors"
                />
                <button className="bg-white text-black px-5 py-3 rounded-r-lg font-bold text-sm hover:bg-lolo-pink hover:text-white transition-colors flex items-center gap-2">
                  Join <ArrowRight size={16} />
                </button>
              </div>
            </div> */}
          </div>

          {/* Spacer Column (Span 1) */}
          <div className="hidden lg:block lg:col-span-1" />

          {/* Links Grid (Span 6) */}
          <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* Column 1 */}
            <div>
              <h4 className="font-bold text-white mb-6">Platform</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                {[
                  { id: 1, label: "Home", link: "/home" },
                  { id: 2, label: "Events", link: "/events" },
                  { id: 3, label: "Publications", link: "/publications" },
                ].map((item) => (
                  <li key={item.id}>
                    <Link
                      to={item.link}
                      className="hover:text-lolo-pink transition-colors block hover:translate-x-1 transform duration-300 ease-in-out"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h4 className="font-bold text-white mb-6">Community</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                {[
                  { id: 1, label: "Team", link: "/team" },
                  {
                    id: 2,
                    label: "Registration Status",
                    link: "/registration-status",
                  },
                  { id: 3, label: "Join the Club", link: "/signup" },
                ].map((item) => (
                  <li key={item.id}>
                    <Link
                      to={item.link}
                      className="hover:text-lolo-cyan transition-colors block hover:translate-x-1 transform duration-300 ease-in-out"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h4 className="font-bold text-white mb-6">Support</h4>
              <div className="flex gap-3">
                <ul className="space-y-4 text-sm text-gray-400">
                  {[
                    { id: 1, label: "About Us", link: "/about" },
                    { id: 2, label: "Contact Us", link: "/contact" },
                    { id: 3, label: "FAQ", link: "/faq" },
                  ].map((item) => (
                    <li key={item.id}>
                      <Link
                        to={item.link}
                        className="hover:text-lolo-pink transition-colors block hover:translate-x-1 transform duration-300 ease-in-out"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Column 4 */}
            <div>
              <h4 className="font-bold text-white mb-6">Socials</h4>
              <div className="flex gap-3">
                {[
                  // { icon: Twitter, href: "#" },
                  {
                    icon: Instagram,
                    href: "https://www.instagram.com/lolo.band.official/",
                  },
                  {
                    icon: Youtube,
                    href: "https://www.youtube.com/@LoLoBandOfficial",
                  },
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black hover:scale-110 transition-all duration-300"
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>&copy; {currentYear} SRKR LOLO. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <span className="flex items-center gap-1 text-gray-600">
              Made with{" "}
              <Heart size={10} className="fill-red-500 text-red-500" /> by{" "}
              <span className="text-gray-400">
                <Link
                  to="/tech-team"
                  className="hover:text-white transition-colors"
                >
                  {" "}
                  Tech Team
                </Link>
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* HIGHLIGHT EYE-CATCHING ELEMENT: Big Text at Bottom */}
      <div className="w-full overflow-hidden leading-none select-none opacity-10 pointer-events-none">
        <h1 className="text-[12vw] sm:text-[13vw] font-bold text-center tracking-tighter text-white whitespace-nowrap translate-y-[15%]">
          SRKR LOLO MUSIC
        </h1>
      </div>
    </footer>
  );
};

export default Footer;

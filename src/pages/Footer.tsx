import { Link } from "react-router-dom";
import { Twitter, Instagram, Youtube } from "lucide-react";
import Lolo_logo_1 from "../assets/logos/Lolo_logo_1.png";

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="min-w-full mx-auto px-4 py-8 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Column */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img src={Lolo_logo_1} alt="LoLo Logo" className="h-8 w-8" />
              <span className="text-xl font-bold gradient-text">SRKR LOLO</span>
            </div>
            <p className="text-gray-400">Makes You Say "YoYo"</p>
          </div>

          {/* Links Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-lolo-pink transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-gray-400 hover:text-lolo-pink transition-colors"
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-lolo-pink transition-colors hover:-translate-y-1 transform duration-200"
              >
                <Twitter size={24} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-lolo-pink transition-colors hover:-translate-y-1 transform duration-200"
              >
                <Instagram size={24} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-lolo-pink transition-colors hover:-translate-y-1 transform duration-200"
              >
                <Youtube size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} SRKR LOLO Music. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

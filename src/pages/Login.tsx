import LoginForm from "@/components/login-form";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#03a1b0] selection:text-white relative overflow-hidden flex flex-col items-center justify-center p-4 md:p-8">
      {/* Background Gradient Blob */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(3,161,176,0.15),transparent_70%)] blur-3xl"></div>
      </div>

      {/* Back Button */}
      <button
        className="z-50 absolute top-4 sm:top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
        onClick={() => navigate("/")}
      >
        <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 border border-white/5 transition-all">
          <ArrowLeft size={18} />
        </div>
        <span className="hidden sm:inline font-medium text-sm">
          Back to Home
        </span>
      </button>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl relative z-10 mt-10 sm:mt-0"
      >
        <LoginForm />
      </motion.div>

      {/* Footer Text */}
      <div className="mt-8 text-center text-xs text-gray-500 relative z-10">
        By continuing, you agree to our{" "}
        <a
          href="#"
          className="underline underline-offset-4 hover:text-[#03a1b0] transition-colors"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="#"
          className="underline underline-offset-4 hover:text-[#03a1b0] transition-colors"
        >
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}

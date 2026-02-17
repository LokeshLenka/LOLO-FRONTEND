import LoginForm from "@/components/login-form";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-lolo-pink/30 selection:text-white relative overflow-hidden flex flex-col items-center justify-center p-4 md:p-8">
      {/* Background Blobs */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-lolo-cyan/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[1500px] h-[500px] bg-lolo-pink/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Back Button */}
      <button
        className="z-50 absolute top-6 left-6 flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group"
        onClick={() => navigate("/")}
      >
        <div className="p-2.5 rounded-full bg-white/5 group-hover:bg-white/10 border border-white/5 transition-all">
          <ArrowLeft size={18} />
        </div>
        <span className="hidden sm:inline font-bold text-sm">Back to Home</span>
      </button>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl relative z-10 mt-14 sm:mt-0"
      >
        <LoginForm />
      </motion.div>

      
    </div>
  );
}

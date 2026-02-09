import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function GlobalLoader() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  // 1. Trigger on Route Changes
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); 
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // 2. Trigger on Axios Requests
  useEffect(() => {
    let activeRequests = 0;

    const reqInterceptor = axios.interceptors.request.use(
      (config) => {
        if (activeRequests === 0) {
          setLoading(true);
        }
        activeRequests++;
        return config;
      },
      (error) => {
        activeRequests--;
        if (activeRequests === 0) {
          setLoading(false);
        }
        return Promise.reject(error);
      },
    );

    const resInterceptor = axios.interceptors.response.use(
      (response) => {
        activeRequests--;
        if (activeRequests === 0) {
          setLoading(false);
        }
        return response;
      },
      (error) => {
        activeRequests--;
        if (activeRequests === 0) {
          setLoading(false);
        }
        return Promise.reject(error);
      },
    );

    return () => {
      axios.interceptors.request.eject(reqInterceptor);
      axios.interceptors.response.eject(resInterceptor);
    };
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#030303]/80 backdrop-blur-md"
        >
          <div className="flex flex-col items-center gap-6 relative">
            {/* Glow Effect behind spinner */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-lolo-pink/20 rounded-full blur-2xl pointer-events-none" />

            {/* Spinner Container */}
            <div className="relative bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl">
              <Loader2
                className="w-10 h-10 text-lolo-pink animate-spin"
                strokeWidth={2.5}
              />
            </div>

            {/* Text */}
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white text-xl font-black tracking-widest uppercase relative z-10"
            >
              SRKR <span className="text-lolo-pink">LOLO</span>
            </motion.h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

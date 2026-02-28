import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  lazy,
  Suspense,
} from "react";
import axios, { AxiosError } from "axios";
import { motion, AnimatePresence } from "framer-motion";

// Lazy load the modern QR Scanner
const QrScanner = lazy(() =>
  import("@yudiel/react-qr-scanner").then((module) => ({
    default: module.Scanner,
  })),
);

// --- Types ---
type Status =
  | "idle"
  | "loading"
  | "success"
  | "warning"
  | "error"
  | "network_error";

interface TicketData {
  ticket_code: string;
  reg_num: string;
  is_verified: boolean;
  verified_at?: string;
}

// --- Audio & Haptics Hook ---
const useFeedback = () => {
  const sounds = useRef<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    sounds.current = {
      success: new Audio("/sounds/success.mp3"),
      warning: new Audio("/sounds/warning.mp3"),
      error: new Audio("/sounds/error.mp3"),
    };
    Object.values(sounds.current).forEach((audio) => {
      audio.load();
      audio.volume = 0.8;
    });
  }, []);

  const trigger = useCallback((type: "success" | "warning" | "error") => {
    if (sounds.current[type]) {
      sounds.current[type].currentTime = 0;
      sounds.current[type].play().catch(() => {});
    }
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      if (type === "success") navigator.vibrate(100);
      else if (type === "warning") navigator.vibrate([100, 50, 100]);
      else navigator.vibrate([50, 50, 50, 50, 50]);
    }
  }, []);

  return trigger;
};

// --- Main Component ---
export const TicketVerifier: React.FC = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [manualCode, setManualCode] = useState<string>("");

  const abortControllerRef = useRef<AbortController | null>(null);
  const lastScannedRef = useRef<{ code: string; time: number }>({
    code: "",
    time: 0,
  });
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const APP_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const triggerFeedback = useFeedback();

  const resetScanner = useCallback(() => {
    setStatus("idle");
    setTicketData(null);
    setErrorMessage("");
    setManualCode("");
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const verifyTicket = useCallback(
    async (ticketCode: string) => {
      const now = Date.now();

      if (status === "loading") return;
      if (
        lastScannedRef.current.code === ticketCode &&
        now - lastScannedRef.current.time < 2000
      )
        return;

      lastScannedRef.current = { code: ticketCode, time: now };
      setStatus("loading");

      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();

      try {
        const response = await axios.put(
          `${APP_BASE_URL}/verify-ticket/${ticketCode}`,
          {},
          {
            signal: abortControllerRef.current.signal,
            timeout: 5000,
          },
        );

        // If axios didn't throw an error, it's a 200 OK.
        // Meaning: Laravel successfully processed and updated the valid ticket!

        // Flexibly extract the data regardless of how Laravel wraps it (data.data vs data)
        const returnedTicket = response.data?.data || response.data;

        setTicketData(returnedTicket);
        setStatus("success");
        triggerFeedback("success");
        resetTimerRef.current = setTimeout(resetScanner, 3000);
      } catch (error) {
        if (axios.isCancel(error)) return;

        const axiosError = error as AxiosError<any>;

        if (axiosError.response) {
          const statusCode = axiosError.response.status;
          const backendMessage =
            axiosError.response.data?.message || "Invalid Ticket Code";

          // Laravel verifyTicket() throws a 403 if it's already verified
          if (statusCode === 403) {
            setStatus("warning");
            setErrorMessage(backendMessage);
            triggerFeedback("warning");

            // If your backend returns the ticket data inside the error payload, set it here
            if (axiosError.response.data?.data) {
              setTicketData(axiosError.response.data.data);
            }
          }
          // Laravel firstOrFail() throws a 404 if ticket doesn't exist
          else {
            setStatus("error");
            setErrorMessage(backendMessage);
            triggerFeedback("error");
          }
        } else if (
          axiosError.code === "ECONNABORTED" ||
          axiosError.message.includes("timeout")
        ) {
          setStatus("network_error");
          setErrorMessage("Network timeout. Please retry.");
          triggerFeedback("error");
        } else {
          setStatus("network_error");
          setErrorMessage("Network error. Check connection.");
          triggerFeedback("error");
        }
      }
    },
    [status, triggerFeedback, resetScanner, APP_BASE_URL],
  );

  useEffect(() => {
    if (manualCode.length >= 6) {
      const handler = setTimeout(() => verifyTicket(manualCode), 300);
      return () => clearTimeout(handler);
    }
  }, [manualCode, verifyTicket]);

  return (
    <div className="flex flex-col h-screen w-full bg-gray-900 text-white font-sans overflow-hidden">
      <header className="flex justify-between items-center p-4 bg-gray-800 shadow-md z-10">
        <div>
          <h1 className="text-xl font-bold tracking-wider text-blue-400">
            LOLO <span className="text-sm text-gray-400">by SRKR</span>
          </h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest">
            Boarding Gate
          </p>
        </div>
      </header>

      <main className="flex-1 relative flex flex-col items-center justify-center p-4">
        {/* Scanner View */}
        <div
          className={`relative w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-2xl transition-opacity duration-300 ${status !== "idle" && status !== "loading" ? "opacity-0 pointer-events-none absolute" : "opacity-100"}`}
        >
          <Suspense
            fallback={
              <div className="w-full h-full bg-gray-800 animate-pulse flex items-center justify-center">
                Loading Camera...
              </div>
            }
          >
            <QrScanner
              onScan={(result) => {
                if (result && result.length > 0 && result[0].rawValue) {
                  verifyTicket(result[0].rawValue);
                }
              }}
              formats={["qr_code"]}
              components={{
                finder: false,
              }}
            />
          </Suspense>

          <div className="absolute inset-0 border-[3px] border-white/20 z-10 rounded-2xl pointer-events-none">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-blue-500/50 shadow-[0_0_15px_3px_rgba(59,130,246,0.5)] animate-[scan_2s_ease-in-out_infinite]" />
          </div>

          {status === "loading" && (
            <div className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center backdrop-blur-sm">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        <div
          className={`mt-8 w-full max-w-md transition-opacity duration-300 ${status !== "idle" ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        >
          <input
            ref={inputRef}
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value.toUpperCase())}
            placeholder="Or enter ticket code manually..."
            className="w-full bg-gray-800 text-white px-6 py-4 rounded-xl border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none text-center font-mono text-lg transition-all placeholder:text-gray-500 uppercase"
            disabled={status !== "idle"}
          />
        </div>

        <AnimatePresence>
          {(status === "success" ||
            status === "warning" ||
            status === "error" ||
            status === "network_error") && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={
                status === "error"
                  ? { opacity: 1, scale: 1, x: [-10, 10, -10, 10, 0] }
                  : { opacity: 1, scale: 1 }
              }
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className={`absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center ${
                status === "success"
                  ? "bg-green-600"
                  : status === "warning"
                    ? "bg-yellow-500 text-gray-900"
                    : "bg-red-600"
              }`}
            >
              {status === "success" && <div className="css-confetti-burst" />}

              <div className="mb-6">
                {status === "success" && (
                  <svg
                    className="w-32 h-32 mx-auto drop-shadow-lg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
                {status === "warning" && (
                  <svg
                    className="w-32 h-32 mx-auto drop-shadow-lg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                )}
                {(status === "error" || status === "network_error") && (
                  <svg
                    className="w-32 h-32 mx-auto drop-shadow-lg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </div>

              <h2 className="text-4xl font-bold mb-2 drop-shadow-md">
                {status === "success"
                  ? "Verified Successfully"
                  : status === "warning"
                    ? "Already Verified"
                    : status === "network_error"
                      ? "Network Error"
                      : "Invalid Ticket"}
              </h2>

              {ticketData && (
                <div className="mt-8 bg-black/20 p-6 rounded-2xl backdrop-blur-sm w-full max-w-sm border border-white/10">
                  <p className="text-sm uppercase tracking-wider opacity-80 mb-1">
                    Reg Number
                  </p>
                  <p className="text-3xl font-mono font-bold mb-4">
                    {ticketData.reg_num}
                  </p>

                  <p className="text-sm uppercase tracking-wider opacity-80 mb-1">
                    Ticket Code
                  </p>
                  <p className="text-xl font-mono">{ticketData.ticket_code}</p>
                </div>
              )}

              {errorMessage && status !== "warning" && (
                <p className="mt-6 text-xl bg-black/30 px-6 py-3 rounded-xl">
                  {errorMessage}
                </p>
              )}

              <button
                onClick={resetScanner}
                className={`mt-10 px-10 py-4 rounded-full font-bold text-xl shadow-lg transition-transform active:scale-95 ${
                  status === "warning"
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-900"
                }`}
              >
                {status === "network_error"
                  ? "Retry Scanner"
                  : "Scan Next Ticket"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default TicketVerifier;

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
import { TicketCheck } from "lucide-react";

// Lazy load the QR scanner so gate page paints before camera lib parses
const QrScanner = lazy(() =>
  import("@yudiel/react-qr-scanner").then((module) => ({
    default: module.Scanner,
  })),
);

// --- Types ---
type Status = "idle" | "loading" | "success" | "warning" | "error" | "network_error";

interface TicketData {
  ticket_code: string;
  reg_num: string;
  is_verified: boolean;
  verified_at?: string;
}

const AUTO_RESET_MS: Record<Exclude<Status, "idle" | "loading">, number> = {
  success: 1200,
  warning: 2000,
  error: 1500,
  network_error: 2500,
};

// --- Zero-asset audio feedback (WebAudio beeps, no mp3 fetches) ---
const useBeep = () => {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = () => {
    if (!ctxRef.current) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return null;
      ctxRef.current = new AC();
    }
    if (ctxRef.current.state === "suspended") {
      void ctxRef.current.resume();
    }
    return ctxRef.current;
  };

  const beep = useCallback((freq: number, at: number, dur: number) => {
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.001, ctx.currentTime + at);
    gain.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + at + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + at + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + at);
    osc.stop(ctx.currentTime + at + dur + 0.05);
  }, []);

  const trigger = useCallback(
    (type: "success" | "warning" | "error") => {
      if (type === "success") beep(880, 0, 0.12);
      else if (type === "warning") {
        beep(660, 0, 0.12);
        beep(660, 0.16, 0.12);
      } else {
        beep(220, 0, 0.25);
      }
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        if (type === "success") navigator.vibrate(60);
        else if (type === "warning") navigator.vibrate([80, 40, 80]);
        else navigator.vibrate([60, 60, 60]);
      }
    },
    [beep],
  );

  useEffect(() => {
    return () => {
      void ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
    };
  }, []);

  return trigger;
};

// --- Keep gate screen awake while on duty ---
const useWakeLock = () => {
  useEffect(() => {
    let lock: { release: () => Promise<void> } | null = null;
    let cancelled = false;

    const acquire = async () => {
      try {
        const nav = navigator as unknown as {
          wakeLock?: { request: (t: string) => Promise<{ release: () => Promise<void> }> };
        };
        if (!nav.wakeLock) return;
        const next = await nav.wakeLock.request("screen");
        if (cancelled) {
          await next.release();
          return;
        }
        lock = next;
      } catch {
        // Unsupported or denied — gate still works, screen may sleep
      }
    };

    const onVisible = () => {
      if (document.visibilityState === "visible") void acquire();
    };

    void acquire();
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
      void lock?.release().catch(() => {});
    };
  }, []);
};

// --- Main Component ---
export const TicketVerifier: React.FC = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [manualCode, setManualCode] = useState<string>("");

  // Refs (not state) for the hot scan path — no re-render churn, no stale closures
  const busyRef = useRef(false);
  const lastScannedRef = useRef<{ code: string; time: number }>({
    code: "",
    time: 0,
  });
  const abortRef = useRef<AbortController | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const APP_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const beep = useBeep();
  useWakeLock();

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const resetNow = useCallback(() => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    busyRef.current = false;
    setStatus("idle");
    setTicketData(null);
    setErrorMessage("");
    setManualCode("");
  }, []);

  const scheduleReset = useCallback(
    (next: Exclude<Status, "idle" | "loading">) => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
      resetTimerRef.current = setTimeout(() => {
        if (!mountedRef.current) return;
        resetNow();
      }, AUTO_RESET_MS[next]);
    },
    [resetNow],
  );

  const verifyTicket = useCallback(
    async (rawCode: string) => {
      const ticketCode = rawCode.trim().toUpperCase();
      if (!ticketCode || busyRef.current) return;

      const now = Date.now();
      if (
        lastScannedRef.current.code === ticketCode &&
        now - lastScannedRef.current.time < 2000
      ) {
        return;
      }
      lastScannedRef.current = { code: ticketCode, time: now };
      busyRef.current = true;
      setStatus("loading");

      abortRef.current?.abort();
      abortRef.current = new AbortController();

      try {
        const response = await axios.put(
          `${APP_BASE_URL}/verify-ticket/${ticketCode}`,
          {},
          {
            signal: abortRef.current.signal,
            timeout: 5000,
          },
        );

        if (!mountedRef.current) return;
        const returnedTicket = response.data?.data || response.data;
        setTicketData(returnedTicket);
        setStatus("success");
        beep("success");
        scheduleReset("success");
      } catch (error) {
        if (!mountedRef.current) return;
        if (axios.isCancel(error)) {
          busyRef.current = false;
          setStatus("idle");
          return;
        }

        const axiosError = error as AxiosError<any>;
        if (axiosError.response) {
          const statusCode = axiosError.response.status;
          const backendMessage =
            axiosError.response.data?.message || "Invalid Ticket Code";

          if (statusCode === 403) {
            setStatus("warning");
            setErrorMessage(backendMessage);
            if (axiosError.response.data?.data) {
              setTicketData(axiosError.response.data.data);
            }
            beep("warning");
            scheduleReset("warning");
          } else {
            setStatus("error");
            setErrorMessage(backendMessage);
            beep("error");
            scheduleReset("error");
          }
        } else if (
          axiosError.code === "ECONNABORTED" ||
          axiosError.message.includes("timeout")
        ) {
          setStatus("network_error");
          setErrorMessage("Network timeout. Please retry.");
          beep("error");
          scheduleReset("network_error");
        } else {
          setStatus("network_error");
          setErrorMessage("Network error. Check connection.");
          beep("error");
          scheduleReset("network_error");
        }
      }
    },
    [APP_BASE_URL, beep, scheduleReset],
  );

  const handleManualSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (manualCode.trim()) void verifyTicket(manualCode);
    },
    [manualCode, verifyTicket],
  );

  const showResult = status !== "idle" && status !== "loading";

  return (
    <div className="relative flex h-[calc(100dvh-6rem)] min-h-[540px] w-full flex-col bg-white font-sans text-zinc-950 dark:bg-[#101828] dark:text-white">
      {/* Compact header */}
      <header className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-[#344054] dark:bg-[#161F2E]">
        <div className="flex items-center gap-2">
          <TicketCheck className="h-5 w-5 text-[#7F56D9]" />
          <div>
            <h1 className="text-sm font-bold tracking-wider text-zinc-950 dark:text-[#F2F4F7]">
              GATE VERIFY
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 dark:text-[#667085]">
              LOLO · SRKR
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-3xl flex-1 grid-cols-1 content-center gap-4 overflow-y-auto p-4 md:grid-cols-2">
        {/* Scanner — stays mounted across scans, no remount cost */}
        <section className="relative aspect-square w-full overflow-hidden border border-zinc-300 bg-black dark:border-[#344054]">
          <Suspense
            fallback={
              <div className="flex h-full w-full animate-pulse items-center justify-center bg-zinc-100 text-sm text-zinc-500 dark:bg-[#1D2939] dark:text-[#98A2B3]">
                Loading camera…
              </div>
            }
          >
            <QrScanner
              onScan={(result) => {
                if (result && result.length > 0 && result[0].rawValue) {
                  void verifyTicket(result[0].rawValue);
                }
              }}
              onError={() => {}}
              formats={["qr_code"]}
              components={{ finder: false }}
            />
          </Suspense>

          {/* Lightweight corner viewfinder (no blur/shadow cost) */}
          <div className="pointer-events-none absolute inset-6">
            <span className="absolute left-0 top-0 h-8 w-8 border-l-4 border-t-4 border-[#7F56D9]" />
            <span className="absolute right-0 top-0 h-8 w-8 border-r-4 border-t-4 border-[#7F56D9]" />
            <span className="absolute bottom-0 left-0 h-8 w-8 border-b-4 border-l-4 border-[#7F56D9]" />
            <span className="absolute bottom-0 right-0 h-8 w-8 border-b-4 border-r-4 border-[#7F56D9]" />
            {!showResult && (
              <div className="absolute inset-x-0 top-0 h-[2px] animate-[scan_1.6s_ease-in-out_infinite] bg-[#9E77ED] shadow-[0_0_12px_2px_rgba(127,86,217,0.6)]" />
            )}
          </div>

          {status === "loading" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#7F56D9] border-t-transparent" />
            </div>
          )}
        </section>

        {/* Manual entry fallback */}
        <section className="flex flex-col justify-center gap-3">
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value.toUpperCase())}
              placeholder="TICKET CODE"
              autoComplete="off"
              disabled={status === "loading"}
              className="h-11 min-w-0 flex-1 rounded-none border border-zinc-300 bg-white px-3 text-center font-mono text-sm uppercase text-zinc-950 outline-none placeholder:text-zinc-400 focus:border-[#7F56D9] disabled:opacity-50 dark:border-[#344054] dark:bg-[#1D2939] dark:text-[#F2F4F7] dark:placeholder:text-[#667085]"
            />
            <button
              type="submit"
              disabled={status === "loading" || !manualCode.trim()}
              className="h-11 shrink-0 rounded-none bg-zinc-900 px-4 text-sm font-bold text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-[#7F56D9] dark:hover:bg-[#9E77ED]"
            >
              Verify
            </button>
          </form>
        </section>
      </main>

      {/* Full-screen animated result takeover */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={
              status === "error"
                ? { opacity: 1, scale: 1, x: [-10, 10, -10, 10, 0] }
                : { opacity: 1, scale: 1 }
            }
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.2 }}
            onClick={resetNow}
            className={`absolute inset-0 z-30 flex cursor-pointer flex-col items-center justify-center overflow-y-auto p-6 text-center ${
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
                  className="mx-auto h-32 w-32 drop-shadow-lg"
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
                  className="mx-auto h-32 w-32 drop-shadow-lg"
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
                  className="mx-auto h-32 w-32 drop-shadow-lg"
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

            <h2 className="mb-2 text-4xl font-bold drop-shadow-md">
              {status === "success"
                ? "Verified Successfully"
                : status === "warning"
                  ? "Already Verified"
                  : status === "network_error"
                    ? "Network Error"
                    : "Invalid Ticket"}
            </h2>

            {ticketData && (
              <div className="mt-8 w-full max-w-sm rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
                <p className="mb-1 text-sm uppercase tracking-wider opacity-80">
                  Reg Number
                </p>
                <p className="mb-4 font-mono text-3xl font-bold">
                  {ticketData.reg_num}
                </p>

                <p className="mb-1 text-sm uppercase tracking-wider opacity-80">
                  Ticket Code
                </p>
                <p className="font-mono text-xl">{ticketData.ticket_code}</p>
              </div>
            )}

            {errorMessage && status !== "warning" && (
              <p className="mt-6 rounded-xl bg-black/30 px-6 py-3 text-xl">
                {errorMessage}
              </p>
            )}

            <button
              onClick={resetNow}
              className={`mt-10 rounded-full px-10 py-4 text-xl font-bold shadow-lg transition-transform active:scale-95 ${
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
    </div>
  );
};

export default TicketVerifier;

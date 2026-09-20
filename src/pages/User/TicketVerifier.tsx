import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  lazy,
  Suspense,
} from "react";
import axios, { AxiosError } from "axios";
import {
  ScanLine,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  WifiOff,
  RotateCcw,
  TicketCheck,
} from "lucide-react";

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

interface Counts {
  verified: number;
  duplicate: number;
  invalid: number;
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

// --- Main Component ---
export const TicketVerifier: React.FC = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [manualCode, setManualCode] = useState<string>("");
  const [counts, setCounts] = useState<Counts>({
    verified: 0,
    duplicate: 0,
    invalid: 0,
  });

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

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  const scheduleReset = useCallback((next: Exclude<Status, "idle" | "loading">) => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      busyRef.current = false;
      setStatus("idle");
      setTicketData(null);
      setErrorMessage("");
      setManualCode("");
    }, AUTO_RESET_MS[next]);
  }, []);

  const resetNow = useCallback(() => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    busyRef.current = false;
    setStatus("idle");
    setTicketData(null);
    setErrorMessage("");
    setManualCode("");
  }, []);

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
        setCounts((c) => ({ ...c, verified: c.verified + 1 }));
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
            setCounts((c) => ({ ...c, duplicate: c.duplicate + 1 }));
            beep("warning");
            scheduleReset("warning");
          } else {
            setStatus("error");
            setErrorMessage(backendMessage);
            setCounts((c) => ({ ...c, invalid: c.invalid + 1 }));
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
    <div className="flex w-full flex-col bg-[#101828] font-sans text-white h-[calc(100dvh-6rem)] min-h-[540px]">
      {/* Compact header with live session counters */}
      <header className="flex items-center justify-between border-b border-[#344054] bg-[#161F2E] px-4 py-3">
        <div className="flex items-center gap-2">
          <TicketCheck className="h-5 w-5 text-[#9E77ED]" />
          <div>
            <h1 className="text-sm font-bold tracking-wider text-[#F2F4F7]">
              GATE VERIFY
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#667085]">
              LOLO · SRKR
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-center">
          <div className="border border-[#344054] bg-[#1D2939] px-2.5 py-1">
            <p className="text-sm font-bold leading-none text-emerald-400">
              {counts.verified}
            </p>
            <p className="mt-0.5 text-[9px] uppercase tracking-widest text-[#667085]">
              In
            </p>
          </div>
          <div className="border border-[#344054] bg-[#1D2939] px-2.5 py-1">
            <p className="text-sm font-bold leading-none text-amber-400">
              {counts.duplicate}
            </p>
            <p className="mt-0.5 text-[9px] uppercase tracking-widest text-[#667085]">
              Dup
            </p>
          </div>
          <div className="border border-[#344054] bg-[#1D2939] px-2.5 py-1">
            <p className="text-sm font-bold leading-none text-red-400">
              {counts.invalid}
            </p>
            <p className="mt-0.5 text-[9px] uppercase tracking-widest text-[#667085]">
              Bad
            </p>
          </div>
          <button
            onClick={() => setCounts({ verified: 0, duplicate: 0, invalid: 0 })}
            title="Reset counters"
            className="border border-[#344054] bg-[#1D2939] p-2 text-[#98A2B3] transition-colors hover:bg-[#253247] hover:text-[#F2F4F7]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-3xl flex-1 grid-cols-1 content-center gap-4 overflow-y-auto p-4 md:grid-cols-2">
        {/* Scanner — stays mounted across scans, no remount cost */}
        <section className="relative aspect-square w-full overflow-hidden border border-[#344054] bg-black">
          <Suspense
            fallback={
              <div className="flex h-full w-full animate-pulse items-center justify-center bg-[#1D2939] text-sm text-[#98A2B3]">
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

        {/* Result + manual entry — fixed-height panel, video never unmounts */}
        <section className="flex min-h-[280px] flex-col gap-3">
          <button
            onClick={resetNow}
            title="Tap to scan next"
            className={`flex min-h-[168px] flex-1 flex-col items-center justify-center gap-1 border p-4 text-center transition-colors ${
              status === "success"
                ? "border-emerald-500 bg-emerald-500/15"
                : status === "warning"
                  ? "border-amber-500 bg-amber-500/15"
                  : status === "error" || status === "network_error"
                    ? "border-red-500 bg-red-500/15"
                    : "border-[#344054] bg-[#161F2E]"
            }`}
          >
            {status === "success" && (
              <>
                <CheckCircle2 className="h-12 w-12 text-emerald-400" />
                <p className="text-xl font-bold tracking-wide text-emerald-300">
                  ALLOWED
                </p>
              </>
            )}
            {status === "warning" && (
              <>
                <AlertTriangle className="h-12 w-12 text-amber-400" />
                <p className="text-xl font-bold tracking-wide text-amber-300">
                  ALREADY IN
                </p>
              </>
            )}
            {(status === "error" || status === "network_error") && (
              <>
                {status === "network_error" ? (
                  <WifiOff className="h-12 w-12 text-red-400" />
                ) : (
                  <XCircle className="h-12 w-12 text-red-400" />
                )}
                <p className="text-xl font-bold tracking-wide text-red-300">
                  {status === "network_error" ? "NO SIGNAL" : "DENIED"}
                </p>
              </>
            )}
            {status === "idle" && (
              <>
                <ScanLine className="h-12 w-12 text-[#667085]" />
                <p className="text-sm font-medium tracking-wide text-[#98A2B3]">
                  Point camera at a ticket
                </p>
              </>
            )}
            {status === "loading" && (
              <p className="text-sm font-medium tracking-wide text-[#98A2B3]">
                Verifying…
              </p>
            )}

            {ticketData && showResult && (
              <div className="mt-2 w-full border border-white/10 bg-black/30 px-3 py-2">
                <p className="font-mono text-2xl font-bold text-white">
                  {ticketData.reg_num}
                </p>
                <p className="truncate font-mono text-xs text-white/70">
                  {ticketData.ticket_code}
                </p>
              </div>
            )}
            {errorMessage && showResult && status !== "warning" && (
              <p className="mt-1 max-w-full truncate px-2 text-sm text-white/80">
                {errorMessage}
              </p>
            )}
            {showResult && (
              <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/50">
                Tap for next
              </p>
            )}
          </button>

          <form
            onSubmit={handleManualSubmit}
            className="flex gap-2"
          >
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value.toUpperCase())}
              placeholder="TICKET CODE"
              autoComplete="off"
              disabled={status === "loading"}
              className="h-11 min-w-0 flex-1 border border-[#344054] bg-[#1D2939] px-3 text-center font-mono text-sm uppercase text-[#F2F4F7] outline-none placeholder:text-[#667085] focus:border-[#7F56D9] disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === "loading" || !manualCode.trim()}
              className="h-11 shrink-0 bg-[#7F56D9] px-4 text-sm font-bold text-white transition-colors hover:bg-[#9E77ED] disabled:opacity-50"
            >
              Verify
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default TicketVerifier;

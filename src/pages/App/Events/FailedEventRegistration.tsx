import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button/button";
import { AlertCircle, Home, ArrowLeft, Copy } from "lucide-react";

type FailedState = {
  eventName?: string;
  reason?: string;
  orderId?: string;
  paymentId?: string;
  // optional: keep context so retry can work better
  eventuuid?: string;
  publicRegistrationUuid?: string;
};

export const FailedEventRegistration: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); // read navigation state [web:17]

  const state = (location.state || {}) as FailedState; // state passed via navigate(..., { state }) [web:17]

  const eventName = state.eventName || "Event";
  const reason =
    state.reason ||
    "Payment didn't complete. If money was debited, it's usually reversed automatically by your bank.";

  const meta = useMemo(
    () =>
      [
        state.orderId ? { label: "Order ID", value: state.orderId } : null,
        state.paymentId
          ? { label: "Payment ID", value: state.paymentId }
          : null,
      ].filter(Boolean) as Array<{ label: string; value: string }>,
    [state.orderId, state.paymentId],
  );

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied`);
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans relative overflow-hidden flex items-center justify-center px-4">
      {/* Ambient blobs to match your existing style */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-lolo-cyan/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-lolo-pink/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        <div className="bg-[#09090b]/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-lolo-pink to-purple-400" />

          <div className="p-6 md:p-10">
            <div className="flex items-start gap-4">
              <div className="shrink-0 p-3 rounded-2xl bg-red-500/10 border border-red-500/20">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>

              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                  Payment failed
                </h1>
                <p className="mt-2 text-neutral-400">
                  Registration for{" "}
                  <span className="text-white font-semibold">{eventName}</span>{" "}
                  was not confirmed.
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10">
              <p className="text-sm text-neutral-300 leading-relaxed">
                {reason}
              </p>
            </div>

            {meta.length > 0 && (
              <div className="mt-6 space-y-3">
                {meta.map((m) => (
                  <div
                    key={m.label}
                    className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-[#0b0b10] border border-white/10"
                  >
                    <div className="min-w-0">
                      <p className="text-xs text-neutral-500">{m.label}</p>
                      <p className="font-mono text-sm text-neutral-200 break-all">
                        {m.value}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      className="shrink-0 rounded-xl border border-white/10 hover:bg-white/5"
                      onClick={() => copy(m.value, m.label)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="h-12 rounded-2xl border-white/10 bg-transparent hover:bg-white/5"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go back
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
                className="h-12 rounded-2xl border-white/10 bg-transparent hover:bg-white/5"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </div>

            <p className="mt-6 text-[11px] text-neutral-500">
              Tip: If you were charged but see failure here, share the
              Order/Payment ID with support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

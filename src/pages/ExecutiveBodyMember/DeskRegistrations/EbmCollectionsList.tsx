import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Collection = {
  id: number;
  payer_name: string;
  payer_identifier: string;
  amount: number;
  method: "UPI_QR" | "CASH";
  status: string;
  utr: string | null;
  cash_receipt_no: string | null;
  paid_at: string | null;
  is_verified: boolean;
  created_at: string;
};

const STATUS_STYLE: Record<string, string> = {
  PAID: "bg-green-500/10 text-green-400 border-green-500/20",
  PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  FAILED: "bg-red-500/10 text-red-400 border-red-500/20",
  CANCELLED: "bg-neutral-500/10 text-neutral-400 border-neutral-500/20",
  REFUNDED: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

export default function EbmCollectionsList() {
  const { user, token } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

  const api = useMemo(
    () =>
      axios.create({
        baseURL: API_BASE_URL,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token ?? ""}`,
        },
      }),
    [API_BASE_URL, user],
  );

  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchCollections = (p = 1) => {
    setIsLoading(true);
    api
      .get(`/ebm/payment-collections?page=${p}`)
      .then((r) => {
        const d = r?.data?.data;
        setCollections(d?.data ?? []);
        setLastPage(d?.last_page ?? 1);
        setPage(d?.current_page ?? 1);
      })
      .catch(() => toast.error("Failed to load collections"))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Collections</h1>
          <p className="text-neutral-500 text-sm">All manual payment records</p>
        </div>
        <button
          onClick={() => fetchCollections(page)}
          className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <RefreshCw size={14} className="text-neutral-400" />
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-lolo-pink border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-2">
          {collections.length === 0 && (
            <p className="text-center text-neutral-600 py-16">
              No collections yet.
            </p>
          )}
          {collections.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-lolo-pink/10 border border-lolo-pink/20 flex items-center justify-center text-lolo-pink font-bold text-xs">
                  #{c.id}
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{c.payer_name}</p>
                  <p className="text-neutral-500 text-xs">
                    {c.payer_identifier}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-white font-bold text-sm">
                  ₹{(c.amount / 100).toFixed(0)}
                </span>
                <span className="text-neutral-500 text-xs px-2 py-1 rounded-lg bg-white/5 border border-white/5">
                  {c.method === "UPI_QR"
                    ? `UPI · ${c.utr ?? "—"}`
                    : `Cash · ${c.cash_receipt_no ?? "—"}`}
                </span>
                <span
                  className={`text-[11px] font-bold uppercase px-2 py-1 rounded-lg border ${STATUS_STYLE[c.status] ?? STATUS_STYLE.PENDING}`}
                >
                  {c.status}
                </span>
                {c.is_verified && (
                  <span className="text-[11px] font-bold text-green-400 uppercase">
                    ✓ Verified
                  </span>
                )}
              </div>
            </motion.div>
          ))}

          {/* Pagination */}
          {lastPage > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => fetchCollections(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                    p === page
                      ? "bg-lolo-pink text-white"
                      : "bg-white/5 border border-white/10 text-neutral-400 hover:text-white"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

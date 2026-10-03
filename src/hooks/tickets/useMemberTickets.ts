import useSWR from "swr";
import axios from "axios";
import { toast } from "sonner";

const API = import.meta.env.VITE_API_BASE_URL;

const h = () => {
  const t = localStorage.getItem("authToken") || "";
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(t ? { Authorization: `Bearer ${t}` } : {}),
  };
};

const fetcher = (url: string) =>
  axios.get(url, { headers: h() }).then((r) => r.data);

// Minimal ticket shape returned by GET /tickets (management/music view)
export interface MemberTicket {
  name: string | null;
  reg_num: string;
  ticket_code: string;
  is_verified: boolean;
  verified_by: string | null;
  verified_at: string | null;
}

export interface MemberTicketQuery {
  search?: string;
  status?: "all" | "verified" | "unverified";
  event_uuid?: string;
  sort_by?: string;
  sort_dir?: "asc" | "desc";
  page?: number;
  per_page?: number;
}

export interface EventOption {
  uuid: string;
  name: string;
}

// Public event list for the event filter (GET /api/events needs no auth)
export function useEventsList() {
  const { data, error, isLoading } = useSWR(`${API}/events`, fetcher);
  const list = data?.data ?? data ?? [];
  const rows: any[] = Array.isArray(list) ? list : (list?.data ?? []);
  const events: EventOption[] = rows
    .filter((e) => e?.uuid && (e?.name ?? e?.title))
    .map((e) => ({ uuid: e.uuid, name: e.name ?? e.title }));
  return { events, isLoading, isError: !!error };
}

export function useMemberTicketsList(params: MemberTicketQuery = {}) {
  const qs = new URLSearchParams();
  if (params.search) qs.set("search", params.search);
  if (params.status && params.status !== "all") qs.set("status", params.status);
  if (params.event_uuid) qs.set("event_uuid", params.event_uuid);
  if (params.sort_by) qs.set("sort_by", params.sort_by);
  if (params.sort_dir) qs.set("sort_dir", params.sort_dir);
  qs.set("page", String(params.page ?? 1));
  qs.set("per_page", String(params.per_page ?? 20));

  const url = `${API}/tickets?${qs.toString()}`;
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  const payload = data?.data ?? data;
  // Laravel paginator: { data: rows, current_page, last_page, total, ... } or plain array
  const tickets: MemberTicket[] = Array.isArray(payload)
    ? payload
    : (payload?.data ?? []);
  const meta = Array.isArray(payload)
    ? {
        current_page: 1,
        last_page: 1,
        total: payload.length,
        per_page: payload.length,
      }
    : {
        current_page: payload?.current_page ?? 1,
        last_page: payload?.last_page ?? 1,
        total: payload?.total ?? tickets.length,
        per_page: payload?.per_page ?? (params.per_page ?? 20),
        from: payload?.from ?? null,
        to: payload?.to ?? null,
      };

  const verifyTicket = async (ticketCode: string) => {
    try {
      const r = await axios.put(
        `${API}/verify-ticket/${ticketCode.trim()}`,
        {},
        { headers: h() },
      );
      toast.success(r.data?.message || "Ticket verified");
      mutate();
      return r.data?.data as MemberTicket;
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Verify failed");
      throw e;
    }
  };

  return {
    tickets,
    meta,
    isLoading,
    isError: !!error,
    refresh: mutate,
    verifyTicket,
  };
}

import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  BadgeCheck,
  CalendarCheck,
  CheckCircle2,
  Copy,
  ListChecks,
  QrCode,
  RefreshCw,
  ScanLine,
  Search,
  Ticket as TicketIcon,
  TicketCheck,
  XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useEventsList,
  useMemberTicketsList,
  type MemberTicket,
} from "@/hooks/tickets/useMemberTickets";

type StatusFilter = "all" | "verified" | "unverified";

function useDebounced(value: string, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function initials(name: string | null) {
  if (!name) return "–";
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const FILTERS_KEY = "member-tickets-filters-v1";

function loadSavedFilters(): {
  searchInput: string;
  status: StatusFilter;
  eventUuid: string;
  page: number;
} {
  const fallback = {
    searchInput: "",
    status: "all" as StatusFilter,
    eventUuid: "all",
    page: 1,
  };
  try {
    const raw = localStorage.getItem(FILTERS_KEY);
    if (!raw) return fallback;
    const p = JSON.parse(raw);
    return {
      searchInput: typeof p.searchInput === "string" ? p.searchInput : "",
      status: (["all", "verified", "unverified"] as StatusFilter[]).includes(
        p.status,
      )
        ? (p.status as StatusFilter)
        : ("all" as StatusFilter),
      eventUuid: typeof p.eventUuid === "string" ? p.eventUuid : "all",
      page: Number.isInteger(p.page) && p.page > 0 ? p.page : 1,
    };
  } catch {
    return fallback;
  }
}

export default function MemberTicketsPage() {
  const [saved] = useState(loadSavedFilters);
  const [searchInput, setSearchInput] = useState(saved.searchInput);
  const search = useDebounced(searchInput);
  const [status, setStatus] = useState<StatusFilter>(saved.status);
  const [eventUuid, setEventUuid] = useState<string>(saved.eventUuid);
  const [page, setPage] = useState(saved.page);
  const [perPage] = useState(20);

  const [gateCode, setGateCode] = useState("");
  const [gateBusy, setGateBusy] = useState(false);
  const [lastVerified, setLastVerified] = useState<MemberTicket | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const { events, isLoading: eventsLoading } = useEventsList();

  // Drop a saved event filter if that event no longer exists
  useEffect(() => {
    if (!eventsLoading && eventUuid !== "all" && events.length > 0) {
      if (!events.some((e) => e.uuid === eventUuid)) setEventUuid("all");
    }
  }, [eventsLoading, events, eventUuid]);

  // Reset to first page whenever filters change (skip initial mount
  // so a restored page from a refresh is preserved)
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    setPage(1);
  }, [search, status, eventUuid]);

  // Persist filters so they survive a page refresh
  useEffect(() => {
    try {
      localStorage.setItem(
        FILTERS_KEY,
        JSON.stringify({ searchInput, status, eventUuid, page }),
      );
    } catch {
      /* storage unavailable — ignore */
    }
  }, [searchInput, status, eventUuid, page]);

  const { tickets, meta, isLoading, refresh, verifyTicket } =
    useMemberTicketsList({
      search,
      status,
      event_uuid: eventUuid === "all" ? undefined : eventUuid,
      sort_by: "created_at",
      sort_dir: "desc",
      page,
      per_page: perPage,
    });

  // Event-scoped stats (ignores table search so gate staff see overall progress)
  const { tickets: statTickets } = useMemberTicketsList({
    status: "all",
    event_uuid: eventUuid === "all" ? undefined : eventUuid,
    per_page: 100,
  });
  const stats = useMemo(() => {
    const total = statTickets.length;
    const verified = statTickets.filter((t) => t.is_verified).length;
    return { total, verified, unverified: total - verified };
  }, [statTickets]);

  const activeEventName =
    eventUuid === "all"
      ? "All events"
      : (events.find((e) => e.uuid === eventUuid)?.name ?? "Selected event");

  const handleGateVerify = async () => {
    const code = gateCode.trim();
    if (!code || gateBusy) return;
    setGateBusy(true);
    setLastVerified(null);
    try {
      const ticket = await verifyTicket(code);
      setLastVerified(ticket ?? null);
      setGateCode("");
    } finally {
      setGateBusy(false);
    }
  };

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 1500);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-6xl mx-auto">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#03a1b0] via-[#027d8a] to-[#0f172a] p-6 md:p-8 text-white shadow-lg dark:from-[#0b3b42] dark:via-[#082a30] dark:to-[#020617] dark:border dark:border-white/10">
        <TicketIcon
          size={140}
          className="absolute -right-6 -bottom-8 opacity-10 rotate-12"
        />
        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <TicketCheck size={26} /> Event Tickets
              </h1>
              <p className="text-sm text-white/80 mt-1 max-w-xl">
                {activeEventName} — view every ticket and verify entry at the
                gate. Verification happens only by scanning a QR or entering a
                ticket code below.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => refresh()}
              disabled={isLoading}
              className="shrink-0 dark:bg-blue-500/15 dark:text-blue-100 dark:hover:bg-blue-500/25 dark:border dark:border-blue-400/25"
            >
              <RefreshCw
                size={14}
                className={`mr-1 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          {/* Stat chips */}
          <div className="flex flex-wrap gap-2 mt-5">
            <div className="flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur px-3 py-2 text-sm">
              <ListChecks size={15} />
              <span className="font-semibold">{stats.total}</span>
              <span className="text-white/70">total</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-emerald-400/20 border border-emerald-300/30 px-3 py-2 text-sm dark:bg-emerald-400/10 dark:border-emerald-300/20">
              <CheckCircle2 size={15} className="text-emerald-200" />
              <span className="font-semibold">{stats.verified}</span>
              <span className="text-white/70">verified</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-amber-400/20 border border-amber-300/30 px-3 py-2 text-sm dark:bg-amber-400/10 dark:border-amber-300/20">
              <XCircle size={15} className="text-amber-200" />
              <span className="font-semibold">{stats.unverified}</span>
              <span className="text-white/70">pending entry</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gate verify card */}
      <Card className="border-2 border-dashed dark:bg-[#101828] dark:border-zinc-700">
        <CardContent className="pt-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-primary/10">
                <ScanLine size={16} />
              </span>
              <div>
                <p className="font-semibold text-sm">Verify ticket at gate</p>
                <p className="text-xs text-muted-foreground">
                  Type or paste the ticket code, then verify — or scan the QR
                  instead.
                </p>
              </div>
            </div>
            <Link to="/verify-ticket">
              <Button variant="outline" size="sm">
                <QrCode size={14} className="mr-1" /> Scan QR instead
              </Button>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={gateCode}
              onChange={(e) => setGateCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === "Enter") void handleGateVerify();
              }}
              placeholder="Enter ticket code e.g. LOLO-…"
              className="font-mono uppercase"
            />
            <Button
              onClick={() => void handleGateVerify()}
              disabled={!gateCode.trim() || gateBusy}
              className="sm:min-w-32"
            >
              <BadgeCheck size={15} className="mr-1" />
              {gateBusy ? "Verifying…" : "Verify entry"}
            </Button>
          </div>

          {lastVerified && (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 px-3 py-2.5 text-sm dark:bg-emerald-400/10 dark:border-emerald-400/25">
              <CheckCircle2
                size={16}
                className="text-emerald-600 dark:text-emerald-400 shrink-0"
              />
              <span>
                Entry verified for <b>{lastVerified.name ?? "holder"}</b>
                <span className="text-muted-foreground">
                  {" "}
                  ({lastVerified.reg_num} • {lastVerified.ticket_code})
                </span>
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search ticket code, reg num, holder…"
            className="pl-9 dark:bg-[#101828] dark:border-zinc-800"
          />
        </div>
        <Select value={eventUuid} onValueChange={setEventUuid}>
          <SelectTrigger className="w-full md:w-56 dark:bg-[#101828] dark:border-zinc-800">
            <CalendarCheck size={14} className="mr-1 text-muted-foreground" />
            <SelectValue placeholder="All events" />
          </SelectTrigger>
          <SelectContent className="dark:bg-zinc-900 dark:border-zinc-700">
            <SelectItem value="all">All events</SelectItem>
            {events.map((e) => (
              <SelectItem key={e.uuid} value={e.uuid}>
                {e.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={status}
          onValueChange={(v) => setStatus(v as StatusFilter)}
        >
          <SelectTrigger className="w-full md:w-40 dark:bg-[#101828] dark:border-zinc-800">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="dark:bg-zinc-900 dark:border-zinc-700">
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="unverified">Unverified</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="text-xs text-muted-foreground -mt-3">
        Showing {tickets.length} of {meta.total ?? tickets.length} tickets
        {eventUuid !== "all" ? ` in ${activeEventName}` : ""}.
      </p>

      {/* Table */}
      <Card className="dark:bg-[#101828] dark:border-zinc-800">
        <CardContent className="p-0 overflow-x-auto">
          <Table className="[&_tr]:dark:border-zinc-800">
            <TableHeader>
              <TableRow>
                <TableHead>Holder</TableHead>
                <TableHead>Reg Num</TableHead>
                <TableHead>Ticket Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verified By</TableHead>
                <TableHead>Verified At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <RefreshCw
                      size={18}
                      className="animate-spin mx-auto mb-2 text-muted-foreground"
                    />
                    <p className="text-sm text-muted-foreground">
                      Loading tickets…
                    </p>
                  </TableCell>
                </TableRow>
              ) : tickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <TicketIcon
                      size={28}
                      className="mx-auto mb-2 text-muted-foreground/50"
                    />
                    <p className="text-sm font-medium">No tickets found</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Try a different search, event or status filter.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                tickets.map((t) => (
                  <TableRow key={t.ticket_code} className="hover:bg-muted/40">
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary dark:bg-primary/20">
                          {initials(t.name)}
                        </span>
                        <span className="font-medium text-sm">
                          {t.name ?? "—"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {t.reg_num}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs dark:bg-zinc-800 dark:text-zinc-200">
                          {t.ticket_code}
                        </code>
                        <button
                          type="button"
                          onClick={() => void copyCode(t.ticket_code)}
                          title="Copy ticket code"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Copy size={13} />
                        </button>
                        {copiedCode === t.ticket_code && (
                          <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
                            Copied
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {t.is_verified ? (
                        <Badge className="gap-1 bg-emerald-500/15 text-emerald-700 border-emerald-500/30 hover:bg-emerald-500/15 dark:bg-emerald-400/10 dark:text-emerald-300 dark:border-emerald-400/25 dark:hover:bg-emerald-400/10">
                          <CheckCircle2 size={12} /> Verified
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="gap-1 bg-amber-500/15 text-amber-700 border-amber-500/30 dark:bg-amber-400/10 dark:text-amber-300 dark:border-amber-400/25"
                        >
                          <XCircle size={12} /> Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">
                      {t.verified_by ? (
                        <span className="inline-flex items-center gap-1">
                          <BadgeCheck
                            size={12}
                            className="text-muted-foreground"
                          />
                          {t.verified_by}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs whitespace-nowrap text-muted-foreground">
                      {t.verified_at ?? "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || isLoading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {meta.current_page} of {meta.last_page} • {meta.total}{" "}
            tickets
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= meta.last_page || isLoading}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

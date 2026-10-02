import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import axios from "axios";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  BadgeCheck,
  CheckCircle2,
  Clock,
  Copy,
  Eye,
  QrCode,
  RefreshCw,
  Search,
  Ticket as TicketIcon,
  XCircle,
} from "lucide-react";
import { AdminHeader } from "@/layouts/admin/AdminHeader";
import { useAdminTickets, useAdminTicketsList } from "@/hooks/admin/useAdminResources";
import { useAdminEvents } from "@/hooks/admin/useAdminResources";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toCSV, toJSONExport } from "@/components/admin/adminExport";

const API = import.meta.env.VITE_API_BASE_URL;

type StatusFilter = "all" | "verified" | "unverified";
type SortKey = "ticket_code" | "reg_num" | "created_at" | "verified_at" | "is_verified" | "event";

const SORT_COLUMNS: { key: SortKey; label: string }[] = [
  { key: "ticket_code", label: "Ticket Code" },
  { key: "reg_num", label: "Reg Num" },
  { key: "event", label: "Event" },
  { key: "is_verified", label: "Status" },
  { key: "created_at", label: "Created" },
  { key: "verified_at", label: "Verified At" },
];

function flattenTicket(t: any) {
  return {
    ticket_code: t.ticket_code ?? "",
    reg_num: t.reg_num ?? "",
    holder_name: t.public_user?.name ?? t.publicUser?.name ?? "",
    holder_email: t.public_user?.email ?? t.publicUser?.email ?? "",
    holder_reg_num: t.public_user?.reg_num ?? t.publicUser?.reg_num ?? "",
    event: t.event?.name ?? "",
    status: t.is_verified ? "verified" : "unverified",
    verified_by: t.verifier?.name ?? t.verifier?.username ?? t.verified_by ?? "",
    verified_at: t.verified_at ?? "",
    created_at: t.created_at ?? "",
  };
}

function useDebounced(value: string, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function AdminTicketsPage() {
  const { copyRecords } = useAdminTickets();
  const { events } = useAdminEvents();

  const [searchInput, setSearchInput] = useState("");
  const search = useDebounced(searchInput);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [eventId, setEventId] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  // Reset to first page whenever filters change
  useEffect(() => {
    setPage(1);
  }, [search, status, eventId, perPage, sortBy, sortDir]);

  const { tickets, meta, isLoading, refresh, verifyTicket } = useAdminTicketsList({
    search,
    status,
    event_id: eventId === "all" ? undefined : eventId,
    sort_by: sortBy,
    sort_dir: sortDir,
    page,
    per_page: perPage,
  });

  // Global stats (unfiltered by table search, but respects nothing — full inventory)
  const statsFetcher = (url: string) =>
    axios
      .get(url, {
        headers: {
          Accept: "application/json",
          ...(localStorage.getItem("authToken")
            ? { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
            : {}),
        },
      })
      .then((r) => r.data);
  const { data: statsData, mutate: refreshStats } = useSWR(
    `${API}/admin/tickets?paginate=false`,
    statsFetcher
  );
  const statsRows: any[] = useMemo(() => {
    const payload = statsData?.data ?? statsData ?? [];
    return Array.isArray(payload) ? payload : (payload?.data ?? []);
  }, [statsData]);

  const stats = useMemo(() => {
    const total = statsRows.length;
    const verified = statsRows.filter((t) => t.is_verified).length;
    const unverified = total - verified;
    const rate = total === 0 ? 0 : Math.round((verified / total) * 100);
    return { total, verified, unverified, rate };
  }, [statsRows]);

  const [gateCode, setGateCode] = useState("");
  const [gateBusy, setGateBusy] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState<string | null>(null);
  const [selected, setSelected] = useState<any | null>(null);

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDir(key === "ticket_code" || key === "reg_num" ? "asc" : "desc");
    }
  };

  const sortIcon = (key: SortKey) => {
    if (sortBy !== key) return <ArrowUpDown size={12} className="opacity-40" />;
    return sortDir === "asc" ? <ArrowUp size={12} /> : <ArrowDown size={12} />;
  };

  const handleGateVerify = async () => {
    if (!gateCode.trim()) return;
    setGateBusy(true);
    try {
      const token = localStorage.getItem("authToken") || "";
      const r = await axios.put(
        `${API}/verify-ticket/${gateCode.trim()}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(r.data.message || "Ticket verified");
      setGateCode("");
      refresh();
      refreshStats();
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Verify failed");
    }
    setGateBusy(false);
  };

  const handleRowVerify = async (code: string) => {
    setVerifyingCode(code);
    try {
      await verifyTicket(code);
      refreshStats();
    } catch {
      /* toast handled in hook */
    }
    setVerifyingCode(null);
  };

  const handleExport = (kind: "csv" | "json") => {
    const rows = tickets.map(flattenTicket);
    if (rows.length === 0) {
      toast.error("Nothing to export");
      return;
    }
    const stamp = new Date().toISOString().slice(0, 10);
    if (kind === "csv") toCSV(rows, `tickets-${stamp}.csv`);
    else toJSONExport(rows, `tickets-${stamp}.json`);
  };

  const clearFilters = () => {
    setSearchInput("");
    setStatus("all");
    setEventId("all");
    setSortBy("created_at");
    setSortDir("desc");
    setPage(1);
  };

  const hasActiveFilters =
    searchInput !== "" || status !== "all" || eventId !== "all";

  return (
    <div className="pb-10">
      <AdminHeader
        title="Tickets — All Tickets & Status"
        subtitle="GET /admin/tickets • search, filter by status/event, sort, paginate • PUT /verify-ticket/:code"
        onRefresh={() => {
          refresh();
          refreshStats();
        }}
      />

      <div className="px-4 lg:px-8 py-6 space-y-4">
        {/* ---- Stats ---- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              label: "Total tickets",
              value: stats.total,
              icon: <TicketIcon size={16} />,
              sub: `${meta.total ?? stats.total} match current filters`,
            },
            {
              label: "Verified",
              value: stats.verified,
              icon: <BadgeCheck size={16} className="text-green-600" />,
              sub: `${stats.rate}% verification rate`,
            },
            {
              label: "Pending",
              value: stats.unverified,
              icon: <Clock size={16} className="text-amber-600" />,
              sub: "awaiting gate scan",
            },
            {
              label: "Filtered view",
              value: meta.total ?? tickets.length,
              icon: <QrCode size={16} />,
              sub: `page ${meta.current_page} of ${meta.last_page}`,
            },
          ].map((s) => (
            <Card
              key={s.label}
              className="rounded-none border-[var(--admin-line)] bg-[var(--admin-surface)]"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] uppercase tracking-widest text-[var(--admin-ink-muted)] font-semibold">
                    {s.label}
                  </div>
                  {s.icon}
                </div>
                <div className="text-2xl font-bold text-[var(--admin-ink)] mt-1">
                  {s.value}
                </div>
                <div className="text-[11px] text-[var(--admin-ink-muted)] mt-1">
                  {s.sub}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ---- Gate verify + copy records ---- */}
        <div className="grid lg:grid-cols-2 gap-3">
          <Card className="rounded-none border-[var(--admin-line)] bg-[var(--admin-surface)]">
            <CardContent className="p-5 space-y-3">
              <div className="text-sm font-bold text-[var(--admin-ink)]">
                Verify ticket (gate)
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter ticket code e.g. LOLO-…"
                  value={gateCode}
                  onChange={(e) => setGateCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGateVerify()}
                  className="rounded-none bg-[var(--admin-canvas)] border-[var(--admin-line)]"
                />
                <Button
                  onClick={handleGateVerify}
                  disabled={gateBusy || !gateCode.trim()}
                  className="rounded-none bg-[var(--admin-accent)] text-white shrink-0"
                >
                  {gateBusy ? "Verifying…" : "Verify"}
                </Button>
              </div>
              <div className="text-xs text-[var(--admin-ink-muted)]">
                Requires valid club membership + Sanctum. Admin plus promoted
                leadership passes.
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-none border-[var(--admin-line)] bg-[var(--admin-surface)]">
            <CardContent className="p-5 space-y-3">
              <div className="text-sm font-bold text-[var(--admin-ink)]">
                Copy public registrations → event tickets
              </div>
              <p className="text-xs text-[var(--admin-ink-muted)]">
                One-click bulk copy via{" "}
                <code className="px-1 bg-[var(--admin-canvas)]">
                  POST /admin/copy-records
                </code>
                . Chunked 100 at a time on server.
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={async () => {
                    await copyRecords();
                    refresh();
                    refreshStats();
                  }}
                  className="rounded-none bg-[var(--admin-accent)] hover:bg-[var(--admin-accent)] text-white"
                >
                  <Copy size={14} className="mr-1" /> Run copy-records
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ---- Filter bar ---- */}
        <Card className="rounded-none border-[var(--admin-line)] bg-[var(--admin-surface)]">
          <CardContent className="p-4 flex flex-col xl:flex-row gap-3 xl:items-center">
            <div className="relative flex-1 min-w-[220px]">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-ink-muted)]"
              />
              <Input
                placeholder="Search ticket code, reg num, holder, event…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9 rounded-none bg-[var(--admin-canvas)] border-[var(--admin-line)]"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {(["all", "verified", "unverified"] as StatusFilter[]).map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant={status === s ? "default" : "outline"}
                  onClick={() => setStatus(s)}
                  className={`rounded-none ${
                    status === s
                      ? "bg-[var(--admin-accent)] text-white"
                      : "border-[var(--admin-line)] text-[var(--admin-ink)]"
                  }`}
                >
                  {s === "all" ? "All" : s === "verified" ? "Verified" : "Pending"}
                </Button>
              ))}
            </div>
            <Select value={eventId} onValueChange={setEventId}>
              <SelectTrigger className="w-[200px] rounded-none bg-[var(--admin-canvas)] border-[var(--admin-line)]">
                <SelectValue placeholder="Filter by event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All events</SelectItem>
                {events.map((ev: any) => (
                  <SelectItem key={ev.id ?? ev.uuid} value={String(ev.id ?? ev.uuid)}>
                    {ev.name ?? ev.title ?? ev.uuid}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={String(perPage)}
              onValueChange={(v) => setPerPage(Number(v))}
            >
              <SelectTrigger className="w-[110px] rounded-none bg-[var(--admin-canvas)] border-[var(--admin-line)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50, 100].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} / page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleExport("csv")}
                disabled={tickets.length === 0}
                className="rounded-none border-[var(--admin-line)]"
              >
                CSV
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleExport("json")}
                disabled={tickets.length === 0}
                className="rounded-none border-[var(--admin-line)]"
              >
                JSON
              </Button>
              {hasActiveFilters && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={clearFilters}
                  className="rounded-none"
                >
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ---- Table ---- */}
        <Card className="rounded-none border-[var(--admin-line)] bg-[var(--admin-surface)] overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[var(--admin-canvas)]">
                <TableRow>
                  {SORT_COLUMNS.map((c) => (
                    <TableHead key={c.key}>
                      <button
                        onClick={() => toggleSort(c.key)}
                        className="inline-flex items-center gap-1 text-[var(--admin-ink)] font-semibold text-xs uppercase tracking-wide hover:opacity-70"
                      >
                        {c.label} {sortIcon(c.key)}
                      </button>
                    </TableHead>
                  ))}
                  <TableHead className="text-[var(--admin-ink)] text-xs uppercase">
                    Holder
                  </TableHead>
                  <TableHead className="text-right text-[var(--admin-ink)] text-xs uppercase">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-10 text-center">
                      <RefreshCw
                        size={18}
                        className="animate-spin mx-auto text-[var(--admin-ink-muted)]"
                      />
                      <div className="text-xs text-[var(--admin-ink-muted)] mt-2">
                        Loading tickets…
                      </div>
                    </TableCell>
                  </TableRow>
                ) : tickets.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="py-10 text-center text-[var(--admin-ink-muted)] text-sm"
                    >
                      No tickets match the current filters.
                      {hasActiveFilters && (
                        <button
                          onClick={clearFilters}
                          className="ml-2 underline underline-offset-2"
                        >
                          Clear filters
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  tickets.map((t: any) => {
                    const verified = !!t.is_verified;
                    const holder =
                      t.public_user ?? t.publicUser ?? t.publicUser ?? null;
                    return (
                      <TableRow
                        key={t.ticket_code ?? t.uuid ?? t.id}
                        className="hover:bg-[var(--admin-canvas)]/40"
                      >
                        <TableCell className="font-mono text-xs text-[var(--admin-ink)] whitespace-nowrap">
                          {t.ticket_code}
                        </TableCell>
                        <TableCell className="text-xs text-[var(--admin-ink-muted)] whitespace-nowrap">
                          {t.reg_num}
                        </TableCell>
                        <TableCell className="text-xs text-[var(--admin-ink)] max-w-[220px] truncate">
                          {t.event?.name ?? "—"}
                        </TableCell>
                        <TableCell>
                          {verified ? (
                            <Badge className="rounded-full bg-green-500/10 text-green-700 border border-green-500/20 text-[11px] gap-1">
                              <CheckCircle2 size={11} /> Verified
                            </Badge>
                          ) : (
                            <Badge className="rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/20 text-[11px] gap-1">
                              <Clock size={11} /> Pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-[11px] text-[var(--admin-ink-muted)] whitespace-nowrap">
                          {t.created_at
                            ? new Date(t.created_at).toLocaleString()
                            : "—"}
                        </TableCell>
                        <TableCell className="text-[11px] text-[var(--admin-ink-muted)] whitespace-nowrap">
                          {t.verified_at
                            ? new Date(t.verified_at).toLocaleString()
                            : "—"}
                        </TableCell>
                        <TableCell className="text-xs max-w-[200px]">
                          <div className="font-medium text-[var(--admin-ink)] truncate">
                            {holder?.name ?? "—"}
                          </div>
                          <div className="text-[11px] text-[var(--admin-ink-muted)] truncate">
                            {holder?.email ?? holder?.reg_num ?? ""}
                          </div>
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelected(t)}
                            className="rounded-none border-[var(--admin-line)]"
                            title="View details"
                          >
                            <Eye size={13} />
                          </Button>
                          {!verified && (
                            <Button
                              size="sm"
                              onClick={() => handleRowVerify(t.ticket_code)}
                              disabled={verifyingCode === t.ticket_code}
                              className="rounded-none bg-[var(--admin-accent)] text-white"
                              title="Mark verified"
                            >
                              {verifyingCode === t.ticket_code
                                ? "…"
                                : "Verify"}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-[var(--admin-line)]">
            <div className="text-xs text-[var(--admin-ink-muted)]">
              Showing{" "}
              <span className="font-semibold text-[var(--admin-ink)]">
                {tickets.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[var(--admin-ink)]">
                {meta.total ?? 0}
              </span>{" "}
              tickets • page {meta.current_page} of {meta.last_page}
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-none border-[var(--admin-line)]"
              >
                Prev
              </Button>
              <span className="text-xs text-[var(--admin-ink-muted)]">
                {page} / {meta.last_page || 1}
              </span>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= (meta.last_page || 1)}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-none border-[var(--admin-line)]"
              >
                Next
              </Button>
            </div>
          </div>
        </Card>

        <div className="text-xs text-[var(--admin-ink-muted)]">
          Sortable columns send{" "}
          <code className="px-1 bg-[var(--admin-canvas)]">
            ?sort_by=&sort_dir=
          </code>{" "}
          to the server. Search matches ticket code, reg num, holder and event.
          {events.length === 0 && " Event filter populates once events load."}
        </div>
      </div>

      {/* ---- Detail dialog ---- */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="rounded-none bg-[var(--admin-surface)] border-[var(--admin-line)] max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[var(--admin-ink)] flex items-center gap-2">
              <TicketIcon size={16} /> {selected?.ticket_code}
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                {selected.is_verified ? (
                  <Badge className="rounded-full bg-green-500/10 text-green-700 border border-green-500/20 gap-1">
                    <CheckCircle2 size={12} /> Verified
                  </Badge>
                ) : (
                  <Badge className="rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/20 gap-1">
                    <XCircle size={12} /> Pending verification
                  </Badge>
                )}
                <span className="text-xs text-[var(--admin-ink-muted)]">
                  Reg num: {selected.reg_num}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 border border-[var(--admin-line)] bg-[var(--admin-canvas)]/40">
                  <div className="uppercase tracking-widest text-[10px] text-[var(--admin-ink-muted)] font-semibold">
                    Event
                  </div>
                  <div className="font-semibold text-[var(--admin-ink)] mt-1">
                    {selected.event?.name ?? "—"}
                  </div>
                </div>
                <div className="p-3 border border-[var(--admin-line)] bg-[var(--admin-canvas)]/40">
                  <div className="uppercase tracking-widest text-[10px] text-[var(--admin-ink-muted)] font-semibold">
                    Holder
                  </div>
                  <div className="font-semibold text-[var(--admin-ink)] mt-1">
                    {(selected.public_user ?? selected.publicUser)?.name ??
                      "—"}
                  </div>
                  <div className="text-[var(--admin-ink-muted)]">
                    {(selected.public_user ?? selected.publicUser)?.email ??
                      ""}
                  </div>
                </div>
                <div className="p-3 border border-[var(--admin-line)] bg-[var(--admin-canvas)]/40">
                  <div className="uppercase tracking-widest text-[10px] text-[var(--admin-ink-muted)] font-semibold">
                    Verified by
                  </div>
                  <div className="font-semibold text-[var(--admin-ink)] mt-1">
                    {selected.verifier?.name ??
                      selected.verifier?.username ??
                      selected.verified_by ??
                      "—"}
                  </div>
                </div>
                <div className="p-3 border border-[var(--admin-line)] bg-[var(--admin-canvas)]/40">
                  <div className="uppercase tracking-widest text-[10px] text-[var(--admin-ink-muted)] font-semibold">
                    Verified at
                  </div>
                  <div className="font-semibold text-[var(--admin-ink)] mt-1">
                    {selected.verified_at
                      ? new Date(selected.verified_at).toLocaleString()
                      : "—"}
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-[var(--admin-ink-muted)] font-mono break-all p-3 border border-dashed border-[var(--admin-line)]">
                {selected.ticket_code}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelected(null)}
              className="rounded-none border-[var(--admin-line)]"
            >
              Close
            </Button>
            {selected && !selected.is_verified && (
              <Button
                onClick={async () => {
                  await handleRowVerify(selected.ticket_code);
                  setSelected(null);
                }}
                className="rounded-none bg-[var(--admin-accent)] text-white"
              >
                Verify ticket
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

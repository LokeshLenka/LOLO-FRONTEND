import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Input, Button, Chip, Pagination, Card, CardBody, Skeleton,
  Tooltip, Modal, ModalContent, ModalBody,
  Select, SelectItem, Divider, useDisclosure,
} from "@heroui/react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Search, Download, Eye, CalendarDays, Users, LayoutDashboard,
  RefreshCcw, CheckCircle, XCircle, X, ArrowUpDown, ChevronUp,
  ChevronDown, Filter, Hash, Mail, Phone, Building2, CreditCard,
  User, Home, GraduationCap,
} from "lucide-react";
import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import clsx from "clsx";
import { toast } from "sonner";
import * as XLSX from "xlsx";

// ─── Types ────────────────────────────────────────────────────────────────────

type Event = {
  id: number; uuid: string; name: string; type: string;
  start_date: string; venue: string; status: string;
  registrations_count?: number; cover_image?: string;
};

type PublicUser = {
  id: number; uuid: string; reg_num: string; email: string;
  name: string; gender: string; year: string; branch: string;
  phone_no: string; college_hostel_status: boolean;
};

type Registration = {
  id: number; uuid: string; public_user_id: number; reg_num: string;
  event_id: number; ticket_code: string | null; utr?: string | null;
  is_paid: string; payment_status: string; registration_status: string;
  created_at: string; updated_at: string; deleted_at: string | null;
  public_user: PublicUser; event: { uuid: string; name: string };
};

type SortKey = "name" | "reg_num" | "registration_status" | "payment_status" | "created_at";
type SortDir = "asc" | "desc";

// ─── API ──────────────────────────────────────────────────────────────────────

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type EventsResponse = { data: Event[]; last_page: number; current_page: number; total: number };

const fetchEvents = async (page: number, search: string): Promise<EventsResponse> => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/events`, {
      params: { page, per_page: 8, search },
    });
    return data?.data || { data: [], last_page: 1, current_page: 1, total: 0 };
  } catch { return { data: [], last_page: 1, current_page: 1, total: 0 }; }
};

const fetchRegistrations = async (eventUuid: string): Promise<Registration[]> => {
  try {
    const { data } = await axios.get(
      `${API_BASE_URL}/ebm/event-registrations/public/event/${eventUuid}`
    );
    return data?.data || [];
  } catch { return []; }
};

// ─── Status Config ────────────────────────────────────────────────────────────

const REG_STATUS_CONFIG: Record<string, { bg: string; text: string }> = {
  approved: { bg: "bg-emerald-100 dark:bg-emerald-900/20", text: "text-emerald-700 dark:text-emerald-400" },
  confirmed: { bg: "bg-emerald-100 dark:bg-emerald-900/20", text: "text-emerald-700 dark:text-emerald-400" },
  pending: { bg: "bg-amber-100 dark:bg-amber-900/20", text: "text-amber-700 dark:text-amber-400" },
  rejected: { bg: "bg-red-100 dark:bg-red-900/20", text: "text-red-700 dark:text-red-400" },
  cancelled: { bg: "bg-red-100 dark:bg-red-900/20", text: "text-red-700 dark:text-red-400" },
};

const PAY_STATUS_CONFIG: Record<string, { bg: string; text: string }> = {
  paid: { bg: "bg-blue-100 dark:bg-blue-900/20", text: "text-blue-700 dark:text-blue-400" },
  success: { bg: "bg-blue-100 dark:bg-blue-900/20", text: "text-blue-700 dark:text-blue-400" },
  pending: { bg: "bg-orange-100 dark:bg-orange-900/20", text: "text-orange-700 dark:text-orange-400" },
  failed: { bg: "bg-red-100 dark:bg-red-900/20", text: "text-red-700 dark:text-red-400" },
  not_paid: { bg: "bg-zinc-100 dark:bg-zinc-800", text: "text-zinc-600 dark:text-zinc-400" },
};

function StatusChip({ status, type = "reg" }: { status: string; type?: "reg" | "pay" }) {
  const fallback = { bg: "bg-zinc-100 dark:bg-zinc-800", text: "text-zinc-600 dark:text-zinc-300" };
  const conf = (type === "reg" ? REG_STATUS_CONFIG : PAY_STATUS_CONFIG)[status] ?? fallback;
  return (
    <Chip
      className={clsx("border-none", conf.bg)}
      classNames={{ content: clsx("font-bold capitalize text-xs", conf.text) }}
      size="sm" radius="none" variant="flat"
    >
      {status}
    </Chip>
  );
}

// ─── Shared Small Components ──────────────────────────────────────────────────

function ActionIconButton({
  tooltip, placement = "top", onPress, className, children,
}: {
  tooltip: string; placement?: "top" | "bottom" | "left" | "right";
  onPress?: () => void; className: string; children: React.ReactNode;
}) {
  return (
    <Tooltip content={tooltip} placement={placement} size="sm"
      classNames={{ base: "z-[99999]", content: "bg-zinc-900 text-white text-xs font-semibold rounded-md px-2 py-1 shadow-lg" }}
    >
      <Button isIconOnly size="sm" radius="md" onPress={onPress} className={className}>
        {children}
      </Button>
    </Tooltip>
  );
}

function DetailRow({ icon, label, value, mono = false }: {
  icon: React.ReactNode; label: string; value: React.ReactNode; mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
      <div className="mt-0.5 text-zinc-400 shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-0.5">{label}</p>
        <div className={clsx("text-sm text-zinc-900 dark:text-zinc-100 break-all", mono && "font-mono")}>
          {value ?? <span className="text-zinc-400 italic">—</span>}
        </div>
      </div>
    </div>
  );
}

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (col !== sortKey) return <ArrowUpDown size={11} className="ml-1 opacity-40" />;
  return sortDir === "asc"
    ? <ChevronUp size={11} className="ml-1 text-cyan-600" />
    : <ChevronDown size={11} className="ml-1 text-cyan-600" />;
}

// ─── View Details Modal ───────────────────────────────────────────────────────
// ─── Review Modal (Details + Actions in one place) ────────────────────────────
function ReviewModal({
  registration,
  isOpen,
  onClose,
  onApprove,
  onReject,
  isLoading,
}: {
  registration: Registration | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (reg: Registration) => void;
  onReject: (reg: Registration) => void;
  isLoading: boolean;
}) {
  const [confirmType, setConfirmType] = useState<"approve" | "reject" | null>(null);

  // Reset inner state when modal closes
  useEffect(() => {
    if (!isOpen) setConfirmType(null);
  }, [isOpen]);

  if (!registration) return null;

  const u = registration.public_user;
  const isPending =
    registration.registration_status !== "confirmed" &&
    registration.registration_status !== "cancelled" &&
    registration.registration_status !== "rejected";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      size="lg"
      backdrop="opaque"
      hideCloseButton
      scrollBehavior="inside"
      classNames={{
        backdrop: "bg-white/80 dark:bg-black/80 z-[99]",
        base: "bg-white dark:bg-[#000000] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-[10001] backdrop-blur-2xl",
        wrapper: "z-[10000]",
        body: "p-0",
      }}
    >
      <ModalContent>
        {(close) => (
          <div className="flex flex-col max-h-[85vh] backdrop-blur-2xl rounded-2xl">
            {/* ── Header ── */}
            <div className="px-6 pt-5 pb-4 border-b border-zinc-100 dark:border-zinc-800 flex items-start justify-between gap-4 shrink-0">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  Registration Review
                </h3>
                <p className="text-[11px] text-zinc-400 font-mono mt-0.5 truncate">
                  {registration.uuid}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StatusChip status={registration.registration_status} type="reg" />
                <button
                  onClick={close}
                  className="h-7 w-7 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                >
                  <X size={13} />
                </button>
              </div>
            </div>

            {/* ── Scrollable Body ── */}
            <ModalBody className="overflow-y-auto custom-scrollbar px-6 py-4 space-y-4 flex-1">

              {/* UTR — shown first and prominently if present */}
              {registration.utr ? (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-1 flex items-center gap-1">
                    <CreditCard size={11} /> Payment Reference (UTR)
                  </p>
                  <p className="font-mono text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-wider">
                    {registration.utr}
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    Verify this UTR against your payment gateway records before approving.
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs text-zinc-400 italic">
                  No payment reference (UTR) provided for this registration.
                </div>
              )}

              {/* Payment status row */}
              <div className="flex gap-3">
                <div className="flex-1 p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                  <p className="text-[9px] text-zinc-400 uppercase tracking-wide mb-1.5">Payment Status</p>
                  <StatusChip status={registration.payment_status} type="pay" />
                </div>
                <div className="flex-1 p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                  <p className="text-[9px] text-zinc-400 uppercase tracking-wide mb-1">Registered</p>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                    {format(new Date(registration.created_at), "MMM d, yyyy")}
                  </p>
                  <p className="text-[11px] text-zinc-400 font-mono">
                    {format(new Date(registration.created_at), "h:mm a")}
                  </p>
                </div>
                {registration.ticket_code && (
                  <div className="flex-1 p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                    <p className="text-[9px] text-zinc-400 uppercase tracking-wide mb-1">Ticket Code</p>
                    <p className="text-[11px] font-mono font-bold text-zinc-700 dark:text-zinc-200 break-all">
                      {registration.ticket_code}
                    </p>
                  </div>
                )}
              </div>

              <Divider />

              {/* Attendee info */}
              <section>
                <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-600 mb-2">
                  Attendee
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 divide-y divide-zinc-100 dark:divide-zinc-800 sm:divide-y-0">
                  <DetailRow icon={<User size={13} />} label="Full Name" value={u.name} />
                  <DetailRow icon={<Hash size={13} />} label="Reg Number" value={u.reg_num} mono />
                  <DetailRow icon={<Mail size={13} />} label="Email" value={u.email} mono />
                  <DetailRow icon={<Phone size={13} />} label="Phone" value={u.phone_no} mono />
                  <DetailRow icon={<User size={13} />} label="Gender" value={<span className="capitalize">{u.gender}</span>} />
                  <DetailRow icon={<GraduationCap size={13} />} label="Year" value={<span className="capitalize">{u.year}</span>} />
                  <DetailRow icon={<Building2 size={13} />} label="Branch" value={<span className="uppercase">{u.branch}</span>} />
                  <DetailRow icon={<Home size={13} />} label="Hostel" value={u.college_hostel_status ? "Hosteller" : "Day Scholar"} />
                </div>
              </section>
            </ModalBody>

            {/* ── Footer: action buttons ── */}
            <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 shrink-0">
              {isPending ? (
                confirmType === null ? (
                  /* Step 1 — choose action */
                  <div className="flex gap-3">
                    <Button
                      className="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-medium h-10"
                      onPress={close}
                      radius="none"
                    >
                      Close
                    </Button>
                    <Button
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold h-10"
                      onPress={() => setConfirmType("reject")}
                      radius="none"
                      startContent={<XCircle size={15} />}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 bg-[#03a1b0] hover:bg-cyan-600 text-white font-semibold h-10"
                      onPress={() => setConfirmType("approve")}
                      radius="none"
                      startContent={<CheckCircle size={15} />}
                    >
                      Approve
                    </Button>
                  </div>
                ) : (
                  /* Step 2 — confirm chosen action */
                  <div className="space-y-3">
                    <p className={clsx(
                      "text-sm font-semibold text-center",
                      confirmType === "approve"
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                    )}>
                      {confirmType === "approve"
                        ? "Confirm approval for this registration?"
                        : "Confirm cancellation for this registration?"}
                    </p>
                    <div className="flex gap-3">
                      <Button
                        className="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-medium h-10"
                        onPress={() => setConfirmType(null)}
                        radius="none"
                      >
                        ← Back
                      </Button>
                      <Button
                        className={clsx(
                          "flex-1 text-white font-semibold h-10",
                          confirmType === "approve"
                            ? "bg-[#03a1b0] hover:bg-cyan-600"
                            : "bg-red-600 hover:bg-red-700"
                        )}
                        onPress={() => {
                          if (confirmType === "approve") onApprove(registration);
                          else onReject(registration);
                        }}
                        isLoading={isLoading}
                        radius="none"
                      >
                        {confirmType === "approve" ? "Yes, Approve" : "Yes, Cancel"}
                      </Button>
                    </div>
                  </div>
                )
              ) : (
                <Button
                  className="w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-medium h-10"
                  onPress={close}
                  radius="none"
                >
                  Close
                </Button>
              )}
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EventRegistrationsPage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // ── resizable divider ────────────────────────────────────────────────────
  const [leftPct, setLeftPct] = useState(33);     // 20–60 %
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const onDragStart = useCallback(() => {
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const onDragMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const raw = ((e.clientX - rect.left) / rect.width) * 100;
    setLeftPct(Math.min(Math.max(raw, 20), 60));
  }, []);

  const onDragEnd = useCallback(() => {
    isDragging.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onDragMove);
    window.addEventListener("mouseup", onDragEnd);
    return () => {
      window.removeEventListener("mousemove", onDragMove);
      window.removeEventListener("mouseup", onDragEnd);
    };
  }, [onDragMove, onDragEnd]);
  // ────────────────────────────────────────────────────────────────────────

  return (
    <div className="w-full min-h-screen bg-white dark:bg-gray-900 text-zinc-900 dark:text-zinc-100 selection:bg-cyan-500/30">

      {/* Header */}
      <div className="w-full bg-white dark:bg-transparent py-5 border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto px-6 lg:px-8 flex flex-col gap-2">
          {/* <Breadcrumbs radius="none"
            itemClasses={{
              item: "text-zinc-500 data-[current=true]:text-cyan-600 data-[current=true]:font-semibold",
              separator: "text-zinc-400",
            }}
          >
            <BreadcrumbItem>Dashboard</BreadcrumbItem>
            <BreadcrumbItem>Events</BreadcrumbItem>
            <BreadcrumbItem>Registrations</BreadcrumbItem>
          </Breadcrumbs> */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-600/90">
              <LayoutDashboard className="text-white h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h1 className="font-bold tracking-tight text-xl sm:text-2xl truncate">
              Event Registrations
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      {/* Content */}
      <div className="mx-auto px-4 py-4 h-auto lg:h-[calc(100vh-80px)] overflow-visible lg:overflow-hidden">
        <div
          ref={containerRef}
          // column layout on small, row layout on lg+
          className="flex flex-col lg:flex-row gap-3 lg:gap-0 h-auto lg:h-full min-h-0 overflow-visible lg:overflow-hidden"
          // expose width percentage as a CSS var so Tailwind can use it responsively
          style={{ ["--left" as any]: `${leftPct}%` }}
        >
          {/* Left panel (events) */}
          <div
            className="
        w-full
        lg:w-[var(--left)]
        lg:shrink-0
        min-h-0
        h-[38vh] lg:h-full
      "
          >
            <EventsList selectedId={selectedEvent?.uuid} onSelect={setSelectedEvent} />
          </div>

          {/* Drag handle (desktop only) */}
          <div
            onMouseDown={onDragStart}
            className={clsx(
              "hidden lg:flex w-1.5 mx-1 shrink-0 items-center justify-center cursor-col-resize group",
              "hover:bg-cyan-600/30 transition-colors rounded-full select-none"
            )}
            title="Drag to resize"
          >
            <div className="w-0.5 h-10 bg-zinc-300 dark:bg-zinc-700 rounded-full group-hover:bg-cyan-500 transition-colors" />
          </div>

          {/* Right panel (registrations) */}
          <div className="w-full flex flex-col min-h-0 lg:flex-1 overflow-hidden">
            <Card
              className="h-[62vh] lg:h-full border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden"
              radius="none"
              shadow="sm"
            >
              <CardBody className="p-0 h-full flex flex-col overflow-hidden">
                {selectedEvent ? (
                  <RegistrationsTable event={selectedEvent} />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-400">
                    <Users size={64} className="mb-4 opacity-20" />
                    <p className="text-lg font-medium">Select an event to view registrations</p>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── Events List ──────────────────────────────────────────────────────────────

function EventsList({ selectedId, onSelect }: { selectedId?: string; onSelect: (e: Event) => void }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["events-list", page, search],
    queryFn: () => fetchEvents(page, search),
    placeholderData: keepPreviousData,
  });

  const events = data?.data || [];
  const totalPages = data?.last_page || 1;

  return (
    <Card className="h-full border border-zinc-200 dark:border-zinc-800 shadow-sm" radius="none" shadow="sm">
      <CardBody className="p-4 flex flex-col gap-3 h-full">
        <Input
          placeholder="Search events..."
          value={search}
          onValueChange={(v) => { setSearch(v); setPage(1); }}
          isClearable
          startContent={<Search className="text-zinc-400" size={15} />}
          size="sm"
          classNames={{ inputWrapper: "bg-zinc-100 dark:bg-zinc-800" }}
        />

        <div className="flex-1 overflow-y-auto min-h-0 flex flex-col custom-scrollbar">
          {isLoading
            ? [...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 w-full mb-2 rounded" />)
            : events.length === 0
              ? <div className="text-center py-10 text-zinc-400 text-sm">No events found</div>
              : events.map((event) => (
                <button key={event.uuid} onClick={() => onSelect(event)}
                  className={clsx(
                    "text-left p-3 border-b border-zinc-100 dark:border-zinc-800 transition-all duration-150",
                    "border-l-4",
                    selectedId === event.uuid
                      ? "bg-gray-50 dark:bg-gray-950 !border-l-cyan-600 pl-[9px]"
                      : "bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-950 !border-l-transparent"
                  )}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={clsx("font-semibold text-sm line-clamp-1",
                      selectedId === event.uuid ? "text-cyan-700 dark:text-cyan-400" : "text-zinc-900 dark:text-zinc-200"
                    )}>
                      {event.name}
                    </h3>
                    {event.status && (
                      <Chip size="sm" variant="flat" radius="none"
                        classNames={{
                          base: event.status === "published"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                          content: "font-bold text-[10px] uppercase px-1",
                        }}
                      >
                        {event.status}
                      </Chip>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-xs text-zinc-500 dark:text-zinc-400 mt-1.5">
                    <span className="flex items-center gap-1">
                      <CalendarDays size={11} />
                      {format(new Date(event.start_date), "MMM d, yyyy")}
                    </span>
                    {event.type && (
                      <span className="text-[10px] font-bold uppercase tracking-wider">{event.type}</span>
                    )}
                  </div>
                </button>
              ))
          }
        </div>

        <div className="pt-2 flex justify-center border-t border-zinc-100 dark:border-zinc-800">
          <Pagination total={totalPages} page={page} onChange={setPage} size="sm" radius="none" showControls
            classNames={{ cursor: "bg-cyan-600 text-white font-bold", item: "bg-transparent text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800" }}
          />
        </div>
      </CardBody>
    </Card>
  );
}

// ─── Registrations Table ──────────────────────────────────────────────────────

const SORTABLE_COLUMNS: { name: string; uid: SortKey | "actions" }[] = [
  { name: "ATTENDEE", uid: "name" },
  { name: "REG NO.", uid: "reg_num" },
  { name: "STATUS", uid: "registration_status" },
  { name: "PAYMENT", uid: "payment_status" },
  { name: "REGISTERED AT", uid: "created_at" },
  { name: "ACTIONS", uid: "actions" },
];

// ─── Registrations Table ──────────────────────────────────────────────────────

function RegistrationsTable({ event }: { event: Event }) {
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>();

  // search + filters
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // sorting
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // // modals
  // const confirmModal = useDisclosure();
  // const detailModal = useDisclosure();

  const reviewModal = useDisclosure();
  const [reviewItem, setReviewItem] = useState<Registration | null>(null);

  const handleReview = useCallback((item: Registration) => {
    setReviewItem(item);
    reviewModal.onOpen();
  }, [reviewModal]);

  // const [selectedAction, setSelectedAction] = useState<{
  //   item: Registration | null;
  //   actionType: "approve" | "reject";
  // }>({ item: null, actionType: "approve" });

  // const [detailItem, setDetailItem] = useState<Registration | null>(null);

  // ── data ──────────────────────────────────────────────────────────────────

  const { data: registrations = [], isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["registrations", event.uuid],
    queryFn: () => fetchRegistrations(event.uuid),
    enabled: !!event.uuid,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ regUuid, status }: { regUuid: string; status: "confirmed" | "cancelled" }) =>
      axios.put(`${API_BASE_URL}/ebm/event/${event.uuid}/registration/${regUuid}`, {
        registration_status: status,
      }),
    onSuccess: (_, variables) => {
      toast.success(
        `Registration ${variables.status === "confirmed" ? "approved" : "cancelled"} successfully!`
      );
      refetch();
      reviewModal.onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update registration status.");
    },
  });

  // ── filter + sort ─────────────────────────────────────────────────────────

  const filteredItems = useMemo(() => {
    let items = registrations;

    // text search across name, reg_num, utr
    if (filterValue.trim()) {
      const q = filterValue.toLowerCase();
      items = items.filter((item) => {
        const name = (item.public_user?.name || "").toLowerCase();
        const regNum = (item.public_user?.reg_num || "").toLowerCase();
        const utr = (item.utr || "").toLowerCase();
        return name.includes(q) || regNum.includes(q) || utr.includes(q);
      });
    }

    // status filter
    if (statusFilter !== "all") {
      items = items.filter((item) => item.registration_status === statusFilter);
    }

    // sort
    return [...items].sort((a, b) => {
      let valA: string | number = "";
      let valB: string | number = "";

      switch (sortKey) {
        case "name":
          valA = a.public_user?.name || "";
          valB = b.public_user?.name || "";
          break;
        case "reg_num":
          valA = a.public_user?.reg_num || "";
          valB = b.public_user?.reg_num || "";
          break;
        case "registration_status":
          valA = a.registration_status || "";
          valB = b.registration_status || "";
          break;
        case "payment_status":
          valA = a.payment_status || "";
          valB = b.payment_status || "";
          break;
        case "created_at":
          valA = new Date(a.created_at).getTime();
          valB = new Date(b.created_at).getTime();
          break;
      }

      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [registrations, filterValue, statusFilter, sortKey, sortDir]);

  // ── stats ─────────────────────────────────────────────────────────────────

  const stats = useMemo(() => ({
    total: registrations.length,
    confirmed: registrations.filter((r) => r.registration_status === "confirmed").length,
    pending: registrations.filter((r) => r.registration_status === "pending").length,
    cancelled: registrations.filter((r) => r.registration_status === "cancelled").length,
  }), [registrations]);

  // ── sort handler ──────────────────────────────────────────────────────────

  const handleSort = useCallback((key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }, [sortKey]);

  // ── action handlers ───────────────────────────────────────────────────────

  // const handleActionClick = useCallback(
  //   (item: Registration, type: "approve" | "reject") => {
  //     setSelectedAction({ item, actionType: type });
  //     confirmModal.onOpen();
  //   },
  //   [confirmModal]
  // );

  // const handleViewDetails = useCallback(
  //   (item: Registration) => {
  //     setDetailItem(item);
  //     detailModal.onOpen();
  //   },
  //   [detailModal]
  // );

  // const handleConfirmAction = useCallback(() => {
  //   if (!selectedAction.item) return;
  //   updateMutation.mutate({
  //     regUuid: selectedAction.item.uuid,
  //     status: selectedAction.actionType === "approve" ? "confirmed" : "cancelled",
  //   });
  // }, [selectedAction, updateMutation]);

  // ── export ────────────────────────────────────────────────────────────────

  const handleExport = useCallback(() => {
    if (filteredItems.length === 0) {
      toast.error("No data to export.");
      return;
    }

    const rows = filteredItems.map((item) => ({
      "Name": item.public_user?.name || "",
      "Reg Number": item.public_user?.reg_num || "",
      "Email": item.public_user?.email || "",
      "Phone": item.public_user?.phone_no || "",
      "Gender": item.public_user?.gender || "",
      "Year": item.public_user?.year || "",
      "Branch": item.public_user?.branch || "",
      "Hostel": item.public_user?.college_hostel_status ? "Yes" : "No",
      "Registration Status": item.registration_status || "",
      "Payment Status": item.payment_status || "",
      "Is Paid": item.is_paid || "",
      "UTR": item.utr || "",
      "Ticket Code": item.ticket_code || "",
      "Registered At": format(new Date(item.created_at), "MMM d, yyyy h:mm a"),
      "Event": item.event?.name || "",
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registrations");

    // Auto-fit column widths
    const colWidths = Object.keys(rows[0]).map((key) => ({
      wch: Math.max(key.length, ...rows.map((r) => String((r as any)[key]).length)) + 2,
    }));
    ws["!cols"] = colWidths;

    XLSX.writeFile(wb, `${event.name}-registrations-${format(new Date(), "yyyy-MM-dd")}.xlsx`);
    toast.success(`Exported ${rows.length} registrations as Excel.`);
  }, [filteredItems, event.name]);

  // ── render cell ───────────────────────────────────────────────────────────

  const renderCell = useCallback(
    (item: Registration, columnKey: React.Key) => {
      switch (columnKey) {

        case "name": {
          const u = item.public_user;
          return (
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-300">
                  {u?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-zinc-900 dark:text-white leading-tight">
                  {u?.name}
                </span>
                <span className="text-[11px] text-zinc-400 font-mono leading-tight">{u?.email}</span>
              </div>
            </div>
          );
        }

        case "reg_num": {
          return (
            <span className="font-mono text-xs text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
              {item.public_user?.reg_num || "—"}
            </span>
          );
        }

        case "registration_status":
          return <StatusChip status={item.registration_status} type="reg" />;

        case "payment_status":
          return (
            <div className="flex flex-col gap-1">
              <StatusChip status={item.payment_status} type="pay" />
              {item.utr && (
                <span className="text-[10px] text-zinc-400 font-mono">UTR: {item.utr}</span>
              )}
            </div>
          );

        case "created_at":
          return (
            <div className="flex flex-col">
              <span className="text-xs font-medium text-zinc-900 dark:text-zinc-200">
                {format(new Date(item.created_at), "MMM d, yyyy")}
              </span>
              <span className="text-[11px] text-zinc-400 font-mono">
                {format(new Date(item.created_at), "h:mm a")}
              </span>
            </div>
          );

        case "actions": {
          return (
            <div className="flex justify-end items-center overflow-hidden">
              <ActionIconButton
                tooltip="Review Registration"
                placement="left"
                onPress={() => handleReview(item)}
                className={clsx(
                  "font-medium text-xs px-3 w-auto",
                  item.registration_status === "pending"
                    ? "bg-cyan-50 text-cyan-700 hover:bg-cyan-100 dark:bg-cyan-900/20 dark:text-cyan-400"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
                )}
              >
                <Eye size={15} />
              </ActionIconButton>
            </div>
          );
        }

        default:
          return null;
      }
    },
    [navigate, username]
  );

  // ── column header with sort ───────────────────────────────────────────────

  const renderHeader = (col: typeof SORTABLE_COLUMNS[number]) => {
    if (col.uid === "actions") return <span>{col.name}</span>;
    const key = col.uid as SortKey;
    return (
      <button
        className="flex items-center gap-0.5 uppercase text-[10px] font-bold tracking-wider hover:text-cyan-600 transition-colors"
        onClick={() => handleSort(key)}
      >
        {col.name}
        <SortIcon col={key} sortKey={sortKey} sortDir={sortDir} />
      </button>
    );
  };

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full bg-white dark:bg-transparent">

      {/* ── Toolbar ── */}
      <div className="px-4 pt-4 pb-3 border-b border-zinc-200 dark:border-zinc-800 space-y-3">

        {/* Title row */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2 flex-wrap">
              {event.name}
              <Chip size="sm" variant="flat" radius="none"
                className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold"
              >
                {filteredItems.length}
              </Chip>
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1">
              <span className="font-semibold text-cyan-600">Venue:</span> {event.venue}
            </p>
          </div>

          {/* Refresh + Export */}
          <div className="flex gap-2 shrink-0">
            <Button
              startContent={<RefreshCcw size={14} className={isRefetching ? "animate-spin" : ""} />}
              size="sm" radius="none"
              className="text-zinc-700 dark:text-zinc-200 font-medium px-3"
              onPress={() => refetch()}
              isDisabled={isLoading || isRefetching}
            >
              <span className="hidden sm:inline">{isRefetching ? "Refreshing..." : "Refresh"}</span>
            </Button>

            <Button
              startContent={<Download size={14} />}
              size="sm" radius="none"
              className="bg-cyan-600 text-white font-semibold px-3 hover:bg-cyan-700"
              onPress={handleExport}
            >
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>

        {/* Stats pills */}
        {!isLoading && (
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { label: "Total", val: stats.total, bg: "bg-zinc-100 dark:bg-zinc-800", text: "text-zinc-600 dark:text-zinc-300" },
              { label: "Confirmed", val: stats.confirmed, bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-700 dark:text-emerald-400" },
              { label: "Pending", val: stats.pending, bg: "bg-amber-50 dark:bg-amber-900/20", text: "text-amber-700 dark:text-amber-400" },
              { label: "Cancelled", val: stats.cancelled, bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-700 dark:text-red-400" },
            ].map(({ label, val, bg, text }) => (
              <span
                key={label}
                className={clsx("inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold", bg, text)}
              >
                {label}: {val}
              </span>
            ))}
          </div>
        )}

        {/* Search + Status filter */}
        <div className="flex gap-2 flex-wrap">
          <Input
            isClearable
            className="flex-1 min-w-[180px] max-w-xs"
            placeholder="Search by name, reg no. or UTR..."
            startContent={<Search className="text-zinc-400" size={14} />}
            value={filterValue}
            onValueChange={setFilterValue}
            size="sm"
            classNames={{ inputWrapper: "bg-zinc-100 dark:bg-zinc-800 rounded" }}
          />

          <Select
            size="sm"
            radius="none"
            placeholder="All Statuses"
            startContent={<Filter size={13} className="text-zinc-400" />}
            className="w-40"
            classNames={{ trigger: "bg-zinc-100 dark:bg-zinc-800 border-none" }}
            selectedKeys={[statusFilter]}
            onSelectionChange={(keys) => setStatusFilter(String([...keys][0] ?? "all"))}
          >
            <SelectItem key="all">All Statuses</SelectItem>
            <SelectItem key="pending">Pending</SelectItem>
            <SelectItem key="confirmed">Confirmed</SelectItem>
            <SelectItem key="cancelled">Cancelled</SelectItem>
            <SelectItem key="rejected">Rejected</SelectItem>
          </Select>
        </div>
      </div>

      {/* ── Table ── */}
      <Table
        aria-label="Registrations table"
        isHeaderSticky
        radius="none"
        classNames={{
          base: "flex-1 min-h-0 overflow-hidden",
          wrapper: "h-full p-0 rounded-none shadow-none border-none bg-transparent overflow-y-auto custom-scrollbar",
          table: "min-w-full",
          th: "bg-white dark:bg-zinc-950 text-zinc-500 font-bold uppercase text-[10px] tracking-wider border-b border-zinc-200 dark:border-zinc-800 z-10 px-3",
          td: "border-b border-zinc-100 dark:border-zinc-800/50 group-last:border-none py-2.5 px-3",
          tr: "hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition-colors",
        }}

      >
        <TableHeader columns={SORTABLE_COLUMNS}>
          {(col) => (
            <TableColumn key={col.uid} align={col.uid === "actions" ? "end" : "start"}>
              {renderHeader(col)}
            </TableColumn>
          )}
        </TableHeader>

        <TableBody
          items={filteredItems}
          isLoading={isLoading}
          loadingContent={
            <div className="flex flex-col gap-2 p-4">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full rounded" />)}
            </div>
          }
          emptyContent={
            <div className="flex flex-col items-center justify-center py-14 text-zinc-400">
              <Users size={44} className="mb-3 opacity-30" />
              <p className="text-sm font-medium">No registrations found</p>
              {(filterValue || statusFilter !== "all") && (
                <button
                  onClick={() => { setFilterValue(""); setStatusFilter("all"); }}
                  className="mt-2 text-xs text-cyan-600 hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          }
        >
          {(item) => (
            <TableRow key={item.uuid}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* ── Modals ── */}
      <ReviewModal
        registration={reviewItem}
        isOpen={reviewModal.isOpen}
        onClose={reviewModal.onClose}
        onApprove={(reg) => updateMutation.mutate({ regUuid: reg.uuid, status: "confirmed" })}
        onReject={(reg) => updateMutation.mutate({ regUuid: reg.uuid, status: "cancelled" })}
        isLoading={updateMutation.isPending}
      />

    </div>
  );
}


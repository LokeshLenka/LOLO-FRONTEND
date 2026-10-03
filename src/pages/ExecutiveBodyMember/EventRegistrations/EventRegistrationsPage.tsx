import React, { useState, useCallback, useMemo, useEffect, useLayoutEffect, useRef } from "react";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Input, Button, Pagination, Skeleton,
  Tooltip, Modal, ModalContent, ModalBody,
  Select, SelectItem, useDisclosure,
} from "@heroui/react";
import { useSearchParams } from "react-router-dom";
import {
  Search, Download, Eye, CalendarDays, Users, LayoutDashboard,
  RefreshCcw, CheckCircle, CheckCircle2, XCircle, X, ArrowUpDown, ChevronUp,
  ChevronDown, Filter, MapPin, AlertCircle, AlertTriangle, Lock,
  RotateCcw, Clock, Ban, PauseCircle, Circle, Copy, Check,
  CreditCard, User, Hash, Mail, Phone, GraduationCap, Building2, Home,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import clsx from "clsx";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { useDebounce } from "../../../hooks/useDebounce";

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

type SortKey = "name" | "reg_num" | "registration_status" | "created_at";
type SortDir = "asc" | "desc";

type UpdateParams = (updates: Record<string, string | undefined>) => void;

// ─── Constants ────────────────────────────────────────────────────────────────

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DEFAULT_LEFT_PCT = 22;
const MIN_LEFT_PCT = 20;
const MAX_LEFT_PCT = 60;
// Sensible default rail width in px — converted to % of the measured container.
const DEFAULT_RAIL_PX = 320;

const STATUS_FILTER_OPTIONS = ["all", "pending", "confirmed", "cancelled", "rejected"];

// Solid, opaque surfaces for every filter dropdown — the popover must never
// let table content show through.
const FILTER_SELECT_CLASSES = {
  trigger: "bg-zinc-100 dark:bg-slate-800 min-h-10 shadow-none",
  value: "text-zinc-900 dark:text-zinc-100",
  popoverContent: "bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-slate-700 shadow-xl",
};

// Statuses that have been decided — no further reviewer actions are allowed.
// Only an admin can edit a registration once it reaches one of these.
const PROCESSED_STATUSES = new Set(["confirmed", "cancelled", "rejected"]);

const isProcessedStatus = (status: string) => PROCESSED_STATUSES.has(status);

// ─── API ──────────────────────────────────────────────────────────────────────

type EventsResponse = { data: Event[]; last_page: number; current_page: number; total: number };

const EMPTY_EVENTS_PAGE: EventsResponse = { data: [], last_page: 1, current_page: 1, total: 0 };

const fetchEvents = async (page: number, search: string): Promise<EventsResponse> => {
  // Network/API failures throw so the UI can show a real error state instead
  // of a misleading "No events found".
  const { data } = await axios.get(`${API_BASE_URL}/events`, {
    params: { page, per_page: 8, search },
  });
  return data?.data ?? EMPTY_EVENTS_PAGE;
};

const fetchRegistrations = async (eventUuid: string): Promise<Registration[]> => {
  const { data } = await axios.get(
    `${API_BASE_URL}/ebm/event-registrations/public/event/${eventUuid}`
  );
  return Array.isArray(data?.data) ? data.data : [];
};

function apiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const serverMessage = (error.response?.data as { message?: string } | undefined)?.message;
    if (typeof serverMessage === "string" && serverMessage.trim()) return serverMessage;
    if (error.response) return `${fallback} (HTTP ${error.response.status})`;
    return "Could not reach the server. Check your connection and try again.";
  }
  return fallback;
}

// ─── Status system ────────────────────────────────────────────────────────────
// One vocabulary for registration status: a pill with a dot AND a text label
// (never colour alone). Payment is demoted to quiet sub-text (audit F7).

const REG_STATUS_CONFIG: Record<string, { label: string; box: string; dot: string }> = {
  confirmed: {
    label: "Confirmed",
    box: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    dot: "bg-emerald-600 dark:bg-emerald-400",
  },
  pending: {
    label: "Pending",
    box: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    dot: "bg-amber-600 dark:bg-amber-400",
  },
  cancelled: {
    // Withdrawn/inactive — neutral zinc so it never reads as a rejection.
    label: "Cancelled",
    box: "bg-zinc-100 text-zinc-600 border-zinc-300 dark:bg-slate-800 dark:text-zinc-300 dark:border-slate-700",
    dot: "bg-zinc-500 dark:bg-zinc-400",
  },
  rejected: {
    label: "Rejected",
    box: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
    dot: "bg-red-600 dark:bg-red-400",
  },
  waitlisted: {
    label: "Waitlisted",
    box: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20",
    dot: "bg-sky-600 dark:bg-sky-400",
  },
  approved: {
    label: "Approved",
    box: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    dot: "bg-emerald-600 dark:bg-emerald-400",
  },
};

const FALLBACK_STATUS_CONFIG = {
  box: "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-slate-800 dark:text-zinc-300 dark:border-slate-700",
  dot: "bg-zinc-400 dark:bg-zinc-500",
};

const REG_TEXT_TONE: Record<string, string> = {
  confirmed: "text-emerald-700 dark:text-emerald-400",
  approved: "text-emerald-700 dark:text-emerald-400",
  pending: "text-amber-700 dark:text-amber-400",
  waitlisted: "text-sky-700 dark:text-sky-400",
  cancelled: "text-zinc-600 dark:text-zinc-300",
  rejected: "text-red-600 dark:text-red-400",
};

// Glyphs replace the old status dots everywhere (table, badges, rail, modal).
const REG_STATUS_ICON: Record<string, LucideIcon> = {
  confirmed: CheckCircle2,
  approved: CheckCircle2,
  pending: Clock,
  waitlisted: PauseCircle,
  cancelled: Ban,
  rejected: XCircle,
};

function regIcon(status: string): LucideIcon {
  return REG_STATUS_ICON[status] ?? Circle;
}

function regTone(status: string): string {
  return REG_TEXT_TONE[status] ?? "text-zinc-600 dark:text-zinc-300";
}

function regLabel(status: string): string {
  const cfg = REG_STATUS_CONFIG[status];
  if (cfg) return cfg.label;
  return status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown";
}

/** Badge-free status for the table: glyph + registration status, payment beneath. No UTR here. */
function StatusText({ registration }: { registration: Registration }) {
  const Icon = regIcon(registration.registration_status);
  return (
    <span className="flex flex-col items-start gap-0.5 leading-tight">
      <span className={clsx("inline-flex items-center gap-1.5 text-[13px] font-semibold", regTone(registration.registration_status))}>
        <Icon size={14} className="shrink-0" aria-hidden="true" />
        {regLabel(registration.registration_status)}
      </span>
      <span className={clsx("pl-5 text-xs", paymentTone(registration.payment_status))}>
        {paymentLabel(registration.payment_status)}
      </span>
    </span>
  );
}

const STATUS_CHIP_TONE: Record<string, string> = {
  confirmed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  waitlisted: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300",
  cancelled: "bg-zinc-200/70 text-zinc-600 dark:bg-slate-800 dark:text-zinc-300",
  rejected: "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-300",
};

/** Solid text-only status chip for the review dialog header. */
function StatusChip({ status }: { status: string }) {
  return (
    <span className={clsx("shrink-0 rounded-md px-2.5 py-1 text-xs font-bold", STATUS_CHIP_TONE[status] ?? STATUS_CHIP_TONE.cancelled)}>
      {regLabel(status)}
    </span>
  );
}

/** Small bordered fact card (payment status / registered / ticket). */
function MiniCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 rounded-xl border border-zinc-200 bg-white p-3 dark:border-slate-800 dark:bg-zinc-950/50">
      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">{label}</p>
      <div className="mt-1 min-w-0">{children}</div>
    </div>
  );
}

/** Attendee fact row: glyph + stacked label/value, hairline below. */
function AttendeeItem({ icon: Icon, label, mono, children }: {
  icon: LucideIcon;
  label: string;
  mono?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-start gap-2 border-b border-zinc-100 pb-2.5 dark:border-slate-800/60">
      <Icon size={14} className="mt-0.5 shrink-0 text-zinc-400 dark:text-zinc-500" aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">{label}</p>
        <p className={clsx("mt-0.5 break-words text-sm text-zinc-900 dark:text-zinc-100", mono && "font-mono text-[13px]")}>
          {children ?? <span className="italic text-zinc-400 dark:text-zinc-500">—</span>}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status, className }: { status: string; className?: string }) {
  const cfg = REG_STATUS_CONFIG[status];
  const label = regLabel(status);
  const Icon = regIcon(status);
  return (
    <span
      className={clsx(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold",
        cfg?.box ?? FALLBACK_STATUS_CONFIG.box,
        className
      )}
    >
      <Icon size={12} className="shrink-0" aria-hidden="true" />
      {label}
    </span>
  );
}

function paymentLabel(status: string): string {
  switch (status) {
    case "paid":
    case "success":
      return "Paid";
    case "pending":
      return "Payment pending";
    case "failed":
      return "Payment failed";
    case "not_paid":
      return "Not paid";
    default:
      if (!status) return "No payment info";
      return status.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
  }
}

const PAYMENT_TEXT_TONE: Record<string, string> = {
  paid: "text-emerald-700 dark:text-emerald-400",
  success: "text-emerald-700 dark:text-emerald-400",
  pending: "text-amber-700 dark:text-amber-400",
  failed: "text-red-600 dark:text-red-400",
  not_paid: "text-zinc-500 dark:text-zinc-400",
};

function paymentTone(status: string): string {
  return PAYMENT_TEXT_TONE[status] ?? "text-zinc-500 dark:text-zinc-400";
}

// ─── UTR masking (privacy: full value lives behind an explicit reveal) ───────

function maskUtr(utr?: string | null): string {
  if (!utr) return "—";
  const clean = utr.replace(/\s+/g, "");
  return clean.length <= 4 ? clean : `•••• •••• ${clean.slice(-4)}`;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function safeFormat(date: string | null | undefined, pattern: string): string {
  if (!date) return "—";
  try {
    return format(new Date(date), pattern);
  } catch {
    return "—";
  }
}

// ─── Shared components ────────────────────────────────────────────────────────

function PaneErrorState({
  title,
  message,
  onRetry,
  isRetrying,
}: {
  title: string;
  message: string;
  onRetry: () => void;
  isRetrying?: boolean;
}) {
  return (
    <div
      role="alert"
      className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/10">
        <AlertCircle size={20} className="text-red-600 dark:text-red-400" aria-hidden="true" />
      </span>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{title}</p>
        <p className="mx-auto max-w-sm text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{message}</p>
      </div>
      <Button
        size="sm"
        radius="md"
        variant="flat"
        startContent={<RefreshCcw size={14} className={isRetrying ? "animate-spin" : ""} />}
        isDisabled={isRetrying}
        onPress={onRetry}
        className="min-h-10 bg-zinc-100 font-semibold text-zinc-700 dark:bg-slate-800 dark:text-zinc-200"
      >
        {isRetrying ? "Retrying…" : "Retry"}
      </Button>
    </div>
  );
}

function Note({ tone, icon, children }: {
  tone: "warning" | "info";
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <p
      className={clsx(
        "flex items-start gap-2 rounded-lg border px-3 py-2.5 text-xs leading-relaxed",
        tone === "warning"
          ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300"
          : "border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-slate-700 dark:bg-zinc-900 dark:text-zinc-300"
      )}
    >
      <span className="mt-px shrink-0" aria-hidden="true">{icon}</span>
      <span>{children}</span>
    </p>
  );
}

function StatItem({ label, value, icon: Icon, chipClassName, className }: {
  label: string;
  value: number;
  icon: LucideIcon;
  chipClassName?: string;
  className?: string;
}) {
  return (
    <span className="inline-flex items-center gap-2 sm:border-l sm:border-zinc-200 sm:pl-5 sm:first:border-l-0 sm:first:pl-0 dark:sm:border-slate-800">
      <span aria-hidden="true" className={clsx("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", chipClassName)}>
        <Icon size={15} aria-hidden="true" />
      </span>
      <span className="inline-flex min-w-0 flex-col gap-0.5 leading-none">
        <span className={clsx("text-xl font-extrabold tabular-nums tracking-tight", className)}>{value}</span>
        <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">{label}</span>
      </span>
    </span>
  );
}

/** Quiet payment line: payment status as sub-text plus masked UTR (audit F7/F8). */
function PaymentNote({ registration, className }: { registration: Registration; className?: string }) {
  return (
    <span className={clsx("flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs leading-tight", className)}>
      <span className={clsx("font-semibold", paymentTone(registration.payment_status))}>
        {paymentLabel(registration.payment_status)}
      </span>
      {registration.utr && (
        <span className="font-mono text-zinc-500 dark:text-zinc-400">
          UTR {maskUtr(registration.utr)}
        </span>
      )}
    </span>
  );
}

function EmptyState({ title, hint, actionLabel, onAction }: {
  title: string;
  hint?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 dark:bg-slate-800">
        <Users size={20} className="text-zinc-400 dark:text-zinc-500" aria-hidden="true" />
      </span>
      <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">{title}</p>
      {hint && <p className="max-w-xs text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{hint}</p>}
      {actionLabel && onAction && (
        <Button
          size="sm"
          radius="md"
          variant="flat"
          onPress={onAction}
          className="mt-1 min-h-10 bg-zinc-100 font-semibold text-zinc-700 dark:bg-slate-800 dark:text-zinc-200"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

// ─── Review modal ─────────────────────────────────────────────────────────────
// Sections: identity → Registration → Payment → Attendee, then a guarded
// two-step confirmation for the irreversible approve/reject action.

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
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setConfirmType(null);
      setCopied(false);
    }
  }, [isOpen]);

  const copyUtr = useCallback(async () => {
    if (!registration?.utr) return;
    try {
      await navigator.clipboard.writeText(registration.utr);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Could not copy the UTR.");
    }
  }, [registration?.utr]);

  if (!registration) return null;

  const u = registration.public_user;
  const processed = isProcessedStatus(registration.registration_status);

  const requestAction = (type: "approve" | "reject") => {
    if (isLoading) return; // no duplicate submissions while a request is in flight
    if (type === "approve") onApprove(registration);
    else onReject(registration);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      size="lg"
      backdrop="opaque"
      hideCloseButton
      scrollBehavior="inside"
      aria-labelledby="review-modal-title"
      classNames={{
        backdrop: "bg-white/80 dark:bg-black/80 z-[99]",
              base: "bg-white dark:bg-black border border-zinc-200 dark:border-slate-800 rounded-xl shadow-2xl z-[10001] max-w-[92vw] sm:max-w-lg",
        wrapper: "z-[10000]",
        body: "p-0",
      }}
    >
      <ModalContent>
        {(close) => (
          <div className="flex max-h-[85vh] flex-col">
            {/* Header */}
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-zinc-100 px-5 py-4 dark:border-slate-800">
              <div className="min-w-0">
                <h3 id="review-modal-title" className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
                  Registration Review
                </h3>
                <p className="mt-0.5 truncate font-mono text-xs text-zinc-400 dark:text-zinc-500" title={registration.uuid}>
                  {registration.uuid}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <StatusChip status={registration.registration_status} />
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close dialog"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition-colors hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 dark:bg-slate-800 dark:text-zinc-400 dark:hover:bg-slate-700"
                >
                  <X size={15} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Body */}
            <ModalBody className="custom-scrollbar flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {/* UTR hero — the number payments are verified against */}
              <div className="rounded-xl border border-amber-300/60 bg-amber-50 p-4 dark:border-amber-500/25 dark:bg-amber-500/10">
                <div className="flex items-center justify-between gap-2">
                  <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    <CreditCard size={12} className="shrink-0" aria-hidden="true" />
                    Payment reference (UTR)
                  </p>
                  {registration.utr && (
                    <button
                      type="button"
                      onClick={copyUtr}
                      aria-live="polite"
                      className="inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-semibold text-amber-700 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60 dark:text-amber-300"
                    >
                      {copied ? (
                        <><Check size={13} aria-hidden="true" /> Copied</>
                      ) : (
                        <><Copy size={13} aria-hidden="true" /> Copy</>
                      )}
                    </button>
                  )}
                </div>
                <p className="mt-1 break-all font-mono text-xl font-extrabold tracking-wide text-zinc-900 tabular-nums dark:text-amber-100">
                  {registration.utr ? registration.utr : <span className="font-sans text-sm font-normal italic text-zinc-400">—</span>}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {registration.utr
                    ? "Verify this UTR against your payment gateway records before approving."
                    : "No payment reference (UTR) provided for this registration."}
                </p>
              </div>

              {/* Fact mini-cards */}
              <div className="grid grid-cols-3 gap-2.5">
                <MiniCard label="Payment status">
                  <span className={clsx("text-sm font-semibold", paymentTone(registration.payment_status))}>
                    {paymentLabel(registration.payment_status)}
                  </span>
                </MiniCard>
                <MiniCard label="Registered">
                  <p className="text-sm font-semibold text-zinc-900 tabular-nums dark:text-zinc-100">
                    {safeFormat(registration.created_at, "MMM d, yyyy")}
                  </p>
                  <p className="text-xs text-zinc-500 tabular-nums dark:text-zinc-400">
                    {safeFormat(registration.created_at, "h:mm a")}
                  </p>
                </MiniCard>
                <MiniCard label="Ticket code">
                  <p className="break-all font-mono text-xs text-zinc-900 dark:text-zinc-100">
                    {registration.ticket_code || <span className="font-sans italic text-zinc-400">—</span>}
                  </p>
                </MiniCard>
              </div>

              {/* Attendee details */}
              <section>
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400">Attendee</h4>
                <div className="mt-2.5 grid grid-cols-1 gap-x-6 gap-y-2.5 min-[400px]:grid-cols-2">
                  <AttendeeItem icon={User} label="Full name">
                    <span className="font-semibold">{u.name || <span className="font-normal italic text-zinc-400">—</span>}</span>
                  </AttendeeItem>
                  <AttendeeItem icon={Hash} label="Reg number" mono>{u.reg_num}</AttendeeItem>
                  <AttendeeItem icon={Mail} label="Email">{u.email}</AttendeeItem>
                  <AttendeeItem icon={Phone} label="Phone" mono>{u.phone_no}</AttendeeItem>
                  <AttendeeItem icon={User} label="Gender">
                    {u.gender ? <span className="capitalize">{u.gender}</span> : undefined}
                  </AttendeeItem>
                  <AttendeeItem icon={GraduationCap} label="Year">
                    {u.year ? <span className="capitalize">{u.year}</span> : undefined}
                  </AttendeeItem>
                  <AttendeeItem icon={Building2} label="Branch">
                    {u.branch ? <span className="uppercase">{u.branch}</span> : undefined}
                  </AttendeeItem>
                  <AttendeeItem icon={Home} label="Hostel">{u.college_hostel_status ? "Hosteller" : "Day Scholar"}</AttendeeItem>
                </div>
              </section>

              {processed && (
                <Note tone="info" icon={<Lock size={13} />}>
                  This registration has been processed. Only an admin can edit it now — no further actions are available here.
                </Note>
              )}
            </ModalBody>

            {/* Footer */}
            <div className="shrink-0 border-t border-zinc-100 px-5 py-4 dark:border-slate-800">
              {confirmType === null ? (
                processed ? (
                  <Button
                    className="h-12 w-full bg-zinc-100 font-semibold text-zinc-700 dark:bg-slate-800 dark:text-zinc-200"
                    radius="md"
                    onPress={close}
                  >
                    Close
                  </Button>
                ) : (
                  <div className="flex gap-3">
                    <Button
                      className="h-12 flex-1 bg-zinc-100 font-medium text-zinc-700 dark:bg-slate-800 dark:text-zinc-200"
                      radius="md"
                      onPress={close}
                      isDisabled={isLoading}
                    >
                      Close
                    </Button>
                    <Button
                      className="h-12 flex-1 border border-red-300 bg-transparent font-semibold text-red-600 hover:bg-red-50 dark:border-red-500/40 dark:text-red-400 dark:hover:bg-red-500/10"
                      radius="md"
                      startContent={<XCircle size={15} aria-hidden="true" />}
                      onPress={() => setConfirmType("reject")}
                      isDisabled={isLoading}
                    >
                      Reject
                    </Button>
                    <Button
                      className="h-12 flex-1 bg-cyan-600 font-semibold text-white hover:bg-cyan-700"
                      radius="md"
                      startContent={<CheckCircle size={15} aria-hidden="true" />}
                      onPress={() => setConfirmType("approve")}
                      isDisabled={isLoading}
                    >
                      Approve
                    </Button>
                  </div>
                )
              ) : (
                /* Step 2 — explicit, detail-rich confirmation for an irreversible action */
                <div className="space-y-3">
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 dark:border-slate-800 dark:bg-zinc-900">
                    <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {u.name} <span className="font-mono text-xs font-normal text-zinc-500">({u.reg_num || "—"})</span>
                    </p>
                    <p className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                      Status:
                      <StatusBadge status={registration.registration_status} />
                      <span aria-hidden="true" className="text-zinc-400">→</span>
                      <StatusBadge status={confirmType === "approve" ? "confirmed" : "cancelled"} />
                    </p>
                  </div>
                  <Note tone="warning" icon={<AlertTriangle size={13} />}>
                    {confirmType === "approve"
                      ? "Confirm approval — this cannot be undone. Registrations cannot be changed after this action; only an admin can edit a registration once it has been processed."
                      : "Confirm rejection — this cannot be undone. Registrations cannot be changed after this action; only an admin can edit a registration once it has been processed."}
                  </Note>
                  <div className="flex gap-3">
                    <Button
                      className="h-12 flex-1 bg-zinc-100 font-medium text-zinc-700 dark:bg-slate-800 dark:text-zinc-200"
                      radius="md"
                      onPress={() => setConfirmType(null)}
                      isDisabled={isLoading}
                    >
                      ← Back
                    </Button>
                    <Button
                      className={clsx(
                        "h-12 flex-1 font-semibold text-white",
                        confirmType === "approve"
                          ? "bg-cyan-600 hover:bg-cyan-700"
                          : "bg-red-600 hover:bg-red-700"
                      )}
                      radius="md"
                      isLoading={isLoading}
                      onPress={() => requestAction(confirmType)}
                    >
                      {confirmType === "approve" ? "Confirm Approval" : "Confirm Rejection"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function EventRegistrationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialEventUuid = searchParams.get("event");
  const initialQ = searchParams.get("q") ?? "";
  const statusParam = searchParams.get("status") ?? "all";
  const initialStatus = STATUS_FILTER_OPTIONS.includes(statusParam) ? statusParam : "all";
  const initialBranch = searchParams.get("branch") ?? "all";
  const initialYear = searchParams.get("year") ?? "all";
  const epageRaw = Number.parseInt(searchParams.get("epage") ?? "1", 10);
  const initialEPage = Number.isFinite(epageRaw) && epageRaw > 0 ? epageRaw : 1;
  const initialESearch = searchParams.get("esearch") ?? "";

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Update only the given params — every unrelated query param is preserved.
  const updateParams = useCallback<UpdateParams>(
    (updates) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [key, value] of Object.entries(updates)) {
            if (value === undefined || value === "") next.delete(key);
            else next.set(key, value);
          }
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const handleSelectEvent = useCallback(
    (e: Event) => {
      setSelectedEvent(e);
      updateParams({ event: e.uuid });
    },
    [updateParams]
  );

  // ── resizable panels ───────────────────────────────────────────────────────
  const [leftPct, setLeftPct] = useState(DEFAULT_LEFT_PCT);
  const draggingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  // Exact fit: the workspace fills the viewport below the app header + layout
  // padding, so the page never scrolls — each pane scrolls internally and the
  // registration toolbar stays visible. Measured, not magic-numbered.
  const [fitH, setFitH] = useState<number | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const measure = () => {
      const top = root.getBoundingClientRect().top;
      const bottomPad = window.innerWidth >= 768 ? 24 : 16; // layout md:p-6 / py-4
      const h = Math.round(window.innerHeight - top - bottomPad);
      setFitH(h >= 480 ? h : null);
    };
    measure();
    window.addEventListener("resize", measure);
    const header = document.querySelector("header");
    const ro = header && typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    if (header && ro) ro.observe(header);
    return () => {
      window.removeEventListener("resize", measure);
      ro?.disconnect();
    };
  }, []);

  // Sensible default rail width: 320px worth of the measured container.
  const computeDefaultPct = useCallback(() => {
    const w = containerRef.current?.getBoundingClientRect().width ?? 0;
    if (w <= 0) return DEFAULT_LEFT_PCT;
    const pct = (DEFAULT_RAIL_PX / w) * 100;
    return Math.min(Math.max(pct, MIN_LEFT_PCT), MAX_LEFT_PCT);
  }, []);

  // Apply the measured default once the container exists.
  const [defaultPct, setDefaultPct] = useState(DEFAULT_LEFT_PCT);
  useEffect(() => {
    const d = computeDefaultPct();
    setDefaultPct(d);
    setLeftPct(d);
  }, [computeDefaultPct]);

  // Dragging updates the CSS var directly (rAF-throttled, no React re-render
  // per mousemove — that was re-rendering all rows and felt laggy). State is
  // committed once on release so reset/Home/aria stay in sync.
  const pendingPctRef = useRef<number | null>(null);
  const rafRef = useRef(0);

  const finishDrag = useCallback(() => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    if (pendingPctRef.current != null) {
      setLeftPct(pendingPctRef.current);
      pendingPctRef.current = null;
    }
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  const onSeparatorPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      draggingRef.current = true;
      pendingPctRef.current = null;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch { /* capture is best-effort */ }
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    []
  );

  const onSeparatorPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width === 0) return;
      const raw = ((e.clientX - rect.left) / rect.width) * 100;
      pendingPctRef.current = Math.min(Math.max(raw, MIN_LEFT_PCT), MAX_LEFT_PCT);
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = 0;
          if (pendingPctRef.current != null && containerRef.current) {
            containerRef.current.style.setProperty("--left", `${pendingPctRef.current}%`);
          }
        });
      }
    },
    []
  );

  const onSeparatorPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch { /* released already */ }
      finishDrag();
    },
    [finishDrag]
  );

  const onSeparatorKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const step = e.shiftKey ? 10 : 2;
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          setLeftPct((p) => Math.max(MIN_LEFT_PCT, p - step));
          break;
        case "ArrowRight":
          e.preventDefault();
          setLeftPct((p) => Math.min(MAX_LEFT_PCT, p + step));
          break;
        case "Home":
          e.preventDefault();
          setLeftPct(computeDefaultPct());
          break;
        default:
          break;
      }
    },
    [computeDefaultPct]
  );

  // Reset the cursor (and any pending frame) if the component unmounts mid-drag.
  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      finishDrag();
    },
    [finishDrag]
  );

  const resetWidth = useCallback(() => setLeftPct(computeDefaultPct()), [computeDefaultPct]);

  return (
    <div
      ref={rootRef}
      style={fitH ? { height: fitH, minHeight: 0 } : undefined}
      className={clsx(
        "flex min-h-screen w-full flex-col bg-white text-zinc-900 selection:bg-cyan-500/30 dark:bg-gray-900 dark:text-zinc-100",
        fitH ? "overflow-hidden" : "overflow-visible"
      )}
    >
      {/* Compact page header */}
      <div className="shrink-0 border-b border-zinc-200 bg-white dark:border-slate-800 dark:bg-transparent">
        <div className="flex items-center gap-2.5 px-4 py-3 sm:px-6">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-cyan-600" aria-hidden="true">
            <LayoutDashboard className="h-4 w-4 text-white" />
          </span>
          <h1 className="truncate text-lg font-bold tracking-tight">Event Registrations</h1>
        </div>
      </div>

      {/* Workspace: one connected container, events rail + registrations console */}
      <div className="min-h-0 flex-1 overflow-hidden px-4 py-4 sm:px-6">
        <div
          ref={containerRef}
          style={{ ["--left" as string]: `${leftPct}%` }}
          className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-slate-800 dark:bg-[#101828] xl:h-full xl:flex-row"
        >
          {/* Events rail — side-by-side from xl; stacked below with a capped height */}
          <div className="flex max-h-[38vh] min-h-0 flex-col border-b border-zinc-200 dark:border-slate-800 xl:h-full xl:max-h-none xl:w-[var(--left)] xl:shrink-0 xl:border-b-0">
            <EventsList
              selectedId={selectedEvent?.uuid}
              initialUuid={initialEventUuid}
              initialPage={initialEPage}
              initialSearch={initialESearch}
              onSelect={handleSelectEvent}
              updateParams={updateParams}
              onResetWidth={resetWidth}
              canResetWidth={leftPct !== defaultPct}
            />
          </div>

          {/* Resize separator: pointer + keyboard operable */}
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize events and registrations panels"
            aria-valuenow={Math.round(leftPct)}
            aria-valuemin={MIN_LEFT_PCT}
            aria-valuemax={MAX_LEFT_PCT}
            aria-valuetext={`${Math.round(leftPct)} percent events panel`}
            tabIndex={0}
            title="Drag to resize — arrow keys adjust, Home resets"
            onPointerDown={onSeparatorPointerDown}
            onPointerMove={onSeparatorPointerMove}
            onPointerUp={onSeparatorPointerUp}
            onPointerCancel={onSeparatorPointerUp}
            onKeyDown={onSeparatorKeyDown}
            className="group hidden w-3 shrink-0 touch-none select-none items-center justify-center cursor-col-resize focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-500/70 xl:flex"
          >
            <div className="h-12 w-px bg-zinc-300 transition-colors group-hover:bg-cyan-600 group-focus-visible:bg-cyan-600 dark:bg-slate-700" />
          </div>

          {/* Registrations console */}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {selectedEvent ? (
              <RegistrationsTable
                event={selectedEvent}
                updateParams={updateParams}
                initialQ={initialQ}
                initialStatus={initialStatus}
                initialBranch={initialBranch}
                initialYear={initialYear}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-slate-800">
                  <Users size={22} className="text-zinc-400 dark:text-zinc-500" aria-hidden="true" />
                </span>
                <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                  Select an event to view registrations
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Choose one from the events list.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Events list ──────────────────────────────────────────────────────────────

function EventsList({
  selectedId,
  initialUuid,
  initialPage,
  initialSearch,
  onSelect,
  updateParams,
  onResetWidth,
  canResetWidth,
}: {
  selectedId?: string;
  initialUuid?: string | null;
  initialPage: number;
  initialSearch: string;
  onSelect: (e: Event) => void;
  updateParams: UpdateParams;
  onResetWidth: () => void;
  canResetWidth: boolean;
}) {
  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState(initialSearch);
  // Debounced so typing does not fire a request per keystroke.
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isError, isFetching, error, refetch } = useQuery({
    queryKey: ["events-list", page, debouncedSearch],
    queryFn: () => fetchEvents(page, debouncedSearch),
    placeholderData: keepPreviousData, // keep previous results visible while searching
  });

  const events = useMemo(() => data?.data || [], [data]);
  const totalPages = data?.last_page || 1;
  const total = data?.total || 0;

  const goToPage = useCallback(
    (next: number) => {
      setPage(next);
      updateParams({ epage: next > 1 ? String(next) : undefined });
    },
    [updateParams]
  );

  // A restored ?epage beyond the last page would otherwise show an empty list.
  useEffect(() => {
    if (data && data.last_page >= 1 && page > data.last_page) {
      goToPage(data.last_page);
    }
  }, [data, page, goToPage]);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearch(value);
      setPage(1);
      updateParams({ esearch: value || undefined, epage: undefined });
    },
    [updateParams]
  );

  // Deep-link (?event=uuid) and single-event auto-select
  useEffect(() => {
    if (selectedId || events.length === 0) return;
    if (initialUuid) {
      const match = events.find((e) => e.uuid === initialUuid);
      if (match) {
        onSelect(match);
        return;
      }
    }
    if (total === 1 && page === 1 && !search.trim()) {
      onSelect(events[0]);
    }
  }, [events, total, page, search, selectedId, initialUuid, onSelect]);

  const clearSearch = useCallback(() => handleSearchChange(""), [handleSearchChange]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Heading + total count + width reset */}
      <div className="flex items-center justify-between gap-2 border-b border-zinc-200 px-3.5 py-2.5 dark:border-slate-800">
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Events</h2>
          <span
            aria-live="polite"
            aria-label={`${total} events`}
            className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-bold tabular-nums text-zinc-600 dark:bg-slate-800 dark:text-zinc-300"
          >
            {isLoading ? "…" : total}
          </span>
        </div>
        <Tooltip content="Reset panel width" placement="bottom" size="sm"
          classNames={{ base: "z-[99999]", content: "bg-black text-white text-xs font-semibold rounded-md px-2 py-1" }}
        >
          <Button
            isIconOnly
            size="sm"
            radius="md"
            aria-label="Reset panel width"
            isDisabled={!canResetWidth}
            onPress={onResetWidth}
            className="hidden bg-zinc-100 text-zinc-500 hover:bg-zinc-200 disabled:opacity-40 xl:inline-flex dark:bg-slate-800 dark:text-zinc-400 dark:hover:bg-slate-700"
          >
            <RotateCcw size={14} aria-hidden="true" />
          </Button>
        </Tooltip>
      </div>

      {/* Search */}
      <div className="border-b border-zinc-200 px-3 py-2 dark:border-slate-800">
        <Input
          aria-label="Search events"
          placeholder="Search events..."
          value={search}
          onValueChange={handleSearchChange}
          isClearable
          size="sm"
          startContent={<Search className="text-zinc-400" size={14} aria-hidden="true" />}
          classNames={{
            inputWrapper: "bg-zinc-100 dark:bg-slate-800 rounded-md min-h-10",
          }}
        />
      </div>

      {/* List */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="space-y-2 p-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-md bg-zinc-100 dark:bg-slate-800" />
            ))}
          </div>
        ) : isError ? (
          <PaneErrorState
            title="Couldn't load events"
            message={apiErrorMessage(error, "Failed to load events.")}
            onRetry={() => refetch()}
            isRetrying={isFetching}
          />
        ) : events.length === 0 ? (
          search.trim() ? (
            <EmptyState
              title="No events match your search"
              hint={`Nothing found for “${search.trim()}”.`}
              actionLabel="Clear search"
              onAction={clearSearch}
            />
          ) : (
            <EmptyState
              title="No events found"
              hint="Events you create will appear here."
            />
          )
        ) : (
          <div className={clsx("transition-opacity", isFetching && "opacity-60")} aria-busy={isFetching}>
            {events.map((event) => {
              const active = selectedId === event.uuid;
              const statusTone =
                event.status === "published"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                  : event.status === "completed"
                    ? "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-slate-800 dark:text-zinc-300 dark:border-slate-700"
                    : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
              const StatusGlyph =
                event.status === "published"
                  ? CheckCircle2
                  : event.status === "completed"
                    ? Circle
                    : Clock;
              return (
                <button
                  key={event.uuid}
                  type="button"
                  onClick={() => onSelect(event)}
                  aria-pressed={active}
                  className={clsx(
                    "flex w-full min-h-12 flex-col justify-center gap-0.5 border-b border-l-[3px] border-b-zinc-100 px-3.5 py-1.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-500 dark:border-b-zinc-800/70",
                    active
                      ? "border-l-cyan-600 bg-cyan-50/70 dark:border-l-cyan-500 dark:bg-cyan-950/30"
                      : "border-l-transparent hover:bg-zinc-50 dark:hover:bg-slate-800/60"
                  )}
                >
                  <span className="flex items-start justify-between gap-2">
                    <span
                      className={clsx(
                        "min-w-0 flex-1 truncate text-sm font-semibold leading-snug",
                        active
                          ? "text-cyan-800 dark:text-cyan-300"
                          : "text-zinc-900 dark:text-zinc-100"
                      )}
                    >
                      {event.name}
                    </span>
                    {event.status && (
                      <span
                        className={clsx(
                          "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold capitalize",
                          statusTone
                        )}
                      >
                        <StatusGlyph size={10} className="shrink-0" aria-hidden="true" />
                        {event.status}
                      </span>
                    )}
                  </span>
                  <span className="flex items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="inline-flex items-center gap-1 tabular-nums">
                      <CalendarDays size={11} aria-hidden="true" />
                      {safeFormat(event.start_date, "MMM d, yyyy")}
                    </span>
                    {event.type && (
                      <span className="truncate text-[10px] font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                        {event.type}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination only when there is more than one page */}
      {totalPages > 1 && (
        <div className="flex justify-center border-t border-zinc-200 px-2 py-2 dark:border-slate-800">
          <Pagination
            total={totalPages}
            page={page}
            onChange={goToPage}
            size="sm"
            radius="none"
            showControls
            aria-label="Events pages"
            classNames={{
              cursor: "bg-cyan-600 text-white font-bold min-w-11 min-h-11",
              item: "bg-transparent text-zinc-500 hover:bg-zinc-100 dark:hover:bg-slate-800 min-w-11 min-h-11",
              prev: "min-w-11 min-h-11",
              next: "min-w-11 min-h-11",
            }}
          />
        </div>
      )}
    </div>
  );
}

// ─── Registrations ────────────────────────────────────────────────────────────

const SORTABLE_COLUMNS: { name: string; uid: SortKey | "actions"; width?: number }[] = [
  { name: "ATTENDEE", uid: "name" },
  { name: "REG NO.", uid: "reg_num", width: 112 },
  { name: "STATUS", uid: "registration_status", width: 160 },
  { name: "REGISTERED", uid: "created_at", width: 120 },
  { name: "ACTIONS", uid: "actions", width: 72 },
];

function RegistrationsTable({
  event,
  updateParams,
  initialQ,
  initialStatus,
  initialBranch,
  initialYear,
}: {
  event: Event;
  updateParams: UpdateParams;
  initialQ: string;
  initialStatus: string;
  initialBranch: string;
  initialYear: string;
}) {
  // search + filters (state mirrors URL so refresh/share restore the view)
  const [filterValue, setFilterValue] = useState(initialQ);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [branchFilter, setBranchFilter] = useState(initialBranch);
  const [yearFilter, setYearFilter] = useState(initialYear);

  // sorting — HeroUI native sort (aria-sort + keyboard accessible headers)
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const reviewModal = useDisclosure();
  const exportModal = useDisclosure();
  const [reviewItem, setReviewItem] = useState<Registration | null>(null);

  const handleReview = useCallback(
    (item: Registration) => {
      setReviewItem(item);
      reviewModal.onOpen();
    },
    [reviewModal]
  );

  // ── data ────────────────────────────────────────────────────────────────────
  const {
    data: registrations = [],
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
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
        variables.status === "confirmed" ? "Registration approved." : "Registration rejected."
      );
      refetch();
      reviewModal.onClose();
    },
    onError: (err) => {
      toast.error(apiErrorMessage(err, "Failed to update the registration."));
    },
  });

  const handleFilterChange = useCallback(
    (value: string) => {
      setFilterValue(value);
      updateParams({ q: value || undefined });
    },
    [updateParams]
  );

  const handleStatusChange = useCallback(
    (value: string) => {
      setStatusFilter(value);
      updateParams({ status: value === "all" ? undefined : value });
    },
    [updateParams]
  );

  const handleBranchChange = useCallback(
    (value: string) => {
      setBranchFilter(value);
      updateParams({ branch: value === "all" ? undefined : value });
    },
    [updateParams]
  );

  const handleYearChange = useCallback(
    (value: string) => {
      setYearFilter(value);
      updateParams({ year: value === "all" ? undefined : value });
    },
    [updateParams]
  );

  const hasActiveFilters =
    filterValue.trim().length > 0 || statusFilter !== "all" || branchFilter !== "all" || yearFilter !== "all";

  const clearFilters = useCallback(() => {
    setFilterValue("");
    setStatusFilter("all");
    setBranchFilter("all");
    setYearFilter("all");
    updateParams({ q: undefined, status: undefined, branch: undefined, year: undefined });
  }, [updateParams]);

  // Branch / year options come from the loaded registrations.
  const branchOptions = useMemo(() => {
    const set = new Set<string>();
    registrations.forEach((r) => {
      const b = r.public_user?.branch?.trim();
      if (b) set.add(b);
    });
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [registrations]);

  const yearOptions = useMemo(() => {
    const set = new Set<string>();
    registrations.forEach((r) => {
      const y = r.public_user?.year?.trim();
      if (y) set.add(y);
    });
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [registrations]);

  // ── filter + sort ───────────────────────────────────────────────────────────
  const filteredItems = useMemo(() => {
    let items = registrations;

    if (filterValue.trim()) {
      const q = filterValue.toLowerCase();
      items = items.filter((item) => {
        const name = (item.public_user?.name || "").toLowerCase();
        const regNum = (item.public_user?.reg_num || "").toLowerCase();
        const utr = (item.utr || "").toLowerCase();
        return name.includes(q) || regNum.includes(q) || utr.includes(q);
      });
    }

    if (statusFilter !== "all") {
      items = items.filter((item) => item.registration_status === statusFilter);
    }

    if (branchFilter !== "all") {
      items = items.filter((item) => (item.public_user?.branch?.trim() || "") === branchFilter);
    }

    if (yearFilter !== "all") {
      items = items.filter((item) => (item.public_user?.year?.trim() || "") === yearFilter);
    }

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
        case "created_at":
          valA = new Date(a.created_at).getTime();
          valB = new Date(b.created_at).getTime();
          break;
      }

      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [registrations, filterValue, statusFilter, branchFilter, yearFilter, sortKey, sortDir]);

  // ── stats ───────────────────────────────────────────────────────────────────
  const stats = useMemo(
    () => ({
      total: registrations.length,
      confirmed: registrations.filter((r) => r.registration_status === "confirmed").length,
      pending: registrations.filter((r) => r.registration_status === "pending").length,
      cancelled: registrations.filter((r) => r.registration_status === "cancelled").length,
    }),
    [registrations]
  );

  // ── refresh ─────────────────────────────────────────────────────────────────
  const handleRefresh = useCallback(async () => {
    const result = await refetch();
    if (result.isError) {
      toast.error(apiErrorMessage(result.error, "Failed to refresh registrations."));
    } else {
      toast.success("Registrations refreshed.");
    }
  }, [refetch]);

  // ── export (Excel keeps full UTRs for reconciliation — confirm first) ──────
  const runExport = useCallback(() => {
    if (filteredItems.length === 0) {
      toast.error("No registrations to export.");
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
      "Registered At": safeFormat(item.created_at, "MMM d, yyyy h:mm a"),
      "Event": item.event?.name || "",
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registrations");

    const colWidths = Object.keys(rows[0]).map((key) => ({
      wch: Math.max(key.length, ...rows.map((r) => String((r as Record<string, unknown>)[key] ?? "").length)) + 2,
    }));
    ws["!cols"] = colWidths;

    XLSX.writeFile(wb, `${event.name}-registrations-${format(new Date(), "yyyy-MM-dd")}.xlsx`);
    toast.success(`Exported ${rows.length} registrations — the file includes full payment UTRs.`);
    exportModal.onClose();
  }, [filteredItems, event.name, exportModal]);

  // ── render cell ─────────────────────────────────────────────────────────────
  const renderCell = useCallback(
    (item: Registration, columnKey: React.Key) => {
      switch (columnKey) {
        case "name": {
          const u = item.public_user;
          return (
            <div className="flex min-w-0 items-center gap-2.5">
              <span
                aria-hidden="true"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-[11px] font-bold text-zinc-500 dark:bg-slate-800 dark:text-zinc-300"
              >
                {u?.name?.charAt(0)?.toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold leading-tight text-zinc-900 dark:text-white">
                  {u?.name || "—"}
                </p>
                <p className="truncate text-xs leading-tight text-zinc-500 dark:text-zinc-400">
                  {u?.email || "—"}
                </p>
              </div>
            </div>
          );
        }

        case "reg_num":
          return (
            <span className="whitespace-nowrap rounded bg-zinc-100 px-2 py-0.5 font-mono text-xs text-zinc-700 dark:bg-slate-800 dark:text-zinc-300">
              {item.public_user?.reg_num || "—"}
            </span>
          );

        case "registration_status":
          return <StatusText registration={item} />;

        case "created_at":
          return (
            <div className="flex flex-col whitespace-nowrap text-right tabular-nums">
              <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                {safeFormat(item.created_at, "MMM d, yyyy")}
              </span>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                {safeFormat(item.created_at, "h:mm a")}
              </span>
            </div>
          );

        case "actions":
          return (
            <div className="flex justify-end">
              <Tooltip
                content="Review registration"
                placement="left"
                size="sm"
                classNames={{ base: "z-[99999]", content: "bg-black text-white text-xs font-semibold rounded-md px-2 py-1" }}
              >
                <Button
                  isIconOnly
                  size="sm"
                  radius="md"
                  aria-label={`Review registration for ${item.public_user?.name || "attendee"}`}
                  onPress={() => handleReview(item)}
                  className={clsx(
                    "min-h-10 w-10",
                    item.registration_status === "pending"
                      ? "bg-cyan-50 text-cyan-700 hover:bg-cyan-100 dark:bg-cyan-900/20 dark:text-cyan-400 dark:hover:bg-cyan-900/30"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-slate-800 dark:text-zinc-400 dark:hover:bg-slate-700"
                  )}
                >
                  <Eye size={16} aria-hidden="true" />
                </Button>
              </Tooltip>
            </div>
          );

        default:
          return null;
      }
    },
    [handleReview]
  );

  // ── loading / error / empty ─────────────────────────────────────────────────
  const listEmptyContent = (
    <EmptyState
      title={hasActiveFilters ? "No registrations match your filters" : "No registrations yet"}
      hint={
        hasActiveFilters
          ? "Try a different search or clear the current filters."
          : "Registrations for this event will appear here."
      }
      actionLabel={hasActiveFilters ? "Clear filters" : undefined}
      onAction={hasActiveFilters ? clearFilters : undefined}
    />
  );

  const cardsEmpty = (
    <div className="flex min-h-0 flex-1 flex-col">{listEmptyContent}</div>
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white dark:bg-transparent">
      {isError ? (
        <PaneErrorState
          title="Couldn't load registrations"
          message={apiErrorMessage(error, "Failed to load registrations for this event.")}
          onRetry={() => refetch()}
          isRetrying={isRefetching}
        />
      ) : (
        <>
          {/* ── Section A: selected event + actions ── */}
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-zinc-200 px-4 py-2.5 dark:border-slate-800 sm:items-center">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="truncate text-sm font-bold text-zinc-900 dark:text-white sm:text-base">
                  {event.name}
                </h2>
                {!isLoading && (
                  <span
                    className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-bold tabular-nums text-zinc-600 dark:bg-slate-800 dark:text-zinc-300"
                    aria-label={`${stats.total} registrations`}
                  >
                    {stats.total}
                  </span>
                )}
              </div>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                <span className="inline-flex min-w-0 items-center gap-1">
                  <MapPin size={11} className="shrink-0" aria-hidden="true" />
                  <span className="truncate">{event.venue || "TBD"}</span>
                </span>
                <span className="inline-flex items-center gap-1 tabular-nums">
                  <CalendarDays size={11} aria-hidden="true" />
                  {safeFormat(event.start_date, "MMM d, yyyy")}
                </span>
                {event.type && (
                  <span className="font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                    {event.type}
                  </span>
                )}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Tooltip
                content="Reload registrations"
                placement="bottom"
                size="sm"
                classNames={{ base: "z-[99999]", content: "bg-black text-white text-xs font-semibold rounded-md px-2 py-1" }}
              >
                <Button
                  size="sm"
                  radius="md"
                  aria-label="Refresh registrations"
                  startContent={<RefreshCcw size={14} className={isRefetching ? "animate-spin" : ""} aria-hidden="true" />}
                  isDisabled={isLoading || isRefetching}
                  onPress={handleRefresh}
                  className="min-h-10 gap-2 bg-zinc-100 px-3 font-semibold text-zinc-700 dark:bg-slate-800 dark:text-zinc-200"
                >
                  <span className="hidden sm:inline">{isRefetching ? "Refreshing…" : "Refresh"}</span>
                </Button>
              </Tooltip>
              <Tooltip
                content="Export to Excel — includes full payment UTRs"
                placement="bottom"
                size="sm"
                classNames={{ base: "z-[99999]", content: "bg-black text-white text-xs font-semibold rounded-md px-2 py-1" }}
              >
                <Button
                  size="sm"
                  radius="md"
                  aria-label="Export registrations to Excel"
                  startContent={<Download size={14} aria-hidden="true" />}
                  onPress={() => {
                    if (filteredItems.length === 0) {
                      toast.error("No registrations to export.");
                      return;
                    }
                    exportModal.onOpen();
                  }}
                  className="min-h-10 gap-2 bg-cyan-600 px-3 font-semibold text-white hover:bg-cyan-700"
                >
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </Tooltip>
            </div>
          </div>

          {/* ── Section B: statistics ── */}
          {!isLoading && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-b border-zinc-200 px-4 py-2.5 dark:border-slate-800 sm:flex sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2 sm:py-2">
              <StatItem label="Total" value={stats.total} icon={Users} chipClassName="bg-zinc-100 text-zinc-500 dark:bg-slate-800 dark:text-zinc-300" className="text-zinc-800 dark:text-zinc-100" />
              <StatItem label="Confirmed" value={stats.confirmed} icon={CheckCircle2} chipClassName="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" className="text-emerald-700 dark:text-emerald-400" />
              <StatItem label="Pending" value={stats.pending} icon={Clock} chipClassName="bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" className="text-amber-700 dark:text-amber-400" />
              <StatItem label="Cancelled" value={stats.cancelled} icon={Ban} chipClassName="bg-zinc-100 text-zinc-500 dark:bg-slate-800 dark:text-zinc-300" className="text-zinc-600 dark:text-zinc-300" />
              {hasActiveFilters && (
                <span
                  aria-live="polite"
                  className="col-span-2 rounded-md bg-zinc-100 px-2 py-1 text-xs font-semibold text-zinc-600 tabular-nums sm:col-span-1 sm:ml-auto dark:bg-slate-800 dark:text-zinc-300"
                >
                  Showing {filteredItems.length} of {stats.total}
                </span>
              )}
            </div>
          )}

          {/* ── Section C: search + status filter ── */}
          <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 px-4 py-2 dark:border-slate-800">
            <Input
              aria-label="Search registrations by name, registration number, or UTR"
              isClearable
              className="min-w-[180px] flex-1 sm:max-w-xs"
              placeholder="Name, reg no., UTR…"
              startContent={<Search className="text-zinc-400" size={14} aria-hidden="true" />}
              value={filterValue}
              onValueChange={handleFilterChange}
              size="sm"
              classNames={{ inputWrapper: "bg-zinc-100 dark:bg-slate-800 rounded-md min-h-10" }}
            />

            <Select
              aria-label="Filter by registration status"
              size="sm"
              radius="md"
              placeholder="All Statuses"
              startContent={<Filter size={13} className="text-zinc-400" aria-hidden="true" />}
              className="w-full sm:w-40"
              classNames={FILTER_SELECT_CLASSES}
              selectedKeys={[statusFilter]}
              onSelectionChange={(keys) => handleStatusChange(String([...keys][0] ?? "all"))}
            >
              <SelectItem key="all">All Statuses</SelectItem>
              <SelectItem key="pending">Pending</SelectItem>
              <SelectItem key="confirmed">Confirmed</SelectItem>
              <SelectItem key="cancelled">Cancelled</SelectItem>
              <SelectItem key="rejected">Rejected</SelectItem>
            </Select>

            <Select
              aria-label="Filter by branch"
              size="sm"
              radius="md"
              placeholder="All Branches"
              className="w-full sm:w-40"
              classNames={FILTER_SELECT_CLASSES}
              selectedKeys={[branchFilter]}
              onSelectionChange={(keys) => handleBranchChange(String([...keys][0] ?? "all"))}
            >
              {["all", ...branchOptions].map((b) => (
                <SelectItem key={b}>{b === "all" ? "All Branches" : b.toUpperCase()}</SelectItem>
              ))}
            </Select>

            <Select
              aria-label="Filter by year"
              size="sm"
              radius="md"
              placeholder="All Years"
              className="w-full sm:w-40"
              classNames={FILTER_SELECT_CLASSES}
              selectedKeys={[yearFilter]}
              onSelectionChange={(keys) => handleYearChange(String([...keys][0] ?? "all"))}
            >
              {["all", ...yearOptions].map((y) => (
                <SelectItem key={y}>{y === "all" ? "All Years" : y.charAt(0).toUpperCase() + y.slice(1)}</SelectItem>
              ))}
            </Select>
          </div>

          {/* ── Mobile cards ── */}
          <div className="custom-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto p-3 md:hidden">
            {isLoading ? (
              [...Array(4)].map((_, i) => <Skeleton key={i} className="h-36 w-full rounded-lg bg-zinc-100 dark:bg-slate-800" />)
            ) : filteredItems.length === 0 ? (
              cardsEmpty
            ) : (
              filteredItems.map((item) => {
                const u = item.public_user;
                return (
                  <article
                    key={item.uuid}
                    className="space-y-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-slate-800 dark:bg-zinc-950/50"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-bold text-zinc-500 dark:bg-slate-800 dark:text-zinc-300"
                      >
                        {u?.name?.charAt(0)?.toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-bold text-zinc-900 dark:text-white">{u?.name || "—"}</p>
                        <p className="truncate font-mono text-xs text-zinc-500 dark:text-zinc-400">{u?.reg_num || "—"}</p>
                      </div>
                      <StatusBadge status={item.registration_status} />
                    </div>

                    {/* Both statuses on mobile (audit requirement) */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <PaymentNote registration={item} />
                      <span className="shrink-0 text-xs text-zinc-500 tabular-nums dark:text-zinc-400">
                        {safeFormat(item.created_at, "MMM d, yyyy · h:mm a")}
                      </span>
                    </div>

                    <Button
                      className="min-h-12 w-full bg-cyan-600 font-semibold text-white hover:bg-cyan-700"
                      radius="md"
                      onPress={() => handleReview(item)}
                      startContent={<Eye size={18} aria-hidden="true" />}
                      aria-label={`Review registration for ${u?.name || "attendee"}`}
                    >
                      Review Registration
                    </Button>
                  </article>
                );
              })
            )}
          </div>

          {/* ── Desktop table (native accessible sorting) ── */}
          <Table
            aria-label={`Registrations for ${event.name}`}
            isHeaderSticky
            radius="none"
            className="hidden md:flex"
            sortDescriptor={{
              column: sortKey,
              direction: sortDir === "asc" ? "ascending" : "descending",
            }}
            onSortChange={(descriptor) => {
              setSortKey(descriptor.column as SortKey);
              setSortDir(descriptor.direction === "descending" ? "desc" : "asc");
            }}
            sortIcon={({ "data-visible": visible, "data-direction": direction }) => {
              // HeroUI does not merge its slot classes into function icons, so the
              // inline-block/align utilities must be set here (Tailwind preflight
              // makes bare <svg> display:block, which stacked the icon below the label).
              const active = visible === true || visible === "true";
              return active ? (
                direction === "descending" ? (
                  <ChevronDown size={12} className="ms-1.5 inline-block text-cyan-600 dark:text-cyan-400" aria-hidden="true" />
                ) : (
                  <ChevronUp size={12} className="ms-1.5 inline-block text-cyan-600 dark:text-cyan-400" aria-hidden="true" />
                )
              ) : (
                <ArrowUpDown size={11} className="ms-1.5 inline-block text-zinc-400" aria-hidden="true" />
              );
            }}
            classNames={{
              base: "flex-1 min-h-0 overflow-hidden",
              wrapper: "h-full p-0 rounded-none shadow-none border-none bg-transparent overflow-auto custom-scrollbar",
              table: "min-w-[620px] table-fixed",
              th: "bg-zinc-100 dark:bg-slate-800 text-zinc-500 dark:text-zinc-400 font-semibold uppercase text-[11px] tracking-wide border-b border-zinc-200 dark:border-slate-700 z-10 px-3",
              td: "border-b border-zinc-100 dark:border-slate-800/50 group-last:border-none py-2 px-3",
              tr: "hover:bg-zinc-50 dark:hover:bg-slate-800/60 focus-within:bg-zinc-50 dark:focus-within:bg-slate-800/60 transition-colors",
            }}
          >
            <TableHeader columns={SORTABLE_COLUMNS}>
              {(col) => (
                <TableColumn
                  key={col.uid}
                  allowsSorting={col.uid !== "actions"}
                  align={col.uid === "created_at" || col.uid === "actions" ? "end" : "start"}
                  width={col.width}
                >
                  <span
                    className={clsx(
                      col.uid !== "actions" && sortKey === col.uid && "text-cyan-700 dark:text-cyan-400"
                    )}
                  >
                    {col.name}
                  </span>
                </TableColumn>
              )}
            </TableHeader>

            <TableBody
              items={filteredItems}
              isLoading={isLoading}
              loadingContent={
                <div className="flex flex-col gap-2 p-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded bg-zinc-100 dark:bg-slate-800" />
                  ))}
                </div>
              }
              emptyContent={listEmptyContent}
            >
              {(item) => (
                <TableRow key={item.uuid}>
                  {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* ── Export confirmation (privacy notice) ── */}
          <Modal
            isOpen={exportModal.isOpen}
            onClose={exportModal.onClose}
            placement="center"
            size="sm"
            hideCloseButton
            aria-labelledby="export-modal-title"
            classNames={{
              backdrop: "bg-white/80 dark:bg-black/80 z-[99]",
              base: "bg-white dark:bg-black border border-zinc-200 dark:border-slate-800 rounded-xl shadow-2xl z-[10001]",
              wrapper: "z-[10000]",
              body: "p-0",
            }}
          >
            <ModalContent>
              {(close) => (
                <div className="flex flex-col">
                  <div className="border-b border-zinc-100 px-5 py-4 dark:border-slate-800">
                    <h3 id="export-modal-title" className="text-base font-bold text-zinc-900 dark:text-white">
                      Export registrations?
                    </h3>
                  </div>
                  <div className="space-y-3 px-5 py-4">
                    <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                      The Excel file for <span className="font-semibold text-zinc-900 dark:text-zinc-100">{event.name}</span> contains{" "}
                      <span className="font-semibold tabular-nums">{filteredItems.length}</span> registration
                      {filteredItems.length === 1 ? "" : "s"} with attendee contact details (name, email, phone,
                      registration number), registration and payment statuses, ticket codes, and full payment
                      UTRs for reconciliation.
                    </p>
                    <Note tone="warning" icon={<AlertTriangle size={13} />}>
                      Anyone with this file can view payment identifiers. Share it only through trusted channels.
                    </Note>
                  </div>
                  <div className="flex gap-3 border-t border-zinc-100 px-5 py-4 dark:border-slate-800">
                    <Button
                      className="h-11 flex-1 bg-zinc-100 font-medium text-zinc-700 dark:bg-slate-800 dark:text-zinc-200"
                      radius="md"
                      onPress={close}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="h-11 flex-1 bg-cyan-600 font-semibold text-white hover:bg-cyan-700"
                      radius="md"
                      startContent={<Download size={14} aria-hidden="true" />}
                      onPress={runExport}
                    >
                      Export
                    </Button>
                  </div>
                </div>
              )}
            </ModalContent>
          </Modal>

          {/* ── Review modal ── */}
          <ReviewModal
            registration={reviewItem}
            isOpen={reviewModal.isOpen}
            onClose={reviewModal.onClose}
            onApprove={(reg) => {
              if (updateMutation.isPending) return;
              updateMutation.mutate({ regUuid: reg.uuid, status: "confirmed" });
            }}
            onReject={(reg) => {
              if (updateMutation.isPending) return;
              updateMutation.mutate({ regUuid: reg.uuid, status: "cancelled" });
            }}
            isLoading={updateMutation.isPending}
          />
        </>
      )}
    </div>
  );
}

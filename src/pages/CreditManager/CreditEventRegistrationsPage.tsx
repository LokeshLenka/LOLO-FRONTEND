import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import {
  ArrowLeft,
  BadgeCheck,
  CircleDollarSign,
  CreditCard,
  Eye,
  Pencil,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePagination } from "@/components/pagination/TablePagination";
import { CreditFormSheet } from "@/components/credit-manager/CreditFormSheet";
import { CMBreadcrumb } from "@/components/credit-manager/CMBreadcrumb";
import { EligibilityBadge } from "@/components/credit-manager/EligibilityBadge";
import {
  assignerName,
  canManageCredit,
} from "@/components/credit-manager/creditUtils";
import {
  useCMEventRegistrations,
  type CMEventRegistrationItem,
} from "@/hooks/useCMEventRegistrations";

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: "easeOut" },
  },
};

function formatAmount(value?: number | string | null) {
  if (value == null || value === "") return "—";
  return Number(value).toFixed(2);
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString();
}

function renderRegistrationStatus(status?: string) {
  const normalized = (status ?? "").toLowerCase();

  const config =
    normalized === "confirmed"
      ? {
          label: "Confirmed",
          className:
            "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
        }
      : normalized === "pending"
        ? {
            label: "Pending",
            className:
              "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300",
          }
        : normalized === "not_registered"
          ? {
              label: "Not registered",
              className:
                "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300",
            }
          : {
              label: status || "Unknown",
              className:
                "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-[#344054] dark:bg-[#1D2939] dark:text-[#98A2B3]",
            };

  return (
    <Badge
      variant="outline"
      className={`rounded-none border px-2 py-1 text-[10px] uppercase tracking-[0.2em] ${config.className}`}
    >
      {config.label}
    </Badge>
  );
}

function renderCreditStatus(hasCredit: boolean) {
  return hasCredit ? (
    <Badge
      variant="outline"
      className="rounded-none border border-zinc-300 bg-zinc-100 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-900 dark:border-[#344054] dark:bg-[#1D2939] dark:text-[#F2F4F7]"
    >
      Assigned
    </Badge>
  ) : (
    <Badge
      variant="outline"
      className="rounded-none border border-zinc-200 bg-white px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-500 dark:border-[#344054] dark:bg-[#161F2E] dark:text-[#98A2B3]"
    >
      Unassigned
    </Badge>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
}) {
  return (
    <Card className="rounded-none border-zinc-200 shadow-none dark:border-[#344054] dark:bg-[#161F2E]">
      <CardContent className="flex items-center justify-between p-5">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-[#667085]">
            {title}
          </p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center border border-zinc-200 text-zinc-600 dark:border-[#344054] dark:bg-[#1D2939] dark:text-[#98A2B3]">
          <Icon className="h-4 w-4" />
        </div>
      </CardContent>
    </Card>
  );
}

function memberSubRole(row: CMEventRegistrationItem) {
  return (
    row.user.managementProfile?.sub_role ??
    row.user.musicProfile?.sub_role ??
    row.user.promoted_role ??
    row.user.role
  );
}

const MEMBER_TABS = [
  { value: "registered", label: "Registered members" },
  { value: "management", label: "Management" },
] as const;

export default function CreditEventRegistrationsPage() {
  const navigate = useNavigate();
  const { eventUuid = "", username = "" } = useParams<{
    eventUuid: string;
    username: string;
  }>();

  const {
    registrations,
    event: eventMeta,
    meta,
    isLoading,
    isError,
    setPage,
    filters,
    setFilters,
    refresh,
    assignCredit,
    updateCredit,
    bulkAssign,
    bulkUpdate,
  } = useCMEventRegistrations(eventUuid);

  const [selectedRow, setSelectedRow] =
    useState<CMEventRegistrationItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [bulkMode, setBulkMode] = useState<"assign" | "update">("assign");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const stats = useMemo(() => {
    const total = registrations.length;
    const credited = registrations.filter((r) => r.credit !== null).length;
    const uncredited = total - credited;
    const management = registrations.filter(
      (r) => r.is_management_member,
    ).length;
    return { total, credited, uncredited, management };
  }, [registrations]);

  const eventName =
    eventMeta?.name ??
    registrations[0]?.event?.name ??
    "Event credit management";
  const eventType = eventMeta?.type ?? registrations[0]?.event?.type;
  const maxCredits =
    eventMeta?.credits_awarded ?? registrations[0]?.event?.credits_awarded;
  const isPublicEvent = (eventType ?? "").toLowerCase() === "public";

  const isRowSelectable = (row: CMEventRegistrationItem) =>
    (row.eligibility_status === "management" ||
      row.eligibility_status === "registered" ||
      row.eligibility_status === "eligible") &&
    (!row.credit || canManageCredit(row.credit));

  const selectableRows = useMemo(
    () => registrations.filter(isRowSelectable),
    [registrations],
  );

  const selectedAssignableIds = useMemo(
    () =>
      selectableRows
        .filter((r) => !r.credit && selectedIds.includes(r.user_id))
        .map((r) => r.user_id),
    [selectableRows, selectedIds],
  );

  const selectedUpdatableIds = useMemo(
    () =>
      selectableRows
        .filter((r) => r.credit && selectedIds.includes(r.user_id))
        .map((r) => r.user_id),
    [selectableRows, selectedIds],
  );

  const toggleSelect = (userId: number) => {
    setSelectedIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const toggleSelectAll = () => {
    const ids = selectableRows.map((r) => r.user_id);
    setSelectedIds((prev) =>
      prev.length === ids.length && ids.length > 0 ? [] : ids,
    );
  };

  const openAssign = (row: CMEventRegistrationItem) => {
    setSelectedRow(row);
    setFormMode("create");
    setIsFormOpen(true);
  };

  const openEdit = (row: CMEventRegistrationItem) => {
    setSelectedRow(row);
    setFormMode("edit");
    setIsFormOpen(true);
  };

  const handleCreditSubmit = async (amount: number) => {
    if (!selectedRow) return;
    if (formMode === "create") {
      await assignCredit({ user_id: selectedRow.user_id, amount });
      return;
    }
    if (!selectedRow.credit) throw new Error("Credit UUID missing for update");
    await updateCredit(selectedRow.credit.uuid, {
      user_id: selectedRow.user_id,
      amount,
    });
  };

  const openBulk = (mode: "assign" | "update") => {
    setBulkMode(mode);
    setIsBulkOpen(true);
  };

  const handleBulkSubmit = async (amount: number) => {
    const ids =
      bulkMode === "assign" ? selectedAssignableIds : selectedUpdatableIds;
    if (ids.length === 0) return;
    const ok =
      bulkMode === "assign"
        ? await bulkAssign({ user_ids: ids, amount })
        : await bulkUpdate({ user_ids: ids, amount });
    if (ok) {
      setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
      setIsBulkOpen(false);
    }
  };

  const activeTab = filters.member_type ?? "all";

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <CMBreadcrumb
        items={[
          { label: "Dashboard", to: `/${username}/credit_manager/dashboard` },
          { label: "Events", to: `/${username}/credit_manager/events` },
          { label: eventName },
        ]}
      />
      <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 dark:border-[#344054] md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-[#667085]">
            Credit Manager
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-[#F2F4F7]">
            {eventName}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-[#98A2B3]">
            Assign credits to participants and management members for this
            event.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => navigate(`/${username}/credit_manager/events`)}
          className="min-h-[44px] w-full justify-center rounded-none border-zinc-300 sm:w-auto dark:border-[#344054]"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          All events
        </Button>
      </div>

      {isPublicEvent ? (
        <div className="border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
          <p className="font-medium">Public event</p>
          <p className="mt-1 text-[13px]">
            Credits cannot be assigned to registered members for public events.
            Only management members are eligible here.
          </p>
        </div>
      ) : (
        <div className="border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
          <p className="font-medium">Who can receive credits for this event?</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-5 text-[13px]">
            <li>Registered members are eligible for credits.</li>
            <li>
              Management members are eligible with or without registration.
            </li>
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard title="Shown" value={stats.total} icon={UserRound} />
        <StatCard
          title="Management"
          value={stats.management}
          icon={ShieldCheck}
        />
        <StatCard
          title="Credited"
          value={stats.credited}
          icon={CircleDollarSign}
        />
        <StatCard
          title="Uncredited"
          value={stats.uncredited}
          icon={CreditCard}
        />
      </div>

      <Card className="rounded-none border-zinc-200 shadow-none dark:border-[#344054] dark:bg-[#161F2E]">
        <CardHeader className="space-y-4 border-b border-zinc-200 px-5 py-4 dark:border-[#344054]">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-base font-semibold tracking-tight">
              Eligible members
              {eventType ? (
                <span className="ml-2 align-middle text-[10px] font-normal uppercase tracking-[0.2em] text-zinc-500">
                  {eventType} event
                  {maxCredits != null ? ` · max ${maxCredits}` : ""}
                </span>
              ) : null}
            </CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Input
                placeholder="Search username or email"
                value={filters.search ?? ""}
                onChange={(e) => {
                  setPage(1);
                  setFilters((prev) => ({ ...prev, search: e.target.value }));
                }}
                className="h-9 w-full rounded-none border-zinc-300 dark:border-[#344054] sm:w-56"
              />
              <Select
                value={filters.credit_status ?? "all"}
                onValueChange={(value) => {
                  setPage(1);
                  setFilters((prev) => ({
                    ...prev,
                    credit_status: value as "all" | "credited" | "uncredited",
                  }));
                }}
              >
                <SelectTrigger className="w-full rounded-none border-zinc-300 dark:border-[#344054] sm:w-44">
                  <SelectValue placeholder="Credit status" />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  <SelectItem value="all">All credit states</SelectItem>
                  <SelectItem value="credited">Credited</SelectItem>
                  <SelectItem value="uncredited">Uncredited</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Member tabs — segmented 2-up on mobile */}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
            {MEMBER_TABS.map((tab) => (
              <Button
                key={tab.value}
                variant={activeTab === tab.value ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setPage(1);
                  setSelectedIds([]);
                  setFilters((prev) => ({
                    ...prev,
                    member_type: tab.value as typeof prev.member_type,
                  }));
                }}
                className={`min-h-[44px] justify-center rounded-none ${
                  activeTab === tab.value
                    ? "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-[#7F56D9] dark:text-white"
                    : "border-zinc-300 dark:border-[#344054]"
                }`}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Selection + bulk actions */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
            <div className="flex flex-1 flex-col gap-3 border border-zinc-200 bg-zinc-50 p-3 sm:flex-row sm:items-center dark:border-[#344054] dark:bg-[#1D2939]">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-zinc-600 dark:text-[#98A2B3]">
                  <span className="font-semibold text-zinc-950 dark:text-[#F2F4F7]">
                    {selectedIds.length}
                  </span>{" "}
                  selected
                  <span className="ml-1 text-xs">
                    · {selectedAssignableIds.length} to assign ·{" "}
                    {selectedUpdatableIds.length} to update
                  </span>
                </p>
                {selectedIds.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedIds([])}
                    className="min-h-[44px] shrink-0 rounded-none px-3"
                  >
                    Clear
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 sm:ml-auto sm:flex sm:items-center">
                <Button
                  size="sm"
                  disabled={selectedAssignableIds.length === 0}
                  onClick={() => openBulk("assign")}
                  title="Assign credits to selected uncredited members"
                  className="min-h-[44px] rounded-none bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-[#7F56D9] dark:text-white dark:hover:bg-[#9E77ED]"
                >
                  Assign ({selectedAssignableIds.length})
                </Button> 
                <Button
                  size="sm"
                  disabled={selectedUpdatableIds.length === 0}
                  onClick={() => openBulk("update")}
                  title="Update credits for selected credited members"
                  className="min-h-[44px] rounded-none border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100 disabled:opacity-50 dark:border-[#344054] dark:bg-transparent dark:text-[#F2F4F7] dark:hover:bg-[#253247]"
                >
                  Update ({selectedUpdatableIds.length})
                </Button>
              </div>
            </div>
            <div className="border border-zinc-200 bg-zinc-50 p-3 sm:flex-row sm:items-center dark:border-[#344054] dark:bg-[#1D2939]">
              <Button
                size="sm"
                variant="outline"
                onClick={() => refresh()}
                className="min-h-[44px] w-full rounded-none border-zinc-300 sm:w-auto dark:border-[#344054] my-auto"
              >
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-5">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-12 animate-pulse rounded-none border border-zinc-200 bg-zinc-50 dark:border-[#344054] dark:bg-[#1D2939]"
                />
              ))}
            </div>
          ) : isError ? (
            <div className="p-8 text-center text-sm text-red-600 dark:text-red-400">
              Failed to load eligible members for this event.
            </div>
          ) : registrations.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-zinc-500 dark:text-[#98A2B3]">
                No members match the current filters.
              </p>
            </div>
          ) : (
            <>
              {/* Mobile cards — no horizontal scroll, full-width tap targets */}
              <div className="space-y-3 p-4 md:hidden">
                {registrations.map((row) => {
                  const selectable = isRowSelectable(row);
                  const isRegisteredView =
                    row.is_registered && !row.uuid.startsWith("mgmt_");
                  const credited = Boolean(row.credit);
                  return (
                    <div
                      key={`${row.user_id}-${row.uuid}`}
                      className={`border border-zinc-200 border-l-4 bg-white p-4 dark:border-[#344054] dark:bg-[#1D2939] ${
                        credited ? "border-l-emerald-500" : "border-l-amber-400"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedIds.includes(row.user_id)}
                          disabled={!selectable}
                          onCheckedChange={() => toggleSelect(row.user_id)}
                          aria-label={`Select ${row.user.username}`}
                          className="h-5 w-5 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-zinc-950 dark:text-[#F2F4F7]">
                            {row.user.username}
                          </p>
                          <p className="truncate text-xs capitalize text-zinc-500 dark:text-[#98A2B3]">
                            {memberSubRole(row)}
                            {row.is_management_member ? " · management" : ""}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="font-medium text-zinc-950 dark:text-[#F2F4F7]">
                            {formatAmount(row.credit?.amount)}
                          </p>
                          <p
                            className={`text-[10px] uppercase tracking-[0.15em] ${
                              credited
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-amber-600 dark:text-amber-400"
                            }`}
                          >
                            {credited ? "Credited" : "Uncredited"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <EligibilityBadge
                          status={row.eligibility_status}
                          size="sm"
                        />
                        {renderRegistrationStatus(row.registration_status)}
                        {renderCreditStatus(Boolean(row.credit))}
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            if (isRegisteredView) {
                              navigate(
                                `/${username}/credit_manager/registrations/${row.uuid}`,
                              );
                            } else {
                              setSelectedRow(row);
                              setIsDetailOpen(true);
                            }
                          }}
                          className="min-h-[44px] rounded-none border-zinc-300 dark:border-[#344054]"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                        {row.credit ? (
                          <Button
                            disabled={!canManageCredit(row.credit)}
                            onClick={() => openEdit(row)}
                            className="min-h-[44px] rounded-none bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-[#7F56D9] dark:text-white dark:hover:bg-[#9E77ED]"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        ) : (
                          <Button
                            disabled={
                              row.eligibility_status === "pending" ||
                              row.eligibility_status === "public" ||
                              row.eligibility_status === "not_eligible"
                            }
                            onClick={() => openAssign(row)}
                            className="min-h-[44px] rounded-none bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-[#7F56D9] dark:text-white dark:hover:bg-[#9E77ED]"
                          >
                            <CreditCard className="mr-2 h-4 w-4" />
                            Assign
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-zinc-200 bg-zinc-50 hover:bg-zinc-50 dark:border-[#344054] dark:bg-[#1D2939] dark:hover:bg-[#253247]">
                      <TableHead className="w-12">
                        <Checkbox
                          checked={
                            selectableRows.length > 0 &&
                            selectedIds.length === selectableRows.length
                          }
                          onCheckedChange={toggleSelectAll}
                          aria-label="Select all"
                        />
                      </TableHead>
                      <TableHead className="text-zinc-900 dark:text-[#F2F4F7]">
                        Member
                      </TableHead>
                      <TableHead className="text-zinc-900 dark:text-[#F2F4F7]">
                        Eligibility
                      </TableHead>
                      <TableHead className="text-zinc-900 dark:text-[#F2F4F7]">
                        Registration
                      </TableHead>
                      <TableHead className="text-zinc-900 dark:text-[#F2F4F7]">
                        Credit
                      </TableHead>
                      <TableHead className="text-zinc-900 dark:text-[#F2F4F7]">
                        Amount
                      </TableHead>
                      <TableHead className="w-[220px] text-right text-zinc-900 dark:text-[#F2F4F7]">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {registrations.map((row) => {
                      const selectable = isRowSelectable(row);
                      return (
                        <TableRow
                          key={`${row.user_id}-${row.uuid}`}
                          className="border-zinc-200 dark:border-[#344054]"
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedIds.includes(row.user_id)}
                              disabled={!selectable}
                              onCheckedChange={() => toggleSelect(row.user_id)}
                              aria-label={`Select ${row.user.username}`}
                            />
                          </TableCell>

                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-medium text-zinc-950 dark:text-[#F2F4F7]">
                                {row.user.username}
                              </p>
                              <p className="text-xs capitalize text-zinc-500 dark:text-[#98A2B3]">
                                {memberSubRole(row)}
                                {row.is_management_member
                                  ? " · management"
                                  : ""}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <EligibilityBadge
                              status={row.eligibility_status}
                              size="sm"
                            />
                          </TableCell>

                          <TableCell>
                            {renderRegistrationStatus(row.registration_status)}
                          </TableCell>

                          <TableCell>
                            {renderCreditStatus(Boolean(row.credit))}
                          </TableCell>

                          <TableCell className="font-medium text-zinc-950 dark:text-[#F2F4F7]">
                            {formatAmount(row.credit?.amount)}
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center justify-end gap-2">
                              {row.is_registered &&
                              !row.uuid.startsWith("mgmt_") ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    navigate(
                                      `/${username}/credit_manager/registrations/${row.uuid}`,
                                    )
                                  }
                                  className="rounded-none border-zinc-300 dark:border-[#344054]"
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </Button>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedRow(row);
                                    setIsDetailOpen(true);
                                  }}
                                  className="rounded-none border-zinc-300 dark:border-[#344054]"
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </Button>
                              )}

                              {row.credit ? (
                                <Button
                                  size="sm"
                                  disabled={!canManageCredit(row.credit)}
                                  title={
                                    canManageCredit(row.credit)
                                      ? "Edit credit"
                                      : "Only the manager who assigned this credit (or an admin) can edit it"
                                  }
                                  onClick={() => openEdit(row)}
                                  className="rounded-none bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-[#7F56D9] dark:text-white dark:hover:bg-[#9E77ED]"
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  disabled={
                                    row.eligibility_status === "pending" ||
                                    row.eligibility_status === "public" ||
                                    row.eligibility_status === "not_eligible"
                                  }
                                  onClick={() => openAssign(row)}
                                  className="rounded-none bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-[#7F56D9] dark:text-white dark:hover:bg-[#9E77ED]"
                                >
                                  <CreditCard className="mr-2 h-4 w-4" />
                                  Assign
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {meta ? (
                <div className="border-t border-zinc-200 p-4 dark:border-[#344054]">
                  <TablePagination meta={meta} onPageChange={setPage} />
                </div>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>

      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent
          side="right"
          className="w-full max-w-xl rounded-none border-l border-zinc-200 bg-white p-0 text-zinc-950 dark:border-[#344054] dark:bg-[#161F2E] dark:text-[#F2F4F7]"
        >
          <SheetHeader className="border-b border-zinc-200 px-6 py-5 dark:border-[#344054]">
            <SheetTitle className="text-base font-semibold tracking-tight">
              Member details
            </SheetTitle>
            <SheetDescription className="text-sm text-zinc-500 dark:text-[#98A2B3]">
              {selectedRow?.user.username} · {selectedRow?.event.name}
            </SheetDescription>
          </SheetHeader>

          {selectedRow ? (
            <div className="space-y-6 px-6 py-6">
              <div className="flex flex-wrap items-center gap-2">
                <EligibilityBadge status={selectedRow.eligibility_status} />
                {renderRegistrationStatus(selectedRow.registration_status)}
                {renderCreditStatus(Boolean(selectedRow.credit))}
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <InfoItem label="Username" value={selectedRow.user.username} />
                <InfoItem label="Email" value={selectedRow.user.email ?? "—"} />
                <InfoItem label="Role" value={selectedRow.user.role ?? "—"} />
                <InfoItem label="Sub role" value={memberSubRole(selectedRow)} />
                <InfoItem
                  label="Assigned by"
                  value={assignerName(selectedRow.credit)}
                />
                <InfoItem
                  label="Credit amount"
                  value={
                    selectedRow.credit
                      ? formatAmount(selectedRow.credit.amount)
                      : "—"
                  }
                />
                <InfoItem
                  label="Credit updated"
                  value={
                    selectedRow.credit?.updated_at
                      ? formatDate(selectedRow.credit.updated_at)
                      : "—"
                  }
                />
              </div>
              {selectedRow.is_management_member &&
              !selectedRow.is_registered ? (
                <p className="border border-blue-200 bg-blue-50 p-3 text-[13px] text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
                  Management member — eligible without event registration.
                  Credits can be assigned directly from this page.
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="mt-auto flex items-center justify-end gap-3 border-t border-zinc-200 px-6 py-4 dark:border-[#344054]">
            {selectedRow?.credit ? (
              <Button
                disabled={!canManageCredit(selectedRow.credit)}
                title={
                  canManageCredit(selectedRow.credit)
                    ? "Edit credit"
                    : "Only the manager who assigned this credit (or an admin) can edit it"
                }
                onClick={() => {
                  setIsDetailOpen(false);
                  if (selectedRow) openEdit(selectedRow);
                }}
                className="rounded-none bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-[#7F56D9] dark:text-white dark:hover:bg-[#9E77ED]"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit Credit
              </Button>
            ) : selectedRow ? (
              <Button
                disabled={
                  selectedRow.eligibility_status === "pending" ||
                  selectedRow.eligibility_status === "public" ||
                  selectedRow.eligibility_status === "not_eligible"
                }
                onClick={() => {
                  setIsDetailOpen(false);
                  openAssign(selectedRow);
                }}
                className="rounded-none bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-[#7F56D9] dark:text-white dark:hover:bg-[#9E77ED]"
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Assign Credit
              </Button>
            ) : null}
          </div>
        </SheetContent>
      </Sheet>

      <CreditFormSheet
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={formMode}
        username={selectedRow?.user.username ?? "Unknown User"}
        eventName={selectedRow?.event.name ?? "Unknown Event"}
        initialAmount={selectedRow?.credit?.amount ?? maxCredits ?? ""}
        onSubmit={handleCreditSubmit}
      />

      <CreditFormSheet
        open={isBulkOpen}
        onOpenChange={setIsBulkOpen}
        mode={bulkMode === "assign" ? "create" : "edit"}
        title={bulkMode === "assign" ? "Bulk Assign" : "Bulk Update"}
        username={`${
          bulkMode === "assign"
            ? selectedAssignableIds.length
            : selectedUpdatableIds.length
        } members`}
        eventName={eventName}
        initialAmount={maxCredits ?? ""}
        onSubmit={handleBulkSubmit}
      />
    </motion.div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-zinc-200 p-4 dark:border-[#344054] dark:bg-[#1D2939]">
      <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-zinc-500 dark:text-[#667085]">
        {label}
      </p>
      <p className="break-all text-sm text-zinc-900 dark:text-[#F2F4F7]">
        {value}
      </p>
    </div>
  );
}

export function RegistrationStatusBadge({ status }: { status?: string }) {
  return renderRegistrationStatus(status);
}

export function CreditStatusBadge({ hasCredit }: { hasCredit: boolean }) {
  return renderCreditStatus(hasCredit);
}

export function MemberBadge({ credited }: { credited: boolean }) {
  return credited ? (
    <Badge
      variant="outline"
      className="rounded-none border px-2 py-1 text-[10px] uppercase tracking-[0.2em]"
    >
      <BadgeCheck className="mr-1 h-3 w-3" />
      Credited
    </Badge>
  ) : (
    <Badge
      variant="outline"
      className="rounded-none border px-2 py-1 text-[10px] uppercase tracking-[0.2em]"
    >
      Uncredited
    </Badge>
  );
}

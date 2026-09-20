import { useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  CircleDollarSign,
  Clock3,
  Wallet,
} from "lucide-react";

import { useCMRegistrations } from "@/hooks/useCMRegistrations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: "easeOut" },
  },
};

function normalizePaid(value: boolean | string | number | undefined) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const normalized = value.toLowerCase();
    return normalized === "1" || normalized === "true" || normalized === "paid";
  }
  return false;
}

function renderRegistrationStatus(status?: string) {
  const normalized = (status ?? "").toLowerCase();

  const styles =
    normalized === "confirmed"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
      : normalized === "pending"
        ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
        : "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300";

  return (
    <Badge
      variant="outline"
      className={`rounded-none px-2 py-1 text-[10px] uppercase tracking-[0.2em] ${styles}`}
    >
      {status ?? "Unknown"}
    </Badge>
  );
}

function renderPaymentStatus(status?: string) {
  const normalized = (status ?? "").toLowerCase();

  const styles =
    normalized === "paid" || normalized === "completed"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
      : normalized === "pending"
        ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
        : "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300";

  return (
    <Badge
      variant="outline"
      className={`rounded-none px-2 py-1 text-[10px] uppercase tracking-[0.2em] ${styles}`}
    >
      {status ?? "Unknown"}
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
    <Card className="rounded-none border-zinc-200 shadow-none dark:border-zinc-800">
      <CardContent className="flex items-center justify-between p-5">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            {title}
          </p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center border border-zinc-200 text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
          <Icon className="h-4 w-4" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function EventRegistrationsListPage() {
  const navigate = useNavigate();
  const { username = "" } = useParams<{ username: string }>();
  const {
    registrations,
    meta,
    isLoading,
    isError,
    page,
    setPage,
    filters,
    setFilters,
  } = useCMRegistrations();

  const stats = useMemo(() => {
    const total = registrations.length;
    const confirmed = registrations.filter(
      (item) => item.registration_status?.toLowerCase() === "confirmed",
    ).length;
    const pendingPayment = registrations.filter(
      (item) => item.payment_status?.toLowerCase() === "pending",
    ).length;
    const paid = registrations.filter((item) =>
      normalizePaid(item.is_paid),
    ).length;

    return { total, confirmed, pendingPayment, paid };
  }, [registrations]);

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 dark:border-zinc-800 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            Credit Manager
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Event Registrations
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Browse registrations and move into event-wise credit workflows.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard title="Loaded Rows" value={stats.total} icon={Clock3} />
        <StatCard title="Confirmed" value={stats.confirmed} icon={BadgeCheck} />
        <StatCard
          title="Pending Payment"
          value={stats.pendingPayment}
          icon={Wallet}
        />
        <StatCard title="Paid" value={stats.paid} icon={CircleDollarSign} />
      </div>

      <Card className="rounded-none border-zinc-200 shadow-none dark:border-zinc-800">
        <CardHeader className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-base font-semibold tracking-tight">
              Registrations List
            </CardTitle>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <Select
                value={filters.registration_status ?? "all"}
                onValueChange={(value) => {
                  setPage(1);
                  setFilters((prev) => ({
                    ...prev,
                    registration_status: value === "all" ? "" : value,
                  }));
                }}
              >
                <SelectTrigger className="w-full rounded-none border-zinc-300 dark:border-zinc-700">
                  <SelectValue placeholder="Registration Status" />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  <SelectItem value="all">All Registration Statuses</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.payment_status ?? "all"}
                onValueChange={(value) => {
                  setPage(1);
                  setFilters((prev) => ({
                    ...prev,
                    payment_status: value === "all" ? "" : value,
                  }));
                }}
              >
                <SelectTrigger className="w-full rounded-none border-zinc-300 dark:border-zinc-700">
                  <SelectValue placeholder="Payment Status" />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  <SelectItem value="all">All Payment Statuses</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.is_paid ?? "all"}
                onValueChange={(value) => {
                  setPage(1);
                  setFilters((prev) => ({
                    ...prev,
                    is_paid: value === "all" ? "" : value,
                  }));
                }}
              >
                <SelectTrigger className="w-full rounded-none border-zinc-300 dark:border-zinc-700">
                  <SelectValue placeholder="Paid / Unpaid" />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  <SelectItem value="all">All Payment Flags</SelectItem>
                  <SelectItem value="1">Paid</SelectItem>
                  <SelectItem value="0">Unpaid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-5">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-12 animate-pulse border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900"
                />
              ))}
            </div>
          ) : isError ? (
            <div className="p-8 text-center text-sm text-red-600 dark:text-red-400">
              Failed to load registrations.
            </div>
          ) : registrations.length === 0 ? (
            <div className="p-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
              No registrations found.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-zinc-200 bg-zinc-50 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-900/50">
                      <TableHead className="w-16">#</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Registration</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Paid</TableHead>
                      <TableHead className="w-[240px] text-right">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {registrations.map((item, index) => {
                      const paid = normalizePaid(item.is_paid);

                      return (
                        <TableRow
                          key={item.uuid}
                          className="border-zinc-200 dark:border-zinc-800"
                        >
                          <TableCell className="text-zinc-500 dark:text-zinc-400">
                            {(page - 1) * (meta?.per_page ?? 20) + index + 1}
                          </TableCell>

                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-medium text-zinc-950 dark:text-zinc-50">
                                {item.user?.username ?? "Unknown User"}
                              </p>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                {item.uuid}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-medium text-zinc-950 dark:text-zinc-50">
                                {item.event?.name ?? "Unknown Event"}
                              </p>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                {item.event?.uuid ?? "—"}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell className="uppercase text-zinc-600 dark:text-zinc-300">
                            {item.event?.type ?? "—"}
                          </TableCell>

                          <TableCell>
                            {renderRegistrationStatus(item.registration_status)}
                          </TableCell>

                          <TableCell>
                            {renderPaymentStatus(item.payment_status)}
                          </TableCell>

                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`rounded-none px-2 py-1 text-[10px] uppercase tracking-[0.2em] ${
                                paid
                                  ? "border-zinc-300 bg-zinc-100 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                                  : "border-zinc-200 bg-white text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400"
                              }`}
                            >
                              {paid ? "Paid" : "Unpaid"}
                            </Badge>
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  navigate(
                                     `/${username}/credit_manager/registrations/${item.uuid}`,
                                  )
                                }
                                className="rounded-none border-zinc-300 dark:border-zinc-700"
                              >
                                View
                              </Button>

                              <Button
                                size="sm"
                                onClick={() => {
                                  if (item.event?.uuid) {
                                    navigate(
                                       `/${username}/credit_manager/events/${item.event.uuid}/registrations`,
                                    );
                                  }
                                }}
                                className="rounded-none bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                              >
                                Manage
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {meta ? (
                <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
                  <TablePagination meta={meta} onPageChange={setPage} />
                </div>
              ) : null}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

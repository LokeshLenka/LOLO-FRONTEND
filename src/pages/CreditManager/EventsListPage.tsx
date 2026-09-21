import { motion, type Variants } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight,
  CalendarRange,
  CircleDollarSign,
  LayoutGrid,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { CMBreadcrumb } from "@/components/credit-manager/CMBreadcrumb";
import { useCMEvents } from "@/hooks/useCMEvents";

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: "easeOut" },
  },
};

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function renderEventType(type?: string) {
  const normalized = (type ?? "").toLowerCase();
  const isPublic = normalized === "public";

  return (
    <Badge
      variant="outline"
      className={`rounded-none px-2 py-1 text-[10px] uppercase tracking-[0.2em] ${
        isPublic
          ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300"
          : "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-[#344054] dark:bg-[#1D2939] dark:text-[#98A2B3]"
      }`}
    >
      {type ?? "Unknown"}
    </Badge>
  );
}

export default function EventsListPage() {
  const navigate = useNavigate();
  const { username = "" } = useParams<{ username: string }>();
  const {
    events,
    meta,
    isLoading,
    isError,
    page,
    setPage,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
  } = useCMEvents();

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
          { label: "Events" },
        ]}
      />
      <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 dark:border-[#344054] md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-[#667085]">
            Credit Manager
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-[#F2F4F7]">
            Events
          </h1>
          <p className="text-sm text-zinc-500 dark:text-[#98A2B3]">
            All events including public ones. Open an event to manage credits.
          </p>
        </div>
      </div>

      <div className="border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">
        <p className="text-[13px]">
          For public events, credits can only be assigned to management members —
          registered members are not eligible. For other events, registered members
          are eligible and management members are eligible with or without registration.
        </p>
      </div>

      <Card className="rounded-none border-zinc-200 shadow-none dark:border-[#344054] dark:bg-[#161F2E]">
        <CardHeader className="border-b border-zinc-200 px-5 py-4 dark:border-[#344054]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="flex items-center gap-2 text-base font-semibold tracking-tight">
              <LayoutGrid className="h-4 w-4 text-zinc-500 dark:text-[#98A2B3]" />
              All Events
            </CardTitle>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Input
                placeholder="Search events"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-full rounded-none border-zinc-300 dark:border-[#344054]"
              />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full rounded-none border-zinc-300 dark:border-[#344054]">
                  <SelectValue placeholder="Event type" />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="club">Club</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
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
                  className="h-12 animate-pulse border border-zinc-200 bg-zinc-50 dark:border-[#344054] dark:bg-[#1D2939]"
                />
              ))}
            </div>
          ) : isError ? (
            <div className="p-8 text-center text-sm text-red-600 dark:text-red-400">
              Failed to load events.
            </div>
          ) : events.length === 0 ? (
            <div className="p-8 text-center text-sm text-zinc-500 dark:text-[#98A2B3]">
              No events found.
            </div>
          ) : (
            <>
              {/* Mobile cards — no horizontal scroll, full-width tap targets */}
              <div className="space-y-3 p-4 md:hidden">
                {events.map((event) => (
                  <div
                    key={event.uuid}
                    className="border border-zinc-200 bg-white p-4 dark:border-[#344054] dark:bg-[#1D2939]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 space-y-1">
                        <p className="truncate font-medium text-zinc-950 dark:text-[#F2F4F7]">
                          {event.name}
                        </p>
                        <p className="flex items-center gap-1 text-xs text-zinc-500 dark:text-[#98A2B3]">
                          <CalendarRange className="h-3 w-3 shrink-0" />
                          <span className="truncate">
                            {event.venue ?? "Venue TBD"} ·{" "}
                            {formatDate(event.end_date)}
                          </span>
                        </p>
                      </div>
                      {renderEventType(event.type)}
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-sm text-zinc-600 dark:text-[#98A2B3]">
                      <CircleDollarSign className="h-3.5 w-3.5" />
                      Max credits:{" "}
                      <span className="font-medium text-zinc-950 dark:text-[#F2F4F7]">
                        {event.credits_awarded ?? "—"}
                      </span>
                    </div>
                    <Button
                      onClick={() =>
                        navigate(
                          `/${username}/credit_manager/events/${event.uuid}/registrations`,
                        )
                      }
                      className="mt-3 min-h-[44px] w-full rounded-none bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-[#7F56D9] dark:text-white dark:hover:bg-[#9E77ED]"
                    >
                      Manage
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-zinc-200 bg-zinc-50 hover:bg-zinc-50 dark:border-[#344054] dark:bg-[#1D2939] dark:hover:bg-[#253247]">
                      <TableHead className="w-16">#</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Max Credits</TableHead>
                      <TableHead className="w-[160px] text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {events.map((event, index) => (
                      <TableRow
                        key={event.uuid}
                        className="border-zinc-200 dark:border-[#344054]"
                      >
                        <TableCell className="text-zinc-500 dark:text-[#98A2B3]">
                          {(page - 1) * (meta?.per_page ?? 20) + index + 1}
                        </TableCell>

                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium text-zinc-950 dark:text-[#F2F4F7]">
                              {event.name}
                            </p>
                            <p className="flex items-center gap-1 text-xs text-zinc-500 dark:text-[#98A2B3]">
                              <CalendarRange className="h-3 w-3" />
                              {event.venue ?? "Venue TBD"}
                            </p>
                          </div>
                        </TableCell>

                        <TableCell>{renderEventType(event.type)}</TableCell>

                        <TableCell className="text-zinc-600 dark:text-[#98A2B3]">
                          {formatDate(event.end_date)}
                        </TableCell>

                        <TableCell>
                          <span className="inline-flex items-center gap-1 font-medium text-zinc-950 dark:text-[#F2F4F7]">
                            <CircleDollarSign className="h-3.5 w-3.5 text-zinc-500 dark:text-[#98A2B3]" />
                            {event.credits_awarded ?? "—"}
                          </span>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center justify-end">
                            <Button
                              size="sm"
                              onClick={() =>
                                navigate(
                                  `/${username}/credit_manager/events/${event.uuid}/registrations`
                                )
                              }
                              className="rounded-none bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-[#7F56D9] dark:text-white dark:hover:bg-[#9E77ED]"
                            >
                              Manage
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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
    </motion.div>
  );
}

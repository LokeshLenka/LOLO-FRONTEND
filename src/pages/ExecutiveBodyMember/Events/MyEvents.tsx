import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import {
  CalendarClock,
  MapPin,
  Users,
  RefreshCw,
  Ticket,
  Clock,
  Calendar,
  Plus,
} from "lucide-react";
import { format } from "date-fns";
import {
  Button,
  Divider,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Skeleton,
  Chip,
  Card,
  CardBody,
  Tooltip,
} from "@heroui/react";
import TablePagination from "@mui/material/TablePagination";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const STORAGE_KEYS = {
  PAGE: "my_events_page",
  ROWS: "my_events_rows_per_page",
} as const;

interface Event {
  id: number;
  uuid: string;
  name: string;
  description: string;
  type: string;
  start_date: string;
  end_date: string;
  venue: string;
  registration_deadline: string;
  status: string;
  fee: number;
  credits_awarded: number;
  max_participants: number | null;
  registration_mode: string;
  cover_image?: string;
  registrations_count?: number;
  created_at: string;
}

interface ApiResponse {
  status: string;
  message: string;
  data: {
    data: Event[];
    current_page: number;
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: any[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
  };
}

// Removed 'hidden' classes to make all columns visible on all screens
const columns = [
  { key: "name", label: "EVENT NAME", className: "" },
  { key: "type", label: "TYPE", className: "" },
  { key: "status", label: "STATUS", className: "" },
  { key: "start_date", label: "TIMING", className: "" },
  { key: "venue", label: "VENUE", className: "" },
  { key: "registrations", label: "STATS", className: "" },
  { key: "actions", label: "ACTIONS", className: "" },
];

export default function MyEvents() {
  const navigate = useNavigate();
  const { username } = useParams<{ username: string }>();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPageData, setCurrentPageData] = useState<any>(null);

  const [page, setPage] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAGE);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [rowsPerPage, setRowsPerPage] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROWS);
      return saved ? parseInt(saved, 10) : 20;
    } catch {
      return 20;
    }
  });

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const endpoint = `${API_BASE_URL}/ebm/my-events?page=${page + 1
        }&per_page=${rowsPerPage}`;
      const response = await axios.get<ApiResponse>(endpoint);

      if (response.data?.data) {
        const paginator = response.data.data;
        setCurrentPageData(paginator);
        if (Array.isArray(paginator.data)) {
          setEvents(paginator.data);
          setTotalItems(paginator.total || 0);
        } else {
          setEvents([]);
          setTotalItems(0);
        }
      } else {
        setEvents([]);
        setTotalItems(0);
        setCurrentPageData(null);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        toast.info("No events found");
        setEvents([]);
        setTotalItems(0);
        setCurrentPageData(null);
      } else {
        console.error("Fetch error:", error);
        toast.error("Failed to load events");
      }
    } finally {
      setIsLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleChangePage = useCallback((_: unknown, newPage: number) => {
    setPage(newPage);
    localStorage.setItem(STORAGE_KEYS.PAGE, newPage.toString());
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newRows = parseInt(event.target.value, 10);
      setRowsPerPage(newRows);
      setPage(0);
      localStorage.setItem(STORAGE_KEYS.ROWS, newRows.toString());
      localStorage.setItem(STORAGE_KEYS.PAGE, "0");
    },
    [],
  );

  const handleEventClick = (uuid: string) => {
    window.location.href = `/events/${uuid}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "TBD";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return "TBD";
    }
  };

  const renderCell = useCallback(
    (event: Event, columnKey: React.Key) => {
      switch (columnKey) {
        case "name":
          return (
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-bold text-gray-900 dark:text-slate-200 truncate max-w-[150px] sm:max-w-xs">
                {event.name}
              </span>
              <span className="block text-xs text-gray-500 dark:text-slate-400 truncate max-w-[150px] sm:max-w-xs">
                {event.description}
              </span>
            </div>
          );
        case "type":
          return (
            <Chip
              size="sm"
              startContent={
                <div className="w-1.5 h-1.5 rounded-full ml-1 bg-cyan-600 dark:bg-cyan-500" />
              }
              variant="flat"
              classNames={{
                base: "bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/20",
                content: "font-bold capitalize pl-1",
              }}
            >
              {event.type}
            </Chip>
          );
        case "status": {
          const statusStyles: string =
            event.status === "published"
              ? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20"
              : event.status === "completed"
                ? "bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700"
                : "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
          return (
            <Chip
              size="sm"
              startContent={
                <div
                  className={`w-1.5 h-1.5 rounded-full ml-1 ${event.status === "published" ? "bg-green-600 dark:bg-green-500" : event.status === "completed" ? "bg-zinc-400 dark:bg-zinc-500" : "bg-amber-600 dark:bg-amber-500"}`}
                />
              }
              variant="flat"
              classNames={{
                base: statusStyles,
                content: "font-bold capitalize pl-1",
              }}
            >
              {event.status}
            </Chip>
          );
        }
        case "start_date":
          return (
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-gray-900 dark:text-slate-200 whitespace-nowrap">
                {formatDate(event.start_date)}
              </span>
              <span className="text-xs text-gray-500 dark:text-slate-500 font-mono flex items-center gap-1">
                <Clock size={10} />
                {event.start_date
                  ? format(new Date(event.start_date), "h:mm a")
                  : "--:--"}
              </span>
            </div>
          );
        case "venue":
          return (
            <div className="flex items-center gap-2 text-gray-600 dark:text-slate-300">
              <MapPin className="h-4 w-4 text-gray-400 dark:text-slate-500 flex-shrink-0" />
              <span className="truncate max-w-[120px] text-sm font-medium">
                {event.venue || "TBD"}
              </span>
            </div>
          );
        case "registrations":
          return (
            <div className="flex flex-col gap-1 min-w-[80px]">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-slate-500">
                <Ticket size={12} />
                <span>Fee: {event.fee > 0 ? `₹${event.fee}` : "Free"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users
                  size={14}
                  className="text-gray-400 dark:text-slate-400"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-slate-200">
                  {event.registrations_count || 0} Regs
                </span>
              </div>
            </div>
          );
        case "actions":
          return (
            <div className="flex items-center justify-start gap-2">
              <Tooltip
                content="View Event Details"
                placement="bottom"
                className="bg-black dark:bg-white text-white dark:text-black backdrop-blur-lg border"
              >
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  aria-label="View event details"
                  className="bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 min-w-11 min-h-11"
                  onPress={() => {
                    handleEventClick(event.uuid);
                  }}
                >
                  <Calendar size={18} />
                </Button>
              </Tooltip>
              <Tooltip
                content="View Event Registrations"
                placement="bottom"
                className="bg-black dark:bg-white text-white dark:text-black backdrop-blur-lg border"
              >
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  aria-label="View event registrations"
                  className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 dark:bg-green-500/10 dark:text-green-400 min-w-11 min-h-11"
                  onPress={() => {
                    navigate(
                      `/${username}/executive_body_member/event-registrations?event=${event.uuid}`,
                    );
                  }}
                >
                  <Users size={18} />
                </Button>
              </Tooltip>
            </div>
          );
        default:
          return null;
      }
    },
    [handleEventClick, navigate, username],
  );

  return (
    <section className="w-full min-h-screen py-6 px-0 sm:px-8 mx-auto space-y-6 bg-transparent text-gray-900 dark:text-zinc-100">
      {/* 1. Page Header */}
      <div className="space-y-6 px-0 sm:px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                My Events
              </h1>
              <p className="text-gray-500 dark:text-slate-400 font-medium mt-1">
                Manage and track your created events
              </p>
            </div>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <Button
              variant="flat"
              startContent={
                <RefreshCw
                  size={18}
                  className={isLoading ? "animate-spin" : ""}
                />
              }
              onPress={() => fetchEvents()}
              isDisabled={isLoading}
              className="font-semibold min-h-[44px] flex-1 md:flex-none"
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Main Data Table */}
      <Card
        shadow="none"
        className="border border-gray-200 dark:border-slate-800 bg-white dark:bg-white/1 rounded-xl overflow-hidden mx-0 shadow-sm dark:shadow-none"
      >
        <CardBody className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-slate-800" />
                  <div className="w-full space-y-2">
                    <Skeleton className="h-3 w-1/3 rounded-lg bg-gray-200 dark:bg-slate-800" />
                    <Skeleton className="h-3 w-1/4 rounded-lg bg-gray-200 dark:bg-slate-800" />
                  </div>
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-24 text-center">
              <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                <CalendarClock
                  size={40}
                  className="text-gray-400 dark:text-slate-500"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-slate-200">
                No events yet
              </h3>
              <p className="text-gray-500 dark:text-slate-500 max-w-xs mx-auto mt-2 leading-relaxed">
                You haven't created any events yet. Start by creating your first
                event to see it here.
              </p>
              <Button
                className="mt-6 min-h-12 px-6 font-semibold"
                color="primary"
                startContent={<Plus size={18} />}
                onPress={() =>
                  navigate(
                    `/${username}/executive_body_member/create-event`,
                  )
                }
              >
                Create Event
              </Button>
            </div>
          ) : (
            <>
            {/* Mobile cards (large touch targets, no horizontal scroll) */}
            <div className="block md:hidden divide-y divide-gray-100 dark:divide-slate-800/50">
              {events.map((event) => (
                <div key={event.uuid} className="p-4 space-y-3 active:bg-gray-50 dark:active:bg-slate-800/40">
                  <div>
                    <p className="text-base font-bold text-gray-900 dark:text-slate-100 leading-snug">
                      {event.name}
                    </p>
                    {event.description ? (
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                        {event.description}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold capitalize px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 dark:bg-cyan-500" />
                      {event.type}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold capitalize px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                      {event.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="flex flex-col">
                      <span className="font-bold uppercase tracking-wide text-[10px] text-gray-400 dark:text-slate-500">When</span>
                      <span className="font-semibold text-gray-800 dark:text-slate-200 mt-0.5">{formatDate(event.start_date)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold uppercase tracking-wide text-[10px] text-gray-400 dark:text-slate-500">Venue</span>
                      <span className="font-semibold text-gray-800 dark:text-slate-200 mt-0.5 truncate">{event.venue || "TBD"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold uppercase tracking-wide text-[10px] text-gray-400 dark:text-slate-500">Regs</span>
                      <span className="font-semibold text-gray-800 dark:text-slate-200 mt-0.5">
                        {event.registrations_count || 0} · {event.fee > 0 ? `₹${event.fee}` : "Free"}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Button
                      variant="flat"
                      className="min-h-12 font-semibold bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
                      onPress={() => handleEventClick(event.uuid)}
                    >
                      Details
                    </Button>
                    <Button
                      variant="flat"
                      className="min-h-12 font-semibold bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-300"
                      onPress={() =>
                        navigate(
                          `/${username}/executive_body_member/event-registrations?event=${event.uuid}`,
                        )
                      }
                    >
                      Registrations
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="hidden md:block overflow-x-auto">
              <Table
                aria-label="My Events Table"
                selectionMode="none"
                classNames={{
                  // Ensure table has a minimum width to force horizontal scroll on small screens
                  wrapper:
                    "shadow-none bg-transparent rounded-none p-0 min-w-[800px] md:min-w-full",
                  th: "bg-white dark:bg-white/1 text-gray-500 dark:text-slate-500 font-bold uppercase text-[10px] tracking-wider py-4 border-b border-gray-200 dark:border-slate-800",
                  td: "py-4 border-b border-gray-100 dark:border-slate-800/50 group-data-[last=true]:border-none",
                  tr: "hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors",
                }}
              // onRowAction={(key) => handleEventClick(String(key))}
              >
                <TableHeader columns={columns}>
                  {(column) => (
                    <TableColumn
                      key={column.key}
                      className={column.className}
                      align={column.key === "actions" ? "start" : "start"}
                    >
                      {column.label}
                    </TableColumn>
                  )}
                </TableHeader>
                <TableBody items={events}>
                  {(item) => (
                    <TableRow key={item.uuid}>
                      {(columnKey) => (
                        <TableCell
                          className={
                            columns.find((c) => c.key === columnKey)?.className
                          }
                        >
                          {renderCell(item, columnKey)}
                        </TableCell>
                      )}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            </>
          )}
        </CardBody>
      </Card>

      <Divider className="opacity-0 pb-20" />

      {/* 3. Floating Pagination Control (only when more than one page) */}
      {currentPageData && totalItems > rowsPerPage && (
        <div className="fixed z-[99] bottom-8 w-full sm:w-[28%] flex right-0 sm:right-22 items-center py-3 rounded-xl bg-white/80 dark:bg-black/70 backdrop-blur-md border border-gray-200 dark:border-white/5 shadow-xl dark:shadow-2xl">
          <TablePagination
            component="div"
            count={totalItems}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[12, 24, 50, 100]}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Per Page"
            className="mx-auto"
            sx={{
              color: "inherit",
              ".MuiSvgIcon-root": { color: "inherit" },
              "& .MuiTablePagination-select": { color: "inherit" },
              "& .MuiTablePagination-actions button": {
                transition: "all 0.3s",
                "&:hover": { transform: "scale(1.1)" },
              },
            }}
            slotProps={{
              select: {
                MenuProps: {
                  PaperProps: {
                    className:
                      "!bg-white dark:!bg-black/90 !text-gray-900 dark:!text-white !backdrop-blur-sm !rounded-lg !shadow-xl !border !border-gray-200 dark:!border-white/10",
                    sx: {
                      "& .MuiMenuItem-root": {
                        fontSize: "0.875rem",
                      },
                      "& .MuiMenuItem-root.Mui-selected": {
                        bgcolor: "#03a1b0 !important",
                        color: "white !important",
                        fontWeight: "bold",
                      },
                      "& .MuiMenuItem-root:hover": {
                        bgcolor: "rgba(3, 161, 176, 0.08) !important",
                        transform: "scale(1.02)",
                      },
                    },
                  },
                },
              },
            }}
          />
        </div>
      )}
    </section>
  );
}

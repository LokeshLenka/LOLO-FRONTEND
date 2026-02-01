import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  CalendarClock,
  MapPin,
  Users,
  RefreshCw,
  Ticket,
  Clock,
  Calendar,
  Users2,
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
      const endpoint = `${API_BASE_URL}/ebm/my-events?page=${
        page + 1
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
        case "status":
          return (
            <Chip
              size="sm"
              variant="dot"
              classNames={{
                base: "border-none bg-transparent gap-1 px-0",
                dot:
                  event.status === "published"
                    ? "bg-green-500"
                    : "bg-gray-400 dark:bg-slate-500",
                content:
                  "font-medium capitalize text-gray-600 dark:text-slate-300",
              }}
            >
              {event.status}
            </Chip>
          );
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
                <span>Fee: {event.fee > 0 ? `$${event.fee}` : "Free"}</span>
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
                  className="bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
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
                  className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 dark:bg-green-500/10 dark:text-green-400"
                  onPress={() => {
                    handleEventClick(event.uuid);
                  }}
                >
                  <Users2 size={18} />
                </Button>
              </Tooltip>
            </div>
          );
        default:
          return null;
      }
    },
    [handleEventClick],
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

          <div className="flex gap-2">
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
              className="font-semibold"
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Main Data Table */}
      <Card
        shadow="none"
        className="border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 rounded-xl overflow-hidden mx-0 shadow-sm dark:shadow-none"
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
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table
                aria-label="My Events Table"
                selectionMode="none"
                classNames={{
                  // Ensure table has a minimum width to force horizontal scroll on small screens
                  wrapper:
                    "shadow-none bg-transparent rounded-none p-0 min-w-[800px] md:min-w-full",
                  th: "bg-gray-50 dark:bg-slate-900/80 text-gray-500 dark:text-slate-500 font-bold uppercase text-[10px] tracking-wider py-4 border-b border-gray-200 dark:border-slate-800",
                  td: "py-4 border-b border-gray-100 dark:border-slate-800/50 group-data-[last=true]:border-none",
                  tr: "hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer",
                }}
                onRowAction={(key) => handleEventClick(String(key))}
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
          )}
        </CardBody>
      </Card>

      <Divider className="opacity-0 pb-20" />

      {/* 3. Floating Pagination Control */}
      {currentPageData && totalItems > 0 && (
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

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Calendar as CalendarIcon,
  MapPin,
  Users,
  Loader2,
  CalendarClock,
  ImageIcon,
  RefreshCw,
} from "lucide-react";
import clsx from "clsx";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@heroui/button";
import TablePagination from "@mui/material/TablePagination";
import { Divider } from "@heroui/react";

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

export default function MyEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

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
      const endpoint = `${API_BASE_URL}/ebm/my-events?page=${page + 1}&per_page=${rowsPerPage}`;
      const response = await axios.get<ApiResponse>(endpoint);

      if (response.data?.data) {
        const paginator = response.data.data;
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
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        toast.info("No events found");
        setEvents([]);
        setTotalItems(0);
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

  // Helper to format date nicely
  const formatDate = (dateString: string) => {
    if (!dateString) return "TBD";
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return "TBD";
    }
  };

  return (
    <div className="w-full min-h-screen bg-transparent pb-32 text-zinc-100 selection:bg-cyan-500/30 font-sans">
      {/* --- HEADER --- */}
      <div className="w-full bg-transparent py-6">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-cyan-400 flex-shrink-0 backdrop-blur-sm">
                <CalendarClock className="h-6 w-6" />
              </div>
              <div className="">
                <h1 className="font-bold text-2xl sm:text-3xl truncate leading-tight mb-1 text-white tracking-tight">
                  My Events
                </h1>
                <p className="text-slate-400 font-medium">
                  Manage your created events
                </p>
              </div>
            </div>

            <Button
              variant="flat"
              onPress={() => fetchEvents()}
              disabled={isLoading}
              startContent={
                <RefreshCw
                  size={18}
                  className={isLoading ? "animate-spin" : ""}
                />
              }
              className="bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white rounded-full px-6 font-medium border border-slate-700/50"
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* --- EVENTS GRID --- */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-24">
        {isLoading && events.length === 0 ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
          </div>
        ) : !events || events.length === 0 ? (
          <Card className="bg-slate-900/50 border-slate-800 shadow-sm rounded-3xl">
            <CardContent className="flex flex-col items-center justify-center py-20 text-center">
              <div className="p-5 bg-slate-800 rounded-full mb-6">
                <CalendarClock className="h-10 w-10 text-slate-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                No events yet
              </h3>
              <p className="text-sm text-slate-400 max-w-md leading-relaxed">
                You haven't created any events yet. Start by creating your first
                event.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {events.map((event) => (
              <div
                key={event.id}
                className="group relative flex flex-col h-[500px] rounded-[2rem] overflow-hidden bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-cyan-900/10 cursor-pointer"
                onClick={() => handleEventClick(event.uuid)}
              >
                {/* 1. Image Section (Top Half) */}
                <div className="relative h-[55%] w-full">
                  {event.cover_image ? (
                    <img
                      src={event.cover_image}
                      alt={event.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-slate-600" />
                    </div>
                  )}

                  {/* Gradient Fade - Critical for the 'blend' effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900" />
                </div>

                {/* 2. Content Section (Bottom Half) */}
                <div className="relative flex flex-col flex-1 px-6 pb-6 -mt-12 z-10">
                  {/* Title & Price/Count Row */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-2xl font-bold text-white leading-tight drop-shadow-md line-clamp-2">
                      {event.name}
                    </h3>

                    {/* Badge resembling the price tag in reference */}
                    <div className="flex-shrink-0 bg-black/40 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/10">
                      {event.fee > 0 ? `$${event.fee}` : "Free"}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-4">
                    {event.description}
                  </p>

                  {/* Pills Row (Like 'Luxury Stay' / '2 Day stay') */}
                  <div className="flex flex-wrap gap-2 mb-auto">
                    <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs font-medium text-slate-300 backdrop-blur-sm">
                      {event.status}
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs font-medium text-slate-300 backdrop-blur-sm">
                      {event.type}
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs font-medium text-slate-300 backdrop-blur-sm flex items-center gap-1.5">
                      <CalendarIcon className="w-3 h-3" />
                      {formatDate(event.start_date)}
                    </span>
                  </div>

                  {/* 3. Action Button (Pill shaped, white) */}
                  <button className="w-full mt-4 bg-white text-slate-900 hover:bg-slate-200 font-bold py-3.5 rounded-full transition-colors shadow-lg shadow-black/20 flex items-center justify-center gap-2">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Divider className="opacity-0" />

      {/* --- Floating Pagination --- */}
      {totalItems > 0 && (
        <div className="fixed z-[99] bottom-8 w-full sm:w-[28%] flex right-0 sm:right-22 items-center py-2 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 shadow-2xl">
          <TablePagination
            component="div"
            count={totalItems}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[10, 20, 50]}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Per Page"
            className="mx-auto text-slate-200"
            sx={{
              color: "inherit",
              border: "none",
              ".MuiSvgIcon-root": { color: "inherit" },
              "& .MuiTablePagination-selectLabel": {
                fontSize: "0.75rem",
                fontWeight: 600,
                opacity: 0.7,
              },
              "& .MuiTablePagination-displayedRows": {
                fontSize: "0.75rem",
                fontWeight: 500,
              },
              "& .MuiTablePagination-select": {
                color: "inherit",
                fontSize: "0.8rem",
                fontWeight: 600,
                backgroundColor: "transparent",
              },
              "& .MuiTablePagination-actions button": {
                transition: "all 0.2s",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.05)",
                  transform: "scale(1.1)",
                },
                "&:disabled": { opacity: 0.3 },
              },
            }}
            slotProps={{
              select: {
                MenuProps: {
                  PaperProps: {
                    className:
                      "!bg-slate-900 !text-slate-100 !backdrop-blur-sm !rounded-xl !shadow-xl !border !border-slate-800",
                    sx: {
                      "& .MuiMenuItem-root": {
                        fontSize: "0.8rem",
                        fontWeight: 500,
                      },
                      "& .MuiMenuItem-root.Mui-selected": {
                        bgcolor: "#03a1b0 !important",
                        fontWeight: "bold",
                        color: "white",
                      },
                      "& .MuiMenuItem-root:hover": {
                        bgcolor: "rgba(3, 161, 176, 0.15) !important",
                      },
                    },
                  },
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
}

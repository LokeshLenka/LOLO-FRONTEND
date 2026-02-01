import React, { useState, useCallback, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  // DropdownTrigger,
  // Dropdown,
  // DropdownMenu,
  // DropdownItem,
  Chip,
  User,
  Pagination,
  Card,
  CardBody,
  Skeleton,
  Breadcrumbs,
  BreadcrumbItem,
  Tooltip,
} from "@heroui/react";
import {
  Search,
  Download,
  // MoreVertical,
  Eye,
  // CheckCircle2,
  // XCircle,
  CalendarDays,
  Users,
} from "lucide-react";
// Import keepPreviousData for v5, or implement custom logic if on v4
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";

// --- Types ---

type Event = {
  id: number;
  uuid: string;
  name: string;
  type: string;
  start_date: string;
  venue: string;
  status: string;
  registrations_count?: number;
  cover_image?: string;
};

type Registration = {
  id: number;
  uuid: string;
  status: string;
  created_at: string;
  user: {
    id: number;
    username: string;
    email?: string;
    avatar?: string;
  };
};

// --- API Helpers ---

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Define return type for better TS inference
type EventsResponse = {
  data: Event[];
  last_page: number;
  current_page: number;
  total: number;
};

const fetchEvents = async (
  page: number,
  search: string,
): Promise<EventsResponse> => {
  try {
    // UPDATED URL: /ebm/my-events matches your Laravel route 'myEvents'
    const { data } = await axios.get(`${API_BASE_URL}/events`, {
      params: { page, per_page: 8, search },
    });
    // Return the paginated object directly
    return data?.data || { data: [], last_page: 1, current_page: 1, total: 0 };

    console.log(data);
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return { data: [], last_page: 1, current_page: 1, total: 0 };
  }
};

const fetchRegistrations = async (
  eventUuid: string,
): Promise<Registration[]> => {
  try {
    const { data } = await axios.get(
      `${API_BASE_URL}/ebm/event-registrations/event/${eventUuid}`,
    );
    return data?.data || [];
  } catch (error) {
    console.error("Failed to fetch registrations:", error);
    return [];
  }
};

// --- Components ---

export default function EventRegistrationsPage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
    <div className="p-6 h-[calc(100vh-64px)] overflow-hidden flex flex-col gap-6 bg-gray-50 dark:bg-zinc-950">
      {/* Header */}
      <div className="flex flex-col gap-2 shrink-0">
        <Breadcrumbs>
          <BreadcrumbItem>Dashboard</BreadcrumbItem>
          <BreadcrumbItem>Events</BreadcrumbItem>
          <BreadcrumbItem>Registrations</BreadcrumbItem>
        </Breadcrumbs>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Event Registrations
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage attendees and approval statuses across all your events.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area - Split View */}
      <div className="flex flex-col lg:flex-row gap-6 h-full min-h-0">
        {/* Left Panel: Event Selector */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4 h-full min-h-0">
          <EventsList
            selectedId={selectedEvent?.uuid}
            onSelect={setSelectedEvent}
          />
        </div>

        {/* Right Panel: Registration Details */}
        <div className="w-full lg:w-2/3 flex flex-col h-full min-h-0">
          <Card className="h-full border border-gray-200 dark:border-zinc-800 shadow-sm">
            <CardBody className="p-0 h-full flex flex-col overflow-hidden">
              {selectedEvent ? (
                <RegistrationsTable event={selectedEvent} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <Users size={64} className="mb-4 opacity-20" />
                  <p className="text-lg font-medium">
                    Select an event to view registrations
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

// --- Sub-Component: Events List ---

function EventsList({
  selectedId,
  onSelect,
}: {
  selectedId?: string;
  onSelect: (e: Event) => void;
}) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["events-list", page, search],
    queryFn: () => fetchEvents(page, search),
    placeholderData: keepPreviousData, // FIX: Use placeholderData instead of keepPreviousData
  });

  // Data structure fix: fetchEvents returns the paginated object directly
  const events = data?.data || [];
  const totalPages = data?.last_page || 1;

  return (
    <Card className="h-full border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col">
      <CardBody className="p-4 flex flex-col gap-4 h-full">
        <Input
          placeholder="Search events..."
          startContent={<Search size={16} className="text-gray-400" />}
          value={search}
          onValueChange={setSearch}
          isClearable
          classNames={{
            inputWrapper: "bg-gray-100 dark:bg-zinc-900 shadow-none",
          }}
        />

        <div className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-2 pr-1">
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <Skeleton key={i} className="rounded-lg h-20 w-full" />
            ))
          ) : events.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              No events found
            </div>
          ) : (
            events.map((event: Event) => (
              <button
                key={event.uuid}
                onClick={() => onSelect(event)}
                className={`text-left p-3 rounded-xl border transition-all duration-200 group
                  ${
                    selectedId === event.uuid
                      ? "bg-primary-50/50 border-primary-200 dark:bg-primary-900/20 dark:border-primary-800 ring-1 ring-primary-500"
                      : "bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700"
                  }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3
                    className={`font-semibold text-sm line-clamp-1 ${selectedId === event.uuid ? "text-primary-700 dark:text-primary-400" : "text-gray-900 dark:text-gray-200"}`}
                  >
                    {event.name}
                  </h3>
                  {event.status && (
                    <Chip
                      size="sm"
                      variant="flat"
                      color={
                        event.status === "published" ? "success" : "warning"
                      }
                      className="h-5 text-[10px] px-1"
                    >
                      {event.status}
                    </Chip>
                  )}
                </div>

                <div className="flex justify-between items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <span className="flex items-center gap-1">
                    <CalendarDays size={12} />
                    {format(new Date(event.start_date), "MMM d, yyyy")}
                  </span>
                  {/* </div>
                <div className="flex justify-end items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-2"> */}
                  {event.type && (
                    <Chip
                      size="sm"
                      variant="flat"
                      color={event.type === "music" ? "default" : "warning"}
                      className="h-5 text-[10px] px-1 justify-end"
                    >
                      {event.type}
                    </Chip>
                  )}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="pt-2 flex justify-center border-t border-gray-100 dark:border-zinc-800">
          <Pagination
            total={totalPages}
            page={page}
            onChange={setPage}
            size="sm"
            variant="light"
            showControls
            color="primary"
          />
        </div>
      </CardBody>
    </Card>
  );
}

// --- Sub-Component: Registrations Table ---

const columns = [
  { name: "ATTENDEE", uid: "user" },
  { name: "STATUS", uid: "status" },
  { name: "REGISTERED AT", uid: "created_at" },
  { name: "ACTIONS", uid: "actions" },
];

function RegistrationsTable({ event }: { event: Event }) {
  const [filterValue, setFilterValue] = useState("");

  const { data: registrations = [], isLoading } = useQuery({
    queryKey: ["registrations", event.uuid],
    queryFn: () => fetchRegistrations(event.uuid),
    enabled: !!event.uuid,
  });

  const filteredItems = useMemo(() => {
    let filteredUsers = [...registrations];
    if (filterValue) {
      filteredUsers = filteredUsers.filter((item) =>
        item.user.username.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    return filteredUsers;
  }, [filterValue, registrations]);

  const renderCell = useCallback((item: Registration, columnKey: React.Key) => {
    switch (columnKey) {
      case "user":
        return (
          <User
            avatarProps={{
              radius: "lg",
              src: item.user.avatar,
              fallback: <Users size={16} />,
            }}
            description={item.user.email || `@${item.user.username}`}
            name={item.user.username}
            classNames={{
              name: "text-sm font-semibold text-gray-900 dark:text-white",
              description: "text-xs text-gray-500 dark:text-gray-400",
            }}
          />
        );
      case "status":
        const statusColorMap: Record<
          string,
          "success" | "warning" | "danger" | "default"
        > = {
          approved: "success",
          pending: "warning",
          rejected: "danger",
        };
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[item.status] || "default"}
            size="sm"
            variant="flat"
          >
            {item.status}
          </Chip>
        );
      case "created_at":
        return (
          <div className="flex flex-col">
            <span className="text-sm text-gray-900 dark:text-gray-200">
              {format(new Date(item.created_at), "MMM d, yyyy")}
            </span>
            <span className="text-xs text-gray-500">
              {format(new Date(item.created_at), "h:mm a")}
            </span>
          </div>
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            {/* <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <MoreVertical className="text-gray-500" size={18} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Action event">
                <DropdownItem key="view" startContent={<Eye size={16} />}>
                  View Details
                </DropdownItem>
                <DropdownItem
                  key="approve"
                  startContent={<CheckCircle2 size={16} />}
                >
                  Approve
                </DropdownItem>
                <DropdownItem
                  key="reject"
                  startContent={<XCircle size={16} />}
                  className="text-danger"
                  color="danger"
                >
                  Reject
                </DropdownItem>
              </DropdownMenu>
            </Dropdown> */}
            <Tooltip
              content="View Registration"
              className="bg-black dark:bg-white text-white dark:text-black backdrop-blur-lg border"
              placement="bottom"
            >
              <Button
                isIconOnly
                size="sm"
                className="bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                // isLoading={processingId === user.uuid}
                // onPress={() => handleActionIntent(user, "view")}
              >
                <Eye size={18} />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return null;
    }
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-900/50">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            {event.name}
            <Chip size="sm" variant="flat" className="ml-2">
              {filteredItems.length} Attendees
            </Chip>
          </h2>
          <p className="text-xs text-gray-500 truncate max-w-md">
            {event.venue}
          </p>
        </div>

        <div className="flex gap-2">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search attendees..."
            startContent={<Search className="text-gray-400" size={16} />}
            value={filterValue}
            onValueChange={setFilterValue}
            size="sm"
            variant="bordered"
          />
          <Button
            startContent={<Download size={16} />}
            size="sm"
            variant="flat"
          >
            Export
          </Button>
        </div>
      </div>

      {/* HeroUI Table */}
      <Table
        aria-label="Registrations table"
        removeWrapper
        classNames={{
          base: "flex-1 overflow-hidden",
          table: "min-h-[400px]",
          th: "bg-gray-50 dark:bg-zinc-900 text-gray-500 font-semibold",
          td: "border-b border-gray-100 dark:border-zinc-800/50 group-last:border-none",
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "end" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={filteredItems}
          isLoading={isLoading}
          loadingContent={<Skeleton className="h-full w-full opacity-50" />}
          emptyContent={
            <div className="flex flex-col items-center justify-center p-10 text-gray-400">
              <Users size={48} className="mb-2 opacity-50" />
              <p>No registrations found for this event.</p>
            </div>
          }
        >
          {(item) => (
            <TableRow key={item.uuid}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

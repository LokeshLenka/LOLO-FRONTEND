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
    Chip,
    Pagination,
    Card,
    CardBody,
    Skeleton,
    Breadcrumbs,
    BreadcrumbItem,
    Tooltip,
    Modal,
    ModalContent,
    // ModalBody,
    useDisclosure,
} from "@heroui/react";

import { useNavigate, useParams } from "react-router-dom";
import {
    Search,
    Download,
    Eye,
    CalendarDays,
    Users,
    LayoutDashboard,
    RefreshCcw,
    CheckCircle,
    XCircle,
    X,
} from "lucide-react";
import { useQuery, useMutation, keepPreviousData } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import clsx from "clsx";
import { toast } from "sonner";

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

type PublicUser = {
    id: number;
    uuid: string;
    reg_num: string;
    email: string;
    name: string;
    gender: string;
    year: string;
    branch: string;
    phone_no: string;
    college_hostel_status: boolean;
};

type Registration = {
    id: number;
    uuid: string;
    public_user_id: number;
    reg_num: string;
    event_id: number;
    ticket_code: string | null;
    utr?: string | null;
    is_paid: string;
    payment_status: string;
    registration_status: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    public_user: PublicUser;
    event: {
        uuid: string;
        name: string;
    };
};

// --- API Helpers ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type EventsResponse = {
    data: Event[];
    last_page: number;
    current_page: number;
    total: number;
};

const fetchEvents = async (page: number, search: string): Promise<EventsResponse> => {
    try {
        const { data } = await axios.get(`${API_BASE_URL}/events`, {
            params: { page, per_page: 8, search },
        });
        return data?.data || { data: [], last_page: 1, current_page: 1, total: 0 };
    } catch (error) {
        console.error("Failed to fetch events:", error);
        return { data: [], last_page: 1, current_page: 1, total: 0 };
    }
};

const fetchRegistrations = async (eventUuid: string): Promise<Registration[]> => {
    try {
        const { data } = await axios.get(
            `${API_BASE_URL}/ebm/event-registrations/public/event/${eventUuid}`
        );
        return data?.data || [];
    } catch (error) {
        console.error("Failed to fetch registrations:", error);
        return [];
    }
};

// --- Sub-Component: Action Button Tooltip Helper ---
function ActionIconButton({
    tooltip,
    placement = "top",
    onPress,
    className,
    children,
}: {
    tooltip: string;
    placement?: "top" | "bottom" | "left" | "right";
    onPress?: () => void;
    className: string;
    children: React.ReactNode;
}) {
    return (
        <Tooltip
            content={tooltip}
            placement={placement}
            size="sm"
            classNames={{
                base: "z-[99999]", // Forces tooltip above table layout and overlapping elements
                content: "bg-zinc-900 text-white font-semibold rounded px-2 shadow-lg",
            }}
        >
            <Button isIconOnly size="sm" radius="md" onPress={onPress} className={className}>
                {children}
            </Button>
        </Tooltip>
    );
}

// --- Main Components ---
export default function ShowUTREventRegistrations() {
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    return (
        <div className="w-full min-h-screen bg-transparent relative text-zinc-900 dark:text-zinc-100 selection:bg-cyan-500/30 bg-white dark:bg-gray-900">
            <div className="w-full bg-white dark:bg-transparent py-5 border-b border-zinc-200 dark:border-zinc-800">
                <div className="mx-auto px-6 lg:px-8 flex flex-col gap-2">
                    <Breadcrumbs
                        radius="none"
                        itemClasses={{
                            item: "text-zinc-500 data-[current=true]:text-cyan-600 data-[current=true]:font-semibold",
                            separator: "text-zinc-400",
                        }}
                    >
                        <BreadcrumbItem>Dashboard</BreadcrumbItem>
                        <BreadcrumbItem>Events</BreadcrumbItem>
                        <BreadcrumbItem>Registrations</BreadcrumbItem>
                    </Breadcrumbs>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-cyan-600/90 shadow-none">
                            <LayoutDashboard className="text-white h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <div>
                            <h1 className="font-bold tracking-tight text-xl sm:text-2xl truncate">
                                Event Registrations
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto px-4 py-4 h-[calc(100vh-60px)]">
                <div className="flex flex-col lg:flex-row gap-2 h-full min-h-0">
                    <div className="w-full lg:w-1/3 flex flex-col gap-4 h-full min-h-0 ">
                        <EventsList selectedId={selectedEvent?.uuid} onSelect={setSelectedEvent} />
                    </div>

                    <div className="w-full lg:w-2/3 flex flex-col h-full min-h-0">
                        <Card className="h-full border border-zinc-200 dark:border-zinc-800 shadow-sm" radius="none" shadow="sm">
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

// --- Sub-Component: Events List ---
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
        <Card className="h-full border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col bg-white dark:bg-white/1 rounded-lg" radius="none" shadow="sm">
            <CardBody className="p-4 flex flex-col gap-4 h-full">
                <Input
                    placeholder="Search events..."
                    startContent={<Search size={16} className="text-zinc-400 hidden" />}
                    value={search}
                    onValueChange={setSearch}
                    isClearable
                    hidden
                    classNames={{ inputWrapper: "hidden" }}
                />

                <div className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-2 pr-1 custom-scrollbar">
                    {isLoading ? (
                        [...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-none" />)
                    ) : events.length === 0 ? (
                        <div className="text-center py-10 text-zinc-400">No events found</div>
                    ) : (
                        events.map((event: Event) => (
                            <button
                                key={event.uuid}
                                onClick={() => onSelect(event)}
                                className={clsx(
                                    "text-left p-3 border-b border-zinc-100 dark:border-zinc-800 transition-all duration-200 group relative",
                                    selectedId === event.uuid
                                        ? "bg-gray-100 dark:bg-gray-950 border-l-4 !border-l-cyan-600 pl-[9px]"
                                        : "bg-white dark:bg-transparent hover:bg-gray-200 dark:hover:bg-gray-950 border-l-4 !border-l-transparent"
                                )}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className={clsx("font-semibold text-sm line-clamp-1", selectedId === event.uuid ? "text-cyan-700 dark:text-cyan-400" : "text-zinc-900 dark:text-zinc-200")}>
                                        {event.name}
                                    </h3>
                                    {event.status && (
                                        <Chip
                                            size="sm"
                                            variant="flat"
                                            radius="none"
                                            classNames={{
                                                base: event.status === "published" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                                                content: "font-bold text-[10px] uppercase px-1",
                                            }}
                                        >
                                            {event.status}
                                        </Chip>
                                    )}
                                </div>

                                <div className="flex justify-between items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                                    <span className="flex items-center gap-1 font-medium">
                                        <CalendarDays size={12} />
                                        {format(new Date(event.start_date), "MMM d, yyyy")}
                                    </span>
                                    {event.type && (
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{event.type}</span>
                                    )}
                                </div>
                            </button>
                        ))
                    )}
                </div>

                <div className="pt-2 flex justify-center border-t border-zinc-100 dark:border-zinc-800">
                    <Pagination
                        total={totalPages}
                        page={page}
                        onChange={setPage}
                        size="sm"
                        radius="none"
                        showControls
                        classNames={{
                            cursor: "bg-cyan-600 text-white font-bold",
                            item: "bg-transparent text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800",
                        }}
                    />
                </div>
            </CardBody>
        </Card>
    );
}

// --- Sub-Component: Registrations Table ---
const columns = [
    { name: "ATTENDEE", uid: "public_user" },
    { name: "STATUS", uid: "registration_status" },
    { name: "PAYMENT", uid: "payment_status" },
    { name: "REGISTERED AT", uid: "created_at" },
    { name: "ACTIONS", uid: "actions" },
];

function RegistrationsTable({ event }: { event: Event }) {
    const [filterValue, setFilterValue] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure();

    const navigate = useNavigate();
    const { username } = useParams<{ username: string }>();

    const [selectedAction, setSelectedAction] = useState<{
        item: Registration | null;
        actionType: "approve" | "reject";
    }>({ item: null, actionType: "approve" });

    const { data: registrations = [], isLoading, refetch, isRefetching } = useQuery({
        queryKey: ["registrations", event.uuid],
        queryFn: () => fetchRegistrations(event.uuid),
        enabled: !!event.uuid,
    });

    const updateMutation = useMutation({
        mutationFn: async ({ regUuid, status }: { regUuid: string; status: "confirmed" | "rejected" }) => {
            return axios.put(`${API_BASE_URL}/ebm/events/${event.uuid}/public-registrations/${regUuid}`, { registration_status: status });
        },
        onSuccess: (_, variables) => {
            toast.success(`Registration successfully ${variables.status === "confirmed" ? "approved" : "rejected"}!`);
            refetch();
            onClose();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update registration status.");
            console.error("Update error:", error);
        },
    });

    const filteredItems = useMemo(() => {
        let filteredUsers = [...registrations];
        if (filterValue) {
            filteredUsers = filteredUsers.filter((item) => {
                const nameToSearch = item.public_user?.name || "";
                const regNumToSearch = item.public_user?.reg_num || "";
                const utrToSearch = item.utr || "";
                return (
                    nameToSearch.toLowerCase().includes(filterValue.toLowerCase()) ||
                    regNumToSearch.toLowerCase().includes(filterValue.toLowerCase()) ||
                    utrToSearch.toLowerCase().includes(filterValue.toLowerCase())
                );
            });
        }
        return filteredUsers;
    }, [filterValue, registrations]);

    const handleActionClick = useCallback((item: Registration, type: "approve" | "reject") => {
        setSelectedAction({ item, actionType: type });
        onOpen();
    }, [onOpen]);

    const handleConfirmAction = useCallback(() => {
        if (!selectedAction.item) return;
        updateMutation.mutate({
            regUuid: selectedAction.item.uuid,
            status: selectedAction.actionType === "approve" ? "confirmed" : "rejected",
        });
    }, [selectedAction, updateMutation]);

    const renderCell = useCallback((item: Registration, columnKey: React.Key) => {
        switch (columnKey) {
            case "public_user":
                const user = item.public_user;
                return (
                    <div className="flex flex-col justify-center">
                        <span className="text-sm font-semibold text-zinc-900 dark:text-white">{user.name}</span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">{user.reg_num || user.email}</span>
                    </div>
                );

            case "registration_status":
                const regStatusConfig: Record<string, { bg: string; text: string }> = {
                    approved: { bg: "bg-emerald-100 dark:bg-emerald-900/20", text: "text-emerald-700 dark:text-emerald-400" },
                    confirmed: { bg: "bg-emerald-100 dark:bg-emerald-900/20", text: "text-emerald-700 dark:text-emerald-400" },
                    pending: { bg: "bg-amber-100 dark:bg-amber-900/20", text: "text-amber-700 dark:text-amber-400" },
                    rejected: { bg: "bg-red-100 dark:bg-red-900/20", text: "text-red-700 dark:text-red-400" },
                };
                const regConf = regStatusConfig[item.registration_status] || { bg: "bg-zinc-100", text: "text-zinc-600" };

                return (
                    <Chip className={clsx("border-none", regConf.bg)} classNames={{ content: clsx("font-bold capitalize", regConf.text) }} size="sm" radius="none" variant="flat">
                        {item.registration_status}
                    </Chip>
                );

            case "payment_status":
                const payStatusConfig: Record<string, { bg: string; text: string }> = {
                    paid: { bg: "bg-blue-100 dark:bg-blue-900/20", text: "text-blue-700 dark:text-blue-400" },
                    success: { bg: "bg-blue-100 dark:bg-blue-900/20", text: "text-blue-700 dark:text-blue-400" },
                    pending: { bg: "bg-orange-100 dark:bg-orange-900/20", text: "text-orange-700 dark:text-orange-400" },
                    failed: { bg: "bg-red-100 dark:bg-red-900/20", text: "text-red-700 dark:text-red-400" },
                    not_paid: { bg: "bg-zinc-100 dark:bg-zinc-800", text: "text-zinc-600 dark:text-zinc-400" },
                };
                const payConf = payStatusConfig[item.payment_status] || payStatusConfig[item.is_paid] || { bg: "bg-zinc-100", text: "text-zinc-600" };

                return (
                    <div className="flex flex-col gap-1">
                        <Chip className={clsx("border-none", payConf.bg)} classNames={{ content: clsx("font-bold capitalize", payConf.text) }} size="sm" radius="none" variant="flat">
                            {item.payment_status}
                        </Chip>
                        {item.utr && <span className="text-[10px] text-zinc-500 font-mono">UTR: {item.utr}</span>}
                    </div>
                );

            case "created_at":
                return (
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-200">
                            {format(new Date(item.created_at), "MMM d, yyyy")}
                        </span>
                        <span className="text-xs text-zinc-500 font-mono">
                            {format(new Date(item.created_at), "h:mm a")}
                        </span>
                    </div>
                );

            case "actions":
                return (
                    // Critical to force overflow-visible in the container holding tooltips 
                    <div className="relative flex justify-end items-center gap-2 overflow-visible">
                        {item.registration_status === "pending" && (
                            <>
                                <ActionIconButton
                                    tooltip="Approve"
                                    onPress={() => handleActionClick(item, "approve")}
                                    className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/40"
                                >
                                    <CheckCircle size={18} />
                                </ActionIconButton>

                                <ActionIconButton
                                    tooltip="Reject"
                                    onPress={() => handleActionClick(item, "reject")}
                                    className="bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                                >
                                    <XCircle size={18} />
                                </ActionIconButton>
                            </>
                        )}

                        <ActionIconButton
                            tooltip="View Details"
                            placement="left"
                            onPress={() => {
                                if (username) {
                                    navigate(`/${username}/executive_body_member/event-registrations/${item.uuid}`);
                                }
                            }}
                            className="bg-zinc-100 text-zinc-600 hover:bg-cyan-50 hover:text-cyan-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:text-cyan-400"
                        >
                            <Eye size={18} />
                        </ActionIconButton>
                    </div>
                );
            default:
                return null;
        }
    }, [handleActionClick, navigate, username]);

    return (
        <div className="flex flex-col h-full bg-white dark:bg-white/1">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-white dark:!bg-black/1">
                <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                        {event.name}
                        <Chip size="sm" variant="flat" radius="none" className="ml-2 bg-zinc-100 text-zinc-600 font-bold">
                            {filteredItems.length}
                        </Chip>
                    </h2>
                    <p className="text-xs text-zinc-500 truncate max-w-md flex items-center gap-1">
                        <span className="font-semibold text-cyan-600">Venue:</span> {event.venue}
                    </p>
                </div>

                <div className="flex gap-2">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[200px]"
                        placeholder="Search attendee or UTR..."
                        startContent={<Search className="text-zinc-400" size={16} />}
                        value={filterValue}
                        onValueChange={setFilterValue}
                        size="sm"
                        classNames={{ inputWrapper: "bg-zinc-100 dark:bg-zinc-800" }}
                    />
                    <div className="flex justify-center gap-2">
                        <Button
                            startContent={<RefreshCcw size={16} className={isRefetching ? "animate-spin" : ""} />}
                            size="sm"
                            radius="none"
                            className="text-black dark:text-white font-medium min-w-8 sm:min-w-fit px-2 sm:px-3"
                            onPress={() => refetch()}
                            isDisabled={isLoading || isRefetching}
                        >
                            <span className="hidden sm:inline">{isRefetching ? "Refreshing..." : "Refresh"}</span>
                        </Button>
                        <Button startContent={<Download size={16} />} size="sm" radius="none" className="text-black dark:text-white font-medium min-w-8 sm:min-w-fit px-2 sm:px-3">
                            <span className="hidden sm:inline">Export</span>
                        </Button>
                    </div>
                </div>
            </div>

            <Table
                aria-label="Registrations table"
                isHeaderSticky
                radius="none"
                classNames={{
                    base: "flex-1 overflow-hidden",
                    wrapper: "h-full max-h-full p-0 rounded-none shadow-none border-none bg-transparent overflow-y-auto custom-scrollbar overflow-visible",
                    table: "min-w-full overflow-visible",
                    th: "bg-white dark:bg-zinc-950 text-zinc-500 font-bold uppercase text-[10px] tracking-wider border-b border-zinc-200 dark:border-zinc-800 shadow-none z-10",
                    td: "border-b border-zinc-100 dark:border-zinc-800/50 group-last:border-none py-3 overflow-visible",
                    tr: "hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors overflow-visible",
                }}
            >
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.uid} align={column.uid === "actions" ? "end" : "start"}>{column.name}</TableColumn>}
                </TableHeader>
                <TableBody
                    items={filteredItems}
                    isLoading={isLoading}
                    loadingContent={<Skeleton className="h-full w-full opacity-50" />}
                    emptyContent={
                        <div className="flex flex-col items-center justify-center p-10 text-zinc-400">
                            <Users size={48} className="mb-2 opacity-50" />
                            <p>No registrations found.</p>
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

            <Modal
                isOpen={isOpen}
                onClose={onClose}
                placement="center"
                size="md"
                backdrop="opaque"
                hideCloseButton={true}
                classNames={{
                    backdrop: "bg-white/80 dark:bg-black/80 z-[99]",
                    base: "bg-transparent border border-white/10 shadow-2xl rounded-2xl z-[10001]",
                    wrapper: "z-[10000]",
                }}
                motionProps={{
                    variants: {
                        enter: { scale: 1, opacity: 1, transition: { duration: 0.22, ease: "easeOut" } },
                        exit: { scale: 0.96, opacity: 0, transition: { duration: 0.18, ease: "easeIn" } },
                    },
                }}
            >
                <ModalContent>
                    {(close) => (
                        <div className="relative">
                            <button type="button" onClick={close} className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition">
                                <X className="h-4 w-4" />
                            </button>

                            <Card className="bg-white dark:bg-white/1 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl pt-6 z-10">
                                <div className="px-6 pb-2 pt-2 flex flex-col items-start gap-1">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                        {selectedAction.actionType === "approve" ? "Confirm Approval" : "Confirm Rejection"}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Are you sure you want to{" "}
                                        <span className={clsx("font-bold", selectedAction.actionType === "approve" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
                                            {selectedAction.actionType}
                                        </span>{" "}
                                        the registration for <strong className="text-zinc-900 dark:text-zinc-100">{selectedAction.item?.public_user.name}</strong>?
                                    </p>
                                </div>

                                <CardBody className="px-6 py-4 flex flex-col gap-4">
                                    {selectedAction.item?.utr && (
                                        <div className="p-3 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-lg">
                                            <p className="text-xs text-zinc-500 mb-1 font-semibold uppercase tracking-wider">Provided UTR</p>
                                            <p className="font-mono text-base font-bold text-zinc-900 dark:text-zinc-100">{selectedAction.item.utr}</p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-3 pt-2">
                                        <Button color="default" className="bg-zinc-200 dark:bg-white/10 text-zinc-800 dark:text-white font-medium h-10" onPress={close}>
                                            Cancel
                                        </Button>
                                        <Button
                                            className={clsx("text-white font-medium h-10", selectedAction.actionType === "approve" ? "bg-[#03a1b0] hover:bg-cyan-600" : "bg-red-600 hover:bg-red-700")}
                                            onPress={handleConfirmAction}
                                            isLoading={updateMutation.isPending}
                                        >
                                            {selectedAction.actionType === "approve" ? "Yes, Approve" : "Yes, Reject"}
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}

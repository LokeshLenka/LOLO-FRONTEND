import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Button,
  Tooltip,
  Card,
  CardBody,
  Input,
  Skeleton,
  Snippet,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  useDisclosure,
  Divider,
} from "@heroui/react";
import TablePagination from "@mui/material/TablePagination";
import {
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  MoreVertical,
  Clock,
  Briefcase,
  Music,
  ShieldAlert,
  Download,
  RefreshCw,
  User2,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { DecisionPanel } from "@/components/core/DecisionPanel";

// --- Types ---

interface ProfileBase {
  uuid: string;
  first_name: string;
  last_name: string;
  reg_num: string;
  branch: string;
  year: string;
  phone_no: string;
  gender: string;
  sub_role: string;
  experience?: string;
  lateral_status: number;
  hostel_status: number;
  college_hostel_status: number;
}

interface MusicProfile extends ProfileBase {
  instrument_avail: number;
  other_fields_of_interest: string;
  passion: string;
}

interface ManagementProfile extends ProfileBase {
  interest_towards_lolo: string;
  any_club: string;
}

interface UserApproval {
  status: string;
  remarks: string | null;
  ebm_assigned_at: string;
}

interface UserDetails {
  uuid: string;
  username: string | null;
  email: string;
  role: "music" | "management";
  is_approved: boolean;
  created_at: string;
  music_profile: MusicProfile | null;
  management_profile: ManagementProfile | null;
  user_approval: UserApproval;
}

interface ApiResponseData {
  current_page: number;
  data: UserDetails[];
  first_page_url: string;
  from: number | null;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

// --- Constants ---
const STORAGE_KEYS = {
  PAGE: "ebm_pending_approvals_page",
  ROWS: "ebm_pending_approvals_rows_per_page",
} as const;

// --- Sub-Components for Cleanliness ---
const StatsCard = ({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number | string;
  icon: any;
  color: string;
}) => (
  <Card
    shadow="none"
    className="border border-black/5 dark:border-white/5 bg-white dark:bg-white/5"
  >
    <CardBody className="flex flex-row items-center gap-4 p-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {title}
        </p>
        <h4 className="text-2xl font-black text-gray-900 dark:text-white">
          {value}
        </h4>
      </div>
    </CardBody>
  </Card>
);

// hooks/useDebounce.ts
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

/** Retrieves User Object safely */
/** Retrieves User Object safely */
const getUserFromStorage = (): any => {
  try {
    // FIX: Changed from 'authToken' to 'userProfile'
    // 'authToken' usually contains the raw JWT string, which causes JSON.parse to fail
    const raw = localStorage.getItem("userProfile");

    if (!raw) return null;

    // Check if the value looks like a JSON object (starts with {) or array ([)
    // This prevents crashing if a raw string is accidentally stored in this key
    if (raw.trim().startsWith("{") || raw.trim().startsWith("[")) {
      return JSON.parse(raw);
    }

    // Fallback: If it's not JSON, return null or handle appropriately
    console.warn("Stored userProfile is not a valid JSON object");
    return null;
  } catch (e) {
    console.error("Error parsing user from storage", e);
    return null;
  }
};

const currentUser = getUserFromStorage();

export default function EBMPendingApprovals() {
  // --- State ---
  const [users, setUsers] = useState<UserDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [currentPageData, setCurrentPageData] =
    useState<ApiResponseData | null>(null);

  const [decisionOpen, setDecisionOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);

  // Added remarks state to control the DecisionPanel
  const [remarks, setRemarks] = useState("");

  const [pendingAction, setPendingAction] = useState<
    "approve" | "reject" | "view" | null
  >(null);

  const navigate = useNavigate();

  // Pagination State (Persisted)
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

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // --- API Handling ---
  const fetchApprovals = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = `${API_BASE_URL}/ebm/pending-approvals?page=${
        page + 1
      }&per_page=${rowsPerPage}`;

      const response = await axios.get<{
        success: boolean;
        data: ApiResponseData;
      }>(endpoint);

      const paginatorData = response.data.data;

      if (paginatorData?.data) {
        setUsers(paginatorData.data);
        setCurrentPageData(paginatorData);
      } else {
        setUsers([]);
        setCurrentPageData(null);
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      toast.error(
        err.response?.data?.message || "Failed to load pending approvals",
      );
      setUsers([]);
      setCurrentPageData(null);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, page, rowsPerPage]);

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  const handleActionIntent = (
    user: UserDetails,
    action: "approve" | "reject" | "view",
  ) => {
    if (action === "view") {
      navigate(
        `/${currentUser?.username}/executive_body_member/pending-approvals/view-application/user/${user.uuid}`,
      );
      return;
    }

    // approve / reject → open modal
    setSelectedUser(user);
    setPendingAction(action);
    setRemarks(""); // Reset remarks when opening
    setDecisionOpen(true);
  };

  const handleDecisionSubmit = async (
    action: "approve" | "reject",
    submittedRemarks: string,
  ) => {
    if (!selectedUser) return;

    setProcessingId(selectedUser.uuid); // Set processing ID

    const toastId = toast.loading(
      `${action === "approve" ? "Approving" : "Rejecting"} user...`,
    );

    try {
      await axios.post(
        `${API_BASE_URL}/ebm/${action}-user/${selectedUser.uuid}`,
        { remarks: submittedRemarks },
      );

      toast.success(`User ${action}d successfully`, { id: toastId });

      setDecisionOpen(false);
      setSelectedUser(null);
      setPendingAction(null);
      setRemarks("");

      fetchApprovals(); // refresh table
    } catch (err: any) {
      toast.error(err.response?.data?.message || `Failed to ${action} user`, {
        id: toastId,
      });
    } finally {
      setProcessingId(null);
    }
  };

  // --- Pagination Handlers ---
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

  // --- Helpers ---
  const getUserDisplayData = (user: UserDetails) => {
    const profile =
      user.role === "music" ? user.music_profile : user.management_profile;

    const fullName = profile
      ? `${profile.first_name} ${profile.last_name}`
      : user.username || "Unknown User";

    const regNum = profile?.reg_num || "N/A";
    const branch = profile?.branch || "N/A";
    const year = profile?.year
      ? profile.year.charAt(0).toUpperCase() + profile.year.slice(1)
      : "N/A";
    const branchYear = `${branch}`.toLocaleUpperCase() + ` • ${year}`;
    const subRole = profile?.sub_role || user.role;

    return { fullName, regNum, branchYear, subRole };
  };

  const totalItems = currentPageData?.total ?? 0;

  const [searchQuery, setSearchQuery] = useState("");
  // const [isFilterActive, setIsFilterActive] = useState(false); // Unused

  const debouncedSearch = useDebounce(searchQuery, 400);

  useEffect(() => {
    // Note: If your API supports search, you should append `&search=${debouncedSearch}`
    // to the endpoint in fetchApprovals. Currently it just re-fetches the page.
    fetchApprovals();
  }, [debouncedSearch, fetchApprovals]);

  return (
    <section className="w-full min-h-screen py-6 px-0 sm:px-8 lg:px-12 mx-auto space-y-6 bg-gray-50/50 dark:bg-black/5">
      {/* 1. Page Header & Stats */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Pending Approvals
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
              Manage and review member registration requests.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="flat"
              startContent={
                <RefreshCw
                  size={18}
                  className={loading ? "animate-spin" : ""}
                />
              }
              onPress={() => fetchApprovals()}
              isDisabled={loading}
              className="font-semibold"
            >
              Refresh
            </Button>
            {/* <Button
              className="bg-[#03a1b0] text-white font-bold"
              startContent={<Download size={18} />}
            >
              Download
            </Button> */}
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Pending"
            value={totalItems}
            icon={Clock}
            color="bg-amber-500"
          />
          <StatsCard
            title="Music Members"
            value={users.filter((u) => u.role === "music").length}
            icon={Music}
            color="bg-purple-500"
          />
          <StatsCard
            title="Management Members"
            value={users.filter((u) => u.role === "management").length}
            icon={Briefcase}
            color="bg-blue-500"
          />
          <StatsCard
            title="Urgent Actions"
            value={0}
            icon={ShieldAlert}
            color="bg-red-500"
          />
        </div>
      </div>

      {/* 2. Main Data Table */}
      <Card
        shadow="sm"
        className="border border-black/5 dark:border-white/5 bg-white dark:bg-black/20 rounded-2xl overflow-hidden"
      >
        <CardBody className="p-0">
          {/* Toolbar */}
          {/* <div className="p-4 border-b border-gray-100 dark:border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-white/5">
            <Input
              className="w-full sm:max-w-xs h-full outline-none"
              placeholder="Search by name or reg no..."
              startContent={<Search size={18} className="text-gray-400" />}
              value={searchQuery}
              onValueChange={setSearchQuery}
              variant="bordered"
              size="md"
              classNames={{
                inputWrapper: "bg-gray-50 dark:bg-black/20 border-black/10",
              }}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="flat"
                startContent={<Filter size={16} />}
                className="text-gray-600 dark:text-gray-300"
              >
                Filters
              </Button>
            </div>
          </div> */}

          {/* Content */}
          {loading ? (
            <div className="p-4 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="w-full space-y-2">
                    <Skeleton className="h-3 w-1/3 rounded-lg" />
                    <Skeleton className="h-3 w-1/4 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-24 text-center">
              <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={40} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                All caught up!
              </h3>
              <p className="text-gray-500 max-w-xs mx-auto mt-1">
                There are no pending approval requests assigned to you at the
                moment.
              </p>
            </div>
          ) : (
            <Table
              aria-label="Pending Approvals Table"
              selectionMode="single"
              color="primary"
              classNames={{
                wrapper: "shadow-none bg-transparent rounded-none p-0",
                th: "bg-gray-50 dark:bg-white/5 text-gray-500 font-bold uppercase text-[10px] tracking-wider py-4",
                td: "py-4 border-b border-gray-100 dark:border-white/5 group-data-[last=true]:border-none",
                tr: "hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors",
              }}
            >
              <TableHeader>
                <TableColumn>S.No</TableColumn>
                <TableColumn>APPLICANT DETAILS</TableColumn>
                <TableColumn>ROLE & STATUS</TableColumn>
                <TableColumn>ACADEMIC INFO</TableColumn>
                <TableColumn>ASSIGNMENT</TableColumn>
                <TableColumn align="center">ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {users.map((user, index) => {
                  const { fullName, regNum, branchYear, subRole } =
                    getUserDisplayData(user);

                  return (
                    <TableRow key={user.uuid}>
                      <TableCell className="font-mono text-gray-500">
                        #
                        {String(index + 1 + page * rowsPerPage).padStart(
                          3,
                          "0",
                        )}
                      </TableCell>
                      <TableCell>
                        <User
                          name={fullName}
                          description={user.username}
                          avatarProps={{
                            radius: "full",
                            size: "sm",
                            fallback:
                              user.role === "music" ? (
                                <Music className="w-4 h-4" />
                              ) : (
                                <Briefcase className="w-4 h-4" />
                              ),
                            className:
                              user.role === "music"
                                ? "bg-purple-50 text-purple-600 border border-purple-100 w-9 sm:w-8 h-6 sm:h-8 "
                                : "bg-blue-50 text-blue-600 border border-blue-100 w-6 sm:w-8 h-6 sm:h-8",
                          }}
                          classNames={{
                            name: "text-sm font-bold text-gray-900 dark:text-white",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1.5 items-start">
                          <Chip
                            size="sm"
                            startContent={
                              <div
                                className={`w-1.5 h-1.5 rounded-full ml-1 ${
                                  user.role === "music"
                                    ? "bg-purple-500"
                                    : "bg-blue-500"
                                }`}
                              />
                            }
                            variant="solid"
                            classNames={{
                              base:
                                user.role === "music"
                                  ? "bg-purple-50 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300"
                                  : "bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300",
                              content: "font-bold capitalize pl-1",
                            }}
                          >
                            {user.role}
                          </Chip>
                          <span className="text-xs text-gray-500 font-medium capitalize pl-1">
                            {subRole
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                            {branchYear}
                          </span>
                          <span className="text-xs text-gray-400 font-mono">
                            {regNum}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Clock size={12} />
                            <span>Assigned</span>
                          </div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {user.user_approval.ebm_assigned_at
                              ? new Date(
                                  user.user_approval.ebm_assigned_at,
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "N/A"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Tooltip
                            content="Approve User"
                            className="bg-black dark:bg-white text-white dark:text-black backdrop-blur-lg border"
                            placement="bottom"
                          >
                            <Button
                              isIconOnly
                              size="sm"
                              className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 dark:bg-green-500/10 dark:text-green-400"
                              isLoading={processingId === user.uuid}
                              onPress={() =>
                                handleActionIntent(user, "approve")
                              }
                            >
                              <CheckCircle2 size={18} />
                            </Button>
                          </Tooltip>
                          <Tooltip
                            content="Reject User"
                            className="bg-black dark:bg-white text-white dark:text-black backdrop-blur-lg border"
                            placement="bottom"
                          >
                            <Button
                              isIconOnly
                              size="sm"
                              className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 dark:bg-red-500/10 dark:text-red-400"
                              isLoading={processingId === user.uuid}
                              onPress={() => handleActionIntent(user, "reject")}
                            >
                              <XCircle size={18} />
                            </Button>
                          </Tooltip>
                          <Tooltip
                            content="View Application"
                            className="bg-black dark:bg-white text-white dark:text-black backdrop-blur-lg border"
                            placement="bottom"
                          >
                            <Button
                              isIconOnly
                              size="sm"
                              className="bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                              isLoading={processingId === user.uuid}
                              onPress={() => handleActionIntent(user, "view")}
                            >
                              <Eye size={18} />
                            </Button>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>
      <Divider className="pb-20"></Divider>

      {/* 3. Floating Pagination Control */}
      {currentPageData && totalItems > 0 && (
        <div className="fixed z-[99] bottom-8 w-full sm:w-[28%] flex right-0 sm:right-22 items-center py-3 rounded-xl bg-white/70 dark:bg-black/70 backdrop-blur-sm border border-black/5 dark:border-white/5">
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
                      "!bg-black/5 dark:!bg-white/5 !text-black dark:!text-white !backdrop-blur-sm !rounded-lg !shadow-xl",
                    sx: {
                      "& .MuiMenuItem-root.Mui-selected": {
                        bgcolor: "#03a1b0 !important",
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

      {selectedUser && pendingAction && (
        <DecisionPanel
          asModal
          isOpen={decisionOpen}
          onClose={() => {
            setDecisionOpen(false);
            setSelectedUser(null);
            setPendingAction(null);
          }}
          user={selectedUser}
          // The component is controlled from outside
          remarks={remarks}
          setRemarks={setRemarks}
          // processingAction logic: pass the action if we are processing this user
          processingAction={
            processingId === selectedUser.uuid
              ? (pendingAction as "approve" | "reject")
              : null
          }
          // Map the component's internal submit to our handler
          handleAction={(action) => handleDecisionSubmit(action, remarks)}
        />
      )}
    </section>
  );
}

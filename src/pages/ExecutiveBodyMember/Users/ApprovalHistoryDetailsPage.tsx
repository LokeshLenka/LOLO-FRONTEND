import React, { useEffect, useState, useCallback, useMemo } from "react";
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
  Card,
  CardBody,
  Input,
  Skeleton,
  Tabs,
  Tab,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Divider,
} from "@heroui/react";
import TablePagination from "@mui/material/TablePagination";
import {
  CheckCircle2,
  XCircle,
  Search,
  Clock,
  Briefcase,
  Music,
  RefreshCw,
  Eye,
  FileText,
  UserCheck,
  UserX,
  TrendingUp,
  ShieldCheck,
  Building,
  Calendar,
  User as UserIcon,
  Phone,
  Mail,
  GraduationCap,
  Mic2,
  Heart,
  History,
  Trophy,
  Users,
  Check,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";

// --- Types ---
interface ProfileBase {
  uuid: string;
  first_name: string;
  last_name: string;
  reg_num: string;
  branch: string;
  year: string;
  gender: string;
  sub_role: string;
  phone_no?: string;
  experience?: string;
  lateral_status?: number;
  hostel_status?: number;
  college_hostel_status?: number;
}

interface MusicProfile extends ProfileBase {
  instrument_avail?: number;
  other_fields_of_interest?: string;
  passion?: string;
}

interface ManagementProfile extends ProfileBase {
  interest_towards_lolo?: string;
  any_club?: string;
}

interface UserApproval {
  status: string;
  remarks: string | null;
  ebm_assigned_at: string;
  ebm_approved_at: string | null;
}

interface UserDetails {
  uuid: string;
  username: string | null;
  email?: string;
  role: "music" | "management";
  is_approved: boolean;
  is_active: number;
  music_profile: MusicProfile | null;
  management_profile: ManagementProfile | null;
  user_approval: UserApproval;
  created_at?: string;
}

interface ApprovalStats {
  total: number;
  approved: number;
  rejected: number;
  active_members: number;
}

interface PaginationWrapper {
  current_page: number;
  data: UserDetails[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

interface ApiResponseBody {
  status: string;
  code: number;
  message: string;
  data: {
    stats: ApprovalStats;
    data: PaginationWrapper;
  };
}

// --- Constants ---
const STORAGE_KEYS = {
  PAGE: "ebm_approval_history_page",
  ROWS: "ebm_approval_history_rows_per_page",
  TAB: "ebm_approval_history_tab",
} as const;

// --- Sub-Components ---
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
      <div className="flex-1">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {title}
        </p>
        <div className="flex items-center gap-2">
          <h4 className="text-2xl font-black text-gray-900 dark:text-white">
            {value}
          </h4>
        </div>
      </div>
    </CardBody>
  </Card>
);

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig: Record<
    string,
    { label: string; color: string; icon: any }
  > = {
    ebm_approved: {
      label: "Approved",
      color:
        "bg-green-50 dark:bg-green-500/20 text-green-700 dark:text-green-300",
      icon: CheckCircle2,
    },
    rejected: {
      label: "Rejected",
      color: "bg-red-50 dark:bg-red-500/20 text-red-700 dark:text-red-300",
      icon: XCircle,
    },
    pending: {
      label: "Pending",
      color:
        "bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300",
      icon: Clock,
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <Chip
      size="sm"
      startContent={<Icon size={14} className="ml-1" />}
      variant="flat"
      classNames={{
        base: config.color,
        content: "font-bold capitalize pl-1",
      }}
    >
      {config.label}
    </Chip>
  );
};

const DetailRow = ({
  label,
  value,
  icon: Icon,
  copyable = false,
  fullWidth = false,
}: {
  label: string;
  value?: string | number | null;
  icon?: any;
  copyable?: boolean;
  fullWidth?: boolean;
}) => {
  return (
    <div
      className={`group flex flex-col gap-1.5 py-2 ${
        fullWidth ? "col-span-1 md:col-span-2" : "col-span-1"
      }`}
    >
      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
        {Icon && <Icon size={14} className="opacity-70" />}
        <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">
          {label}
        </span>
      </div>
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 break-words leading-relaxed">
          {value || (
            <span className="text-gray-400 dark:text-gray-600 italic text-xs">
              Not provided
            </span>
          )}
        </span>
        {copyable && value && (
          <Tooltip content="Copy">
            <button
              onClick={() => {
                navigator.clipboard.writeText(String(value));
                toast.success("Copied!");
              }}
              className="opacity-0 group-hover:opacity-100 text-xs text-[#03a1b0] font-medium transition-opacity px-1"
            >
              Copy
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

const BooleanChip = ({
  label,
  value,
}: {
  label: string;
  value: number | boolean | undefined;
}) => (
  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/5">
    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
      {label}
    </span>
    {value ? (
      <Chip
        size="sm"
        startContent={<Check size={12} />}
        classNames={{
          base: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-none",
        }}
      >
        Yes
      </Chip>
    ) : (
      <Chip
        size="sm"
        startContent={<X size={12} />}
        classNames={{
          base: "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-none",
        }}
      >
        No
      </Chip>
    )}
  </div>
);

const getUserFromStorage = (): any => {
  try {
    const raw = localStorage.getItem("userProfile");
    if (!raw) return null;
    return raw.startsWith("{") ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

const currentUser = getUserFromStorage();

export default function EBMApprovalHistory() {
  // --- State ---
  const [users, setUsers] = useState<UserDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPageData, setCurrentPageData] =
    useState<PaginationWrapper | null>(null);

  const [stats, setStats] = useState<ApprovalStats>({
    total: 0,
    approved: 0,
    rejected: 0,
    active_members: 0,
  });

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedTab, setSelectedTab] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.TAB) || "all";
    } catch {
      return "all";
    }
  });

  // Modal state
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

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
  const debouncedSearch = useDebounce(searchQuery, 400);

  // --- API Handling ---
  const fetchApprovalHistory = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = `${API_BASE_URL}/ebm/my-approvals?page=${
        page + 1
      }&per_page=${rowsPerPage}`;

      const response = await axios.get<ApiResponseBody>(endpoint);

      if (response.data?.status === "success") {
        if (response.data.data.stats) {
          setStats(response.data.data.stats);
        }

        const paginationData = response.data.data.data;
        setCurrentPageData(paginationData);

        const userArray = paginationData?.data || [];
        setUsers(userArray);
      } else {
        setUsers([]);
        setCurrentPageData(null);
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      toast.error(
        err.response?.data?.message || "Failed to load approval history",
      );
      setUsers([]);
      setCurrentPageData(null);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL, page, rowsPerPage]);

  useEffect(() => {
    fetchApprovalHistory();
  }, [fetchApprovalHistory]);

  // --- Filtering ---
  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];

    let filtered = users;

    if (selectedTab === "approved") {
      filtered = filtered.filter(
        (u) => u.user_approval?.status === "ebm_approved",
      );
    } else if (selectedTab === "rejected") {
      filtered = filtered.filter((u) => u.user_approval?.status === "rejected");
    } else if (selectedTab === "music") {
      filtered = filtered.filter((u) => u.role === "music");
    } else if (selectedTab === "management") {
      filtered = filtered.filter((u) => u.role === "management");
    }

    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      filtered = filtered.filter((user) => {
        const profile =
          user.role === "music" ? user.music_profile : user.management_profile;
        const fullName = profile
          ? `${profile.first_name} ${profile.last_name}`.toLowerCase()
          : "";
        const regNum = profile?.reg_num?.toLowerCase() || "";
        return fullName.includes(query) || regNum.includes(query);
      });
    }

    return filtered;
  }, [users, selectedTab, debouncedSearch]);

  // --- Handlers ---
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

  const handleTabChange = (key: React.Key) => {
    const tabKey = key.toString();
    setSelectedTab(tabKey);
    localStorage.setItem(STORAGE_KEYS.TAB, tabKey);
    setPage(0);
    localStorage.setItem(STORAGE_KEYS.PAGE, "0");
  };

  const getUserDisplayData = (user: UserDetails) => {
    const profile =
      user.role === "music" ? user.music_profile : user.management_profile;
    const fullName = profile
      ? `${profile.first_name} ${profile.last_name}`
      : user.username || "Unknown";
    const regNum = profile?.reg_num || "N/A";
    const branch = profile?.branch || "N/A";
    const year = profile?.year
      ? profile.year.charAt(0).toUpperCase() + profile.year.slice(1)
      : "N/A";
    const branchYear = `${branch}`.toUpperCase() + ` • ${year}`;
    const subRole = profile?.sub_role || user.role;
    return { fullName, regNum, branchYear, subRole };
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleViewDetails = (user: UserDetails) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedUser(null), 300); // Cleanup after animation
  };

  const renderModalContent = () => {
    if (!selectedUser) return null;

    const isMusic = selectedUser.role === "music";
    const profile = isMusic
      ? selectedUser.music_profile
      : selectedUser.management_profile;
    const fullName = profile
      ? `${profile.first_name} ${profile.last_name}`
      : selectedUser.username || "Unknown User";

    return (
      <div className="space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
        {/* Identity Section */}
        <div className="space-y-4">
          <div
            className={`h-20 w-full rounded-xl ${
              isMusic
                ? "bg-gradient-to-r from-violet-600/10 to-fuchsia-600/10"
                : "bg-gradient-to-r from-sky-600/10 to-blue-600/10"
            } relative overflow-hidden`}
          >
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(currentColor 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            ></div>
          </div>

          <div className="flex gap-4 items-start -mt-12 px-4">
            <div className="relative shrink-0 z-10">
              <div className="p-1.5 bg-white dark:bg-[#18181b] rounded-2xl shadow-sm ring-1 ring-black/5 dark:ring-white/10">
                <User
                  name={fullName}
                  className="w-20 h-20 text-2xl text-white rounded-xl shadow-md"
                  classNames={{
                    base: isMusic ? "bg-violet-600" : "bg-sky-600",
                    name: "hidden",
                  }}
                  avatarProps={{
                    fallback: isMusic ? (
                      <Music size={32} />
                    ) : (
                      <Briefcase size={32} />
                    ),
                  }}
                />
              </div>
            </div>

            <div className="flex-1 space-y-1 min-w-0 pt-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white break-all">
                {fullName}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                <Chip
                  size="sm"
                  variant="flat"
                  className={`${
                    isMusic
                      ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
                      : "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300"
                  } font-bold border-none h-6`}
                >
                  {isMusic ? "Musician" : "Management"}
                </Chip>
                <StatusBadge status={selectedUser.user_approval?.status} />
              </div>
            </div>
          </div>
        </div>

        <Divider className="my-4" />

        {/* Contact Info */}
        <div className="px-4 space-y-3">
          <h4 className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
            Contact Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailRow
              icon={Mail}
              label="Email"
              value={selectedUser.email}
              copyable
            />
            <DetailRow
              icon={Phone}
              label="Phone"
              value={profile?.phone_no}
              copyable
            />
          </div>
        </div>

        <Divider />

        {/* Academic Profile */}
        <div className="px-4 space-y-3">
          <h4 className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <GraduationCap size={16} className="text-[#03a1b0]" />
            Academic Profile
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <DetailRow
              icon={ShieldCheck}
              label="Reg Number"
              value={profile?.reg_num}
              copyable
            />
            <DetailRow
              icon={Building}
              label="Branch"
              value={profile?.branch?.toUpperCase()}
            />
            <DetailRow icon={Calendar} label="Year" value={profile?.year} />
            <DetailRow icon={UserIcon} label="Gender" value={profile?.gender} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            <BooleanChip
              label="Hostel Resident?"
              value={profile?.hostel_status}
            />
            <BooleanChip
              label="College Hostel?"
              value={profile?.college_hostel_status}
            />
          </div>
        </div>

        <Divider />

        {/* Role Specific Details */}
        <div className="px-4 space-y-3">
          <h4 className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
            {isMusic ? (
              <Music size={16} className="text-violet-500" />
            ) : (
              <Briefcase size={16} className="text-sky-500" />
            )}
            {isMusic ? "Musical Profile" : "Management Profile"}
          </h4>

          {isMusic && selectedUser.music_profile ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailRow
                  icon={Mic2}
                  label="Instrument / Skill"
                  value={selectedUser.music_profile.sub_role?.replace(
                    /_/g,
                    " ",
                  )}
                />
                <DetailRow
                  icon={History}
                  label="Experience"
                  value={selectedUser.music_profile.experience}
                />
              </div>
              <DetailRow
                fullWidth
                icon={Heart}
                label="Passion / Why Music?"
                value={selectedUser.music_profile.passion}
              />
              <DetailRow
                fullWidth
                icon={Trophy}
                label="Other Interests"
                value={selectedUser.music_profile.other_fields_of_interest}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                <BooleanChip
                  label="Owns Instrument?"
                  value={selectedUser.music_profile.instrument_avail}
                />
                <BooleanChip
                  label="Lateral Entry?"
                  value={selectedUser.music_profile.lateral_status}
                />
              </div>
            </div>
          ) : selectedUser.management_profile ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailRow
                  icon={Briefcase}
                  label="Management Role"
                  value={selectedUser.management_profile.sub_role?.replace(
                    /_/g,
                    " ",
                  )}
                />
                <DetailRow
                  icon={History}
                  label="Experience"
                  value={selectedUser.management_profile.experience}
                />
              </div>
              <DetailRow
                fullWidth
                icon={Users}
                label="Club History"
                value={selectedUser.management_profile.any_club}
              />
              <DetailRow
                fullWidth
                icon={Heart}
                label="Interest Description"
                value={selectedUser.management_profile.interest_towards_lolo}
              />
              <div className="mt-4">
                <BooleanChip
                  label="Lateral Entry?"
                  value={selectedUser.management_profile.lateral_status}
                />
              </div>
            </div>
          ) : null}
        </div>

        <Divider />

        {/* Approval Details */}
        <div className="px-4 space-y-3">
          <h4 className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
            Approval Details
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailRow
              icon={Calendar}
              label="Assigned Date"
              value={formatDate(selectedUser.user_approval?.ebm_assigned_at)}
            />
            <DetailRow
              icon={Calendar}
              label="Decision Date"
              value={formatDate(selectedUser.user_approval?.ebm_approved_at)}
            />
          </div>

          {selectedUser.user_approval?.remarks && (
            <div className="mt-4">
              <p className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400 mb-2">
                Remarks
              </p>
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/5">
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {selectedUser.user_approval.remarks}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const totalItems = currentPageData?.total ?? 0;

  return (
    <section className="w-full min-h-screen py-6 px-0 sm:px-8 lg:px-12 mx-auto space-y-6 bg-gray-50/50 dark:bg-black/5">
      {/* 1. Header & Stats */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              My Approval History
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
              Track and review all your approval decisions.
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
              onPress={() => fetchApprovalHistory()}
              isDisabled={loading}
              className="font-semibold"
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Server-Side Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Processed"
            value={stats.total}
            icon={FileText}
            color="bg-blue-500"
          />
          <StatsCard
            title="Approved"
            value={stats.approved}
            icon={UserCheck}
            color="bg-green-500"
          />
          <StatsCard
            title="Rejected"
            value={stats.rejected}
            icon={UserX}
            color="bg-red-500"
          />
          <StatsCard
            title="Active Members"
            value={stats.active_members}
            icon={TrendingUp}
            color="bg-purple-500"
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
          <div className="p-4 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-white/5 space-y-4">
            {/* <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <Input
                className="w-full sm:max-w-xs h-full outline-none"
                placeholder="Search by name or reg number..."
                startContent={<Search size={18} className="text-gray-400" />}
                value={searchQuery}
                onValueChange={setSearchQuery}
                variant="bordered"
                classNames={{
                  inputWrapper: "bg-gray-50 dark:bg-black/20 border-black/10",
                }}
              />
            </div> */}

            {/* Tabs */}
            <Tabs
              selectedKey={selectedTab}
              onSelectionChange={handleTabChange}
              color="primary"
              variant="underlined"
              classNames={{
                base: "w-full",
                tabList:
                  "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                cursor: "w-full bg-[#03a1b0] h-[3px]",
                tab: "max-w-fit px-2 h-12 data-[selected=true]:text-[#03a1b0] transition-colors",
                tabContent: "group-data-[selected=true]:font-bold",
              }}
            >
              <Tab
                key="all"
                title={
                  <div className="flex items-center gap-2">
                    <FileText
                      size={16}
                      className={
                        selectedTab === "all" ? "text-[#03a1b0]" : "opacity-70"
                      }
                    />
                    <span>All</span>
                  </div>
                }
              />
              <Tab
                key="approved"
                title={
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      size={16}
                      className={
                        selectedTab === "approved"
                          ? "text-[#03a1b0]"
                          : "opacity-70"
                      }
                    />
                    <span>Approved</span>
                  </div>
                }
              />
              <Tab
                key="rejected"
                title={
                  <div className="flex items-center gap-2">
                    <XCircle
                      size={16}
                      className={
                        selectedTab === "rejected"
                          ? "text-[#03a1b0]"
                          : "opacity-70"
                      }
                    />
                    <span>Rejected</span>
                  </div>
                }
              />
              <Tab
                key="music"
                title={
                  <div className="flex items-center gap-2">
                    <Music
                      size={16}
                      className={
                        selectedTab === "music"
                          ? "text-[#03a1b0]"
                          : "opacity-70"
                      }
                    />
                    <span>Music</span>
                  </div>
                }
              />
              <Tab
                key="management"
                title={
                  <div className="flex items-center gap-2">
                    <Briefcase
                      size={16}
                      className={
                        selectedTab === "management"
                          ? "text-[#03a1b0]"
                          : "opacity-70"
                      }
                    />
                    <span>Management</span>
                  </div>
                }
              />
            </Tabs>
          </div>

          {/* Table */}
          {loading ? (
            <div className="p-4 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <Skeleton className="h-4 w-full rounded-lg" />
                </div>
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No records found.
            </div>
          ) : (
            <Table
              aria-label="History Table"
              classNames={{
                wrapper: "shadow-none bg-transparent rounded-none p-0",
                th: "bg-gray-50 dark:bg-white/5 text-gray-500 font-bold uppercase text-[10px] tracking-wider py-4",
                td: "py-4 border-b border-gray-100 dark:border-white/5 group-data-[last=true]:border-none",
                tr: "hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors",
              }}
            >
              <TableHeader>
                <TableColumn>S.No</TableColumn>
                <TableColumn>APPLICANT</TableColumn>
                <TableColumn>ROLE</TableColumn>
                <TableColumn>ACADEMIC</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>DATE</TableColumn>
                <TableColumn>ACCOUNT</TableColumn>
                <TableColumn align="center">ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user, index) => {
                  const { fullName, regNum, branchYear, subRole } =
                    getUserDisplayData(user);
                  return (
                    <TableRow key={user.uuid || index}>
                      <TableCell>
                        #
                        {String(index + 1 + page * rowsPerPage).padStart(
                          3,
                          "0",
                        )}
                      </TableCell>
                      <TableCell>
                        <User
                          name={fullName}
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
                                ? "bg-purple-50 text-purple-600 border border-purple-100 w-6 sm:w-8 h-6 sm:h-8 "
                                : "bg-blue-50 text-blue-600 border border-blue-100 w-6 sm:w-8 h-6 sm:h-8",
                          }}
                          classNames={{
                            name: "text-sm font-bold text-gray-900 dark:text-white truncate",
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
                              .replace(/\w/g, (l) => l.toUpperCase())}
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
                        <StatusBadge status={user.user_approval?.status} />
                      </TableCell>
                      <TableCell>
                        {formatDate(user.user_approval?.ebm_approved_at)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="sm"
                          color={user.is_active ? "success" : "default"}
                          variant="dot"
                        >
                          {user.is_active ? "Active" : "Inactive"}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Tooltip
                            content="View Details"
                            className="bg-black dark:bg-white text-white dark:text-black backdrop-blur-lg border"
                          >
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              onPress={() => handleViewDetails(user)}
                            >
                              <Eye size={18} className="text-blue-500" />
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

      {/* 3. Pagination Control */}
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

      {/* Modal for viewing user details */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        size="3xl"
        scrollBehavior="inside"
        classNames={{
          header: "border-b border-gray-100 dark:border-white/5",
          body: "py-3",
          footer: "border-t border-gray-100 dark:border-white/5",
          backdrop: "bg-white/80 dark:bg-black/80 z-[99]", // dark, no blur
          base: "bg-transparent border border-white/10 shadow-2xl rounded-2xl z-[10001]",
          wrapper: "z-[10000]",
        }}
        className="bg-white dark:bg-white/1 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl mt-22 z-20"
        hideCloseButton
        motionProps={{
          variants: {
            enter: {
              scale: 1,
              opacity: 1,
              transition: { duration: 0.22, ease: "easeOut" },
            },
            exit: {
              scale: 0.96,
              opacity: 0,
              transition: { duration: 0.18, ease: "easeIn" },
            },
          },
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-bold">Applicant Details</h2>
                <p className="text-xs text-gray-500 font-normal">
                  Review complete application information
                </p>
              </ModalHeader>
              <ModalBody>{renderModalContent()}</ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="flat"
                  onPress={onClose}
                  className="font-semibold"
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Add custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.5);
        }
      `}</style>
    </section>
  );
}

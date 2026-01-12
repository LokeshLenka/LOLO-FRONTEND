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
  Input,
  Card,
  CardBody,
} from "@heroui/react";
import {
  CheckCircle2,
  XCircle,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Music,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";

// --- Updated Types to match EXACT API Response ---
interface ProfileData {
  first_name: string;
  last_name: string;
  reg_num: string;
  branch: string;
  year: string;
  gender: string;
  sub_role: string;
}

interface PendingUser {
  uuid: string;
  username: string | null;
  role: "music" | "management";
  is_approved: boolean;
  is_active: number;
  music_profile: ProfileData | null;
  management_profile: ProfileData | null;
  user_approval: {
    ebm_assigned_at: string;
    status: string;
  };
  created_at: string;
}

interface ApiResponseData {
  current_page: number;
  data: PendingUser[];
  first_page_url: string;
  from: number;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
}

export default function EBMPendingApprovals() {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [currentPageData, setCurrentPageData] =
    useState<ApiResponseData | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchApprovals = useCallback(
    async (url?: string) => {
      setLoading(true);
      try {
        const endpoint = url || `${API_BASE_URL}/ebm/pending-approvals`;

        const response = await axios.get<any>(endpoint);

        // Extract from response.data.data (Laravel paginator structure)
        const paginatorData = response.data.data as ApiResponseData;

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
          err.response?.data?.message || "Failed to load pending approvals"
        );
        setUsers([]);
        setCurrentPageData(null);
      } finally {
        setLoading(false);
      }
    },
    [API_BASE_URL]
  );

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  const handleAction = async (uuid: string, action: "approve" | "reject") => {
    setProcessingId(uuid);
    const toastId = toast.loading(
      `${action === "approve" ? "Approving" : "Rejecting"} user...`
    );

    try {
      await axios.post(`${API_BASE_URL}/ebm/${action}-user/${uuid}`);
      toast.success(`User ${action}d successfully!`, { id: toastId });

      // Refresh current page after action
      if (currentPageData) {
        fetchApprovals(
          currentPageData.path + `?page=${currentPageData.current_page}`
        );
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || `Failed to ${action} user`, {
        id: toastId,
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getUserDisplayData = (user: PendingUser) => {
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
    const branchYear = `${branch} • ${year}`;
    const subRole = profile?.sub_role || user.role;

    return { fullName, regNum, branchYear, subRole };
  };

  const pageData = currentPageData;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">
            Pending Approvals ({users.length})
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Review new member registration requests assigned to you (Page{" "}
            {pageData?.current_page || 1})
          </p>
        </div>
      </div>

      {/* Table Card */}
      <Card className="border border-gray-200 dark:border-white/5 shadow-none">
        <CardBody className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
              <Loader2 className="animate-spin text-[#03a1b0]" size={32} />
              <p className="text-gray-500 text-sm">
                Loading pending requests...
              </p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center p-20">
              <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                No Pending Approvals
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                All requests have been processed.
              </p>
            </div>
          ) : (
            <Table
              aria-label="Pending Approvals"
              classNames={{ wrapper: "min-h-[400px]" }}
            >
              <TableHeader>
                <TableColumn>APPLICANT</TableColumn>
                <TableColumn>ROLE</TableColumn>
                <TableColumn>ACADEMIC INFO</TableColumn>
                <TableColumn>ASSIGNED</TableColumn>
                <TableColumn className="text-center">ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const { fullName, regNum, branchYear, subRole } =
                    getUserDisplayData(user);

                  return (
                    <TableRow
                      key={user.uuid}
                      className="hover:bg-gray-50 dark:hover:bg-white/5"
                    >
                      <TableCell>
                        <User
                          name={fullName}
                          description={regNum}
                          avatarProps={{
                            radius: "lg",
                            src: undefined,
                            fallback:
                              user.role === "music" ? (
                                <Music className="w-4 h-4" />
                              ) : (
                                <Briefcase className="w-4 h-4" />
                              ),
                            className:
                              user.role === "music"
                                ? "bg-purple-100 text-purple-600"
                                : "bg-blue-100 text-blue-600",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 min-w-[120px]">
                          <Chip
                            size="sm"
                            color={
                              user.role === "music" ? "secondary" : "primary"
                            }
                            variant="flat"
                            className="w-fit capitalize font-medium"
                          >
                            {user.role}
                          </Chip>
                          <span className="text-xs text-gray-500 capitalize">
                            {subRole
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {branchYear}
                          </span>
                          <span className="text-xs text-gray-500">
                            Reg: {regNum}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600 dark:text-gray-400 block">
                          {new Date(
                            user.user_approval.ebm_assigned_at
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Tooltip content="Approve Member" color="success">
                            <Button
                              isIconOnly
                              size="sm"
                              color="success"
                              variant="flat"
                              isLoading={processingId === user.uuid}
                              onPress={() => handleAction(user.uuid, "approve")}
                              className="w-9 h-9"
                            >
                              <CheckCircle2 size={18} />
                            </Button>
                          </Tooltip>
                          <Tooltip content="Reject Application" color="danger">
                            <Button
                              isIconOnly
                              size="sm"
                              color="danger"
                              variant="flat"
                              isLoading={processingId === user.uuid}
                              onPress={() => handleAction(user.uuid, "reject")}
                              className="w-9 h-9"
                            >
                              <XCircle size={18} />
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

      {/* Fixed Pagination */}
      {pageData && users.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-[#18181b] p-4 rounded-xl border border-gray-200 dark:border-white/5">
          <span className="text-sm text-gray-500">
            Showing {pageData.from} to {pageData.to} of{" "}
            {pageData.per_page * pageData.current_page} records
          </span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="flat"
              isDisabled={!pageData.prev_page_url}
              onPress={() =>
                pageData.prev_page_url && fetchApprovals(pageData.prev_page_url)
              }
              startContent={<ChevronLeft size={16} />}
            >
              Previous
            </Button>
            <span className="text-sm font-medium px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-md">
              Page {pageData.current_page}
            </span>
            <Button
              size="sm"
              variant="flat"
              isDisabled={!pageData.next_page_url}
              onPress={() =>
                pageData.next_page_url && fetchApprovals(pageData.next_page_url)
              }
              endContent={<ChevronRight size={16} />}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

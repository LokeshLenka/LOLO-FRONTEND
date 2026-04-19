import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApprovals } from "@/hooks/useApprovals";
import { Clock, Eye, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TablePagination } from "../../../components/pagination/TablePagination";
import { ViewUserSheet } from "../../../components/ui/shared/users/ViewUserSheet";

type TabType = "pending" | "rejected";

export default function PendingApprovals() {
  const { users, meta, isLoading, isError, setPage, approveUser, rejectUser } =
    useApprovals("pending-approvals");

  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [viewUserUuid, setViewUserUuid] = useState<string | null>(null);
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);

  // Filter users based on EBM rejection status
  const { normalPendingUsers, ebmRejectedUsers } = useMemo(() => {
    const normal: typeof users = [];
    const rejected: typeof users = [];

    users.forEach((user) => {
      const status = user.user_approval?.status || "";
      if (status.includes("rejected")) {
        rejected.push(user);
      } else {
        normal.push(user);
      }
    });

    return { normalPendingUsers: normal, ebmRejectedUsers: rejected };
  }, [users]);

  // Determine which list to show based on the active tab
  const displayedUsers =
    activeTab === "pending" ? normalPendingUsers : ebmRejectedUsers;

  const activeMeta = meta
    ? {
        ...meta,
        total: displayedUsers.length,
        from: displayedUsers.length > 0 ? 1 : 0,
        to: displayedUsers.length > 0 ? displayedUsers.length : 0,
        // Note: Since we are fetching all pending users at once and splitting them
        // locally into tabs, we force last_page to 1 to prevent NaN errors
        last_page:
          Math.ceil(displayedUsers.length / (meta.per_page || 15)) || 1,
      }
    : null;

  const handleViewClick = (uuid: string) => {
    setViewUserUuid(uuid);
    setIsViewSheetOpen(true);
  };

  const handleApprove = async (uuid: string, remarks: string) => {
    const success = await approveUser(uuid, remarks);
    if (success) {
      toast.success("Application approved successfully.");
      return true;
    }
    toast.error("Failed to approve application.");
    return false;
  };

  const handleReject = async (uuid: string, remarks: string) => {
    const success = await rejectUser(uuid, remarks);
    if (success) {
      toast.success("Application rejected successfully.");
      return true;
    }
    toast.error("Failed to reject application.");
    return false;
  };

  const tabs = [
    {
      id: "pending",
      label: "Awaiting Review",
      count: normalPendingUsers.length,
    },
    {
      id: "rejected",
      label: "EBM Rejected",
      count: ebmRejectedUsers.length,
    },
  ];

  return (
    <motion.div
      className="space-y-6 px-4 py-6 pb-16"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Pending Approvals
        </h1>
        <p className="text-sm mt-1 text-zinc-500 dark:text-zinc-400">
          Review and process new member registrations assigned to you.
        </p>
      </div>

      {/* Custom Animated Tabs */}
      <div className="flex items-center gap-6 border-b border-zinc-200 dark:border-zinc-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as TabType);
              setPage(1); // Reset pagination on tab change
            }}
            className={cn(
              "relative pb-3 text-sm font-medium transition-colors hover:text-zinc-900 dark:hover:text-zinc-100",
              activeTab === tab.id
                ? "text-zinc-900 dark:text-zinc-50"
                : "text-zinc-500",
            )}
          >
            <div className="flex items-center gap-2">
              {tab.label}
              <span
                className={cn(
                  "flex h-5 items-center justify-center rounded-full px-2 text-[11px] font-semibold transition-colors",
                  activeTab === tab.id
                    ? tab.id === "rejected"
                      ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                      : "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
                    : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
                )}
              >
                {tab.count}
              </span>
            </div>

            {/* Framer Motion Animated Underline */}
            {activeTab === tab.id && (
              <motion.div
                layoutId="active-tab-indicator"
                className={cn(
                  "absolute bottom-0 left-0 right-0 h-0.5",
                  tab.id === "rejected"
                    ? "bg-red-500"
                    : "bg-zinc-900 dark:bg-zinc-50",
                )}
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      <Card className="rounded-none shadow-none border-zinc-200 dark:border-zinc-800 bg-background overflow-hidden -py-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50">
              <TableRow className="border-zinc-200 dark:border-zinc-800 hover:bg-transparent">
                <TableHead className="w-[250px] text-zinc-900 dark:text-zinc-100">
                  Member
                </TableHead>
                <TableHead className="text-zinc-900 dark:text-zinc-100">
                  Academic
                </TableHead>
                <TableHead className="text-zinc-900 dark:text-zinc-100">
                  Role
                </TableHead>
                <TableHead className="text-zinc-900 dark:text-zinc-100">
                  Status
                </TableHead>
                <TableHead className="text-right text-zinc-900 dark:text-zinc-100">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading && users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-zinc-500"
                  >
                    Loading requests...
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-red-500"
                  >
                    Failed to load requests.
                  </TableCell>
                </TableRow>
              ) : displayedUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-zinc-500"
                  >
                    {activeTab === "pending"
                      ? "No standard applications awaiting review."
                      : "No EBM-rejected applications to review."}
                  </TableCell>
                </TableRow>
              ) : (
                <AnimatePresence mode="popLayout">
                  {displayedUsers.map((user) => {
                    const profile =
                      user.profile ||
                      user.musicProfile ||
                      user.managementProfile;

                    const approvalStatus = user.user_approval?.status || "";
                    const isEbmRejected = approvalStatus.includes("rejected");

                    return (
                      <motion.tr
                        key={user.uuid}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="border-b border-zinc-200 dark:border-zinc-800"
                      >
                        <TableCell className="font-medium align-middle">
                          <div className="flex flex-col">
                            <span className="text-zinc-950 dark:text-zinc-50">
                              {profile
                                ? `${profile.first_name || ""} ${
                                    profile.last_name || ""
                                  }`.trim()
                                : "Unknown User"}
                            </span>
                            <span className="text-xs text-zinc-500 font-normal">
                              {profile?.reg_num || user.username}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="align-middle">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium uppercase text-zinc-700 dark:text-zinc-300">
                              {profile?.branch || "N/A"}
                            </span>
                            <span className="text-xs text-zinc-500 capitalize">
                              {profile?.year ? `${profile.year} Year` : "N/A"}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="align-middle">
                          <span className="capitalize text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {user.role}
                          </span>
                          <div className="text-[10px] text-zinc-500 capitalize tracking-wide mt-0.5">
                            {profile?.sub_role?.replace(/_/g, " ") ||
                              "No Sub-Role"}
                          </div>
                        </TableCell>

                        <TableCell className="align-middle">
                          {isEbmRejected ? (
                            <div className="flex items-center text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-sm w-fit">
                              <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
                              <span className="text-[11px] font-semibold uppercase tracking-wider">
                                EBM Rejected
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center text-amber-600 dark:text-amber-500">
                              <Clock className="h-4 w-4 mr-1.5" />
                              <span className="text-xs font-semibold uppercase tracking-wider">
                                Awaiting Review
                              </span>
                            </div>
                          )}
                        </TableCell>

                        <TableCell className="text-right align-middle">
                          <Button
                            onClick={() => handleViewClick(user.uuid)}
                            size="sm"
                            className="rounded-none bg-zinc-900 hover:bg-zinc-800 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Review
                          </Button>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              )}
            </TableBody>
          </Table>
        </div>

        <TablePagination meta={activeMeta} onPageChange={setPage} />
      </Card>

      <ViewUserSheet
        userUuid={viewUserUuid}
        isOpen={isViewSheetOpen}
        onClose={() => setIsViewSheetOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </motion.div>
  );
}

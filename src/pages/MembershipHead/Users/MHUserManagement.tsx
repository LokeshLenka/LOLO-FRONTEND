// src/pages/membership-head/UserManagement.tsx
import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { type UserFilters as FilterType } from "@/hooks/useUsers";
import { useUsers, type User } from "@/hooks/useUsers";
import { useAuth } from "@/context/AuthContext";
import { XCircle, UserCheck } from "lucide-react";
import {
  MoreHorizontal,
  ShieldAlert,
  ShieldCheck,
  ShieldMinus,
  CheckCircle2,
  Clock,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

// Import Alert Dialog Components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { User as UserIcon } from "lucide-react"; // Renamed to avoid clashing with your User type

import { TablePagination } from "../../../components/pagination/TablePagination";
import { ViewUserSheet } from "@/components/ui/shared/users/ViewUserSheet";
import { EditUserSheet } from "@/components/ui/shared/users/EditUserSheet";
import { UserStatsCards } from "@/components/ui/shared/users/UserStatsCards";
import { UserFilters } from "@/components/ui/shared/users/UserFilters";
import { ExportMenu } from "@/components/ui/shared/users/ExportMenu";

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// Define types for the action we are confirming
type ActionType = "promote-ebm" | "promote-credit-manager" | "demote" | null;

export default function MHUserManagement() {
  const {user: currentUser } = useAuth();

  // Place this right next to your isEditSheetOpen states
  const [viewUserUuid, setViewUserUuid] = useState<string | null>(null);
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);

  const handleViewClick = (uuid: string) => {
    setViewUserUuid(uuid);
    setIsViewSheetOpen(true);
  };

  // Replace the old searchQuery string with an object
  const [filters, setFilters] = useState<FilterType>({});

  const {
    users,
    meta,
    isLoading,
    isError,
    page,
    setPage,
    promoteUser,
    demoteUser,
    updateUser,
    deleteUser,
    approveUser,
    rejectUser,
  } = useUsers(1, filters);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

  // States for Alert Dialog Confirmation
  const [actionUser, setActionUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<ActionType>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const getProfileName = (user: User) => {
    const profile = user.profile;
    if (profile && profile.first_name) {
      return `${profile.first_name} ${profile.last_name || ""}`.trim();
    }
    return user.username;
  };

  const getRoleBadge = (promotedRole: string | null, baseRole: string) => {
    if (promotedRole === "executive_body_member") {
      return (
        <Badge
          variant="outline"
          className="rounded-none bg-zinc-900 text-zinc-50 border-transparent"
        >
          EBM
        </Badge>
      );
    }
    if (promotedRole === "credit_manager") {
      return (
        <Badge
          variant="outline"
          className="rounded-none bg-zinc-700 text-zinc-50 border-transparent"
        >
          Credit Mgr
        </Badge>
      );
    }
    if (promotedRole === "membership_head") {
      return (
        <Badge
          variant="outline"
          className="rounded-none bg-zinc-700 text-zinc-50 border-transparent"
        >
          Mem Head
        </Badge>
      );
    }
    return (
      <Badge
        variant="outline"
        className="rounded-none text-zinc-500 border-zinc-200 capitalize"
      >
        {baseRole}
      </Badge>
    );
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsEditSheetOpen(true);
  };

  // Triggers the confirmation dialog instead of executing the action immediately
  const confirmAction = (user: User, type: ActionType) => {
    setActionUser(user);
    setActionType(type);
    setIsAlertOpen(true);
  };

  // Executes the confirmed action
  const executeAction = async () => {
    if (!actionUser || !actionType) return;

    if (actionType === "promote-ebm") {
      await promoteUser(actionUser.uuid, "ebm");
    } else if (actionType === "promote-credit-manager") {
      await promoteUser(actionUser.uuid, "credit-manager");
    } else if (actionType === "demote") {
      await demoteUser(actionUser.uuid);
    }

    setIsAlertOpen(false);
    setActionUser(null);
    setActionType(null);
  };

  // Add this helper function outside or inside your component
  const renderApprovalStatus = (status: string | undefined | null) => {
    if (!status) {
      return (
        <div className="flex items-center text-zinc-500 dark:text-zinc-400">
          <span className="text-[11px] font-semibold uppercase tracking-wider">
            Unassigned
          </span>
        </div>
      );
    }

    switch (status) {
      case "pending":
        return (
          <div className="flex items-center text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-sm w-fit">
            <Clock className="h-3.5 w-3.5 mr-1.5" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Pending Review
            </span>
          </div>
        );
      case "ebm_approved":
        return (
          <div className="flex items-center text-blue-600 dark:text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-sm w-fit">
            <UserCheck className="h-3.5 w-3.5 mr-1.5" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              EBM Approved
            </span>
          </div>
        );
      case "membership_approved":
        return (
          <div className="flex items-center text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-sm w-fit">
            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Mem. Head Approved
            </span>
          </div>
        );
      case "admin_approved":
        return (
          <div className="flex items-center text-purple-600 dark:text-purple-500 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-sm w-fit">
            <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Admin Approved
            </span>
          </div>
        );
      case "rejected":
      case "ebm_rejected": // Kept for safety if ebm_rejected is still floating in your DB
        return (
          <div className="flex items-center text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-sm w-fit">
            <XCircle className="h-3.5 w-3.5 mr-1.5" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              Rejected
            </span>
          </div>
        );
      default:
        return (
          <div className="flex items-center text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-sm w-fit">
            <span className="text-[11px] font-semibold uppercase tracking-wider">
              {status.replace(/_/g, " ")}
            </span>
          </div>
        );
    }
  };

  return (
    <motion.div
      className="space-y-6 px-4 py-6 pb-16"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          User Management & Promotions
        </h1>
        <p className="text-sm mt-1 text-zinc-500 dark:text-zinc-400">
          Assign elevated roles to active, approved members.
        </p>
      </div>
      <UserStatsCards />

      <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4">
        {/* The New Filter Component */}
        <UserFilters
          filters={filters}
          setFilters={setFilters}
          onResetPage={() => setPage(1)}
        />
        <ExportMenu users={users} disabled={isLoading || users.length === 0} />
      </div>

      <Card className="rounded-none shadow-none border-zinc-200 dark:border-zinc-800 bg-background overflow-hidden -py-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50">
              <TableRow className="border-zinc-200 dark:border-zinc-800 hover:bg-transparent">
                <TableHead className="w-[50px] text-zinc-900 dark:text-zinc-100">
                  #
                </TableHead>
                <TableHead className="w-[200px] text-zinc-900 dark:text-zinc-100">
                  Member
                </TableHead>
                <TableHead className="text-zinc-900 dark:text-zinc-100">
                  Username
                </TableHead>
                <TableHead className="text-zinc-900 dark:text-zinc-100">
                  Academic
                </TableHead>
                <TableHead className="text-zinc-900 dark:text-zinc-100">
                  Contact
                </TableHead>
                <TableHead className="text-zinc-900 dark:text-zinc-100">
                  Role
                </TableHead>
                <TableHead className="text-zinc-900 dark:text-zinc-100">
                  Status
                </TableHead>
                <TableHead className="text-right text-zinc-900 dark:text-zinc-100">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-24 text-center text-zinc-500"
                  >
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-24 text-center text-zinc-500"
                  >
                    Failed to load users.
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-24 text-center text-zinc-500"
                  >
                    No users found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user, index) => (
                  <TableRow
                    key={user.uuid}
                    className="border-zinc-200 dark:border-zinc-800"
                  >
                    <TableCell className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      {/* If your API returns 'from' in meta (like Laravel), you can also use: meta?.from ? meta.from + index : ... */}
                      {(page - 1) * (meta?.per_page || 10) + index + 1}
                    </TableCell>

                    {/* 1. Member Column (Name + Reg Num) */}
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="text-zinc-950 dark:text-zinc-50">
                          {getProfileName(user)}
                        </span>
                        <span className="text-xs text-zinc-500 font-normal">
                          {user.profile?.reg_num || user.username}
                        </span>
                      </div>
                    </TableCell>

                    {/* 2. Username Column */}
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium uppercase text-zinc-700 dark:text-zinc-300">
                          {user.username ? `${user.username}` : "N/A"}
                        </span>
                      </div>
                    </TableCell>

                    {/* 3. Academic Column (Branch + Year) */}
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium uppercase text-zinc-700 dark:text-zinc-300">
                          {user.profile?.branch || "N/A"}
                        </span>
                        <span className="text-xs text-zinc-500 capitalize">
                          {user.profile?.year
                            ? `${user.profile.year} Year`
                            : "N/A"}
                        </span>
                      </div>
                    </TableCell>

                    {/* 4. Contact Column */}
                    <TableCell>
                      <div className="flex flex-col">
                        <span
                          className="text-sm text-zinc-700 dark:text-zinc-300 truncate max-w-[150px]"
                          title={user.email}
                        >
                          {user.email}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {user.profile?.phone_no || "N/A"}
                        </span>
                      </div>
                    </TableCell>

                    {/* 5. Role Column (Badge + Sub Role) */}
                    <TableCell>
                      <div className="flex flex-col items-start gap-1">
                        {getRoleBadge(user.promoted_role, user.role)}
                        {user.profile?.sub_role && (
                          <span className="text-[10px] text-zinc-500 capitalize tracking-wide">
                            {user.profile.sub_role.replace(/_/g, " ")}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* 6. Status Column (Approved / Pending) */}
                    <TableCell className="align-middle">
                      {renderApprovalStatus(user.user_approval?.status || " ")}
                    </TableCell>

                    {/* 7. Actions Column */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 rounded-none hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4 text-zinc-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-52 rounded-none border-zinc-200 dark:border-zinc-800"
                        >
                          {/* --- Section 1: Profile Actions --- */}
                          <DropdownMenuLabel className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                            Profile Actions
                          </DropdownMenuLabel>
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                              onClick={() => handleViewClick(user.uuid)}
                              className="rounded-none cursor-pointer focus:bg-zinc-100 dark:focus:bg-zinc-800"
                            >
                              <UserIcon className="mr-2 h-4 w-4 text-zinc-500" />
                              <span>View Full Profile</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              disabled={
                                user.uuid === currentUser?.uuid ||
                                user.username === currentUser?.username
                              }
                              onClick={() => handleEditClick(user)}
                              className="rounded-none cursor-pointer focus:bg-zinc-100 dark:focus:bg-zinc-800"
                            >
                              <MoreHorizontal className="mr-2 h-4 w-4 text-zinc-500" />
                              <span>Edit Profile</span>
                            </DropdownMenuItem>
                          </DropdownMenuGroup>

                          <DropdownMenuSeparator className="bg-zinc-200 dark:bg-zinc-800 my-1" />

                          {/* --- Section 2: Role Management --- */}
                          <DropdownMenuLabel className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                            Role Management
                          </DropdownMenuLabel>
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                              disabled={
                                user.is_active === false ||
                                user.is_approved === false ||
                                user.management_level === "promoted" ||
                                user.promoted_role ===
                                  "executive_body_member" ||
                                user.uuid === currentUser?.uuid ||
                                user.username === currentUser?.username
                              }
                              onClick={() => confirmAction(user, "promote-ebm")}
                              className="rounded-none cursor-pointer focus:bg-zinc-100 dark:focus:bg-zinc-800"
                            >
                              <ShieldAlert className="mr-2 h-4 w-4 text-zinc-700 dark:text-zinc-300" />
                              <span>Promote to EBM</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              disabled={
                                user.is_active === false ||
                                user.is_approved === false ||
                                user.management_level === "promoted" ||
                                user.promoted_role === "credit_manager" ||
                                user.uuid === currentUser?.uuid ||
                                user.username === currentUser?.username
                              }
                              onClick={() =>
                                confirmAction(user, "promote-credit-manager")
                              }
                              className="rounded-none cursor-pointer focus:bg-zinc-100 dark:focus:bg-zinc-800"
                            >
                              <ShieldCheck className="mr-2 h-4 w-4 text-zinc-700 dark:text-zinc-300" />
                              <span>Promote to Credit Mgr</span>
                            </DropdownMenuItem>
                          </DropdownMenuGroup>

                          <DropdownMenuSeparator className="bg-zinc-200 dark:bg-zinc-800 my-1" />

                          {/* --- Section 3: Destructive Actions --- */}
                          <DropdownMenuItem
                            disabled={
                              !user.promoted_role ||
                              user.uuid === currentUser?.uuid ||
                              user.username === currentUser?.username
                            }
                            onClick={() => confirmAction(user, "demote")}
                            className="rounded-none cursor-pointer text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/20 focus:text-red-700 dark:focus:text-red-300"
                          >
                            <ShieldMinus className="mr-2 h-4 w-4" />
                            <span>Revoke Promotion</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination meta={meta} onPageChange={setPage} />
      </Card>

      {/* Global Alert Dialog for Role Confirmations */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent className="rounded-none border-zinc-200 dark:border-zinc-800 bg-background">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-zinc-950 dark:text-zinc-50">
              {actionType === "demote"
                ? "Revoke Promotion"
                : "Confirm Promotion"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-500">
              {actionType === "demote" ? (
                <>
                  Are you sure you want to revoke the promotion for{" "}
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {actionUser?.username}
                  </span>
                  ? They will be returned to the base role.
                </>
              ) : (
                <>
                  Are you sure you want to promote{" "}
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {actionUser?.username}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {actionType === "promote-ebm"
                      ? "Executive Body Member"
                      : "Credit Manager"}
                  </span>
                  ?
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsAlertOpen(false);
                setActionUser(null);
                setActionType(null);
              }}
              className="rounded-none border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={executeAction}
              className={`rounded-none ${
                actionType === "demote"
                  ? "bg-red-600 text-white hover:bg-red-700 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800"
                  : "bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              }`}
            >
              {actionType === "demote" ? "Revoke Role" : "Confirm Promotion"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditUserSheet
        user={selectedUser}
        isOpen={isEditSheetOpen}
        onClose={() => setIsEditSheetOpen(false)}
        onUpdate={updateUser}
        onDelete={deleteUser}
        onApprove={approveUser}
        onReject={rejectUser}
      />

      <ViewUserSheet
        userUuid={viewUserUuid}
        isOpen={isViewSheetOpen}
        onClose={() => setIsViewSheetOpen(false)}
        onApprove={approveUser}
        onReject={rejectUser}
      />
    </motion.div>
  );
}

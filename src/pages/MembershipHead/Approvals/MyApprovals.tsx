// src/pages/approvals/MyApprovals.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useApprovals } from "@/hooks/useApprovals";
import { CheckCircle2, XCircle, Eye } from "lucide-react";
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
import { TablePagination } from "../../../components/pagination/TablePagination";
import { ViewUserSheet } from "../../../components/ui/shared/users/ViewUserSheet";

export default function MyApprovals() {
  // Fetch historical approvals using the hook we created earlier
  const { users, meta, isLoading, isError, setPage } =
    useApprovals("my-approvals");

  const [viewUserUuid, setViewUserUuid] = useState<string | null>(null);
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false);
  
  // Handle Laravel returning `null` or undefined paginator values
  const safeMeta = meta
    ? {
        ...meta,
        from: meta.from ? Number(meta.from) : 0,
        to: meta.to ? Number(meta.to) : 0,
        total: meta.total ? Number(meta.total) : 0,
        // Safely parse current and last page, defaulting to 1
        current_page: meta.current_page ? Number(meta.current_page) : 1,
        last_page: meta.last_page ? Number(meta.last_page) : 1,
      }
    : null;

  const handleViewClick = (uuid: string) => {
    setViewUserUuid(uuid);
    setIsViewSheetOpen(true);
  };

  return (
    <motion.div
      className="space-y-6 px-4 py-6 pb-16"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Approval History
        </h1>
        <p className="text-sm mt-1 text-zinc-500 dark:text-zinc-400">
          A historical log of all member registrations you have approved or
          rejected.
        </p>
      </div>

      <Card className="rounded-none shadow-none border-zinc-200 dark:border-zinc-800 bg-background overflow-hidden -py-6">
        <div className="overflow-x-auto">
          <Table>
            {/* Neutral Table Header */}
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
                  Decision
                </TableHead>
                <TableHead className="text-right text-zinc-900 dark:text-zinc-100">
                  Details
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
                    Loading history...
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-red-500"
                  >
                    Failed to load history.
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-zinc-500"
                  >
                    You haven't reviewed any applications yet.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => {
                  // Safely extract the profile as a fallback, though the backend Resource update guarantees user.profile
                  const profile =
                    user.profile || user.musicProfile || user.managementProfile;

                  // Determine decision status
                  const statusString = user.user_approval?.status || "";
                  const isRejected = statusString.includes("reject");

                  return (
                    <TableRow
                      key={user.uuid}
                      className="border-zinc-200 dark:border-zinc-800"
                    >
                      {/* 1. Member Column */}
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span className="text-zinc-950 dark:text-zinc-50">
                            {profile
                              ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
                              : "Unknown User"}
                          </span>
                          <span className="text-xs text-zinc-500 font-normal">
                            {profile?.reg_num || user.username}
                          </span>
                        </div>
                      </TableCell>

                      {/* 2. Academic Column */}
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium uppercase text-zinc-700 dark:text-zinc-300">
                            {profile?.branch || "N/A"}
                          </span>
                          <span className="text-xs text-zinc-500 capitalize">
                            {profile?.year ? `${profile.year} Year` : "N/A"}
                          </span>
                        </div>
                      </TableCell>

                      {/* 3. Role Column */}
                      <TableCell>
                        <span className="capitalize text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {user.role}
                        </span>
                        <div className="text-[10px] text-zinc-500 capitalize tracking-wide mt-0.5">
                          {profile?.sub_role?.replace(/_/g, " ") ||
                            "No Sub-Role"}
                        </div>
                      </TableCell>

                      {/* 4. Decision Column */}
                      <TableCell>
                        {isRejected ? (
                          <div className="flex items-center text-red-600 dark:text-red-500">
                            <XCircle className="h-4 w-4 mr-1.5" />
                            <span className="text-xs font-semibold uppercase tracking-wider">
                              Rejected
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center text-emerald-600 dark:text-emerald-500">
                            <CheckCircle2 className="h-4 w-4 mr-1.5" />
                            <span className="text-xs font-semibold uppercase tracking-wider">
                              Approved
                            </span>
                          </div>
                        )}
                      </TableCell>

                      {/* 5. Actions Column */}
                      <TableCell className="text-right">
                        <Button
                          onClick={() => handleViewClick(user.uuid)}
                          variant="ghost"
                          size="sm"
                          className="rounded-none hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                        >
                          <Eye className="h-4 w-4 mr-2" /> View Profile
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Component */}
        <TablePagination meta={safeMeta} onPageChange={setPage} />
      </Card>

      {/* View User Sheet - Mutations are disabled since this is a read-only history page */}
      <ViewUserSheet
        userUuid={viewUserUuid}
        isOpen={isViewSheetOpen}
        onClose={() => setIsViewSheetOpen(false)}
        onApprove={async () => false}
        onReject={async () => false}
      />
    </motion.div>
  );
}

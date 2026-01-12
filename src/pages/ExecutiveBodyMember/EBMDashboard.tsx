import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Plus,
  UserPlus,
  Award,
  FileSpreadsheet,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardBody,
  Button,
  Tabs,
  Tab,
  Chip,
  Skeleton,
} from "@heroui/react";

// Components
import { StatsOverview } from "../../components/ebm/StatsOverview";
import UserApprovalTable from "@/components/ebm/UserApprovalTable";

// Hooks & Context
import { useEBMDashboard } from "../../hooks/useEBMDashboard";
import { useAuth } from "@/context/AuthContext";
import CreateUserModal from "@/components/ebm/CreateUserModal";

export default function EBMDashboard() {
  const { user, getPromotedRoleLabel } = useAuth();
  const { stats, loading, refreshStats } = useEBMDashboard();

  // State for Tabs & Modals
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "actions";
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);

  const handleTabChange = (key: React.Key) => {
    setSearchParams({ tab: key.toString() });
  };

  // --- Loading Skeleton ---
  if (loading || !stats) {
    return (
      <div className="space-y-6 p-4">
        <div className="flex justify-between">
          <Skeleton className="rounded-lg w-1/3 h-12" />
          <Skeleton className="rounded-lg w-32 h-12" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="rounded-xl h-32" />
          ))}
        </div>
        <Skeleton className="rounded-xl h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 max-w-7xl mx-auto">
      {/* --- 1. Header Section --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white">
              Executive Dashboard
            </h1>
            <Button isIconOnly size="sm" variant="light" onClick={refreshStats}>
              <RefreshCw size={16} />
            </Button>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Welcome back, {user?.name}. Here is what's happening in your club.
          </p>
        </div>
        <Chip
          startContent={<Award size={16} />}
          variant="shadow"
          className="bg-purple-500/20 border border-purple-500/40 text-purple-600 dark:text-purple-400 font-bold px-4 py-6"
        >
          {getPromotedRoleLabel()}
        </Chip>
      </div>

      {/* --- 2. Stats & Charts --- */}
      <StatsOverview data={stats} />

      {/* --- 3. Main Operational Tabs --- */}
      <Card className="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/5 shadow-sm min-h-[500px]">
        <CardBody className="p-0">
          <Tabs
            aria-label="EBM Dashboard Sections"
            variant="underlined"
            selectedKey={activeTab}
            onSelectionChange={handleTabChange}
            classNames={{
              tabList:
                "gap-6 w-full relative rounded-none p-0 border-b border-divider px-6 pt-4",
              cursor: "w-full bg-[#03a1b0]",
              tab: "max-w-fit px-0 h-12",
              tabContent:
                "group-data-[selected=true]:text-[#03a1b0] font-bold text-base",
            }}
          >
            {/* --- TAB: QUICK ACTIONS --- */}
            <Tab key="actions" title="Quick Actions">
              <div className="p-8">
                <h3 className="text-lg font-bold mb-6 text-gray-800 dark:text-gray-200">
                  Management Tools
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Action Card: Create Event */}
                  <button className="flex flex-col items-center justify-center p-8 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-white/5 hover:bg-white hover:shadow-lg dark:hover:bg-white/10 transition-all group text-center">
                    <div className="p-4 bg-blue-500/10 text-blue-600 rounded-full mb-4 group-hover:scale-110 transition-transform">
                      <Plus size={32} />
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      Create Event
                    </h4>
                    <p className="text-sm text-gray-500 mt-2">
                      Draft and publish new club events
                    </p>
                  </button>

                  {/* Action Card: Register User */}
                  <button
                    onClick={() => setIsCreateUserOpen(true)}
                    className="flex flex-col items-center justify-center p-8 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-white/5 hover:bg-white hover:shadow-lg dark:hover:bg-white/10 transition-all group text-center"
                  >
                    <div className="p-4 bg-pink-500/10 text-pink-600 rounded-full mb-4 group-hover:scale-110 transition-transform">
                      <UserPlus size={32} />
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      Register Member
                    </h4>
                    <p className="text-sm text-gray-500 mt-2">
                      Onboard new users manually
                    </p>
                  </button>

                  {/* Action Card: Reports (Placeholder) */}
                  <button className="flex flex-col items-center justify-center p-8 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-white/5 hover:bg-white hover:shadow-lg dark:hover:bg-white/10 transition-all group text-center">
                    <div className="p-4 bg-orange-500/10 text-orange-600 rounded-full mb-4 group-hover:scale-110 transition-transform">
                      <FileSpreadsheet size={32} />
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      Generate Reports
                    </h4>
                    <p className="text-sm text-gray-500 mt-2">
                      Download monthly activity logs
                    </p>
                  </button>
                </div>
              </div>
            </Tab>

            {/* --- TAB: APPROVALS --- */}
            <Tab
              key="approvals"
              title={
                <div className="flex items-center gap-2">
                  <span>Approvals</span>
                  {stats.pending_approvals > 0 && (
                    <Chip
                      size="sm"
                      color="danger"
                      variant="solid"
                      className="h-5"
                    >
                      {stats.pending_approvals}
                    </Chip>
                  )}
                </div>
              }
            >
              {/* Uses the reusable component, passing a key to force re-render if needed */}
              <UserApprovalTable />
            </Tab>

            {/* --- TAB: EVENT REGISTRATIONS --- */}
            <Tab key="registrations" title="Event Data">
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-gray-100 dark:bg-white/5 p-6 rounded-full mb-4">
                  <FileSpreadsheet size={48} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Select an Event
                </h3>
                <p className="text-gray-500 max-w-sm mt-2">
                  Choose an event from your history to view attendee lists,
                  export data, and manage check-ins.
                </p>
                <Button
                  color="primary"
                  variant="flat"
                  className="mt-6 font-semibold"
                >
                  Browse My Events
                </Button>
              </div>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>

      {/* --- Modals --- */}
      <CreateUserModal
        isOpen={isCreateUserOpen}
        onClose={() => setIsCreateUserOpen(false)}
        onSuccess={() => {
          refreshStats(); // Refresh stats after adding a user
          setIsCreateUserOpen(false);
        }}
      />
    </div>
  );
}

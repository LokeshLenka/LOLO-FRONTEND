import { Award, RefreshCw } from "lucide-react";
import { Button, Chip, Skeleton } from "@heroui/react";

// Components
import { StatsOverview } from "../../components/ebm/StatsOverview";

// Hooks & Context
import { useEBMDashboard } from "../../hooks/useEBMDashboard";
import { useAuth } from "@/context/AuthContext";

export default function EBMDashboard() {
  const { user, getPromotedRoleLabel } = useAuth();
  const { stats, loading, refreshStats } = useEBMDashboard();

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
    </div>
  );
}

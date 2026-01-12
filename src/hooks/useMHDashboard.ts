import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import { type DashboardStats, type APIResponse } from "@/types/ebm";

export function useMHDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      // Calls: Route::get('dashboard', [EBMController::class, 'getDashboardStatistics']);
      const response = await axios.get<APIResponse<DashboardStats>>(
        `${API_BASE_URL}/membership-head/dashboard`
      );
      setStats(response.data.data);
      setError(null);
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      const msg =
        err.response?.data?.message || "Failed to load dashboard data";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refreshStats: fetchStats };
}

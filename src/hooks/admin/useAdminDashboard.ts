import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface AdminDashboardStats {
  total_active_users: number;
  total_in_active_users: number;
  total_approved_users: number;
  total_pending_approvals: number;
  total_promoted_users: number;
  total_management_users: number;
  total_music_users: number;
  total_event_organizers: number;
  total_event_planners: number;
  total_social_media_handlers: number;
  total_marketing_coordinators: number;
  total_video_editors: number;
  pending_approvals: number;
  total_approvals: number;
  approval_trend: { date: string; count: number }[];
  total_ebms: number;
  total_memberships: number;
  total_credit_managers: number;
}

function getHeaders() {
  const token = localStorage.getItem("authToken") || "";
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function useAdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/admin/dashboard`, {
        headers: getHeaders(),
      });
      const data = res.data?.data ?? res.data;
      setStats(data);
      setError(null);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.error || "Failed to load admin stats";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refresh: fetchStats };
}

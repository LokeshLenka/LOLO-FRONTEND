import useSWR from "swr";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITEAPIBASEURL;

function getToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("auth_token") ||
    localStorage.getItem("sanctum_token") ||
    ""
  );
}

function getHeaders() {
  const token = getToken();
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export interface CMDashboardStats {
  total_credits: number;
  credited_registrations: number;
  pending_assignments: number;
  active_events: number;
  total_management_members: number;
  total_music_members: number;
}

export interface CMEventCreditProgress {
  event_id: number;
  event_uuid: string;
  event_name: string;
  event_type: string;
  credits_awarded: number;
  total_eligible: number;
  credited_count: number;
  pending_count: number;
  management_eligible: number;
  management_credited: number;
  music_eligible: number;
  music_credited: number;
  progress_percentage: number;
  end_date: string;
}

export interface CMRecentActivity {
  id: number;
  type: "credit_assigned" | "credit_updated" | "credit_deleted" | "bulk_assign" | "bulk_update" | "bulk_delete";
  description: string;
  event_name: string;
  user_name?: string;
  amount?: number;
  created_at: string;
  performed_by: string;
}

export interface CMDashboardData {
  stats: CMDashboardStats;
  events_progress: CMEventCreditProgress[];
  recent_activity: CMRecentActivity[];
}

function normalizeDashboardResponse(raw: any): CMDashboardData {
  return raw?.data ?? {
    stats: {
      total_credits: 0,
      credited_registrations: 0,
      pending_assignments: 0,
      active_events: 0,
      total_management_members: 0,
      total_music_members: 0,
    },
    events_progress: [],
    recent_activity: [],
  };
}

const fetcher = async (url: string) => {
  const response = await axios.get(url, { headers: getHeaders() });
  return normalizeDashboardResponse(response.data);
};

export function useCMDashboard() {
  const { data, error, isLoading, mutate } = useSWR<CMDashboardData>(
    `${API_BASE_URL}/credit-manager/dashboard`,
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  return {
    dashboard: data,
    isLoading,
    isError: error,
    refresh: mutate,
  };
}
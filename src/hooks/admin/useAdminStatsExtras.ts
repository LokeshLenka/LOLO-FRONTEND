import useSWR from "swr";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
function getHeaders() {
  const token = localStorage.getItem("authToken") || "";
  return { Accept: "application/json", "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}
const fetcher = (url: string) => axios.get(url, { headers: getHeaders() }).then(r => r.data);

export function useAdminUsersStats() {
  const { data, error, isLoading, mutate } = useSWR(`${API_BASE_URL}/admin/users/view/stats`, fetcher, { keepPreviousData: true });
  return { stats: data?.data ?? data, isLoading, isError: !!error, refresh: mutate };
}
export function useAdminEvents() {
  const { data, error, isLoading } = useSWR(`${API_BASE_URL}/events`, fetcher);
  // public events endpoint returns paginated maybe
  const events = data?.data ?? data ?? [];
  return { events: Array.isArray(events) ? events : [], isLoading, isError: !!error };
}

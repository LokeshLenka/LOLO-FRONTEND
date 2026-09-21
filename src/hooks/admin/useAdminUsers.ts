import { useState, useCallback } from "react";
import useSWR, { mutate } from "swr";
import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function getHeaders() {
  const token = localStorage.getItem("authToken") || "";
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

const fetcher = (url: string) => axios.get(url, { headers: getHeaders() }).then((r) => r.data);

export interface AdminUserProfile {
  uuid: string;
  first_name: string;
  last_name: string;
  reg_num?: string;
  branch?: string;
  year?: string;
  gender?: string;
  phone_no?: string;
  sub_role?: string;
}

export interface AdminUser {
  uuid: string;
  username: string;
  email: string;
  role: string;
  management_level: string;
  promoted_role: string | null;
  is_active: boolean;
  is_approved: boolean;
  profile?: AdminUserProfile | null;
  user_approval?: { status?: string; remarks?: string | null } | null;
  created_at?: string;
  musicProfile?: any;
  managementProfile?: any;
}

export interface AdminFilters {
  search?: string;
  role?: string;
  status?: string;
  branch?: string;
  year?: string;
  gender?: string;
  sub_role?: string;
  promoted_role?: string;
  sort_by?: string;
  sort_order?: string;
}

export function useAdminUsers(initialPage = 1, filters: AdminFilters = {}, perPage = 15) {
  const [page, setPage] = useState(initialPage);

  const buildQuery = () => {
    const p = new URLSearchParams();
    p.append("page", String(page));
    p.append("per_page", String(perPage));
    if (filters.search) p.append("search", filters.search);
    if (filters.role && filters.role !== "all") p.append("role", filters.role);
    if (filters.status && filters.status !== "all") p.append("status", filters.status);
    if (filters.branch && filters.branch !== "all") p.append("branch", filters.branch);
    if (filters.year && filters.year !== "all") p.append("year", filters.year);
    if (filters.gender && filters.gender !== "all") p.append("gender", filters.gender);
    if (filters.sub_role && filters.sub_role !== "all") p.append("sub_role", filters.sub_role);
    if (filters.promoted_role && filters.promoted_role !== "all") p.append("promoted_role", filters.promoted_role);
    if (filters.sort_by) p.append("sort_by", filters.sort_by);
    if (filters.sort_order) p.append("sort_order", filters.sort_order);
    return p.toString();
  };

  const endpoint = `${API_BASE_URL}/admin/users?${buildQuery()}`;

  const { data, error, isLoading, mutate: swrMutate } = useSWR(endpoint, fetcher, { keepPreviousData: true });

  // data shape: { data: User[], meta: {...} } via UserCollection
  const users: AdminUser[] = data?.data ?? data?.data?.data ?? [];
  // handle nested meta
  const meta = data?.meta ?? data?.data?.meta ?? null;
  // fallback: SWR data may be {data:[], meta}
  const list = Array.isArray(data?.data) ? data.data : Array.isArray(users) ? users : [];
  const paginationMeta = meta ?? data?.meta ?? null;

  const refresh = useCallback(() => swrMutate(), [swrMutate]);

  const mutateAll = () => {
    mutate((key: string) => typeof key === "string" && key.includes("/admin/users"), undefined, { revalidate: true });
  };

  const promoteUser = async (uuid: string, role: "ebm" | "credit-manager" | "membership-head") => {
    try {
      const res = await axios.post(`${API_BASE_URL}/admin/promote/${role}/${uuid}`, {}, { headers: getHeaders() });
      toast.success(res.data.message || "Promoted");
      mutateAll();
      return true;
    } catch (e: any) {
      toast.error(e.response?.data?.message || e.response?.data?.error || "Promote failed");
      return false;
    }
  };

  const demoteUser = async (uuid: string) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/admin/de-promote/${uuid}`, {}, { headers: getHeaders() });
      toast.success(res.data.message || "Demoted");
      mutateAll();
      return true;
    } catch (e: any) {
      toast.error(e.response?.data?.error || "Demote failed");
      return false;
    }
  };

  const approveUser = async (uuid: string, remarks = "Approved by admin") => {
    try {
      const res = await axios.post(`${API_BASE_URL}/admin/approve-user/${uuid}`, { remarks }, { headers: getHeaders() });
      toast.success(res.data.message || "Approved");
      mutateAll();
      return true;
    } catch (e: any) {
      toast.error(e.response?.data?.error || "Approve failed");
      return false;
    }
  };

  const rejectUser = async (uuid: string, remarks = "Rejected by admin") => {
    try {
      const res = await axios.post(`${API_BASE_URL}/admin/reject-user/${uuid}`, { remarks }, { headers: getHeaders() });
      toast.success(res.data.message || "Rejected");
      mutateAll();
      return true;
    } catch (e: any) {
      toast.error(e.response?.data?.error || "Reject failed");
      return false;
    }
  };

  const deleteUser = async (uuid: string) => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/admin/users/${uuid}`, { headers: getHeaders() });
      toast.success(res.data.message || "Deleted");
      mutateAll();
      return true;
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Delete failed");
      return false;
    }
  };

  const clearLock = async (uuid: string) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/admin/unlock-account/${uuid}`, {}, { headers: getHeaders() });
      toast.success(res.data.message || "Unlocked");
      mutateAll();
      return true;
    } catch (e: any) {
      toast.error(e.response?.data?.error || "Unlock failed");
      return false;
    }
  };

  return {
    users: list as AdminUser[],
    meta: paginationMeta,
    raw: data,
    isLoading,
    isError: !!error,
    error,
    page,
    setPage,
    refresh,
    promoteUser,
    demoteUser,
    approveUser,
    rejectUser,
    deleteUser,
    clearLock,
    endpoint,
  };
}

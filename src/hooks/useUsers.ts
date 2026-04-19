// src/hooks/useUsers.ts
import { useState } from "react";
import useSWR, { mutate } from "swr";
import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Assuming axios is configured with Sanctum CSRF and base URL
const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export interface UserProfile {
  id?: number;
  uuid: string;
  user_id: number;
  first_name: string;
  last_name: string;
  phone_no?: string;
  reg_num?: string;
  branch?: string;
  year?: string;
  gender?: string;
  lateral_status?: boolean;
  hostel_status?: boolean;
  college_hostel_status?: boolean;
  sub_role?: string;
  experience?: string;
  created_at: string;
}

export interface MusicProfile extends UserProfile {
  instrument_avail?: number;
  other_fields_of_interest?: string;
  passion?: string;
}

export interface ManagementProfile extends UserProfile {
  interest_towards_lolo?: string;
  any_club?: string;
}

export interface User {
  id?: number;
  uuid: string;
  username: string;
  email?: string;
  role: string;
  management_level: string;
  promoted_role: string | null;
  is_active: boolean;
  is_approved: boolean;
  profile?: UserProfile;
  created_at?: string;
  musicProfile?: MusicProfile | null;
  managementProfile?: ManagementProfile | null;
  user_approval?: UserApproval;
}

export interface UserApproval {
  status?: string | null;
  remarks?: string | null;
  assigned_ebm_id: number | null;
  ebm_assigned_at?: string | null;
  ebm_approved_at?: string | null;
  assigned_membership_head_id?: number | null;
  membership_head_assigned_at?: string | null;
  membership_head_approved_at?: string | null;
  approved_at?: string | null; // Admin approval time
}

export interface UserStats {
  total_users: number;
  pending_approvals: number;
  approved_users: number;
  music_users: number;
  management_users: number;
  recent_registrations_by_last_week: number;
}

export interface PaginatedResponse {
  data: User[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface UserFilters {
  search?: string;
  role?: string;
  status?: string;
  branch?: string;
}

export function useUsers(initialPage = 1, filters: UserFilters = {}) {
  const [page, setPage] = useState(initialPage);

  // Build query string dynamically from the filters object
  const buildQueryString = () => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("per_page", "15");

    if (filters.search) params.append("search", filters.search);
    if (filters.role && filters.role !== "all")
      params.append("role", filters.role);
    if (filters.status && filters.status !== "all")
      params.append("status", filters.status);
    if (filters.branch && filters.branch !== "all")
      params.append("branch", filters.branch);

    return params.toString();
  };

  const endpoint = `${API_BASE_URL}/membership-head/users?${buildQueryString()}`;

  const { data, error, isLoading } = useSWR<PaginatedResponse>(
    endpoint,
    fetcher,
    { keepPreviousData: true },
  );

  /* -------------------- Role Management -------------------- */
  const promoteUser = async (
    userId: string,
    role: "ebm" | "credit-manager",
  ) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/membership-head/promote/${role}/${userId}`,
      );
      toast.success(res.data.message || "User promoted successfully");
      mutate(endpoint);
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to promote user");
      return false;
    }
  };

  const demoteUser = async (userId: string) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/membership-head/de-promote/${userId}`,
      );
      toast.success(res.data.message || "User demoted successfully");
      mutate(endpoint);
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to demote user");
      return false;
    }
  };

  /* -------------------- User CRUD -------------------- */
  const updateUser = async (
    userUuid: string,
    payload: Partial<User & UserProfile>,
  ) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/membership-head/users/${userUuid}`,
        payload,
      );
      toast.success(res.data.message || "User updated successfully");
      mutate(endpoint); // Re-fetch the table
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update user");
      console.error("Update User Error:", err.response?.data);
      return false;
    }
  };

  const deleteUser = async (userUuid: string) => {
    try {
      const res = await axios.delete(
        `${API_BASE_URL}/membership-head/users/${userUuid}`,
      );
      toast.success(res.data.message || "User deleted successfully");
      // If we delete the last item on a page, we should ideally go back one page.
      // For now, re-fetching the current page is safe.
      mutate(endpoint);
      return true;
    } catch (err: any) {
      console.error("Delete User Error:", err.response?.data);
      toast.error(err.response?.data?.message || "Failed to delete user");
      return false;
    }
  };

  /* -------------------- Approval Management -------------------- */
  const approveUser = async (userUuid: string, remarks: string) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/membership-head/approve-user/${userUuid}`,
        {
          remarks,
        },
      );
      toast.success(res.data.message || "User approved successfully");
      mutate(endpoint);
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to approve user");
      return false;
    }
  };

  const rejectUser = async (userUuid: string, remarks: string) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/membership-head/reject-user/${userUuid}`,
        {
          remarks,
        },
      );
      toast.success(res.data.message || "User rejected successfully");
      mutate(endpoint);
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to reject user");
      return false;
    }
  };

  return {
    users: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError: error,
    page,
    setPage,
    // Mutations
    promoteUser,
    demoteUser,
    updateUser,
    deleteUser,
    approveUser,
    rejectUser,
  };
}

export function useUserStats() {
  const endpoint = `${API_BASE_URL}/membership-head/users/view/stats`; // Adjust if your route is different

  const { data, error, isLoading } = useSWR<{ data: UserStats }>(
    endpoint,
    fetcher,
  );

  return {
    stats: data?.data,
    isLoading,
    isError: error,
  };
}

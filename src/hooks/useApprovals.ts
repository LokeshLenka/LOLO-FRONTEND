// src/hooks/useApprovals.ts
import useSWR from "swr";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { type User } from "./useUsers";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function useApprovals(
  endpointPath: "pending-approvals" | "my-approvals",
) {
  const [page, setPage] = useState(1);

  // Note: Adjust the prefix if your route group uses '/membership-head/' or something similar
  const url = `${API_BASE_URL}/membership-head/${endpointPath}?page=${page}&per_page=15`;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    keepPreviousData: true,
  });

  // --- Robust Data Extraction ---
  // Safely extract the users array and pagination meta regardless of how Laravel wrapped it
  let usersList: User[] = [];
  let metaData = null;

  if (data) {
    if (Array.isArray(data.data)) {
      // Format 1: Custom Collection { success: true, data: [...], meta: {...} }
      usersList = data.data;
      metaData = data.meta || null;
    } else if (data.data && Array.isArray(data.data.data)) {
      // Format 2: Default Laravel Paginated Resource wrapped in a 'data' key { data: { data: [...], current_page: 1 } }
      usersList = data.data.data;
      metaData = {
        current_page: data.data.current_page,
        last_page: data.data.last_page,
        per_page: data.data.per_page,
        total: data.data.total,
        from: data.data.from,
        to: data.data.to,
      };
    } else if (Array.isArray(data)) {
      // Format 3: Raw array [...]
      usersList = data;
    }
  }

  // Mutation to approve user
  const approveUser = async (uuid: string, remarks: string) => {
    const toastId = toast.loading("Approving user...");
    try {
      await axios.post(`${API_BASE_URL}/membership-head/approve-user/${uuid}`, {
        remarks,
      });
      toast.success("User approved successfully", { id: toastId });
      mutate();
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to approve user", {
        id: toastId,
      });
      return false;
    }
  };

  // Mutation to reject user
  const rejectUser = async (uuid: string, remarks: string) => {
    const toastId = toast.loading("Rejecting user...");
    try {
      await axios.post(`${API_BASE_URL}/membership-head/reject-user/${uuid}`, {
        remarks,
      });
      toast.success("User rejected successfully", { id: toastId });
      mutate();
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to reject user", {
        id: toastId,
      });
      return false;
    }
  };

  return {
    users: usersList,
    meta: metaData,
    isLoading,
    isError: error,
    page,
    setPage,
    approveUser,
    rejectUser,
  };
}

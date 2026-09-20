import { useState } from "react";
import useSWR from "swr";
import axios from "axios";
import { toast } from "sonner";

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

export interface CMEventRegistrationUser {
  id: number;
  username: string;
  email: string;
  role: string;
  promoted_role: string | null;
  is_approved: boolean;
  managementProfile: { sub_role: string } | null;
  musicProfile: { sub_role: string } | null;
}

export interface CMEventRegistrationEvent {
  id: number;
  uuid: string;
  name: string;
  type: string;
  credits_awarded: number;
  end_date: string;
}

export interface CMEventRegistrationCredit {
  uuid: string;
  amount: number;
  assigned_by: number;
  created_at: string;
  updated_at: string;
}

export interface CMEventMeta {
  uuid: string;
  name: string;
  type?: string;
  credits_awarded?: number | string;
  end_date?: string;
}

export interface CMEventRegistrationItem {
  uuid: string;
  registration_status: string;
  payment_status: string;
  is_paid: boolean | string | number;
  user_id: number;
  event_id: number;
  user: CMEventRegistrationUser;
  event: CMEventRegistrationEvent;
  credit: CMEventRegistrationCredit | null;
  eligibility_status: "eligible" | "management" | "registered" | "public" | "pending" | "not_eligible";
  is_management_member: boolean;
  is_registered: boolean;
}

export interface LaravelPaginationMetaLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface LaravelPaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links?: LaravelPaginationMetaLink[];
}

interface EventRegistrationsResponse {
  data: CMEventRegistrationItem[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links?: LaravelPaginationMetaLink[];
  event?: CMEventMeta | null;
}

function normalizeEventRegistrationsResponse(raw: any): EventRegistrationsResponse {
  if (!raw?.data) {
    return { data: [], current_page: 1, last_page: 1, per_page: 20, total: 0, event: raw?.event ?? null };
  }

  // Backend might return array directly or paginated
  if (Array.isArray(raw.data)) {
    return {
      data: raw.data,
      current_page: raw.current_page ?? 1,
      last_page: raw.last_page ?? 1,
      per_page: raw.per_page ?? 20,
      total: raw.total ?? raw.data.length,
      links: raw.links,
      event: raw.event ?? null,
    };
  }

  return {
    data: raw.data.data ?? [],
    current_page: raw.data.current_page ?? 1,
    last_page: raw.data.last_page ?? 1,
    per_page: raw.data.per_page ?? 20,
    total: raw.data.total ?? 0,
    links: raw.data.links,
    event: raw.event ?? null,
  };
}

const fetcher = async (url: string) => {
  const response = await axios.get(url, { headers: getHeaders() });
  return normalizeEventRegistrationsResponse(response.data);
};

export interface CMEventRegistrationsFilters {
  registration_status?: string;
  payment_status?: string;
  is_paid?: string;
  member_type?: "all" | "management" | "music" | "registered";
  credit_status?: "all" | "credited" | "uncredited";
  search?: string;
}

export function useCMEventRegistrations(eventUuid?: string) {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<CMEventRegistrationsFilters>({
    member_type: "registered",
  });

  const params = new URLSearchParams();
  params.set("page", String(page));

  if (filters.registration_status) {
    params.set("registration_status", filters.registration_status);
  }
  if (filters.payment_status) {
    params.set("payment_status", filters.payment_status);
  }
  if (filters.is_paid) {
    params.set("is_paid", filters.is_paid);
  }
  if (filters.member_type && filters.member_type !== "all") {
    params.set("member_type", filters.member_type);
  }
  if (filters.credit_status && filters.credit_status !== "all") {
    params.set("credit_status", filters.credit_status);
  }
  if (filters.search) {
    params.set("search", filters.search);
  }

  const key = eventUuid
    ? `${API_BASE_URL}/credit-manager/events/${eventUuid}/eligible-users?${params.toString()}`
    : `${API_BASE_URL}/credit-manager/event-registrations?${params.toString()}`;

  const { data, error, isLoading, mutate } = useSWR<EventRegistrationsResponse>(
    eventUuid ? key : null,
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  const assignCredit = async (payload: { user_id: number; amount: number }) => {
    if (!eventUuid) return false;
    try {
      await axios.post(
        `${API_BASE_URL}/credit-manager/event/${eventUuid}/credits`,
        payload,
        { headers: getHeaders() }
      );
      toast.success("Credit assigned successfully");
      await mutate();
      return true;
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to assign credit"
      );
      return false;
    }
  };

  const updateCredit = async (creditUuid: string, payload: { user_id: number; amount: number }) => {
    if (!eventUuid) return false;
    try {
      await axios.put(
        `${API_BASE_URL}/credit-manager/event/${eventUuid}/credits/${creditUuid}`,
        payload,
        { headers: getHeaders() }
      );
      toast.success("Credit updated successfully");
      await mutate();
      return true;
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to update credit"
      );
      return false;
    }
  };

  const bulkAssign = async (payload: { user_ids: number[]; amount: number }) => {
    if (!eventUuid) return false;
    try {
      const res = await axios.post(
        `${API_BASE_URL}/credit-manager/event/${eventUuid}/credits/batch`,
        payload,
        { headers: getHeaders() }
      );
      const summary = res.data?.data?.summary;
      toast.success(
        summary
          ? `Bulk assign done: ${summary.processed_count} assigned, ${summary.failed_count} failed`
          : "Bulk credit assignment completed"
      );
      await mutate();
      return true;
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to bulk assign credits"
      );
      return false;
    }
  };

  return {
    registrations: data?.data ?? [],
    event: data?.event ?? null,
    meta: data
      ? {
          current_page: data.current_page,
          last_page: data.last_page,
          per_page: data.per_page,
          total: data.total,
          links: data.links,
        }
      : null,
    isLoading,
    isError: error,
    page,
    setPage,
    filters,
    setFilters,
    refresh: mutate,
    assignCredit,
    updateCredit,
    bulkAssign,
  };
}
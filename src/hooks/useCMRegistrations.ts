import { useState } from "react";
import useSWR from "swr";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITEAPIBASEURL;

export interface CMRegistrationUser {
  id?: number;
  username: string;
  role?: string;
  promoted_role?: string | null;
  is_approved?: boolean | number;
}

export interface CMRegistrationEvent {
  id?: number;
  uuid?: string;
  type?: string;
  name?: string;
}

export interface CMRegistration {
  uuid: string;
  registration_status: string;
  payment_status: string;
  is_paid: boolean | string | number;
  created_at?: string;
  updated_at?: string;
  user: CMRegistrationUser | null;
  event: CMRegistrationEvent | null;
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

interface RegistrationsResponse {
  data: CMRegistration[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links?: LaravelPaginationMetaLink[];
}

function getToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("auth_token") ||
    localStorage.getItem("sanctum_token") ||
    ""
  );
}

const fetcher = async (url: string) => {
  const token = getToken();

  const res = await axios.get<RegistrationsResponse>(url, {
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return res.data;
};

export interface CMRegistrationFilters {
  registration_status?: string;
  payment_status?: string;
  is_paid?: string;
}

export function useCMRegistrations() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<CMRegistrationFilters>({});

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

  const key = `${API_BASE_URL}/credit-manager/event-registrations?${params.toString()}`;

  const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  return {
    registrations: data?.data ?? [],
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
  };
}

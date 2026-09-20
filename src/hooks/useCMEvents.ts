import { useState } from "react";
import useSWR from "swr";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITEAPIBASEURL;

export interface CMEventListItem {
  uuid: string;
  name: string;
  type?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  venue?: string;
  credits_awarded?: number | string;
  fee?: number | string;
  cover_image?: string | null;
}

export interface LaravelPaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface EventsApiResponse {
  status: string;
  code: number;
  message: string;
  data: {
    data: CMEventListItem[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
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
  const res = await axios.get<EventsApiResponse>(url, {
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return res.data.data;
};

export function useCMEvents() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("per_page", "20");

  const key = `${API_BASE_URL}/events?${params.toString()}`;

  const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  const allEvents = data?.data ?? [];

  const q = search.trim().toLowerCase();
  const events = allEvents.filter((event) => {
    if (typeFilter !== "all" && (event.type ?? "").toLowerCase() !== typeFilter) {
      return false;
    }
    if (!q) return true;
    return (
      event.name?.toLowerCase().includes(q) ||
      event.venue?.toLowerCase().includes(q)
    );
  });

  return {
    events,
    meta: data
      ? {
          current_page: data.current_page,
          last_page: data.last_page,
          per_page: data.per_page,
          total: data.total,
        }
      : null,
    isLoading,
    isError: error,
    page,
    setPage,
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    refresh: mutate,
  };
}

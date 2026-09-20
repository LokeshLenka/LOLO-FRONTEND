import useSWR from "swr";
import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITEAPIBASEURL;

function getToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
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

export interface CMDetailUser {
  id?: number;
  username: string;
  email?: string;
  role?: string;
  promoted_role?: string | null;
}

export interface CMDetailEvent {
  id?: number;
  uuid: string;
  name: string;
  type?: string;
  credits_awarded?: number | string;
}

export interface CMDetailRegistration {
  uuid: string;
  user_id?: number;
  event_id?: number;
  registration_status: string;
  payment_status?: string;
  user: CMDetailUser;
  event: CMDetailEvent;
}

export interface CMDetailCredit {
  uuid: string;
  user_id: number;
  event_id: number;
  amount: number | string;
  assigned_by?: number;
  assigned_by_username?: string | null;
  assigner?: { username?: string | null } | null;
  can_manage_credit?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CMRegistrationDetailData {
  registration: CMDetailRegistration | null;
  credit: CMDetailCredit | null;
}

function normalizeResponse(raw: any): CMRegistrationDetailData {
  if (!raw?.data) {
    return { registration: null, credit: null };
  }

  if (raw.data.registration || raw.data.credit) {
    return {
      registration: raw.data.registration ?? null,
      credit: raw.data.credit ?? raw.data.credits ?? null,
    };
  }

  if (Array.isArray(raw.data)) {
    let registration: CMDetailRegistration | null = null;
    let credit: CMDetailCredit | null = null;

    for (const item of raw.data) {
      if (item?.registration) {
        registration = item.registration;
      }
      if (item?.credit || item?.credits) {
        credit = item.credit ?? item.credits ?? null;
      }
    }

    return { registration, credit };
  }

  return { registration: null, credit: null };
}

const fetcher = async (url: string) => {
  const response = await axios.get(url, {
    headers: getHeaders(),
  });
  return normalizeResponse(response.data);
};

export function useCMRegistrationDetail(registrationUuid?: string) {
  const shouldFetch = Boolean(registrationUuid);

  const { data, error, isLoading, mutate } = useSWR<CMRegistrationDetailData>(
    shouldFetch
      ? `${API_BASE_URL}/credit-manager/event-registrations/${registrationUuid}`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    }
  );

  const assignCredit = async (payload: { user_id: number; amount: number; eventUuid: string }) => {
    try {
      await axios.post(
        `${API_BASE_URL}/credit-manager/event/${payload.eventUuid}/credits`,
        {
          user_id: payload.user_id,
          amount: payload.amount,
        },
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

  const updateCredit = async (payload: {
    creditUuid: string;
    user_id: number;
    amount: number;
    eventUuid: string;
  }) => {
    try {
      await axios.put(
        `${API_BASE_URL}/credit-manager/event/${payload.eventUuid}/credits/${payload.creditUuid}`,
        {
          user_id: payload.user_id,
          amount: payload.amount,
        },
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

  return {
    detail: data ?? { registration: null, credit: null },
    isLoading,
    isError: error,
    refresh: mutate,
    assignCredit,
    updateCredit,
  };
}

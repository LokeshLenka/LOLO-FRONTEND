import axios from "axios";
import useSWR from "swr";
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

export interface CreditEvent {
  uuid: string;
  name: string;
}

export interface RegistrationUser {
  id?: number;
  uuid?: string;
  username: string;
  email?: string;
}

export interface EventRegistrationItem {
  uuid: string;
  user_id?: number;
  event_id?: number;
  registration_status: string;
  payment_status?: string;
  user: RegistrationUser;
  event: CreditEvent;
}

export interface CreditItem {
  uuid: string;
  user_id: number;
  event_id: number;
  amount: number | string;
  assigned_by?: number;
  created_at?: string;
  updated_at?: string;
}

export interface RegistrationWithCreditRow {
  registration: EventRegistrationItem;
  credit: CreditItem | null;
}

interface EventRegistrationsResponse {
  data: RegistrationWithCreditRow[];
}

interface CreditMutationPayload {
  user_id: number;
  amount: number;
}

const fetcher = async (url: string) => {
  const response = await axios.get<EventRegistrationsResponse>(url, {
    headers: getHeaders(),
  });
  return response.data;
};

export function useEventRegistrationsWithCredits(eventUuid?: string) {
  const shouldFetch = Boolean(eventUuid);

  const { data, error, isLoading, mutate } = useSWR<EventRegistrationsResponse>(
    shouldFetch
      ? `${API_BASE_URL}/credit-manager/event-registrations/event/${eventUuid}`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
    },
  );

  const assignCredit = async (payload: CreditMutationPayload) => {
    if (!eventUuid) return false;

    try {
      await axios.post(
        `${API_BASE_URL}/credit-manager/event/${eventUuid}/credits`,
        payload,
        { headers: getHeaders() },
      );

      toast.success("Credit assigned successfully");
      await mutate();
      return true;
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to assign credit",
      );
      return false;
    }
  };

  const updateCredit = async (
    creditUuid: string,
    payload: CreditMutationPayload,
  ) => {
    if (!eventUuid) return false;

    try {
      await axios.put(
        `${API_BASE_URL}/credit-manager/event/${eventUuid}/credits/${creditUuid}`,
        payload,
        { headers: getHeaders() },
      );

      toast.success("Credit updated successfully");
      await mutate();
      return true;
    } catch (err: any) {
      toast.error(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to update credit",
      );
      return false;
    }
  };

  return {
    rows: data?.data ?? [],
    isLoading,
    isError: error,
    refresh: mutate,
    assignCredit,
    updateCredit,
  };
}

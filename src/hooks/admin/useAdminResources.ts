import useSWR from "swr";
import axios from "axios";
import { toast } from "sonner";

const API = import.meta.env.VITE_API_BASE_URL;
const h = () => {
  const t = localStorage.getItem("authToken") || "";
  return { Accept: "application/json", "Content-Type": "application/json", ...(t ? { Authorization: `Bearer ${t}` } : {}) };
};
const fetcher = (url: string) => axios.get(url, { headers: h() }).then(r => r.data);

// TEAM PROFILES — GET /admin/team-profile
export function useAdminTeam() {
  const { data, error, isLoading, mutate } = useSWR(`${API}/admin/team-profile`, fetcher);
  const list = data?.data ?? data ?? [];
  const create = async (payload: any) => {
    try { const r = await axios.post(`${API}/admin/team-profile`, payload, { headers: h() }); toast.success("Team profile created"); mutate(); return r.data; } catch(e:any){ toast.error(e.response?.data?.message||"Create failed"); throw e; }
  };
  const update = async (uuid: string, payload: any) => {
    try { const r = await axios.put(`${API}/admin/team-profile/${uuid}`, payload, { headers: h() }); toast.success("Updated"); mutate(); return r.data; } catch(e:any){ toast.error(e.response?.data?.message||"Update failed"); throw e; }
  };
  const remove = async (uuid: string) => {
    try { await axios.delete(`${API}/admin/team-profile/${uuid}`, { headers: h() }); toast.success("Deleted"); mutate(); } catch(e:any){ toast.error("Delete failed"); }
  };
  return { list: Array.isArray(list)?list:[], isLoading, isError: !!error, create, update, remove, refresh: mutate };
}

// USER APPROVALS — /admin/user_approval
export function useAdminUserApprovals() {
  const { data, error, isLoading, mutate } = useSWR(`${API}/admin/user_approval`, fetcher);
  const list = data?.data ?? data ?? [];
  return { list: Array.isArray(list)?list:[], isLoading, isError: !!error, refresh: mutate };
}

// EVENTS — public list + admin create/manage
export function useAdminEvents() {
  const { data, error, isLoading, mutate } = useSWR(`${API}/events`, fetcher);
  const list = data?.data ?? data ?? [];
  const events = Array.isArray(list)?list : list?.data ?? [];
  const createEvent = async (payload: any) => {
    try { const r = await axios.post(`${API}/admin/event`, payload, { headers: h() }); toast.success("Event created"); mutate(); return r.data; } catch(e:any){ toast.error(e.response?.data?.message||"Create failed"); throw e; }
  };
  const updateEvent = async (uuid: string, payload: any) => {
    try { const r = await axios.put(`${API}/admin/event/${uuid}`, payload, { headers: h() }); toast.success("Event updated"); mutate(); return r.data; } catch(e:any){ toast.error(e.response?.data?.message||"Update failed"); throw e; }
  };
  const deleteEvent = async (uuid: string) => {
    try { await axios.delete(`${API}/admin/event/${uuid}`, { headers: h() }); toast.success("Deleted"); mutate(); } catch(e:any){ toast.error("Delete failed"); }
  };
  return { events: Array.isArray(events)?events:[], isLoading, isError: !!error, createEvent, updateEvent, deleteEvent, refresh: mutate };
}

// REGISTRATIONS — all / club / music
export function useAdminRegistrations(tab: "all"|"club"|"music" = "all") {
  const url = tab==="all" ? `${API}/admin/event-registrations` : tab==="club" ? `${API}/admin/club/event-registrations` : `${API}/admin/music/event-registrations`;
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);
  const list = data?.data ?? data ?? [];
  const rows = Array.isArray(list)?list : list?.data ?? [];
  const updateClub = async (uuid: string, payload:any) => { try{ await axios.put(`${API}/admin/club/event-registrations/${uuid}`, payload, {headers:h()}); toast.success("Updated"); mutate(); }catch(e:any){ toast.error("Update failed"); } };
  const deleteClub = async (uuid:string)=>{ try{ await axios.delete(`${API}/admin/club/event-registrations/${uuid}`,{headers:h()}); toast.success("Deleted"); mutate(); }catch{ toast.error("Delete failed"); } };
  const updateMusic = async (uuid:string,payload:any)=>{ try{ await axios.put(`${API}/admin/music/event-registrations/${uuid}`,payload,{headers:h()}); toast.success("Updated"); mutate(); }catch{ toast.error("Update failed"); } };
  const deleteMusic = async (uuid:string)=>{ try{ await axios.delete(`${API}/admin/music/event-registrations/${uuid}`,{headers:h()}); toast.success("Deleted"); mutate(); }catch{ toast.error("Delete failed"); } };
  return { rows: Array.isArray(rows)?rows:[], isLoading, isError:!!error, refresh:mutate, updateClub, deleteClub, updateMusic, deleteMusic };
}

// TICKETS — copy-records
export function useAdminTickets() {
  const copyRecords = async () => {
    try { const r = await axios.post(`${API}/admin/copy-records`, {}, { headers: h() }); toast.success(`Copied: ${r.data.created ?? 0} created, ${r.data.skipped ?? 0} skipped`); return r.data; } catch(e:any){ toast.error(e.response?.data?.message||"Copy failed"); throw e; }
  };
  return { copyRecords };
}

// USERS extras — stats, pending, by role
export function useAdminUsersStats() {
  const { data, error, isLoading, mutate } = useSWR(`${API}/admin/users/view/stats`, fetcher);
  return { stats: data?.data ?? data, isLoading, isError:!!error, refresh:mutate };
}
export function useAdminPendingApprovals() {
  const { data, error, isLoading, mutate } = useSWR(`${API}/admin/users/view/get-pending-approvals`, fetcher);
  const list = data?.data ?? data ?? [];
  return { list: Array.isArray(list)?list:(list?.data??[]), isLoading, isError:!!error, refresh:mutate };
}
export function useAdminUsersByRole(role: string | null) {
  const should = !!role;
  const { data, error, isLoading, mutate } = useSWR(should ? `${API}/admin/users/view/get-users-role/${role}` : null, fetcher);
  const list = data?.data ?? data ?? [];
  return { list: Array.isArray(list)?list:(list?.data??[]), isLoading, isError:!!error, refresh:mutate };
}

// reset password
export async function adminResetPassword(uuid: string, password: string, password_confirmation: string) {
  try { const r = await axios.post(`${API}/admin/reset-password/${uuid}`, { password, password_confirmation }, { headers: h() }); toast.success(r.data.message||"Password reset"); return true; } catch(e:any){ toast.error(e.response?.data?.message||"Reset failed"); return false; }
}

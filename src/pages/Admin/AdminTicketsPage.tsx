import { AdminHeader } from "@/layouts/admin/AdminHeader";
import { useAdminTickets } from "@/hooks/admin/useAdminResources";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

export default function AdminTicketsPage(){
  const { copyRecords } = useAdminTickets();
  const [ticket,setTicket]=useState("");
  const [busy,setBusy]=useState(false);
  const verify = async()=>{
    if(!ticket) return;
    setBusy(true);
    try{
      const token = localStorage.getItem("authToken")||"";
      const API = import.meta.env.VITE_API_BASE_URL;
      const r = await axios.put(`${API}/verify-ticket/${ticket}`, {}, { headers:{ Authorization:`Bearer ${token}` }});
      toast.success(r.data.message||"Ticket verified");
    }catch(e:any){ toast.error(e.response?.data?.message||"Verify failed"); }
    setBusy(false);
  };
  return (
    <div className="pb-10">
      <AdminHeader title="Tickets — Gate Verification" subtitle="POST /admin/copy-records • PUT /verify-ticket/:code (valid_club_member)" />
      <div className="px-4 lg:px-8 py-6 space-y-4">
        <Card className="rounded-none border-[#D9CEF2] dark:border-[#2A1A3A] bg-white dark:bg-[#120A1A]">
          <CardContent className="p-6 space-y-4">
            <div className="text-sm font-bold text-[#030407] dark:text-[#EDE6F8]">Copy public registrations → event tickets</div>
            <p className="text-xs text-[#494070] dark:text-[#494070]">One-click bulk copy via <code className="px-1 bg-[#EDE6F8] dark:bg-[#1A1025]">POST /admin/copy-records</code>. Chunked 100 at a time on server.</p>
            <Button onClick={copyRecords} className="rounded-none bg-[#DF3FFA] hover:bg-[#030407] text-white">Run copy-records</Button>
          </CardContent>
        </Card>
        <Card className="rounded-none border-[#D9CEF2] dark:border-[#2A1A3A] bg-white dark:bg-[#120A1A]">
          <CardContent className="p-6 space-y-3">
            <div className="text-sm font-bold text-[#030407] dark:text-[#EDE6F8]">Verify ticket (gate)</div>
            <div className="flex gap-2">
              <Input placeholder="Enter ticket code" value={ticket} onChange={e=>setTicket(e.target.value)} className="rounded-none bg-[#EDE6F8] dark:bg-[#030407] border-[#D9CEF2] dark:border-[#2A1A3A]"/>
              <Button onClick={verify} disabled={busy} className="rounded-none bg-[#DF3FFA] text-white">Verify</Button>
            </div>
            <div className="text-xs text-[#494070] dark:text-[#494070]">Requires <code className="px-1 bg-[#EDE6F8] dark:bg-[#1A1025]">valid_club_member</code> + Sanctum. Admin plus promoted leadership passes.</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

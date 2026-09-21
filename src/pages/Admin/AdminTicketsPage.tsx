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
        <Card className="rounded-none border-[#BFE9E0] dark:border-[#1E3D32] bg-white dark:bg-[#14261F]">
          <CardContent className="p-6 space-y-4">
            <div className="text-sm font-bold text-[#17463C] dark:text-[#EAF6F4]">Copy public registrations → event tickets</div>
            <p className="text-xs text-[#4A7A6E] dark:text-[#91E9D7]">One-click bulk copy via <code className="px-1 bg-[#EAF6F4] dark:bg-[#1B342D]">POST /admin/copy-records</code>. Chunked 100 at a time on server.</p>
            <Button onClick={copyRecords} className="rounded-none bg-[#1E8277] hover:bg-[#17463C] text-white">Run copy-records</Button>
          </CardContent>
        </Card>
        <Card className="rounded-none border-[#BFE9E0] dark:border-[#1E3D32] bg-white dark:bg-[#14261F]">
          <CardContent className="p-6 space-y-3">
            <div className="text-sm font-bold text-[#17463C] dark:text-[#EAF6F4]">Verify ticket (gate)</div>
            <div className="flex gap-2">
              <Input placeholder="Enter ticket code" value={ticket} onChange={e=>setTicket(e.target.value)} className="rounded-none bg-[#EAF6F4] dark:bg-[#0F1F1A] border-[#BFE9E0] dark:border-[#1E3D32]"/>
              <Button onClick={verify} disabled={busy} className="rounded-none bg-[#1E8277] text-white">Verify</Button>
            </div>
            <div className="text-xs text-[#4A7A6E] dark:text-[#91E9D7]">Requires <code className="px-1 bg-[#EAF6F4] dark:bg-[#1B342D]">valid_club_member</code> + Sanctum. Admin plus promoted leadership passes.</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

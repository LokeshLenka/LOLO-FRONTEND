import { AdminHeader } from "@/layouts/admin/AdminHeader";
import { useAdminUserApprovals } from "@/hooks/admin/useAdminResources";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function AdminUserApprovalMgmt(){
  const { list, isLoading } = useAdminUserApprovals();
  const [q,setQ]=useState("");
  const filtered = list.filter((r:any)=> JSON.stringify(r).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="pb-10">
      <AdminHeader title="User Approvals" subtitle="Admin view of user_approval — GET /admin/user_approval • POST • PUT • DELETE" />
      <div className="px-4 lg:px-8 py-6 space-y-4">
        <div className="flex gap-3">
          <Input placeholder="Search approvals…" value={q} onChange={e=>setQ(e.target.value)} className="max-w-sm rounded-none bg-[#EAF6F4] dark:bg-[#0F1F1A] border-[#BFE9E0] dark:border-[#1E3D32]"/>
          <Badge className="rounded-full bg-[#EAF6F4] dark:bg-[#1B342D] text-[#1E8277] border-0 h-9 px-3">{filtered.length} records</Badge>
        </div>
        <Card className="rounded-none border-[#BFE9E0] dark:border-[#1E3D32] bg-white dark:bg-[#14261F] overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#EAF6F4] dark:bg-[#0F1F1A]"><TableRow><TableHead className="text-[#17463C] dark:text-[#EAF6F4]">User</TableHead><TableHead className="text-[#17463C] dark:text-[#EAF6F4]">Status</TableHead><TableHead className="text-[#17463C] dark:text-[#EAF6F4]">EBM</TableHead><TableHead className="text-[#17463C] dark:text-[#EAF6F4]">MH</TableHead><TableHead className="text-[#17463C] dark:text-[#EAF6F4]">Updated</TableHead></TableRow></TableHeader>
              <TableBody>
                {isLoading ? <TableRow><TableCell colSpan={5} className="py-8 text-center text-[#4A7A6E]">Loading…</TableCell></TableRow> :
                 filtered.length===0 ? <TableRow><TableCell colSpan={5} className="py-8 text-center text-[#4A7A6E] dark:text-[#91E9D7]">No approvals found</TableCell></TableRow> :
                 filtered.map((r:any)=>(
                  <TableRow key={r.id||r.uuid} className="hover:bg-[#EAF6F4]/40 dark:hover:bg-[#1B342D]/40">
                    <TableCell className="text-sm text-[#17463C] dark:text-[#EAF6F4]">{r.user?.username||r.user_id||r.uuid||"—"}</TableCell>
                    <TableCell><Badge className={`rounded-full border-0 ${r.status==="pending"?"bg-[#FFFAEB] text-[#B54708]":r.status?.includes("approved")?"bg-[#ECFDF3] text-[#027A48]":"bg-[#EAF6F4] text-[#1E8277]"}`}>{r.status||"—"}</Badge></TableCell>
                    <TableCell className="text-xs text-[#4A7A6E] dark:text-[#91E9D7]">{r.ebm_approved_at||r.assigned_ebm_id||"—"}</TableCell>
                    <TableCell className="text-xs text-[#4A7A6E] dark:text-[#91E9D7]">{r.membership_head_approved_at||r.assigned_membership_head_id||"—"}</TableCell>
                    <TableCell className="text-xs text-[#4A7A6E] dark:text-[#91E9D7]">{r.updated_at?.slice(0,10)||"—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
        <div className="text-xs text-[#4A7A6E] dark:text-[#91E9D7]">Endpoints: <code className="px-1 py-0.5 bg-[#EAF6F4] dark:bg-[#1B342D] rounded-none">GET /admin/user_approval</code> lists all; use POST/PUT/DELETE with admin token for mutations. This view is read-focused for audit.</div>
      </div>
    </div>
  );
}

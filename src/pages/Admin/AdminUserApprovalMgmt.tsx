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
          <Input placeholder="Search approvals…" value={q} onChange={e=>setQ(e.target.value)} className="max-w-sm rounded-none bg-[var(--admin-canvas)] border-[var(--admin-line)] "/>
          <Badge className="rounded-full bg-[var(--admin-canvas)] text-[var(--admin-ink)] border-0 h-9 px-3">{filtered.length} records</Badge>
        </div>
        <Card className="rounded-none border-[var(--admin-line)]  bg-[var(--admin-surface)] overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[var(--admin-canvas)]"><TableRow><TableHead className="text-[var(--admin-ink)] ">User</TableHead><TableHead className="text-[var(--admin-ink)] ">Status</TableHead><TableHead className="text-[var(--admin-ink)] ">EBM</TableHead><TableHead className="text-[var(--admin-ink)] ">MH</TableHead><TableHead className="text-[var(--admin-ink)] ">Updated</TableHead></TableRow></TableHeader>
              <TableBody>
                {isLoading ? <TableRow><TableCell colSpan={5} className="py-8 text-center text-[var(--admin-ink-muted)]">Loading…</TableCell></TableRow> :
                 filtered.length===0 ? <TableRow><TableCell colSpan={5} className="py-8 text-center text-[var(--admin-ink-muted)] ">No approvals found</TableCell></TableRow> :
                 filtered.map((r:any)=>(
                  <TableRow key={r.id||r.uuid} className="hover:bg-[var(--admin-canvas)]/40 dark:hover:bg-[#1A1025]/40">
                    <TableCell className="text-sm text-[var(--admin-ink)] ">{r.user?.username||r.user_id||r.uuid||"—"}</TableCell>
                    <TableCell><Badge className={`rounded-full border-0 ${r.status==="pending"?"bg-[#FFFAEB] text-[#B54708]":r.status?.includes("approved")?"bg-[#ECFDF3] text-[#027A48]":"bg-[var(--admin-canvas)] text-[var(--admin-ink)]"}`}>{r.status||"—"}</Badge></TableCell>
                    <TableCell className="text-xs text-[var(--admin-ink-muted)] ">{r.ebm_approved_at||r.assigned_ebm_id||"—"}</TableCell>
                    <TableCell className="text-xs text-[var(--admin-ink-muted)] ">{r.membership_head_approved_at||r.assigned_membership_head_id||"—"}</TableCell>
                    <TableCell className="text-xs text-[var(--admin-ink-muted)] ">{r.updated_at?.slice(0,10)||"—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
        <div className="text-xs text-[var(--admin-ink-muted)] ">Endpoints: <code className="px-1 py-0.5 bg-[var(--admin-canvas)] rounded-none">GET /admin/user_approval</code> lists all; use POST/PUT/DELETE with admin token for mutations. This view is read-focused for audit.</div>
      </div>
    </div>
  );
}

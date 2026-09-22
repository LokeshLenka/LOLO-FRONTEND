import { AdminHeader } from "@/layouts/admin/AdminHeader";
import { useAdminUsersByRole, useAdminUsersStats, useAdminPendingApprovals } from "@/hooks/admin/useAdminResources";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { AdminExportMenu } from "@/components/admin/AdminExportMenu";

export default function AdminUsersByRole(){
  const [role,setRole]=useState<string>("management");
  const { list, isLoading } = useAdminUsersByRole(role);
  const { stats } = useAdminUsersStats();
  const { list: pending } = useAdminPendingApprovals();
  return (
    <div className="pb-10">
      <AdminHeader title="Users by Role & Stats" subtitle="GET /admin/users/view/stats • /admin/users/view/get-pending-approvals • /admin/users/view/get-users-role/:role" />
      <div className="px-4 lg:px-8 py-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="rounded-none border-[#D9CEF2] dark:border-[#2A1A3A] bg-white dark:bg-[#120A1A] p-4">
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#494070] dark:text-[#494070]">Stats (users/view/stats)</div>
            <div className="text-sm text-[#030407] dark:text-[#EDE6F8] mt-2">{stats ? `${stats.total_users} total • ${stats.pending_approvals} pending • ${stats.music_users} music • ${stats.management_users} mgmt` : "Loading…"}</div>
          </Card>
          <Card className="rounded-none border-[#D9CEF2] dark:border-[#2A1A3A] bg-white dark:bg-[#120A1A] p-4">
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#494070] dark:text-[#494070]">Pending approvals</div>
            <div className="text-2xl font-black text-[#030407] dark:text-[#EDE6F8]">{pending.length}</div>
            <div className="text-xs text-[#494070] dark:text-[#494070]">From get-pending-approvals</div>
          </Card>
          <Card className="rounded-none border-[#D9CEF2] dark:border-[#2A1A3A] bg-white dark:bg-[#120A1A] p-4 flex flex-col justify-center gap-2">
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#494070] dark:text-[#494070]">Filter by role</div>
            <Select value={role} onValueChange={setRole}><SelectTrigger className="rounded-none bg-[#EDE6F8] dark:bg-[#030407] border-[#D9CEF2] dark:border-[#2A1A3A]"><SelectValue/></SelectTrigger><SelectContent className="rounded-none"><SelectItem value="management">management</SelectItem><SelectItem value="music">music</SelectItem><SelectItem value="admin">admin</SelectItem></SelectContent></Select>
          </Card>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm text-[#494070] dark:text-[#494070]">{list.length} users with role={role}</div>
          <AdminExportMenu users={list as any} filenamePrefix={`users-by-role-${role}`} disabled={list.length===0}/>
        </div>
        <Card className="rounded-none border-[#D9CEF2] dark:border-[#2A1A3A] bg-white dark:bg-[#120A1A] overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#EDE6F8] dark:bg-[#030407]"><TableRow><TableHead className="text-[#030407] dark:text-[#EDE6F8]">User</TableHead><TableHead className="text-[#030407] dark:text-[#EDE6F8]">Email</TableHead><TableHead className="text-[#030407] dark:text-[#EDE6F8]">Role</TableHead></TableRow></TableHeader>
              <TableBody>
                {isLoading ? <TableRow><TableCell colSpan={3} className="py-8 text-center">Loading…</TableCell></TableRow> :
                 list.length===0 ? <TableRow><TableCell colSpan={3} className="py-8 text-center text-[#494070] dark:text-[#494070]">No users</TableCell></TableRow> :
                 list.map((u:any)=>(
                  <TableRow key={u.uuid||u.id} className="hover:bg-[#EDE6F8]/40 dark:hover:bg-[#1A1025]/40">
                    <TableCell className="text-sm text-[#030407] dark:text-[#EDE6F8]">{u.username||u.name||"—"}</TableCell>
                    <TableCell className="text-xs text-[#494070] dark:text-[#494070]">{u.email||"—"}</TableCell>
                    <TableCell><Badge className="rounded-full bg-[#EDE6F8] dark:bg-[#1A1025] text-[#DF3FFA] border-0">{u.role||role}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}

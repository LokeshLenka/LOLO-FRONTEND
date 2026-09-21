import { AdminHeader } from "@/layouts/admin/AdminHeader";
import { useAdminUsers } from "@/hooks/admin/useAdminUsers";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
export default function AdminApprovals(){
  const { users, refresh } = useAdminUsers(1, { status:"pending" } as any, 10);
  const pending = users.filter(u=>!u.is_approved);
  return (
    <div className="pb-10">
      <AdminHeader title="Approvals" subtitle="Pending approvals — approve/reject with remarks" onRefresh={refresh}/>
      <div className="px-4 lg:px-8 py-6">
        <Card className="rounded-none border-[#BFE9E0] bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#EAF6F4]"><TableRow><TableHead className="text-[#17463C]">User</TableHead><TableHead className="text-[#17463C]">Role</TableHead><TableHead className="text-[#17463C]">Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {pending.map(u=>{const p:any=u.profile||{}; return <TableRow key={u.uuid}><TableCell className="text-sm text-[#17463C]">{p.first_name||u.username} • {u.email}</TableCell><TableCell><Badge className="rounded-full bg-[#EAF6F4] text-[#1E8277] border-0">{u.role}</Badge></TableCell><TableCell><Badge className="rounded-full bg-[#FFFAEB] text-[#B54708] border-[#FEDF89]">{u.user_approval?.status||"pending"}</Badge></TableCell></TableRow>})}
                {pending.length===0 && <TableRow><TableCell colSpan={3} className="text-center py-8 text-[#4A7A6E]">No pending approvals — all caught up!</TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
          <div className="p-3 border-t border-[#BFE9E0] bg-[#EAF6F4] text-xs text-[#4A7A6E]">Use the Users page for approve/reject actions with remarks. This view is filtered to pending only for focus.</div>
        </Card>
      </div>
    </div>
  );
}

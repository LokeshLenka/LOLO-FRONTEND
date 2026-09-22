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
        <Card className="rounded-none border-[#D9CEF2] bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#EDE6F8]"><TableRow><TableHead className="text-[#030407]">User</TableHead><TableHead className="text-[#030407]">Role</TableHead><TableHead className="text-[#030407]">Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {pending.map(u=>{const p:any=u.profile||{}; return <TableRow key={u.uuid}><TableCell className="text-sm text-[#030407]">{p.first_name||u.username} • {u.email}</TableCell><TableCell><Badge className="rounded-full bg-[#EDE6F8] text-[#DF3FFA] border-0">{u.role}</Badge></TableCell><TableCell><Badge className="rounded-full bg-[#FFFAEB] text-[#B54708] border-[#FEDF89]">{u.user_approval?.status||"pending"}</Badge></TableCell></TableRow>})}
                {pending.length===0 && <TableRow><TableCell colSpan={3} className="text-center py-8 text-[#494070]">No pending approvals — all caught up!</TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
          <div className="p-3 border-t border-[#D9CEF2] bg-[#EDE6F8] text-xs text-[#494070]">Use the Users page for approve/reject actions with remarks. This view is filtered to pending only for focus.</div>
        </Card>
      </div>
    </div>
  );
}

import { AdminHeader } from "@/layouts/admin/AdminHeader";
import { useAdminTeam } from "@/hooks/admin/useAdminResources";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminTeam(){
  const { list, isLoading, create, update, remove } = useAdminTeam();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any|null>(null);
  const [form, setForm] = useState({ name:"", role:"", bio:"", image_url:"" });
  const onSubmit = async () => {
    if(editing) await update(editing.uuid || editing.id, form);
    else await create(form);
    setOpen(false); setEditing(null); setForm({name:"",role:"",bio:"",image_url:""});
  };
  const startEdit = (row:any) => { setEditing(row); setForm({ name: row.name||row.title||"", role: row.role||"", bio: row.bio||row.description||"", image_url: row.image_url||"" }); setOpen(true); };
  return (
    <div className="pb-10">
      <AdminHeader title="Team Profiles" subtitle="CRUD — GET /admin/team-profile • POST • PUT • DELETE" />
      <div className="px-4 lg:px-8 py-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-[#494070] dark:text-[#494070]">{list.length} profiles • manage public team showcase</div>
          <Button onClick={()=>{setEditing(null); setForm({name:"",role:"",bio:"",image_url:""}); setOpen(true);}} className="rounded-none bg-[#DF3FFA] hover:bg-[#030407] text-white"><Plus size={14}/> Add member</Button>
        </div>
        <Card className="rounded-none border-[#D9CEF2] dark:border-[#2A1A3A] bg-white dark:bg-[#120A1A] overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#EDE6F8] dark:bg-[#030407]"><TableRow><TableHead className="text-[#030407] dark:text-[#EDE6F8]">Name</TableHead><TableHead className="text-[#030407] dark:text-[#EDE6F8]">Role</TableHead><TableHead className="text-[#030407] dark:text-[#EDE6F8]">Bio</TableHead><TableHead className="text-right text-[#030407] dark:text-[#EDE6F8]">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {isLoading ? <TableRow><TableCell colSpan={4} className="py-8 text-center text-[#494070]">Loading…</TableCell></TableRow> :
                 list.length===0 ? <TableRow><TableCell colSpan={4} className="py-8 text-center text-[#494070] dark:text-[#494070]">No team profiles yet — create one.</TableCell></TableRow> :
                 list.map((r:any)=>(
                  <TableRow key={r.uuid||r.id} className="hover:bg-[#EDE6F8]/50 dark:hover:bg-[#1A1025]/50">
                    <TableCell className="font-medium text-[#030407] dark:text-[#EDE6F8]">{r.name||r.title||"—"}</TableCell>
                    <TableCell><Badge className="rounded-full bg-[#EDE6F8] dark:bg-[#1A1025] text-[#DF3FFA] border-0">{r.role||"member"}</Badge></TableCell>
                    <TableCell className="text-xs text-[#494070] dark:text-[#494070] max-w-[400px] truncate">{r.bio||r.description||"—"}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button size="sm" variant="outline" onClick={()=>startEdit(r)} className="rounded-none border-[#D9CEF2] dark:border-[#2A1A3A]"><Pencil size={12}/></Button>
                      <Button size="sm" variant="outline" onClick={()=>remove(r.uuid||r.id)} className="rounded-none border-[#D9CEF2] text-red-600"><Trash2 size={12}/></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
      <Dialog open={open} onOpenChange={o=>!o && setOpen(false)}>
        <DialogContent className="rounded-none bg-white dark:bg-[#120A1A] border-[#D9CEF2] dark:border-[#2A1A3A]">
          <DialogHeader><DialogTitle className="text-[#030407] dark:text-[#EDE6F8]">{editing?"Edit":"Create"} team profile</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <Input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="rounded-none bg-[#EDE6F8] dark:bg-[#030407] border-[#D9CEF2] dark:border-[#2A1A3A]"/>
            <Input placeholder="Role (e.g. President)" value={form.role} onChange={e=>setForm({...form,role:e.target.value})} className="rounded-none bg-[#EDE6F8] dark:bg-[#030407] border-[#D9CEF2] dark:border-[#2A1A3A]"/>
            <Input placeholder="Image URL" value={form.image_url} onChange={e=>setForm({...form,image_url:e.target.value})} className="rounded-none bg-[#EDE6F8] dark:bg-[#030407] border-[#D9CEF2] dark:border-[#2A1A3A]"/>
            <Textarea placeholder="Bio" value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} className="rounded-none bg-[#EDE6F8] dark:bg-[#030407] border-[#D9CEF2] dark:border-[#2A1A3A]" rows={4}/>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setOpen(false)} className="rounded-none border-[#D9CEF2]">Cancel</Button>
            <Button onClick={onSubmit} className="rounded-none bg-[#DF3FFA] text-white">{editing?"Update":"Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

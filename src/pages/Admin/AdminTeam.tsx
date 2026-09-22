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
          <div className="text-sm text-[var(--admin-ink-muted)] ">{list.length} profiles • manage public team showcase</div>
          <Button onClick={()=>{setEditing(null); setForm({name:"",role:"",bio:"",image_url:""}); setOpen(true);}} className="rounded-none bg-[var(--admin-accent)] hover:bg-[var(--admin-accent)] text-white"><Plus size={14}/> Add member</Button>
        </div>
        <Card className="rounded-none border-[var(--admin-line)]  bg-[var(--admin-surface)] overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[var(--admin-canvas)]"><TableRow><TableHead className="text-[var(--admin-ink)] ">Name</TableHead><TableHead className="text-[var(--admin-ink)] ">Role</TableHead><TableHead className="text-[var(--admin-ink)] ">Bio</TableHead><TableHead className="text-right text-[var(--admin-ink)] ">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {isLoading ? <TableRow><TableCell colSpan={4} className="py-8 text-center text-[var(--admin-ink-muted)]">Loading…</TableCell></TableRow> :
                 list.length===0 ? <TableRow><TableCell colSpan={4} className="py-8 text-center text-[var(--admin-ink-muted)] ">No team profiles yet — create one.</TableCell></TableRow> :
                 list.map((r:any)=>(
                  <TableRow key={r.uuid||r.id} className="hover:bg-[var(--admin-canvas)]/50 dark:hover:bg-[#1A1025]/50">
                    <TableCell className="font-medium text-[var(--admin-ink)] ">{r.name||r.title||"—"}</TableCell>
                    <TableCell><Badge className="rounded-full bg-[var(--admin-canvas)] text-[var(--admin-ink)] border-0">{r.role||"member"}</Badge></TableCell>
                    <TableCell className="text-xs text-[var(--admin-ink-muted)]  max-w-[400px] truncate">{r.bio||r.description||"—"}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button size="sm" variant="outline" onClick={()=>startEdit(r)} className="rounded-none border-[var(--admin-line)] "><Pencil size={12}/></Button>
                      <Button size="sm" variant="outline" onClick={()=>remove(r.uuid||r.id)} className="rounded-none border-[var(--admin-line)] text-red-600"><Trash2 size={12}/></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
      <Dialog open={open} onOpenChange={o=>!o && setOpen(false)}>
        <DialogContent className="rounded-none bg-[var(--admin-surface)] border-[var(--admin-line)] ">
          <DialogHeader><DialogTitle className="text-[var(--admin-ink)] ">{editing?"Edit":"Create"} team profile</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <Input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="rounded-none bg-[var(--admin-canvas)] border-[var(--admin-line)] "/>
            <Input placeholder="Role (e.g. President)" value={form.role} onChange={e=>setForm({...form,role:e.target.value})} className="rounded-none bg-[var(--admin-canvas)] border-[var(--admin-line)] "/>
            <Input placeholder="Image URL" value={form.image_url} onChange={e=>setForm({...form,image_url:e.target.value})} className="rounded-none bg-[var(--admin-canvas)] border-[var(--admin-line)] "/>
            <Textarea placeholder="Bio" value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} className="rounded-none bg-[var(--admin-canvas)] border-[var(--admin-line)] " rows={4}/>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setOpen(false)} className="rounded-none border-[var(--admin-line)]">Cancel</Button>
            <Button onClick={onSubmit} className="rounded-none bg-[var(--admin-accent)] text-white">{editing?"Update":"Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

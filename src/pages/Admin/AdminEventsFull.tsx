import { AdminHeader } from "@/layouts/admin/AdminHeader";
import { useAdminEvents } from "@/hooks/admin/useAdminResources";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminEventsFull(){
  const { events, isLoading, createEvent, updateEvent, deleteEvent } = useAdminEvents();
  const [open,setOpen]=useState(false);
  const [editing,setEditing]=useState<any|null>(null);
  const [form,setForm]=useState({ title:"", description:"", venue:"", event_type:"club", start_date:"", end_date:"", max_participants:"100" });
  const submit = async()=>{ if(editing) await updateEvent(editing.uuid||editing.id, form); else await createEvent(form); setOpen(false); setEditing(null); };
  const edit = (r:any)=>{ setEditing(r); setForm({ title:r.title||r.name||"", description:r.description||"", venue:r.venue||"", event_type:r.event_type||"club", start_date: r.start_date?.slice(0,16)||"", end_date: r.end_date?.slice(0,16)||"", max_participants: String(r.max_participants||100)}); setOpen(true); };
  return (
    <div className="pb-10">
      <AdminHeader title="Events" subtitle="Admin event control — POST /admin/event (create_events) • PUT/DELETE /admin/event/:id (manage_events)" />
      <div className="px-4 lg:px-8 py-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-[#4A7A6E] dark:text-[#91E9D7]">{events.length} events • create and manage</div>
          <Button onClick={()=>{setEditing(null); setForm({title:"",description:"",venue:"",event_type:"club",start_date:"",end_date:"",max_participants:"100"}); setOpen(true);}} className="rounded-none bg-[#1E8277] hover:bg-[#17463C] text-white"><Plus size={14}/> Create event</Button>
        </div>
        <Card className="rounded-none border-[#BFE9E0] dark:border-[#1E3D32] bg-white dark:bg-[#14261F] overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#EAF6F4] dark:bg-[#0F1F1A]"><TableRow><TableHead className="text-[#17463C] dark:text-[#EAF6F4]">Title</TableHead><TableHead className="text-[#17463C] dark:text-[#EAF6F4]">Type</TableHead><TableHead className="text-[#17463C] dark:text-[#EAF6F4]">Venue</TableHead><TableHead className="text-[#17463C] dark:text-[#EAF6F4]">Dates</TableHead><TableHead className="text-right text-[#17463C] dark:text-[#EAF6F4]">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {isLoading ? <TableRow><TableCell colSpan={5} className="py-8 text-center">Loading…</TableCell></TableRow> :
                 events.length===0 ? <TableRow><TableCell colSpan={5} className="py-8 text-center text-[#4A7A6E] dark:text-[#91E9D7]">No events — create one to manage.</TableCell></TableRow> :
                 events.map((e:any)=>(
                  <TableRow key={e.uuid||e.id} className="hover:bg-[#EAF6F4]/40 dark:hover:bg-[#1B342D]/40">
                    <TableCell className="font-medium text-[#17463C] dark:text-[#EAF6F4]">{e.title||e.name||e.slug||"—"}</TableCell>
                    <TableCell><Badge className="rounded-full bg-[#EAF6F4] dark:bg-[#1B342D] text-[#1E8277] border-0">{e.event_type||e.type||"club"}</Badge></TableCell>
                    <TableCell className="text-xs text-[#4A7A6E] dark:text-[#91E9D7]">{e.venue||"—"}</TableCell>
                    <TableCell className="text-xs text-[#4A7A6E] dark:text-[#91E9D7]">{(e.start_date||"").slice(0,10)} → {(e.end_date||"").slice(0,10)}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button size="sm" variant="outline" onClick={()=>edit(e)} className="rounded-none border-[#BFE9E0] dark:border-[#1E3D32]"><Pencil size={12}/></Button>
                      <Button size="sm" variant="outline" onClick={()=>deleteEvent(e.uuid||e.id)} className="rounded-none border-[#BFE9E0] text-red-600"><Trash2 size={12}/></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
      <Dialog open={open} onOpenChange={o=>!o&&setOpen(false)}>
        <DialogContent className="rounded-none bg-white dark:bg-[#14261F] border-[#BFE9E0] dark:border-[#1E3D32] max-w-2xl">
          <DialogHeader><DialogTitle className="text-[#17463C] dark:text-[#EAF6F4]">{editing?"Edit":"Create"} event</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <Input placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="rounded-none bg-[#EAF6F4] dark:bg-[#0F1F1A] border-[#BFE9E0] dark:border-[#1E3D32]"/>
            <Textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="rounded-none bg-[#EAF6F4] dark:bg-[#0F1F1A] border-[#BFE9E0] dark:border-[#1E3D32]" rows={3}/>
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="Venue" value={form.venue} onChange={e=>setForm({...form,venue:e.target.value})} className="rounded-none bg-[#EAF6F4] dark:bg-[#0F1F1A] border-[#BFE9E0]"/>
              <Input placeholder="Type (club/music)" value={form.event_type} onChange={e=>setForm({...form,event_type:e.target.value})} className="rounded-none bg-[#EAF6F4] dark:bg-[#0F1F1A] border-[#BFE9E0]"/>
              <Input type="datetime-local" value={form.start_date} onChange={e=>setForm({...form,start_date:e.target.value})} className="rounded-none"/>
              <Input type="datetime-local" value={form.end_date} onChange={e=>setForm({...form,end_date:e.target.value})} className="rounded-none"/>
              <Input placeholder="Max participants" value={form.max_participants} onChange={e=>setForm({...form,max_participants:e.target.value})} className="rounded-none"/>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setOpen(false)} className="rounded-none border-[#BFE9E0]">Cancel</Button>
            <Button onClick={submit} className="rounded-none bg-[#1E8277] text-white">{editing?"Update":"Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

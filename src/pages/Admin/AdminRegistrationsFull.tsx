import { AdminHeader } from "@/layouts/admin/AdminHeader";
import { useAdminRegistrations } from "@/hooks/admin/useAdminResources";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AdminExportMenu } from "@/components/admin/AdminExportMenu";

export default function AdminRegistrationsFull(){
  const [tab,setTab]=useState<"all"|"club"|"music">("all");
  const { rows, isLoading, refresh, updateClub, deleteClub, updateMusic, deleteMusic } = useAdminRegistrations(tab);
  const [editing,setEditing]=useState<any|null>(null);
  const [status,setStatus]=useState("confirmed");
  return (
    <div className="pb-10">
      <AdminHeader title="Event Registrations" subtitle="Admin — GET /admin/event-registrations • /admin/club/event-registrations • /admin/music/event-registrations • PUT/DELETE" onRefresh={refresh}/>
      <div className="px-4 lg:px-8 py-6 space-y-4">
        <div className="flex gap-2">
          {(["all","club","music"] as const).map(t=>(
            <Button key={t} variant={tab===t?"default":"outline"} onClick={()=>setTab(t)} className={`rounded-none ${tab===t?"bg-[var(--admin-accent)] text-white":"border-[var(--admin-line)]  text-[var(--admin-ink)] "}`}>{t.toUpperCase()}</Button>
          ))}
          <div className="ml-auto"><AdminExportMenu users={rows as any} filenamePrefix={`registrations-${tab}`} disabled={rows.length===0}/></div>
        </div>
        <Card className="rounded-none border-[var(--admin-line)]  bg-[var(--admin-surface)] overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[var(--admin-canvas)]"><TableRow><TableHead className="text-[var(--admin-ink)] ">Event</TableHead><TableHead className="text-[var(--admin-ink)] ">User</TableHead><TableHead className="text-[var(--admin-ink)] ">Status</TableHead><TableHead className="text-right text-[var(--admin-ink)] ">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {isLoading ? <TableRow><TableCell colSpan={4} className="py-8 text-center">Loading…</TableCell></TableRow> :
                 rows.length===0 ? <TableRow><TableCell colSpan={4} className="py-8 text-center text-[var(--admin-ink-muted)] ">No registrations for {tab}</TableCell></TableRow> :
                 rows.map((r:any)=>(
                  <TableRow key={r.uuid||r.id} className="hover:bg-[var(--admin-canvas)]/40 dark:hover:bg-[#1A1025]/40">
                    <TableCell className="text-sm text-[var(--admin-ink)] ">{r.event?.title||r.event_title||r.event_id||"—"}</TableCell>
                    <TableCell className="text-xs text-[var(--admin-ink-muted)] ">{r.user?.username||r.user_id||r.email||"—"}</TableCell>
                    <TableCell><Badge className="rounded-full bg-[var(--admin-canvas)] text-[var(--admin-ink)] border-0 text-[11px]">{r.registration_status||r.status||"registered"}</Badge></TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button size="sm" variant="outline" onClick={()=>{setEditing(r); setStatus(r.registration_status||"confirmed");}} className="rounded-none border-[var(--admin-line)]"><Pencil size={12}/></Button>
                      <Button size="sm" variant="outline" onClick={()=> tab==="club"? deleteClub(r.uuid||r.id) : tab==="music"? deleteMusic(r.uuid||r.id) : deleteClub(r.uuid||r.id)} className="rounded-none border-[var(--admin-line)] text-red-600"><Trash2 size={12}/></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
        <div className="text-xs text-[var(--admin-ink-muted)] ">All registrations endpoint needs <code className="px-1 bg-[var(--admin-canvas)]">manage_events</code> ability. Club/Music edits require the matching event type.</div>
      </div>
      <Dialog open={!!editing} onOpenChange={o=>!o&&setEditing(null)}>
        <DialogContent className="rounded-none bg-[var(--admin-surface)] border-[var(--admin-line)] ">
          <DialogHeader><DialogTitle className="text-[var(--admin-ink)] ">Update registration</DialogTitle></DialogHeader>
          <Input value={status} onChange={e=>setStatus(e.target.value)} placeholder="registration_status" className="rounded-none"/>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setEditing(null)} className="rounded-none border-[var(--admin-line)]">Cancel</Button>
            <Button onClick={()=>{ if(!editing) return; if(tab==="club"||tab==="all") updateClub(editing.uuid||editing.id, { registration_status: status }); else updateMusic(editing.uuid||editing.id, { registration_status: status }); setEditing(null); }} className="rounded-none bg-[var(--admin-accent)] text-white">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

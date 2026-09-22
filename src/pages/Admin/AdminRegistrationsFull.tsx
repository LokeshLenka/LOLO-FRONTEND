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
            <Button key={t} variant={tab===t?"default":"outline"} onClick={()=>setTab(t)} className={`rounded-none ${tab===t?"bg-[#DF3FFA] text-white":"border-[#D9CEF2] dark:border-[#2A1A3A] text-[#030407] dark:text-[#EDE6F8]"}`}>{t.toUpperCase()}</Button>
          ))}
          <div className="ml-auto"><AdminExportMenu users={rows as any} filenamePrefix={`registrations-${tab}`} disabled={rows.length===0}/></div>
        </div>
        <Card className="rounded-none border-[#D9CEF2] dark:border-[#2A1A3A] bg-white dark:bg-[#120A1A] overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#EDE6F8] dark:bg-[#030407]"><TableRow><TableHead className="text-[#030407] dark:text-[#EDE6F8]">Event</TableHead><TableHead className="text-[#030407] dark:text-[#EDE6F8]">User</TableHead><TableHead className="text-[#030407] dark:text-[#EDE6F8]">Status</TableHead><TableHead className="text-right text-[#030407] dark:text-[#EDE6F8]">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {isLoading ? <TableRow><TableCell colSpan={4} className="py-8 text-center">Loading…</TableCell></TableRow> :
                 rows.length===0 ? <TableRow><TableCell colSpan={4} className="py-8 text-center text-[#494070] dark:text-[#494070]">No registrations for {tab}</TableCell></TableRow> :
                 rows.map((r:any)=>(
                  <TableRow key={r.uuid||r.id} className="hover:bg-[#EDE6F8]/40 dark:hover:bg-[#1A1025]/40">
                    <TableCell className="text-sm text-[#030407] dark:text-[#EDE6F8]">{r.event?.title||r.event_title||r.event_id||"—"}</TableCell>
                    <TableCell className="text-xs text-[#494070] dark:text-[#494070]">{r.user?.username||r.user_id||r.email||"—"}</TableCell>
                    <TableCell><Badge className="rounded-full bg-[#EDE6F8] dark:bg-[#1A1025] text-[#DF3FFA] border-0 text-[11px]">{r.registration_status||r.status||"registered"}</Badge></TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button size="sm" variant="outline" onClick={()=>{setEditing(r); setStatus(r.registration_status||"confirmed");}} className="rounded-none border-[#D9CEF2]"><Pencil size={12}/></Button>
                      <Button size="sm" variant="outline" onClick={()=> tab==="club"? deleteClub(r.uuid||r.id) : tab==="music"? deleteMusic(r.uuid||r.id) : deleteClub(r.uuid||r.id)} className="rounded-none border-[#D9CEF2] text-red-600"><Trash2 size={12}/></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
        <div className="text-xs text-[#494070] dark:text-[#494070]">All registrations endpoint needs <code className="px-1 bg-[#EDE6F8] dark:bg-[#1A1025]">manage_events</code> ability. Club/Music edits require the matching event type.</div>
      </div>
      <Dialog open={!!editing} onOpenChange={o=>!o&&setEditing(null)}>
        <DialogContent className="rounded-none bg-white dark:bg-[#120A1A] border-[#D9CEF2] dark:border-[#2A1A3A]">
          <DialogHeader><DialogTitle className="text-[#030407] dark:text-[#EDE6F8]">Update registration</DialogTitle></DialogHeader>
          <Input value={status} onChange={e=>setStatus(e.target.value)} placeholder="registration_status" className="rounded-none"/>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setEditing(null)} className="rounded-none border-[#D9CEF2]">Cancel</Button>
            <Button onClick={()=>{ if(!editing) return; if(tab==="club"||tab==="all") updateClub(editing.uuid||editing.id, { registration_status: status }); else updateMusic(editing.uuid||editing.id, { registration_status: status }); setEditing(null); }} className="rounded-none bg-[#DF3FFA] text-white">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

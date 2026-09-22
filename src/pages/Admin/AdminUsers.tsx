import { useState, useMemo } from "react";
import { useAdminUsers } from "@/hooks/admin/useAdminUsers";
import { AdminHeader } from "@/layouts/admin/AdminHeader";
import { AdminFilters } from "@/components/admin/AdminFilters";
import type { AdminFilterValues } from "@/components/admin/AdminFilters";
import { AdminExportMenu } from "@/components/admin/AdminExportMenu";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { MoreHorizontal, Eye, Trash2, ShieldCheck, ShieldMinus, CheckCircle, XCircle, Unlock, ChevronLeft, ChevronRight, Users as UsersIcon } from "lucide-react";

export default function AdminUsers() {
  const [filters, setFilters] = useState<AdminFilterValues>({});
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const { users, meta, isLoading, isError, page, setPage, promoteUser, demoteUser, approveUser, rejectUser, deleteUser, clearLock, refresh } = useAdminUsers(1, filters as any, 15);

  const [viewUser, setViewUser] = useState<any | null>(null);
  const [actionUser, setActionUser] = useState<any | null>(null);
  const [actionType, setActionType] = useState<"approve"|"reject"|"delete"|"promote-ebm"|"promote-cm"|"promote-mh"|"demote"|"unlock"|null>(null);
  const [remarks, setRemarks] = useState("Approved by admin — verified");

  const allIds = users.map(u=>u.uuid);
  const allSelected = allIds.length>0 && allIds.every(id=>selected.has(id));
  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(allIds));
  };
  const toggleOne = (id:string) => {
    const s = new Set(selected);
    if (s.has(id)) s.delete(id); else s.add(id);
    setSelected(s);
  };
  const selectedUsers = useMemo(()=> users.filter(u=>selected.has(u.uuid)), [users, selected]);

  const confirmAction = async () => {
    if (!actionUser || !actionType) return;
    if (actionType==="approve") await approveUser(actionUser.uuid, remarks);
    if (actionType==="reject") await rejectUser(actionUser.uuid, remarks);
    if (actionType==="delete") await deleteUser(actionUser.uuid);
    if (actionType==="promote-ebm") await promoteUser(actionUser.uuid, "ebm");
    if (actionType==="promote-cm") await promoteUser(actionUser.uuid, "credit-manager");
    if (actionType==="promote-mh") await promoteUser(actionUser.uuid, "membership-head");
    if (actionType==="demote") await demoteUser(actionUser.uuid);
    if (actionType==="unlock") await clearLock(actionUser.uuid);
    setActionType(null); setActionUser(null);
  };

  const totalPages = meta?.last_page || 1;

  return (
    <div className="pb-10">
      <AdminHeader title="User Management" subtitle={`${meta?.total ?? users.length} total • selection-aware export • audited actions`} onRefresh={refresh} />
      <div className="px-4 lg:px-8 py-6 space-y-4">
        <div className="flex flex-col lg:flex-row gap-3 justify-between">
          <div className="flex-1"><AdminFilters values={filters} onChange={setFilters} onReset={()=>setFilters({})} /></div>
          <div className="flex gap-2 shrink-0">
            <AdminExportMenu users={selectedUsers.length ? selectedUsers : users} disabled={users.length===0} filenamePrefix={selectedUsers.length ? "lolo-admin-selected" : "lolo-admin-users"} />
            <Button variant="outline" onClick={refresh} className="rounded-none border-[var(--admin-line)] text-[var(--admin-ink)] h-9 hidden sm:flex">Refresh</Button>
          </div>
        </div>

        {selected.size>0 && (
          <Card className="rounded-none border border-[var(--admin-line)] bg-[var(--admin-canvas)]">
            <CardContent className="p-3 flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-[var(--admin-ink)] flex items-center gap-2"><UsersIcon size={16}/> {selected.size} selected</div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={()=>setSelected(new Set())} className="rounded-none border-[var(--admin-line)]">Clear</Button>
                <AdminExportMenu users={selectedUsers} filenamePrefix="lolo-admin-selected" />
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="rounded-none border border-[var(--admin-line)] bg-[var(--admin-surface)] overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[var(--admin-canvas)]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[44px]"><Checkbox checked={allSelected} onCheckedChange={toggleAll} /></TableHead>
                  <TableHead className="text-[var(--admin-ink)]">Member</TableHead>
                  <TableHead className="text-[var(--admin-ink)]">Username</TableHead>
                  <TableHead className="text-[var(--admin-ink)]">Academic</TableHead>
                  <TableHead className="text-[var(--admin-ink)]">Role</TableHead>
                  <TableHead className="text-[var(--admin-ink)]">Status</TableHead>
                  <TableHead className="text-right text-[var(--admin-ink)]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(6)].map((_,i)=><TableRow key={i}><TableCell colSpan={7} className="h-12"><div className="h-4 bg-[var(--admin-canvas)] rounded-none animate-pulse"/></TableCell></TableRow>)
                ) : isError ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-8 text-[var(--admin-ink)]">Failed to load users</TableCell></TableRow>
                ) : users.length===0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-8 text-[var(--admin-ink-muted)]">No users match filters</TableCell></TableRow>
                ) : users.map((u)=>{
                  const p:any = u.profile || (u as any).managementProfile || (u as any).musicProfile || {};
                  const name = p.first_name ? `${p.first_name} ${p.last_name||""}`.trim() : u.username;
                  return (
                    <TableRow key={u.uuid} className="hover:bg-[var(--admin-canvas)]/50">
                      <TableCell><Checkbox checked={selected.has(u.uuid)} onCheckedChange={()=>toggleOne(u.uuid)} /></TableCell>
                      <TableCell>
                        <div className="font-medium text-[var(--admin-ink)] text-sm">{name}</div>
                        <div className="text-xs text-[var(--admin-ink-muted)] truncate max-w-[220px]">{u.email} • {p.phone_no||"—"}</div>
                      </TableCell>
                      <TableCell className="text-sm font-medium text-[var(--admin-ink)]">{u.username}</TableCell>
                      <TableCell>
                        <div className="text-sm text-[var(--admin-ink)]">{p.branch||"—"}</div>
                        <div className="text-xs text-[var(--admin-ink-muted)]">{p.year? `${p.year} Year` : ""} {p.reg_num? `• ${p.reg_num}`:""}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className="rounded-full bg-[var(--admin-canvas)] text-[var(--admin-ink)] border border-[var(--admin-line)] text-[11px]">{u.role}</Badge>
                        {p.sub_role && <div className="text-[11px] text-[var(--admin-ink-muted)] mt-1">{p.sub_role.replace(/_/g," ")}</div>}
                        {u.promoted_role && <Badge className="mt-1 rounded-full bg-[var(--admin-accent)] text-[var(--admin-accent-fg)] border-0 text-[10px]">{u.promoted_role.replace(/_/g," ")}</Badge>}
                      </TableCell>
                      <TableCell>
                        {u.is_approved ? <Badge className="rounded-full bg-[var(--admin-pale-green-bg)] text-[var(--admin-pale-green-fg)] border-0">Approved</Badge> : <Badge className="rounded-full bg-[var(--admin-pale-yellow-bg)] text-[var(--admin-pale-yellow-fg)] border-0">Pending</Badge>}
                        <div className="text-[11px] text-[var(--admin-ink-muted)] mt-1">{u.user_approval?.status?.replace(/_/g," ") || "—"}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 rounded-none"><MoreHorizontal size={16}/></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 rounded-none border-[var(--admin-line)] bg-[var(--admin-surface)]">
                            <DropdownMenuLabel className="text-[11px] uppercase tracking-widest text-[var(--admin-ink-muted)]">Manage</DropdownMenuLabel>
                            <DropdownMenuItem onClick={()=>setViewUser(u)} className="gap-2"><Eye size={14}/> View details</DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-[var(--admin-line)]"/>
                            <DropdownMenuItem onClick={()=>{setActionUser(u); setActionType("approve");}} className="gap-2"><CheckCircle size={14} className="text-[var(--admin-pale-green-fg)]"/> Approve</DropdownMenuItem>
                            <DropdownMenuItem onClick={()=>{setActionUser(u); setActionType("reject");}} className="gap-2"><XCircle size={14}/> Reject</DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-[var(--admin-line)]"/>
                            <DropdownMenuItem onClick={()=>{setActionUser(u); setActionType("promote-ebm");}}><ShieldCheck size={14} className="mr-2"/> Promote to EBM</DropdownMenuItem>
                            <DropdownMenuItem onClick={()=>{setActionUser(u); setActionType("promote-cm");}}><ShieldCheck size={14} className="mr-2"/> Promote to Credit Mgr</DropdownMenuItem>
                            <DropdownMenuItem onClick={()=>{setActionUser(u); setActionType("promote-mh");}}><ShieldCheck size={14} className="mr-2"/> Promote to MH</DropdownMenuItem>
                            <DropdownMenuItem onClick={()=>{setActionUser(u); setActionType("demote");}}><ShieldMinus size={14} className="mr-2"/> Revoke promotion</DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-[var(--admin-line)]"/>
                            <DropdownMenuItem onClick={()=>{setActionUser(u); setActionType("unlock");}} className="gap-2"><Unlock size={14}/> Unlock account</DropdownMenuItem>
                            <DropdownMenuItem onClick={()=>{setActionUser(u); setActionType("delete");}} className="text-[var(--admin-pale-red-fg)] gap-2"><Trash2 size={14}/> Delete user</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between p-3 border-t border-[var(--admin-line)] bg-[var(--admin-canvas)]">
            <div className="text-xs text-[var(--admin-ink-muted)]">Page {meta?.current_page || page} of {totalPages} • {meta?.total ?? users.length} total</div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))} className="rounded-none border-[var(--admin-line)]"><ChevronLeft size={14}/> Prev</Button>
              <Button variant="outline" size="sm" disabled={page>=totalPages} onClick={()=>setPage(p=>p+1)} className="rounded-none border-[var(--admin-line)]">Next <ChevronRight size={14}/></Button>
            </div>
          </div>
        </Card>

        <Card className="rounded-none border border-[var(--admin-line)] bg-[var(--admin-surface)] p-4">
          <div className="text-sm font-bold text-[var(--admin-ink)]" style={{letterSpacing:"-0.02em"}}>Data Management & Export</div>
          <p className="text-xs text-[var(--admin-ink-muted)] mt-1 leading-relaxed">All filters are applied server-side. Export respects current selection: if no rows are selected, the current page will be exported. Use CSV for Excel/Sheets, JSON for automation, Print for PDF.</p>
          <ul className="text-xs text-[var(--admin-ink)] list-disc ml-5 mt-2 space-y-1">
            <li>Search supports name, email, reg no • filters combine with AND</li>
            <li>Promote/demote, approve/reject are audited and toast-confirmed</li>
            <li>Pagination is per_page=15 — use filters to narrow before export</li>
          </ul>
        </Card>
      </div>

      <Dialog open={!!viewUser} onOpenChange={(o)=>!o && setViewUser(null)}>
        <DialogContent className="max-w-2xl rounded-none border border-[var(--admin-line)] bg-[var(--admin-surface)]">
          <DialogHeader><DialogTitle className="text-[var(--admin-ink)]">Member details</DialogTitle></DialogHeader>
          {viewUser && (
            <div className="grid gap-3 text-sm">
              {(() => { const p:any = viewUser.profile || viewUser.managementProfile || viewUser.musicProfile || {}; return (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Name" value={`${p.first_name||""} ${p.last_name||""}`.trim() || viewUser.username} />
                    <Field label="Username" value={viewUser.username} />
                    <Field label="Email" value={viewUser.email} />
                    <Field label="Phone" value={p.phone_no||"—"} />
                    <Field label="Role" value={viewUser.role} />
                    <Field label="Sub role" value={p.sub_role||"—"} />
                    <Field label="Branch" value={p.branch||"—"} />
                    <Field label="Year" value={p.year||"—"} />
                    <Field label="Reg No" value={p.reg_num||"—"} />
                    <Field label="Promoted" value={viewUser.promoted_role||"—"} />
                    <Field label="Approved" value={String(viewUser.is_approved)} />
                    <Field label="Active" value={String(viewUser.is_active)} />
                  </div>
                  <div className="rounded-none bg-[var(--admin-canvas)] border border-[var(--admin-line)] p-3">
                    <div className="text-xs font-bold uppercase tracking-widest text-[var(--admin-ink-muted)]">Approval</div>
                    <div className="text-sm text-[var(--admin-ink)] mt-1">Status: {viewUser.user_approval?.status || "—"}</div>
                    <div className="text-sm text-[var(--admin-ink-muted)]">Remarks: {viewUser.user_approval?.remarks || "—"}</div>
                  </div>
                </>
              ); })()}
            </div>
          )}
          <DialogFooter><Button onClick={()=>setViewUser(null)} className="rounded-none bg-[var(--admin-accent)] text-[var(--admin-accent-fg)]">Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!actionType} onOpenChange={(o)=>!o && setActionType(null)}>
        <DialogContent className="rounded-none border border-[var(--admin-line)] bg-[var(--admin-surface)]">
          <DialogHeader><DialogTitle className="text-[var(--admin-ink)] capitalize">{actionType?.replace(/-/g," ")}</DialogTitle></DialogHeader>
          {actionUser && <p className="text-sm text-[var(--admin-ink-muted)]">Confirm <b className="text-[var(--admin-ink)]">{actionType}</b> for <b className="text-[var(--admin-ink)]">{actionUser.username}</b> ?</p>}
          {(actionType==="approve" || actionType==="reject") && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[var(--admin-ink)]">Remarks</label>
              <Textarea value={remarks} onChange={e=>setRemarks(e.target.value)} className="rounded-none border-[var(--admin-line)] bg-[var(--admin-canvas)]" rows={3}/>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={()=>setActionType(null)} className="rounded-none border-[var(--admin-line)]">Cancel</Button>
            <Button onClick={confirmAction} className="rounded-none bg-[var(--admin-accent)] text-[var(--admin-accent-fg)]">Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({label, value}:{label:string; value:string}) {
  return <div className="rounded-none border border-[var(--admin-line)] bg-[var(--admin-canvas)] p-3"><div className="text-[11px] font-bold uppercase tracking-widest text-[var(--admin-ink-muted)]">{label}</div><div className="text-sm font-medium text-[var(--admin-ink)] mt-1 break-all">{value}</div></div>;
}

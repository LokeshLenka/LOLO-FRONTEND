import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

export type AdminFilterValues = {
  search?: string;
  role?: string;
  status?: string;
  branch?: string;
  promoted_role?: string;
};

export function AdminFilters({ values, onChange, onReset }: { values: AdminFilterValues; onChange: (v: AdminFilterValues)=>void; onReset: ()=>void }) {
  const update = (k: keyof AdminFilterValues, v: string) => onChange({ ...values, [k]: v });
  return (
    <div className="flex flex-wrap gap-3 items-center p-3 rounded-none bg-[var(--admin-surface)] border border-[var(--admin-line)]">
      <div className="relative flex-1 min-w-[220px]">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-ink-muted)]"/>
        <Input placeholder="Search name, email, reg no..." value={values.search||""} onChange={e=>update("search", e.target.value)} className="pl-9 h-9 rounded-none bg-[var(--admin-canvas)] border-[var(--admin-line)]"/>
      </div>
      <Select value={values.role||"all"} onValueChange={v=>update("role", v)}>
        <SelectTrigger className="w-[150px] h-9 rounded-none bg-[var(--admin-canvas)] border-[var(--admin-line)]"><SelectValue placeholder="Role"/></SelectTrigger>
        <SelectContent className="rounded-none"><SelectItem value="all">All Roles</SelectItem><SelectItem value="management">Management</SelectItem><SelectItem value="music">Music</SelectItem></SelectContent>
      </Select>
      <Select value={values.status||"all"} onValueChange={v=>update("status", v)}>
        <SelectTrigger className="w-[160px] h-9 rounded-none bg-[var(--admin-canvas)] border-[var(--admin-line)]"><SelectValue placeholder="Status"/></SelectTrigger>
        <SelectContent className="rounded-none"><SelectItem value="all">All Status</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="approved">Approved</SelectItem><SelectItem value="rejected">Rejected</SelectItem><SelectItem value="membership_approved">MH Approved</SelectItem></SelectContent>
      </Select>
      <Select value={values.branch||"all"} onValueChange={v=>update("branch", v)}>
        <SelectTrigger className="w-[150px] h-9 rounded-none bg-[var(--admin-canvas)] border-[var(--admin-line)]"><SelectValue placeholder="Branch"/></SelectTrigger>
        <SelectContent className="rounded-none"><SelectItem value="all">All Branches</SelectItem><SelectItem value="CSE">CSE</SelectItem><SelectItem value="ECE">ECE</SelectItem><SelectItem value="IT">IT</SelectItem><SelectItem value="EEE">EEE</SelectItem><SelectItem value="MECH">MECH</SelectItem><SelectItem value="CIVIL">CIVIL</SelectItem></SelectContent>
      </Select>
      <Select value={values.promoted_role||"all"} onValueChange={v=>update("promoted_role", v)}>
        <SelectTrigger className="w-[170px] h-9 rounded-none bg-[var(--admin-canvas)] border-[var(--admin-line)]"><SelectValue placeholder="Promoted"/></SelectTrigger>
        <SelectContent className="rounded-none"><SelectItem value="all">All Elevated</SelectItem><SelectItem value="executive_body_member">EBM</SelectItem><SelectItem value="membership_head">MH</SelectItem><SelectItem value="credit_manager">Credit Mgr</SelectItem></SelectContent>
      </Select>
      <Button variant="outline" onClick={onReset} className="h-9 rounded-none border-[var(--admin-line)] text-[var(--admin-ink)] hover:bg-[var(--admin-canvas)]"><X size={14}/> Clear</Button>
    </div>
  );
}

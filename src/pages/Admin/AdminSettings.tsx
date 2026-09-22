import { AdminHeader } from "@/layouts/admin/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { adminResetPassword } from "@/hooks/admin/useAdminResources";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";

export default function AdminSettings(){
  const { user } = useAuth();
  const [uuid,setUuid]=useState("");
  const [pwd,setPwd]=useState("");
  const [pwd2,setPwd2]=useState("");
  return (
    <div className="pb-10">
      <AdminHeader title="Settings & System" subtitle="Admin controls — POST /admin/reset-password/:user • audit & health" />
      <div className="px-4 lg:px-8 py-6 grid gap-4 lg:grid-cols-2">
        <Card className="rounded-none border-[var(--admin-line)]  bg-[var(--admin-surface)]">
          <CardHeader><CardTitle className="text-sm font-bold text-[var(--admin-ink)] ">Reset user password</CardTitle><p className="text-xs text-[var(--admin-ink-muted)] ">POST /admin/reset-password/:user — requires password + password_confirmation (min 8)</p></CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="User UUID" value={uuid} onChange={e=>setUuid(e.target.value)} className="rounded-none bg-[var(--admin-canvas)] border-[var(--admin-line)] "/>
            <Input placeholder="New password" type="password" value={pwd} onChange={e=>setPwd(e.target.value)} className="rounded-none bg-[var(--admin-canvas)] border-[var(--admin-line)] "/>
            <Input placeholder="Confirm password" type="password" value={pwd2} onChange={e=>setPwd2(e.target.value)} className="rounded-none bg-[var(--admin-canvas)] border-[var(--admin-line)] "/>
            <Button onClick={()=>adminResetPassword(uuid,pwd,pwd2)} disabled={!uuid||!pwd||pwd!==pwd2} className="rounded-none bg-[var(--admin-accent)] hover:bg-[var(--admin-accent)] text-white">Reset password</Button>
          </CardContent>
        </Card>
        <Card className="rounded-none border-[var(--admin-line)]  bg-[var(--admin-surface)]">
          <CardHeader><CardTitle className="text-sm font-bold text-[var(--admin-ink)] ">System & Design</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-[var(--admin-ink-muted)] ">Admin palette</span><Badge className="rounded-none bg-[var(--admin-canvas)] text-[var(--admin-ink)] border-[var(--admin-line)]">#F7F6F3 • #EAEAEA • #111111 • #787774</Badge></div>
            <div className="flex justify-between"><span className="text-[var(--admin-ink-muted)] ">Radius</span><Badge className="rounded-none bg-[var(--admin-accent)] text-white">rounded-none</Badge></div>
            <div className="flex justify-between"><span className="text-[var(--admin-ink-muted)] ">Dark mode</span><Badge className="rounded-none bg-[var(--admin-canvas)] text-[var(--admin-ink)]">Toggle in header (Sun/Moon)</Badge></div>
            <div className="rounded-none bg-[var(--admin-canvas)] border border-[var(--admin-line)]  p-3 text-xs text-[var(--admin-ink)] ">
              <div className="font-bold">Signed in as</div>
              <div className="text-[var(--admin-ink-muted)] ">{user?.username} • {user?.email}</div>
              <div className="mt-2 text-[11px] uppercase tracking-widest text-[var(--admin-ink)]">All admin pages use shadcn base components only — no cross-role reuse • border 1px •</div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-none border-[var(--admin-line)]  bg-[var(--admin-surface)] lg:col-span-2">
          <CardContent className="p-6 text-xs text-[var(--admin-ink-muted)] ">
            <div className="font-bold text-[var(--admin-ink)] ">Endpoint coverage</div>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li><code className="px-1 bg-[var(--admin-canvas)]">GET /admin/dashboard</code> — Overview KPIs</li>
              <li><code className="px-1 bg-[var(--admin-canvas)]">/admin/users</code> — list/create/show/update/delete + stats/pending/by-role</li>
              <li><code className="px-1 bg-[var(--admin-canvas)]">approve/reject/unlock/promote/de-promote</code> — user workflow</li>
              <li><code className="px-1 bg-[var(--admin-canvas)]">/admin/team-profile</code> — team CRUD</li>
              <li><code className="px-1 bg-[var(--admin-canvas)]">/admin/user_approval</code> — approval records</li>
              <li><code className="px-1 bg-[var(--admin-canvas)]">/admin/event</code> — event create/manage</li>
              <li><code className="px-1 bg-[var(--admin-canvas)]">/admin/event-registrations</code> — all/club/music</li>
              <li><code className="px-1 bg-[var(--admin-canvas)]">POST /admin/copy-records</code> + <code className="px-1 bg-[var(--admin-canvas)]">PUT /verify-ticket</code></li>
              <li><code className="px-1 bg-[var(--admin-canvas)]">POST /admin/reset-password/:user</code></li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

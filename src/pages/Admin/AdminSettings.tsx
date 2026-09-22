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
        <Card className="rounded-none border-[#D9CEF2] dark:border-[#2A1A3A] bg-white dark:bg-[#120A1A]">
          <CardHeader><CardTitle className="text-sm font-bold text-[#030407] dark:text-[#EDE6F8]">Reset user password</CardTitle><p className="text-xs text-[#494070] dark:text-[#494070]">POST /admin/reset-password/:user — requires password + password_confirmation (min 8)</p></CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="User UUID" value={uuid} onChange={e=>setUuid(e.target.value)} className="rounded-none bg-[#EDE6F8] dark:bg-[#030407] border-[#D9CEF2] dark:border-[#2A1A3A]"/>
            <Input placeholder="New password" type="password" value={pwd} onChange={e=>setPwd(e.target.value)} className="rounded-none bg-[#EDE6F8] dark:bg-[#030407] border-[#D9CEF2] dark:border-[#2A1A3A]"/>
            <Input placeholder="Confirm password" type="password" value={pwd2} onChange={e=>setPwd2(e.target.value)} className="rounded-none bg-[#EDE6F8] dark:bg-[#030407] border-[#D9CEF2] dark:border-[#2A1A3A]"/>
            <Button onClick={()=>adminResetPassword(uuid,pwd,pwd2)} disabled={!uuid||!pwd||pwd!==pwd2} className="rounded-none bg-[#DF3FFA] hover:bg-[#030407] text-white">Reset password</Button>
          </CardContent>
        </Card>
        <Card className="rounded-none border-[#D9CEF2] dark:border-[#2A1A3A] bg-white dark:bg-[#120A1A]">
          <CardHeader><CardTitle className="text-sm font-bold text-[#030407] dark:text-[#EDE6F8]">System & Design</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-[#494070] dark:text-[#494070]">Admin palette</span><Badge className="rounded-none bg-[#EDE6F8] dark:bg-[#1A1025] text-[#DF3FFA] border-[#D9CEF2]">#EDE6F8 • #494070 • #DF3FFA • #DF3FFA • #030407</Badge></div>
            <div className="flex justify-between"><span className="text-[#494070] dark:text-[#494070]">Radius</span><Badge className="rounded-none bg-[#030407] text-white">rounded-none</Badge></div>
            <div className="flex justify-between"><span className="text-[#494070] dark:text-[#494070]">Dark mode</span><Badge className="rounded-none bg-[#EDE6F8] dark:bg-[#1A1025] text-[#DF3FFA]">Toggle in header (Sun/Moon)</Badge></div>
            <div className="rounded-none bg-[#EDE6F8] dark:bg-[#030407] border border-[#D9CEF2] dark:border-[#2A1A3A] p-3 text-xs text-[#030407] dark:text-[#EDE6F8]">
              <div className="font-bold">Signed in as</div>
              <div className="text-[#494070] dark:text-[#494070]">{user?.username} • {user?.email}</div>
              <div className="mt-2 text-[11px] uppercase tracking-widest text-[#DF3FFA]">All admin pages use shadcn base components only — no cross-role reuse • border 1px • shadow-sm</div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-none border-[#D9CEF2] dark:border-[#2A1A3A] bg-white dark:bg-[#120A1A] lg:col-span-2">
          <CardContent className="p-6 text-xs text-[#494070] dark:text-[#494070]">
            <div className="font-bold text-[#030407] dark:text-[#EDE6F8]">Endpoint coverage</div>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li><code className="px-1 bg-[#EDE6F8] dark:bg-[#1A1025]">GET /admin/dashboard</code> — Overview KPIs</li>
              <li><code className="px-1 bg-[#EDE6F8] dark:bg-[#1A1025]">/admin/users</code> — list/create/show/update/delete + stats/pending/by-role</li>
              <li><code className="px-1 bg-[#EDE6F8] dark:bg-[#1A1025]">approve/reject/unlock/promote/de-promote</code> — user workflow</li>
              <li><code className="px-1 bg-[#EDE6F8] dark:bg-[#1A1025]">/admin/team-profile</code> — team CRUD</li>
              <li><code className="px-1 bg-[#EDE6F8] dark:bg-[#1A1025]">/admin/user_approval</code> — approval records</li>
              <li><code className="px-1 bg-[#EDE6F8] dark:bg-[#1A1025]">/admin/event</code> — event create/manage</li>
              <li><code className="px-1 bg-[#EDE6F8] dark:bg-[#1A1025]">/admin/event-registrations</code> — all/club/music</li>
              <li><code className="px-1 bg-[#EDE6F8] dark:bg-[#1A1025]">POST /admin/copy-records</code> + <code className="px-1 bg-[#EDE6F8] dark:bg-[#1A1025]">PUT /verify-ticket</code></li>
              <li><code className="px-1 bg-[#EDE6F8] dark:bg-[#1A1025]">POST /admin/reset-password/:user</code></li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

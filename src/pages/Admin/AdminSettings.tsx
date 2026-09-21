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
        <Card className="rounded-none border-[#BFE9E0] dark:border-[#1E3D32] bg-white dark:bg-[#14261F]">
          <CardHeader><CardTitle className="text-sm font-bold text-[#17463C] dark:text-[#EAF6F4]">Reset user password</CardTitle><p className="text-xs text-[#4A7A6E] dark:text-[#91E9D7]">POST /admin/reset-password/:user — requires password + password_confirmation (min 8)</p></CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="User UUID" value={uuid} onChange={e=>setUuid(e.target.value)} className="rounded-none bg-[#EAF6F4] dark:bg-[#0F1F1A] border-[#BFE9E0] dark:border-[#1E3D32]"/>
            <Input placeholder="New password" type="password" value={pwd} onChange={e=>setPwd(e.target.value)} className="rounded-none bg-[#EAF6F4] dark:bg-[#0F1F1A] border-[#BFE9E0] dark:border-[#1E3D32]"/>
            <Input placeholder="Confirm password" type="password" value={pwd2} onChange={e=>setPwd2(e.target.value)} className="rounded-none bg-[#EAF6F4] dark:bg-[#0F1F1A] border-[#BFE9E0] dark:border-[#1E3D32]"/>
            <Button onClick={()=>adminResetPassword(uuid,pwd,pwd2)} disabled={!uuid||!pwd||pwd!==pwd2} className="rounded-none bg-[#1E8277] hover:bg-[#17463C] text-white">Reset password</Button>
          </CardContent>
        </Card>
        <Card className="rounded-none border-[#BFE9E0] dark:border-[#1E3D32] bg-white dark:bg-[#14261F]">
          <CardHeader><CardTitle className="text-sm font-bold text-[#17463C] dark:text-[#EAF6F4]">System & Design</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-[#4A7A6E] dark:text-[#91E9D7]">Admin palette</span><Badge className="rounded-none bg-[#EAF6F4] dark:bg-[#1B342D] text-[#1E8277] border-[#BFE9E0]">#EAF6F4 • #91E9D7 • #3CCCB3 • #1E8277 • #17463C</Badge></div>
            <div className="flex justify-between"><span className="text-[#4A7A6E] dark:text-[#91E9D7]">Radius</span><Badge className="rounded-none bg-[#17463C] text-white">rounded-none</Badge></div>
            <div className="flex justify-between"><span className="text-[#4A7A6E] dark:text-[#91E9D7]">Dark mode</span><Badge className="rounded-none bg-[#EAF6F4] dark:bg-[#1B342D] text-[#1E8277]">Toggle in header (Sun/Moon)</Badge></div>
            <div className="rounded-none bg-[#EAF6F4] dark:bg-[#0F1F1A] border border-[#BFE9E0] dark:border-[#1E3D32] p-3 text-xs text-[#17463C] dark:text-[#EAF6F4]">
              <div className="font-bold">Signed in as</div>
              <div className="text-[#4A7A6E] dark:text-[#91E9D7]">{user?.username} • {user?.email}</div>
              <div className="mt-2 text-[11px] uppercase tracking-widest text-[#1E8277]">All admin pages use shadcn base components only — no cross-role reuse • border 1px • shadow-sm</div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-none border-[#BFE9E0] dark:border-[#1E3D32] bg-white dark:bg-[#14261F] lg:col-span-2">
          <CardContent className="p-6 text-xs text-[#4A7A6E] dark:text-[#91E9D7]">
            <div className="font-bold text-[#17463C] dark:text-[#EAF6F4]">Endpoint coverage</div>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li><code className="px-1 bg-[#EAF6F4] dark:bg-[#1B342D]">GET /admin/dashboard</code> — Overview KPIs</li>
              <li><code className="px-1 bg-[#EAF6F4] dark:bg-[#1B342D]">/admin/users</code> — list/create/show/update/delete + stats/pending/by-role</li>
              <li><code className="px-1 bg-[#EAF6F4] dark:bg-[#1B342D]">approve/reject/unlock/promote/de-promote</code> — user workflow</li>
              <li><code className="px-1 bg-[#EAF6F4] dark:bg-[#1B342D]">/admin/team-profile</code> — team CRUD</li>
              <li><code className="px-1 bg-[#EAF6F4] dark:bg-[#1B342D]">/admin/user_approval</code> — approval records</li>
              <li><code className="px-1 bg-[#EAF6F4] dark:bg-[#1B342D]">/admin/event</code> — event create/manage</li>
              <li><code className="px-1 bg-[#EAF6F4] dark:bg-[#1B342D]">/admin/event-registrations</code> — all/club/music</li>
              <li><code className="px-1 bg-[#EAF6F4] dark:bg-[#1B342D]">POST /admin/copy-records</code> + <code className="px-1 bg-[#EAF6F4] dark:bg-[#1B342D]">PUT /verify-ticket</code></li>
              <li><code className="px-1 bg-[#EAF6F4] dark:bg-[#1B342D]">POST /admin/reset-password/:user</code></li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { AdminHeader } from "@/layouts/admin/AdminHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
export default function AdminEvents(){
  const navigate=useNavigate();
  return (
    <div className="pb-10">
      <AdminHeader title="Events" subtitle="Event data management — powered by /events and /admin/event" />
      <div className="px-4 lg:px-8 py-6 space-y-4">
        <Card className="rounded-none border-[#D9CEF2] bg-white"><CardContent className="p-6">
          <div className="text-sm font-bold text-[#030407]">Event control is available to EBM/ Admin via existing APIs.</div>
          <p className="text-xs text-[#494070] mt-1">This admin view is a lightweight wrapper — create/update/delete go through the same authorized endpoints. Use the EBM event pages for full CRUD today, or extend this placeholder to call POST /admin/event, PUT /admin/event/:id, DELETE /admin/event/:id.</p>
          <div className="flex gap-2 mt-4">
            <Button onClick={()=>navigate("/admin/dashboard")} className="rounded-none bg-[#DF3FFA] text-white">Back to dashboard</Button>
            <Button variant="outline" onClick={()=>navigate("/admin/users")} className="rounded-none border-[#D9CEF2]">Manage users</Button>
          </div>
        </CardContent></Card>
      </div>
    </div>
  );
}

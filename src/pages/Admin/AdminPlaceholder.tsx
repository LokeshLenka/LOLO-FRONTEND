import { AdminHeader } from "@/layouts/admin/AdminHeader";
import { Card, CardContent } from "@/components/ui/card";
export default function AdminPlaceholder({ title, subtitle }: { title:string; subtitle?:string }){
  return (
    <div className="pb-10">
      <AdminHeader title={title} subtitle={subtitle || "Coming soon — wired to backend when needed"} />
      <div className="px-4 lg:px-8 py-6">
        <Card className="rounded-none border-[#D9CEF2] bg-white"><CardContent className="p-8 text-sm text-[#030407]">This section is scaffolded with the admin palette and layout. Backend endpoints already exist — hook up tables and export when you need it. No breaking changes required.</CardContent></Card>
      </div>
    </div>
  );
}

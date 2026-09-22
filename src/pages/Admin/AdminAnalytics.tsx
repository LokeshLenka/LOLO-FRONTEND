import { AdminHeader } from "@/layouts/admin/AdminHeader";
import { useAdminDashboard } from "@/hooks/admin/useAdminDashboard";
import { AdminChartCard } from "@/components/admin/AdminChartCard";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminAnalytics() {
  const { stats } = useAdminDashboard();
  if (!stats) return <div className="p-8 text-sm text-[var(--admin-ink-muted)]">Loading analytics…</div>;
  const bar = [
    { name: "Active", value: stats.total_active_users },
    { name: "Inactive", value: stats.total_in_active_users },
    { name: "Pending", value: stats.total_pending_approvals },
    { name: "Approved", value: stats.total_approved_users },
  ];
  const pie = [
    { name: "Mgmt", value: stats.total_management_users },
    { name: "Music", value: stats.total_music_users },
  ];
  return (
    <div className="pb-10">
      <AdminHeader title="Analytics" subtitle="Deep stats — export-ready" />
      <div className="px-4 lg:px-8 py-6 grid gap-4 lg:grid-cols-2">
        <AdminChartCard title="Lifecycle" subtitle="Active vs pending vs approved">
          <div className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={bar}><CartesianGrid stroke="var(--admin-line)"/><XAxis dataKey="name" tick={{fill:"var(--admin-ink-muted)", fontSize:12}}/><YAxis/><Tooltip/><Bar dataKey="value" fill="var(--admin-accent)" radius={0}/></BarChart></ResponsiveContainer></div>
        </AdminChartCard>
        <AdminChartCard title="Domain split" subtitle="Management vs Music">
          <div className="h-[300px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={pie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90}>{pie.map((_,i)=><Cell key={i} fill={i===0?"var(--admin-accent)":"var(--admin-ink-muted)"}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div>
        </AdminChartCard>
        <Card className="rounded-none border-[var(--admin-line)] bg-[var(--admin-surface)] lg:col-span-2"><CardContent className="p-6 text-sm text-[var(--admin-ink)]">All analytics are derived from <code className="px-2 py-1 rounded bg-[var(--admin-canvas)]">/admin/dashboard</code> and user stats. Use the Users page export to download the underlying rows.</CardContent></Card>
      </div>
    </div>
  );
}

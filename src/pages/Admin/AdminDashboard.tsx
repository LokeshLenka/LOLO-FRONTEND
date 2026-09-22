import { useAdminDashboard } from "@/hooks/admin/useAdminDashboard";
import { AdminHeader } from "@/layouts/admin/AdminHeader";
import { AdminStatsCard, AdminKpiGrid } from "@/components/admin/AdminStatsCard";
import { AdminChartCard } from "@/components/admin/AdminChartCard";
import { Users, UserCheck, Clock, ShieldCheck, Music, Briefcase, Layers, TrendingUp, Award, AlertCircle, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminUsers } from "@/hooks/admin/useAdminUsers";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";

// Minimal monochrome — single accent (ink) per 60-30-10, OKLCH neutral ramp
const COLORS = ["#111111", "#787774", "#A8A6A0", "#EAEAEA", "#F7F6F3"];

export default function AdminDashboard() {
  const { stats, loading, error, refresh } = useAdminDashboard();
  const { users } = useAdminUsers(1, {}, 6);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-[var(--admin-line)] rounded-none w-64" />
          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(8)].map((_, i) => <div key={i} className="h-28 bg-[var(--admin-surface)] border border-[var(--admin-line)] rounded-none" />)}
          </div>
        </div>
      </div>
    );
  }
  if (error || !stats) {
    return (
      <div className="p-8">
        <AdminHeader title="Command Center" subtitle="Admin overview" onRefresh={refresh} />
        <Card className="mt-6 rounded-none border border-[var(--admin-line)] bg-[var(--admin-pale-red-bg)]"><CardContent className="p-6 flex items-center gap-3 text-[var(--admin-pale-red-fg)]"><AlertCircle size={18}/>{error || "Failed to load"}</CardContent></Card>
      </div>
    );
  }

  const trendData = stats.approval_trend.map(d => ({ date: new Date(d.date).toLocaleDateString("en-US",{weekday:"short"}), count: d.count, full: d.date }));
  const categoryData = [
    { name: "Event Organizer", value: stats.total_event_organizers },
    { name: "Event Planner", value: stats.total_event_planners },
    { name: "Social Media", value: stats.total_social_media_handlers },
    { name: "Marketing", value: stats.total_marketing_coordinators },
    { name: "Video Editor", value: stats.total_video_editors },
  ];
  const roleDist = [
    { name: "Management", value: stats.total_management_users },
    { name: "Music", value: stats.total_music_users },
  ];
  const promotedDist = [
    { name: "EBM", value: stats.total_ebms },
    { name: "MH", value: stats.total_memberships },
    { name: "Credit Mgr", value: stats.total_credit_managers },
  ];

  const totalUsers = stats.total_management_users + stats.total_music_users;

  return (
    <div className="pb-10">
      <AdminHeader title="Command Center" subtitle={`Welcome back — ${stats.total_approved_users} approved • ${stats.total_pending_approvals} pending • ${stats.total_promoted_users} elevated`} onRefresh={refresh} />
      <div className="px-4 lg:px-8 py-6 space-y-6">
        {/* Hero — flat, no gradient, no shadow, Swiss whitespace */}
        <div className="rounded-none p-5 lg:p-6 border border-[var(--admin-line)] bg-[var(--admin-surface)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-none flex items-center justify-center shrink-0 bg-[var(--admin-accent)] text-[var(--admin-accent-fg)]">
              <Sparkles size={20}/>
            </div>
            <div>
              <div className="text-sm font-bold text-[var(--admin-ink)] flex items-center gap-2" style={{letterSpacing:"-0.02em"}}>LOLO Admin — Data Control Plane <Badge className="bg-[var(--admin-ink)] text-white border-0 rounded-full text-[10px] tracking-widest uppercase">LIVE</Badge></div>
              <p className="text-xs text-[var(--admin-ink-muted)] mt-1 max-w-xl leading-relaxed">Unified data management, stats and export. Manage users, approvals, events and tickets from a single surface. All changes are audited.</p>
              <div className="flex gap-2 mt-3">
                <Button onClick={()=>navigate("/admin/users")} className="h-8 rounded-none bg-[var(--admin-accent)] hover:bg-[var(--admin-accent-hover)] text-[var(--admin-accent-fg)] text-xs">Manage Users</Button>
                <Button variant="outline" onClick={()=>navigate("/admin/approvals")} className="h-8 rounded-none border-[var(--admin-line)] text-[var(--admin-ink)] bg-[var(--admin-surface)] text-xs">View Approvals</Button>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="rounded-none bg-[var(--admin-surface)] border border-[var(--admin-line)] p-3 min-w-[140px]">
              <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--admin-ink-muted)]">Health</div>
              <div className="text-sm font-bold text-[var(--admin-ink)] mt-1">All systems normal</div>
              <div className="text-[11px] text-[var(--admin-ink-muted)]">API • DB • Auth</div>
            </div>
            <div className="rounded-none bg-[var(--admin-accent)] text-[var(--admin-accent-fg)] p-3 min-w-[140px]">
              <div className="text-[11px] font-bold uppercase tracking-widest opacity-70">Coverage</div>
              <div className="text-lg font-black mt-1">{totalUsers}</div>
              <div className="text-[11px] opacity-70">Total members</div>
            </div>
          </div>
        </div>

        <AdminKpiGrid>
          <AdminStatsCard title="Active Users" value={stats.total_active_users} subtitle={`${stats.total_in_active_users} inactive`} icon={UserCheck} trend="Approved & active" />
          <AdminStatsCard title="Pending Approvals" value={stats.total_pending_approvals} subtitle="Awaiting action" icon={Clock} trend="Needs review" />
          <AdminStatsCard title="Approved Users" value={stats.total_approved_users} subtitle="Fully onboarded" icon={ShieldCheck} trend={`${Math.round(stats.total_approved_users/Math.max(totalUsers,1)*100)}% approved`} />
          <AdminStatsCard title="Elevated Roles" value={stats.total_promoted_users} subtitle={`${stats.total_ebms} EBM • ${stats.total_memberships} MH • ${stats.total_credit_managers} CM`} icon={Award} />
        </AdminKpiGrid>

        <AdminKpiGrid>
          <AdminStatsCard title="Management" value={stats.total_management_users} subtitle="Club members" icon={Briefcase} />
          <AdminStatsCard title="Music" value={stats.total_music_users} subtitle="Artists & performers" icon={Music} />
          <AdminStatsCard title="Total Approvals" value={stats.total_approvals} subtitle="MH approved" icon={TrendingUp} />
          <AdminStatsCard title="Pending (MH queue)" value={stats.pending_approvals} subtitle="Assigned to you" icon={Layers} />
        </AdminKpiGrid>

        <div className="grid gap-4 lg:grid-cols-7">
          <AdminChartCard title="Approval Trend" subtitle="Last 7 days — membership head approvals" className="lg:col-span-4">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-line)" vertical={false}/>
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: "var(--admin-ink-muted)"}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fontSize: 12, fill: "var(--admin-ink-muted)"}} axisLine={false} tickLine={false} allowDecimals={false}/>
                  <Tooltip contentStyle={{ border:"1px solid var(--admin-line)", background:"var(--admin-surface)"}}/>
                  <Line type="monotone" dataKey="count" stroke="var(--admin-accent)" strokeWidth={2} dot={{ r:4, fill:"var(--admin-accent)", strokeWidth:2, stroke:"var(--admin-surface)"}} activeDot={{r:6}}/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </AdminChartCard>

          <AdminChartCard title="Management Breakdown" subtitle="Sub-role distribution" className="lg:col-span-3">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical" margin={{left:20,right:20}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-canvas)" horizontal={false}/>
                  <XAxis type="number" tick={{fontSize:11, fill:"var(--admin-ink-muted)"}} axisLine={false} tickLine={false}/>
                  <YAxis type="category" dataKey="name" tick={{fontSize:11, fill:"var(--admin-ink)"}} width={110} axisLine={false} tickLine={false}/>
                  <Tooltip contentStyle={{background:"var(--admin-surface)", border:"1px solid var(--admin-line)"}}/>
                  <Bar dataKey="value" radius={0} fill="var(--admin-accent)" barSize={18}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </AdminChartCard>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <AdminChartCard title="Members by Domain" subtitle="Management vs Music">
            <div className="h-[240px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={roleDist} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4}>
                    {roleDist.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                  </Pie>
                  <Tooltip/>
                  <Legend/>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-2 justify-center mt-2">
              <Badge variant="outline" className="rounded-full border-[var(--admin-line)] text-[var(--admin-ink)] bg-[var(--admin-surface)]">{stats.total_management_users} Management</Badge>
              <Badge variant="outline" className="rounded-full border-[var(--admin-line)] text-[var(--admin-ink-muted)] bg-[var(--admin-surface)]">{stats.total_music_users} Music</Badge>
            </div>
          </AdminChartCard>

          <AdminChartCard title="Elevated Roles" subtitle="EBM • MH • Credit Manager">
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={promotedDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} paddingAngle={3}>
                    {promotedDist.map((_,i)=><Cell key={i} fill={COLORS[(i+2)%COLORS.length]} />)}
                  </Pie>
                  <Tooltip/>
                  <Legend/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </AdminChartCard>

          <Card className="rounded-none border border-[var(--admin-line)] bg-[var(--admin-surface)]">
            <div className="p-5">
              <div className="text-sm font-bold text-[var(--admin-ink)]" style={{letterSpacing:"-0.02em"}}>Quick Data Actions</div>
              <p className="text-xs text-[var(--admin-ink-muted)] mt-1">Jump to data management — everything is export-ready.</p>
              <div className="grid gap-2 mt-4">
                <Button onClick={()=>navigate("/admin/users")} className="justify-start rounded-none bg-[var(--admin-accent)] hover:bg-[var(--admin-accent-hover)] text-[var(--admin-accent-fg)]"><Users size={16}/> User Management</Button>
                <Button variant="outline" onClick={()=>navigate("/admin/users")} className="justify-start rounded-none border-[var(--admin-line)] text-[var(--admin-ink)] bg-[var(--admin-surface)]">Export Users (CSV / JSON)</Button>
                <Button variant="outline" onClick={()=>navigate("/admin/events")} className="justify-start rounded-none border-[var(--admin-line)] text-[var(--admin-ink)] bg-[var(--admin-surface)]">Events & Registrations</Button>
                <div className="rounded-none bg-[var(--admin-canvas)] border border-[var(--admin-line)] p-3 mt-2">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-[var(--admin-ink-muted)]">Tip</div>
                  <div className="text-xs text-[var(--admin-ink)] mt-1 leading-relaxed">All tables support search, filter, sort and one-click export. Use column selector before exporting.</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <AdminChartCard title="Recent Members" subtitle="Latest 6 users — preview of full data management" action={<Button variant="outline" size="sm" onClick={()=>navigate("/admin/users")} className="rounded-none border-[var(--admin-line)] text-[var(--admin-ink)] h-8">View all</Button>}>
          <div className="overflow-x-auto rounded-none border border-[var(--admin-line)]">
            <Table>
              <TableHeader className="bg-[var(--admin-canvas)]">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-[var(--admin-ink)]">Member</TableHead>
                  <TableHead className="text-[var(--admin-ink)]">Role</TableHead>
                  <TableHead className="text-[var(--admin-ink)]">Branch</TableHead>
                  <TableHead className="text-[var(--admin-ink)]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(u=>{
                  const p:any = u.profile || (u as any).managementProfile || (u as any).musicProfile || {};
                  return (
                    <TableRow key={u.uuid} className="hover:bg-[var(--admin-canvas)]/60">
                      <TableCell>
                        <div className="font-medium text-[var(--admin-ink)]">{p.first_name ? `${p.first_name} ${p.last_name||""}` : u.username}</div>
                        <div className="text-xs text-[var(--admin-ink-muted)]">{u.email} • {p.reg_num||"—"}</div>
                      </TableCell>
                      <TableCell><Badge className="rounded-full bg-[var(--admin-canvas)] text-[var(--admin-ink)] border border-[var(--admin-line)]">{u.role}{p.sub_role ? ` • ${p.sub_role.replace(/_/g," ")}`:""}</Badge></TableCell>
                      <TableCell className="text-sm text-[var(--admin-ink)]">{p.branch||"—"} <span className="text-xs text-[var(--admin-ink-muted)]">{p.year||""}</span></TableCell>
                      <TableCell>
                        {u.is_approved ? <Badge className="bg-[var(--admin-pale-green-bg)] text-[var(--admin-pale-green-fg)] border-0 rounded-full">Approved</Badge> : <Badge className="bg-[var(--admin-pale-yellow-bg)] text-[var(--admin-pale-yellow-fg)] border-0 rounded-full">Pending</Badge>}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {users.length===0 && <TableRow><TableCell colSpan={4} className="text-center text-sm text-[var(--admin-ink-muted)] py-8">No users to preview</TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
        </AdminChartCard>
      </div>
    </div>
  );
}

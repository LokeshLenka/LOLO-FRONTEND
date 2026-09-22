import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

export function AdminStatsCard({ title, value, subtitle, icon: Icon, trend }: { title: string; value: string | number; subtitle?: string; icon: LucideIcon; trend?: string }) {
  return (
    <Card className="rounded-none border border-[var(--admin-line)] bg-[var(--admin-surface)] overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[11px] font-bold tracking-widest uppercase text-[var(--admin-ink-muted)]">{title}</div>
            <div className="mt-2 text-[28px] font-black tracking-tight text-[var(--admin-ink)] leading-none" style={{letterSpacing:"-0.02em"}}>{value}</div>
            {subtitle && <div className="text-xs text-[var(--admin-ink-muted)] mt-1 leading-relaxed">{subtitle}</div>}
            {trend && <div className="text-[11px] font-medium mt-2 px-2 py-1 rounded-full bg-[var(--admin-canvas)] text-[var(--admin-ink)] border border-[var(--admin-line)] w-fit tracking-wide">{trend}</div>}
          </div>
          <div className="w-10 h-10 rounded-none flex items-center justify-center shrink-0 border border-[var(--admin-line)] bg-[var(--admin-canvas)] text-[var(--admin-ink)]">
            <Icon size={18} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminKpiGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{children}</div>;
}

import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

export function AdminStatsCard({ title, value, subtitle, icon: Icon, accent = "#DF3FFA", trend }: { title: string; value: string | number; subtitle?: string; icon: LucideIcon; accent?: string; trend?: string }) {
  return (
    <Card className="rounded-none border-[#D9CEF2] dark:border-[#2A1A3A] bg-white dark:bg-[#120A1A] shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[11px] font-bold tracking-widest uppercase text-[#494070] dark:text-[#494070]">{title}</div>
            <div className="mt-2 text-[28px] font-black tracking-tight text-[#030407] dark:text-[#EDE6F8] leading-none">{value}</div>
            {subtitle && <div className="text-xs text-[#494070] dark:text-[#494070] mt-1">{subtitle}</div>}
            {trend && <div className="text-[11px] font-semibold mt-2 px-2 py-1 rounded-full bg-[#EDE6F8] dark:bg-[#1A1025] text-[#DF3FFA] w-fit">{trend}</div>}
          </div>
          <div className="w-10 h-10 rounded-none flex items-center justify-center shrink-0" style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}>
            <Icon size={18} style={{ color: accent }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminKpiGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{children}</div>;
}

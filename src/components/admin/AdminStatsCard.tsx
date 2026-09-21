import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

export function AdminStatsCard({ title, value, subtitle, icon: Icon, accent = "#1E8277", trend }: { title: string; value: string | number; subtitle?: string; icon: LucideIcon; accent?: string; trend?: string }) {
  return (
    <Card className="rounded-none border-[#BFE9E0] dark:border-[#1E3D32] bg-white dark:bg-[#14261F] shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[11px] font-bold tracking-widest uppercase text-[#4A7A6E] dark:text-[#91E9D7]">{title}</div>
            <div className="mt-2 text-[28px] font-black tracking-tight text-[#17463C] dark:text-[#EAF6F4] leading-none">{value}</div>
            {subtitle && <div className="text-xs text-[#4A7A6E] dark:text-[#91E9D7] mt-1">{subtitle}</div>}
            {trend && <div className="text-[11px] font-semibold mt-2 px-2 py-1 rounded-full bg-[#EAF6F4] dark:bg-[#1B342D] text-[#1E8277] w-fit">{trend}</div>}
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

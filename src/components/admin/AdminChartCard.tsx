import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function AdminChartCard({ title, subtitle, action, children, className }: { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <Card className={cn("rounded-none border border-[var(--admin-line)] bg-[var(--admin-surface)]", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-sm font-bold text-[var(--admin-ink)]" style={{letterSpacing:"-0.02em"}}>{title}</CardTitle>
            {subtitle && <p className="text-xs text-[var(--admin-ink-muted)] mt-1">{subtitle}</p>}
          </div>
          {action}
        </div>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}

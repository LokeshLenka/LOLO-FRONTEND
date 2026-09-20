import { type ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

interface CreditStatsCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  hint: string;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  className?: string;
}

export function CreditStatsCard({
  title,
  value,
  icon,
  hint,
  trend,
  className = "",
}: CreditStatsCardProps) {
  return (
    <Card className={`rounded-none border-zinc-200 shadow-none dark:border-zinc-800 ${className}`}>
      <CardContent className="flex items-start justify-between p-5">
        <div className="space-y-2 min-w-0">
          <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 truncate">
            {title}
          </p>
          <p className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50 truncate">
            {value}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">{hint}</p>
          {trend && (
            <div
              className={`flex items-center gap-1.5 mt-2 text-xs font-medium ${
                trend.positive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
              }`}
            >
              <span className="flex items-center gap-0.5">
                {trend.positive ? "▲" : "▼"} {Math.abs(trend.value)}%
              </span>
              <span className="text-zinc-500 dark:text-zinc-400">{trend.label}</span>
            </div>
          )}
        </div>

        <div className="flex h-10 w-10 items-center justify-center border border-zinc-200 text-zinc-600 dark:border-zinc-800 dark:text-zinc-300 flex-shrink-0">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}
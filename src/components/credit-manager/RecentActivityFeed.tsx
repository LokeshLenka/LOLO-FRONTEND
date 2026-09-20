import { type Variants, motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import {
  CircleDollarSign,
  CreditCard,
  MinusCircle,
  Users,
  ArrowUpRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.15 } },
};

interface ActivityItem {
  id: number;
  type: "credit_assigned" | "credit_updated" | "credit_deleted" | "bulk_assign" | "bulk_update" | "bulk_delete";
  description: string;
  event_name: string;
  user_name?: string;
  amount?: number;
  created_at: string;
  performed_by: string;
}

function getActivityIcon(type: ActivityItem["type"]) {
  switch (type) {
    case "credit_assigned":
    case "bulk_assign":
      return <CircleDollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
    case "credit_updated":
    case "bulk_update":
      return <CreditCard className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
    case "credit_deleted":
    case "bulk_delete":
      return <MinusCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
    default:
      return <CircleDollarSign className="h-4 w-4 text-zinc-500 dark:text-gray-400" />;
  }
}

function getActivityLabel(type: ActivityItem["type"]) {
  switch (type) {
    case "credit_assigned":
      return "Assigned";
    case "credit_updated":
      return "Updated";
    case "credit_deleted":
      return "Deleted";
    case "bulk_assign":
      return "Bulk Assigned";
    case "bulk_update":
      return "Bulk Updated";
    case "bulk_delete":
      return "Bulk Deleted";
    default:
      return "Activity";
  }
}

function getActivityColor(type: ActivityItem["type"]) {
  switch (type) {
    case "credit_assigned":
    case "bulk_assign":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300";
    case "credit_updated":
    case "bulk_update":
      return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300";
    case "credit_deleted":
    case "bulk_delete":
      return "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300";
    default:
      return "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
}

interface RecentActivityFeedProps {
  activities: ActivityItem[];
  onViewAll?: () => void;
  maxItems?: number;
}

export function RecentActivityFeed({ activities, onViewAll, maxItems = 5 }: RecentActivityFeedProps) {
  const displayActivities = activities.slice(0, maxItems);

  if (activities.length === 0) {
    return (
      <Card className="rounded-none border-zinc-200 shadow-none dark:border-gray-800">
        <CardHeader className="border-b border-zinc-200 px-5 py-4 dark:border-gray-800">
          <CardTitle className="text-base font-semibold tracking-tight">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="text-center py-8 text-zinc-500 dark:text-gray-400">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No recent credit activity</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-none border-zinc-200 shadow-none dark:border-gray-800">
      <CardHeader className="border-b border-zinc-200 px-5 py-4 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold tracking-tight">Recent Activity</CardTitle>
          {onViewAll && (
            <Button variant="ghost" size="sm" onClick={onViewAll} className="rounded-none">
              View All
              <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="divide-y divide-zinc-200 dark:divide-gray-800">
          {displayActivities.map((activity) => (
            <motion.div key={activity.id} variants={itemVariants} className="p-4 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-none border border-zinc-200 bg-zinc-50 dark:border-gray-800 dark:bg-gray-800 flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className={`rounded-none px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] ${getActivityColor(activity.type)}`}
                    >
                      {getActivityLabel(activity.type)}
                    </Badge>
                    {activity.amount && (
                      <Badge variant="outline" className="rounded-none px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] border-zinc-200 bg-white text-zinc-700 dark:border-gray-800 dark:bg-white/5 dark:text-gray-300">
                        {activity.amount} credits
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-zinc-950 dark:text-gray-100 truncate">{activity.description}</p>
                  <p className="text-xs text-zinc-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
}
import { type Variants, motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CalendarRange, AlertCircle } from "lucide-react";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

interface EventCreditProgressProps {
  event: {
    event_id: number;
    event_uuid: string;
    event_name: string;
    event_type: string;
    credits_awarded: number;
    total_eligible: number;
    credited_count: number;
    pending_count: number;
    management_eligible: number;
    management_credited: number;
    music_eligible: number;
    music_credited: number;
    progress_percentage: number;
    end_date: string;
  };
  onClick?: () => void;
}

export function EventCreditProgress({ event, onClick }: EventCreditProgressProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <motion.div
      variants={itemVariants}
      className="group border border-zinc-200 dark:border-[#344054] hover:border-zinc-300 dark:hover:border-gray-600 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0 flex-1">
            <h4 className="font-medium text-zinc-950 dark:text-[#F2F4F7] truncate">{event.event_name}</h4>
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-[#98A2B3] flex-wrap">
              <Badge variant="outline" className="rounded-none px-1.5 py-0.5 text-[9px] h-4 gap-1">
                <CalendarRange className="h-2.5 w-2.5" />
                {formatDate(event.end_date)}
              </Badge>
              <Badge variant="outline" className="rounded-none px-1.5 py-0.5 text-[9px] h-4 gap-1 capitalize">
                {event.event_type}
              </Badge>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-2xl font-bold text-zinc-950 dark:text-[#F2F4F7]">{event.progress_percentage}%</p>
            <p className="text-xs text-zinc-500 dark:text-[#98A2B3]">Complete</p>
          </div>
        </div>

        <Progress value={event.progress_percentage} className="h-2 rounded-none" />

        <div className="grid grid-cols-2 gap-2 text-center pt-1">
          <div className="border border-zinc-200 dark:border-[#344054] dark:bg-[#1D2939] rounded-none p-2">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-[#667085]">Management</p>
            <p className="font-medium text-zinc-950 dark:text-[#F2F4F7]">
              {event.management_credited}/{event.management_eligible}
            </p>
          </div>
          <div className="border border-zinc-200 dark:border-[#344054] dark:bg-[#1D2939] rounded-none p-2">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500 dark:text-[#667085]">Music</p>
            <p className="font-medium text-zinc-950 dark:text-[#F2F4F7]">
              {event.music_credited}/{event.music_eligible}
            </p>
          </div>
        </div>

        {event.pending_count > 0 && (
          <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 rounded-none p-2">
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{event.pending_count} pending credit assignments</span>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-[#98A2B3] pt-1 border-t border-zinc-200 dark:border-[#344054]">
          <span>Max credits per user: {event.credits_awarded}</span>
          <span>Total eligible: {event.total_eligible}</span>
        </div>
      </div>
    </motion.div>
  );
}

export function EventCreditProgressList({ events, onEventClick }: { events: EventCreditProgressProps["event"][]; onEventClick?: (event: EventCreditProgressProps["event"]) => void }) {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-3">
      {events.map((event) => (
        <EventCreditProgress key={event.event_uuid} event={event} onClick={() => onEventClick?.(event)} />
      ))}
    </motion.div>
  );
}
import { Badge } from "@/components/ui/badge";
import { UserCheck, UserX, ShieldCheck, Users } from "lucide-react";

export type EligibilityStatus = "eligible" | "management" | "registered" | "public" | "pending" | "not_eligible";

interface EligibilityBadgeProps {
  status: EligibilityStatus;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const statusConfig: Record<EligibilityStatus, { label: string; icon: React.ReactNode; variant: "default" | "secondary" | "destructive" | "outline"; colorClass: string }> = {
  eligible: {
    label: "Eligible",
    icon: <UserCheck className="h-3 w-3" />,
    variant: "default",
    colorClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  management: {
    label: "Management",
    icon: <ShieldCheck className="h-3 w-3" />,
    variant: "default",
    colorClass: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  registered: {
    label: "Registered",
    icon: <UserCheck className="h-3 w-3" />,
    variant: "secondary",
    colorClass: "bg-zinc-100 text-zinc-700 dark:bg-[#1D2939] dark:text-[#98A2B3]",
  },
  public: {
    label: "Public - Not Eligible",
    icon: <UserX className="h-3 w-3" />,
    variant: "destructive",
    colorClass: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  pending: {
    label: "Pending Registration",
    icon: <Users className="h-3 w-3" />,
    variant: "outline",
    colorClass: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300",
  },
  not_eligible: {
    label: "Not Eligible",
    icon: <UserX className="h-3 w-3" />,
    variant: "outline",
    colorClass: "border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-[#344054] dark:bg-[#1D2939] dark:text-[#98A2B3]",
  },
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-[10px] gap-1",
  md: "px-2.5 py-1 text-xs gap-1.5",
  lg: "px-3 py-1.5 text-sm gap-2",
};

export function EligibilityBadge({ status, showIcon = true, size = "md", className = "" }: EligibilityBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant={config.variant}
      className={`rounded-none flex items-center ${config.colorClass} ${sizeClasses[size]} ${className}`}
    >
      {showIcon && <span className="flex-shrink-0">{config.icon}</span>}
      <span>{config.label}</span>
    </Badge>
  );
}

interface EligibilityIndicatorProps {
  user: {
    role?: string;
    promoted_role?: string | null;
    managementProfile?: { sub_role?: string } | null;
    musicProfile?: { sub_role?: string } | null;
    is_approved?: boolean;
  };
  isRegistered?: boolean;
  hasCredit?: boolean;
  size?: "sm" | "md" | "lg";
}

export function EligibilityIndicator({ user, isRegistered = false, hasCredit = false, size = "md" }: EligibilityIndicatorProps) {
  if (!user.is_approved) {
    return <EligibilityBadge status="not_eligible" size={size} />;
  }

  if (user.role === "public") {
    return <EligibilityBadge status="public" size={size} />;
  }

  if (hasCredit) {
    return <EligibilityBadge status="eligible" size={size} />;
  }

  // Management members are always eligible
  if (user.role === "management" || user.promoted_role === "credit_manager" || user.promoted_role === "executive_body_member" || user.promoted_role === "membership_head" || user.managementProfile) {
    return <EligibilityBadge status="management" size={size} />;
  }

  // Music members need registration
  if (user.role === "music" || user.musicProfile) {
    return isRegistered
      ? <EligibilityBadge status="registered" size={size} />
      : <EligibilityBadge status="pending" size={size} />;
  }

  // Club members (management role without sub-role) need registration
  if (user.role === "management") {
    return isRegistered
      ? <EligibilityBadge status="registered" size={size} />
      : <EligibilityBadge status="pending" size={size} />;
  }

  return <EligibilityBadge status="not_eligible" size={size} />;
}
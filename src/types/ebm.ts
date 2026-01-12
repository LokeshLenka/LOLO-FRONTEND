export interface ApprovalTrend {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface DashboardStats {
  created_events: number;
  pending_approvals: number;
  total_approved: number;
  my_registrations: number;
  approved_today: number;
  pending_by_role: Record<string, number>; // e.g., { "music": 5, "management": 2 }
  approval_trend: ApprovalTrend[];
}

export interface APIResponse<T> {
  status: string;
  code: number;
  message: string;
  data: T;
}

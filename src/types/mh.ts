export interface ApprovalTrend {
  date: string;
  count: number;
}

export interface DashboardStats {
  assigned_user_count: number;
  pending_approvals: number;
  total_approvals: number;
  total_users: number;
  total_ebms: number;
  total_memberships: number;
  total_credit_managers: number;
  approval_trend: ApprovalTrend[];
}

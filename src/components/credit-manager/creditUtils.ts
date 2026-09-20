interface CreditWithAssigner {
  assigned_by?: number | string | null;
  assigned_by_username?: string | null;
  assigner?: { username?: string | null } | null;
}

/**
 * Display name of the manager who assigned a credit.
 * Prefers the username, falls back to the raw id.
 */
export function assignerName(
  credit?: CreditWithAssigner | null,
  fallback = "—"
): string {
  if (!credit) return fallback;
  return (
    credit.assigned_by_username ??
    credit.assigner?.username ??
    (credit.assigned_by != null ? String(credit.assigned_by) : fallback)
  );
}

/**
 * Whether the current viewer may edit/delete this credit.
 * The backend computes this per row (owner or admin). When the flag is
 * absent (older responses), allow the action as before.
 */
export function canManageCredit(credit?: { can_manage_credit?: boolean } | null): boolean {
  if (!credit) return false;
  return credit.can_manage_credit ?? true;
}

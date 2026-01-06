import { getCommonNavItems } from "./common";
import { getEBMNavItems } from "./ebm";
import { getMHNavItems } from "./mh";
import { getCMNavItems } from "./cm";

export const getNavItemsForUser = (user: any, profile: any) => {
  const username = user?.username || "user";
  const currentPath = window.location.pathname;

  // 1. Check if we are in a Promoted Role View
  // We determine this by checking if the URL contains the promoted role slug
  const promotedRole = profile?.promoted_role;
  const isPromotedView =
    promotedRole && currentPath.includes(`/${promotedRole}/`);

  // Default: Standard User Dashboard
  if (!isPromotedView) {
    return getCommonNavItems(`/${username}`);
  }

  // 2. We are in Promoted View -> Return ONLY role-specific items
  const basePath = `/${username}/${promotedRole}`;

  switch (promotedRole) {
    case "executive_body_member":
      return getEBMNavItems(basePath);

    case "membership_head":
      return getMHNavItems(basePath);

    case "credit_manager":
      return getCMNavItems(basePath);

    default:
      // Fallback if role string doesn't match exactly or new role added
      return getCommonNavItems(`/${username}`);
  }
};

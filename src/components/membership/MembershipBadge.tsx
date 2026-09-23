import type { MembershipPlanId } from "./membershipData";
import { MEMBERSHIP_TIER_STYLES } from "./membershipTheme";

interface MembershipBadgeProps {
  tier: MembershipPlanId;
  label?: string;
  className?: string;
}

export default function MembershipBadge({ tier, label, className = "" }: MembershipBadgeProps) {
  const styles = MEMBERSHIP_TIER_STYLES[tier];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${styles.badge} ${className}`}
    >
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
      {label ?? `${tier === "gold" ? "Gold" : "Silver"} Membership`}
    </span>
  );
}

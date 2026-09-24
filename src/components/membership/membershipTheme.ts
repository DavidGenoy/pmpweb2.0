import type { MembershipPlanId } from "./membershipData";

interface TierStyle {
  surface: string;
  badge: string;
  dot: string;
  hairline: string;
  cardBorder: string;
  pressed: string;
  check: string;
  cta: string;
  price: string;
}

export const MEMBERSHIP_TIER_STYLES: Record<MembershipPlanId, TierStyle> = {
  silver: {
    surface: "bg-primary-800/75",
    badge: "border-member-silver/25 bg-member-silver/[0.07] text-member-silver",
    dot: "bg-member-silver",
    hairline: "from-transparent via-member-silver/60 to-transparent",
    cardBorder: "border-white/10 hover:border-member-silver/30",
    pressed: "[&.is-pressed]:border-member-silver/45 active:border-member-silver/45",
    check: "text-member-silver",
    cta: "bg-white/[0.06] text-white border border-member-silver/30 hover:bg-member-silver/15 hover:border-member-silver/50",
    price: "text-white",
  },
  gold: {
    surface:
      "bg-primary-800/85 bg-[radial-gradient(120%_55%_at_50%_0%,rgba(201,171,110,0.10),transparent_65%)]",
    badge: "border-member-gold/30 bg-member-gold/[0.08] text-member-gold",
    dot: "bg-member-gold",
    hairline: "from-transparent via-member-gold/70 to-transparent",
    cardBorder: "border-member-gold/25 hover:border-member-gold/45",
    pressed: "[&.is-pressed]:border-member-gold/60 active:border-member-gold/60",
    check: "text-member-gold",
    cta: "bg-accent-500 text-primary-900 border border-accent-500 hover:bg-accent-400 hover:border-accent-400",
    price: "text-white",
  },
};

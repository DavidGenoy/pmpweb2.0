import type { MembershipPlanId } from "./membershipData";

interface TierStyle {
  surface: string;
  shadow: string;
  badge: string;
  dot: string;
  hairline: string;
  cardBorder: string;
  pressed: string;
  check: string;
  cta: string;
  price: string;
}

// Primary actions use the site's existing PMP green CTA treatment (Navbar/Hero).
export const PMP_PRIMARY_CTA =
  "bg-accent-500 text-primary-900 border border-accent-500 hover:bg-accent-400 hover:border-accent-400 shadow-sm hover:shadow-md";

export const MEMBERSHIP_TIER_STYLES: Record<MembershipPlanId, TierStyle> = {
  silver: {
    surface: "bg-white",
    shadow: "shadow-[0_18px_44px_-26px_rgba(10,25,47,0.28)]",
    badge: "border-member-silver bg-[#f4f7fa] text-member-silver-ink",
    dot: "bg-member-silver-ink",
    hairline: "from-transparent via-member-silver-ink/60 to-transparent",
    cardBorder: "border-[#dce4ec] hover:border-member-silver-ink/45",
    pressed: "[&.is-pressed]:border-member-silver-ink/60 active:border-member-silver-ink/60",
    check: "text-accent-700",
    cta: PMP_PRIMARY_CTA,
    price: "text-primary-900",
  },
  gold: {
    surface: "bg-white bg-[radial-gradient(120%_45%_at_50%_0%,rgba(201,171,110,0.10),transparent_65%)]",
    shadow: "shadow-[0_22px_50px_-26px_rgba(138,106,44,0.34)]",
    badge: "border-member-gold/70 bg-[#fbf7ef] text-member-gold-ink",
    dot: "bg-member-gold",
    hairline: "from-transparent via-member-gold to-transparent",
    cardBorder: "border-member-gold/50 hover:border-member-gold/85",
    pressed: "[&.is-pressed]:border-member-gold/90 active:border-member-gold/90",
    check: "text-member-gold-ink",
    cta: PMP_PRIMARY_CTA,
    price: "text-primary-900",
  },
};

// Soft scrim behind free-standing text so particles fade out there instead of
// passing behind the words. Matches the section surface via --membership-scrim.
// `isolate` keeps the scrim above the particle canvas but below the text.
export const MEMBERSHIP_TEXT_SCRIM =
  "relative isolate before:pointer-events-none before:absolute before:inset-x-0 before:-inset-y-8 sm:before:-inset-x-10 before:-z-10 before:bg-[radial-gradient(closest-side,var(--membership-scrim,#fff)_55%,transparent)]";

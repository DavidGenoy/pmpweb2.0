export type MembershipPlanId = "silver" | "gold";

export type MembershipFootnoteId = "routine-labs";

export interface MembershipFootnote {
  id: MembershipFootnoteId;
  marker: string;
  text: string;
}

export interface MembershipBenefit {
  text: string;
  footnote?: MembershipFootnoteId;
  group?: "family";
}

export interface MembershipFamilyAddOn {
  maxAdditionalMembers: number;
  monthlyPricePerMember: number;
  eligibleRelations: string;
}

export interface MembershipPlan {
  id: MembershipPlanId;
  name: string;
  monthlyPrice: number;
  positioning: string;
  benefits: MembershipBenefit[];
  memberVisitFee?: number;
  additionalVisitPrice?: number;
  familyAddOn?: MembershipFamilyAddOn;
}

export const MEMBERSHIP_ENROLL_PATH = "/membership/enroll";

export const MEMBERSHIP_ELIGIBILITY = {
  minimumAge: 18,
  summary: "Adults age 18+",
  exclusion:
    "Not available to patients enrolled in Medicare, Medicaid, TRICARE, or other federal government health care programs.",
} as const;

export const MEMBERSHIP_FOOTNOTES: Record<MembershipFootnoteId, MembershipFootnote> = {
  "routine-labs": {
    id: "routine-labs",
    marker: "*",
    text: "Gold includes eligible routine laboratory testing as defined by Primary Medical Physicians. Specialty or send-out testing, genetics, pathology, imaging, medications, vaccines, and third-party services are not included unless expressly stated. The complete included-lab list will be published before enrollment opens.",
  },
};

export function formatUSD(amount: number): string {
  return Number.isInteger(amount) ? `$${amount}` : `$${amount.toFixed(2)}`;
}

const SILVER_ADDITIONAL_VISIT = 50;
const GOLD_MEMBER_VISIT_FEE = 10;
const GOLD_FAMILY_ADD_ON: MembershipFamilyAddOn = {
  maxAdditionalMembers: 3,
  monthlyPricePerMember: 20,
  eligibleRelations: "spouse and/or children age 18+",
};

const SHARED_ACCESS_BENEFITS: MembershipBenefit[] = [
  { text: "Available across all Primary Medical Physicians locations" },
  { text: "Access to PMP primary care providers" },
];

const NO_FEES_BENEFITS: MembershipBenefit[] = [
  { text: "No registration fee" },
  { text: "No enrollment fee" },
];

export const SILVER_PLAN: MembershipPlan = {
  id: "silver",
  name: "Silver",
  monthlyPrice: 69.99,
  positioning: "Preventive Care + Member Savings",
  additionalVisitPrice: SILVER_ADDITIONAL_VISIT,
  benefits: [
    { text: "Complete annual preventive visit included" },
    { text: `Additional primary care visits: ${formatUSD(SILVER_ADDITIONAL_VISIT)} each` },
    { text: "Discounted laboratory services" },
    { text: "Discounted in-office procedures" },
    ...SHARED_ACCESS_BENEFITS,
    { text: "Adults age 18+ only" },
    ...NO_FEES_BENEFITS,
  ],
};

export const GOLD_PLAN: MembershipPlan = {
  id: "gold",
  name: "Gold",
  monthlyPrice: 129.99,
  positioning: "Ongoing Access + Included Routine Labs",
  memberVisitFee: GOLD_MEMBER_VISIT_FEE,
  familyAddOn: GOLD_FAMILY_ADD_ON,
  benefits: [
    { text: "Unlimited eligible primary care visits" },
    {
      text: `${formatUSD(GOLD_MEMBER_VISIT_FEE)} member visit fee each time the member sees a provider`,
    },
    { text: "Routine labs included", footnote: "routine-labs" },
    { text: "Discounted in-office procedures" },
    { text: "Family add-on available", group: "family" },
    {
      text: `Add up to ${GOLD_FAMILY_ADD_ON.maxAdditionalMembers} direct family members`,
      group: "family",
    },
    {
      text: `Eligible family members: ${GOLD_FAMILY_ADD_ON.eligibleRelations}`,
      group: "family",
    },
    {
      text: `Family add-on: ${formatUSD(GOLD_FAMILY_ADD_ON.monthlyPricePerMember)}/month per additional family member`,
      group: "family",
    },
    {
      text: `Each added family member pays the same ${formatUSD(GOLD_MEMBER_VISIT_FEE)} member visit fee each time they see a provider`,
      group: "family",
    },
    ...SHARED_ACCESS_BENEFITS,
    ...NO_FEES_BENEFITS,
  ],
};

export const MEMBERSHIP_PLANS: readonly MembershipPlan[] = [SILVER_PLAN, GOLD_PLAN];

export function getMembershipPlan(id: MembershipPlanId): MembershipPlan {
  return id === "gold" ? GOLD_PLAN : SILVER_PLAN;
}

export function getEnrollPath(id: MembershipPlanId): string {
  return `${MEMBERSHIP_ENROLL_PATH}?plan=${id}`;
}

export function footnoteAnchorId(id: MembershipFootnoteId): string {
  return `membership-footnote-${id}`;
}

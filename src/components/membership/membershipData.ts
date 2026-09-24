export type MembershipPlanId = "silver" | "gold";

export type MembershipFootnoteId = "routine-labs";

export interface MembershipFootnote {
  id: MembershipFootnoteId;
  marker: string;
  text: string;
  // First sentence of `text`, for compact placements that link to full details.
  summary: string;
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
  eligibleMembers: readonly string[];
}

export interface MembershipPlan {
  id: MembershipPlanId;
  name: string;
  // Display only. Future payments must use server-side prices keyed by plan id,
  // never an amount sent from the browser.
  monthlyPrice: number;
  positioning: string;
  tagline: string;
  benefits: MembershipBenefit[];
  // Benefits shown on the plan cards of the membership plans page.
  cardBenefits: MembershipBenefit[];
  // Abbreviated benefits for compact placements such as the home-page teaser.
  highlights: MembershipBenefit[];
  memberVisitFee?: number;
  additionalVisitPrice?: number;
  familyAddOn?: MembershipFamilyAddOn;
}

export interface MembershipComparisonRow {
  id: string;
  label: string;
  silver: string;
  gold: string;
  goldFootnote?: MembershipFootnoteId;
}

export const MEMBERSHIP_ENROLL_PATH = "/membership/enroll";
export const MEMBERSHIP_PLANS_PATH = "/membership-plans";

export const MEMBERSHIP_LOCATION_COUNT = 7;

export const MEMBERSHIP_ELIGIBILITY = {
  minimumAge: 18,
  summary: "Adults age 18+",
  statement: "Primary Medical Physicians membership plans are available to adults age 18 and older.",
  exclusion:
    "Membership is not available to patients enrolled in Medicare, Medicaid, TRICARE, or other federal government health care programs.",
} as const;

export const MEMBERSHIP_FOOTNOTES: Record<MembershipFootnoteId, MembershipFootnote> = {
  "routine-labs": {
    id: "routine-labs",
    marker: "*",
    summary: "Gold includes eligible routine laboratory testing as defined by Primary Medical Physicians.",
    text: "Gold includes eligible routine laboratory testing as defined by Primary Medical Physicians. Specialty or send-out testing, genetics, pathology, imaging, medications, vaccines, and third-party services are not included unless expressly stated. The complete included-lab list will be published before enrollment opens.",
  },
};

export const ROUTINE_LABS = {
  summary: MEMBERSHIP_FOOTNOTES["routine-labs"].summary,
  notIncluded: [
    "Specialty or send-out testing",
    "Genetics",
    "Pathology",
    "Imaging",
    "Medications",
    "Vaccines",
    "Third-party services",
  ],
  publication: "The complete included routine-lab list will be published before enrollment opens.",
} as const;

export const MEMBERSHIP_INSURANCE_DISCLOSURE =
  "Membership is not health insurance. Eligibility, covered services, exclusions, cancellation terms, and complete membership conditions are provided in the membership agreement.";

export const MEMBERSHIP_CANCELLATION: readonly string[] = [
  "Memberships are month-to-month and automatically renew each month until canceled.",
  "Members may cancel by providing Primary Medical Physicians with written notice. Cancellation becomes effective 30 days after PMP receives the cancellation request.",
  "Membership benefits remain available during the applicable notice period, subject to the membership agreement.",
  "The complete cancellation, refund, and termination terms will be included in the membership agreement.",
];

export function formatUSD(amount: number): string {
  return Number.isInteger(amount) ? `$${amount}` : `$${amount.toFixed(2)}`;
}

const SILVER_ADDITIONAL_VISIT = 50;
const GOLD_MEMBER_VISIT_FEE = 10;
const GOLD_FAMILY_ADD_ON: MembershipFamilyAddOn = {
  maxAdditionalMembers: 3,
  monthlyPricePerMember: 20,
  eligibleRelations: "spouse and/or children age 18+",
  eligibleMembers: ["Spouse", "Children age 18 or older"],
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
  tagline: "Preventive + Savings",
  additionalVisitPrice: SILVER_ADDITIONAL_VISIT,
  highlights: [
    { text: "Annual preventive visit included" },
    { text: `${formatUSD(SILVER_ADDITIONAL_VISIT)} additional primary care visits` },
    { text: "Discounted laboratory services" },
    { text: "Discounted in-office procedures" },
  ],
  cardBenefits: [
    { text: "Complete annual preventive visit included" },
    { text: `Additional primary care visits: ${formatUSD(SILVER_ADDITIONAL_VISIT)} each` },
    { text: "Discounted laboratory services" },
    { text: "Discounted in-office procedures" },
    { text: "Access across PMP locations" },
  ],
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
  tagline: "Ongoing Access",
  memberVisitFee: GOLD_MEMBER_VISIT_FEE,
  familyAddOn: GOLD_FAMILY_ADD_ON,
  highlights: [
    { text: "Unlimited primary care visits" },
    { text: "Routine labs included", footnote: "routine-labs" },
    { text: `${formatUSD(GOLD_MEMBER_VISIT_FEE)} member visit fee` },
    { text: "Family membership options" },
  ],
  cardBenefits: [
    { text: "Unlimited eligible primary care visits" },
    { text: `${formatUSD(GOLD_MEMBER_VISIT_FEE)} member visit fee per visit` },
    { text: "Routine labs included", footnote: "routine-labs" },
    { text: "Discounted in-office procedures" },
    { text: "Family add-on available" },
    { text: "Access across PMP locations" },
  ],
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

export const MEMBERSHIP_COMPARISON: readonly MembershipComparisonRow[] = [
  {
    id: "price",
    label: "Monthly price",
    silver: formatUSD(SILVER_PLAN.monthlyPrice),
    gold: formatUSD(GOLD_PLAN.monthlyPrice),
  },
  { id: "enrollment-fee", label: "Enrollment fee", silver: "None", gold: "None" },
  {
    id: "preventive",
    label: "Annual preventive visit",
    silver: "Included",
    gold: "Included within eligible unlimited primary care visits",
  },
  {
    id: "visits",
    label: "Additional / primary care visits",
    silver: `${formatUSD(SILVER_ADDITIONAL_VISIT)} each after included annual preventive visit`,
    gold: "Unlimited eligible primary care visits",
  },
  {
    id: "visit-fee",
    label: "Member visit fee",
    silver: `${formatUSD(SILVER_ADDITIONAL_VISIT)} for each additional primary care visit`,
    gold: `${formatUSD(GOLD_MEMBER_VISIT_FEE)} per primary care visit`,
  },
  { id: "labs", label: "Routine labs", silver: "Discounted", gold: "Included", goldFootnote: "routine-labs" },
  { id: "procedures", label: "In-office procedures", silver: "Discounted", gold: "Discounted" },
  {
    id: "family",
    label: "Family add-on",
    silver: "Not available",
    gold: `Up to ${GOLD_FAMILY_ADD_ON.maxAdditionalMembers} eligible direct family members, ${formatUSD(GOLD_FAMILY_ADD_ON.monthlyPricePerMember)}/month each`,
  },
  { id: "access", label: "Practice access", silver: "PMP locations/providers", gold: "PMP locations/providers" },
  {
    id: "age",
    label: "Minimum age",
    silver: `${MEMBERSHIP_ELIGIBILITY.minimumAge}+`,
    gold: `${MEMBERSHIP_ELIGIBILITY.minimumAge}+`,
  },
];

export const MEMBERSHIP_REASSURANCE: readonly string[] = [
  "No enrollment fee",
  `Adults ${MEMBERSHIP_ELIGIBILITY.minimumAge}+`,
  "Available across PMP locations",
];

export const MEMBERSHIP_CTA_REASSURANCE: readonly string[] = [
  "No enrollment fee",
  `Adults ${MEMBERSHIP_ELIGIBILITY.minimumAge}+`,
  "Eligibility restrictions apply",
];

export const MEMBERSHIP_ELIGIBILITY_NOTE = "Membership eligibility restrictions apply.";

const PLAN_IDS: readonly MembershipPlanId[] = ["silver", "gold"];

// Strict allowlist for untrusted input such as the enrollment `?plan=` value.
export function parseMembershipPlanId(value: string | null | undefined): MembershipPlanId | null {
  return PLAN_IDS.find((id) => id === value) ?? null;
}

export function getMembershipPlan(id: MembershipPlanId): MembershipPlan {
  return id === "gold" ? GOLD_PLAN : SILVER_PLAN;
}

export function getEnrollPath(id: MembershipPlanId): string {
  return `${MEMBERSHIP_ENROLL_PATH}?plan=${id}`;
}

export function footnoteAnchorId(id: MembershipFootnoteId): string {
  return `membership-footnote-${id}`;
}

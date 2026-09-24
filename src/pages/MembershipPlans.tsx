import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  ClipboardCheck,
  FileSignature,
  HeartPulse,
  Info,
  LayoutList,
  MapPin,
  UserCheck,
  Users,
} from "lucide-react";
import CareConstellation, { type ConstellationAnchorRef } from "../components/membership/CareConstellation";
import MembershipPlanCard from "../components/membership/MembershipPlanCard";
import MembershipFaq, { type MembershipFaqItem } from "../components/membership/MembershipFaq";
import MembershipReassurance from "../components/membership/MembershipReassurance";
import { PRESSABLE_CARD, PRESS_HANDLERS } from "../components/membership/pressFeedback";
import { MEMBERSHIP_TEXT_SCRIM, PMP_PRIMARY_CTA } from "../components/membership/membershipTheme";
import {
  GOLD_PLAN,
  MEMBERSHIP_CANCELLATION,
  MEMBERSHIP_COMPARISON,
  MEMBERSHIP_CTA_REASSURANCE,
  MEMBERSHIP_ELIGIBILITY,
  MEMBERSHIP_FOOTNOTES,
  MEMBERSHIP_INSURANCE_DISCLOSURE,
  MEMBERSHIP_LOCATION_COUNT,
  ROUTINE_LABS,
  SILVER_PLAN,
  footnoteAnchorId,
  formatUSD,
  getEnrollPath,
  type MembershipBenefit,
} from "../components/membership/membershipData";

const PAGE_TITLE = "Primary Care Membership Plans | Primary Medical Physicians";
const PAGE_DESCRIPTION =
  "Explore Silver and Gold primary care membership plans from Primary Medical Physicians, with clear monthly pricing, defined benefits, and access across PMP locations.";
const PAGE_URL = "https://primarymedicalphysicians.com/membership-plans";

const FAMILY = GOLD_PLAN.familyAddOn!;
const LABS_ID = footnoteAnchorId("routine-labs");
const labsMarker = MEMBERSHIP_FOOTNOTES["routine-labs"].marker;

const TRUST_FACTS = [
  { icon: BadgeCheck, label: "No enrollment fee" },
  { icon: UserCheck, label: `Adults ${MEMBERSHIP_ELIGIBILITY.minimumAge}+` },
  { icon: MapPin, label: `${MEMBERSHIP_LOCATION_COUNT} PMP locations` },
  { icon: CalendarClock, label: "Monthly membership" },
];

const STEPS = [
  { icon: LayoutList, title: "Choose your membership", text: "Compare Silver and Gold." },
  { icon: ClipboardCheck, title: "Confirm eligibility", text: "Review membership eligibility and covered services." },
  { icon: FileSignature, title: "Complete enrollment", text: "Review and accept the membership agreement." },
  {
    icon: HeartPulse,
    title: "Access your membership care",
    text: "Use eligible membership benefits across Primary Medical Physicians.",
  },
];

function FootnoteMarker() {
  return (
    <a
      href={`#${LABS_ID}`}
      className="-my-2 inline-block rounded-sm py-2 pl-px pr-1.5 text-primary-900/70 hover:text-primary-900"
    >
      <span aria-hidden="true">{labsMarker}</span>
      <span className="sr-only"> (see About Routine Labs)</span>
    </a>
  );
}

function BenefitList({ benefits }: { benefits: MembershipBenefit[] }) {
  return (
    <ul className="mt-2 list-disc space-y-1 pl-5 marker:text-accent-700">
      {benefits.map((b) => (
        <li key={b.text}>
          {b.text}
          {b.footnote && <FootnoteMarker />}
        </li>
      ))}
    </ul>
  );
}

const FAQ_ITEMS: MembershipFaqItem[] = [
  {
    id: "what",
    question: "What is a Primary Medical Physicians membership?",
    answer: (
      <p>
        A month-to-month primary care membership with two levels: Silver at {formatUSD(SILVER_PLAN.monthlyPrice)}/month
        and Gold at {formatUSD(GOLD_PLAN.monthlyPrice)}/month. Each level has clear monthly pricing and defined benefits,
        with care across Primary Medical Physicians locations.
      </p>
    ),
  },
  {
    id: "insurance",
    question: "Is membership health insurance?",
    answer: <p>No. {MEMBERSHIP_INSURANCE_DISCLOSURE}</p>,
  },
  {
    id: "eligible",
    question: "Who is eligible?",
    answer: (
      <p>
        {MEMBERSHIP_ELIGIBILITY.statement} {MEMBERSHIP_ELIGIBILITY.exclusion}
      </p>
    ),
  },
  {
    id: "medicare",
    question: "Can Medicare or Medicaid patients enroll?",
    answer: <p>No. {MEMBERSHIP_ELIGIBILITY.exclusion}</p>,
  },
  {
    id: "silver",
    question: "What's included in Silver?",
    answer: (
      <>
        <p>Silver ({formatUSD(SILVER_PLAN.monthlyPrice)}/month) includes:</p>
        <BenefitList benefits={SILVER_PLAN.cardBenefits} />
      </>
    ),
  },
  {
    id: "gold",
    question: "What's included in Gold?",
    answer: (
      <>
        <p>Gold ({formatUSD(GOLD_PLAN.monthlyPrice)}/month) includes:</p>
        <BenefitList benefits={GOLD_PLAN.cardBenefits} />
      </>
    ),
  },
  {
    id: "labs",
    question: "What are routine labs?",
    answer: <p>{MEMBERSHIP_FOOTNOTES["routine-labs"].text}</p>,
  },
  {
    id: "family",
    question: "Can I add family members?",
    answer: (
      <p>
        Family members can be added to Gold only. Gold members may add up to {FAMILY.maxAdditionalMembers} eligible
        direct family members: a spouse and/or children age 18 or older. Each additional family member is{" "}
        {formatUSD(FAMILY.monthlyPricePerMember)}/month and pays a {formatUSD(GOLD_PLAN.memberVisitFee!)} member visit
        fee each time they see a PMP provider. Silver does not include a family add-on.
      </p>
    ),
  },
  {
    id: "fee",
    question: "Is there an enrollment fee?",
    answer: <p>No. Neither Silver nor Gold has an enrollment fee or a registration fee.</p>,
  },
  {
    id: "where",
    question: "Where can I use my membership?",
    answer: (
      <p>
        Membership benefits are available across Primary Medical Physicians locations, with access to PMP primary care
        providers.
      </p>
    ),
  },
  {
    id: "cancel",
    question: "How do I cancel?",
    answer: (
      <ul className="list-disc space-y-2 pl-5 marker:text-accent-700">
        {MEMBERSHIP_CANCELLATION.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    ),
  },
];

// Sets title/description/canonical/JSON-LD like the site's other pages, and
// restores the previous values when leaving the page.
function usePageMetadata() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = PAGE_TITLE;

    const upsert = (selector: string, create: () => HTMLElement, attr: string, value: string) => {
      let el = document.head.querySelector<HTMLElement>(selector);
      const existed = !!el;
      if (!el) {
        el = create();
        document.head.appendChild(el);
      }
      const previous = el.getAttribute(attr);
      el.setAttribute(attr, value);
      return () => {
        if (!existed) el!.remove();
        else if (previous !== null) el!.setAttribute(attr, previous);
      };
    };

    const restoreDescription = upsert(
      'meta[name="description"]',
      () => Object.assign(document.createElement("meta"), { name: "description" }),
      "content",
      PAGE_DESCRIPTION,
    );
    const restoreCanonical = upsert(
      'link[rel="canonical"]',
      () => Object.assign(document.createElement("link"), { rel: "canonical" }),
      "href",
      PAGE_URL,
    );

    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Primary Care Membership Plans",
      description: PAGE_DESCRIPTION,
      url: PAGE_URL,
      provider: {
        "@type": "MedicalBusiness",
        name: "Primary Medical Physicians",
        url: "https://primarymedicalphysicians.com",
      },
    });
    document.head.appendChild(schema);

    return () => {
      document.title = previousTitle;
      restoreDescription();
      restoreCanonical();
      schema.remove();
    };
  }, []);
}

// Arriving with a hash (e.g. /membership-plans#gold from the home page): the
// app scrolls to top on route change, so scroll to the target once layout and
// the scroll animations have settled, as the home page does for its sections.
function useInitialHashScroll() {
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const timer = setTimeout(() => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target) return;
      const top = target.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top, behavior: "smooth" });
    }, isIOS ? 750 : 500);
    return () => clearTimeout(timer);
    // Only on arrival; in-page anchor links use native jumps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

function SectionHeader({
  eyebrow,
  title,
  id,
  children,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  id: string;
  children?: ReactNode;
  align?: "center" | "left";
}) {
  return (
    <header
      className={`reveal-up max-w-2xl ${align === "center" ? "mx-auto text-center" : ""} ${MEMBERSHIP_TEXT_SCRIM}`}
    >
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent-700">{eyebrow}</p>
      <h2
        id={id}
        className="mt-4 text-balance font-serif text-3xl font-medium leading-tight text-primary-900 sm:text-4xl lg:text-5xl"
      >
        {title}
      </h2>
      {children && <div className="mt-4 text-base leading-relaxed text-primary-900/70 sm:text-lg">{children}</div>}
    </header>
  );
}

function Panel({
  children,
  className = "",
  panelRef,
}: {
  children: ReactNode;
  className?: string;
  panelRef?: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={panelRef}
      {...PRESS_HANDLERS}
      className={`rounded-3xl border border-primary-900/10 bg-white p-6 shadow-[0_18px_44px_-30px_rgba(10,25,47,0.28)] sm:p-8 ${PRESSABLE_CARD} ${className}`}
    >
      {children}
    </div>
  );
}

// Section tints are painted in a negative-z pseudo-element so they sit under
// the particle canvas; content stays above it.
const TINT = {
  white: "",
  mist: "before:bg-member-mist [--membership-scrim:var(--color-member-mist)]",
  aqua: "before:bg-[linear-gradient(180deg,var(--color-member-mist),#fff)] [--membership-scrim:var(--color-member-mist)]",
} as const;

function tinted(tint: keyof typeof TINT) {
  return `relative before:pointer-events-none before:absolute before:inset-0 before:-z-10 ${TINT[tint]}`;
}

const TIER_LABEL = {
  silver: "flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-member-silver-ink",
  gold: "flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-member-gold-ink",
} as const;

export default function MembershipPlans() {
  const factsRef = useRef<HTMLUListElement>(null);
  const silverRef = useRef<HTMLDivElement>(null);
  const goldRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const familyRef = useRef<HTMLDivElement>(null);
  const labsRef = useRef<HTMLDivElement>(null);
  const discountsRef = useRef<HTMLDivElement>(null);
  const eligibilityRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLOListElement>(null);
  const insuranceRef = useRef<HTMLDivElement>(null);
  const cancellationRef = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);

  // One shared particle pool for the page. Plan cards get their tier colour
  // plus PMP green at full weight; major information cards get a subtler
  // PMP-green-only perimeter; the quick facts and final CTA only a faint one.
  // Hidden elements (the desktop table on phones) are ignored by the engine.
  const anchors = useRef<ConstellationAnchorRef[]>([
    { ref: factsRef, kind: "green", weight: 0.25 },
    { ref: silverRef, kind: "silver", weight: 1 },
    { ref: goldRef, kind: "gold", weight: 1 },
    { ref: tableRef, kind: "green", weight: 0.45 },
    { ref: familyRef, kind: "green", weight: 0.6 },
    { ref: labsRef, kind: "green", weight: 0.5 },
    { ref: discountsRef, kind: "green", weight: 0.45 },
    { ref: eligibilityRef, kind: "green", weight: 0.5 },
    { ref: stepsRef, kind: "green", weight: 0.45 },
    { ref: insuranceRef, kind: "green", weight: 0.5 },
    { ref: cancellationRef, kind: "green", weight: 0.5 },
    { ref: finalRef, kind: "green", weight: 0.3 },
  ]).current;

  usePageMetadata();
  useInitialHashScroll();

  return (
    <main className="relative isolate overflow-x-clip bg-white text-primary-900">
      <CareConstellation anchors={anchors} intensity={0.45} />

      {/* The site header is transparent with white text until scrolled; this
          navy band behind it keeps it legible above the light page. */}
      <div aria-hidden="true" className="relative h-20 bg-primary-900 lg:h-[88px] xl:h-24 2xl:h-[104px]" />

      <div className="relative">
        {/* Hero: intro, then the quick facts straight away (no decorative gap). */}
        <section
          aria-labelledby="membership-plans-title"
          className={`${tinted("aqua")} pb-14 pt-12 sm:pb-16 sm:pt-16 lg:pb-20 lg:pt-20`}
        >
          <div className="mx-auto w-full max-w-6xl px-5 sm:px-6 lg:px-8">
            <div className={`mx-auto max-w-2xl text-center lg:mx-0 lg:text-left ${MEMBERSHIP_TEXT_SCRIM}`}>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent-700 sm:text-xs sm:tracking-[0.25em]">
                Primary Medical Physicians Membership
              </p>
              <h1
                id="membership-plans-title"
                className="mt-5 text-balance font-serif text-[2.6rem] font-medium leading-[1.05] text-primary-900 sm:text-6xl lg:text-7xl"
              >
                Primary Care Membership Plans
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-primary-900/80 sm:text-xl">
                Clear monthly pricing. Defined benefits. Primary care across Primary Medical Physicians.
              </p>
              <p className="mt-3 text-base leading-relaxed text-primary-900/65">
                Choose the membership level that fits how you use primary care.
              </p>
              <div className="mt-9 hidden gap-3 lg:flex">
                <a
                  href="#plans"
                  className="inline-flex min-h-12 items-center gap-2 rounded-full bg-accent-500 px-7 py-3.5 font-bold text-primary-900 shadow-sm transition-all hover:bg-accent-400 hover:shadow-md"
                >
                  View plans
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </a>
                <a
                  href="#compare"
                  className="inline-flex min-h-12 items-center rounded-full border border-primary-900/20 bg-white px-7 py-3.5 font-bold text-primary-900 transition-colors hover:border-accent-500 hover:bg-member-mist"
                >
                  Compare plans
                </a>
              </div>
            </div>

            <ul
              ref={factsRef}
              aria-label="Membership at a glance"
              className="mt-10 grid auto-rows-fr grid-cols-2 gap-3 sm:gap-4 lg:mt-14 lg:grid-cols-4"
            >
              {TRUST_FACTS.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  {...PRESS_HANDLERS}
                  className={`flex h-full flex-col items-start gap-2.5 rounded-2xl border border-primary-900/10 bg-white px-4 py-4 shadow-[0_12px_30px_-24px_rgba(10,25,47,0.35)] sm:flex-row sm:items-center sm:gap-4 sm:px-5 ${PRESSABLE_CARD}`}
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-member-aqua text-accent-700">
                    <Icon aria-hidden="true" className="h-[18px] w-[18px]" />
                  </span>
                  <span className="text-sm font-semibold leading-snug text-primary-900 sm:text-base">{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Plans */}
        <section id="plans" aria-labelledby="plans-title" className={`${tinted("mist")} scroll-mt-24 py-20 sm:py-28`}>
          <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
            <SectionHeader eyebrow="Membership plans" title="Silver and Gold" id="plans-title" />
            {/* Phones: a 48px gap gives each plan's particles room to settle. */}
            <div className="mx-auto mt-12 grid max-w-[30rem] gap-12 md:max-w-none md:grid-cols-2 md:gap-8 lg:gap-12">
              <div ref={silverRef} className="h-full">
                <MembershipPlanCard
                  id="silver"
                  plan={SILVER_PLAN}
                  benefits={SILVER_PLAN.cardBenefits}
                  headingLevel={3}
                  className="scroll-mt-28"
                />
              </div>
              <div ref={goldRef} className="h-full">
                <MembershipPlanCard
                  id="gold"
                  plan={GOLD_PLAN}
                  benefits={GOLD_PLAN.cardBenefits}
                  headingLevel={3}
                  className="scroll-mt-28"
                />
              </div>
            </div>
            <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-primary-900/70">
              {labsMarker}
              {ROUTINE_LABS.summary}{" "}
              <a href={`#${LABS_ID}`} className="font-semibold text-accent-700 underline underline-offset-4 hover:text-primary-900">
                About routine labs
              </a>
              <span aria-hidden="true"> · </span>
              <a href="#eligibility" className="font-semibold text-accent-700 underline underline-offset-4 hover:text-primary-900">
                Eligibility
              </a>
            </p>
          </div>
        </section>

        {/* Comparison */}
        <section id="compare" aria-labelledby="compare-title" className={`${tinted("white")} scroll-mt-24 py-20 sm:py-28`}>
          <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
            <SectionHeader eyebrow="Plan comparison" title="Compare Silver and Gold" id="compare-title" />

            <div
              ref={tableRef}
              className="mt-12 hidden overflow-hidden rounded-3xl border border-primary-900/10 bg-white shadow-[0_18px_44px_-30px_rgba(10,25,47,0.28)] md:block"
            >
              <table className="w-full table-fixed border-collapse text-left">
                <caption className="sr-only">Silver and Gold membership comparison</caption>
                <colgroup>
                  <col className="w-[30%]" />
                  <col className="w-[35%]" />
                  <col className="w-[35%]" />
                </colgroup>
                <thead>
                  <tr className="border-b border-primary-900/10">
                    <th scope="col" className="px-6 py-5 align-bottom text-sm font-bold uppercase tracking-wider text-primary-900/60">
                      Benefit
                    </th>
                    <th scope="col" className="border-t-2 border-member-silver-ink/50 px-6 py-5 align-bottom">
                      <span className={TIER_LABEL.silver}>
                        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-member-silver-ink" />
                        {SILVER_PLAN.tagline}
                      </span>
                      <span className="mt-1 block font-serif text-2xl font-medium text-primary-900">Silver</span>
                    </th>
                    <th scope="col" className="border-t-2 border-member-gold bg-[#fdfaf4] px-6 py-5 align-bottom">
                      <span className={TIER_LABEL.gold}>
                        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-member-gold" />
                        {GOLD_PLAN.tagline}
                      </span>
                      <span className="mt-1 block font-serif text-2xl font-medium text-primary-900">Gold</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {MEMBERSHIP_COMPARISON.map((row) => (
                    <tr key={row.id} className="border-t border-primary-900/[0.07] first:border-t-0 even:bg-member-mist/70">
                      <th scope="row" className="px-6 py-4 align-top text-[15px] font-semibold text-primary-900">
                        {row.label}
                      </th>
                      <td className="px-6 py-4 align-top text-[15px] leading-relaxed text-primary-900/80">{row.silver}</td>
                      <td className="bg-[#fdfaf4]/80 px-6 py-4 align-top text-[15px] leading-relaxed text-primary-900/85">
                        {row.gold}
                        {row.goldFootnote && <FootnoteMarker />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Phones: one stacked module per benefit, Silver and Gold always labelled. */}
            <ul className="mt-10 space-y-3 md:hidden">
              {MEMBERSHIP_COMPARISON.map((row) => (
                <li key={row.id} className="rounded-2xl border border-primary-900/10 bg-white p-4 shadow-[0_10px_24px_-20px_rgba(10,25,47,0.35)]">
                  <p className="text-[15px] font-bold text-primary-900">{row.label}</p>
                  <dl className="mt-3 space-y-2">
                    <div className="grid grid-cols-[4.25rem_1fr] items-baseline gap-3 rounded-xl border-l-2 border-member-silver-ink/50 bg-[#f4f7fa] px-3 py-2.5">
                      <dt className={TIER_LABEL.silver}>Silver</dt>
                      <dd className="text-[15px] leading-snug text-primary-900/85">{row.silver}</dd>
                    </div>
                    <div className="grid grid-cols-[4.25rem_1fr] items-baseline gap-3 rounded-xl border-l-2 border-member-gold bg-[#fbf7ef] px-3 py-2.5">
                      <dt className={TIER_LABEL.gold}>Gold</dt>
                      <dd className="text-[15px] leading-snug text-primary-900/90">
                        {row.gold}
                        {row.goldFootnote && <FootnoteMarker />}
                      </dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Gold family option */}
        <section id="family" aria-labelledby="family-title" className={`${tinted("white")} scroll-mt-24 pb-20 sm:pb-28`}>
          <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
            {/* Soft aqua container, painted beneath the particle canvas so its green perimeter shows over it. */}
            <div
              ref={familyRef}
              className="relative grid items-center gap-10 rounded-[2rem] px-5 py-12 before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[2rem] before:border before:border-primary-900/[0.06] before:bg-member-aqua sm:px-10 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:px-14 [--membership-scrim:var(--color-member-aqua)]"
            >
              <SectionHeader eyebrow="Gold add-on" title="Gold Family Option" id="family-title" align="left">
                <p>Gold members may add up to {FAMILY.maxAdditionalMembers} eligible direct family members.</p>
              </SectionHeader>

              <Panel className="reveal-up">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-primary-900/65">Eligible family members</h3>
                  <ul className="mt-3 space-y-2">
                    {FAMILY.eligibleMembers.map((member) => (
                      <li key={member} className="flex items-center gap-3 text-base font-medium text-primary-900">
                        <Users aria-hidden="true" className="h-[18px] w-[18px] shrink-0 text-member-gold-ink" />
                        {member}
                      </li>
                    ))}
                  </ul>
                  <dl className="mt-6 grid gap-4 border-t border-primary-900/10 pt-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm text-primary-900/65">Price</dt>
                      <dd className="mt-1 whitespace-nowrap font-serif text-3xl text-primary-900">
                        {formatUSD(FAMILY.monthlyPricePerMember)}
                        <span className="ml-1 font-sans text-sm text-primary-900/65">/&nbsp;month</span>
                      </dd>
                      <dd className="mt-1 text-sm text-primary-900/75">per additional family member</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-primary-900/65">Member visit fee</dt>
                      <dd className="mt-1 text-[15px] leading-relaxed text-primary-900/85">
                        Each additional family member also pays a {formatUSD(GOLD_PLAN.memberVisitFee!)} member visit fee
                        each time they see a PMP provider.
                      </dd>
                    </div>
                  </dl>
              </Panel>
            </div>
          </div>
        </section>

        {/* Routine labs + discounted services */}
        <section id={LABS_ID} aria-labelledby="labs-title" className={`${tinted("mist")} scroll-mt-24 py-20 sm:py-24`}>
          <div className="mx-auto grid max-w-6xl gap-6 px-5 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:px-8">
            <Panel className="reveal-up" panelRef={labsRef}>
              <h2 id="labs-title" className="font-serif text-3xl font-medium text-primary-900 sm:text-4xl">
                About Routine Labs
              </h2>
              <p className="mt-4 text-base leading-relaxed text-primary-900/85 sm:text-lg">{ROUTINE_LABS.summary}</p>
              <p className="mt-6 text-sm font-bold uppercase tracking-wider text-primary-900/65">
                Not included unless expressly stated
              </p>
              <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                {ROUTINE_LABS.notIncluded.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] text-primary-900/80">
                    <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-900/35" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-primary-900/10 pt-5 text-[15px] leading-relaxed text-primary-900/80">
                {ROUTINE_LABS.publication}
              </p>
            </Panel>

            <Panel className="reveal-up" panelRef={discountsRef}>
              <h3 className="font-serif text-2xl font-medium text-primary-900">Discounted services</h3>
              <dl className="mt-5 space-y-5">
                <div className="border-l-2 border-member-silver-ink/50 pl-4">
                  <dt className={TIER_LABEL.silver}>Silver</dt>
                  <dd className="mt-2 text-[15px] leading-relaxed text-primary-900/85">
                    Discounted laboratory services
                    <br />
                    Discounted in-office procedures
                  </dd>
                </div>
                <div className="border-l-2 border-member-gold pl-4">
                  <dt className={TIER_LABEL.gold}>Gold</dt>
                  <dd className="mt-2 text-[15px] leading-relaxed text-primary-900/85">Discounted in-office procedures</dd>
                </div>
              </dl>
            </Panel>
          </div>
        </section>

        {/* Eligibility */}
        <section id="eligibility" aria-labelledby="eligibility-title" className={`${tinted("white")} scroll-mt-24 py-20 sm:py-24`}>
          <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
            <Panel className="reveal-up flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-7" panelRef={eligibilityRef}>
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-member-aqua text-accent-700">
                <UserCheck aria-hidden="true" className="h-6 w-6" />
              </span>
              <div>
                <h2 id="eligibility-title" className="font-serif text-3xl font-medium text-primary-900 sm:text-4xl">
                  Eligibility
                </h2>
                <p className="mt-4 text-base leading-relaxed text-primary-900/85 sm:text-lg">{MEMBERSHIP_ELIGIBILITY.statement}</p>
                <p className="mt-2 text-base leading-relaxed text-primary-900/85 sm:text-lg">{MEMBERSHIP_ELIGIBILITY.exclusion}</p>
              </div>
            </Panel>
          </div>
        </section>

        {/* How it works */}
        <section aria-labelledby="how-title" className={`${tinted("mist")} py-20 sm:py-28`}>
          <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
            <SectionHeader eyebrow="How it works" title="How membership works" id="how-title" />
            <ol ref={stepsRef} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map(({ icon: Icon, title, text }, i) => (
                <li
                  key={title}
                  {...PRESS_HANDLERS}
                  className={`reveal-up rounded-3xl border border-primary-900/10 bg-white p-6 shadow-[0_14px_34px_-28px_rgba(10,25,47,0.35)] ${PRESSABLE_CARD}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-member-aqua text-accent-700">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <span aria-hidden="true" className="font-serif text-3xl text-primary-900/15">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-primary-900">
                    <span className="sr-only">Step {i + 1}: </span>
                    {title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-primary-900/75">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Membership & insurance, cancellation */}
        <section aria-labelledby="terms-title" className={`${tinted("white")} py-20 sm:py-28`}>
          <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
            <SectionHeader eyebrow="Before you enroll" title="Important membership information" id="terms-title" />
            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              <Panel className="reveal-up" panelRef={insuranceRef}>
                <div className="flex items-center gap-3">
                  <Info aria-hidden="true" className="h-5 w-5 shrink-0 text-accent-700" />
                  <h3 className="text-xl font-bold text-primary-900">Membership and insurance</h3>
                </div>
                <p className="mt-4 text-base leading-relaxed text-primary-900/85">{MEMBERSHIP_INSURANCE_DISCLOSURE}</p>
              </Panel>
              <Panel className="reveal-up" panelRef={cancellationRef}>
                <div className="flex items-center gap-3">
                  <CalendarClock aria-hidden="true" className="h-5 w-5 shrink-0 text-accent-700" />
                  <h3 className="text-xl font-bold text-primary-900">Cancellation</h3>
                </div>
                <ul className="mt-4 space-y-3">
                  {MEMBERSHIP_CANCELLATION.map((line) => (
                    <li key={line} className="flex items-start gap-3 text-[15px] leading-relaxed text-primary-900/85">
                      <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                      {line}
                    </li>
                  ))}
                </ul>
              </Panel>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" aria-labelledby="faq-title" className={`${tinted("mist")} scroll-mt-24 py-20 sm:py-28`}>
          <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8">
            <SectionHeader eyebrow="FAQ" title="Frequently asked questions" id="faq-title" />
            <div className="mt-10">
              <MembershipFaq items={FAQ_ITEMS} />
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section aria-labelledby="final-title" className={`${tinted("aqua")} px-5 pb-24 pt-16 sm:px-6 sm:pb-32 sm:pt-24 lg:px-8`}>
          <div ref={finalRef} className={`reveal-up mx-auto max-w-3xl text-center ${MEMBERSHIP_TEXT_SCRIM}`}>
            <h2
              id="final-title"
              className="text-balance font-serif text-[2.1rem] font-medium leading-[1.1] text-primary-900 sm:text-5xl lg:text-6xl"
            >
              Choose the primary care membership that fits you.
            </h2>
            <div className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
              {[SILVER_PLAN, GOLD_PLAN].map((plan) => (
                <Link
                  key={plan.id}
                  to={getEnrollPath(plan.id)}
                  className={`inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full px-8 py-4 font-bold transition-[background-color,border-color,box-shadow,transform] duration-200 touch-manipulation active:scale-[0.98] motion-reduce:transition-none sm:min-w-[13rem] ${PMP_PRIMARY_CTA}`}
                >
                  Choose {plan.name}
                </Link>
              ))}
            </div>
            <MembershipReassurance items={MEMBERSHIP_CTA_REASSURANCE} className="mt-7" />
          </div>
        </section>
      </div>
    </main>
  );
}

import { Fragment, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Info, Phone } from "lucide-react";
import CareConstellation, { type ConstellationAnchorRef } from "../components/membership/CareConstellation";
import MembershipBadge from "../components/membership/MembershipBadge";
import MembershipPrice from "../components/membership/MembershipPrice";
import { MEMBERSHIP_TIER_STYLES, PMP_PRIMARY_CTA } from "../components/membership/membershipTheme";
import {
  MEMBERSHIP_PLANS_PATH,
  getMembershipPlan,
  parseMembershipPlanId,
  type MembershipPlan,
} from "../components/membership/membershipData";

// The same practice phone number the header, footer and 404 page link to.
const PMP_PHONE_HREF = "tel:9543999014";
const PMP_PHONE_LABEL = "(954) 399-9014";

// Placeholder route until online enrollment exists; keep it out of search results.
function useEnrollMetadata(plan: MembershipPlan | null) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = plan
      ? `${plan.name} Membership Enrollment | Primary Medical Physicians`
      : "Membership Enrollment | Primary Medical Physicians";

    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, follow";
    document.head.appendChild(robots);

    return () => {
      document.title = previousTitle;
      robots.remove();
    };
  }, [plan]);
}

const primaryAction = `inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full px-5 py-4 font-bold transition-[background-color,border-color,box-shadow,transform] duration-200 touch-manipulation active:scale-[0.98] motion-reduce:transition-none sm:w-auto sm:px-7 ${PMP_PRIMARY_CTA}`;
const secondaryAction =
  "inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full border border-primary-900/20 bg-white px-5 py-4 font-bold text-primary-900 transition-[border-color,background-color,transform] duration-200 touch-manipulation hover:border-accent-500 hover:bg-member-mist active:scale-[0.98] active:border-accent-500 motion-reduce:transition-none sm:w-auto sm:px-7";

function BackToPlans() {
  return (
    <Link to={MEMBERSHIP_PLANS_PATH} className={primaryAction}>
      <ArrowLeft aria-hidden="true" className="h-5 w-5" />
      Back to Membership Plans
    </Link>
  );
}

export default function MembershipEnroll() {
  const [params] = useSearchParams();
  // Only "silver" and "gold" are accepted; anything else gets the recovery state.
  const planId = parseMembershipPlanId(params.get("plan"));
  const plan = planId ? getMembershipPlan(planId) : null;
  useEnrollMetadata(plan);

  const cardRef = useRef<HTMLDivElement>(null);
  const anchors = useRef<ConstellationAnchorRef[]>([]);
  anchors.current = plan ? [{ ref: cardRef, kind: plan.id, weight: 1 }] : [];

  return (
    <main className="relative isolate min-h-[70vh] overflow-x-clip bg-member-mist text-primary-900">
      {/* Keyed so a different plan in the URL remounts with the right card outline. */}
      <Fragment key={plan?.id ?? "none"}>
        <CareConstellation anchors={anchors.current} intensity={0.35} />
      </Fragment>

      {/* Keeps the transparent site header legible above the light page, as on /membership-plans. */}
      <div aria-hidden="true" className="relative h-20 bg-primary-900 lg:h-[88px] xl:h-24 2xl:h-[104px]" />

      <section
        aria-labelledby="enroll-title"
        className="relative mx-auto flex max-w-2xl flex-col items-stretch px-5 pb-24 pt-12 sm:px-6 sm:pb-32 sm:pt-20"
      >
        {plan ? (
          <div
            ref={cardRef}
            className={`relative rounded-3xl border p-6 sm:p-10 ${MEMBERSHIP_TIER_STYLES[plan.id].surface} ${MEMBERSHIP_TIER_STYLES[plan.id].shadow} ${MEMBERSHIP_TIER_STYLES[plan.id].cardBorder}`}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute inset-x-8 top-0 h-0.5 rounded-full bg-gradient-to-r ${MEMBERSHIP_TIER_STYLES[plan.id].hairline}`}
            />
            <MembershipBadge tier={plan.id} label={plan.tagline} />
            <h1 id="enroll-title" className="mt-5 font-serif text-4xl font-medium text-primary-900 sm:text-5xl">
              {plan.name} Membership
            </h1>
            <p className="mt-2 text-base text-primary-900/70 sm:text-lg">{plan.positioning}</p>
            <MembershipPrice amount={plan.monthlyPrice} className="mt-6" />

            {/* Future enrollment attaches here: eligibility acknowledgment and
                membership agreement acceptance, then a checkout session created
                server-side for `plan.id`. Nothing is collected or charged today. */}
            <div className="mt-8 flex gap-4 rounded-2xl border border-primary-900/10 bg-member-mist p-5">
              <Info aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-accent-700" />
              <div className="space-y-2 text-base leading-relaxed text-primary-900/85">
                <p className="font-semibold text-primary-900">Online enrollment is being prepared.</p>
                <p>Membership purchases are not yet being processed through this website.</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <BackToPlans />
              <a href={PMP_PHONE_HREF} className={secondaryAction} aria-label={`Contact Primary Medical Physicians, call ${PMP_PHONE_LABEL}`}>
                <Phone aria-hidden="true" className="h-5 w-5 text-accent-700" />
                Contact Primary Medical Physicians
              </a>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-primary-900/10 bg-white p-6 text-center shadow-[0_18px_44px_-30px_rgba(10,25,47,0.28)] sm:p-10">
            <h1 id="enroll-title" className="font-serif text-3xl font-medium text-primary-900 sm:text-4xl">
              Choose a membership plan
            </h1>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-primary-900/75">
              We couldn't find that membership plan. Compare Silver and Gold to choose the plan that fits you.
            </p>
            <div className="mt-8 flex justify-center">
              <BackToPlans />
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

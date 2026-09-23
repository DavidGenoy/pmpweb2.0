import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import MembershipBadge from "./MembershipBadge";
import MembershipPrice from "./MembershipPrice";
import { MEMBERSHIP_TIER_STYLES } from "./membershipTheme";
import {
  MEMBERSHIP_FOOTNOTES,
  footnoteAnchorId,
  getEnrollPath,
  type MembershipBenefit,
  type MembershipPlan,
} from "./membershipData";

interface MembershipPlanCardProps {
  plan: MembershipPlan;
  headingLevel?: 2 | 3 | 4;
  ctaLabel?: string;
  // undefined renders the default enroll link; null renders no CTA.
  cta?: ReactNode;
  className?: string;
}

type BenefitRun = { group?: MembershipBenefit["group"]; items: MembershipBenefit[] };

// Consecutive benefits sharing a group become one run, so grouped items render
// together without changing the order defined in membershipData.
function toRuns(benefits: MembershipBenefit[]): BenefitRun[] {
  const runs: BenefitRun[] = [];
  for (const benefit of benefits) {
    const last = runs[runs.length - 1];
    if (last && last.group === benefit.group) last.items.push(benefit);
    else runs.push({ group: benefit.group, items: [benefit] });
  }
  return runs;
}

function BenefitText({ benefit }: { benefit: MembershipBenefit }) {
  if (!benefit.footnote) return <>{benefit.text}</>;
  const note = MEMBERSHIP_FOOTNOTES[benefit.footnote];
  return (
    <>
      {benefit.text}
      <a
        href={`#${footnoteAnchorId(note.id)}`}
        className="ml-0.5 rounded-sm text-white/70 underline-offset-2 hover:text-white hover:underline"
      >
        <span aria-hidden="true">{note.marker}</span>
        <span className="sr-only"> (see routine labs details)</span>
      </a>
    </>
  );
}

export default function MembershipPlanCard({
  plan,
  headingLevel = 3,
  ctaLabel,
  cta,
  className = "",
}: MembershipPlanCardProps) {
  const styles = MEMBERSHIP_TIER_STYLES[plan.id];
  const Heading = `h${headingLevel}` as const;
  const titleId = `membership-plan-${plan.id}-title`;

  return (
    <article
      aria-labelledby={titleId}
      className={`relative flex h-full min-w-0 flex-col overflow-hidden rounded-3xl border p-6 sm:p-8 transition-colors duration-300 ${styles.surface} ${styles.cardBorder} ${className}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r ${styles.hairline}`}
      />

      <header className="space-y-5">
        <MembershipBadge tier={plan.id} />
        <div>
          <Heading id={titleId} className="font-serif text-3xl font-medium text-white sm:text-4xl">
            {plan.name}
          </Heading>
          <p className="mt-2 text-base text-white/60">{plan.positioning}</p>
        </div>
        <MembershipPrice amount={plan.monthlyPrice} />
      </header>

      <div className="mt-8 space-y-6">
        {toRuns(plan.benefits).map((run, i) => {
          if (run.group === "family") {
            const [title, ...rest] = run.items;
            const groupId = `membership-plan-${plan.id}-family`;
            return (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
                <p id={groupId} className="mb-3 flex items-start gap-3 font-semibold text-white">
                  <Check aria-hidden="true" className={`mt-0.5 h-5 w-5 shrink-0 ${styles.check}`} />
                  <span className="min-w-0">
                    <BenefitText benefit={title} />
                  </span>
                </p>
                {rest.length > 0 && (
                  <ul aria-labelledby={groupId} className="space-y-2.5 pl-8 text-sm leading-relaxed text-white/65">
                    {rest.map((benefit) => (
                      <li key={benefit.text} className="relative before:absolute before:-left-4 before:top-[0.6em] before:h-1 before:w-1 before:rounded-full before:bg-white/30">
                        <BenefitText benefit={benefit} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          }

          return (
            <ul key={i} className="space-y-3">
              {run.items.map((benefit) => (
                <li key={benefit.text} className="flex items-start gap-3 leading-relaxed text-white/75">
                  <Check aria-hidden="true" className={`mt-0.5 h-5 w-5 shrink-0 ${styles.check}`} />
                  <span className="min-w-0">
                    <BenefitText benefit={benefit} />
                  </span>
                </li>
              ))}
            </ul>
          );
        })}
      </div>

      {cta !== null && (
        <div className="mt-auto pt-8">
          {cta ?? (
            <Link
              to={getEnrollPath(plan.id)}
              className={`flex w-full items-center justify-center rounded-full px-6 py-3.5 text-base font-semibold transition-colors duration-200 touch-manipulation ${styles.cta}`}
            >
              {ctaLabel ?? `Choose ${plan.name}`}
            </Link>
          )}
        </div>
      )}
    </article>
  );
}

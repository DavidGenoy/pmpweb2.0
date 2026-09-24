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
  // Defaults to the plan's full benefit list.
  benefits?: MembershipBenefit[];
  id?: string;
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
        className="-my-2 inline-block rounded-sm py-2 pl-px pr-1.5 text-primary-900/70 underline-offset-2 hover:text-primary-900 hover:underline"
      >
        <span aria-hidden="true">{note.marker}</span>
        <span className="sr-only"> (see routine labs details)</span>
      </a>
    </>
  );
}

export default function MembershipPlanCard({
  plan,
  benefits = plan.benefits,
  id,
  headingLevel = 3,
  ctaLabel,
  cta,
  className = "",
}: MembershipPlanCardProps) {
  const styles = MEMBERSHIP_TIER_STYLES[plan.id];
  const Heading = `h${headingLevel}` as const;
  const titleId = `membership-plan-${plan.id}-title`;

  // Zones (badge, name, subtitle, price, divider, benefits, CTA) keep matching
  // offsets across paired cards: the subtitle reserves two lines at tablet
  // widths (where Gold's wraps) and the CTA sits at the bottom of a stretched card.
  return (
    <article
      id={id}
      aria-labelledby={titleId}
      className={`relative flex h-full min-w-0 flex-col rounded-3xl border p-6 sm:p-8 transition-colors duration-300 ${styles.surface} ${styles.shadow} ${styles.cardBorder} ${className}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-8 top-0 h-0.5 rounded-full bg-gradient-to-r ${styles.hairline}`}
      />

      <header>
        <MembershipBadge tier={plan.id} />
        <Heading id={titleId} className="mt-5 font-serif text-3xl font-medium text-primary-900 sm:text-4xl">
          {plan.name}
        </Heading>
        <p className="mt-2 text-base leading-relaxed text-primary-900/70 md:min-h-[3.25rem] lg:min-h-0">{plan.positioning}</p>
        <MembershipPrice amount={plan.monthlyPrice} className="mt-5" />
      </header>

      <div className="mt-7 space-y-6 border-t border-primary-900/10 pt-7">
        {toRuns(benefits).map((run, i) => {
          if (run.group === "family") {
            const [title, ...rest] = run.items;
            const groupId = `membership-plan-${plan.id}-family`;
            return (
              <div key={i} className="rounded-2xl border border-accent-500/20 bg-member-aqua/60 p-4 sm:p-5">
                <p id={groupId} className="mb-3 flex items-start gap-3 font-semibold text-primary-900">
                  <Check aria-hidden="true" className={`mt-0.5 h-5 w-5 shrink-0 ${styles.check}`} />
                  <span className="min-w-0">
                    <BenefitText benefit={title} />
                  </span>
                </p>
                {rest.length > 0 && (
                  <ul aria-labelledby={groupId} className="space-y-2.5 pl-8 text-sm leading-relaxed text-primary-900/75">
                    {rest.map((benefit) => (
                      <li key={benefit.text} className="relative before:absolute before:-left-4 before:top-[0.6em] before:h-1 before:w-1 before:rounded-full before:bg-primary-900/30">
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
                <li key={benefit.text} className="flex items-start gap-3 leading-relaxed text-primary-900/80">
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
              className={`flex min-h-[52px] w-full items-center justify-center rounded-full px-6 py-3.5 text-base font-bold transition-[background-color,border-color,box-shadow,transform] duration-200 touch-manipulation active:scale-[0.98] motion-reduce:transition-none ${styles.cta}`}
            >
              {ctaLabel ?? `Choose ${plan.name}`}
            </Link>
          )}
        </div>
      )}
    </article>
  );
}

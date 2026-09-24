import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import MembershipBadge from "./MembershipBadge";
import MembershipPrice from "./MembershipPrice";
import { MEMBERSHIP_TIER_STYLES } from "./membershipTheme";
import { MEMBERSHIP_FOOTNOTES, type MembershipPlan } from "./membershipData";

interface MembershipTeaserCardProps {
  plan: MembershipPlan;
  href: string;
  className?: string;
}

type PressEvent = { currentTarget: HTMLElement };

// Same immediate touch feedback pattern used elsewhere on the site (Footer,
// Services): toggle a class on touch so iOS shows the pressed state at once.
const pressStart = (e: PressEvent) => e.currentTarget.classList.add("is-pressed");
const pressEnd = (e: PressEvent) => e.currentTarget.classList.remove("is-pressed");

export default function MembershipTeaserCard({ plan, href, className = "" }: MembershipTeaserCardProps) {
  const styles = MEMBERSHIP_TIER_STYLES[plan.id];
  const titleId = `membership-teaser-${plan.id}-title`;

  return (
    <article
      aria-labelledby={titleId}
      onTouchStart={pressStart}
      onTouchMove={pressEnd}
      onTouchEnd={pressEnd}
      onTouchCancel={pressEnd}
      className={`group relative flex h-full min-w-0 flex-col rounded-3xl border p-6 sm:p-8 transition-[transform,border-color] duration-200 ease-out active:scale-[0.985] [&.is-pressed]:scale-[0.985] [&.is-pressed]:duration-100 motion-reduce:transition-none has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-accent-400 has-[a:focus-visible]:ring-offset-2 has-[a:focus-visible]:ring-offset-primary-900 ${styles.surface} ${styles.cardBorder} ${styles.pressed} ${className}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r ${styles.hairline}`}
      />

      <MembershipBadge tier={plan.id} label={plan.tagline} className="self-start" />

      <h3 id={titleId} className="mt-5 font-serif text-3xl font-medium text-white sm:text-4xl">
        <Link
          to={href}
          className="outline-none [-webkit-tap-highlight-color:transparent] after:absolute after:inset-0 after:rounded-3xl focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          {plan.name}
          <span className="sr-only"> membership: view plan details</span>
        </Link>
      </h3>
      <p className="mt-1.5 text-[15px] leading-snug text-white/60 sm:text-base">{plan.positioning}</p>

      <MembershipPrice amount={plan.monthlyPrice} size="md" className="mt-6" />

      <ul className="mt-6 space-y-3 border-t border-white/10 pt-6">
        {plan.highlights.map((item) => (
          <li key={item.text} className="flex items-start gap-3 text-[15px] leading-snug text-white/80 sm:text-base">
            <Check aria-hidden="true" className={`mt-0.5 h-[18px] w-[18px] shrink-0 ${styles.check}`} />
            <span className="min-w-0">
              {item.text}
              {item.footnote && (
                <>
                  <span aria-hidden="true" className="text-white/60">
                    {MEMBERSHIP_FOOTNOTES[item.footnote].marker}
                  </span>
                  <span className="sr-only"> (see note below)</span>
                </>
              )}
            </span>
          </li>
        ))}
      </ul>

      <span
        aria-hidden="true"
        className="mt-auto inline-flex items-center gap-2 pt-7 text-sm font-semibold text-white/65 transition-colors group-hover:text-white group-[.is-pressed]:text-white"
      >
        View plan details
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      </span>
    </article>
  );
}

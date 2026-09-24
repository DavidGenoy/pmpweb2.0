import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import CareConstellation, { type ConstellationFormation } from "./membership/CareConstellation";
import MembershipTeaserCard from "./membership/MembershipTeaserCard";
import MembershipReassurance from "./membership/MembershipReassurance";
import { useScrollStage } from "./membership/useScrollStage";
import { MEMBERSHIP_TEXT_SCRIM as TEXT_SCRIM } from "./membership/membershipTheme";
import {
  GOLD_PLAN,
  MEMBERSHIP_ELIGIBILITY_NOTE,
  MEMBERSHIP_FOOTNOTES,
  MEMBERSHIP_PLANS_PATH,
  MEMBERSHIP_REASSURANCE,
  SILVER_PLAN,
} from "./membership/membershipData";

export default function MembershipSection() {
  const sectionRef = useRef<HTMLElement>(null);
  // Gold sits lower than Silver on wider screens so it takes over second;
  // Silver -> Gold passes through the "flow" formation automatically.
  const stage = useScrollStage<ConstellationFormation>(sectionRef, "dispersed");
  const labsNote = MEMBERSHIP_FOOTNOTES["routine-labs"];

  return (
    <section
      id="membership"
      ref={sectionRef}
      aria-labelledby="membership-heading"
      className="relative isolate overflow-x-clip bg-primary-900 py-24 md:py-32"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-500/40 to-transparent"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
      <CareConstellation formation={stage} intensity={0.85} />

      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <header data-stage="dispersed" className={`reveal-up mx-auto max-w-2xl text-center ${TEXT_SCRIM}`}>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent-400">PMP Membership</p>
          <h2
            id="membership-heading"
            className="mt-4 text-balance font-serif text-[2.35rem] font-medium leading-[1.08] text-white sm:text-5xl lg:text-6xl"
          >
            Primary care, made simpler.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg">
            Flexible monthly membership options with clear pricing, convenient access, and care across Primary
            Medical Physicians.
          </p>
        </header>

        <div className="mx-auto mt-12 grid max-w-[26rem] gap-5 md:mt-16 md:max-w-none md:grid-cols-2 md:items-start md:gap-6 lg:gap-10">
          <div data-stage="silver" className="reveal-up">
            <MembershipTeaserCard plan={SILVER_PLAN} href={`${MEMBERSHIP_PLANS_PATH}#silver`} />
          </div>
          <div data-stage="gold" className="reveal-up md:mt-16">
            <MembershipTeaserCard
              plan={GOLD_PLAN}
              href={`${MEMBERSHIP_PLANS_PATH}#gold`}
              className="shadow-[0_30px_70px_-30px_rgba(201,171,110,0.35)]"
            />
          </div>
        </div>

        <div
          data-stage="unified"
          className={`reveal-up mx-auto mt-12 flex max-w-2xl flex-col items-center text-center md:mt-16 ${TEXT_SCRIM}`}
        >
          <Link
            to={MEMBERSHIP_PLANS_PATH}
            className="inline-flex min-h-[52px] w-full max-w-[26rem] items-center justify-center gap-2 whitespace-nowrap rounded-full bg-accent-500 px-5 py-4 text-[15px] font-semibold min-[360px]:text-base sm:px-8 text-primary-900 transition-[background-color,transform] duration-200 touch-manipulation hover:bg-accent-400 active:scale-[0.98] motion-reduce:transition-none sm:w-auto"
          >
            Compare Membership Plans
            <ArrowRight aria-hidden="true" className="h-5 w-5" />
          </Link>

          <MembershipReassurance items={MEMBERSHIP_REASSURANCE} className="mt-6" />

          <p className="mt-4 max-w-md text-xs leading-relaxed text-white/45">
            {MEMBERSHIP_ELIGIBILITY_NOTE}
            <br />
            {labsNote.marker}
            {labsNote.summary}
          </p>
        </div>
      </div>
    </section>
  );
}

import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import CareConstellation, { type ConstellationAnchorRef } from "./membership/CareConstellation";
import MembershipTeaserCard from "./membership/MembershipTeaserCard";
import MembershipReassurance from "./membership/MembershipReassurance";
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
  const silverRef = useRef<HTMLDivElement>(null);
  const goldRef = useRef<HTMLDivElement>(null);
  const anchors = useRef<ConstellationAnchorRef[]>([
    { ref: silverRef, kind: "silver", weight: 1 },
    { ref: goldRef, kind: "gold", weight: 1 },
  ]).current;
  const labsNote = MEMBERSHIP_FOOTNOTES["routine-labs"];

  return (
    <section
      id="membership"
      aria-labelledby="membership-heading"
      className="relative isolate overflow-x-clip bg-member-mist bg-[radial-gradient(90%_60%_at_50%_0%,var(--color-member-aqua),transparent_70%)] py-24 text-primary-900 [--membership-scrim:var(--color-member-mist)] md:py-32"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-500/40 to-transparent"
      />
      {/* The free-flow field is kept a little quieter than on the plans page. */}
      <CareConstellation anchors={anchors} intensity={0.4} />

      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <header className={`reveal-up mx-auto max-w-2xl text-center ${TEXT_SCRIM}`}>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent-700">PMP Membership</p>
          <h2
            id="membership-heading"
            className="mt-4 text-balance font-serif text-[2.35rem] font-medium leading-[1.08] text-primary-900 sm:text-5xl lg:text-6xl"
          >
            Primary care, made simpler.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-primary-900/70 sm:text-lg">
            Flexible monthly membership options with clear pricing, convenient access, and care across Primary
            Medical Physicians.
          </p>
        </header>

        {/* Matched pair from md up (same top line, stretched to equal height);
            on phones a 48px gap gives each plan's particles room to settle. */}
        <div className="mx-auto mt-12 grid max-w-[26rem] gap-12 md:mt-16 md:max-w-none md:grid-cols-2 md:gap-8 lg:gap-12">
          <div ref={silverRef} className="reveal-up h-full">
            <MembershipTeaserCard plan={SILVER_PLAN} href={`${MEMBERSHIP_PLANS_PATH}#silver`} />
          </div>
          <div ref={goldRef} className="reveal-up h-full">
            <MembershipTeaserCard plan={GOLD_PLAN} href={`${MEMBERSHIP_PLANS_PATH}#gold`} />
          </div>
        </div>

        <div
          className={`reveal-up mx-auto mt-14 flex max-w-2xl flex-col items-center text-center md:mt-16 ${TEXT_SCRIM}`}
        >
          <Link
            to={MEMBERSHIP_PLANS_PATH}
            className="inline-flex min-h-[52px] w-full max-w-[26rem] items-center justify-center gap-2 whitespace-nowrap rounded-full bg-accent-500 px-5 py-4 text-[15px] font-bold text-primary-900 shadow-sm transition-[background-color,box-shadow,transform] duration-200 touch-manipulation hover:bg-accent-400 hover:shadow-md active:scale-[0.98] motion-reduce:transition-none min-[360px]:text-base sm:w-auto sm:px-8"
          >
            Compare Membership Plans
            <ArrowRight aria-hidden="true" className="h-5 w-5" />
          </Link>

          <MembershipReassurance items={MEMBERSHIP_REASSURANCE} className="mt-6" />

          <p className="mt-4 max-w-md text-[13px] leading-relaxed text-primary-900/65">
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

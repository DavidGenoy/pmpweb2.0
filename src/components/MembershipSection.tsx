import { useEffect, useRef, useState, type RefObject } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import CareConstellation, { type ConstellationFormation } from "./membership/CareConstellation";
import MembershipTeaserCard from "./membership/MembershipTeaserCard";
import {
  GOLD_PLAN,
  MEMBERSHIP_ELIGIBILITY_NOTE,
  MEMBERSHIP_FOOTNOTES,
  MEMBERSHIP_PLANS_PATH,
  MEMBERSHIP_REASSURANCE,
  SILVER_PLAN,
} from "./membership/membershipData";

// The constellation follows whichever `data-stage` block crosses the middle of
// the viewport. Later blocks win while two overlap (Gold sits lower than Silver
// on wider screens), and the last stage is kept while between blocks. Silver ->
// Gold passes through the "flow" formation on its own as the morph interpolates.
function useActiveStage(rootRef: RefObject<HTMLElement | null>) {
  const [stage, setStage] = useState<ConstellationFormation>("dispersed");

  useEffect(() => {
    const root: HTMLElement | null = rootRef.current;
    if (!root) return;
    const blocks = Array.from(root.querySelectorAll<HTMLElement>("[data-stage]"));
    const inBand = new Set<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inBand.add(entry.target);
          else inBand.delete(entry.target);
        }
        const current = blocks.filter((b) => inBand.has(b)).pop();
        if (current) setStage(current.dataset.stage as ConstellationFormation);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    blocks.forEach((b) => observer.observe(b));
    return () => observer.disconnect();
  }, [rootRef]);

  return stage;
}

// Soft navy scrim behind free-standing text so particles fade out there
// instead of passing behind the words.
const TEXT_SCRIM =
  "relative before:pointer-events-none before:absolute before:inset-x-0 before:-inset-y-8 sm:before:-inset-x-10 before:-z-10 before:bg-[radial-gradient(closest-side,var(--color-primary-900)_55%,transparent)]";

export default function MembershipSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stage = useActiveStage(sectionRef);
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

          <ul className="mt-6 flex flex-wrap justify-center gap-x-2.5 gap-y-1 text-sm text-white/65">
            {MEMBERSHIP_REASSURANCE.map((item, i) => (
              <li key={item} className="flex items-center gap-2.5">
                {i > 0 && <span aria-hidden="true" className="text-white/30">·</span>}
                {item}
              </li>
            ))}
          </ul>

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

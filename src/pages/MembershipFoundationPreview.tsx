import { Fragment } from "react";
import CareConstellation from "../components/membership/CareConstellation";
import MembershipPlanCard from "../components/membership/MembershipPlanCard";
import MembershipDisclosure from "../components/membership/MembershipDisclosure";
import { MEMBERSHIP_PLANS } from "../components/membership/membershipData";
import { FORMATION_ORDER } from "../components/membership/constellationFormations";

// Development-only harness for the Phase 1 membership foundation. Registered in
// App.tsx behind import.meta.env.DEV, so it never ships to production.
export default function MembershipFoundationPreview() {
  return (
    <main className="bg-primary-900">
      <section className="relative isolate pt-32 pb-12 md:pt-40">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-accent-400">Dev preview · Phase 1</p>
          <h1 className="mt-3 font-serif text-4xl font-medium text-white md:text-6xl">Membership foundation</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/60">
            Scroll through the pinned stage to see the Care Constellation morph between its five formations.
          </p>
        </div>
      </section>

      <section
        aria-label="Care Constellation scroll morph"
        className="relative isolate h-[500vh] supports-[height:100svh]:h-[500svh]"
      >
        <CareConstellation range="contain" />
        <ol className="relative z-10">
          {FORMATION_ORDER.map((name, i) => (
            <li
              key={name}
              className="flex h-[100vh] items-end px-4 pb-16 supports-[height:100svh]:h-[100svh] sm:px-6 lg:px-8"
            >
              <span className="mx-auto w-full max-w-7xl text-sm uppercase tracking-[0.2em] text-white/50">
                {i + 1} / {FORMATION_ORDER.length} · {name}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="preview-plans-title" className="relative isolate py-24 md:py-32">
        <CareConstellation formation="gold" intensity={0.7} />
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 id="preview-plans-title" className="mb-10 font-serif text-3xl font-medium text-white md:text-5xl">
            Plan cards
          </h2>
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            {MEMBERSHIP_PLANS.map((plan) => (
              <Fragment key={plan.id}>
                <MembershipPlanCard plan={plan} />
              </Fragment>
            ))}
          </div>
          <MembershipDisclosure className="mt-10 max-w-3xl" />
        </div>
      </section>
    </main>
  );
}

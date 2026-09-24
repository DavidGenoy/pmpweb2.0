import { useRef } from "react";
import CareConstellation, { type ConstellationAnchorRef } from "../components/membership/CareConstellation";
import MembershipPlanCard from "../components/membership/MembershipPlanCard";
import MembershipDisclosure from "../components/membership/MembershipDisclosure";
import { GOLD_PLAN, SILVER_PLAN } from "../components/membership/membershipData";

// Development-only harness for the membership components. Registered in
// App.tsx behind import.meta.env.DEV, so it never ships to production.
export default function MembershipFoundationPreview() {
  const silverRef = useRef<HTMLDivElement>(null);
  const goldRef = useRef<HTMLDivElement>(null);
  const anchors = useRef<ConstellationAnchorRef[]>([
    { ref: silverRef, kind: "silver", weight: 1 },
    { ref: goldRef, kind: "gold", weight: 1 },
  ]).current;

  return (
    <main className="relative isolate bg-member-mist pb-24 pt-32 text-primary-900 md:pt-40">
      <CareConstellation anchors={anchors} intensity={0.45} />
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-widest text-accent-700">Dev preview</p>
        <h1 className="mt-3 font-serif text-4xl font-medium md:text-6xl">Membership components</h1>
        <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-8">
          <div ref={silverRef} className="h-full">
            <MembershipPlanCard plan={SILVER_PLAN} />
          </div>
          <div ref={goldRef} className="h-full">
            <MembershipPlanCard plan={GOLD_PLAN} />
          </div>
        </div>
        <MembershipDisclosure className="mt-10 max-w-3xl" />
      </div>
    </main>
  );
}

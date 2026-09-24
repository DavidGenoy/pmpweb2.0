import {
  MEMBERSHIP_ELIGIBILITY,
  MEMBERSHIP_FOOTNOTES,
  footnoteAnchorId,
  type MembershipFootnoteId,
} from "./membershipData";

interface MembershipDisclosureProps {
  footnotes?: MembershipFootnoteId[];
  showEligibility?: boolean;
  className?: string;
}

// Render once per page section: footnote anchors are ids that plan cards link to.
export default function MembershipDisclosure({
  footnotes = ["routine-labs"],
  showEligibility = true,
  className = "",
}: MembershipDisclosureProps) {
  return (
    <aside
      aria-label="Membership eligibility and plan details"
      className={`space-y-4 text-sm leading-relaxed text-primary-900/75 ${className}`}
    >
      {showEligibility && (
        <div className="space-y-1">
          <p className="font-semibold text-primary-900">Eligibility</p>
          <p>{MEMBERSHIP_ELIGIBILITY.summary}.</p>
          <p>{MEMBERSHIP_ELIGIBILITY.exclusion}</p>
        </div>
      )}

      {footnotes.map((id) => {
        const note = MEMBERSHIP_FOOTNOTES[id];
        return (
          <p key={id} id={footnoteAnchorId(id)} className="scroll-mt-28">
            <span aria-hidden="true" className="mr-1 text-primary-900">
              {note.marker}
            </span>
            {note.text}
          </p>
        );
      })}
    </aside>
  );
}

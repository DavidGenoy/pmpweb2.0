import { useState, type ReactNode } from "react";
import { Plus } from "lucide-react";

export interface MembershipFaqItem {
  id: string;
  question: string;
  answer: ReactNode;
}

interface MembershipFaqProps {
  items: readonly MembershipFaqItem[];
  headingLevel?: 3 | 4;
}

// Panels open instantly via the `hidden` attribute (no height animation, which
// is what made earlier accordions stutter in Safari); only the revealed content
// fades in. Several panels may be open at once. The [&:hover] overrides cancel
// the site-wide button:hover scale, which is not gated to hover-capable devices
// and would otherwise stick on the last-tapped row on touch screens.
export default function MembershipFaq({ items, headingLevel = 3 }: MembershipFaqProps) {
  const [open, setOpen] = useState<ReadonlySet<string>>(() => new Set());
  const Heading = `h${headingLevel}` as const;

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="divide-y divide-primary-900/10 overflow-hidden rounded-3xl border border-primary-900/10 bg-white shadow-[0_18px_44px_-30px_rgba(10,25,47,0.3)]">
      {items.map((item) => {
        const isOpen = open.has(item.id);
        const buttonId = `membership-faq-${item.id}-button`;
        const panelId = `membership-faq-${item.id}-panel`;
        return (
          <div key={item.id}>
            <Heading className="m-0">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="flex min-h-14 w-full touch-manipulation items-center justify-between gap-4 px-5 py-4 text-left text-base font-medium text-primary-900 hover:bg-member-mist [&:hover]:scale-100 [&:hover]:shadow-none focus-visible:ring-inset focus-visible:ring-offset-0 active:bg-member-aqua sm:px-7 sm:py-5 sm:text-lg"
              >
                <span className="min-w-0">{item.question}</span>
                <span
                  aria-hidden="true"
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-transform duration-200 motion-reduce:transition-none ${
                    isOpen ? "rotate-45 border-accent-500 bg-accent-500 text-primary-900" : "border-primary-900/15 text-accent-700"
                  }`}
                >
                  <Plus className="h-4 w-4" />
                </span>
              </button>
            </Heading>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="animate-membership-reveal px-5 pb-6 text-[15px] leading-relaxed text-primary-900/75 motion-reduce:animate-none sm:px-7 sm:text-base"
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}

import { Check } from "lucide-react";

// Each item carries its own check so the row reads correctly however it wraps
// (inline "·" separators ended up dangling at the start of wrapped lines).
export default function MembershipReassurance({ items, className = "" }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={`flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-primary-900/75 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex items-center gap-1.5 whitespace-nowrap">
          <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-accent-700" />
          {item}
        </li>
      ))}
    </ul>
  );
}

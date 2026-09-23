interface MembershipPriceProps {
  amount: number;
  size?: "md" | "lg";
  className?: string;
}

const SIZE = {
  md: { dollars: "text-4xl", cents: "text-lg", period: "text-sm" },
  lg: { dollars: "text-5xl sm:text-6xl", cents: "text-xl sm:text-2xl", period: "text-sm sm:text-base" },
} as const;

export default function MembershipPrice({ amount, size = "lg", className = "" }: MembershipPriceProps) {
  const [dollars, cents = "00"] = amount.toFixed(2).split(".");
  const s = SIZE[size];

  return (
    <p className={`flex items-baseline text-white ${className}`}>
      <span className="sr-only">{`$${dollars}.${cents} per month`}</span>
      <span aria-hidden="true" className="flex items-baseline">
        <span className={`${s.cents} font-medium text-white/70 self-start mt-1 mr-0.5`}>$</span>
        <span className={`${s.dollars} font-serif font-medium leading-none tracking-tight tabular-nums`}>
          {dollars}
        </span>
        <span className={`${s.cents} font-medium text-white/80 self-start mt-1 tabular-nums`}>.{cents}</span>
        <span className={`${s.period} ml-2 text-white/50`}>/month</span>
      </span>
    </p>
  );
}

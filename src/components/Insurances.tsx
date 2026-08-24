import { motion } from "motion/react";
import TiltCard from "./TiltCard";

const logos = [
  "https://nethingso.xyz/insurances/insurance-1-aarp.webp",
  "https://nethingso.xyz/insurances/insurance-2-aetna.webp",
  "https://nethingso.xyz/insurances/insurance-3-ambetter.webp",
  "https://nethingso.xyz/insurances/insurance-4-avmed.webp",
  "https://nethingso.xyz/insurances/insurance-5.webp",
  "https://nethingso.xyz/insurances/insurance-6-cigna.webp",
  "https://nethingso.xyz/insurances/insurance-7.webp",
  "https://nethingso.xyz/insurances/insurance-9-medicaid.webp",
  "https://nethingso.xyz/insurances/insurance-10-medicare.webp",
  "https://nethingso.xyz/insurances/insurance-11-memorial.webp",
  "https://nethingso.xyz/insurances/insurance-12-oscar.webp",
  "https://nethingso.xyz/insurances/insurance-13-preferred.webp",
  "https://nethingso.xyz/insurances/insurance-14-solis.webp",
  "https://nethingso.xyz/insurances/insurance-15-united.webp",
  "https://nethingso.xyz/insurances/insurance-16-devoted.webp",
  "https://nethingso.xyz/insurances/insurance-17-preferred-care-network.webp",
];

export default function Insurances() {
  // Helper to chunk logos for the 4/3 alternating layout on desktop
  const getDesktopRows = () => {
    const rows = [];
    let i = 0;
    let isFour = true;
    while (i < logos.length) {
      const count = isFour ? 4 : 3;
      rows.push(logos.slice(i, i + count));
      i += count;
      isFour = !isFour;
    }
    return rows;
  };

  const desktopRows = getDesktopRows();

  const largeLogos = [
    "https://nethingso.xyz/insurances/insurance-13-preferred.webp",
    "https://nethingso.xyz/insurances/insurance-9-medicaid.webp",
    "https://nethingso.xyz/insurances/insurance-10-medicare.webp",
    "https://nethingso.xyz/insurances/insurance-4-avmed.webp",
    "https://nethingso.xyz/insurances/insurance-15-united.webp",
  ];

  const isLarge = (url: string) => largeLogos.includes(url);

  return (
    <section className="relative overflow-hidden">
      {/* Background Transition Overlay */}
      <div className="absolute inset-0 bg-white" />
      
      {/* Subtle Grid Pattern for the white area */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} 
      />
      
      <div className="relative z-20 py-16 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-24 reveal-up">
          <h2 className="text-sm font-bold tracking-[0.2em] text-accent-500 uppercase mb-4">
            INSURANCES WE ACCEPT
          </h2>
          <h3 className="text-4xl md:text-6xl font-serif font-medium text-primary-900 mb-6">
            Quality Healthcare Accessible to Everyone
          </h3>
          <p className="text-lg text-primary-900/60 leading-relaxed">
            We work with a wide range of insurance providers to make quality healthcare accessible.
          </p>
        </div>

        {/* Desktop Layout (4/3 alternating) */}
        <div className="hidden lg:flex flex-col gap-16 items-center reveal-stagger">
          {desktopRows.map((row, rowIndex) => (
            <div 
              key={rowIndex} 
              className="flex justify-center items-center gap-16 xl:gap-24 w-full"
            >
              {row.map((logo, logoIndex) => (
                <TiltCard
                  key={logoIndex}
                  className={`${isLarge(logo) ? 'w-80 h-32' : 'w-48 h-20'} flex items-center justify-center`}
                >
                  <img
                    src={logo}
                    alt="Insurance Provider"
                    loading="lazy"
                    className={`${isLarge(logo) ? 'scale-125' : 'scale-100'} max-w-full max-h-full object-contain object-center transition-transform duration-300`}
                    referrerPolicy="no-referrer"
                  />
                </TiltCard>
              ))}
            </div>
          ))}
        </div>

        {/* Tablet Layout (3 per row) */}
        <div className="hidden sm:grid lg:hidden grid-cols-3 gap-y-16 gap-x-12 items-center justify-items-center reveal-stagger">
          {logos.map((logo, index) => (
            <TiltCard
              key={index}
              className={`${isLarge(logo) ? 'w-64 h-28' : 'w-40 h-16'} flex items-center justify-center`}
            >
              <img
                src={logo}
                alt="Insurance Provider"
                loading="lazy"
                className={`${isLarge(logo) ? 'scale-115' : 'scale-100'} max-w-full max-h-full object-contain object-center`}
                referrerPolicy="no-referrer"
              />
            </TiltCard>
          ))}
        </div>

        {/* Mobile Layout (Denser, 3-4 column flex to center last row) */}
        <div className="flex sm:hidden flex-wrap justify-center gap-y-8 gap-x-4 items-center reveal-stagger px-2">
          {logos.map((logo, index) => (
            <div
              key={index}
              className="w-[calc(33.333%-12px)] min-[400px]:w-[calc(25%-12px)] h-10 flex items-center justify-center"
            >
              <img
                src={logo}
                alt="Insurance Provider"
                loading="lazy"
                className={`${isLarge(logo) ? 'scale-110' : 'scale-100'} max-w-full max-h-full object-contain object-center`}
                referrerPolicy="no-referrer"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

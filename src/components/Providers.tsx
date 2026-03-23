import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Star, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import TiltCard from "./TiltCard";

const allProviders = [
  {
    name: "Moises Issa",
    degree: "M.D., F.A.C.S.G.",
    specialty: "Internal Medicine - Geriatrics",
    image: "https://nethingso.xyz/providers/issa_resized.webp",
    bookingUrl: "https://healow.com/apps/provider/moises-issa-2847656",
  },
  {
    name: "William Pena",
    degree: "M.D.",
    specialty: "Internal Medicine",
    image: "https://nethingso.xyz/providers/wpena_resized.webp",
    bookingUrl: "https://healow.com/apps/provider/william-pena-3241271",
  },
  {
    name: "Ramon Berenguer",
    degree: "M.D.",
    specialty: "Family Practice",
    image: "https://nethingso.xyz/providers/berenguer_resized.webp",
    bookingUrl: "https://healow.com/apps/provider/ramon-berenguer-3192693",
  },
  {
    name: "Oswaldo Sandoval",
    degree: "M.D.",
    specialty: "Family Practice",
    image: "https://nethingso.xyz/providers/sandoval_resized.webp",
    bookingUrl: "https://healow.com/apps/provider/oswaldo-sandoval-3188584",
  },
  {
    name: "Pedro Castellanos",
    degree: "M.D.",
    specialty: "Family Practice",
    image: "https://nethingso.xyz/providers/castellanos_resized.webp",
    bookingUrl: "https://healow.com/apps/provider/pedro-castellanos-3191163",
  },
  {
    name: "Dean Guadagna",
    degree: "D.O.",
    specialty: "Family Practice",
    image: "https://nethingso.xyz/providers/dean_resized.webp",
    bookingUrl: "https://healow.com/apps/provider/dean-guadagna-3801766",
  },
  {
    name: "Sharon Sabaitue",
    degree: "ANP-CNP",
    specialty: "Family Practice",
    image: "https://nethingso.xyz/providers/sharon_resized.webp",
    bookingUrl: "https://healow.com/apps/provider/sharon-macrohonsabaitue-3188585",
  },
  {
    name: "Ruth Catignas",
    degree: "DNP, APRN-BC",
    specialty: "Family Practice",
    image: "https://nethingso.xyz/providers/ruth_resized.webp",
    bookingUrl: "https://healow.com/apps/provider/ruth-catignas-3180952",
  },
  {
    name: "Joseph Mascenik",
    degree: "DMS, PA-C",
    specialty: "Internal Medicine",
    image: "https://nethingso.xyz/providers/mascenik_resized.webp",
    bookingUrl: "https://healow.com/apps/provider/joseph-mascenik-2878871",
  },
  {
    name: "Yordy Brito",
    degree: "FNP",
    specialty: "Family Practice",
    image: "https://nethingso.xyz/providers/brito_resized.webp",
    bookingUrl: "https://healow.com/apps/provider/yordy-britoaguila-3188588",
  },
  {
    name: "Carolina Raudez",
    degree: "APRN, FNP-BC",
    specialty: "Family Practice",
    image: "https://nethingso.xyz/providers/raudez_resized.webp",
    bookingUrl: "https://healow.com/apps/provider/carolina-raudez-3180552",
  },
  {
    name: "Yunior Quesada",
    degree: "FNP-BC",
    specialty: "Family Practice",
    image: "https://nethingso.xyz/providers/quesada_resized.webp",
    bookingUrl: "https://healow.com/apps/provider/yunior-quesadajerez-3195423",
  },
  {
    name: "Sira Pena",
    degree: "APRN, FNP-BC",
    specialty: "Family Practice",
    image: "https://nethingso.xyz/providers/sira_resized.webp",
    bookingUrl: "https://healow.com/apps/provider/sirahaydee-penaalcantara-3178726",
  },
  {
    name: "Nancy LaCroix",
    degree: "APRN, MSN-AGPCNP",
    specialty: "Family Practice",
    image: "https://nethingso.xyz/providers/lacroix_resized.webp",
    bookingUrl: "https://healow.com/apps/provider/nancy-lacroix-3838823",
  },
  {
    name: "Maria Morejon",
    degree: "ARNP, FNP-C",
    specialty: "Family Practice",
    image: "https://nethingso.xyz/providers/morejon_resized.webp",
    bookingUrl: "https://healow.com/apps/practice/primary-medical-physicians-llc-hollywood-fl-23412?v=2&t=1",
  },
  {
    name: "Yoel Ramos",
    degree: "PA",
    specialty: "Family Practice",
    image: "https://nethingso.xyz/providers/ramos_resized.webp",
    bookingUrl: "https://healow.com/apps/practice/primary-medical-physicians-llc-hollywood-fl-23412?v=2&t=1",
  },
];

export default function Providers() {
  const [isExpanded, setIsExpanded] = useState(true);
  const initialCount = 5;
  const visibleProviders = isExpanded ? allProviders : allProviders.slice(0, initialCount);

  return (
    <section id="providers" className="py-24 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 reveal-up">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold tracking-widest text-accent-400 uppercase mb-4">
              Meet Our Team
            </h2>
            <h3 className="text-4xl md:text-5xl font-serif font-medium text-white mb-6">
              Book appointments with any of our 16 Expert Providers
            </h3>
            <p className="text-lg text-white/60 reveal-text-scrub">
              Our diverse team of board-certified physicians, nurse practitioners, 
              and physician assistants bring decades of combined experience to 
              Broward and Dade County.
            </p>
          </div>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-white/10 hover:bg-accent-500 hover:text-primary-900 text-white border border-white/10 px-8 py-4 rounded-full font-medium transition-all flex items-center justify-center gap-2 group whitespace-nowrap shadow-sm backdrop-blur-md"
          >
            {isExpanded ? "Show Less" : "View All Providers"}
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
            ) : (
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            )}
          </button>
        </div>

        {/* Mobile/Tablet: Tighter gap (gap-4/gap-6), Desktop: Original gap (gap-8) */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8 reveal-stagger">
          <AnimatePresence mode="popLayout">
            {visibleProviders.map((provider, index) => (
              <motion.div
                key={provider.name}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ 
                  duration: 0.4, 
                  delay: isExpanded && index >= initialCount ? (index - initialCount) * 0.05 : 0,
                  ease: [0.23, 1, 0.32, 1]
                }}
                className="w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.5rem)]"
              >
                <TiltCard 
                  maxRotation={4} 
                  scale={1.02} 
                  perspective={1200}
                  showGlow={true}
                  className="glass-card rounded-2xl lg:rounded-3xl overflow-hidden h-full flex flex-row lg:flex-col p-3 lg:p-0 gap-4 lg:gap-0 items-center lg:items-stretch"
                >
                  {/* Image Container: Horizontal on mobile/tablet, original vertical on desktop */}
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 lg:w-full lg:h-auto lg:aspect-[4/5] rounded-xl lg:rounded-none overflow-hidden reveal-scale shrink-0">
                    <img
                      src={provider.image}
                      alt={provider.name}
                      className="absolute inset-0 w-full h-full object-cover object-[50%_20%] max-lg:object-[50%_28%] group-hover:scale-105 transition-transform duration-700 opacity-90"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-1.5 left-1.5 lg:bottom-4 lg:left-4 right-1.5 lg:right-4 flex justify-between items-end opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-0 lg:translate-y-4 group-hover:translate-y-0">
                      <div className="flex items-center gap-1 text-[#02c39a] lg:text-accent-400 bg-primary-900/80 backdrop-blur-sm px-1.5 py-0.5 lg:px-3 lg:py-1.5 rounded-full text-[10px] lg:text-sm font-medium">
                        <Star className="w-2.5 h-2.5 lg:w-4 lg:h-4 fill-current" />
                        <span>4.9</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content Container: Compact on mobile/tablet, original on desktop */}
                  <div className="flex flex-col flex-grow py-1 lg:p-6 min-w-0">
                    <h4 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-0.5 lg:mb-1 max-lg:truncate">
                      {provider.name}
                    </h4>
                    <p className="text-[#02c39a] lg:text-accent-400 font-medium text-xs lg:text-sm mb-1 lg:mb-3 max-lg:truncate">
                      {provider.degree}
                    </p>
                    <div className="flex items-center gap-1.5 lg:gap-2 text-white/60 lg:text-white/50 text-xs lg:text-sm mb-3 lg:mb-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#02c39a] lg:bg-accent-500 shrink-0" />
                      <span className="truncate">{provider.specialty}</span>
                    </div>
                    
                    {/* CTA Button: Premium touch interaction on mobile/tablet, original hover on desktop */}
                    <div className="mt-auto pt-2 lg:pt-6">
                      <a 
                        href={provider.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-white/10 hover:bg-accent-500 hover:text-primary-900 text-white py-2 lg:py-3 rounded-lg lg:rounded-xl font-medium transition-all duration-300 active:duration-75 text-sm inline-flex items-center justify-center active:bg-[#02c39a] active:text-primary-900 active:scale-[0.96] active:shadow-[0_0_20px_rgba(2,195,154,0.4)] active:border-[#02c39a] border border-transparent touch-manipulation"
                      >
                        Book Appointment
                      </a>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}


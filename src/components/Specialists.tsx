import { motion, useScroll, AnimatePresence } from "motion/react";
import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, MapPin, User } from "lucide-react";
import ChromaticLink from "./ChromaticLink";

const specialists = [
  {
    title: "Pulmonology",
    name: "Dr. Ronald Gup, MD",
    description: "Every breath, expertly cared for. We have a pulmonologist on site for comprehensive respiratory care.",
    image: "https://nethingso.xyz/specialists/pulmonologist.png",
    locations: [
      { office: "6517 Taft St, Suite 201, Hollywood, FL 33024", schedule: "Mondays, 8:30 AM – 1:00 PM" },
      { office: "3800 Johnson Street E, Hollywood, FL 33021", schedule: "Tuesdays, 1:30 PM – 4:30 PM" }
    ]
  },
  {
    title: "Cardiology",
    name: "Mark Sabbota, DO",
    description: "Cardio Vascular Specialists of South Florida. Providing cardiology services at Primary Medical Physicians.",
    image: "https://nethingso.xyz/specialists/cardiologist.png",
    locations: [
      { address: "6517 Taft St, Suite 211, Hollywood" },
      { address: "10650 W State Rd 84, Suite 104, Davie" }
    ]
  },
  {
    title: "Dental Surgery",
    name: "Nicolas Hernandez, DDS",
    description: "Radiant Smiles, Lasting Impressions. Discover on-site primary dental care with Dr. Nicolas.",
    image: "https://nethingso.xyz/specialists/dentist.png",
    locations: [{ address: "6517 Taft St, Suite 201, Hollywood" }]
  },
  {
    title: "Gastroenterology",
    name: "Dr. Gonzalez & Dr. Dabul",
    description: "Our on-site gastroenterology team provides expert, comprehensive care for all digestive health conditions.",
    image: "https://nethingso.xyz/specialists/gastroenterologist.webp",
    locations: [
      { office: "Lilly M. Gonzalez, MD", schedule: "Thursday mornings", isProvider: true },
      { office: "Elias E. Dabul, MD, FACG", schedule: "Monday afternoons", isProvider: true },
      { address: "6517 Taft St, Suite 102, Hollywood" }
    ]
  },
  {
    title: "Psychiatric Care",
    name: "Violet Health Corp",
    description: "Feel seen. Feel supported. Feel better. On-site psychiatric care for your mental well-being.",
    image: "https://nethingso.xyz/specialists/psychotherapist.webp",
    locations: [
      { office: "6517 Taft St, Suite 201, Hollywood, FL 33024", schedule: "Fri, 9:00 AM – 5:00 PM" },
      { office: "3800 Johnson Street E, Hollywood, FL 33021", schedule: "Wed, 9:00 AM – 5:00 PM" },
      { office: "7630 Southwest 34 Manor, Suite 400, Davie, FL 33328", schedule: "Thu, 9:00 AM – 5:00 PM" }
    ]
  },
  {
    title: "Podiatry",
    name: "Dr. Lesley A Warren, DPM",
    description: "Caring for every step. Meet Dr. Lesley on site for expert foot and ankle care for all ages.",
    image: "https://nethingso.xyz/specialists/podiatrist.png",
    locations: [
      { office: "6517 Taft St, Suite 201, Hollywood, FL 33024", schedule: "Wednesday" }
    ]
  },
  {
    title: "DRE",
    name: "Diabetic Retinal Exam",
    description: "In-clinic retinal imaging. Early detection can prevent most diabetes-related vision loss.",
    image: "https://nethingso.xyz/specialists/DRE.png",
    locations: [
      { office: "7630 Southwest 34 Manor, Suite 400, Davie, FL 33328", schedule: "Mon, 8:30 AM – 4:30 PM" },
      { office: "6517 Taft St, Suite 201, Hollywood, FL 33024", schedule: "Mon & Wed, 8:30 AM – 4:30 PM" },
      { office: "3800 Johnson Street E, Hollywood, FL 33021", schedule: "Tue & Thu, 8:30 AM – 4:30 PM" }
    ]
  },
  {
    title: "Clinical Research",
    name: "Zenith Clinical Research (ZCR)",
    description: "Daniel Goldfarb, Ph.D — President. Discover our Clinical Research On-Site and enroll in our studies today.",
    image: "https://nethingso.xyz/specialists/reserch.avif",
    locations: [{ note: "Clinical Research On-Site" }]
  }
];

export default function Specialists() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { scrollXProgress } = useScroll({
    container: containerRef,
  });

  const scroll = useCallback((direction: 'left' | 'right') => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      const scrollAmount = direction === 'left' ? -400 : 400;
      
      // Wrap around logic
      if (direction === 'right' && scrollLeft + clientWidth >= scrollWidth - 20) {
        containerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else if (direction === 'left' && scrollLeft <= 20) {
        containerRef.current.scrollTo({ left: scrollWidth, behavior: 'smooth' });
      } else {
        containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  }, []);

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      if (containerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
        // If we're at the end, loop back to start
        if (scrollLeft + clientWidth >= scrollWidth - 20) {
          containerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          containerRef.current.scrollBy({ left: 350, behavior: 'smooth' });
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <section 
      className="py-32 bg-transparent relative overflow-visible group/section"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 reveal-up">
        <div className="max-w-2xl">
          <h2 className="text-sm font-bold tracking-[0.2em] text-accent-400 uppercase mb-4">
            Specialized Care
          </h2>
          <h3 className="text-4xl md:text-6xl font-serif font-medium text-white mb-6">
            Our Specialists
          </h3>
          <p className="text-lg text-white/60 reveal-text-scrub">
            Beyond primary care, we offer a wide range of specialized medical services to ensure comprehensive health management for our patients.
          </p>
        </div>
      </div>

      {/* Horizontal Scroll Container Wrapper */}
      <div className="relative px-4 sm:px-6 lg:px-8">
        {/* Navigation Arrows (Inside Slider, Centered) */}
        <div className="absolute inset-y-0 left-0 right-0 pointer-events-none z-30 flex items-center justify-between px-4 md:px-12">
          <button 
            onClick={() => scroll('left')}
            className="w-14 h-14 rounded-full border border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-center text-white pointer-events-auto opacity-0 group-hover/section:opacity-40 hover:!opacity-100 transition-all hover:scale-110 active:scale-95"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="w-14 h-14 rounded-full border border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-center text-white pointer-events-auto opacity-0 group-hover/section:opacity-40 hover:!opacity-100 transition-all hover:scale-110 active:scale-95"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Thumb Zones (Affordance) */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-20 z-20 cursor-pointer md:hidden" 
          onClick={() => scroll('left')}
        />
        <div 
          className="absolute right-0 top-0 bottom-0 w-20 z-20 cursor-pointer md:hidden" 
          onClick={() => scroll('right')}
        />

        <div 
          ref={containerRef}
          className="flex gap-8 overflow-x-auto pt-16 pb-12 px-4 scrollbar-hide snap-x snap-mandatory relative z-10 overflow-y-visible reveal-stagger"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {specialists.map((specialist) => (
            <div
              key={specialist.name}
              className="flex-none w-[300px] md:w-[400px] snap-center"
            >
              <div 
                className="group relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                {/* Parallax Image Effect */}
                <div className="absolute inset-0 z-0 reveal-scale">
                  <img
                    src={specialist.image}
                    alt={specialist.title}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 z-10 p-6 md:p-8 flex flex-col justify-between bg-gradient-to-t from-primary-900 via-primary-900/40 to-transparent">
                  {/* Top Area: Specialty Title */}
                  <div className="transform -translate-y-2">
                    <span className="text-[10px] md:text-[12px] font-bold tracking-[0.2em] text-white group-hover:text-accent-400 uppercase transition-all duration-300 inline-block group-hover:-translate-y-1">
                      {specialist.title}
                    </span>
                  </div>

                  {/* Bottom Area: Content */}
                  <div className="flex flex-col">
                    <h4 className={`font-serif font-medium mb-2 text-accent-400 group-hover:text-white transition-all duration-300 transform group-hover:-translate-y-1 ${
                      specialist.title === "DRE" ? "text-lg md:text-2xl" : "text-xl md:text-3xl"
                    }`}>
                      {specialist.name}
                    </h4>
                    <p className="text-white/70 text-[13px] md:text-sm leading-relaxed mb-4 line-clamp-2 md:line-clamp-3">
                      {specialist.description}
                    </p>
                    
                    {/* Location/Schedule Block */}
                    <div className="space-y-2 border-t border-white/10 pt-4">
                      {specialist.locations.map((loc: any, i) => (
                        <div key={i} className="flex items-start gap-2 text-[10px] md:text-[11px] text-white/50">
                          {loc.isProvider ? (
                            <User className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0 mt-0.5 text-accent-400/70" />
                          ) : (
                            <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0 mt-0.5 text-accent-400/70" />
                          )}
                          <div className="flex flex-col leading-tight">
                             {loc.office && <span className="text-white/90 font-semibold">{loc.office}</span>}
                             {loc.address && <span className="text-white/90 font-semibold">{loc.address}</span>}
                             {loc.schedule && <span className="text-[9px] md:text-[10px] italic text-white/40 mt-0.5">{loc.schedule}</span>}
                             {loc.note && <span className="text-accent-400/90 font-bold uppercase tracking-wider text-[8px] md:text-[9px] mt-0.5">{loc.note}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 w-12 h-1 bg-accent-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Progress Indicator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-accent-500"
            style={{ scaleX: scrollXProgress, originX: 0 }}
          />
        </div>
        <div className="mt-4 flex justify-center md:hidden">
          <p className="text-xs text-white/40 font-medium uppercase tracking-widest">Swipe to explore</p>
        </div>
      </div>
    </section>
  );
}

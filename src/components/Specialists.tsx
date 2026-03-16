import { motion, useScroll, AnimatePresence } from "motion/react";
import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import ChromaticLink from "./ChromaticLink";

const specialists = [
  {
    title: "Pulmonologist",
    description: "Expert care for respiratory and lung-related conditions.",
    image: "https://nethingso.xyz/specialists/pulmonologist.png",
  },
  {
    title: "Cardiologist",
    description: "Comprehensive heart health and cardiovascular diagnostics.",
    image: "https://nethingso.xyz/specialists/cardiologist.png",
  },
  {
    title: "Clinical Research",
    description: "Advancing medicine through dedicated clinical trials.",
    image: "https://nethingso.xyz/specialists/reserch.avif",
  },
  {
    title: "Dentist",
    description: "Complete oral health and aesthetic dental solutions.",
    image: "https://nethingso.xyz/specialists/dentist.png",
  },
  {
    title: "Gastroenterologist",
    description: "Specialized treatment for digestive system disorders.",
    image: "https://nethingso.xyz/specialists/gastroenterologist.webp",
  },
  {
    title: "Pain Management",
    description: "Innovative therapies for chronic and acute pain relief.",
    image: "https://nethingso.xyz/specialists/pain-management.webp",
  },
  {
    title: "Psychotherapist",
    description: "Compassionate mental health and emotional support.",
    image: "https://nethingso.xyz/specialists/psychotherapist.webp",
  },
  {
    title: "Podiatrist",
    description: "Expert foot and ankle care for all ages.",
    image: "https://nethingso.xyz/specialists/podiatrist.png",
  },
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
      className="pt-32 pb-16 bg-transparent relative overflow-visible group/section"
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
              key={specialist.title}
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
                <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end bg-gradient-to-t from-primary-900 via-primary-900/20 to-transparent">
                  <h4 className="text-2xl md:text-3xl font-serif font-medium text-white mb-3 group-hover:text-accent-400 transition-colors">
                    {specialist.title}
                  </h4>
                  <p className="text-white/60 text-sm md:text-base leading-relaxed transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    {specialist.description}
                  </p>
                  <ChromaticLink href="#services" className="mt-6 flex items-center gap-2 text-accent-400 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </ChromaticLink>
                  <div className="mt-4 w-12 h-1 bg-accent-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
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

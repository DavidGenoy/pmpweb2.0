import React, { useState, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { MapPin, Phone, Clock, ArrowRight, RotateCw } from "lucide-react";

interface Location {
  name: string;
  address: string;
  hours: string;
  image: string;
  direction: string;
}

function LocationCard({ location, index }: { location: Location; index: number; key?: string }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--x', `${x}px`);
    cardRef.current.style.setProperty('--y', `${y}px`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleFlip();
    }
  };

  return (
    <motion.div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="group perspective-1000 h-[420px] max-sm:h-auto max-sm:aspect-[4/5] w-full cursor-pointer glow-card location-card"
      onClick={handleFlip}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-pressed={isFlipped}
      aria-label={`Location card for ${location.name}. Click to flip and see photo.`}
      whileTap={typeof window !== 'undefined' && window.innerWidth >= 768 ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0.01 }}
        transition={{
          duration: shouldReduceMotion ? 0.1 : 0.5,
          type: "spring",
          stiffness: isFlipped ? 200 : 240,
          damping: 22,
          mass: 0.8
        }}
        className="relative h-full w-full preserve-3d"
        style={{ 
          transform: `translateZ(0)`,
          willChange: 'transform',
          transformStyle: 'preserve-3d',
          WebkitTransformStyle: 'preserve-3d'
        }}
      >
        {/* Front Side */}
        <div 
          className="absolute inset-0 h-full w-full backface-hidden"
          style={{ 
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
            transform: 'translateZ(2px)', // Increased for Safari layering
            WebkitTransform: 'translateZ(2px)'
          }}
        >
          <div className="h-full w-full glass-card p-6 sm:p-8 rounded-3xl flex flex-col">
            <div className="flex justify-between items-start mb-4 sm:mb-6">
              <h4 className="text-xl sm:text-2xl font-bold text-white">
                {location.name}
              </h4>
              <RotateCw className="w-5 h-5 text-white/30 group-hover:text-accent-400 transition-colors" />
            </div>

            <div className="space-y-4 flex-grow">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-white/90 whitespace-pre-line">{location.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-accent-400 mt-0.5 shrink-0" />
                <p className="text-white/70 whitespace-pre-line">{location.hours}</p>
              </div>

              <div className="pt-2">
                <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold flex items-center gap-2">
                  <RotateCw className="w-3 h-3" />
                  Click to flip
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex gap-4">
              <button 
                onClick={(e) => { e.stopPropagation(); window.open(location.direction, '_blank'); }}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium transition-colors text-sm"
              >
                Directions
              </button>
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  window.open('https://healow.com/apps/practice/primary-medical-physicians-llc-hollywood-fl-23412?v=2&t=1', '_blank');
                }}
                className="flex-1 bg-accent-500 hover:bg-accent-400 text-primary-900 py-3 rounded-xl font-bold transition-colors text-sm"
              >
                Book Here
              </button>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div 
          className="absolute inset-0 h-full w-full backface-hidden"
          style={{ 
            transform: "rotateY(180deg) translateZ(2px)", // Increased for Safari layering
            WebkitTransform: "rotateY(180deg) translateZ(2px)",
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden'
          }}
        >
            <div className="h-full w-full relative rounded-3xl overflow-hidden glass-card group/back reveal-scale">
            <motion.img
              src={location.image}
              alt={`Exterior of ${location.name} location`}
              className="absolute inset-0 w-full h-full object-contain p-4"
              referrerPolicy="no-referrer"
              whileHover={!shouldReduceMotion ? { scale: 1.05 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute inset-0 opacity-0 group-hover/back:opacity-100 transition-opacity duration-500 bg-accent-500/5 pointer-events-none shadow-[inset_0_0_50px_rgba(16,185,129,0.2)]" />
            
            <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
              <p className="text-accent-400 font-bold text-sm uppercase tracking-widest mb-1">Location Photo</p>
              <h4 className="text-xl font-bold text-white">{location.name}</h4>
              <p className="text-white/60 text-xs mt-2 italic">Click to flip back</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Locations() {
  const locations = [
    {
      name: "Hollywood Taft (Main)",
      address: "6517 Taft St\nSuite 102\nHollywood, FL 33024",
      hours: "Mon-Fri: 8:00am - 5:30pm\nSat: 8:30am - 1:00pm\nSunday: 9:00am - 3:30pm",
      direction: "https://maps.app.goo.gl/wyLpLiDysZodzGH96",
      image: "https://nethingso.xyz/locations/locations-2-taft-6517.webp",
    },
    {
      name: "Hollywood Johnson",
      address: "3800 Johnson St\nSuite E\nHollywood, FL 33021",
      hours: "Mon-Fri: 8:30am - 5:00pm",
      direction: "https://maps.app.goo.gl/cykjZd8Sat7HysHj7",
      image: "https://nethingso.xyz/locations/locations-1-johnson.webp",
    },
    {
      name: "Pembroke Pines",
      address: "601 N Flamingo Rd\nSuite 304\nPembroke Pines, FL 33028",
      hours: "Mon-Fri: 8:30am - 5:00pm",
      direction: "https://maps.app.goo.gl/jYy8nKjJT1ByxSwq7",
      image: "https://nethingso.xyz/locations/locations-3-pines.webp",
    },
    {
      name: "Davie Manor",
      address: "7630 SW 34 Manor\nSuite 400\nDavie, FL 33328",
      hours: "Mon-Fri: 8:00am - 5:30pm",
      direction: "https://maps.app.goo.gl/REEL5UjBenHyC8BC7",
      image: "https://nethingso.xyz/locations/locations-4-davie2.webp",
    },
    {
      name: "Davie",
      address: "10650 W State Rd 84\nSuite 104\nDavie, FL 33324",
      hours: "Mon-Fri: 8:30am - 5:00pm",
      direction: "https://maps.app.goo.gl/hTqVsDXbMJxnvVnh6",
      image: "https://nethingso.xyz/locations/locations-5-davie.webp",
    },
    {
      name: "Plantation",
      address: "320 S State Rd 7\nSuite 100\nPlantation, FL 33317",
      hours: "Mon-Fri: 8:30am - 5:00pm",
      direction: "https://maps.app.goo.gl/BNsxwvesa3HoRZjy7",
      image: "https://nethingso.xyz/locations/locations-6-plantation.webp",
    },
    {
      name: "Aventura",
      address: "21000 NE 28th Ave\nSuite 203\nAventura, FL 33180",
      hours: "Mon-Fri: 8:30am - 5:00pm",
      direction: "https://maps.app.goo.gl/7bX7q3JUDopi8ZAd9",
      image: "https://nethingso.xyz/locations/locations-7-aventura.webp",
    },
  ];

  return (
    <section
      id="locations"
      className="py-24 bg-transparent text-white relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 reveal-up">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold tracking-widest text-accent-400 uppercase mb-4">
              7 Convenient Locations
            </h2>
            <h3 className="text-4xl md:text-5xl font-serif font-medium mb-6">
              Find a Provider Near You in Broward and Dade County
            </h3>
            <p className="text-lg text-white/70 reveal-text-scrub">
              With seven convenient locations across Broward and Dade County, 
              high-quality primary care is always within reach for you and your family.
            </p>
          </div>
          <button 
            onClick={() => window.open('https://www.google.com/maps/d/viewer?mid=1r_dL3AYKjtcP9mC05XpfOe0RshAIklM&ehbc=2E312F', '_blank')}
            className="bg-accent-500 hover:bg-accent-400 text-primary-900 px-8 py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2 group whitespace-nowrap"
          >
            View All Locations on Map
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-8 reveal-stagger">
          {locations.map((location, index) => (
            <div key={location.name} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)]">
              <LocationCard location={location} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

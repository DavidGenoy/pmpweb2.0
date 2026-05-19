import React, { useState, useEffect } from "react";
import { X, Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function MammographyModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed it this session.
    // Using a new, highly specific key ensures it resets for this fresh version.
    const hasSeenModal = sessionStorage.getItem("pmp_mammography_modal_dismissed");
    
    // For testing purposes in preview, if you need to force it to show again, 
    // you can run sessionStorage.removeItem("pmp_mammography_modal_dismissed") in the browser console.
    if (!hasSeenModal) {
      // Small delay on page load for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        dismissModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const dismissModal = () => {
    setIsOpen(false);
    sessionStorage.setItem("pmp_mammography_modal_dismissed", "true");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          key="mammo-modal" // key required for AnimatePresence to work correctly on mount/unmount
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mammo-modal-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-primary-900/80 backdrop-blur-sm"
            onClick={dismissModal} // outside click dismiss behavior
            aria-hidden="true"
          />

            {/* Modal Content - Mobile scroll allowed via max-h-[90vh] on main container and min-h-0 flex-1 overflow-y-auto on content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            // Compact sizing, max-h limits on mobile for internal scrolling, while desktop expands safely
            className="relative w-full max-w-[850px] max-h-[90vh] md:max-h-none bg-primary-900 rounded-3xl sm:rounded-[2rem] shadow-2xl border border-white/10 flex flex-col md:flex-row z-10 mt-8 md:mt-0 shadow-[0_20px_60px_-15px_rgba(0,168,150,0.2)]"
          >
            {/* Close Button - positioned safely */}
            <button
              onClick={dismissModal}
              className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 p-2.5 bg-primary-900 border border-white/20 hover:bg-white/10 rounded-full text-white/80 hover:text-white shadow-xl transition-all z-30 group"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>

            {/* Refined Pink Awareness Ribbon Image - tightly anchored to top left corner */}
            <img 
              src="https://nethingso.xyz/temp/ribbon.webp"
              alt="Breast Cancer Awareness Ribbon"
              className="absolute -left-3 -top-6 sm:-left-4 sm:-top-8 md:-left-8 md:-top-8 lg:-left-12 lg:-top-12 z-40 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 object-contain drop-shadow-[0_15px_25px_rgba(255,107,157,0.25)] -rotate-[12deg] pointer-events-none"
            />

            {/* Left/Top Side - Floating Hero Image Composition */}
            <div className="w-full md:w-5/12 relative shrink-0 pt-10 sm:pt-12 px-4 md:pt-0 md:px-0 z-20 flex justify-center items-end md:static pointer-events-none">
              {/* Removed visible framed container box. desktop: moved more left and down, mobile: slight push down */}
              <div className="relative w-[110%] sm:w-full h-[150px] sm:h-[180px] md:h-auto md:absolute md:top-6 lg:top-8 md:-left-[20%] lg:-left-[26%] md:w-[60%] lg:w-[65%] flex items-end justify-center md:items-center mt-2 md:mt-0">
                <img 
                  src="https://nethingso.xyz/temp/mobile_mammo.webp"
                  alt="Mobile Mammography Coach"
                  // Object-contain prevents bus cutting. Scale makes it overlap cleanly.
                  className="w-full h-full md:h-auto object-contain object-bottom md:object-center drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] md:scale-[1.1] lg:scale-[1.15] pointer-events-auto" 
                />
              </div>
            </div>

            {/* Right/Bottom Side - Content. flex-1, min-h-0, overflow-y-auto enables safe mobile internal scrolling */}
            <div className="w-full md:w-7/12 p-5 sm:p-7 md:p-8 flex flex-col justify-start md:justify-center flex-1 min-h-0 overflow-y-auto overscroll-contain">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ff6b9d]/10 border border-[#ff6b9d]/20 rounded-full mb-3 self-start shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-[#ff6b9d]" />
                <span className="text-[#ff6b9d] text-xs font-bold tracking-wide uppercase">Women's Health</span>
              </div>
              
              <h2 id="mammo-modal-title" className="text-xl sm:text-2xl md:text-3xl font-serif text-white mb-2 leading-tight shrink-0">
                Mobile Mammography at Our Taft Location
              </h2>
              <p className="text-accent-400 font-medium text-xs sm:text-sm md:text-base mb-4 shrink-0">
                Convenient 3D screening mammograms available onsite.
              </p>

              <div className="space-y-4 mb-6 shrink-0">
                <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
                  Florida Mobile Mammography (Invision Diagnostics of Florida) provides mobile 3D mammography services designed to make breast cancer screening accessible and convenient.
                </p>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 md:w-5 md:h-5 text-accent-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white text-xs sm:text-sm font-medium">Primary Medical Physicians — Hollywood Taft</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2.5">
                    <Calendar className="w-4 h-4 md:w-5 md:h-5 text-accent-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white text-xs sm:text-sm font-medium">June 26 &bull; Sept 11 &bull; Nov 16</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-accent-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white text-xs sm:text-sm font-medium">08:00 AM – 03:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-center shrink-0">
                <a
                  href="https://www.floridamobilemammography.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={dismissModal} // dismiss on click through
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-accent-500 text-primary-900 text-sm font-bold hover:bg-accent-400 transition-all flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(0,168,150,0.3)] hover:-translate-y-0.5 group"
                >
                  Schedule / Learn More
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                
                <button
                  onClick={dismissModal}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-colors flex items-center justify-center"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

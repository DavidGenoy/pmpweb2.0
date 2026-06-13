import React, { useState, useEffect } from "react";
import { X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function HealthSunModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed it this session.
    // Using a new, highly specific key ensures it resets for this fresh version.
    const hasSeenModal = sessionStorage.getItem("pmp_healthsun_modal_dismissed");
    
    // For testing purposes in preview, if you need to force it to show again, 
    // you can run sessionStorage.removeItem("pmp_healthsun_modal_dismissed") in the browser console.
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
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
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
    sessionStorage.setItem("pmp_healthsun_modal_dismissed", "true");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          key="healthsun-modal" 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 ${!isOpen ? "pointer-events-none" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="healthsun-modal-title"
        >
          {/* Backdrop */}
          <div
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
            // Clean modal sizing, max-h limits on mobile for internal scrolling
            className="relative w-full max-w-[600px] max-h-[90vh] md:max-h-none bg-primary-900 rounded-3xl sm:rounded-[2rem] shadow-2xl border border-white/10 flex flex-col z-10 shadow-[0_20px_60px_-15px_rgba(0,168,150,0.2)]"
          >
            {/* Close Button - positioned safely */}
            <button
              onClick={dismissModal}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2.5 bg-primary-900 border border-white/20 hover:bg-white/10 rounded-full text-white/80 hover:text-white shadow-xl transition-all z-30 group"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>

            {/* Content area: flex-1, min-h-0, overflow-y-auto enables safe mobile internal scrolling */}
            <div className="p-6 sm:p-8 md:p-10 flex flex-col flex-1 min-h-0 overflow-y-auto overscroll-contain items-center text-center">
              
              {/* HealthSun Logo */}
              <div className="w-32 sm:w-40 md:w-48 mb-6 sm:mb-8 shrink-0 bg-white/5 p-4 rounded-2xl border border-white/10">
                <img 
                  src="https://nethingso.xyz/insurances/insurance-18-healthsun.webp"
                  alt="HealthSun Health Plans"
                  className="w-full h-auto object-contain pointer-events-none" 
                />
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-500/10 border border-accent-500/20 rounded-full mb-4 shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-400" />
                <span className="text-accent-400 text-xs font-bold tracking-wide uppercase">Patient Notice</span>
              </div>
              
              <h2 id="healthsun-modal-title" className="text-xl sm:text-2xl md:text-3xl font-serif text-white mb-4 leading-tight shrink-0">
                Important Notice for HealthSun Patients
              </h2>
              
              <p className="text-white/80 text-sm sm:text-base md:text-lg mb-8 shrink-0 max-w-lg">
                As of <strong>July 31st</strong>, Primary Medical Physicians will no longer accept HealthSun Health Plans.
              </p>

              <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 mb-8 text-left space-y-5 shrink-0">
                <p className="text-white/70 text-xs sm:text-sm font-medium text-center mb-2">
                  For assistance with insurance options, please contact:
                </p>

                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-between items-center sm:items-start divide-y sm:divide-y-0 sm:divide-x divide-white/10">
                  <div className="flex flex-col items-center sm:items-start w-full sm:w-1/2 pt-4 sm:pt-0">
                    <span className="text-white font-medium text-sm sm:text-base mb-1">Sandy Parker</span>
                    <span className="text-white/60 text-xs mb-2">English Assistance</span>
                    <a href="tel:9544107125" className="inline-flex items-center gap-1.5 text-accent-400 font-bold hover:text-accent-300 transition-colors">
                      <Phone className="w-4 h-4" />
                      (954) 410-7125
                    </a>
                  </div>
                  
                  <div className="flex flex-col items-center sm:items-start w-full sm:w-1/2 pt-4 sm:pt-0 sm:pl-6">
                    <span className="text-white font-medium text-sm sm:text-base mb-1">Lila Estrabridis</span>
                    <span className="text-white/60 text-xs mb-2">Spanish Assistance</span>
                    <a href="tel:5617040508" className="inline-flex items-center gap-1.5 text-accent-400 font-bold hover:text-accent-300 transition-colors">
                      <Phone className="w-4 h-4" />
                      (561) 704-0508
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="w-full mb-8 shrink-0">
                <p className="text-white/70 text-xs sm:text-sm mb-2">You may also contact our office directly at:</p>
                <a href="tel:9543999014" className="inline-flex items-center gap-1.5 text-white font-bold text-sm sm:text-base hover:text-accent-400 transition-colors">
                  <Phone className="w-4 h-4 text-accent-500" />
                  (954) 399-9014
                </a>
              </div>

              <p className="text-white/90 font-serif text-lg sm:text-xl shrink-0 italic">
                Thank you for your trust in our care.
              </p>

              <div className="mt-8 shrink-0 w-full flex justify-center">
                <button
                  onClick={dismissModal}
                  className="w-full sm:w-auto px-8 py-3 rounded-full bg-accent-500 text-primary-900 text-sm font-bold hover:bg-accent-400 transition-all shadow-[0_10px_30px_rgba(0,168,150,0.3)] hover:-translate-y-0.5"
                >
                  I Understand
                </button>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

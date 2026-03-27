import { motion } from "motion/react";
import { Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * NotFound Page Component
 * 
 * A premium, modern 404 page designed to match the Primary Medical Physicians brand.
 * Features:
 * - High-end typography with serif accents
 * - Smooth motion animations for a polished feel
 * - Functional navigation actions (Home, Back, Quick Links)
 * - Mobile-optimized layout with iOS-safe interactions
 */
export default function NotFound() {
  const navigate = useNavigate();

  // Navigation handler that respects the site's routing logic
  const handleNavClick = (href: string) => {
    if (href.startsWith("/")) {
      navigate(href);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Section handling - navigates to home and scrolls to section
      navigate("/", { state: { scrollTo: href } });
    }
  };

  return (
    <main className="bg-primary-950 min-h-screen text-white flex items-center justify-center pt-32 pb-20 px-4 overflow-hidden relative">
      {/* Premium Background Accents - Subtle and performance-friendly */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-accent-500/5 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary-500/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-4xl w-full relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* 404 Large Display - Refined: Magnifying glass removed, text lightened for elegance */}
          <div className="relative inline-block mb-12">
            <span className="text-[12rem] md:text-[20rem] font-serif font-bold text-white/10 leading-none select-none">
              404
            </span>
          </div>

          <h1 className="text-4xl md:text-7xl font-serif font-medium mb-6 leading-tight">
            Page <span className="text-accent-400 italic">Not Found.</span>
          </h1>
          
          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed">
            We couldn't find the page you're looking for. It might have been moved, deleted, or the URL might be incorrect. Rest assured, our expert care is still just a click away.
          </p>

          {/* Primary Action Buttons - Working Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <button
              onClick={() => handleNavClick("/")}
              className="w-full sm:w-auto px-10 py-5 bg-accent-500 text-primary-950 rounded-full font-bold text-lg hover:bg-accent-400 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-accent-500/20 flex items-center justify-center gap-3"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto px-10 py-5 border border-white/20 rounded-full font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-3"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>

          {/* Quick Links Grid - Integrated with site navigation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { name: "About Us", href: "/about-us" },
              { name: "Services", href: "#services" },
              { name: "Providers", href: "#providers" },
              { name: "Contact", href: "tel:9543999014", isPhone: true }
            ].map((link, i) => (
              <button
                key={i}
                onClick={() => link.isPhone ? window.location.href = link.href : handleNavClick(link.href)}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-accent-500/50 hover:bg-white/[0.08] transition-all group"
              >
                <span className="text-xs font-bold tracking-widest text-white/40 uppercase group-hover:text-accent-400 transition-colors">
                  {link.name}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}

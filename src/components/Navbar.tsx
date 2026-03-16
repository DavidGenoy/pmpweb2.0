import { useState, useEffect } from "react";
import { Menu, X, Phone, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ChromaticLink from "./ChromaticLink";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Providers", href: "#providers" },
    { name: "Locations", href: "#locations" },
    { name: "Services", href: "#services" },
    { name: "Patient Portal", href: "https://health.healow.com/PMP", external: true },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-primary-900/80 backdrop-blur-md shadow-lg py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-accent-500/20 blur-lg rounded-full group-hover:bg-accent-500/40 transition-colors" />
              <img 
                src="https://nethingso.xyz/img/Logo_PMP_transparent_highres_2x.png" 
                alt="Primary Medical Physicians" 
                className="h-12 w-auto relative z-10 brightness-0 invert"
                referrerPolicy="no-referrer"
              />
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <ChromaticLink
                key={link.name}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="text-base font-medium text-white/70 hover:text-accent-400"
              >
                {link.name}
              </ChromaticLink>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <ChromaticLink
              href="tel:9543999014"
              className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-accent-400 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>(954) 399-9014</span>
            </ChromaticLink>
            <a 
              href="https://healow.com/apps/practice/primary-medical-physicians-llc-hollywood-fl-23412?v=2&t=1"
              target="_blank"
              rel="noreferrer"
              className="bg-accent-500 hover:bg-accent-400 text-primary-900 px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              <Calendar className="w-4 h-4" />
              Book Appointment
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 w-full bg-primary-900 shadow-xl border-t border-white/10 lg:hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <ChromaticLink
                  key={link.name}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="text-base font-medium text-white py-2 border-b border-white/5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </ChromaticLink>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                <ChromaticLink
                  href="tel:9543999014"
                  className="flex items-center justify-center gap-2 text-white font-medium py-3 rounded-xl bg-white/5"
                >
                  <Phone className="w-5 h-5" />
                  <span>(954) 399-9014</span>
                </ChromaticLink>
                <a 
                  href="https://healow.com/apps/practice/primary-medical-physicians-llc-hollywood-fl-23412?v=2&t=1"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-accent-500 text-primary-900 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  Book Appointment
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

import { useState, useEffect } from "react";
import { Menu, X, Phone, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ChromaticLink from "./ChromaticLink";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about-us" },
    { name: "Providers", href: "#providers" },
    { name: "Locations", href: "#locations" },
    { name: "Services", href: "#services" },
    { name: "Patient Portal", href: "https://health.healow.com/PMP", external: true },
    { name: "Healow App", href: "#healow" },
    /* Vitamins menu item added after Patient Portal */
    /* URL assigned: https://connect.evexi.as/nutraceuticals/?p_id=a11730c8-811e-45ab-82cb-2b27e1465354 */
    /* Mobile placement/order preserved: Being last in navLinks ensures it is the last item in the mobile nav list */
    { name: "Vitamins", href: "https://connect.evexi.as/nutraceuticals/?p_id=a11730c8-811e-45ab-82cb-2b27e1465354", external: true },
    { name: "Anti Aging", href: "https://liquidvmobile.com/anti-aging", external: true },
    { name: "Referrals", href: "#specialists" },
  ];

  const handleNavClick = (href: string, external?: boolean) => {
    if (external) return;
    setIsMobileMenuOpen(false);
    
    // Internal page handling (e.g., /about-us)
    if (href.startsWith("/")) {
      if (location.pathname === href) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate(href);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    // Section handling
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: href } });
    } else {
      const element = document.querySelector(href);
      if (element) {
        // Use block: "start" for more consistent alignment across devices
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-primary-900/80 backdrop-blur-md shadow-lg py-3"
          : "bg-transparent py-5"
      } ios-navbar-fix`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-accent-500/20 blur-lg rounded-full group-hover:bg-accent-500/40 transition-colors" />
              <img 
                src="https://nethingso.xyz/logo/white_pmp_logo.png" 
                alt="Primary Medical Physicians" 
                className="h-10 lg:h-12 xl:h-14 2xl:h-16 w-auto relative z-10 brightness-0 invert"
                referrerPolicy="no-referrer"
              />
            </div>
          </Link>

          {/* Desktop Nav - adjusted spacing and whitespace-nowrap to fit 1 row */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-3 2xl:gap-4">
            {navLinks.map((link) => (
              <ChromaticLink
                key={link.name}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="text-[12px] xl:text-[13px] 2xl:text-[14px] font-medium text-white/70 hover:text-accent-400 whitespace-nowrap"
                onClick={(e) => {
                  if (!link.external) {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }
                }}
              >
                {link.name}
              </ChromaticLink>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
            <ChromaticLink
              href="tel:9543999014"
              className="flex items-center gap-1 xl:gap-1.5 text-[12px] xl:text-[14px] 2xl:text-sm font-medium text-white/70 hover:text-accent-400 transition-colors whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
              <span>(954) 399-9014</span>
            </ChromaticLink>
            <a 
              href="https://healow.com/apps/practice/primary-medical-physicians-llc-hollywood-fl-23412?v=2&t=1"
              target="_blank"
              rel="noreferrer"
              className="bg-accent-500 hover:bg-accent-400 text-primary-900 px-3 py-1.5 xl:px-4 xl:py-2.5 rounded-full text-[12px] xl:text-[14px] 2xl:text-sm font-bold transition-all flex items-center gap-1.5 shadow-sm hover:shadow-md whitespace-nowrap"
            >
              <Calendar className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
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
            <div className="px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <ChromaticLink
                  key={link.name}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="text-[15px] font-medium text-white py-1.5 border-b border-white/5"
                  onClick={(e) => {
                    if (!link.external) {
                      e.preventDefault();
                      handleNavClick(link.href);
                    } else {
                      setIsMobileMenuOpen(false);
                    }
                  }}
                >
                  {link.name}
                </ChromaticLink>
              ))}
              <div className="pt-3 flex flex-col gap-2">
                <ChromaticLink
                  href="tel:9543999014"
                  className="flex items-center justify-center gap-2 text-white font-medium py-2.5 rounded-xl bg-white/5 text-[15px]"
                >
                  <Phone className="w-4 h-4" />
                  <span>(954) 399-9014</span>
                </ChromaticLink>
                <a 
                  href="https://healow.com/apps/practice/primary-medical-physicians-llc-hollywood-fl-23412?v=2&t=1"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-accent-500 text-primary-900 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 text-[15px]"
                >
                  <Calendar className="w-4 h-4" />
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

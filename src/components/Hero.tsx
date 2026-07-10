import { motion } from "motion/react";
import { ArrowRight, Star, ShieldCheck, Users, Phone, Printer, Mail, Clock, Instagram } from "lucide-react";
import HeroVideo from "./HeroVideo";
import ChromaticLink from "./ChromaticLink";

export default function Hero() {
  return (
    <section className="relative min-h-[90dvh] flex items-center pt-24 pb-12 overflow-hidden bg-transparent">
      <HeroVideo 
        videoSrc="https://assets.mixkit.co/videos/preview/mixkit-medical-professional-working-with-a-microscope-40342-large.mp4"
        posterSrc="https://images.unsplash.com/photo-1638202993928-7267aad84c31?q=80&w=2574&auto=format&fit=crop"
        overlayOpacity={0.5}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Content */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/20 text-accent-400 font-medium text-[10px] sm:text-sm mb-8 border border-accent-500/30 reveal-up">
              <Star className="w-4 h-4 fill-current" />
              <span>Top-Rated Primary Care in Broward and Dade County</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-serif font-medium text-white leading-[1.1] mb-6 text-balance reveal-text">
              Your Health is Our <span className="text-accent-400 italic">Primary</span> Focus.
            </h1>
            
            <p className="text-lg text-white/70 mb-10 max-w-xl leading-relaxed reveal-text-scrub">
              Comprehensive, compassionate primary care with 14 expert providers across 7 convenient locations in Broward and Dade County. We're here for you, every step of the way.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 reveal-up">
              <a 
                href="https://healow.com/apps/practice/primary-medical-physicians-llc-hollywood-fl-23412?v=2&t=1"
                target="_blank"
                rel="noreferrer"
                className="bg-accent-500 hover:bg-accent-400 text-primary-900 px-8 py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2 group text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Book Appointment
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="#providers"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-full font-medium transition-all flex items-center justify-center gap-2 text-lg backdrop-blur-md"
              >
                Find a Doctor
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex items-center gap-8 pt-8 border-t border-white/10 reveal-stagger">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-accent-500/20 flex items-center justify-center text-accent-400">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-white text-xl">14</p>
                  <p className="text-sm text-white/50 font-medium">Expert Providers</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-white text-xl">7</p>
                  <p className="text-sm text-white/50 font-medium">Locations</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Hours Card */}
          <div
            id="contact"
            className="relative lg:h-auto rounded-3xl overflow-hidden shadow-2xl p-8 sm:p-10 lg:p-12 pb-14 sm:pb-16 lg:pb-20 flex flex-col justify-between reveal-up glass-card"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl -z-10"></div>
            
            <div className="space-y-10">
              {/* Contact Info */}
              <div>
                <h3 className="text-2xl font-serif font-medium text-white mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent-500/20 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-accent-400" />
                  </div>
                  Contact Us
                </h3>
                <div className="space-y-4 text-lg text-white/80 ml-2">
                  <ChromaticLink href="tel:9543999014" className="flex items-center gap-4 flex-nowrap hover:text-accent-400 transition-colors group/link">
                    <Phone className="w-5 h-5 shrink-0 text-white/40 group-hover/link:text-accent-400 transition-colors" /> 
                    <span className="font-medium tracking-wide whitespace-nowrap">954-399-9014</span>
                  </ChromaticLink>
                  <div className="flex items-center gap-4 flex-nowrap">
                    <Printer className="w-5 h-5 shrink-0 text-white/40" /> 
                    <span className="tracking-wide whitespace-nowrap">Fax: 954-367-7175</span>
                  </div>
                  <ChromaticLink href="mailto:info@pmpfla.com" className="flex items-center gap-4 flex-nowrap hover:text-accent-400 transition-colors group/link">
                    <Mail className="w-5 h-5 shrink-0 text-white/40 group-hover/link:text-accent-400 transition-colors" /> 
                    <span className="tracking-wide whitespace-nowrap">info@pmpfla.com</span>
                  </ChromaticLink>
                </div>
              </div>

              {/* Working Hours */}
              <div>
                <h3 className="text-2xl font-serif font-medium text-white mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent-500/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-accent-400" />
                  </div>
                  Working Hours
                </h3>
                <div className="space-y-4 text-white/80 ml-2">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-white/10 pb-3 hover:border-accent-500/50 hover:text-accent-400 transition-colors gap-1 sm:gap-4">
                    <span className="font-medium uppercase tracking-wider text-xs sm:text-sm text-white/60 whitespace-nowrap">Monday - Friday</span>
                    <span className="font-medium text-sm sm:text-base whitespace-nowrap">8:00 AM – 5:00 PM</span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-white/10 pb-3 hover:border-accent-500/50 hover:text-accent-400 transition-colors gap-1 sm:gap-4">
                    <span className="font-medium uppercase tracking-wider text-xs sm:text-sm text-white/60 whitespace-nowrap">Saturday</span>
                    <span className="font-medium text-sm sm:text-base whitespace-nowrap">8:30 AM – 1:00 PM</span>
                  </div>
                  
                </div>
              </div>
            </div>

            {/* Footer / Socials */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-sm font-medium text-white mb-3">Patient Testimonials</p>
              <div className="flex flex-row items-center justify-between w-full mt-3">
                <a href="https://g.page/r/CZYx5q8wKJTDEAE/review" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 sm:gap-3 group/review bg-white/5 hover:bg-white/10 px-3 sm:px-4 py-2 rounded-full transition-all border border-white/5 hover:border-white/20 shrink-0">
                  <div className="flex gap-0.5 sm:gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-accent-400 text-accent-400 group-hover/review:scale-110 transition-transform" style={{ transitionDelay: `${i * 30}ms` }} />
                    ))}
                  </div>
                  <span className="text-[10px] sm:text-sm font-medium text-white/80 group-hover/review:text-white transition-colors whitespace-nowrap">Google Reviews</span>
                </a>
                <a href="https://www.instagram.com/primarymedicalphysicians/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/5 hover:bg-accent-500 hover:text-primary-900 flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg hover:shadow-accent-500/20 border border-white/10 hover:border-transparent text-white shrink-0">
                  <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


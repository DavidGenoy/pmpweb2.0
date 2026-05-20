import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Smartphone, 
  Download, 
  Key, 
  LogIn, 
  ShieldCheck, 
  ChevronDown, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Pill,
  Search,
  ArrowRight
} from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Is the healow app free?",
    answer: "Yes. The healow app is free to download from the Apple App Store and Google Play. Access to the Patient Portal and healow app is also free for patients."
  },
  {
    question: "Can I see my lab results in the app?",
    answer: "Yes, lab results may be available through the Patient Portal once they are posted by the office. Some results may require provider review before they become visible."
  },
  {
    question: "Can I request prescription refills through healow?",
    answer: "Yes, when available, you may be able to request medication refills through the app. For urgent medication concerns, please contact the office directly."
  },
  {
    question: "Is my information secure in healow?",
    answer: "healow is designed for secure patient communication and portal access. Patients use login credentials and a secure PIN, and some devices may support Face ID or Touch ID. To help protect your information, do not share your username, password, PIN, or portal access with anyone you do not trust."
  },
  {
    question: "What should I do if I forget my username or password?",
    answer: "Use the “Trouble logging in?” or password reset option in the app or Patient Portal. You may also contact our office for assistance with resetting your portal access."
  }
];

const features = [
  {
    icon: <Calendar className="w-5 h-5" />,
    title: "Book Appointments",
    text: "Schedule your visits online with ease."
  },
  {
    icon: <Pill className="w-5 h-5" />,
    title: "Medications & Refills",
    text: "View your prescriptions and request refills."
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: "Care Team Contact",
    text: "Directly communicate and receive reminders."
  },
  {
    icon: <FileText className="w-5 h-5" />,
    title: "Results & Records",
    text: "Access your lab results and medical history."
  }
];

// iOS-Safe Q&A accordion animation fix:
// Uses numeric height measurement and requestAnimationFrame instead of pure CSS Grid
// or Framer Motion height:auto which caused layout jank on iPhone.
const FaqAccordionItem: React.FC<{
  faq: FAQItem;
  isActive: boolean;
  onClick: () => void;
}> = ({ faq, isActive, onClick }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (!wrapper || !content) return;

    if (isFirstRender.current) {
      if (isActive) {
        wrapper.style.height = "auto";
        wrapper.style.opacity = "1";
      }
      isFirstRender.current = false;
      return;
    }

    if (isActive) {
      // 1. Measure target height dynamically
      wrapper.style.height = "auto";
      const targetHeight = content.offsetHeight;
      
      // 2. Lock to zero to begin transition
      wrapper.style.transitionDuration = "0ms";
      wrapper.style.height = "0px";
      wrapper.style.opacity = "0";
      
      // Force repaint
      void wrapper.offsetHeight;
      
      // 3. Execute fluid transition
      requestAnimationFrame(() => {
        wrapper.style.transitionDuration = "300ms";
        wrapper.style.height = `${targetHeight}px`;
        wrapper.style.opacity = "1";
      });

      const cleanup = (e: TransitionEvent) => {
        if (e.propertyName === "height" && wrapper.style.height !== "0px") {
          wrapper.style.height = "auto";
        }
      };
      
      wrapper.addEventListener("transitionend", cleanup);
      return () => wrapper.removeEventListener("transitionend", cleanup);
      
    } else {
      // 1. Lock from "auto" to measured pixel height
      wrapper.style.transitionDuration = "0ms";
      wrapper.style.height = `${content.offsetHeight}px`;
      
      // Force repaint
      void wrapper.offsetHeight;
      
      // 2. Collapse to 0
      requestAnimationFrame(() => {
        wrapper.style.transitionDuration = "300ms";
        wrapper.style.height = "0px";
        wrapper.style.opacity = "0";
      });
    }
  }, [isActive]);

  return (
    <div 
      className={`group rounded-2xl border transition-colors duration-300 ${
        isActive 
          ? "bg-accent-500/5 border-accent-500/30" 
          : "bg-white/5 border-white/10 hover:border-white/20"
      }`}
    >
      <button
        onClick={onClick}
        className="w-full text-left p-6 flex justify-between items-center gap-4 active:scale-[0.99] transition-transform"
      >
        <span className="text-lg font-medium text-white/90 group-hover:text-white transition-colors">{faq.question}</span>
        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border border-white/10 transition-transform duration-300 ${isActive ? "bg-accent-500 border-accent-500 rotate-180" : "bg-white/5"}`}>
          <ChevronDown className={`w-4 h-4 ${isActive ? "text-primary-900" : "text-accent-400"}`} />
        </div>
      </button>
      
      <div 
        ref={wrapperRef}
        className="overflow-hidden transition-all ease-[cubic-bezier(0.23,1,0.32,1)] will-change-[height,opacity] transform-gpu"
        style={{ height: "0px", opacity: 0 }}
      >
        <div ref={contentRef} className="px-6 pb-6 text-white/60 leading-relaxed border-t border-white/10 pt-4">
          {faq.answer}
        </div>
      </div>
    </div>
  );
};

export default function HealowSection() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // iOS Performance: Use refs for slider animation instead of React state
  // This prevents React from re-rendering the entire section on every drag frame
  const containerRef = useRef<HTMLDivElement>(null);
  const leftImageRef = useRef<HTMLImageElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const touchAreaRef = useRef<HTMLDivElement>(null);
  
  const isDragging = useRef(false);
  const rafId = useRef<number | null>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    
    // Throttle DOM updates to animation frames for iOS smoothness
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      if (leftImageRef.current) {
        leftImageRef.current.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
      }
      if (dividerRef.current) {
        dividerRef.current.style.left = `${percent}%`;
      }
      if (touchAreaRef.current) {
        touchAreaRef.current.style.left = `${percent}%`;
      }
    });
  };

  const onMouseDown = () => (isDragging.current = true);
  const onMouseUp = () => (isDragging.current = false);
  const onMouseMove = (e: React.MouseEvent) => {
    if (isDragging.current) handleMove(e.clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  // Prevent scroll during drag on mobile
  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      if (isDragging.current) e.preventDefault();
    };
    document.addEventListener("touchmove", preventDefault, { passive: false });
    return () => document.removeEventListener("touchmove", preventDefault);
  }, []);

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Safety check for browser environment
    if (typeof window === "undefined") return;

    const ua = navigator.userAgent.toLowerCase();
    
    // Enhanced iOS detection including iPadOS Safari
    const isIOS = /iphone|ipad|ipod/.test(ua) || 
                 (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    
    const isAndroid = /android/.test(ua);

    // Official healow links as requested
    const appleStore = "https://apps.apple.com/us/app/healow/id595012291";
    const googlePlay = "https://play.google.com/store/apps/details?id=com.ecw.healow&hl=en_US";
    const fallback = "https://healow.com/apps/jsp/webview/index.jsp";

    let targetUrl = fallback;
    if (isIOS) targetUrl = appleStore;
    else if (isAndroid) targetUrl = googlePlay;

    window.open(targetUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="healow" className="relative py-24 md:py-32 overflow-hidden bg-primary-900">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-accent-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-accent-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Reduced mobile gap from 16 to 10 for tighter vertical stack */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-center">
          
          {/* Left Side Content */}
          <div className="space-y-10 reveal-stagger">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/20">
                <Smartphone className="w-4 h-4 text-accent-400" />
                <span className="text-xs font-bold tracking-widest text-accent-400 uppercase">healow Mobile App</span>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-serif font-medium text-white leading-[1.1]">
                Manage Your Care <br />
                <span className="text-accent-400 italic">Anywhere</span> with healow
              </h2>
              
              <div className="space-y-4">
                <h3 className="text-xl font-medium text-white/90">What is the healow App?</h3>
                <p className="text-lg text-white/60 leading-relaxed max-w-xl">
                  The healow app is a secure mobile app connected to our Patient Portal. 
                  It allows you to access health information, communicate with our office, 
                  view appointments, manage medications, and stay connected with your care team from your smartphone.
                </p>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {features.map((feature, i) => (
                <div key={i} className="glass-card p-5 md:p-6 rounded-2xl group transition-all duration-300 flex items-center lg:block sm:flex">
                  <div className="w-10 h-10 rounded-xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center text-accent-400 mb-0 lg:mb-4 sm:mb-0 mr-4 lg:mr-0 sm:mr-4 group-hover:scale-110 transition-transform shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">{feature.title}</h4>
                    <p className="text-sm text-white/50">{feature.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Sign Up Steps */}
            <div className="space-y-8 pt-6 border-t border-white/10">
              <h3 className="text-2xl font-serif text-white">How to Get Started</h3>
              <div className="grid grid-cols-1 gap-6">
                {[
                  { icon: <Download />, text: "Download the healow app from App Store or Google Play." },
                  { 
                    icon: <Search />, 
                    text: (
                      <span>
                        Search for our practice using our code: 
                        <span className="inline-block ml-2 px-3 py-1 rounded bg-accent-500 text-primary-900 font-mono font-bold text-lg shadow-[0_0_20px_rgba(0,168,150,0.4)]">
                          ACFDCF
                        </span>
                      </span>
                    )
                  },
                  { icon: <LogIn />, text: "Enter your portal username and password to log in." },
                  { icon: <ShieldCheck />, text: "Set up a secure PIN to easily access your health records." }
                ].map((step, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-accent-400 shrink-0 border border-white/10 group-hover:bg-accent-500/10 transition-colors">
                      {step.icon}
                    </div>
                    <p className="text-white/70 leading-relaxed font-medium">{step.text}</p>
                  </div>
                ))}
              </div>
              
              {/* Combined Download Image Replacement - Balanced mobile spacing */}
              <div className="pt-6 md:pt-10 flex justify-center">
                <a 
                  href="#" 
                  onClick={handleDownloadClick}
                  className="inline-block transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  aria-label="Download healow app"
                >
                  <img 
                    src="https://nethingso.xyz/healow/healow-download-5.webp" 
                    alt="Download healow on App Store and Google Play" 
                    className="max-w-[280px] w-full h-auto drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Right Side Interaction - Phone Mockup Comparison */}
          <div className="space-y-8 lg:space-y-12 lg:pt-32 self-start lg:sticky lg:top-32 w-full">
            
            {/* Phone Image Comparison Reveal - Mobile size adjusted safely */}
            <div className="reveal-up relative w-full max-w-[240px] md:max-w-[320px] mx-auto group">
              {/* Outer Glow for Elevation - Hardware accelerated to prevent iOS repaint during drag */}
              <div 
                className="absolute inset-0 bg-accent-500/10 blur-[120px] -z-10 transition-all opacity-30 group-hover:opacity-60 pointer-events-none" 
                style={{ transform: 'translateZ(0)', WebkitTransform: 'translateZ(0)' }} 
              />

              {/* Single Transparent Container - Images already contain the phone mockup */}
              {/* Isolate and transform-gpu prevent iOS backdrop/drop-shadow repaint during dragging */}
              <div 
                ref={containerRef}
                className="relative aspect-[414/896] w-full cursor-ew-resize select-none touch-none drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)] isolate"
                style={{ transform: 'translateZ(0)', WebkitTransform: 'translateZ(0)' }}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
                onMouseMove={onMouseMove}
                onTouchStart={onMouseDown}
                onTouchEnd={onMouseUp}
                onTouchMove={onTouchMove}
              >
                {/* Background Image (Right Side) - Messages */}
                {/* draggable=false prevents ghost drags on iOS */}
                <img 
                  draggable={false}
                  src="https://nethingso.xyz/healow/healow-1-messages.webp" 
                  alt="healow Messages View" 
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />

                {/* Foreground Image (Left Side) - Records */}
                {/* Uses CSS clip-path for instant, perfect mobile rendering without JS calculations */}
                <img 
                  ref={leftImageRef}
                  draggable={false}
                  src="https://nethingso.xyz/healow/healow-2-records.webp" 
                  alt="healow Records View" 
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  style={{ clipPath: `inset(0 50% 0 0)` }}
                />

                {/* Reveal Divider Line */}
                <div 
                  ref={dividerRef}
                  className="absolute inset-y-0 w-[2px] bg-accent-400 transform -translate-x-1/2 pointer-events-none z-40"
                  style={{ left: `50%` }}
                >
                  {/* Draggable Handle */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center border-[2px] border-accent-400 z-50">
                    <div className="flex gap-[3px]">
                      <div className="w-[1.5px] h-3 bg-accent-400 rounded-full" />
                      <div className="w-[1.5px] h-3 bg-accent-400 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Invisible larger touch target for handle */}
                <div 
                  ref={touchAreaRef}
                  className="absolute inset-y-0 w-16 -ml-8 z-40 cursor-ew-resize"
                  style={{ left: `50%` }}
                />
              </div>

              {/* Mobile/iPhone-safe Labels - Positioned precisely on edges */}
              <div className="absolute top-1/2 left-0 -translate-x-[15%] md:-translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none">
                <div className="flex items-center gap-2 px-3 py-1.5 md:px-5 md:py-2.5 rounded-[12px] bg-primary-900/95 backdrop-blur-md text-white font-medium tracking-wide text-[11px] md:text-sm shadow-2xl border border-accent-500/30">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-accent-400 shadow-[0_0_8px_rgba(0,168,150,0.8)]" />
                  Records
                </div>
              </div>
              
              <div className="absolute top-1/2 right-0 translate-x-[15%] md:translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none">
                <div className="flex items-center gap-2 px-3 py-1.5 md:px-5 md:py-2.5 rounded-[12px] bg-primary-900/95 backdrop-blur-md text-white font-medium tracking-wide text-[11px] md:text-sm shadow-2xl border border-accent-500/30">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-accent-400 shadow-[0_0_8px_rgba(0,168,150,0.8)]" />
                  Messages
                </div>
              </div>
              
              <p className="mt-8 text-center text-xs text-white/30 font-medium uppercase tracking-widest flex items-center justify-center gap-3">
                <span className="w-6 h-[1px] bg-white/5" />
                Slide to explore
                <span className="w-6 h-[1px] bg-white/5" />
              </p>
            </div>

            {/* Q&A Accordion */}
            <div className="reveal-up space-y-4">
              <h3 className="text-2xl font-serif text-white mb-4 lg:mb-6">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <FaqAccordionItem
                    key={i}
                    faq={faq}
                    isActive={activeFaq === i}
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Centered Portal Profile Block - Responsive margin */}
        <div className="mt-16 md:mt-24 reveal-up flex justify-center">
          <div className="w-full max-w-4xl p-8 md:p-14 text-center space-y-12 relative group">
            <div className="absolute inset-0 bg-accent-500/10 blur-[140px] opacity-20 -z-10 group-hover:opacity-40 transition-opacity" />
            
            <div className="space-y-6">

              <h3 className="text-4xl md:text-6xl font-serif font-medium text-white leading-[1.1]">
                  Already have <br />
                  <span className="text-accent-400 italic">our Patient</span> Portal?
                </h3>
              <p className="text-xl text-white/50 max-w-2xl mx-auto">Log in directly to schedule appointments, message your provider, or request refills.</p>
            </div>

            <div className="flex justify-center items-center">
              <a
                href="https://mycw151.ecwcloud.com/portal21152/jsp/100mp/login_otp.jsp"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 md:px-10 py-4 md:py-6 rounded-full bg-accent-500 text-primary-900 font-bold hover:bg-accent-400 transition-all flex items-center justify-center gap-2 md:gap-3 shadow-[0_20px_50px_rgba(0,168,150,0.4)] hover:-translate-y-1 text-base md:text-xl group/btn w-full max-w-[280px] md:max-w-[400px]"
              >
                Go to Patient Portal
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover/btn:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

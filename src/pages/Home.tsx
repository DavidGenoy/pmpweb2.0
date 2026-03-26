import Hero from "../components/Hero";
import Locations from "../components/Locations";
import Providers from "../components/Providers";
import Specialists from "../components/Specialists";
import Insurances from "../components/Insurances";
import Services from "../components/Services";
import Testimonials from "../components/Testimonials";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    // Handle cross-page navigation with section anchors
    // This fix ensures that when coming from internal pages (About Us, TOS, Privacy),
    // the site correctly scrolls to the target section (Services, Providers, Contact)
    if (location.state && (location.state as any).scrollTo) {
      const targetId = (location.state as any).scrollTo;
      
      // iOS-specific check to ensure we only apply the fix where needed
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      
      // iOS-only navigation fix:
      // For iOS, we use a slightly longer delay (750ms) to avoid conflict with 
      // the 500ms ScrollTrigger.refresh() in ScrollManager.tsx.
      // This ensures the layout is fully settled before we start the scroll.
      // Android/Desktop behavior is preserved with the original 500ms delay.
      const delay = isIOS ? 750 : 500;

      const timer = setTimeout(() => {
        const element = document.querySelector(targetId);
        if (element) {
          if (isIOS) {
            // iOS-only navigation fix:
            // window.scrollTo with calculated absolute position is more reliable on Safari 
            // than scrollIntoView when combined with smooth scrolling and layout refreshes.
            const top = element.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({ top, behavior: "smooth" });
          } else {
            // Preservation of Android/Desktop behavior:
            // Keep the working scrollIntoView logic for non-iOS platforms as reported.
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
          
          // Safeguards against stale target reuse on iOS:
          // Clear the state in the browser history to prevent re-scrolling on back navigation.
          window.history.replaceState({}, document.title);
        }
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <main>
      <Hero />
      <Locations />
      <Providers />
      <Specialists />
      <Insurances />
      <Services />
      <Testimonials />
    </main>
  );
}

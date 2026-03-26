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
      
      // iOS-safe route/scroll handling:
      // We use a multi-stage timeout to ensure the DOM is fully painted and 
      // ScrollTrigger/Lenis have finished their initial calculations.
      const timer = setTimeout(() => {
        const element = document.querySelector(targetId);
        if (element) {
          // Smooth scroll to the target element
          element.scrollIntoView({ behavior: "smooth", block: "start" });
          
          // Clear state to prevent re-scrolling on subsequent renders or back navigation
          // This is critical for preventing buggy behavior on iOS Safari
          window.history.replaceState({}, document.title);
        }
      }, 500); // Increased to 500ms for better stability on slower mobile devices/iOS
      
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

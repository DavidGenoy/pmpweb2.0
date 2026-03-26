import Hero from "../components/Hero";
import Locations from "../components/Locations";
import Providers from "../components/Providers";
import Specialists from "../components/Specialists";
import Insurances from "../components/Insurances";
import Services from "../components/Services";
import Testimonials from "../components/Testimonials";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Handle cross-page navigation with section anchors
    // This fix ensures that when coming from internal pages (About Us, TOS, Privacy),
    // the site correctly scrolls to the target section (Services, Providers, Contact)
    if (location.state && (location.state as any).scrollTo) {
      const targetId = (location.state as any).scrollTo;
      
      // iOS-safe route/scroll handling:
      // iOS Safari often has race conditions between route transitions, 
      // DOM mounting, and smooth scroll execution. Layout shifts from 
      // late-loading components or ScrollTrigger refreshes can also 
      // cause the scroll to land on the wrong section.
      
      const performScroll = () => {
        const element = document.querySelector(targetId);
        if (element) {
          // Calculate the absolute position to avoid issues with relative scrollIntoView
          // which can be flaky on iOS when the page height is dynamic.
          const rect = element.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const targetTop = rect.top + scrollTop;

          window.scrollTo({
            top: targetTop,
            behavior: "smooth"
          });
          return true;
        }
        return false;
      };

      // Multi-stage scroll attempts to ensure we land on the correct section
      // even if layout shifts occur as components mount and animate.
      // We align these with ScrollTrigger refreshes for maximum accuracy.
      const timer1 = setTimeout(performScroll, 600); // Initial attempt after first refresh
      const timer2 = setTimeout(performScroll, 1400); // Second attempt after layout settles
      
      const timer3 = setTimeout(() => {
        if (performScroll()) {
          // Clear state using React Router's navigate to ensure consistency across the app
          // and prevent re-scrolling on back navigation or component remounts.
          navigate(location.pathname, { replace: true, state: {} });
        }
      }, 2800); // Final verification attempt
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [location, navigate]);

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

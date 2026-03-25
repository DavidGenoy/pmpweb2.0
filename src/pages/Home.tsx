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
    if (location.state && (location.state as any).scrollTo) {
      const element = document.querySelector((location.state as any).scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
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

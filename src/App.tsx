/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import ParticleBackground from "./components/ParticleBackground";
import ScrollManager from "./components/ScrollManager";
import Navbar from "./components/Navbar";
import ProviderMoisesIssa from "./pages/ProviderMoisesIssa";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AboutUs from "./pages/AboutUs";
import EvexiasService from "./pages/EvexiasService";
import NotFound from "./pages/NotFound";
import MembershipPlans from "./pages/MembershipPlans";
import MembershipEnroll from "./pages/MembershipEnroll";

const MembershipFoundationPreview = import.meta.env.DEV
  ? lazy(() => import("./pages/MembershipFoundationPreview"))
  : null;

function ScrollToTopOnPathChange() {
  const { pathname, state } = useLocation();
  useEffect(() => {
    // iOS-safe route/scroll handling: 
    // Do not scroll to top if we are navigating to a specific section on the homepage
    if (state && (state as any).scrollTo) return;
    
    // We only scroll to top when the actual page changes, not when the state is cleared.
    // This prevents the "jump back to top" bug on iOS when the scroll target is resolved.
    window.scrollTo(0, 0);
  }, [pathname]); // Only depend on pathname
  return null;
}

export default function App() {
  const showParticles = true;
  const highContrast = false;

  return (
    <div className={`selection:bg-accent-500/30 selection:text-primary-900 ${highContrast ? 'contrast-125 grayscale-[0.2]' : ''}`}>
      {showParticles && <ParticleBackground />}
      <ScrollManager />
      <ScrollToTopOnPathChange />
      
      <div className="font-sans text-white relative z-10">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/providers/moises-issa-md" element={<ProviderMoisesIssa />} />
          <Route path="/services/evexias-hormone-pellet-therapy" element={<EvexiasService />} />
          <Route path="/membership-plans" element={<MembershipPlans />} />
          <Route path="/membership/enroll" element={<MembershipEnroll />} />
          {import.meta.env.DEV && MembershipFoundationPreview && (
            <Route
              path="/dev/membership-foundation"
              element={
                <Suspense fallback={null}>
                  <MembershipFoundationPreview />
                </Suspense>
              }
            />
          )}
          {/* Wildcard route for 404 Page Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>

      <ScrollToTop />

      {/* Global SVG Filter for Fluid Distortion */}
      <svg className="fixed pointer-events-none opacity-0 h-0 w-0">
        <defs>
          <filter id="fluid-distort">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.01 0.01" 
              numOctaves="1" 
              result="warp" 
              seed="1"
            >
              <animate 
                attributeName="baseFrequency" 
                values="0.01 0.01; 0.02 0.02; 0.01 0.01" 
                dur="10s" 
                repeatCount="indefinite" 
              />
            </feTurbulence>
            <feDisplacementMap 
              id="displacement-map"
              in="SourceGraphic" 
              in2="warp" 
              scale="0" 
              xChannelSelector="R" 
              yChannelSelector="G" 
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

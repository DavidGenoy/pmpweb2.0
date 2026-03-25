/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import ParticleBackground from "./components/ParticleBackground";
import ScrollManager from "./components/ScrollManager";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";

function ScrollToTopOnPathChange() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
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

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import ParticleBackground from "./components/ParticleBackground";
import ScrollManager from "./components/ScrollManager";

// Version 1 Components
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Locations from "./components/Locations";
import Providers from "./components/Providers";
import Specialists from "./components/Specialists";
import Insurances from "./components/Insurances";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  const showParticles = true;
  const highContrast = false;

  return (
    <div className={`min-h-screen selection:bg-accent-500/30 selection:text-primary-900 overflow-x-hidden ${highContrast ? 'contrast-125 grayscale-[0.2]' : ''}`}>
      {showParticles && <ParticleBackground />}
      <ScrollManager />
      
      <div className="font-sans text-white relative z-10">
        <Navbar />
        <main>
          <Hero />
          <Locations />
          <Providers />
          <Specialists />
          <Insurances />
          <Services />
          <Testimonials />
        </main>
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

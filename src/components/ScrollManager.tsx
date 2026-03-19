import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollManager() {
  useEffect(() => {
    // 1. Initialize Lenis Smooth Scroll
    const isMobile = window.innerWidth < 768;
    
    const lenis = new Lenis({
      duration: isMobile ? 1.0 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: isMobile ? 1.2 : 1.5, // Lower multiplier on mobile to prevent "runaway" scrolling
      infinite: false,
      syncTouch: true, // Sync touch scroll with Lenis
    });

    // Sync ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // 2. Animation Logic for Utility Classes
    
    // Reveal Up
    const revealUpElements = document.querySelectorAll('.reveal-up');
    revealUpElements.forEach((el) => {
      gsap.fromTo(el, 
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        }
      );
    });

    // Reveal Stagger
    const staggerContainers = document.querySelectorAll('.reveal-stagger');
    staggerContainers.forEach((container) => {
      const children = container.children;
      if (children.length > 0) {
        gsap.fromTo(children,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: container,
              start: 'top 80%',
              toggleActions: 'play none none none',
            }
          }
        );
      }
    });

    // Reveal Scale (Subtle Parallax)
    const scaleElements = document.querySelectorAll('.reveal-scale');
    scaleElements.forEach((el) => {
      gsap.fromTo(el,
        { scale: 1.1 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        }
      );
    });

    // Text Reveal (Mask/Slide)
    const textRevealElements = document.querySelectorAll('.reveal-text');
    textRevealElements.forEach((el) => {
      gsap.fromTo(el,
        { y: '100%', opacity: 0 },
        {
          y: '0%',
          opacity: 1,
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none',
          }
        }
      );
    });

    // 3. Scrubbed Text Reveal (SplitType)
    let splitInstances: SplitType[] = [];

    const initScrubText = () => {
      // Clean up previous instances
      splitInstances.forEach(instance => instance.revert());
      splitInstances = [];
      ScrollTrigger.getAll().filter(st => st.vars.id === 'scrub-text').forEach(st => st.kill());

      const scrubElements = document.querySelectorAll('.reveal-text-scrub');
      scrubElements.forEach((el) => {
        const split = new SplitType(el as HTMLElement, { types: 'words' });
        splitInstances.push(split);

        if (split.words) {
          gsap.to(split.words, {
            opacity: 1,
            stagger: 0.1,
            ease: 'none',
            scrollTrigger: {
              id: 'scrub-text',
              trigger: el,
              start: 'top 80%',
              end: 'top 20%',
              scrub: true,
            }
          });
        }
      });
    };

    initScrubText();

    // 4. Multi-Column Parallax
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const parallaxWrappers = document.querySelectorAll('.parallax-grid-wrapper');
      
      parallaxWrappers.forEach((wrapper) => {
        const columns = wrapper.querySelectorAll('.parallax-column');
        
        columns.forEach((col) => {
          const speed = parseFloat(col.getAttribute('data-speed') || '1');
          const movement = (speed - 1) * 200; // Adjust multiplier for intensity
          
          gsap.fromTo(col,
            { y: movement },
            {
              y: -movement,
              ease: 'none',
              scrollTrigger: {
                trigger: wrapper,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              }
            }
          );
        });
      });
    });

    // Handle Resize
    let resizeTimer: NodeJS.Timeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        initScrubText();
        ScrollTrigger.refresh();
      }, 250);
    });

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
      splitInstances.forEach(instance => instance.revert());
      window.removeEventListener('resize', initScrubText);
    };
  }, []);

  return null;
}

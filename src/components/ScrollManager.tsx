import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import SplitType from 'split-type';
import { useLocation } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ 
  limitCallbacks: true,
  ignoreMobileResize: true // This is a huge help for iOS address bar issues
});

export default function ScrollManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Initialize Lenis Smooth Scroll
    const isMobile = window.innerWidth < 768;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    let lenis: Lenis | null = null;

    // Only use Lenis on Desktop for maximum performance and native feel on mobile
    if (!isMobile && !isIOS) {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        infinite: false,
        syncTouch: false, // Never sync touch for better native performance
      });

      // Sync ScrollTrigger with Lenis
      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis?.raf(time * 1000);
      });
    }

    gsap.ticker.lagSmoothing(0);

    // 2. Animation Logic for Utility Classes
    let splitInstances: SplitType[] = [];

    const initAnimations = () => {
      // Kill existing triggers to prevent duplicates and memory leaks
      ScrollTrigger.getAll().forEach(t => t.kill());
      splitInstances.forEach(instance => instance.revert());
      splitInstances = [];

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
            force3D: true,
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              toggleActions: 'play none none none',
              onEnter: () => el.classList.add('is-visible'),
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
              force3D: true,
              scrollTrigger: {
                trigger: container,
                start: 'top 80%',
                toggleActions: 'play none none none',
                onEnter: () => container.classList.add('is-visible'),
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
            force3D: true,
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
            force3D: true,
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              toggleActions: 'play none none none',
              onEnter: () => el.classList.add('is-visible'),
            }
          }
        );
      });

      // Scrubbed Text Reveal (SplitType)
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
              start: 'top 85%',
              end: 'top 25%',
              scrub: true,
            }
          });
        }
      });

      // Multi-Column Parallax
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const parallaxWrappers = document.querySelectorAll('.parallax-grid-wrapper');
        parallaxWrappers.forEach((wrapper) => {
          const columns = wrapper.querySelectorAll('.parallax-column');
          columns.forEach((col) => {
            const speed = parseFloat(col.getAttribute('data-speed') || '1');
            const movement = (speed - 1) * 200;
            gsap.fromTo(col,
              { y: movement },
              {
                y: -movement,
                ease: 'none',
                force3D: true,
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

      // Force refresh for iOS and dynamic content
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    };

    // Initialize animations after a short delay to ensure DOM is ready
    const timer = setTimeout(initAnimations, 100);

    // Force a few refreshes to handle late-loading content and iOS layout shifts
    const refreshDelays = [500, 1500, 3000];
    refreshDelays.forEach(delay => {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, delay);
    });

    // Handle Resize
    let resizeTimer: NodeJS.Timeout;
    let lastWidth = window.innerWidth;
    
    const handleResize = () => {
      if (isMobile && window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;

      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        initAnimations();
        ScrollTrigger.refresh();
      }, 250);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      if (lenis) lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
      splitInstances.forEach(instance => instance.revert());
      window.removeEventListener('resize', handleResize);
    };
  }, [pathname]); // Re-run on route change to fix the "missing sections" bug

  return null;
}

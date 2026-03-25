import React, { useRef, useEffect } from "react";
import gsap from "gsap";

type ChromaticLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export default function ChromaticLink({ href, children, className = "", ...props }: ChromaticLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const greenRef = useRef<HTMLSpanElement>(null);
  const blueRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  
  const mousePos = useRef({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const link = linkRef.current;
    if (!link) return;

    const isMobile = window.innerWidth < 768;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isMobile || isIOS) return;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const update = () => {
      // Calculate velocity
      velocity.current.x = mousePos.current.x - lastMousePos.current.x;
      velocity.current.y = mousePos.current.y - lastMousePos.current.y;
      
      lastMousePos.current = { ...mousePos.current };

      const isHovered = link.matches(":hover");

      if (isHovered) {
        const intensity = 0.4;
        const vx = velocity.current.x * intensity;
        const vy = velocity.current.y * intensity;

        // Chromatic displacement
        gsap.to(greenRef.current, {
          x: vx,
          y: vy,
          duration: 0.4,
          ease: "power2.out",
        });

        gsap.to(blueRef.current, {
          x: -vx,
          y: -vy,
          duration: 0.4,
          ease: "power2.out",
        });

        // Fluid distortion skew & scale
        const skewX = Math.min(Math.max(velocity.current.x * 0.4, -10), 10);
        const skewY = Math.min(Math.max(velocity.current.y * 0.1, -3), 3);
        
        gsap.to([textRef.current, greenRef.current, blueRef.current], {
          skewX: skewX,
          skewY: skewY,
          duration: 0.4,
          ease: "power2.out",
        });

        // Animate SVG filter scale based on velocity
        const speed = Math.sqrt(velocity.current.x ** 2 + velocity.current.y ** 2);
        const filterScale = Math.min(speed * 0.5, 20);
        const displacementMap = document.getElementById("displacement-map");
        if (displacementMap) {
          gsap.to(displacementMap, {
            attr: { scale: filterScale },
            duration: 0.3,
            ease: "power2.out"
          });
        }
      } else {
        gsap.to([greenRef.current, blueRef.current], {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: "elastic.out(1, 0.3)",
        });
        gsap.to([textRef.current, greenRef.current, blueRef.current], {
          skewX: 0,
          skewY: 0,
          duration: 0.8,
          ease: "elastic.out(1, 0.3)",
        });
        
        const displacementMap = document.getElementById("displacement-map");
        if (displacementMap) {
          gsap.to(displacementMap, {
            attr: { scale: 0 },
            duration: 0.8,
            ease: "power2.out"
          });
        }
      }

      rafId.current = requestAnimationFrame(update);
    };

    window.addEventListener("mousemove", onMouseMove);
    rafId.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <a
      ref={linkRef}
      href={href}
      className={`chromatic-link group relative inline-block ${className}`}
      style={{ filter: (typeof window !== 'undefined' && (window.innerWidth < 768 || /iPad|iPhone|iPod/.test(navigator.userAgent))) ? "none" : "url(#fluid-distort)" }}
      {...props}
    >
      <span ref={textRef} className="relative z-10 inline-flex items-center gap-[inherit] transition-opacity duration-200 group-hover:opacity-90">
        {children}
      </span>
      <span
        ref={greenRef}
        className="absolute inset-0 z-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 select-none inline-flex items-center gap-[inherit]"
        style={{ color: "#00a896", mixBlendMode: "screen" }}
      >
        {children}
      </span>
      <span
        ref={blueRef}
        className="absolute inset-0 z-0 pointer-events-none opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 select-none inline-flex items-center gap-[inherit]"
        style={{ color: "#0a192f", mixBlendMode: "screen" }}
      >
        {children}
      </span>
    </a>
  );
}

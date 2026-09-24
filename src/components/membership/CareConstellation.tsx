import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import type { AnchorKind, ConstellationAnchor, ConstellationController } from "./careConstellationEngine";
import {
  detectDeviceTier,
  prefersReducedMotion,
  usePrefersReducedMotion,
  whenIdleAfterLoad,
} from "./motionCapability";

export type { AnchorKind } from "./careConstellationEngine";

export interface ConstellationAnchorRef {
  ref: RefObject<HTMLElement | null>;
  // "silver" / "gold" for plan cards (tier colour + PMP green), "green" otherwise.
  kind: AnchorKind;
  // 1 for plan cards; lower for information cards so they stay subtler.
  weight: number;
}

interface CareConstellationProps {
  // Cards the particles may gather around. They share one bounded particle
  // pool; at most one card (or one same-row pair) is emphasised at a time.
  anchors?: readonly ConstellationAnchorRef[];
  // Opacity of the free-flowing field.
  intensity?: number;
  className?: string;
}

type Status = "pending" | "ready" | "fallback";

// Probe for the context here, before downloading three.js, and hand the same
// context to the engine. Software rasterisers are rejected (CSS fallback
// instead) unless `?swgl` is present in development, for headless previews.
function createWebGLContext(): { canvas: HTMLCanvasElement; gl: WebGL2RenderingContext } | null {
  const canvas = document.createElement("canvas");
  const allowSoftware = import.meta.env.DEV && new URLSearchParams(window.location.search).has("swgl");
  const gl = canvas.getContext("webgl2", {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: true,
    preserveDrawingBuffer: false,
    powerPreference: "low-power",
    failIfMajorPerformanceCaveat: !allowSoftware,
  });
  return gl ? { canvas, gl } : null;
}

function releaseContext(gl: WebGL2RenderingContext) {
  gl.getExtension("WEBGL_lose_context")?.loseContext();
}

// Light-theme CSS decoration shown until (or instead of) WebGL.
const glowStyle: CSSProperties = {
  backgroundImage: "radial-gradient(60% 45% at 50% 45%, rgba(0, 168, 150, 0.06), transparent 70%)",
};

const dotMask = "radial-gradient(ellipse 70% 60% at 50% 50%, #000 30%, transparent 80%)";
const dotStyle: CSSProperties = {
  backgroundImage: [
    "radial-gradient(circle, rgba(93, 110, 132, 0.22) 1px, transparent 1.6px)",
    "radial-gradient(circle, rgba(0, 168, 150, 0.22) 1px, transparent 1.6px)",
  ].join(", "),
  backgroundSize: "34px 34px, 55px 55px",
  backgroundPosition: "0 0, 17px 23px",
  WebkitMaskImage: dotMask,
  maskImage: dotMask,
};

// Decorative only. Place as the first child of a `relative isolate` section and
// keep the section's content positioned above it.
export default function CareConstellation({ anchors, intensity = 0.5, className = "" }: CareConstellationProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<ConstellationController | null>(null);
  const [status, setStatus] = useState<Status>("pending");
  const reducedMotion = usePrefersReducedMotion();

  // Latest props for the engine's asynchronous creation; declared before the
  // init effect so it is up to date when that effect runs.
  const initialOptions = useRef({ anchors, intensity });
  useEffect(() => {
    initialOptions.current = { anchors, intensity };
  });

  useEffect(() => {
    const layer = layerRef.current;
    const slot = slotRef.current;
    if (!layer || !slot) return;

    let cancelled = false;
    let inView = false;
    let cancelScheduled: (() => void) | null = null;

    const fail = () => {
      controllerRef.current = null;
      if (!cancelled) setStatus("fallback");
    };

    const start = () => {
      cancelScheduled = whenIdleAfterLoad(() => {
        const webgl = createWebGLContext();
        if (!webgl) return fail();

        import("./careConstellationEngine")
          .then(({ createCareConstellation }) => {
            if (cancelled) return releaseContext(webgl.gl);
            const opts = initialOptions.current;
            const controller = createCareConstellation({
              ...webgl,
              host: slot,
              tier: detectDeviceTier(),
              reducedMotion: prefersReducedMotion(),
              anchors: (opts.anchors ?? []).flatMap(({ ref, kind, weight }): ConstellationAnchor[] =>
                ref.current ? [{ el: ref.current, kind, weight }] : [],
              ),
              intensity: opts.intensity,
              onFailure: fail,
            });
            if (!controller) {
              releaseContext(webgl.gl);
              return fail();
            }
            controllerRef.current = controller;
            controller.setInView(inView);
            setStatus("ready");
          })
          .catch(() => {
            releaseContext(webgl.gl);
            fail();
          });
      });
    };

    // One observer both triggers the lazy load shortly before the section is
    // reached and pauses the render loop once it is well out of view.
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView && !cancelScheduled) start();
        controllerRef.current?.setInView(inView);
      },
      { rootMargin: "40% 0px 40% 0px" },
    );
    observer.observe(layer);

    return () => {
      cancelled = true;
      cancelScheduled?.();
      observer.disconnect();
      controllerRef.current?.dispose();
      controllerRef.current = null;
    };
  }, []);

  useEffect(() => {
    controllerRef.current?.setReducedMotion(reducedMotion);
  }, [reducedMotion, status]);

  useEffect(() => {
    controllerRef.current?.setIntensity(intensity);
  }, [intensity, status]);

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 select-none ${className}`}
    >
      <div className="sticky top-0 h-[min(100vh,100%)] w-full overflow-hidden supports-[height:100svh]:h-[min(100svh,100%)]">
        <div className="absolute inset-0" style={glowStyle} />
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${
            status === "ready" ? "opacity-0" : "opacity-100"
          }`}
          style={dotStyle}
        />
        <div ref={slotRef} className="absolute inset-0" />
      </div>
    </div>
  );
}

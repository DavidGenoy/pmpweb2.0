import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import type { ConstellationController, ProgressRange } from "./careConstellationEngine";
import type { ConstellationFormation } from "./constellationFormations";
import {
  detectDeviceTier,
  prefersReducedMotion,
  usePrefersReducedMotion,
  whenIdleAfterLoad,
} from "./motionCapability";

export type { ConstellationFormation } from "./constellationFormations";

interface CareConstellationProps {
  // Target formation (changes morph smoothly). Omit to morph with scroll progress.
  formation?: ConstellationFormation;
  // "traverse": 0 as the section enters the viewport, 1 as it leaves.
  // "contain": 0 when its top reaches the viewport top, 1 when its bottom reaches the bottom (pinned/sticky stages).
  range?: ProgressRange;
  // Element whose scroll position drives the morph; defaults to the parent section.
  progressTargetRef?: RefObject<HTMLElement | null>;
  // Silver and Gold card elements the "cards" formation outlines.
  anchorRefs?: readonly RefObject<HTMLElement | null>[];
  intensity?: number;
  // Formation shift as fractions of half the canvas width/height (+x right, +y up).
  offsetX?: number;
  offsetY?: number;
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
// give the section's content `relative z-10`.
export default function CareConstellation({
  formation,
  range = "traverse",
  progressTargetRef,
  anchorRefs,
  intensity = 1,
  offsetX = 0,
  offsetY = 0,
  className = "",
}: CareConstellationProps) {
  const layerRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<ConstellationController | null>(null);
  const [status, setStatus] = useState<Status>("pending");
  const reducedMotion = usePrefersReducedMotion();

  // Latest props for the engine's asynchronous creation; declared before the
  // init effect so it is up to date when that effect runs.
  const initialOptions = useRef({ formation, range, progressTargetRef, anchorRefs, intensity, offsetX, offsetY });
  useEffect(() => {
    initialOptions.current = { formation, range, progressTargetRef, anchorRefs, intensity, offsetX, offsetY };
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
              progressSource: opts.progressTargetRef?.current ?? layer,
              range: opts.range,
              tier: detectDeviceTier(),
              reducedMotion: prefersReducedMotion(),
              formation: opts.formation,
              anchors: (opts.anchorRefs ?? []).map((ref) => ref.current).filter((el): el is HTMLElement => !!el),
              intensity: opts.intensity,
              offsetX: opts.offsetX,
              offsetY: opts.offsetY,
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
    controllerRef.current?.setFormation(formation);
  }, [formation, status]);

  useEffect(() => {
    controllerRef.current?.setIntensity(intensity);
  }, [intensity, status]);

  useEffect(() => {
    controllerRef.current?.setOffset(offsetX, offsetY);
  }, [offsetX, offsetY, status]);

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

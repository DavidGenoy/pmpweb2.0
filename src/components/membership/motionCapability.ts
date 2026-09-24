import { useCallback, useSyncExternalStore } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const mql = window.matchMedia(REDUCED_MOTION_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReducedMotion, prefersReducedMotion, () => false);
}

// Re-renders only when the query's match state flips (e.g. crossing a breakpoint).
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

export type DeviceTier = "low" | "mid" | "high";

interface NavigatorHints {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
}

// Capability heuristics rather than user-agent sniffing: viewport size, input
// type, CPU cores, memory and Save-Data. Unknown values fall through to the
// viewport-based decision.
export function detectDeviceTier(): DeviceTier {
  const nav = navigator as Navigator & NavigatorHints;
  const width = window.innerWidth;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory;

  if (nav.connection?.saveData) return "low";
  if (cores <= 2 || (memory !== undefined && memory <= 2)) return "low";
  if (width < 640 || (coarse && width < 768)) return "low";
  if (width < 1024 || coarse || cores <= 4 || (memory !== undefined && memory <= 4)) return "mid";
  return "high";
}

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

// Runs `cb` after the window load event, during idle time where supported
// (Safari has no requestIdleCallback, so it falls back to a short timeout).
export function whenIdleAfterLoad(cb: () => void): () => void {
  const w = window as IdleWindow;
  let cancelled = false;
  let idleId: number | undefined;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const run = () => {
    if (!cancelled) cb();
  };
  const schedule = () => {
    if (cancelled) return;
    if (w.requestIdleCallback) idleId = w.requestIdleCallback(run, { timeout: 1500 });
    else timeoutId = setTimeout(run, 250);
  };

  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", schedule, { once: true });

  return () => {
    cancelled = true;
    window.removeEventListener("load", schedule);
    if (idleId !== undefined) w.cancelIdleCallback?.(idleId);
    if (timeoutId !== undefined) clearTimeout(timeoutId);
  };
}

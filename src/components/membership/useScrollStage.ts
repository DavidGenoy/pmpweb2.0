import { useEffect, useState, type RefObject } from "react";

// Returns the `data-stage` value of the block crossing the middle of the
// viewport. When two blocks overlap the band the later one in DOM order wins,
// and the last stage is kept while the band sits between blocks. State only
// changes when the stage changes, never per frame.
export function useScrollStage<T extends string>(rootRef: RefObject<HTMLElement | null>, initial: T): T {
  const [stage, setStage] = useState<T>(initial);

  useEffect(() => {
    const root: HTMLElement | null = rootRef.current;
    if (!root) return;
    const blocks = Array.from(root.querySelectorAll<HTMLElement>("[data-stage]"));
    const inBand = new Set<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inBand.add(entry.target);
          else inBand.delete(entry.target);
        }
        const current = blocks.filter((b) => inBand.has(b)).pop();
        if (current) setStage(current.dataset.stage as T);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    blocks.forEach((b) => observer.observe(b));
    return () => observer.disconnect();
  }, [rootRef]);

  return stage;
}

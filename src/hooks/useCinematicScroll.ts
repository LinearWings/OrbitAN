"use client";

import { useEffect, useRef, useCallback } from "react";

interface CinematicKeyframe {
  opacity?: number;
  translateY?: number;
}

export interface CinematicConfig {
  enter?: CinematicKeyframe;
  exit?: CinematicKeyframe;
}

function easeOut(t: number) { return 1 - Math.pow(1 - t, 3); }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

export function useCinematicScroll(config: CinematicConfig) {
  const ref = useRef<HTMLElement>(null);
  const configRef = useRef(config);
  configRef.current = config;
  const cachedTop = useRef(0);
  const cachedHeight = useRef(0);

  const setRef = useCallback((el: HTMLElement | null) => {
    ref.current = el;
    if (el && !cachedHeight.current) {
      const rect = el.getBoundingClientRect();
      cachedTop.current = rect.top + window.scrollY;
      cachedHeight.current = rect.height;
    }
  }, []);

  useEffect(() => {
    let raf = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const el = ref.current;
      if (!el || !cachedHeight.current) return;

      // Use cached position to avoid feedback loop from transforms
      const top = cachedTop.current - window.scrollY;
      const h = cachedHeight.current;
      const vh = window.innerHeight;
      const bottom = top + h;

      if (bottom < -200 || top > vh + 200) return;

      const cfg = configRef.current;
      const enter = cfg.enter;
      const exit = cfg.exit;

      // Entering: starts when section peeks in, completes when section fills viewport.
      // Use min(vh, h) so tall sections finish within one viewport-height of scroll.
      let enterP = 0;
      if (enter && top < vh && bottom > 0) {
        enterP = Math.min(1, Math.max(0, (vh - top) / Math.min(vh, h)));
      }

      // Exiting
      let exitP = 0;
      if (exit && top < 0) {
        exitP = Math.min(1, -top / h);
      }

      let op = 1;
      let ty = 0;

      if (exitP > 0.01 && exit) {
        op = lerp(1, exit.opacity ?? 1, exitP);
        ty = lerp(0, exit.translateY ?? 0, exitP);
      } else if (enterP < 0.99 && enter) {
        const t = easeOut(enterP);
        op = lerp(enter.opacity ?? 0, 1, t);
        ty = lerp(enter.translateY ?? 0, 0, t);
      }

      el.style.opacity = op < 0.99 ? op.toFixed(3) : "";
      el.style.transform = ty ? `translateY(${ty.toFixed(1)}px)` : "";
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return { ref: setRef };
}

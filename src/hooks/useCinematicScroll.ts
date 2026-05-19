"use client";

import { useEffect, useRef, useCallback } from "react";

interface CinematicKeyframe {
  opacity?: number;
  translateY?: number;
  scale?: number;
}

export interface CinematicConfig {
  enter?: CinematicKeyframe;
  exit?: CinematicKeyframe;
}

function easeOut(t: number) { return 1 - Math.pow(1 - t, 3); }
function easeIn(t: number) { return t * t * t; }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

/**
 * Gets the bounding rect of the actual content area (first child → last child),
 * excluding the section's padding. Falls back to the section rect if no children.
 */
function getContentRect(el: HTMLElement): DOMRect {
  const first = el.firstElementChild as HTMLElement | null;
  const last = el.lastElementChild as HTMLElement | null;
  if (!first || !last) return el.getBoundingClientRect();
  const top = first.getBoundingClientRect().top;
  const bottom = last.getBoundingClientRect().bottom;
  const rect = el.getBoundingClientRect();
  return new DOMRect(rect.left, top, rect.width, bottom - top);
}

export function useCinematicScroll(config: CinematicConfig) {
  const ref = useRef<HTMLElement>(null);
  const configRef = useRef(config);
  configRef.current = config;
  const heightRef = useRef(0);

  const setRef = useCallback((el: HTMLElement | null) => {
    ref.current = el;
    if (el && !heightRef.current) {
      const contentRect = getContentRect(el);
      heightRef.current = contentRect.height;
    }
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = mq.matches;
    const onChange = () => { reducedMotion = mq.matches; };
    mq.addEventListener("change", onChange);

    let raf = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const el = ref.current;
      if (!el) return;

      const rect = getContentRect(el);
      const vh = window.innerHeight;

      if (rect.bottom < -200 || rect.top > vh + 200) return;

      if (reducedMotion) {
        el.style.opacity = "";
        el.style.transform = "";
        return;
      }

      const cfg = configRef.current;
      const enter = cfg.enter;
      const exit = cfg.exit;

      // Entering: starts when content first peeks in, gradual over content height
      let enterP = 0;
      if (enter && rect.top < vh && rect.bottom > 0) {
        enterP = Math.min(1, (vh - rect.top) / Math.min(vh, heightRef.current));
      }

      // Exiting: fade out as section scrolls away
      let exitP = 0;
      if (exit && rect.top < 0) {
        exitP = Math.min(1, -rect.top / heightRef.current);
      }

      let op = 1;
      let ty = 0;
      let s = 1;

      if (exitP > 0.01 && exit) {
        const t = easeIn(exitP);
        op = lerp(1, exit.opacity ?? 1, t);
        ty = lerp(0, exit.translateY ?? 0, t);
        s = lerp(1, exit.scale ?? 1, t);
      } else if (enterP < 0.99 && enter) {
        const t = easeOut(enterP);
        op = lerp(enter.opacity ?? 0, 1, t);
        ty = lerp(enter.translateY ?? 0, 0, t);
        s = lerp(enter.scale ?? 1, 1, t);
      }

      const parts: string[] = [];
      if (ty) parts.push(`translateY(${ty.toFixed(1)}px)`);
      if (s !== 1) parts.push(`scale(${s.toFixed(4)})`);

      el.style.opacity = op < 0.99 ? op.toFixed(3) : "";
      el.style.transform = parts.length ? parts.join(" ") : "";
    };

    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); mq.removeEventListener("change", onChange); };
  }, []);

  return { ref: setRef };
}

"use client";

import { useRef, useCallback, useEffect } from "react";

/**
 * Cinematic scroll hook — position-based reveal.
 * Uses IntersectionObserver to detect viewport entry and apply
 * scroll-progress-based opacity/transform transitions.
 */

export function useCinematicScroll(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const ratio = entry.intersectionRatio;
            const opacity = Math.min(1, ratio / threshold);
            const translateY = (1 - opacity) * 30;
            el.style.opacity = String(opacity);
            el.style.transform = `translateY(${translateY}px)`;
            el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
          } else {
            el.style.opacity = "0";
            el.style.transform = "translateY(40px)";
            el.style.transition = "none";
          }
        }
      },
      { threshold: Array.from({ length: 20 }, (_, i) => i / 20) }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const setRef = useCallback((el: HTMLElement | null) => {
    ref.current = el;
  }, []);

  return { ref: setRef };
}

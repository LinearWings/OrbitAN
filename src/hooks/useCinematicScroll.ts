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
            const translateY = (1 - opacity) * 40;
            const scale = 0.98 + opacity * 0.02;
            el.style.opacity = String(opacity);
            el.style.transform = `translateY(${translateY}px) scale(${scale})`;
            el.style.transition = "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
          } else {
            el.style.opacity = "0";
            el.style.transform = "translateY(50px) scale(0.97)";
            el.style.transition = "opacity 0.4s ease-in, transform 0.4s ease-in";
          }
        }
      },
      { threshold: Array.from({ length: 30 }, (_, i) => i / 30) }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const setRef = useCallback((el: HTMLElement | null) => {
    ref.current = el;
  }, []);

  return { ref: setRef };
}

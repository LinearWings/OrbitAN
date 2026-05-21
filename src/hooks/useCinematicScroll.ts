"use client";

import { useRef, useCallback, useEffect } from "react";

/**
 * Cinematic scroll hook — position-based reveal with smooth enter/exit transitions.
 * Uses IntersectionObserver for viewport detection. Thresholds map directly
 * from the element's position relative to the viewport, not from time.
 *
 * Enter: fades in + slides up as element enters viewport
 * Exit: fades out + slides down as element leaves viewport
 */
export function useCinematicScroll(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null);
  const hasEnteredRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If already in view on mount, show immediately
    const initialRect = el.getBoundingClientRect();
    if (initialRect.top < window.innerHeight && initialRect.bottom > 0) {
      el.style.opacity = "1";
      el.style.transform = "none";
      el.style.transition = "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
      hasEnteredRef.current = true;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const ratio = Math.min(1, entry.intersectionRatio / threshold);
            const progress = Math.min(1, ratio);
            const opacity = 0.15 + progress * 0.85;
            const translateY = (1 - progress) * 40;
            const scale = 0.97 + progress * 0.03;
            el.style.opacity = String(opacity);
            el.style.transform = `translateY(${translateY}px) scale(${scale})`;
            el.style.transition =
              "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)";
            hasEnteredRef.current = true;
          } else if (hasEnteredRef.current) {
            // Element has left viewport — fade out
            el.style.opacity = "0.08";
            el.style.transform = "translateY(50px) scale(0.96)";
            el.style.transition = "opacity 0.5s ease-in, transform 0.5s ease-in";
          }
        }
      },
      { threshold: Array.from({ length: 20 }, (_, i) => i / 20) },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const setRef = useCallback((el: HTMLElement | null) => {
    (ref as React.MutableRefObject<HTMLElement | null>).current = el;
  }, []);

  return { ref: setRef };
}

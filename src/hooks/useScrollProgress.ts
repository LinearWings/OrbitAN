"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Tracks scroll progress of a section relative to the viewport.
 * Returns 0→1 as the section enters and passes through the viewport.
 *
 * @param threshold - Optional threshold to trigger at (default: 0)
 * @returns { ref, progress, isVisible }
 */
export function useScrollProgress(threshold = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const sectionTop = rect.top;
    const sectionHeight = rect.height;

    // 0 when section top is at viewport bottom
    // 1 when section bottom is at viewport top
    const p = Math.max(
      0,
      Math.min(1, (viewportHeight - sectionTop) / (viewportHeight + sectionHeight))
    );
    setProgress(p);
    setIsVisible(sectionTop < viewportHeight && sectionTop + sectionHeight > 0);
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return { ref, progress, isVisible };
}

/**
 * Simple IntersectionObserver-based reveal hook.
 * Element becomes visible once it enters the viewport.
 */
export function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

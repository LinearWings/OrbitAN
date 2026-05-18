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

    // 0 when section top is at viewport top (pristine)
    // 1 when section has fully scrolled past
    const p = Math.max(0, Math.min(1, -sectionTop / sectionHeight));
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

/**
 * Returns normalized mouse position relative to viewport center.
 * x: -1 (left) to 1 (right), y: -1 (top) to 1 (bottom).
 * Updated via rAF, stored in ref to avoid re-renders.
 */
export function useMousePosition() {
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let raf: number;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        pos.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
        pos.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  return pos;
}

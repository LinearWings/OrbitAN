"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Tracks scroll progress of a section relative to the viewport.
 * Returns 0→1 as the section enters and passes through the viewport.
 *
 * Caches the initial rect to avoid feedback loops when CSS transforms
 * change getBoundingClientRect() dimensions.
 */
export function useScrollProgress(threshold = 0) {
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const cachedTop = useRef(0);
  const cachedHeight = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (el && !cachedHeight.current) {
      const rect = el.getBoundingClientRect();
      cachedTop.current = rect.top + window.scrollY;
      cachedHeight.current = rect.height;
    }
  }, []);

  const handleScroll = useCallback(() => {
    const el = ref.current;
    if (!el || !cachedHeight.current) return;

    // Use cached position to avoid transform feedback loop
    const sectionTop = cachedTop.current - window.scrollY;
    const sectionHeight = cachedHeight.current;
    const viewportHeight = window.innerHeight;

    // Progress: 0 when section top first enters viewport bottom,
    // 1 when section fills the viewport. Use min(vh, h) so tall sections
    // complete within one viewport-height of scroll.
    const p = Math.max(0, Math.min(1, (viewportHeight - sectionTop) / Math.min(viewportHeight, sectionHeight)));
    setProgress(p);
    setIsVisible(sectionTop < viewportHeight && sectionTop + sectionHeight > 0);
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    const scrollEl = document.querySelector("[data-scroll-container]");
    if (scrollEl) scrollEl.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollEl) scrollEl.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return { ref, progress, isVisible };
}

export function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

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

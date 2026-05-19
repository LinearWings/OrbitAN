"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Tracks scroll progress of a section relative to the viewport.
 * Returns 0→1 as the section enters and passes through the viewport.
 *
 * Caches the initial rect height to avoid feedback loops when CSS
 * transforms (from useCinematicScroll) change getBoundingClientRect().
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

export function useScrollProgress(threshold = 0) {
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const baseHeight = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (el && !baseHeight.current) {
      baseHeight.current = getContentRect(el).height;
    }
  }, []);

  const handleScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const rect = getContentRect(el);
    const viewportHeight = window.innerHeight;
    const sectionTop = rect.top;
    const sectionHeight = baseHeight.current || rect.height;

    // Progress: 0 when content first enters viewport bottom,
    // 1 when content fills the viewport. Clamped to 1 after.
    const p = Math.max(0, Math.min(1, (viewportHeight - sectionTop) / Math.min(viewportHeight, sectionHeight)));
    setProgress(p);
    setIsVisible(sectionTop < viewportHeight && sectionTop + sectionHeight > 0);
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Also listen on the actual scroll container (div[data-scroll-container])
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

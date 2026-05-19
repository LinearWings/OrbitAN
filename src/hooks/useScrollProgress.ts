"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Computes offsetTop relative to the document (unaffected by CSS transforms).
 */
function getDocumentOffsetTop(el: HTMLElement): number {
  let top = 0;
  let node: HTMLElement | null = el;
  while (node) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return top;
}

/**
 * Finds the nearest scrollable ancestor (overflow: auto|scroll).
 */
function getScrollParent(el: HTMLElement): HTMLElement | null {
  let parent = el.parentElement;
  while (parent) {
    const style = getComputedStyle(parent);
    if (/(auto|scroll)/.test(style.overflowY)) return parent;
    parent = parent.parentElement;
  }
  return null;
}

/**
 * Tracks scroll progress of a section relative to the viewport.
 * Returns 0→1 as the section enters and passes through the viewport.
 *
 * Uses offsetTop (untransformed) to avoid feedback loops when
 * CSS transforms are applied to the section element.
 */
export function useScrollProgress(threshold = 0) {
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const cachedHeight = useRef(0);
  const scrollParent = useRef<HTMLElement | null>(null);
  const docTop = useRef(0);

  // Cache untransformed layout info once on mount
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    cachedHeight.current = el.getBoundingClientRect().height;
    docTop.current = getDocumentOffsetTop(el);
    scrollParent.current = getScrollParent(el);
  }, []);

  const handleScroll = useCallback(() => {
    const el = ref.current;
    if (!el || !cachedHeight.current) return;

    const scrollTop = scrollParent.current
      ? scrollParent.current.scrollTop
      : window.scrollY;
    const top = docTop.current - scrollTop;
    const vh = window.innerHeight;
    const h = cachedHeight.current;

    const p = top > vh ? 1 : Math.max(0, Math.min(1, -top / h));
    setProgress(p);
    setIsVisible(top < vh && top + h > 0);
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Also listen on the scroll parent if it's not window
    const sp = scrollParent.current;
    if (sp) sp.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (sp) sp.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return { ref, progress, isVisible };
}

/**
 * Simple IntersectionObserver-based reveal hook.
 */
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

/**
 * Returns normalized mouse position relative to viewport center.
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

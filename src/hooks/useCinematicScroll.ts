"use client";

import { useRef, useCallback } from "react";

/**
 * Cinematic scroll hook — now a simple ref callback.
 * Sections are always visible; visual interest comes from
 * CSS ambient animations (particles, glows, grid shimmer).
 */

export function useCinematicScroll() {
  const ref = useRef<HTMLElement>(null);

  const setRef = useCallback((el: HTMLElement | null) => {
    ref.current = el;
  }, []);

  return { ref: setRef };
}

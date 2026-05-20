"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * Section tracking via IntersectionObserver.
 * CSS scroll-snap handles the actual snapping behavior.
 * This hook just detects which section is active for visual effects.
 */

interface CinematicWheelConfig {
  sectionIds: string[];
  onSectionChange?: (index: number) => void;
}

export function useCinematicWheel(config: CinematicWheelConfig) {
  const { sectionIds, onSectionChange } = config;
  const currentIndexRef = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
            const idx = sectionIds.indexOf(entry.target.id);
            if (idx >= 0 && idx !== currentIndexRef.current) {
              currentIndexRef.current = idx;
              onSectionChange?.(idx);
            }
          }
        }
      },
      { threshold: [0.4] }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds, onSectionChange]);

  const scrollToSection = useCallback(
    (index: number) => {
      const el = document.getElementById(sectionIds[index]);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    },
    [sectionIds]
  );

  return { scrollToSection };
}

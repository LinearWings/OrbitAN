"use client";

import { useEffect, useRef } from "react";

interface Position {
  x: number;
  y: number;
}

export default function OrbitalCursor() {
  // All mutable state lives in refs — no React re-renders needed for cursor movement
  const targetRef = useRef<Position>({ x: 0, y: 0 });
  const outerRef = useRef<Position>({ x: 0, y: 0 });
  const innerRef = useRef<Position>({ x: 0, y: 0 });
  const visibleRef = useRef(false);
  const rafRef = useRef(0);

  const outerElRef = useRef<HTMLDivElement | null>(null);
  const innerElRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      visibleRef.current = true;
    };
    const onMouseLeave = () => {
      visibleRef.current = false;
    };
    const onMouseEnter = () => {
      visibleRef.current = true;
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    // Magnetic follow synced to screen refresh — skip every other frame for 30fps smoothness
    const update = () => {
      const target = targetRef.current;
      const visible = visibleRef.current;

      outerRef.current = {
        x: outerRef.current.x + (target.x - outerRef.current.x) * 0.08,
        y: outerRef.current.y + (target.y - outerRef.current.y) * 0.08,
      };
      innerRef.current = {
        x: innerRef.current.x + (target.x - innerRef.current.x) * 0.15,
        y: innerRef.current.y + (target.y - innerRef.current.y) * 0.15,
      };

      const outer = outerElRef.current;
      const inner = innerElRef.current;
      const opacity = visible ? "1" : "0";

      if (outer) {
        outer.style.transform = `translate3d(${outerRef.current.x - 20}px, ${outerRef.current.y - 20}px, 0)`;
        outer.style.opacity = opacity;
      }
      if (inner) {
        inner.style.transform = `translate3d(${innerRef.current.x - 4}px, ${innerRef.current.y - 4}px, 0)`;
        inner.style.opacity = opacity;
      }

      rafRef.current = requestAnimationFrame(update);
    };
    rafRef.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      {/* Outer ring */}
      <div
        ref={outerElRef}
        className="pointer-events-none fixed z-[9999]"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: 40,
          height: 40,
          opacity: 0,
          willChange: "transform, opacity",
        }}
      >
        <div className="h-full w-full rounded-full border border-white/20 bg-white/[0.02]" />
      </div>
      {/* Inner dot */}
      <div
        ref={innerElRef}
        className="pointer-events-none fixed z-[9999]"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          width: 8,
          height: 8,
          opacity: 0,
          willChange: "transform, opacity",
        }}
      >
        <div className="h-full w-full rounded-full bg-white/80 shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
      </div>
    </>
  );
}

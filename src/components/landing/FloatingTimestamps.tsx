"use client";

import { useEffect, useRef, useCallback } from "react";

/* ── Deterministic time grid ── */
function seed(i: number, s: number): number {
  return ((i * 127 + s * 31 + 773) % 1000) / 1000;
}

interface Stamp {
  hhmm: string;
  opacity: number;
  size: number;   // rem
  color: string;  // CSS color
  weight: number;
  letterSpacing: number;
}

const ANCHOR_HOURS = new Set(["00:00", "06:00", "12:00", "18:00"]);

const GRID: Stamp[] = Array.from({ length: 96 }, (_, i) => {
  const h = Math.floor(seed(i, 1) * 24);
  const m = Math.floor(seed(i, 2) * 12) * 5;
  const hhmm = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

  const isAnchor = ANCHOR_HOURS.has(hhmm);

  // Anchor times — bright amber, larger
  // Regular — dim blue/violet gradient
  const r = seed(i, 3);
  const opacity = isAnchor
    ? 0.22 + r * 0.12
    : 0.04 + r * 0.08;

  const size = isAnchor
    ? 0.85 + r * 0.3
    : 0.55 + r * 0.35;

  const color = isAnchor
    ? `rgba(245,158,11,${opacity})`
    : r > 0.5
      ? `rgba(59,130,246,${opacity})`
      : `rgba(99,102,241,${opacity})`;

  return {
    hhmm,
    opacity,
    size,
    color,
    weight: isAnchor ? 500 : 300 + Math.floor(r * 200),
    letterSpacing: isAnchor ? 0.12 : 0.04 + r * 0.06,
  };
});

const COLS = 8;
const ROWS = 12;

export function FloatingTimestamps() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener("mousemove", handleMouseMove, { passive: true });

    const tick = () => {
      const g = gridRef.current;
      if (!g) { rafRef.current = requestAnimationFrame(tick); return; }
      const ox = (mouseRef.current.x - 0.5) * 8;
      const oy = (mouseRef.current.y - 0.5) * 8;
      g.style.transform = `translate(${ox}px, ${oy}px)`;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove]);

  return (
    <div ref={containerRef} className="l-fts" aria-hidden="true">
      <div
        ref={gridRef}
        className="l-fts-grid"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
          width: "110%",
          height: "110%",
          margin: "-5%",
          transition: "transform 0.15s linear",
        }}
      >
        {GRID.map((s, i) => (
          <span
            key={i}
            className="l-fts-cell"
            style={{
              fontSize: `${s.size}rem`,
              color: s.color,
              fontWeight: s.weight,
              letterSpacing: `${s.letterSpacing}em`,
              opacity: s.opacity,
            }}
          >
            {s.hhmm}
          </span>
        ))}
      </div>
    </div>
  );
}

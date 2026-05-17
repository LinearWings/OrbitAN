"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ── Deterministic base times ── */
function seed(i: number, s: number): number {
  return ((i * 127 + s * 31 + 773) % 1000) / 1000;
}

interface Cell {
  hh: string;
  mm: string;
  baseOpacity: number;
  color: string;
  size: number;
  weight: number;
}

const COLS = 12;
const ROWS = 16;
const TOTAL = COLS * ROWS; // 192

const ANCHOR_HOURS = new Set(["00", "06", "12", "18"]);

const CELLS: Cell[] = Array.from({ length: TOTAL }, (_, i) => {
  const h = Math.floor(seed(i, 1) * 24);
  const m = Math.floor(seed(i, 2) * 12) * 5;
  const hh = String(h).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  const isAnchor = ANCHOR_HOURS.has(hh);
  const r = seed(i, 3);

  const baseOpacity = isAnchor ? 0.2 + r * 0.1 : 0.06 + r * 0.08;
  const size = isAnchor ? 0.75 + r * 0.25 : 0.52 + r * 0.28;
  const color = isAnchor
    ? `rgba(245,158,11,${baseOpacity.toFixed(3)})`
    : r > 0.5
      ? `rgba(59,130,246,${baseOpacity.toFixed(3)})`
      : `rgba(139,92,246,${baseOpacity.toFixed(3)})`;

  return {
    hh,
    mm,
    baseOpacity,
    color,
    size,
    weight: isAnchor ? 500 : 280 + Math.floor(r * 220),
  };
});

export function FloatingTimestamps() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const [ss, setSs] = useState(() => String(new Date().getSeconds()).padStart(2, "0"));

  // Live seconds
  useEffect(() => {
    const iv = setInterval(() => {
      setSs(String(new Date().getSeconds()).padStart(2, "0"));
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  // Mouse parallax
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
      const ox = (mouseRef.current.x - 0.5) * 4;
      const oy = (mouseRef.current.y - 0.5) * 4;
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
          width: "104%",
          height: "104%",
          margin: "-2%",
          transition: "transform 0.15s linear",
        }}
      >
        {CELLS.map((cell, i) => (
          <span
            key={i}
            className="l-fts-cell"
            style={{
              fontSize: `${cell.size}rem`,
              color: cell.color,
              fontWeight: cell.weight,
            }}
            data-anchor={ANCHOR_HOURS.has(cell.hh) ? "true" : undefined}
          >
            {cell.hh}:{cell.mm}:{ss}
          </span>
        ))}
      </div>
    </div>
  );
}

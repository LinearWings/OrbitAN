"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";

function seed(i: number, s: number): number {
  return ((i * 127 + s * 31 + 773) % 1000) / 1000;
}

const COLS = 16;
const ROWS = 20;
const TOTAL = COLS * ROWS;
const ANCHOR_HOURS = new Set(["00", "06", "12", "18"]);

interface CellData {
  hh: string;
  mm: string;
  color: string;
  size: number;
  weight: number;
  isAnchor: boolean;
}

const CELLS: CellData[] = Array.from({ length: TOTAL }, (_, i) => {
  const h = Math.floor(seed(i, 1) * 24);
  const m = Math.floor(seed(i, 2) * 12) * 5;
  const hh = String(h).padStart(2, "0");
  const mm = String(m).padStart(2, "0");
  const isAnchor = ANCHOR_HOURS.has(hh);
  const r = seed(i, 3);
  const alpha = isAnchor ? 0.30 + r * 0.14 : 0.09 + r * 0.10;
  const size = isAnchor ? 0.62 + r * 0.2 : 0.40 + r * 0.22;
  const color = isAnchor
    ? `rgba(245,158,11,${alpha.toFixed(3)})`
    : r > 0.5
      ? `rgba(59,130,246,${alpha.toFixed(3)})`
      : `rgba(139,92,246,${alpha.toFixed(3)})`;
  return { hh, mm, color, size, weight: isAnchor ? 500 : 300 + Math.floor(r * 200), isAnchor };
});

/* ── Compute neighbor indices (up to distance 2) ── */
function getNeighbors(idx: number, cols: number, rows: number, dist: number): number[] {
  const row = Math.floor(idx / cols);
  const col = idx % cols;
  const result: number[] = [];
  for (let dr = -dist; dr <= dist; dr++) {
    for (let dc = -dist; dc <= dist; dc++) {
      if (dr === 0 && dc === 0) continue;
      const r = row + dr;
      const c = col + dc;
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        result.push(r * cols + c);
      }
    }
  }
  return result;
}

// Precompute neighbor maps for distance 1 and 2
const NEIGHBORS_D1: number[][] = Array.from({ length: TOTAL }, (_, i) => getNeighbors(i, COLS, ROWS, 1));
const NEIGHBORS_D2: number[][] = Array.from({ length: TOTAL }, (_, i) => getNeighbors(i, COLS, ROWS, 2));

interface Props { logoRef: React.RefObject<HTMLDivElement | null>; }

export function FloatingTimestamps({ logoRef }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const [ss, setSs] = useState(() => String(new Date().getSeconds()).padStart(2, "0"));
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const hoveredRef = useRef<number | null>(null);
  const glowCellsRef = useRef<Set<number>>(new Set());

  // Live seconds
  useEffect(() => {
    const iv = setInterval(() => setSs(String(new Date().getSeconds()).padStart(2, "0")), 1000);
    return () => clearInterval(iv);
  }, []);

  // Dynamically compute mask to clear logo bbox from timestamp matrix
  useEffect(() => {
    const logo = logoRef.current;
    const grid = gridRef.current;
    if (!logo || !grid) return;

    const update = () => {
      const r = logo.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const left = (r.left / vw) * 100;
      const top = (r.top / vh) * 100;
      const w = (r.width / vw) * 100;
      const h = (r.height / vh) * 100;
      const pad = 1.08;
      const cx = left + w / 2;
      const cy = top + h / 2;
      const rx = (w / 2) * pad;
      const ry = (h / 2) * pad;
      const mask = `radial-gradient(ellipse ${rx}% ${ry}% at ${cx}% ${cy}%, transparent 0%, transparent 75%, #000 100%)`;
      grid.style.maskImage = mask;
      grid.style.webkitMaskImage = mask;
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(logo);
    window.addEventListener("resize", update);
    return () => { ro.disconnect(); window.removeEventListener("resize", update); };
  }, [logoRef]);

  // Mouse parallax
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mouseRef.current = { x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height };

    // Detect which cell is under cursor
    const g = gridRef.current;
    if (!g) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const col = Math.floor(x * COLS);
    const row = Math.floor(y * ROWS);
    if (col >= 0 && col < COLS && row >= 0 && row < ROWS) {
      const idx = row * COLS + col;
      if (hoveredRef.current !== idx) {
        hoveredRef.current = idx;
        setHoveredIdx(idx);
      }
    } else if (hoveredRef.current !== null) {
      hoveredRef.current = null;
      setHoveredIdx(null);
    }
  }, []);

  // Apply glow classes to neighbors
  useEffect(() => {
    // Clear all glows
    for (const ci of glowCellsRef.current) {
      const el = cellRefs.current[ci];
      if (el) {
        el.style.removeProperty('--glow');
        el.classList.remove('l-fts-near', 'l-fts-far');
      }
    }
    glowCellsRef.current.clear();

    if (hoveredIdx === null) return;

    // Hovered cell
    const hEl = cellRefs.current[hoveredIdx];
    if (hEl) {
      hEl.style.setProperty('--glow', '1');
      hEl.classList.add('l-fts-hover');
      glowCellsRef.current.add(hoveredIdx);
    }

    // Distance-1 neighbors
    for (const ni of NEIGHBORS_D1[hoveredIdx]) {
      const el = cellRefs.current[ni];
      if (el) {
        el.style.setProperty('--glow', '0.35');
        el.classList.add('l-fts-near');
        glowCellsRef.current.add(ni);
      }
    }

    // Distance-2 neighbors (only those not already in D1)
    const d1Set = new Set(NEIGHBORS_D1[hoveredIdx]);
    for (const ni of NEIGHBORS_D2[hoveredIdx]) {
      if (d1Set.has(ni)) continue;
      const el = cellRefs.current[ni];
      if (el) {
        el.style.setProperty('--glow', '0.12');
        el.classList.add('l-fts-far');
        glowCellsRef.current.add(ni);
      }
    }
  }, [hoveredIdx]);

  // Cleanup classes on unmount
  useEffect(() => {
    const refs = cellRefs.current;
    return () => {
      for (const el of refs) {
        if (el) {
          el.style.removeProperty('--glow');
          el.classList.remove('l-fts-hover', 'l-fts-near', 'l-fts-far');
        }
      }
    };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("mousemove", handleMouseMove, { passive: true });
    const tick = () => {
      const g = gridRef.current;
      if (!g) { rafRef.current = requestAnimationFrame(tick); return; }
      const ox = (mouseRef.current.x - 0.5) * 3;
      const oy = (mouseRef.current.y - 0.5) * 3;
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
          width: "106%", height: "106%", margin: "-3%",
          transition: "transform 0.15s linear",
        }}
      >
        {CELLS.map((cell, i) => (
          <span
            key={i}
            ref={(el) => { cellRefs.current[i] = el; }}
            className="l-fts-cell"
            style={{
              fontSize: `${cell.size}rem`,
              color: cell.color,
              fontWeight: cell.weight,
            }}
            data-anchor={cell.isAnchor ? "true" : undefined}
          >
            {cell.hh}:{cell.mm}:{ss}
          </span>
        ))}
      </div>
    </div>
  );
}

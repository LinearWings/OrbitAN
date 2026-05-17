"use client";

import { useEffect, useRef, useCallback } from "react";

/* ── Deterministic timestamp seeds ── */
function seedTime(index: number): { hhmm: string; x: number; y: number; dur: number; delay: number; drift: number; dir: number } {
  // Simple multiplicative hash for pseudo-random but deterministic values
  const hash = (i: number, s: number) => ((i * 127 + s * 31 + 773) % 1000) / 1000;

  const h = Math.floor(hash(index, 1) * 24);
  const m = Math.floor(hash(index, 2) * 12) * 5; // multiples of 5 for cleaner times
  const hhmm = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

  return {
    hhmm,
    x: hash(index, 3) * 94 + 3,     // 3%–97%
    y: hash(index, 4) * 100,         // 0%–100%
    dur: hash(index, 5) * 20 + 15,   // 15–35s base (layer adjusts)
    delay: hash(index, 6) * 10,      // 0–10s
    drift: hash(index, 7) * 20 - 10, // −10% to +10% X drift
    dir: hash(index, 8) > 0.5 ? 1 : -1, // float up or down
  };
}

/* ── Layer config ── */
interface LayerConfig {
  count: number;
  cls: string;       // CSS class suffix
  parallax: number;  // mouse parallax multiplier
  durationMul: number; // duration multiplier
}

const LAYERS: LayerConfig[] = [
  { count: 12, cls: "l-fts-deep", parallax: 0.08, durationMul: 2.5 },
  { count: 20, cls: "l-fts-mid",  parallax: 0.2,  durationMul: 1.5 },
  { count: 28, cls: "l-fts-top",  parallax: 0.45, durationMul: 1.0 },
];

let globalIndex = 0;
const TIMESTAMPS = LAYERS.map((layer) => {
  const stamps = [];
  for (let i = 0; i < layer.count; i++) {
    stamps.push({ ...seedTime(globalIndex), layerCls: layer.cls, parallax: layer.parallax, durationMul: layer.durationMul });
    globalIndex++;
  }
  return stamps;
});

/* ── Component ── */
export function FloatingTimestamps() {
  const containerRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<(HTMLDivElement | null)[]>([null, null, null]);
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
      const { x, y } = mouseRef.current;
      const layers = layersRef.current;
      for (let i = 0; i < LAYERS.length; i++) {
        const l = layers[i];
        if (!l) continue;
        const p = LAYERS[i].parallax;
        const ox = (x - 0.5) * p * 30;
        const oy = (y - 0.5) * p * 30;
        l.style.transform = `translate(${ox}px, ${oy}px)`;
      }
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
      {TIMESTAMPS.map((layerStamps, li) => (
        <div
          key={li}
          ref={(el) => { layersRef.current[li] = el; }}
          className={`l-fts-layer ${layerStamps[0].layerCls}`}
          style={{ transition: "transform 0.15s linear" }}
        >
          {layerStamps.map((s, i) => (
            <span
              key={i}
              className={`l-fts-num ${s.layerCls}`}
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                animationDuration: `${s.dur * s.durationMul}s`,
                animationDelay: `${-s.delay}s`,
                ["--drift" as string]: `${s.drift}%`,
                animationName: s.dir === 1 ? "l-fts-float-up" : "l-fts-float-down",
              }}
            >
              {s.hhmm}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

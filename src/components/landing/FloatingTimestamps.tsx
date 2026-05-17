"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ── Deterministic seeded timestamps per layer ── */
function seed(index: number, salt: number): number {
  return ((index * 127 + salt * 31 + 773) % 1000) / 1000;
}

function makeStamp(index: number) {
  const h = Math.floor(seed(index, 1) * 24);
  const m = Math.floor(seed(index, 2) * 12) * 5;
  return {
    hhmm: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
    x: seed(index, 3) * 92 + 4,
    y: seed(index, 4) * 96 + 2,
    dur: seed(index, 5) * 20 + 18,
    delay: seed(index, 6) * 12,
    drift: seed(index, 7) * 24 - 12,
    dir: seed(index, 8) > 0.5 ? 1 : -1,
  };
}

/* ── Three depth-of-field layers ── */
const BOKEH = Array.from({ length: 10 }, (_, i) => makeStamp(i));
const MIDFIELD = Array.from({ length: 16 }, (_, i) => makeStamp(i + 30));
const FOREGROUND = Array.from({ length: 22 }, (_, i) => makeStamp(i + 60));

export function FloatingTimestamps() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const bokehRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const foreRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  // Live clock for hero timestamp
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const iv = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

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
      const ox = (x - 0.5);
      const oy = (y - 0.5);

      // Each layer responds at different intensity — depth-of-field parallax
      const layers: [React.RefObject<HTMLDivElement | null>, number][] = [
        [bokehRef, 0.06],
        [midRef, 0.15],
        [foreRef, 0.35],
        [heroRef, 0.12],
      ];

      for (const [ref, p] of layers) {
        const l = ref.current;
        if (!l) continue;
        l.style.transform = `translate(${ox * p * 40}px, ${oy * p * 40}px)`;
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
      {/* ── Layer 0: Bokeh — deep background, heavily blurred ── */}
      <div ref={bokehRef} className="l-fts-layer" style={{ transition: "transform 0.2s linear" }}>
        {BOKEH.map((s, i) => (
          <span
            key={i}
            className="l-fts-num l-fts-bokeh"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              animationDuration: `${s.dur * 2.2}s`,
              animationDelay: `${-s.delay}s`,
              ["--drift" as string]: `${s.drift}%`,
              animationName: s.dir === 1 ? "l-fts-float-up" : "l-fts-float-down",
            }}
          >
            {s.hhmm}
          </span>
        ))}
      </div>

      {/* ── Layer 1: Mid-field — slight blur, medium scale ── */}
      <div ref={midRef} className="l-fts-layer" style={{ transition: "transform 0.15s linear" }}>
        {MIDFIELD.map((s, i) => (
          <span
            key={i}
            className="l-fts-num l-fts-mid"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              animationDuration: `${s.dur * 1.4}s`,
              animationDelay: `${-s.delay}s`,
              ["--drift" as string]: `${s.drift}%`,
              animationName: s.dir === 1 ? "l-fts-float-up" : "l-fts-float-down",
            }}
          >
            {s.hhmm}
          </span>
        ))}
      </div>

      {/* ── Layer 2: Foreground — sharp, fast, high contrast ── */}
      <div ref={foreRef} className="l-fts-layer" style={{ transition: "transform 0.1s linear" }}>
        {FOREGROUND.map((s, i) => (
          <span
            key={i}
            className="l-fts-num l-fts-fore"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              animationDuration: `${s.dur}s`,
              animationDelay: `${-s.delay}s`,
              ["--drift" as string]: `${s.drift}%`,
              animationName: s.dir === 1 ? "l-fts-float-up" : "l-fts-float-down",
            }}
          >
            {s.hhmm}
          </span>
        ))}
      </div>

      {/* ── HERO: live clock — razor-sharp, chromatic aberration, glass ── */}
      <div ref={heroRef} className="l-fts-hero-wrap" style={{ transition: "transform 0.2s linear" }}>
        {/* Chromatic aberration ghosts */}
        <span className="l-fts-hero l-fts-hero-ca-r" aria-hidden="true">{hh}:{mm}</span>
        <span className="l-fts-hero l-fts-hero-ca-b" aria-hidden="true">{hh}:{mm}</span>
        {/* Main text */}
        <span className="l-fts-hero l-fts-hero-main">
          {hh}<span className="l-fts-hero-colon">:</span>{mm}
        </span>
        {/* Seconds ring */}
        <span className="l-fts-hero-sec">{ss}</span>
      </div>
    </div>
  );
}

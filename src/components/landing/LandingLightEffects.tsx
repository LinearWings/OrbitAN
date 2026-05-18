"use client";

import { useEffect, useRef } from "react";

/* ── Star field data — generated once at module level ── */
const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  left: `${(i * 17 + 7) % 100}%`,
  top: `${(i * 23 + 13) % 100}%`,
  size: [1, 1.5, 2][i % 3],
  opacity: 0.15 + (i % 5) * 0.1,
  duration: 3 + (i % 6),
  delay: (i * 0.37) % 5,
  color:
    i % 7 === 0
      ? "rgba(245,158,11,"
      : i % 5 === 0
        ? "rgba(59,130,246,"
        : "rgba(255,255,255,",
}));

/* ── Dust particle data ── */
const DUST = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  left: `${(i * 29 + 5) % 100}%`,
  size: 1 + (i % 3),
  duration: 15 + (i % 4) * 5,
  delay: (i * 1.2) % 8,
  drift: (i % 2 === 0 ? 1 : -1) * (20 + (i % 5) * 15),
  opacity: 0.08 + (i % 4) * 0.04,
}));

export function LandingLightEffects() {
  const spotRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const dustRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const spot = spotRef.current;
    const stars = starsRef.current;
    const dust = dustRef.current;
    if (!spot) return;

    let raf: number;
    let shown = false;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (stars) stars.style.transform = `translateY(${y * 0.03}px)`;
        if (dust) dust.style.transform = `translateY(${y * 0.08}px)`;
      });
    };

    const onMove = (e: MouseEvent) => {
      if (!shown) {
        spot.classList.add("l-spotlight-visible");
        shown = true;
      }
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        spot.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200 + y * 0.05}px)`;
        if (stars) stars.style.transform = `translateY(${y * 0.03}px)`;
        if (dust) dust.style.transform = `translateY(${y * 0.08}px)`;
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* Star field — deepest layer, slowest parallax */}
      <div className="l-stars" ref={starsRef} aria-hidden="true">
        {STARS.map((s) => (
          <div
            key={s.id}
            className="l-star"
            style={
              {
                left: s.left,
                top: s.top,
                width: s.size,
                height: s.size,
                animationDuration: `${s.duration}s`,
                animationDelay: `${s.delay}s`,
                "--star-color": s.color,
                "--star-opacity": s.opacity,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Mouse spotlight — mid layer */}
      <div className="l-spotlight" ref={spotRef} aria-hidden="true" />

      {/* Dust particles — closest layer, fastest parallax */}
      <div className="l-dust" ref={dustRef} aria-hidden="true">
        {DUST.map((d) => (
          <div
            key={d.id}
            className="l-dust-p"
            style={
              {
                left: d.left,
                width: d.size,
                height: d.size,
                animationDuration: `${d.duration}s`,
                animationDelay: `${d.delay}s`,
                "--dust-drift": `${d.drift}px`,
                opacity: d.opacity,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </>
  );
}

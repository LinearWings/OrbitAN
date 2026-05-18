"use client";

import { useEffect, useRef } from "react";

const STARS = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  left: `${(i * 17 + 7) % 100}%`,
  top: `${(i * 23 + 13) % 100}%`,
  size: [1, 1.5, 2][i % 3],
  baseOpacity: 0.15 + (i % 5) * 0.1,
  duration: 3 + (i % 6),
  delay: (i * 0.37) % 5,
  hue: i % 7 === 0 ? "amber" : i % 5 === 0 ? "blue" : "white",
}));

const DUST = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  left: `${(i * 29 + 5) % 100}%`,
  size: 1 + (i % 3),
  duration: 15 + (i % 4) * 5,
  delay: (i * 1.2) % 8,
  drift: (i % 2 === 0 ? 1 : -1) * (20 + (i % 5) * 15),
  opacity: 0.08 + (i % 4) * 0.04,
}));

const SPOTLIGHT_COLORS = [
  "rgba(59,130,246,.06)",   // Hero — blue-white
  "rgba(59,130,246,.08)",   // Features — blue
  "rgba(245,158,11,.06)",   // Methods — amber
  "rgba(99,102,241,.06)",   // Focus — violet
  "rgba(59,130,246,.05)",   // Keyboard — blue
  "rgba(245,158,11,.08)",   // CTA — amber
];

interface Props {
  sectionIndex: number;
}

export function LandingLightEffects({ sectionIndex }: Props) {
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

    const update = (mx: number, my: number) => {
      const y = window.scrollY;
      if (stars) stars.style.transform = `translate(${mx * 15}px, ${y * 0.03 + my * 15}px)`;
      if (dust) dust.style.transform = `translate(${mx * 40}px, ${y * 0.08 + my * 40}px)`;
      spot.style.transform = `translate(${mx * 60}px, ${my * 60}px)`;
    };

    const onMove = (e: MouseEvent) => {
      if (!shown) { spot.classList.add("l-spotlight-visible"); shown = true; }
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const mx = (e.clientX / window.innerWidth - 0.5) * 2;
        const my = (e.clientY / window.innerHeight - 0.5) * 2;
        update(mx, my);
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => update(0, 0));
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Update spotlight color when section changes
  useEffect(() => {
    const spot = spotRef.current;
    if (!spot) return;
    const color = SPOTLIGHT_COLORS[sectionIndex] || SPOTLIGHT_COLORS[0];
    spot.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;
  }, [sectionIndex]);

  const starColor = (hue: string) =>
    hue === "amber" ? "rgba(245,158,11," : hue === "blue" ? "rgba(59,130,246," : "rgba(255,255,255,";

  return (
    <>
      <div className="l-stars" ref={starsRef} aria-hidden="true">
        {STARS.map((s) => (
          <div key={s.id} className="l-star" style={{
            left: s.left, top: s.top, width: s.size, height: s.size,
            animationDuration: `${s.duration}s`, animationDelay: `${s.delay}s`,
            "--star-color": starColor(s.hue), "--star-opacity": s.baseOpacity,
          } as React.CSSProperties} />
        ))}
      </div>
      <div className="l-spotlight" ref={spotRef} aria-hidden="true" />
      <div className="l-dust" ref={dustRef} aria-hidden="true">
        {DUST.map((d) => (
          <div key={d.id} className="l-dust-p" style={{
            left: d.left, width: d.size, height: d.size,
            animationDuration: `${d.duration}s`, animationDelay: `${d.delay}s`,
            "--dust-drift": `${d.drift}px`, opacity: d.opacity,
          } as React.CSSProperties} />
        ))}
      </div>
    </>
  );
}

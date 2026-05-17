"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";
import { useReveal } from "@/hooks/useScrollProgress";
import { FloatingTimestamps } from "./FloatingTimestamps";
import { ScrollIndicator } from "./ScrollIndicator";

/* ── Orbital constellation: each character is a celestial body ── */
interface Glyph {
  char: string;
  x: string;   // % from left
  y: string;   // % from top
  size: string; // clamp()
  opacity: number;
  weight: number;
  rotate?: number; // deg
}

const CN_GLYPHS: Glyph[] = [
  // "轨" — MASSIVE anchor, top-left bleeding out, watermark scale
  { char: "轨", x: "-3%", y: "-5%", size: "clamp(8rem,20vw,18rem)", opacity: 0.06, weight: 700, rotate: -8 },
  // Primary constellation
  { char: "划", x: "8%",  y: "18%", size: "clamp(2.5rem,5vw,4.5rem)", opacity: 0.55, weight: 600 },
  { char: "分", x: "48%", y: "6%",  size: "clamp(1.8rem,3.5vw,3.2rem)", opacity: 0.4, weight: 500 },
  { char: "秒", x: "72%", y: "22%", size: "clamp(2.2rem,4.5vw,4rem)", opacity: 0.5, weight: 600, rotate: 5 },
  { char: "注", x: "58%", y: "52%", size: "clamp(3rem,6vw,5.5rem)", opacity: 0.6, weight: 700 },
  { char: "定", x: "15%", y: "60%", size: "clamp(1.6rem,3vw,2.8rem)", opacity: 0.45, weight: 500, rotate: -4 },
  { char: "乾", x: "78%", y: "68%", size: "clamp(2rem,3.8vw,3.5rem)", opacity: 0.5, weight: 600 },
  { char: "坤", x: "22%", y: "82%", size: "clamp(2.8rem,5.5vw,5rem)", opacity: 0.55, weight: 700 },
];

const EN_GLYPHS: { text: string; x: string; y: string; size: string; opacity: number }[] = [
  { text: "TIME",   x: "5%",  y: "12%", size: "clamp(.7rem,1.5vw,1.2rem)", opacity: 0.25 },
  { text: "ORBITED",x: "50%", y: "18%", size: "clamp(.6rem,1.3vw,1rem)", opacity: 0.2 },
  { text: "FOCUS",  x: "65%", y: "60%", size: "clamp(.7rem,1.5vw,1.2rem)", opacity: 0.25 },
  { text: "DETER-", x: "10%", y: "70%", size: "clamp(.55rem,1.2vw,.9rem)", opacity: 0.18 },
  { text: "MINED",  x: "12%", y: "76%", size: "clamp(.55rem,1.2vw,.9rem)", opacity: 0.18 },
];

export function HeroSection() {
  const lang = useLanguage();
  const t = getT(lang);
  const { ref, visible } = useReveal(0.05);

  const isZh = lang === "zh";

  return (
    <section className="l-hero-v2" ref={ref}>
      <div className="l-hero-v2-canvas-wrap">
        <FloatingTimestamps />

        {/* ── Orbital Constellation Layout ── */}
        <div
          className="l-hero-stage"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.8s 0.1s",
          }}
        >
          {/* Chinese glyphs — scattered across the canvas */}
          {isZh
            ? CN_GLYPHS.map((g, i) => (
                <span
                  key={i}
                  className="l-hero-glyph"
                  style={{
                    left: g.x,
                    top: g.y,
                    fontSize: g.size,
                    opacity: g.opacity,
                    fontWeight: g.weight,
                    transform: g.rotate ? `rotate(${g.rotate}deg)` : undefined,
                    transition: `opacity 0.6s ${0.15 + i * 0.08}s, transform 0.7s ${0.15 + i * 0.08}s cubic-bezier(0.16,1,0.3,1)`,
                  }}
                >
                  {g.char}
                </span>
              ))
            : EN_GLYPHS.map((g, i) => (
                <span
                  key={i}
                  className="l-hero-glyph l-hero-glyph-en"
                  style={{
                    left: g.x,
                    top: g.y,
                    fontSize: g.size,
                    opacity: g.opacity,
                    transition: `opacity 0.6s ${0.15 + i * 0.08}s`,
                  }}
                >
                  {g.text}
                </span>
              ))}

          {/* OrbitAN Logo — precise anchor at strategic position */}
          <div
            className="l-hero-logo"
            style={{
              opacity: visible ? 1 : 0,
              transition: "opacity 0.5s 0.3s",
            }}
            aria-label="OrbitAN"
          >
            <span className="l-hero-logo-o">O</span>
            <span className="l-hero-logo-r">r</span>
            <span className="l-hero-logo-b">b</span>
            <span className="l-hero-logo-i">i</span>
            <span className="l-hero-logo-t">t</span>
            <span className="l-hero-logo-a">A</span>
            <span className="l-hero-logo-n">N</span>
          </div>

          {/* Description — minimal, bottom-left corner */}
          <p
            className="l-hero-desc"
            style={{
              opacity: visible ? 1 : 0,
              transition: "opacity 0.5s 0.55s",
            }}
          >
            {isZh
              ? "轨划分秒 · 注定乾坤"
              : "TIME ORBITED · FOCUS DETERMINED"}
          </p>

          {/* CTAs — bottom center */}
          <div
            className="l-hero-actions"
            style={{
              opacity: visible ? 1 : 0,
              transition: "opacity 0.5s 0.65s",
            }}
          >
            <Link href="/orbit" className="l-hero-btn l-hero-btn-primary">
              <span className="l-hero-btn-dot" />
              {t.hero_cta}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.3 8h11.4m0 0L8.7 3M13.7 8l-5 5" />
              </svg>
            </Link>
            <Link href="/docs" className="l-hero-btn l-hero-btn-secondary">
              {t.learn_more}
              <span className="l-hero-btn-dots" />
            </Link>
          </div>
        </div>

        <ScrollIndicator />
        {/* Time evaporation particles */}
        <div className="l-evap" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="l-evap-p" style={{
              left: `${15 + (i * 7) % 70}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${6 + (i % 3) * 2}s`,
            }} />
          ))}
        </div>
      </div>
    </section>
  );
}

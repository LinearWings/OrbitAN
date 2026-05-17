"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";
import { useReveal } from "@/hooks/useScrollProgress";
import { FloatingTimestamps } from "./FloatingTimestamps";
import { ScrollIndicator } from "./ScrollIndicator";
import { OrbitanLogo } from "./OrbitanLogo";

/* ── Bilateral staggered glyphs: left 4 + right 4, framing the logo ── */
interface Glyph {
  char: string;
  x: string;
  y: string;
  size: string;
  opacity: number;
  weight: number;
}

// Left column — "轨划分秒" (orbital time-planning)
const LEFT_GLYPHS: Glyph[] = [
  { char: "轨", x: "4%",  y: "16%", size: "clamp(2.6rem,5.2vw,4.8rem)", opacity: 0.56, weight: 700 },
  { char: "划", x: "7%",  y: "32%", size: "clamp(2rem,4vw,3.6rem)", opacity: 0.44, weight: 500 },
  { char: "分", x: "3%",  y: "50%", size: "clamp(2.9rem,5.8vw,5.2rem)", opacity: 0.62, weight: 700 },
  { char: "秒", x: "6%",  y: "68%", size: "clamp(1.8rem,3.6vw,3.2rem)", opacity: 0.40, weight: 500 },
];

// Right column — "注定乾坤" (focus determines everything)
const RIGHT_GLYPHS: Glyph[] = [
  { char: "注", x: "88%", y: "18%", size: "clamp(3rem,6vw,5.6rem)", opacity: 0.64, weight: 700 },
  { char: "定", x: "91%", y: "36%", size: "clamp(1.8rem,3.6vw,3rem)", opacity: 0.42, weight: 500 },
  { char: "乾", x: "87%", y: "54%", size: "clamp(2.3rem,4.6vw,4rem)", opacity: 0.52, weight: 600 },
  { char: "坤", x: "90%", y: "70%", size: "clamp(2.5rem,5vw,4.6rem)", opacity: 0.56, weight: 700 },
];

const EN_GLYPHS: { text: string; x: string; y: string; size: string; opacity: number }[] = [
  { text: "TIME",   x: "3%",  y: "12%", size: "clamp(.6rem,1.2vw,1rem)", opacity: 0.2 },
  { text: "ORBITED",x: "6%",  y: "28%", size: "clamp(.55rem,1vw,.85rem)", opacity: 0.16 },
  { text: "FOCUS",  x: "88%", y: "14%", size: "clamp(.6rem,1.2vw,1rem)", opacity: 0.2 },
  { text: "DETER-", x: "90%", y: "32%", size: "clamp(.5rem,1vw,.8rem)", opacity: 0.15 },
  { text: "MINED",  x: "87%", y: "64%", size: "clamp(.5rem,1vw,.8rem)", opacity: 0.15 },
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

        <div
          className="l-hero-stage"
          style={{ opacity: visible ? 1 : 0, transition: "opacity 0.8s 0.1s" }}
        >
          {/* ── Left column — 轨划分秒 ── */}
          {isZh
            ? LEFT_GLYPHS.map((g, i) => (
                <span
                  key={`l${i}`}
                  className="l-hero-glyph"
                  style={{
                    left: g.x, top: g.y, fontSize: g.size,
                    opacity: g.opacity, fontWeight: g.weight,
                    transition: `opacity 0.6s ${0.1 + i * 0.1}s, transform 0.7s ${0.1 + i * 0.1}s cubic-bezier(0.16,1,0.3,1)`,
                  }}
                >
                  {g.char}
                </span>
              ))
            : null}

          {/* ── Right column — 注定乾坤 ── */}
          {isZh
            ? RIGHT_GLYPHS.map((g, i) => (
                <span
                  key={`r${i}`}
                  className="l-hero-glyph"
                  style={{
                    left: g.x, top: g.y, fontSize: g.size,
                    opacity: g.opacity, fontWeight: g.weight,
                    transition: `opacity 0.6s ${0.3 + i * 0.1}s, transform 0.7s ${0.3 + i * 0.1}s cubic-bezier(0.16,1,0.3,1)`,
                  }}
                >
                  {g.char}
                </span>
              ))
            : null}

          {/* English mode */}
          {!isZh && EN_GLYPHS.map((g, i) => (
            <span
              key={i}
              className="l-hero-glyph l-hero-glyph-en"
              style={{
                left: g.x, top: g.y, fontSize: g.size,
                opacity: g.opacity,
                transition: `opacity 0.6s ${0.1 + i * 0.08}s`,
              }}
            >
              {g.text}
            </span>
          ))}

          {/* OrbitAN Logo — centered between the two columns */}
          <div
            className="l-hero-logo"
            style={{ opacity: visible ? 1 : 0, transition: "opacity 0.5s 0.35s" }}
          >
            <OrbitanLogo variant="hero" />
          </div>

          {/* Tagline */}
          <p
            className="l-hero-desc"
            style={{ opacity: visible ? 1 : 0, transition: "opacity 0.5s 0.6s" }}
          >
            {isZh ? "轨划分秒 · 注定乾坤" : "TIME ORBITED · FOCUS DETERMINED"}
          </p>

          {/* ── CTA Buttons — no arrows ── */}
          <div
            className="l-hero-actions"
            style={{ opacity: visible ? 1 : 0, transition: "opacity 0.5s 0.75s" }}
          >
            <div className="l-hero-actions-rule" />
            <div className="l-hero-actions-row">
              <Link href="/orbit" className="l-hero-btn l-hero-btn-primary">
                <span className="l-hero-btn-dot" />
                {t.hero_cta}
              </Link>
              <span className="l-hero-actions-sep" />
              <Link href="/docs" className="l-hero-btn l-hero-btn-secondary">
                {t.learn_more}
              </Link>
            </div>
            <div className="l-hero-actions-rule" />
          </div>
        </div>

        <ScrollIndicator />
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

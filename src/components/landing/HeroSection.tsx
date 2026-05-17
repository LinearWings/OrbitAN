"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";
import { useReveal } from "@/hooks/useScrollProgress";
import { FloatingTimestamps } from "./FloatingTimestamps";
import { ScrollIndicator } from "./ScrollIndicator";
import { OrbitanLogo } from "./OrbitanLogo";

/* ── Orbital constellation glyphs ── */
interface Glyph {
  char: string;
  x: string;
  y: string;
  size: string;
  opacity: number;
  weight: number;
  rotate?: number;
}

const CN_GLYPHS: Glyph[] = [
  { char: "轨", x: "-3%", y: "-4%", size: "clamp(7rem,18vw,16rem)", opacity: 0.05, weight: 700, rotate: -8 },
  { char: "划", x: "7%",  y: "14%", size: "clamp(2.2rem,4.5vw,4rem)", opacity: 0.5, weight: 600 },
  { char: "分", x: "45%", y: "4%",  size: "clamp(1.6rem,3vw,2.8rem)", opacity: 0.38, weight: 500 },
  { char: "秒", x: "70%", y: "18%", size: "clamp(2rem,4vw,3.5rem)", opacity: 0.48, weight: 600, rotate: 5 },
  { char: "注", x: "56%", y: "45%", size: "clamp(2.6rem,5.5vw,5rem)", opacity: 0.58, weight: 700 },
  { char: "定", x: "14%", y: "52%", size: "clamp(1.4rem,2.8vw,2.5rem)", opacity: 0.42, weight: 500, rotate: -4 },
  { char: "乾", x: "76%", y: "60%", size: "clamp(1.8rem,3.5vw,3.2rem)", opacity: 0.48, weight: 600 },
  { char: "坤", x: "20%", y: "70%", size: "clamp(2.4rem,5vw,4.5rem)", opacity: 0.52, weight: 700 },
];

const EN_GLYPHS: { text: string; x: string; y: string; size: string; opacity: number }[] = [
  { text: "TIME",   x: "5%",  y: "10%", size: "clamp(.65rem,1.3vw,1.1rem)", opacity: 0.22 },
  { text: "ORBITED",x: "48%", y: "15%", size: "clamp(.55rem,1.1vw,.9rem)", opacity: 0.18 },
  { text: "FOCUS",  x: "62%", y: "52%", size: "clamp(.65rem,1.3vw,1.1rem)", opacity: 0.22 },
  { text: "DETER-", x: "8%",  y: "60%", size: "clamp(.5rem,1vw,.8rem)", opacity: 0.16 },
  { text: "MINED",  x: "10%", y: "65%", size: "clamp(.5rem,1vw,.8rem)", opacity: 0.16 },
];

/* ── Decorative engineering arrow (PCB routing style) ── */
function ArrowDecoration({ color = "rgba(59,130,246,.15)", style }: { color?: string; style?: React.CSSProperties }) {
  return (
    <svg
      width="120" height="40" viewBox="0 0 120 40" fill="none"
      className="l-hero-arrow"
      style={style}
      aria-hidden="true"
    >
      {/* Horizontal segment */}
      <line x1="0" y1="20" x2="50" y2="20" stroke={color} strokeWidth="0.6" />
      {/* 120° diagonal */}
      <line x1="50" y1="20" x2="75" y2="6" stroke={color} strokeWidth="0.6" />
      {/* Horizontal segment */}
      <line x1="75" y1="6" x2="115" y2="6" stroke={color} strokeWidth="0.6" />
      {/* Arrowhead */}
      <polygon points="115,6 108,2 108,10" fill={color} />
      {/* Small dot at bend point */}
      <circle cx="50" cy="20" r="1.5" fill={color} />
    </svg>
  );
}

export function HeroSection() {
  const lang = useLanguage();
  const t = getT(lang);
  const { ref, visible } = useReveal(0.05);
  const isZh = lang === "zh";

  return (
    <section className="l-hero-v2" ref={ref}>
      <div className="l-hero-v2-canvas-wrap">
        <FloatingTimestamps />

        {/* ── Orbital Constellation ── */}
        <div
          className="l-hero-stage"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.8s 0.1s",
          }}
        >
          {/* Engineering arrow — top-left decorative */}
          <ArrowDecoration
            color="rgba(59,130,246,.10)"
            style={{ position: "absolute", left: "5%", top: "8%", transform: "rotate(-10deg) scale(0.7)" }}
          />

          {/* Glyphs */}
          {isZh
            ? CN_GLYPHS.map((g, i) => (
                <span
                  key={i}
                  className="l-hero-glyph"
                  style={{
                    left: g.x, top: g.y, fontSize: g.size,
                    opacity: g.opacity, fontWeight: g.weight,
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
                    left: g.x, top: g.y, fontSize: g.size,
                    opacity: g.opacity,
                    transition: `opacity 0.6s ${0.15 + i * 0.08}s`,
                  }}
                >
                  {g.text}
                </span>
              ))}

          {/* OrbitAN Logo */}
          <div
            className="l-hero-logo"
            style={{ opacity: visible ? 1 : 0, transition: "opacity 0.5s 0.3s" }}
          >
            <OrbitanLogo variant="hero" />
          </div>

          {/* Engineering arrow — right side decorative */}
          <ArrowDecoration
            color="rgba(245,158,11,.10)"
            style={{ position: "absolute", right: "8%", top: "35%", transform: "rotate(160deg) scale(0.6)" }}
          />

          {/* Tagline */}
          <p
            className="l-hero-desc"
            style={{ opacity: visible ? 1 : 0, transition: "opacity 0.5s 0.55s" }}
          >
            {isZh ? "轨划分秒 · 注定乾坤" : "TIME ORBITED · FOCUS DETERMINED"}
          </p>

          {/* ── CTA Buttons — mid-bottom with engineering styling ── */}
          <div
            className="l-hero-actions"
            style={{ opacity: visible ? 1 : 0, transition: "opacity 0.5s 0.7s" }}
          >
            {/* Thin rule above CTAs */}
            <div className="l-hero-actions-rule" />

            <div className="l-hero-actions-row">
              {/* Primary — Enter Orbit */}
              <Link href="/orbit" className="l-hero-btn l-hero-btn-primary">
                <span className="l-hero-btn-label">
                  <span className="l-hero-btn-dot" />
                  {t.hero_cta}
                </span>
                {/* Arrow icon — PCB style */}
                <svg width="28" height="12" viewBox="0 0 28 12" fill="none" className="l-hero-btn-arrow">
                  <line x1="0" y1="6" x2="16" y2="6" stroke="currentColor" strokeWidth="1.4" />
                  <line x1="16" y1="6" x2="22" y2="1" stroke="currentColor" strokeWidth="1.4" />
                  <line x1="22" y1="1" x2="27" y2="1" stroke="currentColor" strokeWidth="1.4" />
                  <polygon points="27,1 22,0 22,2" fill="currentColor" />
                </svg>
              </Link>

              {/* Separator dot */}
              <span className="l-hero-actions-sep" />

              {/* Secondary — Learn More */}
              <Link href="/docs" className="l-hero-btn l-hero-btn-secondary">
                {t.learn_more}
                <svg width="16" height="10" viewBox="0 0 16 10" fill="none" className="l-hero-btn-chevron">
                  <line x1="0" y1="5" x2="10" y2="5" stroke="currentColor" strokeWidth="1" />
                  <line x1="10" y1="5" x2="13" y2="2" stroke="currentColor" strokeWidth="1" />
                  <line x1="13" y1="2" x2="15" y2="2" stroke="currentColor" strokeWidth="1" />
                  <polygon points="15,2 12,1.5 12,2.5" fill="currentColor" />
                </svg>
              </Link>
            </div>

            {/* Thin rule below CTAs */}
            <div className="l-hero-actions-rule" />
          </div>

          {/* Engineering arrow — near CTAs */}
          <ArrowDecoration
            color="rgba(99,102,241,.08)"
            style={{ position: "absolute", left: "40%", top: "82%", transform: "rotate(-30deg) scale(0.5)" }}
          />
        </div>

        <ScrollIndicator />
        {/* Evaporation particles */}
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

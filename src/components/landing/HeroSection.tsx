"use client";

import { useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useCinematicScroll } from "@/hooks/useCinematicScroll";
import { FloatingTimestamps } from "./FloatingTimestamps";
import { ScrollIndicator } from "./ScrollIndicator";
import { OrbitanLogo } from "./OrbitanLogo";

interface Glyph {
  char: string;
  x: string;
  y: string;
  size: string;
  opacity: number;
  weight: number;
  dx: number;
  dy: number;
}

const LEFT_GLYPHS: Glyph[] = [
  { char: "轨", x: "4%",  y: "16%", size: "clamp(2.6rem,5.2vw,4.8rem)", opacity: 0.56, weight: 700, dx: -1, dy: -0.5 },
  { char: "划", x: "7%",  y: "32%", size: "clamp(2rem,4vw,3.6rem)", opacity: 0.44, weight: 500, dx: -0.8, dy: 0 },
  { char: "分", x: "3%",  y: "50%", size: "clamp(2.9rem,5.8vw,5.2rem)", opacity: 0.62, weight: 700, dx: -1, dy: 0.3 },
  { char: "秒", x: "6%",  y: "68%", size: "clamp(1.8rem,3.6vw,3.2rem)", opacity: 0.40, weight: 500, dx: -0.7, dy: 0.6 },
];

const RIGHT_GLYPHS: Glyph[] = [
  { char: "注", x: "88%", y: "18%", size: "clamp(3rem,6vw,5.6rem)", opacity: 0.64, weight: 700, dx: 1, dy: -0.5 },
  { char: "定", x: "91%", y: "36%", size: "clamp(1.8rem,3.6vw,3rem)", opacity: 0.42, weight: 500, dx: 0.9, dy: 0 },
  { char: "乾", x: "87%", y: "54%", size: "clamp(2.3rem,4.6vw,4rem)", opacity: 0.52, weight: 600, dx: 1, dy: 0.3 },
  { char: "坤", x: "90%", y: "70%", size: "clamp(2.5rem,5vw,4.6rem)", opacity: 0.56, weight: 700, dx: 0.8, dy: 0.6 },
];

const EN_GLYPHS = [
  { text: "TIME",    x: "3%",  y: "12%", size: "clamp(.6rem,1.2vw,1rem)", opacity: 0.2, dx: -1, dy: -0.5 },
  { text: "ORBITED", x: "6%",  y: "28%", size: "clamp(.55rem,1vw,.85rem)", opacity: 0.16, dx: -0.8, dy: 0 },
  { text: "FOCUS",   x: "88%", y: "14%", size: "clamp(.6rem,1.2vw,1rem)", opacity: 0.2, dx: 1, dy: -0.5 },
  { text: "DETER-",  x: "90%", y: "32%", size: "clamp(.5rem,1vw,.8rem)", opacity: 0.15, dx: 0.9, dy: 0 },
  { text: "MINED",   x: "87%", y: "64%", size: "clamp(.5rem,1vw,.8rem)", opacity: 0.15, dx: 0.8, dy: 0.5 },
];

const OUTLINE_WORDS_LEFT = [
  { text: "ORBIT",   x: "2%",  y: "14%", size: "clamp(3rem,6.5vw,6rem)",   dx: -1, dy: -0.5 },
  { text: "CHART",   x: "5%",  y: "30%", size: "clamp(2.2rem,4.5vw,4rem)", dx: -0.8, dy: 0 },
  { text: "PART",    x: "1%",  y: "48%", size: "clamp(3.2rem,7vw,6.5rem)", dx: -1, dy: 0.3 },
  { text: "SECOND",  x: "4%",  y: "66%", size: "clamp(1.8rem,3.8vw,3.4rem)", dx: -0.7, dy: 0.6 },
];

const OUTLINE_WORDS_RIGHT = [
  { text: "FOCUS",   x: "86%", y: "16%", size: "clamp(3.4rem,7vw,6.8rem)", dx: 1, dy: -0.5 },
  { text: "FIXED",   x: "89%", y: "34%", size: "clamp(2rem,4vw,3.5rem)",   dx: 0.9, dy: 0 },
  { text: "COSMOS",  x: "84%", y: "52%", size: "clamp(2.6rem,5.2vw,4.5rem)", dx: 1, dy: 0.3 },
  { text: "TERRA",   x: "88%", y: "68%", size: "clamp(2.8rem,5.6vw,5rem)",  dx: 0.8, dy: 0.6 },
];

export function HeroSection() {
  const lang = useLanguage();
  const t = getT(lang);
  const { ref: scrollRef, progress } = useScrollProgress();
  const { ref: cinematicRef } = useCinematicScroll({
    exit: { rotateX: -15, scale: 0.92, translateZ: -100, blur: 2, opacity: 0 },
    origin: "center 40%",
  });
  const isZh = lang === "zh";
  const logoRef = useRef<HTMLDivElement>(null);

  const scatter = Math.min(1, progress * 2);
  const fade = Math.max(0, 1 - (progress - 0.3) / 0.4);

  return (
    <section className="l-hero-v2 cinematic-section" ref={(el) => { cinematicRef(el); scrollRef.current = el; }}>
      <div className="l-hero-v2-canvas-wrap">
        <FloatingTimestamps logoRef={logoRef} />

        <div className="l-hero-stage" style={{ opacity: fade }}>
          {isZh && LEFT_GLYPHS.map((g, i) => (
            <span key={`l${i}`} className="l-hero-glyph" style={{
              left: g.x, top: g.y, fontSize: g.size,
              opacity: g.opacity * fade, fontWeight: g.weight,
              transform: `translate(${g.dx * scatter * 80}px, ${g.dy * scatter * 80}px) scale(${1 - scatter * 0.15})`,
              transition: "none",
            }}>
              {g.char}
            </span>
          ))}

          {isZh && RIGHT_GLYPHS.map((g, i) => (
            <span key={`r${i}`} className="l-hero-glyph" style={{
              left: g.x, top: g.y, fontSize: g.size,
              opacity: g.opacity * fade, fontWeight: g.weight,
              transform: `translate(${g.dx * scatter * 80}px, ${g.dy * scatter * 80}px) scale(${1 - scatter * 0.15})`,
              transition: "none",
            }}>
              {g.char}
            </span>
          ))}

          {isZh && OUTLINE_WORDS_LEFT.map((g, i) => (
            <span key={`ol${i}`} className="l-hero-glyph-outline" style={{
              left: g.x, top: g.y, fontSize: g.size,
              opacity: fade,
              transform: `translate(${g.dx * scatter * 80}px, ${g.dy * scatter * 80}px) scale(${1 - scatter * 0.15})`,
              transition: "none",
            }}>
              {g.text}
            </span>
          ))}

          {isZh && OUTLINE_WORDS_RIGHT.map((g, i) => (
            <span key={`or${i}`} className="l-hero-glyph-outline" style={{
              left: g.x, top: g.y, fontSize: g.size,
              opacity: fade,
              transform: `translate(${g.dx * scatter * 80}px, ${g.dy * scatter * 80}px) scale(${1 - scatter * 0.15})`,
              transition: "none",
            }}>
              {g.text}
            </span>
          ))}

          {!isZh && EN_GLYPHS.map((g, i) => (
            <span key={i} className="l-hero-glyph l-hero-glyph-en" style={{
              left: g.x, top: g.y, fontSize: g.size,
              opacity: g.opacity * fade,
              transform: `translate(${g.dx * scatter * 80}px, ${g.dy * scatter * 80}px) scale(${1 - scatter * 0.1})`,
              transition: "none",
            }}>
              {g.text}
            </span>
          ))}

          <div ref={logoRef} className="l-hero-logo" style={{
            opacity: fade,
            transform: `translate(-50%, -50%) translateY(${progress * -60}px) scale(${1 - progress * 0.1})`,
            transition: "none",
          }}>
            <OrbitanLogo variant="hero" />
          </div>

          <p className="l-hero-desc" style={{
            opacity: Math.max(0, fade - 0.3),
            transition: "none",
          }}>
            {isZh ? "轨划分秒 · 注定乾坤" : "TIME ORBITED · FOCUS DETERMINED"}
          </p>

          <div className="l-hero-actions" style={{
            opacity: Math.max(0, fade - 0.15),
            transition: "none",
          }}>
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
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="l-evap-p" style={{
              left: `${12 + (i * 6) % 76}%`,
              animationDelay: `${i * 0.55}s`,
              animationDuration: `${5 + (i % 4) * 2}s`,
              "--drift": `${(i % 2 === 0 ? 1 : -1) * (3 + (i % 5) * 2)}px`,
              "--drift-end": `${(i % 2 === 0 ? -1 : 1) * (2 + (i % 3) * 2)}px`,
            } as React.CSSProperties} />
          ))}
        </div>
      </div>
    </section>
  );
}

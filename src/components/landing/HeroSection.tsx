"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";
import { useReveal } from "@/hooks/useScrollProgress";
import { FloatingTimestamps } from "./FloatingTimestamps";
import { ScrollIndicator } from "./ScrollIndicator";

/* ── Chinese characters split for yin-yang block treatment ── */
const ZH_CHARS_L1 = ["轨", "划", "分", "秒"];
const ZH_CHARS_L2 = ["注", "定", "乾", "坤"];

export function HeroSection() {
  const lang = useLanguage();
  const t = getT(lang);
  const { ref, visible } = useReveal(0.05);

  const isZh = lang === "zh";

  return (
    <section className="l-hero-v2" ref={ref}>
      <div className="l-hero-v2-canvas-wrap">
        <FloatingTimestamps />

        <div className="l-hero-v2-content">
          {/* ── OrbitAN Logo Wordmark ── */}
          <div
            className="l-hero-logo"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.6s 0.05s, transform 0.6s 0.05s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            aria-label="OrbitAN"
          >
            <span className="l-hero-logo-o">O</span>
            <span className="l-hero-logo-r">R</span>
            <span className="l-hero-logo-b">B</span>
            <span className="l-hero-logo-i">I</span>
            <span className="l-hero-logo-t">T</span>
            <span className="l-hero-logo-a">A</span>
            <span className="l-hero-logo-n">N</span>
          </div>

          {/* ── Headline: yin-yang character blocks ── */}
          <h1
            className="l-hero-h1"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.7s 0.15s, transform 0.7s 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {isZh ? (
              <>
                <span className="l-hero-h1-row">
                  {ZH_CHARS_L1.map((ch, i) => (
                    <span key={i} className={`l-hero-block ${i % 2 === 0 ? "l-hero-block-yang" : "l-hero-block-yin"}`}>
                      {ch}
                    </span>
                  ))}
                </span>
                <span className="l-hero-h1-row">
                  {ZH_CHARS_L2.map((ch, i) => (
                    <span key={i} className={`l-hero-block ${i % 2 === 0 ? "l-hero-block-yin" : "l-hero-block-yang"}`}>
                      {ch}
                    </span>
                  ))}
                </span>
              </>
            ) : (
              <>
                <span className="l-hero-h1-row l-hero-h1-en">TIME ORBITED</span>
                <span className="l-hero-h1-row l-hero-h1-en">FOCUS DETERMINED</span>
              </>
            )}
          </h1>

          {/* ── English subtitle ── */}
          <p
            className="l-hero-sub"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(14px)",
              transition: "opacity 0.6s 0.25s, transform 0.6s 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {isZh
              ? "T I M E   O R B I T E D   ·   F O C U S   D E T E R M I N E D"
              : "轨划分秒 · 注定乾坤"}
          </p>

          {/* ── Description ── */}
          <p
            className="l-hero-desc"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.5s 0.35s, transform 0.5s 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {isZh
              ? "六种经典时间管理方法论，轨道化你的每一天。"
              : "Six time-management methodologies. Orbitalize your every day."}
          </p>

          {/* ── CTA Buttons ── */}
          <div
            className="l-hero-actions"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.5s 0.45s, transform 0.5s 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
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

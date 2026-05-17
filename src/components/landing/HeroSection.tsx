"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";
import { useReveal } from "@/hooks/useScrollProgress";
import { FloatingTimestamps } from "./FloatingTimestamps";
import { ScrollIndicator } from "./ScrollIndicator";

export function HeroSection() {
  const lang = useLanguage();
  const t = getT(lang);
  const { ref, visible } = useReveal(0.05);

  return (
    <section className="l-hero-v2" ref={ref}>
      <div className="l-hero-v2-canvas-wrap">
        <FloatingTimestamps />
        <div className="l-hero-v2-content">
          <h1
            className="l-hero-v2-h1"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.7s 0.2s, transform 0.7s 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <span className="l-hero-v2-h1-line">
              {lang === "zh" ? "一日一轨道" : "A Day Is An Orbit"}
            </span>
            <span className="l-hero-v2-h1-line">
              {lang === "zh" ? "专注即引力" : "Focus Is Your Gravity"}
            </span>
          </h1>

          <p
            className="l-hero-v2-desc"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.6s 0.35s, transform 0.6s 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {lang === "zh"
              ? "六种经典时间管理方法论，轨道化你的每一天。"
              : "Six time-management methodologies. Orbitalize your every day."}
          </p>

          <div
            className="l-hero-v2-actions"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.5s 0.5s, transform 0.5s 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <Link href="/orbit" className="l-hero-v2-btn l-hero-v2-btn-primary">
              <span className="l-hero-v2-btn-dot" />
              {t.hero_cta}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.3 8h11.4m0 0L8.7 3M13.7 8l-5 5" />
              </svg>
            </Link>
            <Link href="/docs" className="l-hero-v2-btn l-hero-v2-btn-secondary">
              {t.learn_more}
              <span className="l-hero-v2-btn-dots" />
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

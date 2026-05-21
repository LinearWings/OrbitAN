"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";
import { useCinematicScroll } from "@/hooks/useCinematicScroll";
import { SectionParticles } from "./SectionParticles";

export function CTASection() {
  const lang = useLanguage();
  const t = getT(lang);
  const { ref: cinematicRef } = useCinematicScroll();

  const ctaText = lang === "zh" ? "准备 Enter Orbit" : "Ready to Enter Orbit";

  return (
    <section className="l-cta cinematic-fade" ref={cinematicRef}>
      <SectionParticles count={14} color="rgba(59,130,246,.65)" />
      <div className="l-grid-overlay" style={{ backgroundImage: "radial-gradient(circle 1px at 50% 50%,rgba(255,255,255,.06) 0%,transparent 1px)", backgroundSize: "32px 32px" }} />
      <div className="l-section-glow" style={{ top: "20%", left: "50%", width: 450, height: 450, background: "rgba(59,130,246,.12)", transform: "translateX(-50%)" }} />
      <div className="l-section-glow" style={{ bottom: "10%", left: "30%", width: 300, height: 300, background: "rgba(245,158,11,.08)", animationDelay: "3s" }} />
      <div className="l-section-glow" style={{ bottom: "10%", right: "30%", width: 250, height: 250, background: "rgba(99,102,241,.06)", animationDelay: "5s" }} />
      <div className="l-cta-beams" aria-hidden="true">
        {["top-left", "top-right", "bottom-left", "bottom-right"].map((corner, i) => {
          const angle = [225, 315, 135, 45][i];
          return (
            <div key={corner} className="l-cta-beam" style={{
              transform: `rotate(${angle}deg)`,
              opacity: 0.06,
            }} />
          );
        })}
      </div>

      <div className="l-cta-inner">
        <div className="l-cta-crosses" aria-hidden="true">
          <span className="l-cta-x">+</span>
          <span className="l-cta-x">+</span>
          <span className="l-cta-x">+</span>
          <span className="l-cta-x">+</span>
          <span className="l-cta-x">+</span>
        </div>

        <h2 className="l-cta-title">
          {ctaText}
        </h2>

        <p className="l-cta-desc">
          {t.cta_body}
        </p>

        <div className="l-cta-actions">
          <Link href="/orbit" className="l-cta-btn l-cta-btn-primary">
            {t.hero_cta}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2.3 8h11.4m0 0L8.7 3M13.7 8l-5 5" />
            </svg>
          </Link>
          <Link href="/docs" className="l-cta-btn l-cta-btn-secondary">
            {t.learn_more}
          </Link>
        </div>

        <div className="l-cta-keys">
          <span className="l-cta-key"><kbd>←</kbd><kbd>→</kbd> Navigate</span>
          <span className="l-cta-key"><kbd>N</kbd> New</span>
          <span className="l-cta-key"><kbd>O</kbd> Orbit</span>
          <span className="l-cta-key"><kbd>1</kbd>-<kbd>4</kbd> Filter</span>
        </div>
      </div>
    </section>
  );
}

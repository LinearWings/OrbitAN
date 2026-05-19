"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useCinematicScroll } from "@/hooks/useCinematicScroll";

export function CTASection() {
  const lang = useLanguage();
  const t = getT(lang);
  const { ref: scrollRef, progress } = useScrollProgress();
  const { ref: cinematicRef } = useCinematicScroll({
    enter: { opacity: 0, translateY: 30 },
  });

  const ctaText = lang === "zh" ? "准备 Enter Orbit" : "Ready to Enter Orbit";

  // Phase 1: corner beams intensify (0→45%)
  // Phase 2: title characters cascade (30%→75%)
  // Phase 3: CTA button + keyboard hints (55%→100%)
  const beamProgress = Math.min(1, progress / 0.45);
  const titleProgress = Math.max(0, Math.min(1, (progress - 0.3) / 0.45));
  const ctaProgress = Math.max(0, Math.min(1, (progress - 0.55) / 0.45));

  const chars = ctaText.split("");

  return (
    <section className="l-cta cinematic-fade" ref={(el) => { cinematicRef(el); scrollRef.current = el; }}>
      <div className="l-cta-beams" aria-hidden="true">
        {["top-left", "top-right", "bottom-left", "bottom-right"].map((corner, i) => {
          const angle = [225, 315, 135, 45][i];
          const spread = (1 - beamProgress) * 30;
          return (
            <div key={corner} className="l-cta-beam" style={{
              transform: `rotate(${angle + (i % 2 === 0 ? -spread : spread)}deg)`,
              opacity: 0.03 + beamProgress * 0.05,
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
          {chars.map((c, i) => {
            const charProgress = Math.max(0, Math.min(1, (titleProgress - i * (0.8 / chars.length)) / (0.8 / chars.length)));
            return (
              <span key={i} style={{
                opacity: charProgress,
                transform: `translateY(${(1 - charProgress) * 20}px)`,
                display: "inline-block",
                transition: "none",
              }}>
                {c === " " ? " " : c}
              </span>
            );
          })}
        </h2>

        <p className="l-cta-desc" style={{
          opacity: Math.max(0, titleProgress - 0.3),
        }}>
          {t.cta_body}
        </p>

        <div className="l-cta-actions" style={{
          opacity: ctaProgress,
          transform: `scale(${0.95 + ctaProgress * 0.05})`,
        }}>
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

        <div className="l-cta-keys" style={{
          opacity: Math.max(0, ctaProgress - 0.2),
        }}>
          <span className="l-cta-key"><kbd>←</kbd><kbd>→</kbd> Navigate</span>
          <span className="l-cta-key"><kbd>N</kbd> New</span>
          <span className="l-cta-key"><kbd>O</kbd> Orbit</span>
          <span className="l-cta-key"><kbd>1</kbd>-<kbd>4</kbd> Filter</span>
        </div>
      </div>
    </section>
  );
}

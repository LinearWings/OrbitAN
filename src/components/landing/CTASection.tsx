"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";
import { useReveal } from "@/hooks/useScrollProgress";

export function CTASection() {
  const lang = useLanguage();
  const t = getT(lang);
  const { ref, visible } = useReveal(0.2);

  const ctaText = lang === "zh" ? "准备进入轨道" : "Ready to Enter Orbit";

  return (
    <section className="l-cta" ref={ref}>
      <div className="l-cta-inner">
        <div className="l-cta-crosses" aria-hidden="true">
          <span className="l-cta-x">+</span>
          <span className="l-cta-x">+</span>
          <span className="l-cta-x">+</span>
          <span className="l-cta-x">+</span>
          <span className="l-cta-x">+</span>
        </div>

        <h2
          className="l-cta-title"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {ctaText}
        </h2>

        <p
          className="l-cta-desc"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.5s 0.15s",
          }}
        >
          {t.cta_body}
        </p>

        <div
          className="l-cta-actions"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.5s 0.3s",
          }}
        >
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

        <div
          className="l-cta-keys"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.5s 0.45s",
          }}
        >
          <span className="l-cta-key">
            <kbd>←</kbd><kbd>→</kbd> Navigate
          </span>
          <span className="l-cta-key">
            <kbd>N</kbd> New
          </span>
          <span className="l-cta-key">
            <kbd>O</kbd> Orbit
          </span>
          <span className="l-cta-key">
            <kbd>1</kbd>-<kbd>4</kbd> Filter
          </span>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";
import { OrbitanLogo } from "./OrbitanLogo";

export function LandingNav() {
  const lang = useLanguage();
  const t = getT(lang);

  return (
    <nav className="l-nav" aria-label="Main navigation">
      <Link href="/" className="l-nav-logo" aria-label="OrbitAN Home">
        <OrbitanLogo variant="nav" />
      </Link>

      <span className="l-nav-tagline">
        {lang === "zh" ? "一日一轨道，专注即引力" : "A Day Is An Orbit, Focus Is Your Gravity"}
      </span>

      <div className="l-nav-actions">
        <Link href="/orbit" className="l-nav-btn l-nav-btn-primary">
          <span className="l-nav-btn-dot" />
          {t.hero_cta}
        </Link>
        <Link href="/docs" className="l-nav-btn l-nav-btn-secondary">
          {lang === "zh" ? "文档" : "Docs"}
          <span className="l-nav-btn-dots" />
        </Link>
      </div>
    </nav>
  );
}

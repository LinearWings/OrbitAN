"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";
import { OrbitanLogo } from "./OrbitanLogo";

const METHODS = [
  { id: "gtd", label: "GTD", color: "#22C55E" },
  { id: "pomodoro", label: "Po", color: "#EF4444" },
  { id: "pareto", label: "Pa", color: "#2563EB" },
  { id: "moffatt", label: "Mo", color: "#7C3AED" },
  { id: "howell", label: "Ho", color: "#F97316" },
  { id: "swot", label: "SW", color: "#EAB308" },
];

export function LandingNav() {
  const lang = useLanguage();
  const t = getT(lang);

  return (
    <nav className="l-nav" aria-label="Main navigation">
      <Link href="/" className="l-nav-logo" aria-label="OrbitAN Home">
        <OrbitanLogo variant="nav" />
      </Link>

      <div className="l-nav-methods" aria-label="Methodologies">
        {METHODS.map((m) => (
          <a
            key={m.id}
            href="#methods"
            className="l-nav-method-dot"
            style={{ "--dot-color": m.color } as React.CSSProperties}
            title={m.label}
          >
            <span className="l-nav-method-dot-inner" />
          </a>
        ))}
      </div>

      <div className="l-nav-actions">
        <Link href="/orbit" className="l-nav-btn l-nav-btn-primary">
          <span className="l-nav-btn-dot" />
          {t.hero_cta}
        </Link>
        <Link href="/docs" className="l-nav-btn l-nav-btn-secondary">
          Docs
          <span className="l-nav-btn-dots" />
        </Link>
      </div>
    </nav>
  );
}

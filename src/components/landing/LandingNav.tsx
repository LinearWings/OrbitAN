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

// Simple geometric SVG icons for each methodology
const METHOD_ICONS: Record<string, React.ReactNode> = {
  gtd: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="2" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/><line x1="7" y1="5" x2="7" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="5" y1="9" x2="9" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  pomodoro: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/><line x1="7" y1="4" x2="7" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="7" y1="7" x2="10" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  pareto: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/><path d="M2,7 A5,5 0 1,1 12,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><line x1="10" y1="3" x2="10" y2="4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  moffatt: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="2" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="8" y="2" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="2" y="8" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="8" y="8" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/></svg>,
  howell: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><line x1="7" y1="2" x2="7" y2="12" stroke="currentColor" strokeWidth="1.5"/><line x1="2" y1="7" x2="12" y2="7" stroke="currentColor" strokeWidth="1.5"/></svg>,
  swot: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="2" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="8" y="2" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="2" y="8" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="8" y="8" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5"/></svg>,
};

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
            className="l-nav-method-icon"
            style={{ color: m.color }}
            title={m.label}
          >
            {METHOD_ICONS[m.id]}
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

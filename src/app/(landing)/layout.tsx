"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { getT } from "@/lib/i18n";
import LangSwitch from "@/components/landing/LangSwitch";

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  const lang = useLanguage();
  const t = getT(lang);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="h-screen bg-[#080808] text-white/80 overflow-y-auto" style={{ fontFamily: "'Satoshi', sans-serif" }}>
      <header
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 py-5 border-b border-white/[0.06]"
        style={{ background: "rgba(8,8,8,0.8)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
      >
        <Link href="/" className="text-lg font-semibold tracking-tight text-white/85" style={{ fontFamily: "'Clash Display', sans-serif" }}>
          OrbitAN
        </Link>
        {isMobile ? (
          <div className="flex items-center gap-3">
            <LangSwitch currentLang={lang} />
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-white/50 text-xl leading-none">
              {menuOpen ? "✕" : "☰"}
            </button>
            {menuOpen && (
              <div className="absolute top-full right-4 mt-2 rounded-xl py-2 px-4 flex flex-col gap-2"
                style={{ background: "rgba(10,10,15,0.95)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <Link href="/docs" onClick={() => setMenuOpen(false)} className="text-sm text-white/60 hover:text-white/90">{t.nav_docs}</Link>
                <Link href="/orbit" onClick={() => setMenuOpen(false)} className="text-sm text-white/60 hover:text-white/90">{t.orbit_now}</Link>
              </div>
            )}
          </div>
        ) : (
          <nav className="flex items-center gap-5 text-sm text-white/35">
            <Link href="/docs" className="hover:text-white/70 transition-colors">{t.nav_docs}</Link>
            <Link
              href="/orbit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-medium transition-all hover:scale-105"
              style={{
                background: "linear-gradient(135deg, rgba(37,99,235,0.8), rgba(124,58,237,0.8))",
                boxShadow: "0 4px 20px rgba(37,99,235,0.25)",
                fontFamily: "'Clash Display', sans-serif",
              }}
            >
              {t.orbit_now}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
            <LangSwitch currentLang={lang} />
          </nav>
        )}
      </header>
      <main className="pt-20">{children}</main>
    </div>
  );
}

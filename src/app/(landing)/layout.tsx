"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { CloseIcon, MenuIcon } from "@/components/ui/Icons";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { getT } from "@/lib/i18n";
import LangSwitch from "@/components/landing/LangSwitch";

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  const lang = useLanguage();
  const t = getT(lang);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="h-screen bg-[#050505] text-white/80 overflow-y-auto" data-scroll-container style={{ fontFamily: "'Satoshi', sans-serif" }}>
      <header
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 py-2"
        style={{
          background: "rgba(5,5,5,0.95)",
          borderBottom: "2px solid rgba(255,255,255,0.05)",
        }}
      >
        <Link
          href="/"
          className="flex items-center gap-3"
          style={{ fontFamily: "'Clash Display', sans-serif", color: "rgba(255,255,255,0.75)" }}
        >
          <div style={{ width: 10, height: 10, background: "#2563EB" }} />
          <span className="text-sm font-semibold tracking-[0.1em]" style={{ fontSize: "0.8125rem" }}>OrbitAN</span>
        </Link>
        {isMobile ? (
          <div className="flex items-center gap-3">
            <LangSwitch currentLang={lang} />
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-white/50 text-xl leading-none">
              {menuOpen ? <CloseIcon size={16} /> : <MenuIcon size={18} />}
            </button>
            {menuOpen && (
              <div
                className="absolute top-full right-4 mt-2 py-2 px-4 flex flex-col gap-2"
                style={{
                  background: "rgba(5,5,5,0.98)",
                  border: "2px solid rgba(255,255,255,0.06)",
                }}
              >
                <Link href="/docs" onClick={() => setMenuOpen(false)} className="text-sm text-white/60 hover:text-white/90">
                  Docs
                </Link>
                <Link href="/orbit" onClick={() => setMenuOpen(false)} className="text-sm text-white/60 hover:text-white/90">
                  Enter Orbit
                </Link>
              </div>
            )}
          </div>
        ) : (
          <nav className="flex items-center gap-6 text-sm" style={{ fontFamily: "'JetBrains Mono', monospace", color: "rgba(255,255,255,0.3)" }}>
            <Link href="/docs" className="hover:text-white/60" style={{ fontSize: "0.6875rem", letterSpacing: "0.06em" }}>
              Docs
            </Link>
            <Link
              href="/orbit"
              className="hover:text-white"
              style={{
                fontSize: "0.6875rem",
                letterSpacing: "0.06em",
                padding: "6px 16px",
                border: "2px solid rgba(37,99,235,0.3)",
                color: "rgba(37,99,235,0.7)",
              }}
            >
              Enter Orbit
            </Link>
            <LangSwitch currentLang={lang} />
          </nav>
        )}
      </header>
      <main className="pt-16">{children}</main>
    </div>
  );
}

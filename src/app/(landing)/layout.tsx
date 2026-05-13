import { cookies, headers } from "next/headers";
import type { Metadata } from "next";
import { detectLang, getT, type Lang } from "@/lib/i18n";
import LangSwitch from "@/components/landing/LangSwitch";

export const metadata: Metadata = {
  title: "OrbitAN — 轨道计划",
  description: "A day is an orbit, focus is your gravity.",
};

export default async function LandingLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const headersList = await headers();
  const lang = (cookieStore.get("orbit_lang")?.value as Lang) || detectLang(headersList.get("accept-language"));
  const t = getT(lang);

  return (
    <div className="h-screen bg-[#080808] text-white/80 overflow-y-auto" style={{ fontFamily: "'Satoshi', sans-serif" }}>
      <header
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 py-5 border-b border-white/[0.06]"
        style={{ background: "rgba(8,8,8,0.8)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
      >
        <a href="/" className="text-lg font-semibold tracking-tight text-white/85" style={{ fontFamily: "'Clash Display', sans-serif" }}>
          OrbitAN
        </a>
        <nav className="flex items-center gap-5 text-sm text-white/35">
          <a href="/docs" className="hover:text-white/70 transition-colors">{t.nav_docs}</a>
          <a
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
          </a>
          <LangSwitch currentLang={lang} />
        </nav>
      </header>
      <main className="pt-20">{children}</main>
    </div>
  );
}

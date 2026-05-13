"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";

export default function LandingPage() {
  const lang = useLanguage();
  const t = getT(lang);

  return (
    <>
      {/* Hero */}
      <section className="relative px-4 md:px-8 pt-16 md:pt-24 pb-24 md:pb-36 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-[12%] w-[600px] h-[600px] rounded-full bg-[#EAB308]/[0.05]" />
          <div className="absolute top-32 right-[8%] w-[450px] h-[450px] rounded-full bg-[#3B82F6]/[0.05]" />
          <div className="absolute -bottom-20 left-[25%] w-[700px] h-[700px] rounded-full bg-[#8B5CF6]/[0.03]" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-[0.2em] uppercase text-white/20 mb-8" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {t.hero_tagline}
          </p>
          <h1 className="text-3xl md:text-7xl font-semibold leading-[1.05] tracking-tight mb-6 text-white/90" style={{ fontFamily: "'Clash Display', sans-serif" }}>
            {t.hero_title_1}
            <br />
            <span className="text-[#3B82F6]">{t.hero_title_2}</span> {t.hero_title_3}
          </h1>
          <p className="text-lg text-white/30 leading-relaxed max-w-xl mx-auto mb-10">
            {t.hero_desc}
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/orbit"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white text-base font-semibold transition-all hover:scale-105"
              style={{
                background: "linear-gradient(135deg, rgba(37,99,235,0.9), rgba(124,58,237,0.9))",
                boxShadow: "0 4px 28px rgba(37,99,235,0.3)",
                fontFamily: "'Clash Display', sans-serif",
              }}
            >
              {t.hero_cta}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
            <Link href="/docs" className="px-8 py-4 rounded-full text-white/25 text-base font-medium hover:text-white/50 transition-colors">
              {t.learn_more}
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 md:px-8 pb-32 max-w-5xl mx-auto">
        <p className="text-xs tracking-[0.15em] uppercase text-white/15 mb-4 text-center" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {t.how_title}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { num: "01", title: t.how_1_title, desc: t.how_1_desc, color: "#3B82F6" },
            { num: "02", title: t.how_2_title, desc: t.how_2_desc, color: "#8B5CF6" },
            { num: "03", title: t.how_3_title, desc: t.how_3_desc, color: "#EAB308" },
            { num: "04", title: t.how_4_title, desc: t.how_4_desc, color: "#22C55E" },
          ].map((s) => (
            <div
              key={s.num}
              className="group relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <span className="text-3xl font-bold text-white/[0.04] mb-4 block" style={{ fontFamily: "'Clash Display', sans-serif" }}>{s.num}</span>
              <div className="w-1.5 h-1.5 rounded-full mb-4" style={{ background: s.color, boxShadow: `0 0 8px ${s.color}50` }} />
              <h3 className="text-base font-semibold mb-2 text-white/75 tracking-tight" style={{ fontFamily: "'Clash Display', sans-serif" }}>{s.title}</h3>
              <p className="text-sm text-white/25 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-4 md:px-8 pb-32 max-w-5xl mx-auto">
        <p className="text-xs tracking-[0.15em] uppercase text-white/15 mb-8 text-center" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {t.features_title}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: t.feature_clock_title, desc: t.feature_clock_desc, color: "#3B82F6" },
            { title: t.feature_methods_title, desc: t.feature_methods_desc, color: "#8B5CF6" },
            { title: t.feature_focus_title, desc: t.feature_focus_desc, color: "#EAB308" },
          ].map((f) => (
            <div
              key={f.title}
              className="group relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="w-2 h-2 rounded-full mb-5" style={{ background: f.color, boxShadow: `0 0 10px ${f.color}40` }} />
              <h3 className="text-lg font-semibold mb-3 tracking-tight text-white/85" style={{ fontFamily: "'Clash Display', sans-serif" }}>{f.title}</h3>
              <p className="text-sm text-white/30 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 md:px-8 pb-32 max-w-2xl mx-auto text-center">
        <div
          className="rounded-3xl p-12"
          style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.08), rgba(124,58,237,0.06))", border: "1px solid rgba(37,99,235,0.1)" }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-white/85" style={{ fontFamily: "'Clash Display', sans-serif" }}>
            {lang === "zh" ? "准备入轨？" : "Ready to orbit?"}
          </h2>
          <p className="text-white/30 mb-8">
            {lang === "zh" ? "免费、开源、为深度工作者打造。" : "Free, open-source, built for deep work."}
          </p>
          <Link
            href="/orbit"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full text-white text-base font-semibold transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, rgba(37,99,235,0.9), rgba(124,58,237,0.9))",
              boxShadow: "0 4px 28px rgba(37,99,235,0.3)",
              fontFamily: "'Clash Display', sans-serif",
            }}
          >
            {lang === "zh" ? "即刻入轨" : "Launch OrbitAN"}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-12 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/15">
          <span>{t.footer_text}</span>
          <div className="flex gap-6">
            <Link href="/docs" className="hover:text-white/35 transition-colors">{t.footer_docs}</Link>
            <Link href="/orbit" className="hover:text-white/35 transition-colors">{t.footer_launch}</Link>
          </div>
        </div>
      </footer>
    </>
  );
}

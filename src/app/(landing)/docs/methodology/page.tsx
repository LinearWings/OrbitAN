"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";
import { docsChapters } from "@/data/docs-content";
import DocsContent from "@/components/docs/DocsContent";

const METHOD_IDS = ["gtd", "pomodoro", "pareto", "moffatt", "howell", "swot"];
const METHOD_COLORS: Record<string, string> = {
  gtd: "#22C55E",
  pomodoro: "#EF4444",
  pareto: "#2563EB",
  moffatt: "#7C3AED",
  howell: "#F97316",
  swot: "#EAB308",
};

export default function MethodologyPage() {
  const lang = useLanguage();
  const t = getT(lang);
  const [activeMethod, setActiveMethod] = useState("gtd");
  const chapter = docsChapters.find((ch) => ch.id === activeMethod) ?? docsChapters.find((ch) => ch.id === "gtd")!;

  return (
    <div className="max-w-4xl mx-auto px-8 py-16">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/" className="text-xs text-white/20 hover:text-white/40 transition-colors">← {lang === "zh" ? "首页" : "Home"}</Link>
        <span className="text-white/10">·</span>
        <Link href="/docs" className="text-xs text-white/20 hover:text-white/40 transition-colors">{t.back_docs}</Link>
      </div>

      <h1 className="text-4xl font-semibold tracking-tight mb-2 text-white/85" style={{ fontFamily: "'Clash Display', sans-serif" }}>{t.methodology_title}</h1>
      <p className="text-white/30 mb-8">{t.methodology_desc}</p>

      {/* Method selector tabs */}
      <div className="flex flex-wrap gap-2 mb-10">
        {METHOD_IDS.map((mid) => (
          <button
            key={mid}
            onClick={() => setActiveMethod(mid)}
            className="px-4 py-2 rounded-full text-xs font-medium transition-all duration-200"
            style={{
              background: activeMethod === mid ? `${METHOD_COLORS[mid]}18` : "rgba(255,255,255,0.03)",
              border: `1px solid ${activeMethod === mid ? METHOD_COLORS[mid] + "40" : "rgba(255,255,255,0.06)"}`,
              color: activeMethod === mid ? METHOD_COLORS[mid] : "rgba(255,255,255,0.4)",
              fontFamily: "'Clash Display', sans-serif",
            }}
          >
            <span className="w-2 h-2 rounded-full inline-block mr-2" style={{ background: METHOD_COLORS[mid], boxShadow: activeMethod === mid ? `0 0 6px ${METHOD_COLORS[mid]}` : "none" }} />
            {mid === "gtd" ? "GTD" : mid === "pomodoro" ? (lang === "zh" ? "番茄钟" : "Pomodoro") : mid === "pareto" ? (lang === "zh" ? "帕累托" : "Pareto") : mid === "moffatt" ? (lang === "zh" ? "莫法特" : "Moffatt") : mid === "howell" ? (lang === "zh" ? "豪威尔" : "Howell") : "SWOT"}
          </button>
        ))}
      </div>

      {/* Content from unified docs-content.ts */}
      <div className="docs-prose">
        <DocsContent markdown={chapter.content} />
      </div>
    </div>
  );
}

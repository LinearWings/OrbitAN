"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";
import { docsChapters } from "@/data/docs-content";
import DocsContent from "@/components/docs/DocsContent";

export default function TutorialPage() {
  const lang = useLanguage();
  const t = getT(lang);
  const chapter = docsChapters.find(ch => ch.id === "quickstart") ?? docsChapters[0];

  return (
    <div className="max-w-3xl mx-auto px-8 py-16 docs-prose">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/" className="text-xs text-white/20 hover:text-white/40 transition-colors">← {lang === "zh" ? "首页" : "Home"}</Link>
        <span className="text-white/10">·</span>
        <Link href="/docs" className="text-xs text-white/20 hover:text-white/40 transition-colors">{t.back_docs}</Link>
      </div>
      <DocsContent markdown={chapter.content} />
    </div>
  );
}

"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";
import { docsChapters } from "@/data/docs-content";
import DocsContent from "@/components/docs/DocsContent";

const INTERACTIONS_EN = [
  ["Click card", "Select / deselect"],
  ["Click clock empty space", "Deselect all"],
  ["Long press card (600ms)", "Enter delete mode with floating trash bubble"],
  ["Hold trash bubble (2s)", "Confirm delete with progress ring"],
  ["Click outside bubble", "Cancel delete"],
  ["Click selected time/name", "Inline edit"],
  ["Hover focus arc (Orbit Mode)", "Methodology tooltip + glow"],
  ["Click focus arc (Orbit Mode)", "Open methodology panel"],
  ["Click focus block (week view)", "Open methodology panel"],
];

const INTERACTIONS_ZH = [
  ["点击卡片", "选中 / 取消选中"],
  ["点击时钟空白区域", "取消所有选中"],
  ["长按卡片 (600ms)", "进入删除模式，弹出垃圾桶气泡"],
  ["按住垃圾桶气泡 (2s)", "进度环确认删除"],
  ["点击气泡外部", "取消删除"],
  ["点击已选中的时间/名称", "内联编辑"],
  ["悬浮聚焦弧 (Orbit Mode)", "方法论提示 + 辉光"],
  ["点击聚焦弧 (Orbit Mode)", "打开方法论面板"],
  ["点击聚焦块 (周视图)", "打开方法论面板"],
];

export default function UsagePage() {
  const lang = useLanguage();
  const t = getT(lang);
  const interactions = lang === "zh" ? INTERACTIONS_ZH : INTERACTIONS_EN;
  const keyboardChapter = docsChapters.find(ch => ch.id === "keyboard");

  return (
    <div className="max-w-3xl mx-auto px-8 py-16 docs-prose">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/" className="text-xs text-white/20 hover:text-white/40 transition-colors">← {lang === "zh" ? "首页" : "Home"}</Link>
        <span className="text-white/10">·</span>
        <Link href="/docs" className="text-xs text-white/20 hover:text-white/40 transition-colors">{t.back_docs}</Link>
      </div>

      {/* Keyboard shortcuts from docsChapters */}
      {keyboardChapter && <DocsContent markdown={keyboardChapter.content} />}

      {/* Interactions section */}
      <section className="mt-10">
        <h3 className="text-lg font-semibold mb-4 text-white/70 pl-3 border-l-2 border-amber-500/40" style={{ fontFamily: "'Clash Display', sans-serif" }}>{t.usage_mouse}</h3>
        <div className="space-y-3 text-[0.875rem] text-white/50 leading-relaxed">
          {interactions.map(([action, desc]) => (
            <p key={action}><strong className="text-white/60">{action}</strong> &mdash; {desc}</p>
          ))}
        </div>
      </section>
    </div>
  );
}

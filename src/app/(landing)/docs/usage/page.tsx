"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";

const SHORTCUTS = [
  ["N", "New Task / 新建任务"], ["O", "Toggle Orbit Mode / 切换轨道模式"], ["T", "Go to Today / 回到今天"],
  ["1-4", "Filter by type / 按类型筛选"], ["0", "Clear filter / 清除筛选"], ["Delete", "Delete selected / 删除选中"],
  ["Escape", "Close / Cancel / 关闭取消"], ["Ctrl+Z", "Undo delete / 撤销删除"], ["Shift+Drag", "Reposition card / 移动卡片"],
  ["Z+Scroll", "Zoom week view / 缩放周视图"], ["←/→", "Previous/Next day / 前后日"],
];

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

  return (
    <div className="max-w-3xl mx-auto px-8 py-16">
      <Link href="/docs" className="text-xs text-white/20 hover:text-white/40 transition-colors mb-8 inline-block">{t.back_docs}</Link>
      <h1 className="text-4xl font-semibold tracking-tight mb-2 text-white/85" style={{ fontFamily: "'Clash Display', sans-serif" }}>{t.usage_title}</h1>
      <p className="text-white/30 mb-12">{t.usage_desc}</p>

      <div className="space-y-10">
        <section>
          <h3 className="text-lg font-semibold mb-4 text-white/70" style={{ fontFamily: "'Clash Display', sans-serif" }}>{t.usage_shortcuts}</h3>
          <div className="grid grid-cols-2 gap-2">
            {SHORTCUTS.map(([key, label]) => (
              <div key={key} className="flex items-center gap-3 text-sm">
                <kbd className="px-2 py-0.5 rounded text-[0.65rem] font-mono bg-white/[0.06] text-white/35 border border-white/[0.08]">{key}</kbd>
                <span className="text-white/35">{lang === "zh" ? label.split(" / ")[1] : label.split(" / ")[0]}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-4 text-white/70" style={{ fontFamily: "'Clash Display', sans-serif" }}>{t.usage_mouse}</h3>
          <div className="space-y-3 text-sm text-white/30 leading-relaxed">
            {interactions.map(([action, desc]) => (
              <p key={action}><strong className="text-white/50">{action}</strong> &mdash; {desc}</p>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

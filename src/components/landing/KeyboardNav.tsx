"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { useReveal } from "@/hooks/useScrollProgress";

const SHORTCUTS = [
  { keys: ["←", "→"], label: { zh: "前一天/后一天", en: "Prev/Next Day" } },
  { keys: ["T"], label: { zh: "今天", en: "Today" } },
  { keys: ["N"], label: { zh: "新建任务", en: "New Task" } },
  { keys: ["O"], label: { zh: "轨道模式", en: "Orbit Mode" } },
  { keys: ["Delete"], label: { zh: "删除选中", en: "Delete Selected" } },
  { keys: ["1", "2", "3", "4"], label: { zh: "类型筛选", en: "Filter by Type" } },
  { keys: ["0"], label: { zh: "清除筛选", en: "Clear Filter" } },
  { keys: ["Esc"], label: { zh: "关闭面板", en: "Close Panel" } },
];

export function KeyboardNav() {
  const lang = useLanguage();
  const { ref, visible } = useReveal(0.1);

  return (
    <section className="l-keys-section" ref={ref}>
      <div className="l-keys-inner">
        <h2
          className="l-keys-h2"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(18px)",
            transition: "opacity 0.6s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {lang === "zh" ? "全键盘操作" : "Full Keyboard Navigation"}
        </h2>
        <p
          className="l-keys-sub"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.5s 0.15s",
          }}
        >
          {lang === "zh" ? "每个操作，一次按键。" : "Every action, one keystroke away."}
        </p>

        <div className="l-keys-grid">
          {SHORTCUTS.map((s, i) => (
            <div
              key={i}
              className="l-keys-card"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.97)",
                transition: `opacity 0.4s ${0.05 + i * 0.06}s, transform 0.4s ${0.05 + i * 0.06}s cubic-bezier(0.16, 1, 0.3, 1)`,
              }}
            >
              <div className="l-keys-keys">
                {s.keys.map((k) => (
                  <kbd key={k} className="l-keys-kbd">{k}</kbd>
                ))}
              </div>
              <span className="l-keys-label">{s.label[lang === "zh" ? "zh" : "en"]}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

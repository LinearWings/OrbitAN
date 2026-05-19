"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useCinematicScroll } from "@/hooks/useCinematicScroll";

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
  const { ref: scrollRef, progress } = useScrollProgress();
  const { ref: cinematicRef } = useCinematicScroll({
    enter: { opacity: 0, translateY: 30 },
  });

  const headingProgress = Math.min(1, progress / 0.2);

  return (
    <section className="l-keys-section cinematic-fade" ref={(el) => { cinematicRef(el); scrollRef.current = el; }}>
      <div className="l-keys-inner">
        <h2 className="l-keys-h2" style={{
          opacity: headingProgress,
          transform: `translateY(${(1 - headingProgress) * 18}px)`,
        }}>
          {lang === "zh" ? "全键盘操作" : "Full Keyboard Navigation"}
        </h2>
        <p className="l-keys-sub" style={{
          opacity: Math.min(1, headingProgress - 0.2),
        }}>
          {lang === "zh" ? "每个操作，一次按键。" : "Every action, one keystroke away."}
        </p>

        <div className="l-keys-grid">
          {SHORTCUTS.map((s, i) => {
            const stagger = Math.max(0, (progress - 0.15) / 0.35);
            const cardProgress = Math.min(1, stagger - i * 0.04);
            const spring = cardProgress < 0
              ? 0
              : cardProgress < 0.7
                ? cardProgress / 0.7 * 1.08
                : 1.08 - (cardProgress - 0.7) / 0.3 * 0.08;
            const scale = Math.min(1.08, Math.max(0, spring));
            return (
              <div key={i} className="l-keys-card" style={{
                opacity: Math.min(1, cardProgress * 2),
                transform: `translateY(${(1 - scale) * 40}px) scale(${scale}) rotate(${-2 * (1 - Math.min(1, cardProgress))}deg)`,
              }}>
                <div className="l-keys-keys">
                  {s.keys.map((k) => (
                    <kbd key={k} className="l-keys-kbd">{k}</kbd>
                  ))}
                </div>
                <span className="l-keys-label">{s.label[lang === "zh" ? "zh" : "en"]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

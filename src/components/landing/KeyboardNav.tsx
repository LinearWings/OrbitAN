"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { useCinematicScroll } from "@/hooks/useCinematicScroll";
import { SectionParticles } from "./SectionParticles";

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
  const { ref: cinematicRef } = useCinematicScroll();

  return (
    <section className="l-keys-section cinematic-fade" ref={cinematicRef}>
      <SectionParticles count={10} color="rgba(59,130,246,.6)" />
      <div className="l-grid-overlay" style={{ backgroundImage: "linear-gradient(90deg,rgba(255,255,255,.015) 1px,transparent 1px),linear-gradient(0deg,rgba(255,255,255,.015) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="l-section-border-animated" style={{ "--border-color": "rgba(59,130,246,.3)" } as React.CSSProperties} />
      <div className="l-section-glow" style={{ top: "15%", right: "10%", width: 300, height: 300, background: "rgba(245,158,11,.15)" }} />
      <div className="l-section-glow" style={{ bottom: "20%", left: "10%", width: 250, height: 250, background: "rgba(59,130,246,.15)", animationDelay: "3s" }} />
      <div className="l-keys-inner">
        <h2 className="l-keys-h2">
          {lang === "zh" ? "全键盘操作" : "Full Keyboard Navigation"}
        </h2>
        <p className="l-keys-sub">
          {lang === "zh" ? "每个操作，一次按键。" : "Every action, one keystroke away."}
        </p>

        <div className="l-keys-grid">
          {SHORTCUTS.map((s, i) => (
            <div key={i} className="l-keys-card">
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

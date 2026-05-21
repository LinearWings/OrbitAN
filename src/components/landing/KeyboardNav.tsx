"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { useCinematicScroll } from "@/hooks/useCinematicScroll";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { SectionParticles } from "./SectionParticles";

const KEYBOARD_SHORTCUTS = [
  { keys: ["←", "→"], label: { zh: "前一天/后一天", en: "Prev/Next Day" } },
  { keys: ["T"], label: { zh: "今天", en: "Today" } },
  { keys: ["N"], label: { zh: "新建任务", en: "New Task" } },
  { keys: ["O"], label: { zh: "Orbit Mode", en: "Orbit Mode" } },
  { keys: ["Delete"], label: { zh: "删除选中", en: "Delete Selected" } },
  { keys: ["1", "2", "3", "4"], label: { zh: "类型筛选", en: "Filter by Type" } },
  { keys: ["0"], label: { zh: "清除筛选", en: "Clear Filter" } },
  { keys: ["Esc"], label: { zh: "关闭面板", en: "Close Panel" } },
];

const TOUCH_GESTURES_PHONE = [
  { icon: "←→", label: { zh: "左右滑动切换日期", en: "Swipe left/right to change day" } },
  { icon: "👆", label: { zh: "点击任务卡片选中", en: "Tap task card to select" } },
  { icon: "👆👆", label: { zh: "双击时钟创建任务", en: "Double-tap clock to create" } },
  { icon: "👈", label: { zh: "左滑任务卡片删除", en: "Swipe left to delete" } },
  { icon: "👆⏱", label: { zh: "长按触发更多操作", en: "Long-press for more actions" } },
  { icon: "↕️", label: { zh: "双指缩放周视图", en: "Pinch to zoom week view" } },
];

const TOUCH_GESTURES_IPAD = [
  { icon: "⌨", label: { zh: "外接键盘全快捷键", en: "Full keyboard shortcuts" } },
  { icon: "←→", label: { zh: "左右滑动/方向键切换日期", en: "Swipe or arrow keys" } },
  { icon: "👆", label: { zh: "点击/触控板选中", en: "Tap or trackpad select" } },
  { icon: "👆👆", label: { zh: "双击时钟创建任务", en: "Double-tap clock to create" } },
  { icon: "N", label: { zh: "按 N 键新建任务", en: "Press N for new task" } },
  { icon: "O", label: { zh: "按 O 键 Orbit Mode", en: "Press O for Orbit Mode" } },
  { icon: "↕️", label: { zh: "双指缩放/触控板缩放", en: "Pinch or trackpad zoom" } },
];

export function KeyboardNav() {
  const lang = useLanguage();
  const { ref: cinematicRef } = useCinematicScroll();
  const isPhone = useMediaQuery("(max-width: 767px)");
  const isIPad = useMediaQuery("(min-width: 768px) and (max-width: 1024px)");

  let title: string;
  let subtitle: string;
  let items: typeof KEYBOARD_SHORTCUTS | typeof TOUCH_GESTURES_PHONE | typeof TOUCH_GESTURES_IPAD;

  if (isPhone) {
    items = TOUCH_GESTURES_PHONE;
    title = lang === "zh" ? "触控手势" : "Touch Gestures";
    subtitle = lang === "zh" ? "每个操作，一次触控。" : "Every action, one touch away.";
  } else if (isIPad) {
    items = TOUCH_GESTURES_IPAD;
    title = lang === "zh" ? "iPad 操作" : "iPad Navigation";
    subtitle = lang === "zh" ? "触控 + 键盘，混合操作。" : "Touch + keyboard, hybrid control.";
  } else {
    items = KEYBOARD_SHORTCUTS;
    title = lang === "zh" ? "全键盘操作" : "Full Keyboard Navigation";
    subtitle = lang === "zh" ? "每个操作，一次按键。" : "Every action, one keystroke away.";
  }

  return (
    <section className="l-keys-section cinematic-fade" ref={cinematicRef}>
      <SectionParticles count={10} color="rgba(59,130,246,.4)" />
      {/* Subtle dot grid — less intrusive */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle 1px at center, rgba(255,255,255,.02) 0%, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="l-section-glow" style={{ top: "15%", right: "10%", width: 300, height: 300, background: "rgba(245,158,11,.08)" }} />
      <div className="l-section-glow" style={{ bottom: "20%", left: "10%", width: 250, height: 250, background: "rgba(59,130,246,.08)", animationDelay: "3s" }} />
      <div className="l-keys-inner">
        <h2 className="l-keys-h2">{title}</h2>
        <p className="l-keys-sub">{subtitle}</p>

        <div className="l-keys-grid">
          {items.map((s: { keys?: string[]; icon?: string; label: { zh: string; en: string } }, i: number) => (
            <div key={i} className="l-keys-card">
              <div className="l-keys-keys">
                {'keys' in s && s.keys ? (
                  (s.keys).map((k: string) => (
                    <kbd key={k} className="l-keys-kbd">{k}</kbd>
                  ))
                ) : (
                  <span className="text-base opacity-70">{(s as { icon: string }).icon}</span>
                )}
              </div>
              <span className="l-keys-label">{s.label[lang === "zh" ? "zh" : "en"]}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

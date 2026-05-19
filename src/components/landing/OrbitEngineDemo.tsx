"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useCinematicScroll } from "@/hooks/useCinematicScroll";
import { getT } from "@/lib/i18n";

const PANELS = [
  { id: "engine", icon: "R1", iconBg: "rgba(59,130,246,.12)", iconColor: "#3B82F6", titleKey: "feature_clock_title", descKey: "feature_clock_desc", fromX: -120, fromY: 0 },
  { id: "methods", icon: "Rx", iconBg: "rgba(99,102,241,.12)", iconColor: "#6366F1", titleKey: "feature_methods_title", descKey: "feature_methods_desc", fromX: 0, fromY: 80 },
  { id: "focus", icon: "Fc", iconBg: "rgba(245,158,11,.12)", iconColor: "#F59E0B", titleKey: "feature_focus_title", descKey: "feature_focus_desc", fromX: 120, fromY: 0 },
];

export function OrbitEngineDemo() {
  const lang = useLanguage();
  const t = getT(lang);
  const { ref: scrollRef, progress } = useScrollProgress();
  const { ref: cinematicRef } = useCinematicScroll({
    enter: { rotateX: 25, rotateY: -5, scale: 0.85, translateZ: -200, blur: 3, opacity: 0, mouseRotate: 3, mouseTranslate: 8 },
    origin: "center bottom",
  });

  const entrance = Math.min(1, progress / 0.5);
  const contentReveal = Math.max(0, Math.min(1, (progress - 0.5) / 0.3));

  return (
    <section className="l-engine cinematic-section" ref={(el) => { cinematicRef(el); scrollRef.current = el; }}>
      <div className="l-engine-inner">
        <div className="l-engine-deck">
          {PANELS.map((panel, i) => {
            const stagger = Math.max(0, entrance - i * 0.1);
            const cardProgress = Math.min(1, stagger / 0.8);
            const eased = 1 - Math.pow(1 - cardProgress, 3);
            return (
              <div
                key={panel.id}
                className="l-engine-card"
                style={{
                  opacity: eased,
                  transform: `translate(${panel.fromX * (1 - eased)}px, ${panel.fromY * (1 - eased)}px)`,
                  "--icon-r": parseInt(panel.iconColor.slice(1, 3), 16),
                  "--icon-g": parseInt(panel.iconColor.slice(3, 5), 16),
                  "--icon-b": parseInt(panel.iconColor.slice(5, 7), 16),
                } as React.CSSProperties}
              >
                <div className="l-engine-card-icon" style={{
                  background: panel.iconBg, color: panel.iconColor,
                  opacity: contentReveal > i * 0.15 ? 1 : 0,
                  transform: `scale(${contentReveal > i * 0.15 ? 1 : 0.5})`,
                  transition: "opacity 0.4s, transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                }}>
                  {panel.icon}
                </div>
                <h3 className="l-engine-card-h" style={{
                  opacity: contentReveal > i * 0.15 + 0.1 ? 1 : 0,
                  transform: `translateY(${contentReveal > i * 0.15 + 0.1 ? 0 : 12}px)`,
                  transition: "opacity 0.4s 0.1s, transform 0.4s 0.1s cubic-bezier(0.16,1,0.3,1)",
                }}>
                  {t[panel.titleKey as keyof typeof t]}
                </h3>
                <p className="l-engine-card-d" style={{
                  opacity: contentReveal > i * 0.15 + 0.2 ? 1 : 0,
                  transition: "opacity 0.4s 0.2s",
                }}>
                  {t[panel.descKey as keyof typeof t]}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

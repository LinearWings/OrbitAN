"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { useReveal } from "@/hooks/useScrollProgress";
import { getT } from "@/lib/i18n";

const PANELS = [
  {
    id: "engine",
    icon: "R1",
    iconBg: "rgba(59,130,246,.12)",
    iconColor: "#3B82F6",
    titleKey: "feature_clock_title",
    descKey: "feature_clock_desc",
  },
  {
    id: "methods",
    icon: "Rx",
    iconBg: "rgba(99,102,241,.12)",
    iconColor: "#6366F1",
    titleKey: "feature_methods_title",
    descKey: "feature_methods_desc",
  },
  {
    id: "focus",
    icon: "Fc",
    iconBg: "rgba(245,158,11,.12)",
    iconColor: "#F59E0B",
    titleKey: "feature_focus_title",
    descKey: "feature_focus_desc",
  },
];

export function OrbitEngineDemo() {
  const lang = useLanguage();
  const t = getT(lang);
  const { ref, visible } = useReveal(0.1);

  return (
    <section className="l-engine" ref={ref}>
      <div className="l-engine-inner">
        <div className="l-engine-deck">
          {PANELS.map((panel, i) => (
            <div
              key={panel.id}
              className="l-engine-card"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.5s ${0.1 + i * 0.15}s, transform 0.5s ${0.1 + i * 0.15}s cubic-bezier(0.16, 1, 0.3, 1)`,
                "--icon-r": parseInt(panel.iconColor.slice(1, 3), 16),
                "--icon-g": parseInt(panel.iconColor.slice(3, 5), 16),
                "--icon-b": parseInt(panel.iconColor.slice(5, 7), 16),
              } as React.CSSProperties}
            >
              <div
                className="l-engine-card-icon"
                style={{ background: panel.iconBg, color: panel.iconColor }}
              >
                {panel.icon}
              </div>
              <h3 className="l-engine-card-h">
                {t[panel.titleKey as keyof typeof t]}
              </h3>
              <p className="l-engine-card-d">
                {t[panel.descKey as keyof typeof t]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

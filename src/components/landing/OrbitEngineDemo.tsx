"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { useCinematicScroll } from "@/hooks/useCinematicScroll";
import { getT } from "@/lib/i18n";
import { SectionParticles } from "./SectionParticles";

const PANELS = [
  { id: "engine", icon: "R1", iconBg: "rgba(59,130,246,.12)", iconColor: "#3B82F6", titleKey: "feature_clock_title", descKey: "feature_clock_desc" },
  { id: "methods", icon: "Rx", iconBg: "rgba(99,102,241,.12)", iconColor: "#6366F1", titleKey: "feature_methods_title", descKey: "feature_methods_desc" },
  { id: "focus", icon: "Fc", iconBg: "rgba(245,158,11,.12)", iconColor: "#F59E0B", titleKey: "feature_focus_title", descKey: "feature_focus_desc" },
];

export function OrbitEngineDemo() {
  const lang = useLanguage();
  const t = getT(lang);
  const { ref: cinematicRef } = useCinematicScroll();

  return (
    <section className="l-engine cinematic-fade" ref={cinematicRef}>
      <SectionParticles count={12} color="rgba(99,102,241,.7)" />
      <div className="l-grid-overlay" style={{ backgroundImage: "radial-gradient(circle 1px at 50% 50%,rgba(255,255,255,.08) 0%,transparent 1px)", backgroundSize: "24px 24px" }} />
      <div className="l-section-glow" style={{ top: "20%", left: "70%", width: 350, height: 350, background: "rgba(99,102,241,.12)" }} />
      <div className="l-section-glow" style={{ bottom: "10%", left: "20%", width: 250, height: 250, background: "rgba(59,130,246,.08)", animationDelay: "3s" }} />
      <div className="l-engine-inner">
        <div className="l-engine-deck">
          {PANELS.map((panel) => (
            <div
              key={panel.id}
              className="l-engine-card"
              style={{
                "--icon-r": parseInt(panel.iconColor.slice(1, 3), 16),
                "--icon-g": parseInt(panel.iconColor.slice(3, 5), 16),
                "--icon-b": parseInt(panel.iconColor.slice(5, 7), 16),
              } as React.CSSProperties}
            >
              <div className="l-engine-card-icon" style={{ background: panel.iconBg, color: panel.iconColor }}>
                {panel.icon}
              </div>
              <h3 className="l-engine-card-h">{t[panel.titleKey as keyof typeof t]}</h3>
              <p className="l-engine-card-d">{t[panel.descKey as keyof typeof t]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

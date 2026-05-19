"use client";

import { useLanguage } from "@/hooks/useLanguage";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useCinematicScroll } from "@/hooks/useCinematicScroll";

const FOCUS_METHODS = [
  { id: "gtd", label: "GTD", color: "#22C55E" },
  { id: "pomodoro", label: "Pomodoro", color: "#EF4444" },
  { id: "pareto", label: "Pareto", color: "#2563EB" },
  { id: "moffatt", label: "Moffatt", color: "#7C3AED" },
  { id: "howell", label: "Howell", color: "#F97316" },
  { id: "swot", label: "SWOT", color: "#EAB308" },
];

export function FocusBlocksDemo() {
  const lang = useLanguage();
  const { ref: scrollRef, progress } = useScrollProgress();
  const { ref: cinematicRef } = useCinematicScroll({
    enter: { opacity: 0, translateY: 25 },
  });

  const housingOpacity = Math.min(1, progress / 0.3);
  const arcProgress = Math.max(0, Math.min(1, (progress - 0.3) / 0.5));
  const legendProgress = Math.max(0, (progress - 0.8) / 0.2);

  return (
    <section className="l-focus cinematic-fade" ref={(el) => { cinematicRef(el); scrollRef.current = el; }}>
      <div className="l-focus-inner">
        <div className="l-focus-clock" style={{ opacity: housingOpacity }}>
          <svg viewBox="0 0 220 220" className="l-focus-clock-svg">
            <defs>
              <filter id="focusGlow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <circle className="l-focus-ring" cx="110" cy="110" r="85" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            <circle className="l-focus-ring" cx="110" cy="110" r="65" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            <circle className="l-focus-ring" cx="110" cy="110" r="45" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />

            {FOCUS_METHODS.map((m, i) => {
              const r = 90 + i * 3.5;
              const startAngle = (i / 6) * Math.PI * 2 - Math.PI / 2;
              const sweep = (0.22 + (i / FOCUS_METHODS.length) * 0.22) * Math.PI * 2;
              const circumference = r * sweep;
              const drawn = arcProgress * circumference;
              const rd = (v: number) => Math.round(v * 1e6) / 1e6;
              const x1 = rd(110 + r * Math.cos(startAngle));
              const y1 = rd(110 + r * Math.sin(startAngle));
              const x2 = rd(110 + r * Math.cos(startAngle + sweep));
              const y2 = rd(110 + r * Math.sin(startAngle + sweep));
              const largeArc = sweep > Math.PI ? 1 : 0;
              return (
                <path
                  key={m.id}
                  className="l-focus-arc"
                  d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
                  fill="none"
                  stroke={m.color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  filter="url(#focusGlow)"
                  opacity="0.7"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - drawn}
                />
              );
            })}

            <line x1="110" y1="110" x2="110" y2="40" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="110" y1="110" x2="160" y2="110" stroke="rgba(255,255,255,0.18)" strokeWidth="1" strokeLinecap="round" />
            <circle className="l-focus-hub" cx="110" cy="110" r="3" fill="#3B82F6" />
          </svg>
        </div>

        <div className="l-focus-content">
          <h2 className="l-focus-h2" style={{
            opacity: housingOpacity,
            transform: `translateY(${(1 - housingOpacity) * 18}px)`,
          }}>
            {lang === "zh" ? "专注块系统" : "Focus Blocks"}
          </h2>
          <p className="l-focus-desc" style={{ opacity: Math.min(1, housingOpacity + 0.2) }}>
            {lang === "zh"
              ? "将方法论会话时间盒化，显示在时钟外环。planned → active → paused → completed。"
              : "Time-box your methodology sessions. Visualized as colored arcs on the clock's outer rings."}
          </p>

          <div className="l-focus-legend">
            {FOCUS_METHODS.map((m, i) => (
              <span key={m.id} className="l-focus-legend-item" style={{
                opacity: Math.max(0, Math.min(1, (legendProgress - i * 0.1) / 0.5)),
                transform: `translateY(${Math.max(0, (1 - Math.min(1, (legendProgress - i * 0.1) / 0.5))) * 10}px)`,
              }}>
                <span className="l-focus-legend-dot" style={{ background: m.color }} />
                {m.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

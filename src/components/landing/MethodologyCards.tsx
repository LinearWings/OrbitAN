"use client";

import { useCallback } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useReveal } from "@/hooks/useScrollProgress";

const METHODS = [
  {
    id: "gtd",
    tag: "kanban • workflow • capture",
    name: { zh: "GTD 搞定工作法", en: "GTD" },
    desc: { zh: "五阶段看板：收集→下一步→等待→将来→完成", en: "5-stage kanban: inbox→next→waiting→someday→done" },
    color: "#22C55E",
  },
  {
    id: "pomodoro",
    tag: "timer • focus • cycles",
    name: { zh: "番茄工作法", en: "Pomodoro" },
    desc: { zh: "25 分钟专注 / 5 分钟休息，每 4 轮长休", en: "25min focus / 5min break, long break every 4" },
    color: "#EF4444",
  },
  {
    id: "pareto",
    tag: "80/20 • analysis • impact",
    name: { zh: "帕累托法则", en: "Pareto" },
    desc: { zh: "80/20 分析，影响力/ effort 评分", en: "80/20 analysis with impact/effort scoring" },
    color: "#2563EB",
  },
  {
    id: "moffatt",
    tag: "sessions • endurance • timing",
    name: { zh: "莫法特休息法", en: "Moffatt" },
    desc: { zh: "8×25 分钟定时会话，进度追踪", en: "8×25min timed sessions with progress tracking" },
    color: "#7C3AED",
  },
  {
    id: "howell",
    tag: "matrix • priority • urgency",
    name: { zh: "豪威尔矩阵", en: "Howell Matrix" },
    desc: { zh: "紧急/重要四象限，拖拽排序", en: "Urgent/important quadrants, drag-and-drop" },
    color: "#F97316",
  },
  {
    id: "swot",
    tag: "analysis • strategy • assessment",
    name: { zh: "SWOT 分析", en: "SWOT" },
    desc: { zh: "优势/劣势/机会/威胁四格分析", en: "Strengths/weaknesses/opportunities/threats" },
    color: "#EAB308",
  },
];

export function MethodologyCards() {
  const lang = useLanguage();
  const { ref, visible } = useReveal(0.05);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty("--mx", `${x}%`);
    e.currentTarget.style.setProperty("--my", `${y}%`);
  }, []);

  return (
    <section className="l-methods" ref={ref}>
      <div className="l-methods-inner">
        <div className="l-methods-top">
          <h2
            className="l-methods-h2"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(18px)",
              transition: "opacity 0.6s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {lang === "zh" ? "六维时间管理" : "Six Dimensions of Time Management"}
          </h2>
          <p
            className="l-methods-disc"
            style={{
              opacity: visible ? 1 : 0,
              transition: "opacity 0.5s 0.15s",
            }}
          >
            {lang === "zh"
              ? "六种经典方法论，各有专属面板。"
              : "Six proven methodologies, each with its own dedicated panel."}
          </p>
        </div>

        <div className="l-methods-grid">
          {METHODS.map((m, i) => (
            <div
              key={m.id}
              className="l-method-card"
              onMouseMove={handleMouseMove}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.5s ${0.1 + i * 0.08}s, transform 0.5s ${0.1 + i * 0.08}s cubic-bezier(0.16, 1, 0.3, 1)`,
              }}
            >
              <span
                className="l-method-tag"
                style={{
                  color: m.color,
                  background: `${m.color}18`,
                }}
              >
                {m.tag}
              </span>
              <h3 className="l-method-name" style={{ color: m.color }}>
                {m.name[lang === "zh" ? "zh" : "en"]}
              </h3>
              <p className="l-method-desc">{m.desc[lang === "zh" ? "zh" : "en"]}</p>
              <div className="l-method-preview" style={{ borderColor: `${m.color}20` }}>
                <div className="l-method-preview-inner" style={{ background: `${m.color}08` }}>
                  {m.id === "gtd" && <GTDPreview color={m.color} />}
                  {m.id === "pomodoro" && <PomodoroPreview color={m.color} />}
                  {m.id === "pareto" && <ParetoPreview color={m.color} />}
                  {m.id === "moffatt" && <MoffattPreview color={m.color} />}
                  {m.id === "howell" && <HowellPreview color={m.color} />}
                  {m.id === "swot" && <SWOTPreview color={m.color} />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GTDPreview({ color }: { color: string }) {
  const cols = ["Inbox", "Next", "Waiting", "Done"];
  return (
    <div className="l-method-gtd">
      {cols.map((c) => (
        <div key={c} className="l-method-gtd-col">
          <span className="l-method-gtd-label" style={{ color }}>{c}</span>
          <div className="l-method-gtd-item" style={{ borderColor: `${color}30` }} />
          <div className="l-method-gtd-item" style={{ borderColor: `${color}30`, opacity: 0.5 }} />
        </div>
      ))}
    </div>
  );
}

function PomodoroPreview({ color }: { color: string }) {
  return (
    <div className="l-method-pomodoro">
      <div className="l-method-pomodoro-ring">
        <svg viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="16" fill="none" stroke={`${color}20`} strokeWidth="2" />
          <circle cx="20" cy="20" r="16" fill="none" stroke={color} strokeWidth="2"
            strokeDasharray={`${2 * Math.PI * 16 * 0.65} ${2 * Math.PI * 16}`}
            strokeDashoffset={0}
            transform="rotate(-90 20 20)"
          />
          <text x="20" y="22" textAnchor="middle" fill={color} fontSize="8" fontFamily="JetBrains Mono, monospace">25</text>
        </svg>
      </div>
      <div className="l-method-pomodoro-dots">
        {[1, 2, 3, 4].map((i) => (
          <span key={i} className="l-method-pomodoro-dot" style={{ background: i <= 2 ? color : `${color}20` }} />
        ))}
      </div>
    </div>
  );
}

function ParetoPreview({ color }: { color: string }) {
  const bars = [85, 60, 35, 20, 10];
  return (
    <div className="l-method-pareto">
      <div className="l-method-pareto-bars">
        {bars.map((h, i) => (
          <div key={i} className="l-method-pareto-bar" style={{
            height: `${h}%`,
            background: i === 0 ? color : `${color}40`,
          }} />
        ))}
      </div>
    </div>
  );
}

function MoffattPreview({ color }: { color: string }) {
  return (
    <div className="l-method-moffatt">
      {Array.from({ length: 8 }).map((_, i) => (
        <span key={i} className="l-method-moffatt-block" style={{
          background: i < 5 ? color : `${color}15`,
        }} />
      ))}
    </div>
  );
}

function HowellPreview({ color }: { color: string }) {
  const labels = ["Urgent\nImportant", "Not Urgent\nImportant", "Urgent\nNot Important", "Neither"];
  return (
    <div className="l-method-howell">
      {labels.map((l, i) => (
        <div key={i} className="l-method-howell-quad" style={{ borderColor: `${color}15` }}>
          <span className="l-method-howell-label" style={{ color: i === 0 ? color : `${color}60` }}>
            {l}
          </span>
        </div>
      ))}
    </div>
  );
}

function SWOTPreview({ color }: { color: string }) {
  const labels = ["S", "W", "O", "T"];
  return (
    <div className="l-method-swot">
      {labels.map((l, i) => (
        <div key={i} className="l-method-swot-quad" style={{ borderColor: `${color}15` }}>
          <span className="l-method-swot-label" style={{ color: i === 0 ? color : `${color}60` }}>{l}</span>
        </div>
      ))}
    </div>
  );
}

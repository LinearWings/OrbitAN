"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";

const METHODS = [
  { nameEn: "GTD — Getting Things Done", nameZh: "GTD — 搞定", color: "#22C55E", descEn: "Five-stage kanban: Inbox → Next Actions → Waiting → Someday → Done. Capture everything, clarify next steps, and organize by context.", descZh: "五阶段看板：收集箱 → 下一步行动 → 等待 → 将来/也许 → 已完成。捕获一切、理清下一步、按情境组织。" },
  { nameEn: "Pomodoro Technique", nameZh: "番茄工作法", color: "#EF4444", descEn: "25-minute focus sessions with 5-minute breaks. Every 4 sessions triggers a longer 15-minute break. Built-in phase tracking with visual countdown.", descZh: "25 分钟专注 + 5 分钟休息。每 4 轮触发一次 15 分钟长休息。内建阶段追踪与可视化倒计时。" },
  { nameEn: "Pareto Principle (80/20)", nameZh: "帕累托原则 (80/20)", color: "#3B82F6", descEn: "Identify the 20% of tasks that yield 80% of results. Score tasks by impact and effort. Vital few tasks are highlighted automatically.", descZh: "识别产生产出 80% 的 20% 任务。按影响力和努力度评分。关键的少数自动高亮。" },
  { nameEn: "Moffatt Rest Method", nameZh: "莫法特休息法", color: "#8B5CF6", descEn: "8 timed sessions of 25 minutes each. Alternate between different types of work to maintain freshness and prevent mental fatigue.", descZh: "8 个 25 分钟定时任务段。在不同类型的工作间交替切换，保持新鲜感、防止心理疲劳。" },
  { nameEn: "Howell Matrix", nameZh: "豪威尔矩阵", color: "#F97316", descEn: "Urgent/Important quadrants. Classify tasks into four zones and prioritize accordingly. Visual matrix with drag-and-drop organization.", descZh: "紧急/重要四象限。将任务归入四个区域并按优先级排序。可视化矩阵，支持拖拽整理。" },
  { nameEn: "SWOT Analysis", nameZh: "SWOT 分析", color: "#EAB308", descEn: "Strengths, Weaknesses, Opportunities, Threats. Strategic planning tool for project-level thinking integrated into daily scheduling.", descZh: "优势、劣势、机会、威胁。项目级战略规划工具，集成到日常计划中。" },
];

export default function MethodologyPage() {
  const lang = useLanguage();
  const t = getT(lang);

  return (
    <div className="max-w-3xl mx-auto px-8 py-16">
      <Link href="/docs" className="text-xs text-white/20 hover:text-white/40 transition-colors mb-8 inline-block">{t.back_docs}</Link>
      <h1 className="text-4xl font-semibold tracking-tight mb-2 text-white/85" style={{ fontFamily: "'Clash Display', sans-serif" }}>{t.methodology_title}</h1>
      <p className="text-white/30 mb-12">{t.methodology_desc}</p>

      <div className="space-y-10">
        {METHODS.map((m) => (
          <div key={m.nameEn} className="flex gap-5">
            <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: m.color, boxShadow: `0 0 8px ${m.color}50` }} />
            <div>
              <h3 className="text-base font-semibold mb-2 text-white/75" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                {lang === "zh" ? m.nameZh : m.nameEn}
              </h3>
              <p className="text-sm text-white/30 leading-relaxed">{lang === "zh" ? m.descZh : m.descEn}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

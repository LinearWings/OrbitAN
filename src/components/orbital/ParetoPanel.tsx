"use client";

import React, { useEffect, useState } from "react";
import type { ParetoItem } from "@/types";
import { calculateParetoScores } from "@/utils/pareto";
import { loadMethodologyData, saveMethodologyData } from "@/utils/storage";
import { uid } from "@/utils/uid";

type NewItem = Omit<ParetoItem, "score" | "isVital">;

const glassStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.06) 100%)",
  border: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
};

export default function ParetoPanel() {
  const [items, setItems] = useState<ParetoItem[]>(() => {
    const saved = loadMethodologyData<ParetoItem[]>("pareto");
    return saved ?? [];
  });
  const [name, setName] = useState("");
  const [impact, setImpact] = useState(50);
  const [effort, setEffort] = useState(50);

  useEffect(() => {
    saveMethodologyData("pareto", items);
  }, [items]);

  const addItem = () => {
    if (!name.trim()) return;
    const id = uid();
    const base: NewItem = { id, content: name.trim(), impact, effort };
    const next = calculateParetoScores([...items, base]);
    setItems(next);
    setName("");
    setImpact(50);
    setEffort(50);
  };

  const removeItem = (id: string) => {
    const rest = items.filter((it) => it.id !== id);
    setItems(
      calculateParetoScores(
        rest.map(({ id, content, impact, effort }) => ({ id, content, impact, effort }))
      )
    );
  };

  const vitalItems = items.filter((i) => i.isVital);
  const restItems = items.filter((i) => !i.isVital);
  const totalScore = items.reduce((sum, i) => sum + i.score, 0) || 0;
  const totalImpact = items.reduce((sum, i) => sum + i.impact, 0);
  const vitalScore = vitalItems.reduce((s, i) => s + i.score, 0);
  const vitalShare = totalScore > 0 ? Math.round((vitalScore / totalScore) * 100) : 0;

  // Sorted by score descending for bar chart
  const sortedByScore = [...items].sort((a, b) => b.score - a.score);
  const maxScore = sortedByScore[0]?.score || 1;

  // SVG progress ring
  const ringR = 32;
  const ringCircumference = 2 * Math.PI * ringR;
  const ringOffset = ringCircumference * (1 - vitalShare / 100);

  return (
    <div className="orbit-pareto-panel p-4 rounded-2xl" style={glassStyle}>
      {/* Header with total impact ring */}
      <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <svg width="44" height="44" viewBox="0 0 72 72" className="shrink-0">
            <circle
              cx="36" cy="36" r={ringR}
              fill="none" stroke="rgba(255,255,255,0.08)"
              strokeWidth="5"
            />
            <circle
              cx="36" cy="36" r={ringR}
              fill="none" stroke="#2563EB"
              strokeWidth="5"
              strokeDasharray={ringCircumference}
              strokeDashoffset={ringOffset}
              strokeLinecap="round"
              transform="rotate(-90, 36, 36)"
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
            <text
              x="36" y="36"
              textAnchor="middle" dominantBaseline="central"
              fill="rgba(255,255,255,0.9)"
              fontSize="11"
              fontFamily="JetBrains Mono, monospace"
            >
              {vitalShare}%
            </text>
          </svg>
          <div>
            <div className="text-xs text-white/50">Total Impact</div>
            <div className="text-lg font-bold text-white tabular-nums">{totalImpact}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-white/50">Vital contributes</div>
          <div className="text-lg font-bold text-blue-400">{vitalShare}%</div>
        </div>
      </div>

      {/* Input area */}
      <div className="mb-3">
        <input
          className="w-full rounded-lg px-3 py-2.5 bg-white/10 text-white border border-white/20 placeholder:text-white/40 text-sm outline-none focus:border-blue-500/50 transition-colors"
          placeholder="任务名称"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addItem();
          }}
        />
        <div className="flex items-center mt-2 gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-white/50">Impact</span>
              <span style={{ color: "#2563EB" }}>{impact}</span>
            </div>
            <input
              type="range" min={0} max={100} value={impact}
              onChange={(e) => setImpact(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: "#2563EB" }}
            />
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-white/50">Effort</span>
              <span style={{ color: "#EAB308" }}>{effort}</span>
            </div>
            <input
              type="range" min={0} max={100} value={effort}
              onChange={(e) => setEffort(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: "#EAB308" }}
            />
          </div>
          <button
            className="px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm whitespace-nowrap hover:bg-blue-500 transition-colors font-medium"
            onClick={addItem}
          >
            添加
          </button>
        </div>
      </div>

      {/* Bar chart — 80/20 distribution */}
      {items.length > 0 && (
        <div className="mb-4 p-3 rounded-xl" style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div className="text-xs text-white/40 mb-2 font-medium">80/20 Distribution</div>
          <div className="space-y-1.5">
            {sortedByScore.map((item, idx) => {
              const pct = maxScore > 0 ? (item.score / maxScore) * 100 : 0;
              const cumBefore = sortedByScore.slice(0, idx).reduce((s, i) => s + i.score, 0);
              const cumPct = totalScore > 0 ? Math.round(((cumBefore + item.score) / totalScore) * 100) : 0;
              return (
                <div key={item.id} className="flex items-center gap-2">
                  <span className="text-xs text-white/40 w-5 text-right tabular-nums shrink-0">{idx + 1}</span>
                  <div className="flex-1 h-6 rounded relative overflow-hidden" style={{
                    background: "rgba(255,255,255,0.04)",
                  }}>
                    <div
                      className="h-full rounded transition-all duration-500"
                      style={{
                        width: `${Math.max(pct, 3)}%`,
                        background: item.isVital
                          ? "linear-gradient(90deg, #2563EB, #3B82F6)"
                          : "rgba(255,255,255,0.12)",
                        minWidth: 20,
                      }}
                    />
                    <span
                      className="absolute left-2 top-0 text-xs leading-6 truncate"
                      style={{
                        color: item.isVital ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.6)",
                        maxWidth: "calc(100% - 56px)",
                      }}
                    >
                      {item.content}
                    </span>
                  </div>
                  <span className="text-xs text-white/50 w-10 text-right tabular-nums shrink-0">{cumPct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Items columns */}
      <div className="pareto-columns grid grid-cols-2 gap-4 auto-rows-fr">
        {/* Vital column */}
        <div>
          <div className="text-sm font-semibold text-blue-400 mb-2 border-b border-white/10 pb-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
            Vital 20%
          </div>
          <div className="space-y-2">
            {vitalItems.length === 0 && (
              <div className="text-sm text-white/40 py-2">暂无数据</div>
            )}
            {vitalItems.map((it) => (
              <div
                key={it.id}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg border"
                style={{
                  borderLeft: "3px solid #2563EB",
                  borderColor: "rgba(37,99,235,0.2) rgba(255,255,255,0.08) rgba(255,255,255,0.08)",
                  background: "rgba(37,99,235,0.06)",
                }}
              >
                <div className="flex-1 flex items-center gap-2 min-w-0">
                  <span className="text-[10px] bg-blue-600/80 text-white px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider shrink-0">
                    关键
                  </span>
                  <span className="truncate text-sm text-white/90">{it.content}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs" style={{ color: "#2563EB" }}>{it.impact}</span>
                  <span className="text-xs text-amber-400/70">/ {it.effort}</span>
                  <span className="inline-flex items-center justify-center min-w-[24px] bg-blue-600/80 text-white text-[11px] px-2 py-0.5 rounded-full font-semibold tabular-nums">
                    {it.score}
                  </span>
                </div>
                <button
                  className="ml-2 text-white/30 hover:text-white/80 transition-colors shrink-0"
                  onClick={() => removeItem(it.id)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* Rest column */}
        <div>
          <div className="text-sm font-semibold text-white/40 mb-2 border-b border-white/10 pb-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white/20 inline-block" />
            Rest 80%
          </div>
          <div className="space-y-2">
            {restItems.length === 0 && (
              <div className="text-sm text-white/40 py-2">暂无数据</div>
            )}
            {restItems.map((it) => (
              <div
                key={it.id}
                className="flex items-center justify-between px-3 py-2 rounded-lg border border-white/08"
                style={{ opacity: 0.65, background: "rgba(255,255,255,0.02)" }}
              >
                <div className="flex-1 min-w-0">
                  <span className="truncate text-sm text-white/60 block">{it.content}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-white/40">{it.impact}</span>
                  <span className="text-xs text-white/30">/ {it.effort}</span>
                  <span className="inline-flex items-center justify-center min-w-[24px] bg-white/10 text-white/50 text-[11px] px-2 py-0.5 rounded-full tabular-nums">
                    {it.score}
                  </span>
                </div>
                <button
                  className="ml-2 text-white/30 hover:text-white/80 transition-colors shrink-0"
                  onClick={() => removeItem(it.id)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 text-white/40">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3 opacity-40">
            <path d="M3 3v18h18" />
            <path d="M7 16l4-8 4 4 4-6" />
          </svg>
          <div className="text-sm text-white/60">添加任务开始帕累托分析</div>
          <div className="text-xs text-white/30 mt-1 text-center max-w-[240px]">
            输入任务名称，调整 Impact 和 Effort，系统自动筛选关键因素
          </div>
        </div>
      )}
    </div>
  );
}

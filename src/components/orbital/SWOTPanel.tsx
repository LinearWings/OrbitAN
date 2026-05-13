"use client";

import React, { useEffect, useState, type CSSProperties } from "react";
import { CloseIcon } from "@/components/ui/Icons";
import type { SWOTData, QuadrantItem } from "@/types";
import { loadMethodologyData, saveMethodologyData } from "@/utils/storage";
import { uid } from "@/utils/uid";

const METHODOLOGY_KEY = "swot";

const SECTION_CONFIG: Record<
  keyof SWOTData,
  { title: string; hex: string; label: string }
> = {
  strengths: { title: "Strengths", hex: "#22C55E", label: "优势" },
  weaknesses: { title: "Weaknesses", hex: "#EF4444", label: "劣势" },
  opportunities: { title: "Opportunities", hex: "#2563EB", label: "机会" },
  threats: { title: "Threats", hex: "#F97316", label: "威胁" },
};

const glassStyle: CSSProperties = {
  background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.06) 100%)",
  border: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
};

function Quad({
  title,
  color,
  label,
  items,
  onAdd,
  onDelete,
}: {
  title: string;
  color: string;
  label: string;
  items: QuadrantItem[];
  onAdd: (content: string) => void;
  onDelete: (id: string) => void;
}) {
  const [input, setInput] = useState("");

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        ...glassStyle,
        borderTop: `3px solid ${color}`,
        minHeight: 120,
      }}
    >
      <div className="p-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
              style={{ background: color }}
            />
            <span className="font-semibold text-sm" style={{ color }}>
              {title}
            </span>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded font-medium uppercase tracking-wider"
              style={{
                background: `${color}20`,
                color,
                border: `1px solid ${color}30`,
              }}
            >
              {label}
            </span>
          </div>
          <span className="text-xs text-white/40">{items.length} 条</span>
        </div>

        {/* Input */}
        <div className="mb-2">
          <input
            className="w-full rounded-lg px-3 py-2 bg-white/10 text-white text-sm border placeholder:text-white/30 outline-none transition-colors"
            style={{ borderColor: "rgba(255,255,255,0.15)" }}
            placeholder="添加项..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onAdd(input);
                setInput("");
              }
            }}
          />
        </div>

        {/* Items */}
        <div className="flex flex-col gap-1.5" aria-label={title}>
          {items.map((it) => (
            <div
              key={it.id}
              className="flex items-center justify-between rounded-lg px-3 py-2 group transition-colors"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderLeft: `3px solid ${color}40`,
              }}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: color }}
                />
                <span className="text-sm text-white/80 truncate">{it.content}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] text-white/30">
                  {new Date(it.createdAt).toLocaleDateString()}
                </span>
                <button
                  className="invisible group-hover:visible text-white/30 hover:text-white/80 transition-colors"
                  onClick={() => onDelete(it.id)}
                >
                  <CloseIcon size={14} />
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-xs text-white/30 py-2 text-center">暂无数据</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SWOTPanel() {
  const [data, setData] = useState<SWOTData>(() => {
    const saved = loadMethodologyData<SWOTData>(METHODOLOGY_KEY);
    return saved ?? { strengths: [], weaknesses: [], opportunities: [], threats: [] };
  });

  useEffect(() => {
    saveMethodologyData(METHODOLOGY_KEY, data);
  }, [data]);

  const add = (section: keyof SWOTData, content: string) => {
    if (!content.trim()) return;
    const item: QuadrantItem = {
      id: uid(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };
    setData((d) => {
      const next = { ...d } as SWOTData;
      next[section] = [...(next[section] ?? []), item];
      return next;
    });
  };

  const remove = (section: keyof SWOTData, id: string) => {
    setData((d) => {
      const next = { ...d } as SWOTData;
      next[section] = (next[section] ?? []).filter((it) => it.id !== id);
      return next;
    });
  };

  const panels: {
    key: keyof SWOTData;
    title: string;
    hex: string;
    label: string;
  }[] = [
    { key: "strengths", ...SECTION_CONFIG.strengths },
    { key: "weaknesses", ...SECTION_CONFIG.weaknesses },
    { key: "opportunities", ...SECTION_CONFIG.opportunities },
    { key: "threats", ...SECTION_CONFIG.threats },
  ];

  return (
    <div
      className="orbit-panel swot grid grid-cols-2 gap-3 p-4 rounded-2xl"
      style={glassStyle}
    >
      {panels.map((p) => (
        <Quad
          key={p.key}
          title={p.title}
          color={p.hex}
          label={p.label}
          items={data[p.key]}
          onAdd={(c) => add(p.key, c)}
          onDelete={(id) => remove(p.key, id)}
        />
      ))}
    </div>
  );
}

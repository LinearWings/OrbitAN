"use client";

import React, { useEffect, useState, type CSSProperties } from "react";
import { CloseIcon } from "@/components/ui/Icons";
import type { HowellMatrixData, QuadrantItem } from "@/types";
import { loadMethodologyData, saveMethodologyData } from "@/utils/storage";
import { uid } from "@/utils/uid";

const METHODOLOGY_KEY = "howell";
type QuadKey = keyof HowellMatrixData;

const QUADRANT_COLORS: Record<QuadKey, { hex: string; label: string }> = {
  urgentImportant: { hex: "#EF4444", label: "紧急·重要" },
  urgentNotImportant: { hex: "#F97316", label: "紧急·不重要" },
  notUrgentImportant: { hex: "#2563EB", label: "不紧急·重要" },
  notUrgentNotImportant: { hex: "#6B7280", label: "不紧急·不重要" },
};

const glassStyle: CSSProperties = {
  background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.06) 100%)",
  border: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
};

function QuadrantCard({
  title,
  items,
  onAdd,
  onMove,
  onDelete,
  keyName,
}: {
  title: string;
  items: QuadrantItem[];
  onAdd: (text: string) => void;
  onMove: (payload: { id: string; from: string; to: string }) => void;
  onDelete: (id: string) => void;
  keyName: QuadKey;
}) {
  const [input, setInput] = useState("");
  const color = QUADRANT_COLORS[keyName].hex;

  return (
    <div
      data-howell-quadrant={keyName}
      className="rounded-xl overflow-hidden"
      style={{
        ...glassStyle,
        borderTop: `3px solid ${color}`,
        minHeight: 140,
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        const payload = e.dataTransfer.getData("application/json");
        if (payload) {
          const data = JSON.parse(payload);
          onMove({ id: data.id, from: data.from, to: keyName as string });
        }
      }}
    >
      <div className="p-3">
        {/* Header with color accent */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
              style={{ background: color }}
            />
            <span className="font-semibold text-sm" style={{ color }}>
              {title}
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
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData(
                  "application/json",
                  JSON.stringify({ id: it.id, from: keyName })
                );
              }}
              onTouchStart={(e) => {
                if (e.touches.length !== 1) return;
                const t = e.touches[0]!;
                (e.currentTarget as HTMLElement).dataset.touchDragId = it.id;
                (e.currentTarget as HTMLElement).dataset.touchDragFrom = keyName;
                (e.currentTarget as HTMLElement).dataset.touchStartX = String(t.clientX);
                (e.currentTarget as HTMLElement).dataset.touchStartY = String(t.clientY);
                (e.currentTarget as HTMLElement).dataset.touchMoved = "false";
              }}
              onTouchMove={(e) => {
                const el = e.currentTarget as HTMLElement;
                if (!el.dataset.touchDragId) return;
                const sx = Number(el.dataset.touchStartX);
                const sy = Number(el.dataset.touchStartY);
                const t = e.touches[0]!;
                if (el.dataset.touchMoved === "false" && Math.abs(t.clientX - sx) + Math.abs(t.clientY - sy) < 8) return;
                el.dataset.touchMoved = "true";
                e.preventDefault();
              }}
              onTouchEnd={(e) => {
                const el = e.currentTarget as HTMLElement;
                const id = el.dataset.touchDragId;
                const from = el.dataset.touchDragFrom;
                const moved = el.dataset.touchMoved === "true";
                delete el.dataset.touchDragId;
                delete el.dataset.touchDragFrom;
                delete el.dataset.touchStartX;
                delete el.dataset.touchStartY;
                delete el.dataset.touchMoved;
                if (!id || !from || !moved) return;
                const t = e.changedTouches[0]!;
                const targetEl = document.elementFromPoint(t.clientX, t.clientY);
                const quadrantEl = targetEl?.closest("[data-howell-quadrant]");
                if (quadrantEl) {
                  const to = quadrantEl.getAttribute("data-howell-quadrant");
                  if (to && to !== from) {
                    onMove({ id, from, to });
                  }
                }
              }}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderLeft: `3px solid ${color}40`,
                touchAction: "none",
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
            <div className="text-xs text-white/30 py-2 text-center">拖拽任务到此处</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HowellMatrix() {
  const [data, setData] = useState<HowellMatrixData>(() => {
    const saved = loadMethodologyData<HowellMatrixData>(METHODOLOGY_KEY);
    return saved ?? {
      urgentImportant: [],
      urgentNotImportant: [],
      notUrgentImportant: [],
      notUrgentNotImportant: [],
    };
  });

  useEffect(() => {
    saveMethodologyData(METHODOLOGY_KEY, data);
  }, [data]);

  const addItem = (key: QuadKey, text: string) => {
    if (!text.trim()) return;
    const item: QuadrantItem = {
      id: uid(),
      content: text.trim(),
      createdAt: new Date().toISOString(),
    };
    setData((d) => {
      const next = { ...d } as HowellMatrixData;
      next[key] = [...(next[key] ?? []), item];
      return next;
    });
  };

  const removeItem = (key: QuadKey, id: string) => {
    setData((d) => {
      const next = { ...d } as HowellMatrixData;
      next[key] = (next[key] ?? []).filter((it) => it.id !== id);
      return next;
    });
  };

  const moveItem = (payload: { id: string; from: string; to: string }) => {
    const fromKey = payload.from as QuadKey;
    const toKey = payload.to as QuadKey;
    setData((d) => {
      const source = [...(d[fromKey] ?? [])];
      const idx = source.findIndex((it) => it.id === payload.id);
      if (idx < 0) return d;
      const [item] = source.splice(idx, 1);
      const next: HowellMatrixData = {
        ...d,
        [fromKey]: source,
        [toKey]: [...(d[toKey] ?? []), item],
      };
      return next;
    });
  };

  const quadrants: { key: QuadKey; title: string }[] = [
    { key: "urgentImportant", title: "紧急·重要 (Urgent + Important)" },
    { key: "urgentNotImportant", title: "紧急·不重要 (Urgent + Not Important)" },
    { key: "notUrgentImportant", title: "不紧急·重要 (Not Urgent + Important)" },
    { key: "notUrgentNotImportant", title: "不紧急·不重要 (Not Urgent + Not Important)" },
  ];

  return (
    <div
      className="orbit-panel howell matrix grid grid-cols-2 gap-3 p-4 rounded-2xl"
      style={glassStyle}
    >
      {quadrants.map((q) => (
        <QuadrantCard
          key={q.key}
          title={q.title}
          items={data[q.key] ?? []}
          onAdd={(t) => addItem(q.key, t)}
          onMove={moveItem}
          onDelete={(id) => removeItem(q.key, id)}
          keyName={q.key}
        />
      ))}
    </div>
  );
}

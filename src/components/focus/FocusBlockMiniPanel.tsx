"use client";

import React from "react";
import type { FocusBlock } from "@/types/focus";
import type { FocusMethodId } from "@/types/focus";
import { FOCUS_METHOD_COLORS, FOCUS_METHOD_LABELS } from "@/data/focus-defaults";
import { METHODOLOGIES } from "@/data/defaults";
import { useFocusBlocks } from "@/hooks/useFocusBlocks";
import "./focus-animations.css";

interface FocusBlockMiniPanelProps {
  block: FocusBlock;
  onClose: () => void;
  onOpenMethodology?: (methodId: FocusMethodId) => void;
}

export default function FocusBlockMiniPanel({ block, onClose, onOpenMethodology }: FocusBlockMiniPanelProps) {
  const { setFocusBlockStatus, deleteFocusBlock } = useFocusBlocks(block.date);
  const methodColor = FOCUS_METHOD_COLORS[block.method];
  const label = FOCUS_METHOD_LABELS[block.method];

  const statusLabel: Record<string, string> = {
    planned: "计划中", active: "进行中", paused: "已暂停", completed: "已完成",
  };

  return (
    <div
      className="mini-panel-enter absolute right-0 top-0 w-[260px] rounded-xl overflow-hidden"
      style={{
        background: "rgba(10,10,15,0.94)",
        border: `1px solid ${methodColor}30`,
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${methodColor}10`,
        zIndex: 40,
      }}
    >
      <div className="px-4 py-3 border-b border-white/6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: methodColor }} />
            <span className="font-clash text-sm font-semibold text-white">{label.zh}</span>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/70 text-sm">✕</button>
        </div>
        <div className="mt-1 text-[0.65rem] text-white/50">{block.name}</div>
        <div className="mt-0.5 text-[0.55rem] text-white/30 font-mono">{block.startTime} – {block.endTime}</div>
      </div>
      <div className="px-4 py-3 border-b border-white/6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[0.6rem] text-white/35">状态</span>
          <span className="text-[0.6rem] font-medium px-2 py-0.5 rounded-full"
            style={{ background: `${methodColor}15`, color: methodColor, border: `1px solid ${methodColor}30` }}>
            {statusLabel[block.status] ?? block.status}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {block.status === "planned" && (
            <button onClick={() => setFocusBlockStatus(block.id, "active")}
              className="flex-1 py-1.5 rounded-lg text-[0.6rem] font-medium transition-colors"
              style={{ background: `${methodColor}30`, color: methodColor }}>开始</button>
          )}
          {block.status === "active" && (
            <>
              <button onClick={() => setFocusBlockStatus(block.id, "paused")}
                className="flex-1 py-1.5 rounded-lg text-[0.6rem] font-medium transition-colors"
                style={{ background: "rgba(234,179,8,0.2)", color: "#EAB308" }}>暂停</button>
              <button onClick={() => setFocusBlockStatus(block.id, "completed")}
                className="flex-1 py-1.5 rounded-lg text-[0.6rem] font-medium transition-colors"
                style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>结束</button>
            </>
          )}
          {block.status === "paused" && (
            <>
              <button onClick={() => setFocusBlockStatus(block.id, "active")}
                className="flex-1 py-1.5 rounded-lg text-[0.6rem] font-medium transition-colors"
                style={{ background: `${methodColor}30`, color: methodColor }}>继续</button>
              <button onClick={() => setFocusBlockStatus(block.id, "completed")}
                className="flex-1 py-1.5 rounded-lg text-[0.6rem] font-medium transition-colors"
                style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>结束</button>
            </>
          )}
          {block.status === "completed" && (
            <button onClick={() => setFocusBlockStatus(block.id, "planned")}
              className="flex-1 py-1.5 rounded-lg text-[0.6rem] font-medium transition-colors"
              style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>重置</button>
          )}
        </div>
      </div>

      {/* Methodology icons row */}
      <div className="px-4 py-2.5 border-b border-white/6">
        <div className="text-[0.55rem] text-white/30 mb-1.5">方法论</div>
        <div className="flex gap-1.5">
          {METHODOLOGIES.map((m) => (
            <div key={m.id} className="relative group/tooltip">
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center transition-all"
                style={{
                  background: block.method === m.id
                    ? `${FOCUS_METHOD_COLORS[m.id]}25`
                    : "rgba(255,255,255,0.04)",
                  border: block.method === m.id
                    ? `1px solid ${FOCUS_METHOD_COLORS[m.id]}40`
                    : "1px solid transparent",
                  color: block.method === m.id
                    ? FOCUS_METHOD_COLORS[m.id]
                    : "rgba(255,255,255,0.3)",
                }}
              >
                <span
                  className="w-3.5 h-3.5 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: m.icon }}
                />
              </div>
              <div
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 rounded-md text-[0.5rem] whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-75 pointer-events-none"
                style={{
                  background: "rgba(10,10,15,0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                {m.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-2 flex items-center gap-2">
        <button onClick={() => { deleteFocusBlock(block.id); onClose(); }}
          className="text-[0.55rem] text-red-400/50 hover:text-red-400/80 transition-colors">删除聚焦块</button>
        <span className="flex-1" />
        <button
          onClick={() => onOpenMethodology?.(block.method)}
          className="text-[0.5rem] text-white/30 hover:text-white/70 transition-colors"
        >
          查看完整面板 →
        </button>
      </div>
    </div>
  );
}

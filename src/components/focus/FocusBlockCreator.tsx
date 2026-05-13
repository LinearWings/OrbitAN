"use client";

import React, { useState, useCallback } from "react";
import { CaretUpIcon, CaretDownIcon, ArrowRightIcon } from "@/components/ui/Icons";
import { useFocusBlocks } from "@/hooks/useFocusBlocks";
import { useAppContext } from "@/context/AppContext";
import { FOCUS_METHOD_LABELS } from "@/data/focus-defaults";
import type { FocusMethodId } from "@/types/focus";
import type { Task } from "@/types";

interface FocusBlockCreatorProps {
  date: string;
  onClose: () => void;
  onCreate: () => void;
}

export default function FocusBlockCreator({ date, onClose, onCreate }: FocusBlockCreatorProps) {
  const { addFocusBlock } = useFocusBlocks(date);
  const { state } = useAppContext();

  const [name, setName] = useState("");
  const [startH, setStartH] = useState(9);
  const [startM, setStartM] = useState(0);
  const [endH, setEndH] = useState(10);
  const [endM, setEndM] = useState(30);
  const [method, setMethod] = useState<FocusMethodId>("pomodoro");
  const [linkedTaskId, setLinkedTaskId] = useState("");

  const tasksForDate: Task[] = state.tasks[date] ?? [];

  const nudge = (setter: (v: number) => void, value: number, max: number) =>
    (delta: number) => setter(Math.max(0, Math.min(max, value + delta)));

  const handleCreate = useCallback(() => {
    const startTime = `${String(startH).padStart(2, "0")}:${String(startM).padStart(2, "0")}`;
    let endTime = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
    const startMin = startH * 60 + startM;
    const endMin = endH * 60 + endM;
    if (endMin <= startMin) {
      const fixed = (startMin + 30) % 1440;
      endTime = `${String(Math.floor(fixed / 60)).padStart(2, "0")}:${String(fixed % 60).padStart(2, "0")}`;
    }
    addFocusBlock({
      date, startTime, endTime, method, status: "planned",
      linkedTaskId: linkedTaskId || undefined,
      name: name.trim() || FOCUS_METHOD_LABELS[method].zh,
      note: "",
    });
    onCreate();
  }, [addFocusBlock, date, startH, startM, endH, endM, method, linkedTaskId, name, onCreate]);

  return (
    <div
      className="absolute z-50 rounded-xl p-4 w-[280px]"
      style={{
        top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        background: "rgba(10,10,15,0.96)",
        border: "1px solid rgba(255,255,255,0.1)",
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="font-clash text-sm font-semibold text-white/80 mb-3">新建聚焦时间段</h3>
      <input
        className="w-full rounded-lg px-3 py-2 bg-white/8 text-white text-sm border border-white/10 placeholder:text-white/25 outline-none focus:border-white/20 mb-2"
        placeholder="名称（可选）"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {/* Time pickers */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-0.5">
          <button onClick={() => nudge(setStartH, startH, 23)(-1)} className="text-white/20 hover:text-white/60 text-[0.5rem]"><CaretDownIcon size={10} /></button>
          <span className="font-mono text-sm text-white/80 w-6 text-center">{String(startH).padStart(2, "0")}</span>
          <button onClick={() => nudge(setStartH, startH, 23)(1)} className="text-white/20 hover:text-white/60 text-[0.5rem]"><CaretUpIcon size={10} /></button>
        </div>
        <span className="text-white/30">:</span>
        <div className="flex items-center gap-0.5">
          <button onClick={() => nudge(setStartM, startM, 55)(-5)} className="text-white/20 hover:text-white/60 text-[0.5rem]"><CaretDownIcon size={10} /></button>
          <span className="font-mono text-sm text-white/80 w-6 text-center">{String(startM).padStart(2, "0")}</span>
          <button onClick={() => nudge(setStartM, startM, 55)(5)} className="text-white/20 hover:text-white/60 text-[0.5rem]"><CaretUpIcon size={10} /></button>
        </div>
        <span className="text-white/20 mx-1"><ArrowRightIcon size={12} /></span>
        <div className="flex items-center gap-0.5">
          <button onClick={() => nudge(setEndH, endH, 23)(-1)} className="text-white/20 hover:text-white/60 text-[0.5rem]"><CaretDownIcon size={10} /></button>
          <span className="font-mono text-sm text-white/80 w-6 text-center">{String(endH).padStart(2, "0")}</span>
          <button onClick={() => nudge(setEndH, endH, 23)(1)} className="text-white/20 hover:text-white/60 text-[0.5rem]"><CaretUpIcon size={10} /></button>
        </div>
        <span className="text-white/30">:</span>
        <div className="flex items-center gap-0.5">
          <button onClick={() => nudge(setEndM, endM, 55)(-5)} className="text-white/20 hover:text-white/60 text-[0.5rem]"><CaretDownIcon size={10} /></button>
          <span className="font-mono text-sm text-white/80 w-6 text-center">{String(endM).padStart(2, "0")}</span>
          <button onClick={() => nudge(setEndM, endM, 55)(5)} className="text-white/20 hover:text-white/60 text-[0.5rem]"><CaretUpIcon size={10} /></button>
        </div>
      </div>
      {/* Method selector */}
      <div className="mb-2">
        <label className="text-[0.6rem] text-white/30 mb-1 block">方法论</label>
        <div className="grid grid-cols-3 gap-1">
          {(Object.entries(FOCUS_METHOD_LABELS) as [FocusMethodId, { zh: string }][]).map(([id, lbl]) => (
            <button key={id} onClick={() => setMethod(id)}
              className="px-2 py-1.5 rounded text-[0.6rem] font-medium transition-all"
              style={{
                background: method === id ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
                color: method === id ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)",
                border: method === id ? "1px solid rgba(255,255,255,0.15)" : "1px solid transparent",
              }}
            >
              {lbl.zh}
            </button>
          ))}
        </div>
      </div>
      {/* Linked task */}
      {tasksForDate.length > 0 && (
        <div className="mb-3">
          <label className="text-[0.6rem] text-white/30 mb-1 block">关联任务（可选）</label>
          <select
            className="w-full rounded-lg px-3 py-2 bg-white/8 text-white/70 text-sm border border-white/10 outline-none"
            value={linkedTaskId}
            onChange={(e) => setLinkedTaskId(e.target.value)}
          >
            <option value="">不关联</option>
            {tasksForDate.map((t) => (
              <option key={t.id} value={t.id}>{t.name} ({t.startTime}–{t.endTime})</option>
            ))}
          </select>
        </div>
      )}
      <div className="flex items-center gap-2">
        <button onClick={handleCreate}
          className="flex-1 rounded-lg py-2 text-sm font-medium text-white transition-colors"
          style={{ background: "rgba(37,99,235,0.8)" }}>
          创建
        </button>
        <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-white/40 hover:text-white/70 transition-colors">
          取消
        </button>
      </div>
    </div>
  );
}

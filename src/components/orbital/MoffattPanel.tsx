"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { MOFFATT_DEFAULTS } from "@/data/constants";
import type { MoffattSession } from "@/types";
import { loadMethodologyData, saveMethodologyData } from "@/utils/storage";

const METHODOLOGY_KEY = "moffatt";

const glassStyle: CSSProperties = {
  background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.06) 100%)",
  border: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
};

function formatMinutes(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function MoffattPanel({ initialItems }: { initialItems?: string[] }) {
  const [sessions, setSessions] = useState<MoffattSession[]>(() => {
    const defaultLabels = [
      "深度工作",
      "浅层工作",
      "学习阅读",
      "维护清理",
      "创意构思",
      "沟通协作",
      "文档整理",
      "工具优化",
    ];
    const loaded = loadMethodologyData<MoffattSession[]>(METHODOLOGY_KEY);
    if (loaded && loaded.length > 0) {
      return loaded;
    }
    // Use initialItems if provided, otherwise use defaults
    const labels = initialItems && initialItems.length > 0
      ? initialItems
      : defaultLabels;
    const init: MoffattSession[] = labels.map((label, idx) => ({
      id: `${idx}`,
      label,
      duration: MOFFATT_DEFAULTS.defaultSessionDuration,
      remaining: MOFFATT_DEFAULTS.defaultSessionDuration,
      isActive: false,
      isCompleted: false,
    }));
    init[0].isActive = true;
    return init;
  });
  const [isRunning, setRunning] = useState(false);

  // tick
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      setSessions((prev) => {
        if (!prev.length) return prev;
        const curIndex = prev.findIndex((s) => s.isActive && !s.isCompleted);
        if (curIndex === -1) return prev;
        const next = prev.map((s) => ({ ...s }));
        const cur = next[curIndex];
        cur.remaining = Math.max(0, cur.remaining - 1);
        if (cur.remaining <= 0) {
          cur.isCompleted = true;
          cur.isActive = false;
          // advance to next
          const nextIndex = curIndex + 1;
          if (nextIndex < next.length) {
            next[nextIndex].isActive = true;
          }
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  // persist — skip per-second writes while timer is running
  const isRunningRef = useRef(isRunning);
  useEffect(() => { isRunningRef.current = isRunning; });
  useEffect(() => {
    if (isRunningRef.current) return;
    saveMethodologyData(METHODOLOGY_KEY, sessions);
  }, [sessions]);

  // Save immediately when timer stops
  useEffect(() => {
    if (!isRunning) saveMethodologyData(METHODOLOGY_KEY, sessions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning]);

  const allCompleted = sessions.length > 0 && sessions.every((s) => s.isCompleted);
  const showCompleted = allCompleted;

  // Stop the timer when all sessions finish
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (allCompleted) setRunning(prev => prev ? false : prev);
  }, [allCompleted]);

  const startAll = () => {
    setSessions((prev) => {
      const next = prev.map((s, i) => ({
        ...s,
        isActive: i === 0 && !s.isCompleted,
        isCompleted: false,
        remaining: s.duration,
      }));
      if (next[0] && !next[0].isCompleted) next[0].isActive = true;
      return next;
    });
    setRunning(true);
  };

  const activeIndex = sessions.findIndex((s) => s.isActive && !s.isCompleted);
  const completedCount = sessions.filter((s) => s.isCompleted).length;
  const totalCount = sessions.length;

  return (
    <div className="orbit-panel moffatt p-4 rounded-2xl" style={glassStyle}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-white/70">Moffatt Schedule</h3>
          {isRunning && (
            <div className="text-xs text-blue-400 mt-0.5">
              当前: {activeIndex >= 0 ? sessions[activeIndex]?.label : "—"} ({completedCount}/{totalCount})
            </div>
          )}
          {!isRunning && !showCompleted && (
            <div className="text-xs text-white/40 mt-0.5">{totalCount} sessions · 25min each</div>
          )}
          {showCompleted && (
            <div className="text-xs text-blue-400 mt-0.5">全部完成!</div>
          )}
        </div>
        <button
          className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
          onClick={startAll}
        >
          全部开始
        </button>
      </div>

      {/* Session cards */}
      <div className="grid grid-cols-2 gap-3">
        {sessions.map((s) => {
          const isActive = s.isActive && !s.isCompleted;
          const progress = s.duration > 0 ? ((s.duration - s.remaining) / s.duration) * 100 : 0;

          return (
            <div
              key={s.id}
              className="relative rounded-xl overflow-hidden transition-all duration-300"
              style={{
                background: isActive
                  ? "linear-gradient(135deg, rgba(37,99,235,0.1) 0%, rgba(37,99,235,0.03) 100%)"
                  : s.isCompleted
                    ? "rgba(255,255,255,0.02)"
                    : "rgba(255,255,255,0.03)",
                border: isActive
                  ? "1px solid rgba(37,99,235,0.3)"
                  : "1px solid rgba(255,255,255,0.06)",
                boxShadow: isActive ? "0 0 24px rgba(37,99,235,0.15)" : "none",
                opacity: s.isCompleted ? 0.55 : 1,
              }}
            >
              {/* Left accent bar */}
              <div
                className="absolute left-0 top-0 bottom-0 w-0.5 transition-colors duration-300"
                style={{
                  background: isActive
                    ? "#2563EB"
                    : s.isCompleted
                      ? "rgba(255,255,255,0.15)"
                      : "rgba(255,255,255,0.2)",
                }}
              />

              <div className="p-3 pl-4">
                {/* Header row */}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-sm transition-colors ${
                      isActive ? "text-white font-medium" : "text-white/60"
                    }`}
                  >
                    {s.label}
                  </span>
                  <span
                    className={`text-xs tabular-nums font-mono transition-colors ${
                      isActive ? "text-blue-400" : "text-white/40"
                    }`}
                  >
                    {formatMinutes(s.remaining)}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progress}%`,
                      background: isActive
                        ? "linear-gradient(90deg, #2563EB, #60A5FA)"
                        : s.isCompleted
                          ? "rgba(255,255,255,0.15)"
                          : "rgba(255,255,255,0.08)",
                    }}
                  />
                </div>

                {/* Status badge */}
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span
                    className="px-2 py-0.5 rounded-full text-[11px] font-medium"
                    style={{
                      background: isActive
                        ? "rgba(37,99,235,0.15)"
                        : s.isCompleted
                          ? "rgba(255,255,255,0.06)"
                          : "rgba(255,255,255,0.04)",
                      color: isActive
                        ? "#60A5FA"
                        : s.isCompleted
                          ? "rgba(255,255,255,0.35)"
                          : "rgba(255,255,255,0.3)",
                      border: isActive
                        ? "1px solid rgba(37,99,235,0.2)"
                        : "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    {s.isCompleted ? "完成" : isActive ? "进行中" : "等待"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion banner */}
      {showCompleted && (
        <div className="mt-4 text-center py-3 rounded-lg" style={{
          background: "rgba(37,99,235,0.08)",
          border: "1px solid rgba(37,99,235,0.15)",
        }}>
          <div className="text-white font-semibold text-sm">全部会话已完成</div>
          <div className="text-xs text-blue-300/70 mt-0.5">点击「全部开始」重新开始一轮</div>
        </div>
      )}

      {/* Empty state — only if somehow no sessions exist */}
      {sessions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 text-white/40">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3 opacity-40">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <div className="text-sm text-white/60">暂无会话</div>
        </div>
      )}
    </div>
  );
}

"use client";

import { memo, useState, useRef, useCallback, useEffect } from "react";
import { CaretUpIcon, CaretDownIcon } from "@/components/ui/Icons";
import type { Task } from "@/types";
import { getTaskColor, getTaskLabel, sanitizeSvg } from "@/utils/colors";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";
import { getTaskDuration } from "@/utils/time";
import { FOCUS_METHOD_COLORS } from "@/data/focus-defaults";
import { METHODOLOGIES } from "@/data/defaults";
import ProgressBar from "./ProgressBar";

// ── Compact inline time picker ──
function TimePicker({
  value,
  onChange,
  onDone,
  confirmLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  confirmLabel?: string;
  onDone: () => void;
}) {
  const [h, m] = value.split(":").map(Number);
  const color = "#2563EB";

  const adjust = (part: "h" | "m", delta: number) => {
    if (part === "h") {
      const nh = ((h ?? 0) + delta + 24) % 24;
      onChange(`${String(nh).padStart(2, "0")}:${String(m ?? 0).padStart(2, "0")}`);
    } else {
      const nm = ((m ?? 0) + delta + 60) % 60;
      onChange(`${String(h ?? 0).padStart(2, "0")}:${String(nm).padStart(2, "0")}`);
    }
  };

  return (
    <div
      className="absolute z-30 top-full mt-1 left-1/2 -translate-x-1/2 rounded-xl overflow-hidden"
      style={{
        background: "rgba(10,10,15,0.95)",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Hours */}
        <div className="flex flex-col items-center gap-0.5">
          <button onClick={() => adjust("h", 1)} className="text-white/20 hover:text-white/60 transition-colors leading-none text-[0.5rem]"><CaretUpIcon size={10} /></button>
          <span className="font-clash text-xl font-semibold tabular-nums text-white/90 w-7 text-center">{String(h ?? 0).padStart(2, "0")}</span>
          <button onClick={() => adjust("h", -1)} className="text-white/20 hover:text-white/60 transition-colors leading-none text-[0.5rem]"><CaretDownIcon size={10} /></button>
        </div>

        <span className="text-white/30 text-lg font-mono mt-[-4px]">:</span>

        {/* Minutes */}
        <div className="flex flex-col items-center gap-0.5">
          <button onClick={() => adjust("m", 1)} className="text-white/20 hover:text-white/60 transition-colors leading-none text-[0.5rem]"><CaretUpIcon size={10} /></button>
          <span className="font-clash text-xl font-semibold tabular-nums text-white/90 w-7 text-center">{String(m ?? 0).padStart(2, "0")}</span>
          <button onClick={() => adjust("m", -1)} className="text-white/20 hover:text-white/60 transition-colors leading-none text-[0.5rem]"><CaretDownIcon size={10} /></button>
        </div>
      </div>

      {/* Done button */}
      <button
        onClick={onDone}
        className="w-full py-1.5 text-[0.6rem] font-medium tracking-wide transition-colors"
        style={{
          backgroundColor: `${color}15`,
          color,
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {confirmLabel ?? "OK"}
      </button>
    </div>
  );
}

export interface CardPosition {
  left: number;
  top: number;
}

interface ScheduleItemProps {
  task: Task;
  isSelected: boolean;
  isFiltered: boolean;
  zIndex: number;
  position?: CardPosition;
  onSelect: () => void;
  onProgressChange: (progress: number) => void;
  onUpdate?: (id: string, fields: Partial<Task>) => void;
  linkedFocusColor?: string;
  isOrbitMode?: boolean;
  onSetOrbitPlan?: (taskId: string) => void;
  dimmed?: boolean;
  isDeleteTarget?: boolean;
}

function ScheduleItem({ task, isSelected, isFiltered, zIndex, position, onSelect, onProgressChange, onUpdate, linkedFocusColor, isOrbitMode, onSetOrbitPlan, dimmed, isDeleteTarget }: ScheduleItemProps) {
  const color = getTaskColor(task.type);
  const duration = getTaskDuration(task);
  const isTouchDevice = useMediaQuery("(hover: none) and (pointer: coarse)");
  const lang = useLanguage();
  const t = getT(lang);
  const [editing, setEditing] = useState<"name" | "start" | "end" | null>(null);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commitEdit = useCallback(() => {
    if (!editing || !onUpdate) return;
    const val = editValue.trim();
    if (!val) { setEditing(null); return; }
    if (editing === "name" && val !== task.name) {
      onUpdate(task.id, { name: val });
    } else if (editing === "start" && val !== task.startTime) {
      onUpdate(task.id, { startTime: val });
    } else if (editing === "end" && val !== task.endTime) {
      onUpdate(task.id, { endTime: val });
    }
    setEditing(null);
  }, [editing, editValue, onUpdate, task]);

  const startEdit = useCallback((field: "name" | "start" | "end", current: string) => {
    setEditing(field);
    setEditValue(current);
  }, []);

  const nameClass = task.completed
    ? "text-white/20 line-through"
    : isSelected
      ? "text-white/85"
      : "text-white/55 group-hover:text-white/75";

  return (
    <div
      data-task-id={task.id}
      className={position ? "group absolute z-20" : "group relative z-20"}
      style={position ? {
        left: `${position.left}%`,
        top: `${position.top}%`,
        transform: isDeleteTarget ? "translate(-50%, -50%) scale(1.08)" : "translate(-50%, -50%)",
        transition: dimmed || isDeleteTarget ? "transform 0.4s ease, opacity 0.4s ease, filter 0.4s ease" : undefined,
        opacity: dimmed ? 0.3 : (isFiltered ? 0.15 : 1),
        filter: dimmed ? "blur(3px)" : undefined,
        pointerEvents: (isFiltered || dimmed) ? "none" : "auto",
        userSelect: "none",
        WebkitUserSelect: "none",
        zIndex: isFiltered ? 10 : zIndex,
        width: "fit-content",
        maxWidth: isTouchDevice ? "min(26vw, 200px)" : "min(36vw, 300px)",
        minHeight: "80px",
      } : {
        // mobile: natural flow layout
        opacity: dimmed ? 0.3 : (isFiltered ? 0.15 : 1),
        filter: dimmed ? "blur(3px)" : undefined,
        pointerEvents: (isFiltered || dimmed) ? "none" : "auto",
        userSelect: "none",
        WebkitUserSelect: "none",
        zIndex: isFiltered ? 10 : zIndex,
      }}
      onClick={onSelect}
    >
      {/* Glass card backdrop — only visible on hover/select, glows in Orbit Mode with method */}
      <div
        className="absolute -inset-x-3 -inset-y-2 rounded-2xl opacity-0 transition-all duration-300 ease-out pointer-events-none"
        style={{
          opacity: isSelected || (isOrbitMode && !!task.method) ? 1 : undefined,
          background: isOrbitMode && task.method
            ? `linear-gradient(135deg, ${FOCUS_METHOD_COLORS[task.method]}10 0%, rgba(255,255,255,0.03) 100%)`
            : `linear-gradient(135deg, ${color}08 0%, rgba(255,255,255,0.02) 100%)`,
          border: `1px solid ${isSelected ? `${color}25` : (isOrbitMode && task.method ? `${FOCUS_METHOD_COLORS[task.method]}50` : "transparent")}`,
          boxShadow: isOrbitMode && task.method
            ? `0 0 30px ${FOCUS_METHOD_COLORS[task.method]}60, 0 0 12px ${FOCUS_METHOD_COLORS[task.method]}35, inset 0 0 20px ${FOCUS_METHOD_COLORS[task.method]}15`
            : isSelected
              ? `0 0 30px ${color}10, 0 4px 20px rgba(0,0,0,0.3)`
              : "none",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      />

      {/* Type-colored accent line */}
      <div
        className="absolute left-[-10px] top-0 bottom-0 w-[2px] rounded-full transition-all duration-300 ease-out pointer-events-none"
        style={{
          backgroundColor: linkedFocusColor ?? color,
          opacity: isSelected ? 0.7 : 0,
          boxShadow: isSelected ? `0 0 8px ${linkedFocusColor ?? color}` : "none",
        }}
      />

      <div className="relative cursor-pointer" onClick={onSelect}>
        {/* Time — hero element, click to edit inline */}
        {editing === "start" ? (
          <div className="relative inline-block">
            <span
              className={`font-clash text-2xl font-semibold tabular-nums tracking-tight ${isSelected ? "text-white/90" : "text-white/65"}`}
            >
              {editValue}
            </span>
            <TimePicker
              value={editValue}
              onChange={setEditValue}
              onDone={commitEdit}
              confirmLabel={t.orbit_confirm}
            />
          </div>
        ) : (
          <div
            className={`font-clash text-2xl font-semibold tabular-nums tracking-tight transition-colors duration-300 ${isSelected ? "text-white/90" : "text-white/65 group-hover:text-white/80"}`}
            onClick={(e) => { if (isSelected && !isDeleteTarget) { e.stopPropagation(); startEdit("start", task.startTime); } }}
          >
            {task.startTime}
          </div>
        )}

        {/* Visual time span bar — mini timeline showing start→end proportionally */}
        <div className="mt-2 h-[3px] w-full rounded-full overflow-hidden" style={{ backgroundColor: `${color}15` }}>
          <div className="h-full rounded-full" style={{
            width: "100%",
            background: `linear-gradient(90deg, ${color}40 0%, ${color}60 50%, ${color}30 100%)`,
          }} />
        </div>

        {/* Task name — click to edit inline */}
        {editing === "name" ? (
          <input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") setEditing(null); }}
            className="w-full bg-transparent outline-none font-satoshi text-[0.8125rem] leading-snug mt-1.5 text-white/90"
            placeholder={t.orbit_task_name_placeholder}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div
            className={`font-satoshi text-[0.8125rem] leading-snug mt-1.5 truncate transition-colors duration-300 ${nameClass}`}
            onClick={(e) => { if (isSelected && !isDeleteTarget) { e.stopPropagation(); startEdit("name", task.name); } }}
          >
            {task.name}
          </div>
        )}

        {/* Meta row: duration · type · end time */}
        <div className={`font-satoshi text-[0.75rem] sm:text-[0.6875rem] leading-normal mt-1 flex items-center gap-x-1.5 transition-colors duration-300 ${isSelected ? "text-white/25" : "text-white/16 group-hover:text-white/22"}`}>
          <span>{duration}min</span>
          <span className="text-white/8">·</span>
          <span>{lang === "en" ? getTaskLabel(task.type).en : getTaskLabel(task.type).zh}</span>
          <span className="text-white/8">·</span>
          {editing === "end" ? (
            <span className="relative inline-block">
              <span className="font-mono text-[0.75rem] sm:text-[0.6875rem] text-white/80">{editValue}</span>
              <TimePicker
                value={editValue}
                onChange={setEditValue}
                onDone={commitEdit}
              />
            </span>
          ) : (
            <span
              onClick={(e) => { e.stopPropagation(); if (isSelected && !isDeleteTarget) startEdit("end", task.endTime); }}
              className="cursor-pointer hover:text-white/40"
            >
              {t.orbit_time_to} {task.endTime}
            </span>
          )}
        </div>

        {/* Orbit Plan methodology badge */}
        {isOrbitMode && (
          <button
            className="absolute top-[-4px] right-[-6px] w-[22px] h-[22px] rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: task.method
                ? `${FOCUS_METHOD_COLORS[task.method]}20`
                : "rgba(255,255,255,0.04)",
              border: task.method
                ? `1px solid ${FOCUS_METHOD_COLORS[task.method]}40`
                : "1px dashed rgba(255,255,255,0.1)",
              color: task.method ? FOCUS_METHOD_COLORS[task.method] : "rgba(255,255,255,0.2)",
              zIndex: 25,
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSetOrbitPlan?.(task.id);
            }}
            title={task.method ? t.orbit_switch_method : t.orbit_set_plan}
          >
            {task.method ? (
              <span
                className="w-3 h-3 [&>svg]:w-full [&>svg]:h-full"
                dangerouslySetInnerHTML={{
                  __html: sanitizeSvg(
                    (METHODOLOGIES.find(m => m.id === task.method)?.icon ?? "")
                      .replace(/currentColor/g, FOCUS_METHOD_COLORS[task.method])
                  ),
                }}
              />
            ) : (
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.2">
                <line x1="4" y1="1" x2="4" y2="7" /><line x1="1" y1="4" x2="7" y2="4" />
              </svg>
            )}
          </button>
        )}

        {/* Progress bar */}
        <div className="mt-2.5">
          <ProgressBar
            progress={task.progress}
            color={color}
            taskDuration={duration}
            onProgressChange={onProgressChange}
          />
        </div>
      </div>
    </div>
  );
}

export default memo(ScheduleItem);


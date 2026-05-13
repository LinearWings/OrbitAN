"use client";

import React, { useMemo, useCallback } from "react";
import { useAppContext } from "@/context/AppContext";
import { useEditPanel } from "@/hooks/useEditPanel";
import { useSelectedTask } from "@/hooks/useSelectedTask";
import { getWeekDates, getToday, timeToMinutes } from "@/utils/time";
import { getTaskColor, getTaskLabel } from "@/utils/colors";
import type { Task } from "@/types";

const HOUR_START = 6;
const HOUR_END = 18;
const TOTAL_HOURS = HOUR_END - HOUR_START;
const TOTAL_MINUTES = TOTAL_HOURS * 60;

const DAY_LABELS_ZH = ["一", "二", "三", "四", "五", "六", "日"];
const DAY_LABELS_EN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function taskTopPct(startTime: string): number {
  const mins = timeToMinutes(startTime) - HOUR_START * 60;
  return Math.max(0, Math.min(100, (mins / TOTAL_MINUTES) * 100));
}

function taskHeightPct(startTime: string, endTime: string): number {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  const dur = end >= start ? end - start : end + 24 * 60 - start;
  return Math.max(1.8, (dur / TOTAL_MINUTES) * 100);
}

export default function WeekView() {
  const { state, dispatch } = useAppContext();
  const { openEdit } = useEditPanel();
  const { selectTask } = useSelectedTask();

  const today = getToday();
  const week = useMemo(() => getWeekDates(today), [today]);

  // Collect unique task types across the week for the legend
  const uniqueTypes = useMemo(() => {
    const typeSet = new Set<string>();
    week.forEach((date) => {
      const tasks: Task[] = state.tasks[date] ?? [];
      tasks.forEach((t) => typeSet.add(t.type));
    });
    return Array.from(typeSet);
  }, [week, state.tasks]);

  const handleEmptyClick = useCallback(
    (date: string) => {
      dispatch({ type: "SET_DATE", payload: date });
      openEdit(null);
    },
    [dispatch, openEdit],
  );

  const handleBlockClick = useCallback(
    (task: Task, date: string) => {
      dispatch({ type: "SET_DATE", payload: date });
      selectTask(task.id);
    },
    [dispatch, selectTask],
  );

  return (
    <div className="week-view flex flex-col h-full space-y-2">
      <h3 className="font-clash text-sm font-semibold text-white/60 mb-1">
        本周聚焦 / Week Focus
      </h3>

      <div
        className="grid grid-cols-7 gap-0.5 flex-1"
        style={{ minHeight: "360px" }}
      >
        {week.map((date, i) => {
          const tasks: Task[] = state.tasks[date] ?? [];
          const dayNum = parseInt(date.split("-")[2] ?? "0");
          const isToday = date === today;
          const isWeekend = i >= 5;

          return (
            <div key={date} className="flex flex-col relative min-w-0">
              <button
                className={`text-center py-1 mb-0.5 rounded-t-md transition-colors ${
                  isToday
                    ? "bg-white/[0.08] border border-white/[0.1]"
                    : "border border-transparent hover:bg-white/[0.03]"
                }`}
                onClick={() => handleEmptyClick(date)}
              >
                <div className="text-[0.6rem] text-white/30 font-mono leading-none">
                  {DAY_LABELS_EN[i]}
                </div>
                <div
                  className={`text-xs font-clash font-semibold ${
                    isToday ? "text-white" : "text-white/60"
                  }`}
                >
                  {dayNum}
                </div>
                <div className="text-[0.5rem] text-white/20 leading-none">
                  周{DAY_LABELS_ZH[i]}
                </div>
              </button>

              <div
                className="flex-1 relative rounded-b-md overflow-hidden cursor-pointer border border-white/[0.03] group/col"
                style={{
                  background: isWeekend
                    ? "rgba(10,10,15,0.2)"
                    : "rgba(10,10,15,0.35)",
                }}
                onClick={() => handleEmptyClick(date)}
              >
                {Array.from({ length: TOTAL_HOURS }, (_, h) => (
                  <div
                    key={h}
                    className="absolute left-0 right-0 border-t border-white/[0.025]"
                    style={{ top: `${(h / TOTAL_HOURS) * 100}%` }}
                  />
                ))}

                {[0, 3, 6, 9].map((h) => {
                  const hour = HOUR_START + h;
                  return (
                    <div
                      key={hour}
                      className="absolute left-0 right-0 border-t border-white/[0.05]"
                      style={{ top: `${(h / TOTAL_HOURS) * 100}%` }}
                    />
                  );
                })}

                {Array.from({ length: TOTAL_HOURS }, (_, h) => {
                  const hour = HOUR_START + h;
                  return (
                    <div
                      key={hour}
                      className="absolute left-0.5 text-[0.45rem] text-white/[0.1] font-mono leading-none pointer-events-none"
                      style={{ top: `${(h / TOTAL_HOURS) * 100}%` }}
                    >
                      {hour}
                    </div>
                  );
                })}

                {tasks.map((task) => {
                  const color = getTaskColor(task.type);
                  const top = taskTopPct(task.startTime);
                  const height = taskHeightPct(task.startTime, task.endTime);

                  return (
                    <div
                      key={task.id}
                      className="absolute left-0.5 right-0.5 rounded-[3px] cursor-pointer group/block transition-all duration-200 hover:z-10 hover:scale-x-[1.04]"
                      style={{
                        top: `${top}%`,
                        height: `${Math.max(height, 2.5)}%`,
                        background: "rgba(10,10,15,0.65)",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                        borderLeft: `2px solid ${color}`,
                        borderRight: "1px solid rgba(255,255,255,0.04)",
                        borderTop: "1px solid rgba(255,255,255,0.03)",
                        borderBottom: "1px solid rgba(255,255,255,0.03)",
                        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04), 0 0 8px ${color}12`,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBlockClick(task, date);
                      }}
                      title={`${task.name} (${task.startTime}–${task.endTime})`}
                    >
                      {task.progress > 0 && (
                        <div
                          className="absolute bottom-0 left-0 h-[2px] rounded-b-[3px] opacity-70"
                          style={{
                            width: `${task.progress}%`,
                            background: `linear-gradient(90deg, ${color}88, ${color})`,
                          }}
                        />
                      )}

                      {height > 4 && (
                        <div className="absolute inset-0 flex items-center justify-center overflow-hidden px-0.5">
                          <span
                            className="text-[0.5rem] font-semibold truncate leading-tight select-none"
                            style={{ color }}
                          >
                            {task.name || task.startTime}
                          </span>
                        </div>
                      )}

                      <div
                        className="absolute inset-0 opacity-0 group-hover/block:opacity-100 transition-opacity duration-200 rounded-[3px] pointer-events-none"
                        style={{
                          background: `linear-gradient(180deg, ${color}10 0%, transparent 60%)`,
                        }}
                      />
                      <div
                        className="absolute inset-0 opacity-0 group-hover/block:opacity-100 transition-opacity duration-200 rounded-[3px] pointer-events-none"
                        style={{
                          boxShadow: `inset 0 0 12px ${color}20, 0 0 8px ${color}20`,
                        }}
                      />
                    </div>
                  );
                })}

                {tasks.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/col:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <span className="text-[0.5rem] text-white/[0.15] font-mono">
                      +
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3 pt-1 flex-wrap">
        {uniqueTypes.map((type) => (
          <div key={type} className="flex items-center gap-1">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: getTaskColor(type) }}
            />
            <span className="text-[0.6rem] text-white/20 font-mono">
              {getTaskLabel(type).zh}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

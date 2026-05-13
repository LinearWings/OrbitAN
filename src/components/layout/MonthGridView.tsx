"use client";

import { useMemo } from "react";
import { useAppContext } from "@/context/AppContext";
import { getToday } from "@/utils/time";
import { getTaskColor } from "@/utils/colors";

interface MonthGridViewProps {
  onDayClick: (date: string) => void;
}

const DAY_LABELS = ["日", "一", "二", "三", "四", "五", "六"];
const C = {
  dim: "rgba(255,255,255,0.04)",
  line: "rgba(255,255,255,0.06)",
  todayBg: "rgba(37,99,235,0.12)",
  todayRing: "rgba(37,99,235,0.4)",
  weekend: "rgba(255,255,255,0.1)",
};

function getMonthGrid(currentDate: string) {
  const d = new Date(currentDate + "T00:00:00");
  const year = d.getFullYear();
  const month = d.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const weeks: { date: string; dayNum: number; isCurrentMonth: boolean }[][] = [];
  let week: { date: string; dayNum: number; isCurrentMonth: boolean }[] = [];

  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    week.push({ date: `${prevYear}-${String(prevMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`, dayNum: day, isCurrentMonth: false });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    week.push({ date: `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`, dayNum: day, isCurrentMonth: true });
    if (week.length === 7) { weeks.push(week); week = []; }
  }

  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  let nextDay = 1;
  while (week.length < 7) {
    week.push({ date: `${nextYear}-${String(nextMonth + 1).padStart(2, "0")}-${String(nextDay).padStart(2, "0")}`, dayNum: nextDay, isCurrentMonth: false });
    nextDay++;
  }
  weeks.push(week);
  return weeks;
}

export default function MonthGridView({ onDayClick }: MonthGridViewProps) {
  const { state } = useAppContext();
  const today = getToday();
  const weeks = useMemo(() => getMonthGrid(state.currentDate), [state.currentDate]);

  const title = useMemo(() => {
    const d = new Date(state.currentDate + "T00:00:00");
    return `${d.getFullYear()}年${d.getMonth() + 1}月`;
  }, [state.currentDate]);

  return (
    <div className="h-full flex flex-col" style={{ background: "#08090C" }}>
      {/* Month/Year header */}
      <div style={{ textAlign: "center", padding: "12px 0", borderBottom: `1px solid ${C.line}` }}>
        <span style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 20, fontWeight: 600, color: "rgba(255,255,255,0.85)", letterSpacing: "0.02em" }}>{title}</span>
      </div>

      {/* Day-of-week labels */}
      <div className="grid grid-cols-7" style={{ borderBottom: `1px solid ${C.line}` }}>
        {DAY_LABELS.map((label, i) => (
          <div key={label} style={{ textAlign: "center", padding: "8px 0", fontSize: 13, fontFamily: "'Inter','Microsoft YaHei',sans-serif", fontWeight: 500, color: i === 0 || i === 6 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.35)" }}>
            {label}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1" style={{ position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
          {weeks.map((week, wi) => (
            <div key={wi} className="flex-1 grid grid-cols-7" style={{ borderBottom: wi < weeks.length - 1 ? `1px solid ${C.dim}` : "none" }}>
              {week.map(({ date, dayNum, isCurrentMonth }, di) => {
                const tasks = state.tasks[date] ?? [];
                const isToday = date === today;
                const isWeekend = di === 0 || di === 6;
                const typeColors = [...new Set(tasks.map(t => t.type))].slice(0, 5);
                const count = tasks.length;

                return (
                  <button key={date} onClick={() => onDayClick(date)}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center",
                      justifyContent: "flex-start", cursor: "pointer", border: "none",
                      background: isToday ? C.todayBg : isWeekend ? "rgba(255,255,255,0.015)" : "transparent",
                      paddingTop: 8, opacity: isCurrentMonth ? 1 : 0.3,
                      position: "relative",
                    }}
                  >
                    {/* Day number */}
                    <span style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      width: 32, height: 32, borderRadius: "50%",
                      fontFamily: "'Clash Display', sans-serif", fontSize: 16, fontWeight: isToday ? 600 : 400,
                      background: isToday ? "rgba(37,99,235,0.25)" : "transparent",
                      color: isToday ? "#FFFFFF" : isCurrentMonth ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)",
                      outline: isToday ? `1px solid ${C.todayRing}` : "none",
                      outlineOffset: 2,
                      lineHeight: 1,
                    }}>
                      {dayNum}
                    </span>

                    {/* Task indicators */}
                    {count > 0 && (
                      <div style={{ marginTop: 6, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                        {/* Color dots */}
                        <div style={{ display: "flex", gap: 3 }}>
                          {typeColors.map(type => (
                            <div key={type} style={{ width: 6, height: 6, borderRadius: "50%", background: getTaskColor(type), boxShadow: `0 0 4px ${getTaskColor(type)}40` }} />
                          ))}
                        </div>
                        {/* Count badge */}
                        <span style={{ fontSize: 13, fontFamily: "'JetBrains Mono','Microsoft YaHei',monospace", fontWeight: 600, color: "rgba(255,255,255,0.4)", lineHeight: 1 }}>
                          {count}
                        </span>
                      </div>
                    )}

                    {/* Empty cell hover indicator */}
                    {count === 0 && isCurrentMonth && (
                      <div style={{ marginTop: 6, fontSize: 13, color: "rgba(255,255,255,0.06)", fontFamily: "'JetBrains Mono','Microsoft YaHei',monospace", lineHeight: 1 }}>·</div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

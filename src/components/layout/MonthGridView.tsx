"use client";

import { useMemo } from "react";
import { useAppContext } from "@/context/AppContext";
import { getToday } from "@/utils/time";
import { getTaskColor } from "@/utils/colors";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface MonthGridViewProps {
  onDayClick: (date: string) => void;
}

const DAY_LABELS = ["日", "一", "二", "三", "四", "五", "六"];
const C = {
  dim: "rgba(255,255,255,0.03)",
  line: "rgba(255,255,255,0.05)",
  todayBg: "rgba(37,99,235,0.08)",
  todayRing: "rgba(37,99,235,0.3)",
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
  const isMobile = useMediaQuery("(max-width: 768px)");
  const weeks = useMemo(() => getMonthGrid(state.currentDate), [state.currentDate]);

  const title = useMemo(() => {
    const d = new Date(state.currentDate + "T00:00:00");
    return `${d.getFullYear()}年${d.getMonth() + 1}月`;
  }, [state.currentDate]);

  return (
    <div className="h-full flex flex-col" style={{
      background: "linear-gradient(175deg, rgba(14,14,22,0.84) 0%, rgba(8,8,14,0.92) 35%, rgba(11,11,19,0.88) 65%, rgba(6,6,12,0.94) 100%)",
      backdropFilter: "blur(20px) saturate(1.15)",
      WebkitBackdropFilter: "blur(20px) saturate(1.15)",
      borderRadius: 16,
      border: "1px solid rgba(255,255,255,0.05)",
      boxShadow: "0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.015) inset, 0 1px 0 rgba(255,255,255,0.025) inset",
      overflow: "hidden",
    }}>
      {/* Month/Year header */}
      <div style={{ textAlign: "center", padding: isMobile ? "8px 0" : "14px 0", borderBottom: `1px solid ${C.line}` }}>
        <span style={{ fontFamily: "'Clash Display', sans-serif", fontSize: isMobile ? 16 : 18, fontWeight: 600, color: "rgba(255,255,255,0.8)", letterSpacing: "0.03em" }}>{title}</span>
      </div>

      {/* Day-of-week labels */}
      <div className="grid grid-cols-7" style={{ borderBottom: `1px solid ${C.line}`, background: "rgba(255,255,255,0.005)" }}>
        {DAY_LABELS.map((label, i) => (
          <div key={label} style={{ textAlign: "center", padding: isMobile ? "4px 0" : "7px 0", fontSize: isMobile ? 10 : 12, fontFamily: "'Inter','Microsoft YaHei',sans-serif", fontWeight: 500, color: i === 0 || i === 6 ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.3)", letterSpacing: "0.04em" }}>
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
                const typeColors = [...new Set(tasks.map(t => t.type))].slice(0, isMobile ? 3 : 5);
                const count = tasks.length;

                return (
                  <button key={date} onClick={() => onDayClick(date)}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center",
                      justifyContent: "flex-start", cursor: "pointer", border: "none",
                      background: isToday ? C.todayBg : isWeekend ? "rgba(255,255,255,0.01)" : "transparent",
                      paddingTop: isMobile ? 4 : 7, opacity: isCurrentMonth ? 1 : 0.25,
                      position: "relative",
                      transition: "background 0.15s",
                    }}
                  >
                    {/* Day number */}
                    <span style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      width: isMobile ? 24 : 30, height: isMobile ? 24 : 30, borderRadius: "50%",
                      fontFamily: "'Clash Display', sans-serif", fontSize: isMobile ? 12 : 15, fontWeight: isToday ? 600 : 400,
                      background: isToday ? "rgba(37,99,235,0.2)" : "transparent",
                      color: isToday ? "#93C5FD" : isCurrentMonth ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.15)",
                      boxShadow: isToday ? "0 0 10px rgba(37,99,235,0.12)" : "none",
                      lineHeight: 1,
                    }}>
                      {dayNum}
                    </span>

                    {/* Task indicators */}
                    {count > 0 && (
                      <div style={{ marginTop: isMobile ? 3 : 5, display: "flex", flexDirection: "column", alignItems: "center", gap: isMobile ? 2 : 3 }}>
                        <div style={{ display: "flex", gap: isMobile ? 2 : 3 }}>
                          {typeColors.map(type => (
                            <div key={type} style={{ width: isMobile ? 4 : 5, height: isMobile ? 4 : 5, borderRadius: "50%", background: getTaskColor(type), opacity: 0.65, boxShadow: `0 0 3px ${getTaskColor(type)}30` }} />
                          ))}
                          {(() => {
                            const allTypes = [...new Set(tasks.map(t => t.type))];
                            return allTypes.length > typeColors.length ? (
                              <span style={{ fontSize: 8, color: "rgba(255,255,255,0.15)", fontFamily: "'JetBrains Mono',monospace", lineHeight: 1, display: "inline-flex", alignItems: "center" }}>+</span>
                            ) : null;
                          })()}
                        </div>
                        <span style={{ fontSize: isMobile ? 10 : 12, fontFamily: "'JetBrains Mono','Microsoft YaHei',monospace", fontWeight: 600, color: "rgba(255,255,255,0.35)", lineHeight: 1 }}>
                          {count}
                        </span>
                      </div>
                    )}

                    {/* Empty cell */}
                    {count === 0 && isCurrentMonth && !isToday && (
                      <div style={{ marginTop: isMobile ? 3 : 5, fontSize: isMobile ? 10 : 12, color: "rgba(255,255,255,0.04)", fontFamily: "'JetBrains Mono','Microsoft YaHei',monospace", lineHeight: 1 }}>·</div>
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

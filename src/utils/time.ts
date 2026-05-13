import type { Task } from "@/types";

export function formatTime(date: Date): string {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

export function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number) as [number, number];
  return h * 60 + m;
}

export function getTaskDuration(task: Task): number {
  const start = timeToMinutes(task.startTime);
  const end = timeToMinutes(task.endTime);
  return end >= start ? end - start : end + 24 * 60 - start;
}

export function getToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function getWeekDates(dateStr: string): string[] {
  const date = new Date(dateStr + "T00:00:00");
  const day = date.getDay();
  const monday = new Date(date);
  monday.setDate(date.getDate() - (day === 0 ? 6 : day - 1));

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });
}

export function getPreviousDay(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function getNextDay(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function isWithinCurrentWeek(dateStr: string): boolean {
  const week = getWeekDates(getToday());
  return week.includes(dateStr);
}

export function timeToAngle(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number) as [number, number];
  const totalMinutes = h * 60 + m;
  // Full 24h mapping: 00:00→-π/2 (top), 06:00→0 (right), 12:00→π/2 (bottom), 18:00→π (left)
  const fraction = totalMinutes / 1440;
  return fraction * Math.PI * 2 - Math.PI / 2;
}

export function timeToAngle24h(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number) as [number, number];
  const totalMinutes = h * 60 + m;
  const fraction = totalMinutes / 1440;
  return fraction * Math.PI * 2;
}

export function angleToPosition(angle: number, radius: number, cx: number, cy: number): { x: number; y: number } {
  return {
    x: cx + Math.cos(angle) * radius,
    y: cy + Math.sin(angle) * radius,
  };
}

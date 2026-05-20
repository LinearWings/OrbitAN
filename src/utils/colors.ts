import { timeToMinutes } from "@/utils/time";
import { UNIFIED_RADIUS } from "@/data/constants";

/** Sanitize an SVG string for use with dangerouslySetInnerHTML.
 *  Only allows <svg>, <path>, <circle>, <rect>, <line>, <polyline>,
 *  <polygon>, <g>, <defs>, <clipPath>, <use> elements.
 */
export function sanitizeSvg(html: string): string {
  if (!html.startsWith("<svg")) return "";
  // Strip any script/event handler attributes
  return html.replace(/\s+on\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\s+on\w+\s*=\s*'[^']*'/gi, "");
}

const BUILT_IN_COLORS: Record<string, string> = {
  work: "#2563EB",
  study: "#EAB308",
  meeting: "#374151",
  personal: "#6B7280",
};

export const TASK_TYPE_COLORS: Record<string, string> = {
  work: "#2563EB",
  study: "#EAB308",
  meeting: "#374151",
  personal: "#6B7280",
};

export const TASK_TYPE_LABELS: Record<string, { zh: string; en: string }> = {
  work: { zh: "工作", en: "Work" },
  study: { zh: "学习", en: "Study" },
  meeting: { zh: "会议", en: "Meeting" },
  personal: { zh: "个人", en: "Personal" },
};

const CUSTOM_TYPE_PALETTE = ["#EC4899", "#10B981", "#F59E0B", "#8B5CF6", "#06B6D4", "#F97316", "#84CC16", "#BE185D"];

export function getTaskColor(type: string): string {
  if (BUILT_IN_COLORS[type]) return BUILT_IN_COLORS[type];
  // Hash the type name to pick a consistent color from the palette
  let hash = 0;
  for (let i = 0; i < type.length; i++) hash = ((hash << 5) - hash) + type.charCodeAt(i);
  return CUSTOM_TYPE_PALETTE[Math.abs(hash) % CUSTOM_TYPE_PALETTE.length];
}

export { CUSTOM_TYPE_PALETTE };

export function getTaskLabel(type: string): { zh: string; en: string } {
  return TASK_TYPE_LABELS[type] ?? { zh: type, en: type };
}

export function getCometHeadRadius(startTime: string, endTime: string): number {
  const s = timeToMinutes(startTime);
  const e = timeToMinutes(endTime);
  const d = (e - s + 1440) % 1440;
  if (d < 30) return UNIFIED_RADIUS["<30"];
  if (d <= 60) return UNIFIED_RADIUS["30-60"];
  if (d <= 120) return UNIFIED_RADIUS["60-120"];
  return UNIFIED_RADIUS[">120"];
}

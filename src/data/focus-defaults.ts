import type { FocusMethodId } from "@/types/focus";

export const FOCUS_METHOD_COLORS: Record<FocusMethodId, string> = {
  gtd: "#22C55E",
  pomodoro: "#EF4444",
  pareto: "#2563EB",
  moffatt: "#7C3AED",
  howell: "#F97316",
  swot: "#EAB308",
};

export const FOCUS_METHOD_LABELS: Record<FocusMethodId, { zh: string; en: string }> = {
  gtd: { zh: "GTD 搞定", en: "Getting Things Done" },
  pomodoro: { zh: "番茄钟", en: "Pomodoro" },
  pareto: { zh: "帕累托原则", en: "Pareto Principle" },
  moffatt: { zh: "莫法特休息法", en: "Moffatt Rest" },
  howell: { zh: "豪威尔矩阵", en: "Howell Matrix" },
  swot: { zh: "SWOT 分析", en: "SWOT Analysis" },
};

export function defaultFocusBlockName(method: FocusMethodId): string {
  return FOCUS_METHOD_LABELS[method].zh;
}

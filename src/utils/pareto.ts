import type { ParetoItem } from "@/types";
import { PARETO_DEFAULTS } from "@/data/constants";

export function calculateParetoScores(items: Omit<ParetoItem, "score" | "isVital">[]): ParetoItem[] {
  const scored = items
    .map((item) => ({
      ...item,
      score: Math.round((item.impact * 0.7 + (100 - item.effort) * 0.3)),
      isVital: false,
    }))
    .sort((a, b) => b.score - a.score);
  const totalScore = scored.reduce((sum, it) => sum + it.score, 0);
  const threshold = PARETO_DEFAULTS.impactThreshold;
  return scored.map((item, i) => {
    let cumulative = 0;
    for (let j = 0; j <= i; j++) {
      cumulative += (scored[j]!.score / totalScore) * 100;
    }
    return { ...item, isVital: cumulative <= threshold };
  });
}

"use client";

import { useTasks } from "@/hooks/useTasks";
import { getTaskColor, getTaskLabel } from "@/utils/colors";

export default function FloatingStatsCard() {
  const { filteredTasks } = useTasks();
  const total = filteredTasks.length;

  const counts: Record<string, number> = {};
  for (const t of filteredTasks) {
    counts[t.type] = (counts[t.type] ?? 0) + 1;
  }

  const typeKeys = Object.keys(counts).sort();

  return (
    <div className="flex items-center gap-2">
      {typeKeys.length === 0 ? (
        <span className="text-[0.55rem] text-white/15">暂无任务</span>
      ) : (
        typeKeys.map((k) => (
          <div key={k} className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getTaskColor(k) }} />
            <span className="font-satoshi text-[0.55rem] text-white/30">{getTaskLabel(k).zh}</span>
            <span className="font-mono text-[0.5rem] tabular-nums text-white/20">{counts[k]}</span>
          </div>
        ))
      )}
    </div>
  );
}

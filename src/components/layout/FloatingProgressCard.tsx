"use client";

import { useTasks } from "@/hooks/useTasks";

export default function FloatingProgressCard() {
  const { filteredTasks } = useTasks();
  const total = filteredTasks.length;
  const completed = filteredTasks.filter((t) => t.completed).length;
  const avgProgress = total > 0
    ? Math.round(filteredTasks.reduce((s, t) => s + t.progress, 0) / total)
    : 0;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-baseline gap-0.5">
        <span className="font-clash text-xl font-bold leading-none tracking-[-0.02em] text-white/90">
          {avgProgress}
        </span>
        <span className="font-clash text-xs text-white/30">%</span>
      </div>
      <div className="w-20 h-1 rounded-full overflow-hidden bg-white/[0.06]">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${avgProgress}%`,
            background: "linear-gradient(90deg, #2563EB 0%, #EAB308 100%)",
          }}
        />
      </div>
      <span className="font-mono text-[0.55rem] tabular-nums text-white/25">
        {completed}/{total}
      </span>
    </div>
  );
}

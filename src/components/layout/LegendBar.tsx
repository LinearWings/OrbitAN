"use client";

import { useFilter } from "@/hooks/useFilter";
import { useAppContext } from "@/context/AppContext";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";
import { TASK_TYPE_LIST } from "@/data/constants";
import { getTaskColor, getTaskLabel } from "@/utils/colors";
import { loadCustomTypes } from "@/utils/storage";

export default function LegendBar() {
  const { activeFilter, setFilter, clearFilter } = useFilter();
  const { state } = useAppContext();
  const lang = useLanguage();
  const t = getT(lang);
  const todayTasks = state.tasks[state.currentDate] ?? [];

  const totalCount = todayTasks.length;

  const countByType = (type: string): number =>
    todayTasks.filter((t) => t.type === type).length;

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={clearFilter}
        className={`rounded-full border px-2.5 py-1 text-[0.7rem] font-medium tracking-[0.03em] transition-all ${
          activeFilter === "all"
            ? "border-white/20 bg-white/[0.08] text-white/80"
            : "border-white/8 text-white/30 hover:border-white/15 hover:text-white/50"
        }`}
      >
        {t.orbit_filter_all}
        <span className="ml-1.5 font-mono text-[0.6rem] opacity-40">{totalCount}</span>
      </button>
      {TASK_TYPE_LIST.map((type: string) => {
        const color = getTaskColor(type);
        const label = getTaskLabel(type);
        const count = countByType(type);
        return (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.7rem] font-medium tracking-[0.03em] transition-all ${
              activeFilter === type
                ? "border-white/20 bg-white/[0.08] text-white/80"
                : "border-white/8 text-white/30 hover:border-white/15 hover:text-white/50"
            }`}
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: color }}
            />
            {lang === "en" ? label.en : label.zh}
            <span className="ml-1 font-mono text-[0.6rem] opacity-40">{count}</span>
          </button>
        );
      })}
      {/* Custom types found in today's tasks */}
      {(() => {
        const customTypeDefs = loadCustomTypes();
        const defMap = new Map(customTypeDefs.map(d => [d.id, d]));
        const customTypesToday = [...new Set(
          todayTasks.map(t => t.type).filter(t => !TASK_TYPE_LIST.includes(t))
        )];
        return customTypesToday.map(type => {
          const def = defMap.get(type);
          const color = def?.color ?? getTaskColor(type);
          const taskLabel = getTaskLabel(type);
          const label = def?.name ?? (lang === "en" ? taskLabel.en : taskLabel.zh);
          const count = countByType(type);
          return (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.7rem] font-medium tracking-[0.03em] transition-all ${
                activeFilter === type
                  ? "border-white/20 bg-white/[0.08] text-white/80"
                  : "border-white/8 text-white/30 hover:border-white/15 hover:text-white/50"
              }`}
            >
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              {label}
              <span className="ml-1 font-mono text-[0.6rem] opacity-40">{count}</span>
            </button>
          );
        });
      })()}
    </div>
  );
}

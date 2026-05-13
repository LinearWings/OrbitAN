"use client";

import { useViewNavigation } from "@/hooks/useViewNavigation";

const VIEW_LABELS: Record<string, string> = {
  day: "日",
  week: "周",
  month: "月",
};

export default function DateNav() {
  const { currentDate, viewMode, setViewMode, goToPrevious, goToNext, goToToday } = useViewNavigation();

  const dateObj = new Date(currentDate + "T00:00:00");
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  const weekday = weekdays[dateObj.getDay()]!;
  const formatted = `${dateObj.getFullYear()}年${dateObj.getMonth() + 1}月${dateObj.getDate()}日`;

  return (
    <div className="absolute top-8 right-8 z-30 flex items-center gap-3">
      {/* View mode tabs */}
      <div className="flex items-center rounded-lg border border-white/[0.08] bg-white/[0.03] p-0.5 mr-2">
        {(["day", "week", "month"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`rounded-md px-2.5 py-1 text-[0.65rem] font-medium tracking-[0.05em] transition-all ${
              viewMode === mode
                ? "bg-white/[0.1] text-white/80"
                : "text-white/30 hover:text-white/60"
            }`}
          >
            {VIEW_LABELS[mode]}
          </button>
        ))}
      </div>

      <button
        onClick={goToPrevious}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] font-mono text-white/50 text-sm transition-all hover:border-white/30 hover:bg-white/[0.08] hover:text-white/80"
      >
        ←
      </button>

      <div className="text-center">
        <div className="font-clash text-lg font-semibold leading-none tracking-[-0.02em] text-white/90">
          {formatted}
        </div>
        <div className="font-satoshi mt-0.5 text-[0.65rem] tracking-[0.1em] text-white/30 uppercase">
          周{weekday}
        </div>
      </div>

      <button
        onClick={goToNext}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] font-mono text-sm text-white/50 transition-all hover:border-white/30 hover:bg-white/[0.08] hover:text-white/80"
      >
        →
      </button>

      <button
        onClick={goToToday}
        className="rounded-full border border-white/15 bg-white/[0.03] px-3 py-1.5 font-satoshi text-[0.65rem] tracking-[0.05em] text-white/40 transition-all hover:border-white/30 hover:bg-white/[0.08] hover:text-white/70"
      >
        T
      </button>
    </div>
  );
}

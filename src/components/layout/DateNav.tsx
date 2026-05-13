"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useViewNavigation } from "@/hooks/useViewNavigation";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/Icons";

const VIEW_LABELS: Record<string, string> = {
  day: "日",
  week: "周",
  month: "月",
};

export default function DateNav() {
  const { currentDate, viewMode, setViewMode, goToPrevious, goToNext, goToToday } = useViewNavigation();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const dateObj = new Date(currentDate + "T00:00:00");
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  const weekday = weekdays[dateObj.getDay()]!;
  const formatted = isMobile
    ? `${dateObj.getMonth() + 1}月${dateObj.getDate()}日`
    : `${dateObj.getFullYear()}年${dateObj.getMonth() + 1}月${dateObj.getDate()}日`;

  return (
    <div className={`absolute ${isMobile ? 'top-3 right-4' : 'top-8 right-8'} z-30 flex items-center gap-3`}>
      {/* View mode tabs */}
      <div className={`flex items-center rounded-lg border border-white/[0.08] bg-white/[0.03] p-0.5 ${isMobile ? 'mr-1' : 'mr-2'}`}>
        {(["day", "week", "month"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`rounded-md ${isMobile ? 'px-1.5 py-0.5 text-[0.55rem]' : 'px-2.5 py-1 text-[0.65rem]'} font-medium tracking-[0.05em] transition-all ${
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
        className={`flex items-center justify-center rounded-full border border-white/15 bg-white/[0.03] font-mono text-white/50 transition-all hover:border-white/30 hover:bg-white/[0.08] hover:text-white/80 ${isMobile ? 'h-6 w-6 text-xs' : 'h-8 w-8 text-sm'}`}
      >
        <ArrowLeftIcon size={14} />
      </button>

      <div className="text-center">
        <div className={`font-clash font-semibold leading-none tracking-[-0.02em] text-white/90 ${isMobile ? 'text-sm' : 'text-lg'}`}>
          {formatted}
        </div>
        <div className={`font-satoshi mt-0.5 tracking-[0.1em] text-white/30 uppercase ${isMobile ? 'text-[0.55rem]' : 'text-[0.65rem]'}`}>
          周{weekday}
        </div>
      </div>

      <button
        onClick={goToNext}
        className={`flex items-center justify-center rounded-full border border-white/15 bg-white/[0.03] font-mono text-white/50 transition-all hover:border-white/30 hover:bg-white/[0.08] hover:text-white/80 ${isMobile ? 'h-6 w-6 text-xs' : 'h-8 w-8 text-sm'}`}
      >
        <ArrowRightIcon size={14} />
      </button>

      <button
        onClick={goToToday}
        className={`rounded-full border border-white/15 bg-white/[0.03] font-satoshi tracking-[0.05em] text-white/40 transition-all hover:border-white/30 hover:bg-white/[0.08] hover:text-white/70 ${isMobile ? 'px-2 py-1 text-[0.55rem]' : 'px-3 py-1.5 text-[0.65rem]'}`}
      >
        T
      </button>
    </div>
  );
}

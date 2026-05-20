"use client";

import { OrbitIcon, PlusIcon, GridIcon, ArrangeIcon } from "@/components/ui/Icons";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";
import { getTaskLabel } from "@/utils/colors";

const FILTER_KEYS = ["all", "work", "study", "meeting", "personal"] as const;
const FILTER_COLORS: Record<string, string> = {
  all: "#ffffff",
  work: "#3B82F6",
  study: "#EAB308",
  meeting: "#4B5563",
  personal: "#78716C",
};

interface MobileBottomBarProps {
  activeFilter: string;
  onFilterChange: (f: string) => void;
  isOrbitMode: boolean;
  onToggleOrbit: () => void;
  viewMode: string;
  onCycleView: () => void;
  onNewTask: () => void;
  onAutoArrange: () => void;
  onOpenDocs: () => void;
}

export default function MobileBottomBar({
  activeFilter,
  onFilterChange,
  isOrbitMode,
  onToggleOrbit,
  viewMode,
  onCycleView,
  onNewTask,
  onAutoArrange,
  onOpenDocs,
}: MobileBottomBarProps) {
  const lang = useLanguage();
  const t = getT(lang);
  const viewLabel = viewMode === "day" ? t.orbit_view_day : viewMode === "week" ? t.orbit_view_week : t.orbit_view_month;

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-50 flex flex-col gap-2 px-3 pt-2"
      style={{
        paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
        background: "linear-gradient(to top, rgba(8,8,8,0.98) 0%, rgba(8,8,8,0.9) 70%, rgba(8,8,8,0) 100%)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      {/* Filter pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar px-1">
        {FILTER_KEYS.map((key) => {
          const color = FILTER_COLORS[key];
          const label = key === "all" ? t.orbit_filter_all : getTaskLabel(key)[lang];
          return (
            <button
              key={key}
              onClick={() => onFilterChange(key)}
              className="shrink-0 rounded-full px-3 py-1 text-[0.65rem] font-medium transition-all"
              style={{
                background: activeFilter === key ? `${color}20` : "rgba(255,255,255,0.04)",
                border: activeFilter === key ? `1px solid ${color}40` : "1px solid rgba(255,255,255,0.06)",
                color: activeFilter === key ? color : "rgba(255,255,255,0.4)",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Main action buttons */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={onNewTask}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
          style={{
            background: "rgba(37,99,235,0.15)",
            border: "1px solid rgba(37,99,235,0.2)",
            color: "#60A5FA",
          }}
        >
          <PlusIcon size={14} />
          {t.orbit_hint_new}
        </button>

        <button
          onClick={onToggleOrbit}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
          style={
            isOrbitMode
              ? {
                  background: "rgba(245,158,11,0.15)",
                  border: "1px solid rgba(245,158,11,0.25)",
                  color: "#FBBF24",
                }
              : {
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.7)",
                }
          }
        >
          <OrbitIcon size={15} />
          Orbit
        </button>

        <button
          onClick={onCycleView}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          <GridIcon size={14} />
          {viewLabel}
        </button>

        <button
          onClick={onAutoArrange}
          className="flex items-center justify-center w-10 h-10 rounded-xl transition-all shrink-0"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.4)",
          }}
          title={t.orbit_arrange}
        >
          <ArrangeIcon size={12} />
        </button>
      </div>
    </div>
  );
}

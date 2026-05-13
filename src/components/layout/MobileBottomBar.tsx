"use client";

import { OrbitIcon, PlusIcon, GridIcon, ArrangeIcon } from "@/components/ui/Icons";

const FILTER_OPTIONS = [
  { key: "all", label: "全部", color: "#ffffff" },
  { key: "work", label: "工作", color: "#3B82F6" },
  { key: "study", label: "学习", color: "#EAB308" },
  { key: "meeting", label: "会议", color: "#4B5563" },
  { key: "personal", label: "个人", color: "#78716C" },
] as const;

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
  const viewLabel = viewMode === "day" ? "日" : viewMode === "week" ? "周" : "月";

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
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => onFilterChange(opt.key)}
            className="shrink-0 rounded-full px-3 py-1 text-[0.65rem] font-medium transition-all"
            style={{
              background: activeFilter === opt.key ? `${opt.color}20` : "rgba(255,255,255,0.04)",
              border: activeFilter === opt.key ? `1px solid ${opt.color}40` : "1px solid rgba(255,255,255,0.06)",
              color: activeFilter === opt.key ? opt.color : "rgba(255,255,255,0.4)",
            }}
          >
            {opt.label}
          </button>
        ))}
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
          新建
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
          title="整理"
        >
          <ArrangeIcon size={12} />
        </button>
      </div>
    </div>
  );
}

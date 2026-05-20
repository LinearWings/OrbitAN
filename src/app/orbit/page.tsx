"use client";

import { useMemo, useCallback, memo, useState, useEffect, useRef, type ReactNode } from "react";
import TitleHeader from "@/components/layout/TitleHeader";
import DateNav from "@/components/layout/DateNav";
import HybridClock from "@/components/orbital/HybridClock";
import OrbitalCursor from "@/components/orbital/OrbitalCursor";
import FloatingProgressCard from "@/components/layout/FloatingProgressCard";
import FloatingStatsCard from "@/components/layout/FloatingStatsCard";
import ConnectorArrows from "@/components/layout/ConnectorArrows";
import NoiseOverlay from "@/components/layout/NoiseOverlay";
import ScheduleItem from "@/components/schedule/ScheduleItem";
import type { CardPosition } from "@/components/schedule/ScheduleItem";
import LegendBar from "@/components/layout/LegendBar";
import EditPanel from "@/components/editor/EditPanel";
import InlineTaskCreator from "@/components/editor/InlineTaskCreator";
import DeleteBubble from "@/components/editor/DeleteBubble";
import OrbitModeTransition from "@/components/orbital/OrbitModeTransition";
import FocusTimelineOverlay from "@/components/focus/FocusTimelineOverlay";
import FocusBlockCreator from "@/components/focus/FocusBlockCreator";
import MethodPickerPopup from "@/components/focus/MethodPickerPopup";
import OrbitPlanPicker from "@/components/focus/OrbitPlanPicker";
import MethodologyDrawer from "@/components/orbital/MethodologyDrawer";
import DocsOverlay from "@/components/docs/DocsOverlay";
import type { FocusMethodId, FocusBlock } from "@/types/focus";
import type { Task } from "@/types";
import { useTasks } from "@/hooks/useTasks";
import { useSelectedTask } from "@/hooks/useSelectedTask";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useOrbital } from "@/hooks/useOrbital";
import { useFilter } from "@/hooks/useFilter";
import { useAppContext } from "@/context/AppContext";
import { useViewNavigation } from "@/hooks/useViewNavigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import MobileBottomBar from "@/components/layout/MobileBottomBar";
import { CrosshairIcon, OrbitIcon, MouseScrollIcon } from "@/components/ui/Icons";
import WeekGridView from "@/components/layout/WeekGridView";
import MonthGridView from "@/components/layout/MonthGridView";
import { timeToMinutes, timeToAngle } from "@/utils/time";
import { useFocusBlocks } from "@/hooks/useFocusBlocks";
import { FOCUS_METHOD_COLORS, FOCUS_METHOD_LABELS } from "@/data/focus-defaults";
import { getTaskColor } from "@/utils/colors";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";

function HintKbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex items-center justify-center px-1.5 py-0.5 min-w-[20px] rounded-md text-[0.6rem] font-semibold font-mono"
      style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.4)" }}>
      {children}
    </kbd>
  );
}

function computeCardPositions(tasks: Task[]): CardPosition[] {
  if (tasks.length === 0) return [];

  const LEFT_ZONE_BASE = 10;
  const RIGHT_ZONE_BASE = 85;
  const TOP_START = 18;
  const MAX_TOP = 76;
  const usableHeight = MAX_TOP - TOP_START;
  const DAY_START = 360;   // 06:00
  const DAY_END = 1080;    // 18:00
  const DAY_RANGE = DAY_END - DAY_START;

  // Assign preferred side from comet head position, then pair-swap crossings.
  // Each card prefers the side matching its head (no arrow crossing the dial).
  // If one side is over capacity, excess cards flip (creating crossings).
  // Pairs of opposite-flipped cards swap sides to eliminate both crossings.
  // Final result: at most 1 arrow crosses the dial.
  const prefersLeft = new Map<string, boolean>();
  for (const t of tasks) {
    prefersLeft.set(t.id, Math.cos(timeToAngle(t.endTime)) < 0);
  }

  const maxPerSide = Math.ceil(tasks.length / 2);
  const sideMap = new Map<string, boolean>();
  let leftActual = 0, rightActual = 0;
  const leftCrossed: string[] = []; // right-preferring, forced to left
  const rightCrossed: string[] = []; // left-preferring, forced to right

  for (const t of tasks) {
    const pref = prefersLeft.get(t.id) ?? false;
    if (pref && leftActual < maxPerSide) {
      sideMap.set(t.id, true); leftActual++;
    } else if (!pref && rightActual < maxPerSide) {
      sideMap.set(t.id, false); rightActual++;
    } else if (pref) {
      // Left is full, forced to right → crossing
      sideMap.set(t.id, false); rightActual++;
      rightCrossed.push(t.id);
    } else {
      sideMap.set(t.id, true); leftActual++;
      leftCrossed.push(t.id);
    }
  }

  // Pair-swap: each pair eliminates 2 crossings at once
  if (leftCrossed.length > 0 && rightCrossed.length > 0) {
    const pairs = Math.min(leftCrossed.length, rightCrossed.length);
    for (let i = 0; i < pairs; i++) {
      sideMap.set(leftCrossed[i], true);  // back to preferred left
      sideMap.set(rightCrossed[i], false); // back to preferred right
    }
  }
  // ≤ 1 crossing remains (leftCrossed or rightCrossed may have 1 leftover)

  let leftCount = 0;
  let rightCount = 0;

  const positions = tasks.map((task) => {
    const isLeftSide = sideMap.get(task.id) ?? true;
    const sideIdx = isLeftSide ? leftCount++ : rightCount++;

    // Deterministic personality from task ID (stable across renders)
    const idHash = task.id.split("").reduce((s, c) => s + c.charCodeAt(0), 0);

    // Horizontal: zone base + organic spread within the zone
    const hPersonality = ((idHash % 11) - 5) * 0.7; // ±3.5%
    let left = isLeftSide
      ? Math.max(18, Math.min(48, LEFT_ZONE_BASE + 2 + hPersonality))
      : Math.max(52, Math.min(82, RIGHT_ZONE_BASE - 2 + hPersonality));

    // Vertical: startTime + tiny offset for organic feel
    const vPersonality = (((idHash * 7) % 7) - 3) * 0.4; // ±1.2%
    const spread = Math.min(1, tasks.length / 4);
    const usableNow = usableHeight * spread;
    const center = (TOP_START + MAX_TOP) / 2;
    const taskMin = Math.max(DAY_START, Math.min(DAY_END, timeToMinutes(task.startTime)));
    const fraction = (taskMin - DAY_START) / DAY_RANGE;
    const top = center + (fraction - 0.5) * usableNow + vPersonality;

    return { left, top, isLeftSide, taskId: task.id } as CardPosition & { isLeftSide: boolean; taskId: string };
  });

  // Collision resolution: enforce minimum gap, preserve clockwise time order
  const MIN_GAP = 15;
  const timeOrder = new Map<string, number>();
  for (const t of tasks) timeOrder.set(t.id, timeToMinutes(t.startTime));

  for (let pass = 0; pass < 2; pass++) {
    for (const side of [true, false]) {
      const sideCards = positions
        .map((p, i) => ({ ...p, i }))
        .filter((p) => p.isLeftSide === side);
      if (sideCards.length < 2) continue;
      // Sort by startTime so clockwise order is preserved
      sideCards.sort((a, b) => (timeOrder.get(a.taskId) ?? 0) - (timeOrder.get(b.taskId) ?? 0));

      const needed = TOP_START + (sideCards.length - 1) * MIN_GAP;
      if (needed > MAX_TOP) {
        // Distribute in time order from top to bottom (early→late)
        for (let i = 0; i < sideCards.length; i++) {
          sideCards[i].top = TOP_START + (i / (sideCards.length - 1)) * (MAX_TOP - TOP_START);
        }
      } else {
        for (let i = 1; i < sideCards.length; i++) {
          const prevTop = sideCards[i - 1].top;
          if (sideCards[i].top - prevTop < MIN_GAP) {
            sideCards[i].top = Math.min(prevTop + MIN_GAP, MAX_TOP);
          }
        }
        if (sideCards[sideCards.length - 1].top >= MAX_TOP) {
          for (let i = 0; i < sideCards.length; i++) {
            sideCards[i].top = TOP_START + (i / (sideCards.length - 1)) * (MAX_TOP - TOP_START);
          }
        }
      }
      for (const sc of sideCards) {
        positions[sc.i].top = sc.top;
      }
    }
  }

  return positions;
}

interface ScheduleCardWrapperProps {
  task: Task;
  index: number;
  position?: CardPosition;
  selectedTaskId: string | null;
  activeFilter: string;
  onSelectTask: (id: string | null) => void;
  onProgress: (id: string, progress: number) => void;
  onUpdateTask: (id: string, fields: Partial<Task>) => void;
  linkedFocusColor?: string;
  isOrbitMode?: boolean;
  onSetOrbitPlan?: (taskId: string) => void;
  isDeleteTarget?: boolean;
  dimmed?: boolean;
}

const ScheduleCardWrapper = memo(function ScheduleCardWrapper({
  task,
  index,
  position,
  selectedTaskId,
  activeFilter,
  onSelectTask,
  onProgress,
  onUpdateTask,
  linkedFocusColor,
  isOrbitMode,
  onSetOrbitPlan,
  isDeleteTarget,
  dimmed,
}: ScheduleCardWrapperProps) {
  const isSelected = task.id === selectedTaskId;
  const isFiltered = activeFilter !== "all" && task.type !== activeFilter;

  const handleSelect = useCallback(() => {
    if (isDeleteTarget) return;
    onSelectTask(isSelected ? null : task.id);
  }, [onSelectTask, isSelected, task.id, isDeleteTarget]);

  const handleProgress = useCallback(
    (progress: number) => {
      onProgress(task.id, progress);
    },
    [onProgress, task.id],
  );

  const handleUpdate = useCallback(
    (id: string, fields: Partial<Task>) => {
      onUpdateTask(id, fields);
    },
    [onUpdateTask],
  );

  return (
    <ScheduleItem
      task={task}
      isSelected={isSelected || !!isDeleteTarget}
      isFiltered={isFiltered}
      zIndex={20 + (isSelected ? 10 : index)}
      position={position}
      onSelect={handleSelect}
      onProgressChange={handleProgress}
      onUpdate={handleUpdate}
      linkedFocusColor={linkedFocusColor}
      isOrbitMode={isOrbitMode}
      onSetOrbitPlan={onSetOrbitPlan}
      dimmed={dimmed}
      isDeleteTarget={isDeleteTarget}
    />
  );
});

export default function Home() {
  const { state, dispatch } = useAppContext();
  const { isOrbitModeOpen, toggleOrbitMode } = useOrbital();
  const { filteredTasks, tasksForDate, addTask, updateTask, updateProgress, deleteTask } = useTasks();
  const { selectedTaskId, selectTask } = useSelectedTask();
  const { activeFilter } = useFilter();
  const { viewMode, navigateToDay, setViewMode, goToPrevious, goToNext } = useViewNavigation();
  const { focusBlocksForDate, addFocusBlock, deleteFocusBlock } = useFocusBlocks();

  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTouchDevice = useMediaQuery("(hover: none) and (pointer: coarse)");
  const lang = useLanguage();
  const t = getT(lang);

  // Focus Mode overlay state
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [orbitPlanPickerTask, setOrbitPlanPickerTask] = useState<string | null>(null);
  const [dragClearCount, setDragClearCount] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string; type: "task" | "focus"; fromX: number; fromY: number; targetRect?: { left: number; top: number; right: number; bottom: number };
  } | null>(null);
  const undoStackRef = useRef<Array<{ type: "task" | "focus"; data: Task | FocusBlock; date: string }>>([]);
  const [isMethodologyDrawerOpen, setIsMethodologyDrawerOpen] = useState(false);
  const [methodologyDrawerMethod, setMethodologyDrawerMethod] = useState<FocusMethodId | null>(null);
  const [isDocsOverlayOpen, setIsDocsOverlayOpen] = useState(false);
  const [isFocusCreating, setIsFocusCreating] = useState(false);
  const [focusCreatePhase, setFocusCreatePhase] = useState<"idle" | "start" | "end">("idle");
  const [pendingFocusStartTime, setPendingFocusStartTime] = useState<string | null>(null);
  const [pendingFocusEndTime, setPendingFocusEndTime] = useState<string | null>(null);
  const [focusDrawResult, setFocusDrawResult] = useState<{ date?: string; startTime: string; endTime: string } | null>(null);
  const [focusDrawPos, setFocusDrawPos] = useState<{ x: number; y: number } | null>(null);

  const focusBlockArcs = useMemo(() => {
    if (viewMode !== "day") return [];
    // Overlap-avoidance ring assignment (same algorithm as task comets)
    const sorted = [...focusBlocksForDate].sort((a, b) => {
      const d = a.startTime.localeCompare(b.startTime);
      if (d !== 0) return d;
      // Longer duration first
      const da = timeToMinutes(a.endTime) - timeToMinutes(a.startTime);
      const db = timeToMinutes(b.endTime) - timeToMinutes(b.startTime);
      return (db < 0 ? db + 1440 : db) - (da < 0 ? da + 1440 : da);
    });
    const rings: { endMin: number }[] = [];
    const fbToRing = new Map<string, number>();
    const MAX_FOCUS_RINGS = 4;
    for (const fb of sorted) {
      const sm = timeToMinutes(fb.startTime);
      let em = timeToMinutes(fb.endTime);
      if (em <= sm) em += 1440;
      let ring = 0;
      while (ring < rings.length && (rings[ring]?.endMin ?? 0) > sm) ring++;
      const assignedRing = Math.min(ring, MAX_FOCUS_RINGS - 1);
      if (ring < MAX_FOCUS_RINGS) rings[assignedRing] = { endMin: em };
      else rings[MAX_FOCUS_RINGS - 1] = { endMin: Math.max(rings[MAX_FOCUS_RINGS - 1]?.endMin ?? 0, em) };
      fbToRing.set(fb.id, assignedRing);
    }
    // Focus rings outside task rings (0.66–0.96): start at 0.97, gap 0.05
    return focusBlocksForDate.map((fb) => {
      const ring = fbToRing.get(fb.id) ?? 0;
      return {
        startAngle: timeToAngle(fb.startTime),
        endAngle: timeToAngle(fb.endTime),
        color: FOCUS_METHOD_COLORS[fb.method],
        isActive: isOrbitModeOpen && fb.status !== "completed",
        ringRadius: 0.97 + ring * 0.05,
        methodId: fb.method,
        blockId: fb.id,
      };
    });
  }, [focusBlocksForDate, isOrbitModeOpen, viewMode]);

  // UI state
  const [layoutKey, setLayoutKey] = useState(0);
  const [manualOverrides, setManualOverrides] = useState<Map<string, { left: number; top: number }>>(new Map());
  const manualOverridesRef = useRef(manualOverrides);
  manualOverridesRef.current = manualOverrides;
  const swipeStartRef = useRef<Map<string, { x: number; y: number }>>(new Map());

  // Inline creation state
  const [isCreating, setIsCreating] = useState(false);
  const [clickPhase, setClickPhase] = useState<"idle" | "start" | "end">("idle");
  const [pendingStartTime, setPendingStartTime] = useState<string | null>(null);
  const [pendingEndTime, setPendingEndTime] = useState<string | null>(null);

  // Week view inline creation state
  const [weekCreateDay, setWeekCreateDay] = useState<string | null>(null);
  const [weekCreatePhase, setWeekCreatePhase] = useState<"idle" | "start" | "end">("idle");
  const [pendingWeekStartTime, setPendingWeekStartTime] = useState<string | null>(null);
  const [pendingWeekEndTime, setPendingWeekEndTime] = useState<string | null>(null);
  const [pendingWeekDate, setPendingWeekDate] = useState<string | null>(null);

  // Preview type for real-time color updates during creation
  const [previewType, setPreviewType] = useState<string>("work");

  const handleStartCreate = useCallback(() => {
    setIsCreating(true);
    setClickPhase("start");
    setPendingStartTime(null);
    setPendingEndTime(null);
    setPreviewType("work");
  }, []);

  const handleWeekCreate = useCallback((date: string) => {
    navigateToDay(date);
    setIsCreating(true);
    setClickPhase("start");
    setPendingStartTime(null);
    setPendingEndTime(null);
  }, [navigateToDay]);

  const handleCancelCreate = useCallback(() => {
    setIsCreating(false);
    setClickPhase("idle");
    setPendingStartTime(null);
    setPendingEndTime(null);
  }, []);

  const handleTimeSelect = useCallback((time: string) => {
    if (clickPhase === "idle" || clickPhase === "start") {
      setPendingStartTime(time);
      setClickPhase("end");
    } else if (clickPhase === "end") {
      setPendingEndTime(time);
      setClickPhase("idle");
    }
  }, [clickPhase]);

  const handleCreateTask = useCallback((task: { name: string; type: string; startTime: string; endTime: string }) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      type: task.type,
      name: task.name,
      startTime: task.startTime,
      endTime: task.endTime,
      progress: 0,
      completed: false,
      note: "",
      createdAt: new Date().toISOString(),
    };
    addTask(newTask);
    setIsCreating(false);
    setClickPhase("idle");
    setPendingStartTime(null);
    setPendingEndTime(null);
  }, [addTask]);

  // Week view: start inline creation for a specific day (from "+" button)
  const handleWeekCreateInline = useCallback((date: string) => {
    setWeekCreateDay(date);
  }, []);

  // Week view: start timeline creation mode (click on grid to select times)
  const handleWeekTimelineCreate = useCallback(() => {
    setWeekCreatePhase("start");
    setPendingWeekStartTime(null);
    setPendingWeekEndTime(null);
    setPendingWeekDate(null);
    setPreviewType("work");
  }, []);

  // Week view: handle time selection on grid
  const handleWeekTimeSelect = useCallback((date: string, time: string) => {
    if (weekCreatePhase === "start") {
      setPendingWeekStartTime(time);
      setPendingWeekDate(date);
      setWeekCreatePhase("end");
    } else if (weekCreatePhase === "end") {
      setPendingWeekEndTime(time);
      setPendingWeekDate(date);
      setWeekCreatePhase("idle");
      // Open detail panel after state settles
      setTimeout(() => setWeekCreateDay(date), 0);
    }
  }, [weekCreatePhase]);

  // Cancel week timeline creation
  const handleCancelWeekTimeline = useCallback(() => {
    setWeekCreatePhase("idle");
    setPendingWeekStartTime(null);
    setPendingWeekEndTime(null);
    setPendingWeekDate(null);
    setWeekCreateDay(null);
  }, []);

  // Week view: create task on the selected day
  const handleCreateTaskForWeek = useCallback((task: { name: string; type: string; startTime: string; endTime: string }) => {
    if (!weekCreateDay) return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      type: task.type,
      name: task.name,
      startTime: task.startTime,
      endTime: task.endTime,
      progress: 0,
      completed: false,
      note: "",
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: "ADD", payload: { date: weekCreateDay, task: newTask } });
    setWeekCreateDay(null);
    setPendingWeekStartTime(null);
    setPendingWeekEndTime(null);
    setPendingWeekDate(null);
    setWeekCreatePhase("idle");
  }, [weekCreateDay, dispatch]);

  const handleNudgeTime = useCallback((field: "start" | "end", delta: number) => {
    // Auto-initialize with defaults on mobile (clock not interactive)
    if (!pendingStartTime) setPendingStartTime("09:00");
    if (!pendingEndTime) setPendingEndTime("10:00");
    const time = field === "start" ? (pendingStartTime ?? "09:00") : (pendingEndTime ?? "10:00");
    const [h, m] = time.split(":").map(Number);
    const total = (((h ?? 0) * 60 + (m ?? 0) + delta) % 1440 + 1440) % 1440;
    const hh = Math.floor(total / 60);
    const mm = total % 60;
    const newTime = `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
    if (field === "start") setPendingStartTime(newTime);
    else setPendingEndTime(newTime);
  }, [pendingStartTime, pendingEndTime]);

  useKeyboard(handleStartCreate);

  // Escape to cancel focus creation / method picker
  useEffect(() => {
    if (!isFocusCreating && !focusDrawResult) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFocusCreating(false);
        setFocusCreatePhase("idle");
        setPendingFocusStartTime(null);
        setPendingFocusEndTime(null);
        setFocusDrawResult(null);
        setFocusDrawPos(null);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isFocusCreating, focusDrawResult]);

  // Focus creation — click-twice on clock (same logic as normal task creation)
  const handleStartFocusCreate = useCallback(() => {
    setIsFocusCreating(true);
    setFocusCreatePhase("start");
    setPendingFocusStartTime(null);
    setPendingFocusEndTime(null);
  }, []);

  const handleCancelFocusCreate = useCallback(() => {
    setIsFocusCreating(false);
    setFocusCreatePhase("idle");
    setPendingFocusStartTime(null);
    setPendingFocusEndTime(null);
    setFocusDrawResult(null);
    setFocusDrawPos(null);
    setDragClearCount(c => c + 1);
  }, []);

  // Ctrl+Z undo delete
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey && !deleteTarget) {
        e.preventDefault();
        const entry = undoStackRef.current.pop();
        if (!entry) return;
        if (entry.type === "task") {
          addTask(entry.data as Task);
        } else {
          addFocusBlock({ ...entry.data as FocusBlock, date: entry.date });
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [deleteTarget, addTask, addFocusBlock]);

  // Reset focus creation when leaving day view (prevent stale state)
  useEffect(() => {
    if (viewMode !== "day") handleCancelFocusCreate();
  }, [viewMode, handleCancelFocusCreate]);

  // Touch swipe gesture — left/right to navigate days (mobile only)
  useEffect(() => {
    if (!isMobile) return;
    let startX = 0;
    let startY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      startX = e.touches[0]!.clientX;
      startY = e.touches[0]!.clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length !== 1) return;
      // Skip if the swipe was on a task card (handled by card-level swipe-to-delete)
      const target = e.target as HTMLElement;
      if (target.closest("[data-task-id]")) return;
      const dx = e.changedTouches[0]!.clientX - startX;
      const dy = e.changedTouches[0]!.clientY - startY;
      // Only trigger if horizontal swipe > 60px and dominates vertical
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        if (dx > 0) goToPrevious();
        else goToNext();
      }
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [isMobile, goToPrevious, goToNext]);

  const handleFocusTimeSelect = useCallback((time: string) => {
    if (focusCreatePhase === "start") {
      setPendingFocusStartTime(time);
      setFocusCreatePhase("end");
    } else if (focusCreatePhase === "end" && pendingFocusStartTime) {
      let et = time;
      const sm = parseInt(pendingFocusStartTime.slice(0, 2)) * 60 + parseInt(pendingFocusStartTime.slice(3));
      const em = parseInt(et.slice(0, 2)) * 60 + parseInt(et.slice(3));
      if (em <= sm) {
        const fixed = (sm + 30) % 1440;
        et = `${String(Math.floor(fixed / 60)).padStart(2, "0")}:${String(fixed % 60).padStart(2, "0")}`;
      }
      // Keep isFocusCreating=true so the clock renders the solid preview arc
      setPendingFocusEndTime(et);
      setFocusCreatePhase("idle");
      setFocusDrawResult({ startTime: pendingFocusStartTime, endTime: et });
      setFocusDrawPos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    }
  }, [focusCreatePhase, pendingFocusStartTime]);

  // Week view column drag handler
  const handleWeekDrawComplete = useCallback((date: string, startTime: string, endTime: string, x: number, y: number) => {
    setFocusDrawResult({ date, startTime, endTime });
    setFocusDrawPos({ x, y });
  }, []);

  const handleMethodPick = useCallback((methodId: FocusMethodId) => {
    if (!focusDrawResult) return;
    addFocusBlock({
      date: focusDrawResult.date ?? state.currentDate,
      startTime: focusDrawResult.startTime,
      endTime: focusDrawResult.endTime,
      method: methodId,
      status: "planned",
      name: FOCUS_METHOD_LABELS[methodId].zh,
      note: "",
    });
    setIsFocusCreating(false);
    setFocusCreatePhase("idle");
    setPendingFocusStartTime(null);
    setPendingFocusEndTime(null);
    setFocusDrawResult(null);
    setFocusDrawPos(null);
    setDragClearCount(c => c + 1);
  }, [focusDrawResult, addFocusBlock, state.currentDate]);

  // Stable callback references to avoid breaking memo on every render
  const handleSelectTask = useCallback(
    (id: string | null) => { selectTask(id); },
    [selectTask],
  );
  const handleProgress = useCallback(
    (id: string, progress: number) => { updateProgress(id, progress); },
    [updateProgress],
  );

  const handleUpdateTask = useCallback(
    (id: string, fields: Partial<Task>) => {
      const task = tasksForDate.find((t) => t.id === id);
      if (!task) return;
      const merged = { ...task, ...fields };
      // Enforce same-day: clamp end to be after start
      if (timeToMinutes(merged.endTime) <= timeToMinutes(merged.startTime)) {
        const em = ((timeToMinutes(merged.startTime) + 30) % 1440);
        const eh = Math.floor(em / 60), e = em % 60;
        merged.endTime = `${String(eh).padStart(2, "0")}:${String(e).padStart(2, "0")}`;
      }
      updateTask(merged);
    },
    [tasksForDate, updateTask],
  );

  // Orbit Plan assignment
  const handleSetOrbitPlan = useCallback((taskId: string) => {
    setOrbitPlanPickerTask(taskId);
  }, []);

  const handleOrbitPlanSelect = useCallback((method: FocusMethodId | null) => {
    if (orbitPlanPickerTask) {
      handleUpdateTask(orbitPlanPickerTask, { method: method ?? undefined } as Partial<Task>);
      setOrbitPlanPickerTask(null);
    }
  }, [orbitPlanPickerTask, handleUpdateTask]);

  const handleOpenOrbitPlanMethodology = useCallback((methodId: FocusMethodId) => {
    setOrbitPlanPickerTask(null);
    setMethodologyDrawerMethod(methodId);
    setIsMethodologyDrawerOpen(true);
  }, []);

  // Delete flow
  const handleDeleteStart = useCallback((id: string, type: "task" | "focus", x: number, y: number) => {
    if (type === "task") selectTask(id);
    const el = document.querySelector(`[data-task-id="${id}"], [data-focus-block="${id}"]`);
    const r = el?.getBoundingClientRect();
    setDeleteTarget({
      id, type, fromX: x, fromY: y,
      targetRect: r ? { left: r.left, top: r.top, right: r.right, bottom: r.bottom } : undefined,
    });
  }, [selectTask]);

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "task") {
      const task = tasksForDate.find(t => t.id === deleteTarget.id);
      if (task) {
        undoStackRef.current.push({ type: "task", data: { ...task }, date: state.currentDate });
        if (undoStackRef.current.length > 20) undoStackRef.current.shift();
      }
      deleteTask(deleteTarget.id);
    } else {
      const fb = focusBlocksForDate.find(f => f.id === deleteTarget.id);
      if (fb) {
        undoStackRef.current.push({ type: "focus", data: { ...fb }, date: fb.date });
        if (undoStackRef.current.length > 20) undoStackRef.current.shift();
      }
      deleteFocusBlock(deleteTarget.id);
    }
    setDeleteTarget(null);
  }, [deleteTarget, deleteTask, deleteFocusBlock, tasksForDate, focusBlocksForDate, state.currentDate]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteTarget(null);
    selectTask(null);
  }, [selectTask]);

  // Card repositioning — day view only (desktop + touch), NOT in week/month.
  // Desktop: Shift + mouse drag. Touch: long-press (400ms) to activate drag.
  // Disabled on mobile (narrow screen uses swipe-to-delete via touch events).
  const dragEnabledRef = useRef(false);
  useEffect(() => { dragEnabledRef.current = !isMobile && viewMode === "day"; }, [isMobile, viewMode]);

  useEffect(() => {
    let targetEl: HTMLElement | null = null;
    let taskId: string | null = null;
    let startX = 0, startY = 0;
    let dragging = false;
    let longPressTimer: ReturnType<typeof setTimeout> | null = null;
    let dragActivated = false;

    const onDown = (e: PointerEvent) => {
      if (!dragEnabledRef.current) return;
      // Mouse: Shift+drag only
      if (e.pointerType === "mouse") {
        if (e.button !== 0) return;
        if (!e.shiftKey) return;
      }
      const el = (e.target as HTMLElement).closest('[data-task-id]') as HTMLElement | null;
      if (!el) return;
      if ((e.target as HTMLElement).tagName === "INPUT") return;
      if ((e.target as HTMLElement).closest('[role="slider"]')) return;
      // Only allow dragging main day-view cards (not week view mini-blocks)
      if (el.closest('[data-week-scroll]')) return;
      taskId = el.dataset.taskId!;
      targetEl = el;
      startX = e.clientX;
      startY = e.clientY;
      dragging = false;
      dragActivated = false;

      if (e.pointerType === "mouse") {
        dragActivated = true;
      } else {
        longPressTimer = setTimeout(() => {
          dragActivated = true;
          navigator.vibrate?.(8);
          if (targetEl) {
            targetEl.style.transition = "transform 0.15s ease";
            targetEl.style.transform = "translate(-50%, -50%) scale(1.05)";
            targetEl.style.zIndex = "50";
            targetEl.style.filter = "drop-shadow(0 4px 16px rgba(255,255,255,0.15))";
          }
        }, 400);
      }
    };

    const onMove = (e: PointerEvent) => {
      if (!targetEl || !taskId || !dragActivated) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (!dragging && Math.abs(dx) + Math.abs(dy) < 4) return;
      if (!dragging) {
        dragging = true;
        targetEl.classList.add("dragging");
        targetEl.style.transition = "none";
        targetEl.style.filter = "drop-shadow(0 8px 24px rgba(0,0,0,0.6))";
        targetEl.setPointerCapture(e.pointerId);
      }
      targetEl.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    };

    const onUp = (e: PointerEvent) => {
      if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }
      if (!targetEl || !taskId) { dragging = false; return; }
      if (!dragging) { targetEl = null; taskId = null; return; }
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const mainRect = document.querySelector("main")!.getBoundingClientRect();
      const cardRect = targetEl.getBoundingClientRect();
      const origLeft = ((cardRect.left + cardRect.width / 2 - dx - mainRect.left) / mainRect.width) * 100;
      const origTop = ((cardRect.top + cardRect.height / 2 - dy - mainRect.top) / mainRect.height) * 100;
      const newLeft = origLeft + (dx / mainRect.width) * 100;
      const newTop = origTop + (dy / mainRect.height) * 100;
      targetEl.style.left = newLeft + "%";
      targetEl.style.top = newTop + "%";
      targetEl.style.transform = "translate(-50%, -50%)";
      targetEl.classList.remove("dragging");
      targetEl.classList.add("card-drop");
      setTimeout(() => targetEl?.classList.remove("card-drop"), 350);
      targetEl.style.zIndex = "";
      const newMap = new Map(manualOverridesRef.current);
      newMap.set(taskId, { left: newLeft, top: newTop });
      manualOverridesRef.current = newMap;
      setManualOverrides(newMap);
      targetEl = null;
      taskId = null;
    };

    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [setLayoutKey]);

  // Position ALL tasks (unfiltered) so positions are stable when filter changes.
  // Filtered-out cards are hidden via opacity, not removed from layout.
  const positions = useMemo(
    () => {
      const base = computeCardPositions(tasksForDate);
      manualOverrides.forEach((pos, taskId) => {
        const idx = tasksForDate.findIndex(t => t.id === taskId);
        if (idx >= 0) base[idx] = { ...base[idx]!, left: pos.left, top: pos.top };
      });
      return base;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tasksForDate, layoutKey, manualOverrides],
  );

  return (
    <>
    <main className="relative flex h-dvh w-full flex-col overflow-hidden">
      {!isTouchDevice && <OrbitalCursor />}
      {viewMode === "day" && !(isMobile && isTouchDevice) && <ConnectorArrows />}
      {!isTouchDevice && <NoiseOverlay />}
      <TitleHeader onOpenDocs={() => setIsDocsOverlayOpen(true)} />
      <DateNav />

      {/* Top stats bar — above the clock. On mobile push below title header */}
      <div className="relative z-20 mx-auto flex items-center justify-center"
        style={{ marginTop: isMobile ? "4rem" : (viewMode === "day" ? "max(5rem, 8vh)" : "1rem") }}
      >
        <div className="flex items-center gap-6 px-5 py-2 rounded-2xl border border-white/[0.06] bg-black/30 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <span className="font-satoshi text-[0.55rem] tracking-[0.1em] uppercase text-white/20">{t.orbit_progress}</span>
            <FloatingProgressCard />
          </div>
          <div className="w-[1px] h-4 bg-white/8" />
          <div className="flex items-center gap-2">
            <span className="font-satoshi text-[0.55rem] tracking-[0.1em] uppercase text-white/20">{t.orbit_distribution}</span>
            <FloatingStatsCard />
          </div>
        </div>
      </div>

      {/* Swipe indicator dots — mobile only */}
      {isMobile && viewMode === "day" && (
        <div className="flex items-center justify-center gap-1.5 mt-1.5 z-20">
          <div className="swipe-indicator active" />
          <div className="swipe-indicator" />
          <div className="swipe-indicator" />
        </div>
      )}

      {viewMode === "day" ? (
        <div className="relative z-10 mx-auto flex items-center justify-center"
          style={{
            width: isMobile ? "220px" : "min(62vw, 68vh)",
            height: isMobile ? "220px" : "min(62vw, 68vh)",
            marginTop: isMobile ? "0.5rem" : "max(1rem, 2vh)",
          }}
        >
          <HybridClock
            interactive={!isMobile && (isCreating || isFocusCreating)}
            clickPhase={
              isCreating ? clickPhase :
              isFocusCreating ? focusCreatePhase :
              "idle"
            }
            pendingStartTime={
              isCreating ? pendingStartTime ?? undefined :
              isFocusCreating ? pendingFocusStartTime ?? undefined :
              undefined
            }
            pendingEndTime={
              isCreating ? pendingEndTime ?? undefined :
              isFocusCreating ? pendingFocusEndTime ?? undefined :
              undefined
            }
            focusBlockArcs={focusBlockArcs}
            onTimeSelect={
              isCreating ? handleTimeSelect :
              isFocusCreating ? handleFocusTimeSelect :
              undefined
            }
            onFocusBlockClick={(methodId) => {
              setMethodologyDrawerMethod(methodId as FocusMethodId);
              setIsMethodologyDrawerOpen(true);
            }}
          />
        </div>
      ) : (
        <div className="absolute inset-x-0 z-10 px-4"
          style={{
            top: "max(5.5rem, 10vh)",
            bottom: "max(5rem, 8vh)",
          }}
        >
          {viewMode === "week" ? (
            <div className="relative w-full h-full">
              <WeekGridView
                onDayClick={navigateToDay}
                onCreateTask={handleWeekCreateInline}
                isOrbitMode={isOrbitModeOpen}
                selectedBlockId={selectedBlockId}
                onSelectBlock={setSelectedBlockId}
                onOpenMethodology={(methodId) => {
                  setMethodologyDrawerMethod(methodId);
                  setIsMethodologyDrawerOpen(true);
                }}
                onDeleteStart={handleDeleteStart}
                deleteHighlight={deleteTarget}
                creationColor={getTaskColor(previewType)}
                weekCreatePhase={weekCreatePhase}
                pendingWeekStartTime={pendingWeekStartTime}
                pendingWeekEndTime={pendingWeekEndTime}
                pendingWeekDate={pendingWeekDate}
                onWeekTimeSelect={handleWeekTimeSelect}
              />
              <FocusTimelineOverlay
                isOrbitMode={isOrbitModeOpen}
                selectedBlockId={selectedBlockId}
                onSelectBlock={setSelectedBlockId}
                onOpenMethodology={(methodId) => {
                  setMethodologyDrawerMethod(methodId);
                  setIsMethodologyDrawerOpen(true);
                }}
                onDrawFocus={handleWeekDrawComplete}
                clearDragSignal={dragClearCount}
                disableDrag={!!deleteTarget}
              />
            </div>
          ) : (
            <MonthGridView onDayClick={navigateToDay} />
          )}
        </div>
      )}

      {viewMode === "day" && (
        <div className={isMobile
          ? "relative z-10 w-full px-4 flex flex-col gap-3 mt-3 flex-1 min-h-0 overflow-y-auto ios-scroll pb-32"
          : undefined
        }>
          {tasksForDate.length === 0 ? (
            isMobile ? (
              <div className="flex flex-col items-center justify-center py-20 text-white/10">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.3">
                  <circle cx="12" cy="12" r="10"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <p className="mt-4 text-sm text-white/15" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                  {t.orbit_no_tasks}
                </p>
                <p className="mt-1 text-xs text-white/8" style={{ fontFamily: "'Satoshi', sans-serif" }}>
                  {t.orbit_no_tasks_hint}
                </p>
              </div>
            ) : null
          ) : (
            tasksForDate.map((task, index) => {
              const linkedFb = focusBlocksForDate.find(fb => fb.linkedTaskId === task.id);
              const linkedFocusColor = linkedFb
                ? FOCUS_METHOD_COLORS[linkedFb.method]
                : task.method ? FOCUS_METHOD_COLORS[task.method] : undefined;
              const isDelTarget = deleteTarget?.type === "task" && deleteTarget.id === task.id;

              return (
                <div
                  key={task.id}
                  className={isMobile ? "swipe-delete-target" : undefined}
                  {...(isMobile ? (() => {
                    let longPressTimer: ReturnType<typeof setTimeout> | null = null;
                    let longPressFired = false;
                    return {
                      onTouchStart: (e: React.TouchEvent) => {
                        if (e.touches.length !== 1) return;
                        longPressFired = false;
                        const touch = e.touches[0]!;
                        swipeStartRef.current.set(task.id, { x: touch.clientX, y: touch.clientY });
                        longPressTimer = setTimeout(() => {
                          longPressFired = true;
                          const el = e.currentTarget as HTMLElement;
                          const rect = el.getBoundingClientRect();
                          navigator.vibrate?.(10);
                          handleDeleteStart(task.id, "task", rect.left + rect.width, rect.top + rect.height / 2);
                        }, 500);
                      },
                      onTouchMove: (e: React.TouchEvent) => {
                        if (!longPressTimer) return;
                        const start = swipeStartRef.current.get(task.id);
                        if (!start) return;
                        const dx = Math.abs(e.touches[0]!.clientX - start.x);
                        const dy = Math.abs(e.touches[0]!.clientY - start.y);
                        if (dx > 10 || dy > 10) {
                          clearTimeout(longPressTimer);
                          longPressTimer = null;
                        }
                      },
                      onTouchEnd: (e: React.TouchEvent) => {
                        if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null; }
                        if (longPressFired) return;
                        if (e.changedTouches.length !== 1) return;
                        const start = swipeStartRef.current.get(task.id);
                        if (!start) return;
                        swipeStartRef.current.delete(task.id);
                        const dx = e.changedTouches[0]!.clientX - start.x;
                        const dy = e.changedTouches[0]!.clientY - start.y;
                        if (dx < -70 && Math.abs(dx) > Math.abs(dy) * 1.5) {
                          const el = e.currentTarget as HTMLElement;
                          const rect = el.getBoundingClientRect();
                          navigator.vibrate?.(10);
                          handleDeleteStart(task.id, "task", rect.left + rect.width, rect.top + rect.height / 2);
                        }
                      },
                    };
                  })() : {
                    onPointerDown: (e: React.PointerEvent) => {
                      if (e.pointerType !== "mouse" || e.button !== 0 || e.shiftKey) return;
                      const el = e.currentTarget;
                      const timer = setTimeout(() => handleDeleteStart(task.id, "task", e.clientX, e.clientY), 600);
                      const clear = () => { clearTimeout(timer); el.removeEventListener("pointerup", clear); el.removeEventListener("pointerleave", clear); };
                      el.addEventListener("pointerup", clear);
                      el.addEventListener("pointerleave", clear);
                    },
                  })}
                  style={!isMobile ? { zIndex: isDelTarget ? 96 : undefined } : undefined}
                >
                  <ScheduleCardWrapper
                    task={task}
                    index={index}
                    position={isMobile ? undefined : positions[index]!}
                    selectedTaskId={selectedTaskId}
                    activeFilter={activeFilter}
                    onSelectTask={handleSelectTask}
                    onProgress={handleProgress}
                    onUpdateTask={handleUpdateTask}
                    linkedFocusColor={linkedFocusColor}
                    isOrbitMode={isOrbitModeOpen}
                    onSetOrbitPlan={handleSetOrbitPlan}
                    isDeleteTarget={isDelTarget}
                    dimmed={!!deleteTarget && !isDelTarget}
                  />
                </div>
              );
            })
          )}
        </div>
      )}

      {!isMobile && (
      <div className="pointer-events-auto fixed bottom-[max(1.5rem,3vh)] left-1/2 z-30 -translate-x-1/2 flex flex-col items-center gap-2">
        {/* Bottom controls */}
        {viewMode === "day" && <LegendBar />}

        <div className="flex items-center gap-2 rounded-2xl border border-white/8 bg-black/50 px-3 py-2 backdrop-blur-xl">
          {/* Day view specific: new task (normal) / new focus (Orbit Mode) */}
          {viewMode === "week" && !isOrbitModeOpen && (
            <>
              <button
                onClick={weekCreatePhase !== "idle" ? handleCancelWeekTimeline : handleWeekTimelineCreate}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  weekCreatePhase !== "idle"
                    ? "bg-amber-500/15 text-amber-300/80"
                    : "bg-white/[0.06] text-white/75 hover:bg-white/[0.12] hover:text-white"
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <line x1="7" y1="1" x2="7" y2="13" />
                  <line x1="1" y1="7" x2="13" y2="7" />
                </svg>
                <span>{weekCreatePhase === "idle" ? t.orbit_new_task : weekCreatePhase === "start" ? t.orbit_pick_start : t.orbit_pick_end}</span>
              </button>
              <div className="h-5 w-[1px] bg-white/8" />
            </>
          )}
          {viewMode === "day" && !isOrbitModeOpen && (
            <>
              <button
                onClick={handleStartCreate}
                className="flex items-center gap-2 rounded-xl bg-white/[0.06] px-4 py-2 text-sm font-medium text-white/75 transition-all hover:bg-white/[0.12] hover:text-white"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <line x1="7" y1="1" x2="7" y2="13" />
                  <line x1="1" y1="7" x2="13" y2="7" />
                </svg>
                <span>{t.orbit_new_task}</span>
                <kbd className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-[0.55rem] text-white/25">N</kbd>
              </button>
              <div className="h-5 w-[1px] bg-white/8" />
            </>
          )}
          {viewMode === "day" && isOrbitModeOpen && (
            <>
              <button
                onClick={isFocusCreating ? handleCancelFocusCreate : handleStartFocusCreate}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  isFocusCreating
                    ? "bg-amber-500/15 text-amber-300/80"
                    : "bg-white/[0.08] text-white/80 hover:bg-white/[0.14] hover:text-white"
                }`}
              >
                {isFocusCreating ? (
                  <>
                    <CrosshairIcon size={15} />
                    <span>{focusCreatePhase === "idle" ? t.orbit_cancel : focusCreatePhase === "end" ? t.orbit_pick_end : t.orbit_pick_start}</span>
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <line x1="7" y1="1" x2="7" y2="13" />
                      <line x1="1" y1="7" x2="13" y2="7" />
                    </svg>
                    <span>{t.orbit_new_focus}</span>
                  </>
                )}
              </button>
              <div className="h-5 w-[1px] bg-white/8" />
            </>
          )}

          {/* Orbit Mode toggle — always visible in all views */}
          <button
            onClick={toggleOrbitMode}
            className={`relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all hover:bg-white/5 ${
              isOrbitModeOpen
                ? "text-white/85 orbit-btn-active"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            <OrbitIcon size={15} />
            <span>Orbit Mode</span>
            <kbd className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-[0.55rem] text-white/25">O</kbd>
          </button>

          {/* Day view specific: arrange */}
          {viewMode === "day" && !isOrbitModeOpen && (
            <>
              <div className="h-5 w-[1px] bg-white/8" />
              <button
                onClick={() => { setManualOverrides(new Map()); setLayoutKey((k) => k + 1); }}
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white/50 transition-all hover:bg-white/5 hover:text-white/80"
                title={t.orbit_auto_arrange}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <rect x="1" y="1" width="5" height="5" rx="1" opacity="0.5" />
                  <rect x="8" y="1" width="5" height="5" rx="1" opacity="0.3" />
                  <rect x="1" y="8" width="5" height="5" rx="1" opacity="0.3" />
                  <rect x="8" y="8" width="5" height="5" rx="1" opacity="0.5" />
                  <line x1="3.5" y1="1" x2="3.5" y2="6" strokeWidth="0.8" />
                  <line x1="10.5" y1="1" x2="10.5" y2="6" strokeWidth="0.8" />
                  <line x1="3.5" y1="8" x2="3.5" y2="13" strokeWidth="0.8" />
                  <line x1="10.5" y1="8" x2="10.5" y2="13" strokeWidth="0.8" />
                </svg>
                <span className="hidden sm:inline">{t.orbit_arrange}</span>
                <kbd className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-[0.55rem] text-white/25">⇧L</kbd>
              </button>
            </>
          )}
        </div>
      </div>
      )}

      {!isMobile && !isTouchDevice && (
      <div className="pointer-events-none fixed bottom-[0.4rem] left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 px-3 py-1 rounded-lg"
        style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.04)" }}>
        {/* Minimal hint bar */}
        {isOrbitModeOpen ? (
          <span className="text-[0.55rem] text-white/20">
            {t.orbit_hint_create_focus}<span className="text-white/8 mx-0.5">·</span><HintKbd>O</HintKbd> {t.orbit_hint_exit_focus}
          </span>
        ) : viewMode === "day" ? (
          <span className="text-[0.55rem] text-white/20">
            <HintKbd>N</HintKbd> {t.orbit_hint_new}<span className="text-white/8 mx-0.5">·</span>
            <HintKbd>⇧</HintKbd>+{t.orbit_hint_drag}<span className="text-white/8 mx-0.5">·</span>
            <HintKbd>O</HintKbd> Orbit<span className="text-white/8 mx-0.5">·</span>
            <HintKbd>⇧</HintKbd><HintKbd>L</HintKbd> {t.orbit_arrange}
          </span>
        ) : viewMode === "week" && weekCreatePhase !== "idle" ? (
          <span className="text-[0.55rem] text-amber-300/50">
            {weekCreatePhase === "start" ? t.orbit_week_pick_start : t.orbit_week_pick_end}
          </span>
        ) : viewMode === "week" ? (
          <span className="text-[0.55rem] text-white/20">
            <MouseScrollIcon size={13} className="inline-block opacity-40" /> {t.orbit_hint_scroll}<span className="text-white/8 mx-0.5">·</span>
            <HintKbd>Z</HintKbd>+{t.orbit_hint_scroll} {t.orbit_hint_zoom}<span className="text-white/8 mx-0.5">·</span>
            <HintKbd>O</HintKbd> Orbit
          </span>
        ) : (
          <span className="text-[0.55rem] text-white/20">
            {t.orbit_hint_click_date}<span className="text-white/8 mx-0.5">·</span>
            <HintKbd>O</HintKbd> Orbit
          </span>
        )}
      </div>
      )}

      {/* Transient orbit mode edge glow — plays then auto-dismisses */}
      <OrbitModeTransition open={isOrbitModeOpen} />

      {isMobile && (
        <MobileBottomBar
          activeFilter={activeFilter}
          onFilterChange={(f) => dispatch({ type: "SET_FILTER", payload: f })}
          isOrbitMode={isOrbitModeOpen}
          onToggleOrbit={toggleOrbitMode}
          viewMode={viewMode}
          onCycleView={() => {
            const modes = ["day", "week", "month"] as const;
            const i = modes.indexOf(viewMode);
            setViewMode(modes[(i + 1) % 3]!);
          }}
          onNewTask={handleStartCreate}
          onAutoArrange={() => { setManualOverrides(new Map()); setLayoutKey((k) => k + 1); }}
          onOpenDocs={() => setIsDocsOverlayOpen(true)}
        />
      )}

    </main>

    {/* Methodology Drawer — slide-in from right */}
    <MethodologyDrawer
      isOpen={isMethodologyDrawerOpen}
      onClose={() => {
        setIsMethodologyDrawerOpen(false);
        setMethodologyDrawerMethod(null);
      }}
      methodId={methodologyDrawerMethod}
      onSelectMethod={(id) => setMethodologyDrawerMethod(id)}
    />

    {/* Docs Overlay — fullscreen knowledge wiki */}
    {isDocsOverlayOpen && (
      <DocsOverlay onClose={() => setIsDocsOverlayOpen(false)} />
    )}

    {/* Method picker after focus draw */}
    {focusDrawResult && (
      <MethodPickerPopup
        x={focusDrawPos?.x ?? window.innerWidth / 2 - 100}
        y={focusDrawPos?.y ?? window.innerHeight / 2 - 40}
        onSelect={handleMethodPick}
        onClose={handleCancelFocusCreate}
      />
    )}

    {/* Orbit Plan method picker */}
    {orbitPlanPickerTask && (
      <OrbitPlanPicker
        x={window.innerWidth / 2}
        y={window.innerHeight / 2}
        currentMethod={tasksForDate.find(t => t.id === orbitPlanPickerTask)?.method}
        onSelect={handleOrbitPlanSelect}
        onOpenMethodology={handleOpenOrbitPlanMethodology}
        onClose={() => setOrbitPlanPickerTask(null)}
      />
    )}

    {/* Delete mode: floating trash bubble (no fullscreen overlay — items dim individually) */}
    {deleteTarget && (
      <DeleteBubble
        fromX={deleteTarget.fromX}
        fromY={deleteTarget.fromY}
        targetRect={deleteTarget.targetRect}
        onDelete={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    )}

    <InlineTaskCreator
      isOpen={isCreating}
      onClose={handleCancelCreate}
      onCreate={handleCreateTask}
      clickPhase={isCreating ? clickPhase : "idle"}
      pendingStartTime={pendingStartTime}
      pendingEndTime={pendingEndTime}
      onNudgeTime={handleNudgeTime}
      onTypeChange={setPreviewType}
    />

    {/* Week view inline creation */}
    <InlineTaskCreator
      isOpen={weekCreateDay !== null}
      onClose={handleCancelWeekTimeline}
      onCreate={handleCreateTaskForWeek}
      clickPhase="idle"
      pendingStartTime={pendingWeekStartTime}
      pendingEndTime={pendingWeekEndTime}
      onNudgeTime={() => {}}
      onTypeChange={setPreviewType}
    />
    <EditPanel />
    </>
  );
}

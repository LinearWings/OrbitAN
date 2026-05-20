"use client";

import React, {
  useEffect,
  useCallback,
  useState,
  useMemo,
} from "react";
import { useTasks } from "@/hooks/useTasks";
import { useEditPanel } from "@/hooks/useEditPanel";
import { useAppContext } from "@/context/AppContext";
import {
  getTaskColor,
  getTaskLabel,
} from "@/utils/colors";
import { timeToMinutes } from "@/utils/time";
import type { Task, CustomTypeDef } from "@/types";
import { loadCustomTypes } from "@/utils/storage";
import { StepNaming } from "./StepNaming";
import { StepPositioning } from "./StepPositioning";
import { StepIndicator } from "./StepIndicator";

type WizardStep = 1 | 2;

// ─────────────────────────────────────────────
// Main Orbital Launch Wizard
// ─────────────────────────────────────────────

export default function OrbitalLaunchWizard() {
  const { isEditPanelOpen, editingTaskId, closeEdit, showDeleteConfirm } =
    useEditPanel();
  const { state } = useAppContext();
  const { addTask, updateTask } = useTasks();

  // Resolve editing task
  const currentDate = state?.currentDate;
  const editingTask = useMemo(
    () => {
      if (!editingTaskId) return null;
      const tasks = state?.tasks?.[currentDate];
      return (tasks as Task[])?.find((t) => t.id === editingTaskId) ?? null;
    },
    [editingTaskId, state?.tasks, currentDate],
  );

  // Form state
  const [name, setName] = useState<string>(editingTask?.name ?? "");
  const [type, setType] = useState<string>(editingTask?.type ?? "work");
  const [customTypes, setCustomTypes] = useState<CustomTypeDef[]>(loadCustomTypes);
  const [startTime, setStartTime] = useState<string>(
    editingTask?.startTime ?? "09:00",
  );
  const [endTime, setEndTime] = useState<string>(
    editingTask?.endTime ?? "10:00",
  );
  const [note, setNote] = useState<string>(editingTask?.note ?? "");

  // Wizard state
  const [step, setStep] = useState<WizardStep>(1);
  const [clickPhase, setClickPhase] = useState<"start" | "end" | null>(null);
  const [transitionPhase, setTransitionPhase] =
    useState<"idle" | "exiting" | "entering">("idle");
  const [isLaunched, setIsLaunched] = useState(false);

  // Reset form when editing task changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(editingTask?.name ?? "");
    setType(editingTask?.type ?? "work");
    setStartTime(editingTask?.startTime ?? "09:00");
    setEndTime(editingTask?.endTime ?? "10:00");
    setNote(editingTask?.note ?? "");
    setStep(1);
    setTransitionPhase("idle");
    setIsLaunched(false);
    setClickPhase(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingTaskId]);

  const duration = (timeToMinutes(endTime) - timeToMinutes(startTime) + 1440) % 1440;
  const typeColor = getTaskColor(type);
  const typeLabel = getTaskLabel(type);
  const isEditing = Boolean(editingTaskId);

  // Reset step when panel opens (handles create → close → create flow)
  useEffect(() => {
    if (isEditPanelOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStep(1);
      setTransitionPhase("idle");
      setIsLaunched(false);
      setClickPhase(null);
    }
  }, [isEditPanelOpen]);

  // Keyboard: ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (transitionPhase === "idle") closeEdit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeEdit, transitionPhase]);

  // ── Step navigation with liquid glass transition ──
  const goToStep = useCallback(
    (next: WizardStep) => {
      if (transitionPhase !== "idle") return;
      setTransitionPhase("exiting");

      setTimeout(() => {
        setStep(next);
        setTransitionPhase("entering");
      }, 400);

      setTimeout(() => {
        setTransitionPhase("idle");
      }, 800);
    },
    [transitionPhase],
  );

  const nextStep = useCallback(() => {
    goToStep(Math.min(step + 1, 2) as WizardStep);
  }, [step, goToStep]);

  const prevStep = useCallback(() => {
    goToStep(Math.max(step - 1, 1) as WizardStep);
  }, [step, goToStep]);

  // ── Save & Launch ──
  const handleLaunch = useCallback(() => {
    setIsLaunched(true);

    // Brief delay for launch animation
    setTimeout(() => {
      if (isEditing && editingTask) {
        const updated: Task = {
          ...editingTask,
          name,
          type,
          startTime,
          endTime,
          note,
        };
        updateTask(updated);
      } else {
        // Enforce same-day
        let finalEnd = endTime;
        if (timeToMinutes(endTime) <= timeToMinutes(startTime)) {
          const em = ((timeToMinutes(startTime) + 30) % 1440);
          finalEnd = `${String(Math.floor(em / 60)).padStart(2, "0")}:${String(em % 60).padStart(2, "0")}`;
        }
        const newTask: Omit<Task, "id" | "createdAt"> = {
          type,
          name,
          startTime,
          endTime: finalEnd,
          progress: 0,
          completed: false,
          note,
        };
        addTask(newTask);
      }
      closeEdit();
    }, 600);
  }, [
    isEditing,
    editingTask,
    name,
    type,
    startTime,
    endTime,
    note,
    updateTask,
    addTask,
    closeEdit,
  ]);

  const onDeleteClick = useCallback(() => {
    showDeleteConfirm(true, editingTaskId);
  }, [showDeleteConfirm, editingTaskId]);

  // ── Transition CSS classes ──
  const getTransitionClass = useCallback(
    (stepNumber: WizardStep) => {
      const base = "transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)]";

      if (transitionPhase === "idle") {
        return step === stepNumber ? `${base} opacity-100 scale-100 blur-0` : `${base} opacity-0 pointer-events-none`;
      }

      if (transitionPhase === "exiting") {
        if (step === stepNumber) {
          return `${base} opacity-0 scale-[0.96] blur-[3px] pointer-events-none`;
        }
        return `${base} pointer-events-none`;
      }

      // entering
      if (step === stepNumber) {
        return `${base} opacity-100 scale-100 blur-0`;
      }
      return `${base} opacity-0 scale-[1.04] blur-[3px] pointer-events-none`;
    },
    [step, transitionPhase],
  );

  // If panel is not open, render nothing
  if (!isEditPanelOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50"
        onClick={() => {
          if (transitionPhase === "idle") closeEdit();
        }}
      >
        {/* Dark backdrop with type-colored radial glow */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 50% 40%, ${typeColor}08 0%, transparent 60%),
              rgba(5, 5, 8, 0.85)
            `,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            transition: "background 0.5s ease",
          }}
        />

        {/* Orbit-mode style noise overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "256px 256px",
          }}
        />
      </div>

      {/* Main wizard container */}
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Wizard content area */}
        <div className="relative w-full max-w-2xl flex-1 flex flex-col items-center justify-center">
          {/* Step content */}
          <div className="relative w-full flex-1 flex items-center justify-center">
            {/* Step 1: Naming */}
            <StepNaming
              name={name}
              setName={setName}
              type={type}
              setType={setType}
              typeColor={typeColor}
              onNext={nextStep}
              transitionClass={getTransitionClass(1)}
              customTypes={customTypes}
            />

            {/* Step 2: Orbit Launch */}
            <StepPositioning
              startTime={startTime}
              endTime={endTime}
              setStartTime={setStartTime}
              setEndTime={setEndTime}
              name={name}
              note={note}
              setNote={setNote}
              typeColor={typeColor}
              typeLabel={typeLabel}
              duration={duration}
              isEditing={isEditing}
              clickPhase={clickPhase}
              setClickPhase={setClickPhase}
              onPrev={prevStep}
              onLaunch={handleLaunch}
              transitionClass={getTransitionClass(2)}
            />
          </div>

          {/* Bottom: Delete button (edit mode) + Step indicator */}
          <div className="relative w-full flex items-center justify-center pb-8 pt-4">
            <div className="flex items-center gap-4">
              {isEditing && editingTaskId && (
                <button
                  onClick={onDeleteClick}
                  className="px-3 py-1.5 rounded-lg text-[0.6rem] font-mono transition-all duration-200"
                  style={{
                    background: "rgba(239, 68, 68, 0.08)",
                    color: "rgba(239, 68, 68, 0.5)",
                    border: "1px solid rgba(239, 68, 68, 0.15)",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  删除任务
                </button>
              )}

              <StepIndicator current={step} typeColor={typeColor} />
            </div>
          </div>
        </div>

        {/* Launch animation overlay */}
        {isLaunched && (
          <div className="fixed inset-0 z-[60] pointer-events-none">
            {/* Flash */}
            <div
              className="absolute inset-0 animate-launch-flash"
              style={{
                background: `radial-gradient(ellipse at 50% 50%, ${typeColor} 0%, transparent 60%)`,
                animation: "launch-flash 0.6s ease-out forwards",
              }}
            />
            {/* Particles — deterministic via index seeding */}
            {Array.from({ length: 20 }).map((_, i) => {
              const w = 2 + (i * 7) % 5;
              const h = w;
              const color = i % 3 === 0 ? typeColor : "#ffffff";
              const left = 30 + (i * 13) % 37;
              const top = 40 + (i * 11) % 18;
              const dur = 0.5 + ((i * 3) % 5) * 0.1;
              const delay = ((i * 7) % 5) * 0.04;
              const dx = (i * 37) % 120 - 60;
              const dy = ((i * 23) % 140 + 20) * -1;
              return (
                <div
                  key={i}
                  className="absolute rounded-full animate-launch-particle"
                  style={{
                    width: w,
                    height: h,
                    backgroundColor: color,
                    left: `${left}%`,
                    top: `${top}%`,
                    "--dx": `${dx}px`,
                    "--dy": `${dy}px`,
                    animation: `launch-particle-${i % 3} ${dur}s ease-out forwards`,
                    animationDelay: `${delay}s`,
                  } as React.CSSProperties}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Keyframe injection for launch animations */}
      <style>{`
        @keyframes float-drift {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.15; }
          25% { transform: translate(6px, -10px) scale(1.15); opacity: 0.3; }
          50% { transform: translate(-4px, -18px) scale(0.85); opacity: 0.2; }
          75% { transform: translate(10px, -6px) scale(1.1); opacity: 0.25; }
        }
        @keyframes launch-flash {
          0% { opacity: 0.8; transform: scale(0.8); }
          50% { opacity: 0.4; transform: scale(1.5); }
          100% { opacity: 0; transform: scale(2.5); }
        }
        @keyframes launch-particle-0 {
          0% { opacity: 1; transform: translate(0, 0) scale(1); }
          100% { opacity: 0; transform: translate(var(--dx, 60px), var(--dy, -120px)) scale(0); }
        }
        @keyframes launch-particle-1 {
          0% { opacity: 1; transform: translate(0, 0) scale(1); }
          100% { opacity: 0; transform: translate(var(--dx, -40px), var(--dy, -100px)) scale(0); }
        }
        @keyframes launch-particle-2 {
          0% { opacity: 1; transform: translate(0, 0) scale(1); }
          100% { opacity: 0; transform: translate(var(--dx, 20px), var(--dy, -140px)) scale(0); }
        }
        @keyframes shimmer-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-shimmer {
          animation: shimmer-slide 2.5s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}

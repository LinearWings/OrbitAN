"use client";

import { useMemo } from "react";
import type { Task } from "@/types";
import { getTaskColor } from "@/utils/colors";
import { getTaskDuration } from "@/utils/time";

interface TaskDetailProps {
  task: Task;
  isOpen: boolean;
}

export default function TaskDetail({ task, isOpen }: TaskDetailProps) {
  const color = useMemo(() => getTaskColor(task.type), [task.type]);
  // Simple height-based accordion: 0 -> 200px height
  const maxHeight = isOpen ? 200 : 0;

  return (
    <div
      className="mt-2 overflow-hidden border-l-4 pl-3"
      style={{ borderLeftColor: color, maxHeight, transition: "max-height 0.3s ease" }}
    >
      <div className="flex flex-col gap-1 font-satoshi text-sm text-white/70" style={{ paddingLeft: 0 }}>
        {task.note && (
          <div className="flex items-start gap-2">
            <span className="font-semibold text-white/90">Note:</span>
            <span className="whitespace-pre-wrap">{task.note}</span>
          </div>
        )}
        <div className="flex items-center gap-3 pt-1 text-white/50">
          <span className="whitespace-nowrap">Time: </span>
          <span className="font-mono text-xs text-white/30">{task.startTime} – {task.endTime}</span>
          <span className="whitespace-nowrap">Duration: </span>
          <span className="font-mono text-xs text-white/30">{getTaskDuration(task)} min</span>
        </div>
        <div className="flex items-center gap-3 text-white/50 pt-1">
          <span className="whitespace-nowrap">Created: </span>
          <span className="text-xs">{new Date(task.createdAt).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

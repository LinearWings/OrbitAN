"use client";

import React from "react";
import { useEditPanel } from "@/hooks/useEditPanel";
import { useTasks } from "@/hooks/useTasks";
import type { Task } from "@/types";

// Small centered confirmation dialog for deleting a task
export default function DeleteConfirm() {
  const { editingTaskId, isDeleteConfirmOpen, closeEdit } = useEditPanel();
  const { tasksForDate, deleteTask } = useTasks();

  // Resolve current editing task for display
  const editingTask: Task | null = editingTaskId
    ? tasksForDate.find((t) => t.id === editingTaskId) ?? null
    : null;

  // In this simplified setup, we'll render a modal overlay when isDeleteConfirmOpen is true
  if (!isDeleteConfirmOpen) {
    return null;
  }

  // Access delete function via Tasks hook (imported above)

  const onDelete = () => {
    if (editingTaskId) {
      deleteTask(editingTaskId);
    }
    closeEdit();
  };

  // Escape + click backdrop handled by parent panel; this component renders its own centered modal
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => closeEdit()}>
      <div className="bg-[#0D0D0D] text-white rounded-2xl border border-white/10 max-w-xs p-5" onClick={(e) => e.stopPropagation()}>
        <div className="text-sm mb-2">确定要删除任务吗？</div>
        <div className="text-xs text-gray-400 mb-4">{editingTask?.name ?? "当前任务"}</div>
        <div className="flex justify-end gap-2">
          <button className="px-3 py-2 rounded border border-white/20 text-white/80" onClick={() => closeEdit()}>
            取消
          </button>
          <button className="px-3 py-2 rounded bg-red-600 text-white" onClick={onDelete}>
            删除
          </button>
        </div>
      </div>
    </div>
  );
}

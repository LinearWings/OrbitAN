"use client";

import { useMemo, useCallback } from "react";
import { useAppContext } from "@/context/AppContext";
import type { Task } from "@/types";

let taskIdCounter = Date.now();

function generateId(): string {
  taskIdCounter++;
  return `task-${Date.now()}-${taskIdCounter}`;
}

const EMPTY_TASKS: Task[] = [];

export function useTasks() {
  const { state, dispatch } = useAppContext();

  const tasksForDate = state.tasks[state.currentDate] ?? EMPTY_TASKS;

  const filteredTasks = useMemo(() => {
    if (state.activeFilter === "all") return tasksForDate;
    return tasksForDate.filter((t) => t.type === state.activeFilter);
  }, [tasksForDate, state.activeFilter]);

  const addTask = useCallback(
    (task: Omit<Task, "id" | "createdAt">) => {
      const newTask: Task = {
        ...task,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: "ADD", payload: { date: state.currentDate, task: newTask } });
    },
    [dispatch, state.currentDate],
  );

  const updateTask = useCallback(
    (task: Task) => {
      dispatch({ type: "UPDATE", payload: { date: state.currentDate, task } });
    },
    [dispatch, state.currentDate],
  );

  const deleteTask = useCallback(
    (id: string) => {
      dispatch({ type: "DELETE", payload: { date: state.currentDate, id } });
    },
    [dispatch, state.currentDate],
  );

  const updateProgress = useCallback(
    (id: string, progress: number) => {
      dispatch({ type: "UPDATE_PROGRESS", payload: { date: state.currentDate, id, progress } });
    },
    [dispatch, state.currentDate],
  );

  return { tasksForDate, filteredTasks, addTask, updateTask, deleteTask, updateProgress };
}

"use client";

import { useCallback } from "react";
import { useAppContext } from "@/context/AppContext";
import type { DailyReminder } from "@/types";

export function useDailyReminders() {
  const { state, dispatch } = useAppContext();
  const reminders = state.dailyReminders;
  const currentDate = state.currentDate;
  const todayReminders = reminders[currentDate] ?? [];

  const addReminder = useCallback(
    (name: string, tag?: string, estimatedDuration?: number) => {
      const reminder: DailyReminder = {
        id: crypto.randomUUID(),
        name,
        done: false,
        tag,
        estimatedDuration,
        date: currentDate,
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: "ADD_REMINDER", payload: { date: currentDate, reminder } });
    },
    [currentDate, dispatch],
  );

  const toggleReminder = useCallback(
    (id: string) => {
      dispatch({ type: "TOGGLE_REMINDER", payload: { date: currentDate, id } });
    },
    [currentDate, dispatch],
  );

  const deleteReminder = useCallback(
    (id: string) => {
      dispatch({ type: "DELETE_REMINDER", payload: { date: currentDate, id } });
    },
    [currentDate, dispatch],
  );

  const updateReminder = useCallback(
    (id: string, updates: Partial<Pick<DailyReminder, "name" | "tag" | "estimatedDuration">>) => {
      dispatch({ type: "UPDATE_REMINDER", payload: { date: currentDate, id, updates } });
    },
    [currentDate, dispatch],
  );

  return {
    reminders,
    todayReminders,
    addReminder,
    toggleReminder,
    deleteReminder,
    updateReminder,
  };
}

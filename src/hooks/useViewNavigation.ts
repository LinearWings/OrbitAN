"use client";

import { useCallback } from "react";
import { useAppContext } from "@/context/AppContext";
import { getPreviousDay, getNextDay, getToday, getWeekDates } from "@/utils/time";

export function useViewNavigation() {
  const { state, dispatch } = useAppContext();

  const setViewMode = useCallback(
    (mode: "day" | "week" | "month") => {
      dispatch({ type: "SET_VIEW_MODE", payload: mode });
    },
    [dispatch],
  );

  const goToPrevious = useCallback(() => {
    const { currentDate, viewMode } = state;
    if (viewMode === "day") {
      dispatch({ type: "SET_DATE", payload: getPreviousDay(currentDate) });
    } else if (viewMode === "week") {
      const week = getWeekDates(currentDate);
      const prevMonday = getPreviousDay(week[0] ?? currentDate);
      const startOfPrevWeek = getPreviousDay(prevMonday);
      dispatch({ type: "SET_DATE", payload: startOfPrevWeek });
    } else if (viewMode === "month") {
      const d = new Date(currentDate + "T00:00:00");
      d.setDate(1); // Prevent month overflow (e.g. Jan 31 → setMonth(+0) → Mar 3)
      d.setMonth(d.getMonth() - 1);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      dispatch({ type: "SET_DATE", payload: `${y}-${m}-01` });
    }
  }, [state.currentDate, state.viewMode, dispatch]);

  const goToNext = useCallback(() => {
    const { currentDate, viewMode } = state;
    if (viewMode === "day") {
      dispatch({ type: "SET_DATE", payload: getNextDay(currentDate) });
    } else if (viewMode === "week") {
      const week = getWeekDates(currentDate);
      const lastSunday = week[6] ?? currentDate;
      const startOfNextWeek = getNextDay(lastSunday);
      dispatch({ type: "SET_DATE", payload: startOfNextWeek });
    } else if (viewMode === "month") {
      const d = new Date(currentDate + "T00:00:00");
      d.setDate(1); // Prevent month overflow (e.g. Jan 31 → setMonth(+1) → Mar 3)
      d.setMonth(d.getMonth() + 1);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      dispatch({ type: "SET_DATE", payload: `${y}-${m}-01` });
    }
  }, [state.currentDate, state.viewMode, dispatch]);

  const goToToday = useCallback(() => {
    dispatch({ type: "SET_DATE", payload: getToday() });
    if (state.viewMode !== "day") {
      dispatch({ type: "SET_VIEW_MODE", payload: "day" });
    }
  }, [dispatch, state.viewMode]);

  const navigateToDay = useCallback(
    (date: string) => {
      dispatch({ type: "SET_DATE", payload: date });
      dispatch({ type: "SET_VIEW_MODE", payload: "day" });
    },
    [dispatch],
  );

  return {
    currentDate: state.currentDate,
    viewMode: state.viewMode,
    setViewMode,
    goToPrevious,
    goToNext,
    goToToday,
    navigateToDay,
  };
}

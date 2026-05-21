"use client";

import { useCallback, useRef, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { getPreviousDay, getNextDay, getToday, getWeekDates } from "@/utils/time";

export function useViewNavigation() {
  const { state, dispatch } = useAppContext();

  // Refs to avoid stale closures in rapid navigation
  const currentDateRef = useRef(state.currentDate);
  const viewModeRef = useRef(state.viewMode);

  // Sync refs after render to avoid react-hooks/refs error
  useEffect(() => {
    currentDateRef.current = state.currentDate;
    viewModeRef.current = state.viewMode;
  });

  const setViewMode = useCallback(
    (mode: "day" | "week" | "month") => {
      dispatch({ type: "SET_VIEW_MODE", payload: mode });
    },
    [dispatch],
  );

  const goToPrevious = useCallback(() => {
    const currentDate = currentDateRef.current;
    const viewMode = viewModeRef.current;
    if (viewMode === "day") {
      dispatch({ type: "SET_DATE", payload: getPreviousDay(currentDate) });
    } else if (viewMode === "week") {
      const week = getWeekDates(currentDate);
      const prevMonday = getPreviousDay(week[0] ?? currentDate);
      const startOfPrevWeek = getPreviousDay(prevMonday);
      dispatch({ type: "SET_DATE", payload: startOfPrevWeek });
    } else if (viewMode === "month") {
      const d = new Date(currentDate + "T00:00:00");
      d.setDate(1);
      d.setMonth(d.getMonth() - 1);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      dispatch({ type: "SET_DATE", payload: `${y}-${m}-01` });
    }
  }, [dispatch]);

  const goToNext = useCallback(() => {
    const currentDate = currentDateRef.current;
    const viewMode = viewModeRef.current;
    if (viewMode === "day") {
      dispatch({ type: "SET_DATE", payload: getNextDay(currentDate) });
    } else if (viewMode === "week") {
      const week = getWeekDates(currentDate);
      const lastSunday = week[6] ?? currentDate;
      const startOfNextWeek = getNextDay(lastSunday);
      dispatch({ type: "SET_DATE", payload: startOfNextWeek });
    } else if (viewMode === "month") {
      const d = new Date(currentDate + "T00:00:00");
      d.setDate(1);
      d.setMonth(d.getMonth() + 1);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      dispatch({ type: "SET_DATE", payload: `${y}-${m}-01` });
    }
  }, [dispatch]);

  const goToToday = useCallback(() => {
    dispatch({ type: "SET_DATE", payload: getToday() });
    if (viewModeRef.current !== "day") {
      dispatch({ type: "SET_VIEW_MODE", payload: "day" });
    }
  }, [dispatch]);

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

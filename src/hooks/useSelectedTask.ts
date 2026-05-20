"use client";

import { useCallback } from "react";
import { useAppContext } from "@/context/AppContext";

export function useSelectedTask() {
  const { state, dispatch } = useAppContext();

  const selectTask = useCallback((id: string | null) => {
    dispatch({ type: "SELECT_TASK", payload: id });
  }, [dispatch]);

  return { selectedTaskId: state.selectedTaskId, selectTask };
}

"use client";

import { useAppContext } from "@/context/AppContext";

export function useSelectedTask() {
  const { state, dispatch } = useAppContext();

  const selectTask = (id: string | null) => {
    dispatch({ type: "SELECT_TASK", payload: id });
  };

  return { selectedTaskId: state.selectedTaskId, selectTask };
}

"use client";

import { useCallback } from "react";
import { useAppContext } from "@/context/AppContext";
import type { FilterType } from "@/types";

export function useFilter() {
  const { state, dispatch } = useAppContext();

  const setFilter = useCallback(
    (filter: FilterType) => dispatch({ type: "SET_FILTER", payload: filter }),
    [dispatch],
  );

  const clearFilter = useCallback(
    () => dispatch({ type: "SET_FILTER", payload: "all" }),
    [dispatch],
  );

  return { activeFilter: state.activeFilter, setFilter, clearFilter };
}

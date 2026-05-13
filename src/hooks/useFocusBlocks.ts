"use client";

import { useMemo, useCallback } from "react";
import { useAppContext } from "@/context/AppContext";
import type { FocusBlock, FocusBlockStatus } from "@/types/focus";

export function useFocusBlocks(date?: string) {
  const { state, dispatch } = useAppContext();
  const targetDate = date ?? state.currentDate;

  const focusBlocksForDate: FocusBlock[] = useMemo(
    () => state.focusBlocks[targetDate] ?? [],
    [state.focusBlocks, targetDate],
  );

  const addFocusBlock = useCallback(
    (block: Omit<FocusBlock, "id" | "createdAt">) => {
      const newBlock: FocusBlock = {
        ...block,
        id: `fb-${typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36)}`,
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: "ADD_FOCUS_BLOCK", payload: { date: block.date ?? targetDate, block: newBlock } });
    },
    [dispatch, targetDate],
  );

  const updateFocusBlock = useCallback(
    (block: FocusBlock) => {
      dispatch({ type: "UPDATE_FOCUS_BLOCK", payload: { date: targetDate, block } });
    },
    [dispatch, targetDate],
  );

  const deleteFocusBlock = useCallback(
    (id: string) => {
      dispatch({ type: "DELETE_FOCUS_BLOCK", payload: { date: targetDate, id } });
    },
    [dispatch, targetDate],
  );

  const setFocusBlockStatus = useCallback(
    (id: string, status: FocusBlockStatus) => {
      dispatch({ type: "SET_FOCUS_BLOCK_STATUS", payload: { date: targetDate, id, status } });
    },
    [dispatch, targetDate],
  );

  const getBlocksForDate = useCallback(
    (d: string): FocusBlock[] => state.focusBlocks[d] ?? [],
    [state.focusBlocks],
  );

  return {
    focusBlocksForDate,
    addFocusBlock,
    updateFocusBlock,
    deleteFocusBlock,
    setFocusBlockStatus,
    getBlocksForDate,
  };
}

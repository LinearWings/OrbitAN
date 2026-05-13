"use client";

import { useCallback } from "react";
import { useAppContext } from "@/context/AppContext";

export function useEditPanel() {
  const { state, dispatch } = useAppContext();

  const openEdit = useCallback(
    (taskId: string | null) => dispatch({ type: "OPEN_EDIT", payload: taskId }),
    [dispatch],
  );

  const closeEdit = useCallback(
    () => dispatch({ type: "CLOSE_EDIT" }),
    [dispatch],
  );

  const showDeleteConfirm = useCallback(
    (show: boolean, taskId?: string | null) => dispatch({ type: "SHOW_DELETE_CONFIRM", payload: { show, taskId: taskId ?? null } }),
    [dispatch],
  );

  return {
    editingTaskId: state.editingTaskId,
    isEditPanelOpen: state.isEditPanelOpen,
    isDeleteConfirmOpen: state.isDeleteConfirmOpen,
    openEdit,
    closeEdit,
    showDeleteConfirm,
  };
}

"use client";

import { useEffect, useRef } from "react";
import { useAppContext } from "@/context/AppContext";
import { useViewNavigation } from "@/hooks/useViewNavigation";
import { useFilter } from "@/hooks/useFilter";
import { useTasks } from "@/hooks/useTasks";
import { useEditPanel } from "@/hooks/useEditPanel";
import { useSelectedTask } from "@/hooks/useSelectedTask";

export function useKeyboard(onCreate?: () => void) {
  const { goToPrevious, goToNext, goToToday } = useViewNavigation();
  const { setFilter, clearFilter } = useFilter();
  const { deleteTask: _deleteTask } = useTasks();
  const { openEdit, closeEdit, showDeleteConfirm, isEditPanelOpen } = useEditPanel();
  const { selectTask, selectedTaskId } = useSelectedTask();
  const { state, dispatch } = useAppContext();

  // Stable refs for callback functions to avoid re-running the effect
  const cbRef = useRef({
    goToPrevious, goToNext, goToToday,
    setFilter, clearFilter,
    openEdit, closeEdit, showDeleteConfirm,
    selectTask,
    onCreate,
  });
  const orbitModeRef = useRef(state.isOrbitModeOpen);
  const editPanelRef = useRef(isEditPanelOpen);
  const selectedTaskRef = useRef(selectedTaskId);

  // Sync refs in useEffect to avoid react-hooks/refs error
  useEffect(() => {
    cbRef.current = {
      goToPrevious, goToNext, goToToday,
      setFilter, clearFilter,
      openEdit, closeEdit, showDeleteConfirm,
      selectTask,
      onCreate,
    };
    orbitModeRef.current = state.isOrbitModeOpen;
    editPanelRef.current = isEditPanelOpen;
    selectedTaskRef.current = selectedTaskId;
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;

      const cb = cbRef.current;

      switch (e.key) {
        case "Escape":
          if (editPanelRef.current) {
            cb.closeEdit();
          } else {
            cb.selectTask(null);
          }
          break;
        case "ArrowLeft":
          cb.goToPrevious();
          break;
        case "ArrowRight":
          cb.goToNext();
          break;
        case "T":
        case "t":
          cb.goToToday();
          break;
        case "1":
          cb.setFilter("work");
          break;
        case "2":
          cb.setFilter("study");
          break;
        case "3":
          cb.setFilter("meeting");
          break;
        case "4":
          cb.setFilter("personal");
          break;
        case "0":
          cb.clearFilter();
          break;
        case "N":
        case "n":
          if (cb.onCreate) cb.onCreate();
          else cb.openEdit(null);
          break;
        case "Delete":
          if (selectedTaskRef.current && !editPanelRef.current) {
            cb.showDeleteConfirm(true, selectedTaskRef.current);
          }
          break;
        case "O":
        case "o":
          dispatch({ type: "TOGGLE_ORBIT_MODE" });
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispatch]);
}

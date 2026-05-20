"use client";

import { useCallback } from "react";
import { useAppContext } from "@/context/AppContext";

export function useOrbital() {
  const { state, dispatch } = useAppContext();

  const isOpen = state.isOrbitModeOpen;

  const toggle = useCallback(() => {
    dispatch({ type: "TOGGLE_ORBIT_MODE" });
  }, [dispatch]);

  const setOpen = useCallback((open: boolean) => {
    dispatch({ type: "UPDATE_ORBIT_MODE", payload: open });
  }, [dispatch]);

  return { isOrbitModeOpen: isOpen, toggleOrbitMode: toggle, setOrbitMode: setOpen };
}

"use client";

import { useAppContext } from "@/context/AppContext";

export function useOrbital() {
  const { state, dispatch } = useAppContext();

  const isOpen = state.isOrbitModeOpen;

  const toggle = () => {
    dispatch({ type: "UPDATE_ORBIT_MODE", payload: !state.isOrbitModeOpen });
  };

  const setOpen = (open: boolean) => {
    dispatch({ type: "UPDATE_ORBIT_MODE", payload: open });
  };

  return { isOrbitModeOpen: isOpen, toggleOrbitMode: toggle, setOrbitMode: setOpen };
}

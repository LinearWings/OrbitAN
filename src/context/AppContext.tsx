"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type { AppState, AppAction } from "@/types";
import { loadTasks, saveTasks, loadCustomTypes, loadReminders, saveReminders } from "@/utils/storage";
import { loadFocusBlocks, saveFocusBlocks } from "@/utils/storage";
import { setCustomTypeCache } from "@/utils/colors";
import { getToday } from "@/utils/time";
import { getDefaultTasks } from "@/data/defaults";

const initialState: AppState = {
  tasks: {},
  currentDate: getToday(),
  viewMode: "day",
  selectedTaskId: null,
  editingTaskId: null,
  activeFilter: "all",
  isEditPanelOpen: false,
  isDeleteConfirmOpen: false,
  isOrbitModeOpen: false,
  focusBlocks: {},
  dailyReminders: {},
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "LOAD": {
      const loaded = action.payload;
      return { ...state, tasks: loaded };
    }
    case "ADD": {
      const tasks = { ...state.tasks };
      const dateTasks = [...(tasks[action.payload.date] ?? [])];
      dateTasks.push(action.payload.task);
      dateTasks.sort((a, b) => a.startTime.localeCompare(b.startTime));
      tasks[action.payload.date] = dateTasks;
      return { ...state, tasks };
    }
    case "UPDATE": {
      const tasks = { ...state.tasks };
      const dateTasks = [...(tasks[action.payload.date] ?? [])];
      const idx = dateTasks.findIndex((t) => t.id === action.payload.task.id);
      if (idx !== -1) {
        dateTasks[idx] = action.payload.task;
      } else {
        console.warn("[OrbitAN] UPDATE: task not found", action.payload.task.id, "on", action.payload.date);
        return state;
      }
      dateTasks.sort((a, b) => a.startTime.localeCompare(b.startTime));
      tasks[action.payload.date] = dateTasks;
      return {
        ...state,
        tasks,
      };
    }
    case "DELETE": {
      const tasks = { ...state.tasks };
      const dateTasks = tasks[action.payload.date]?.filter((t) => t.id !== action.payload.id) ?? [];
      if (dateTasks.length === 0) {
        delete tasks[action.payload.date];
      } else {
        tasks[action.payload.date] = dateTasks;
      }
      return {
        ...state,
        tasks,
        selectedTaskId: state.selectedTaskId === action.payload.id ? null : state.selectedTaskId,
        editingTaskId: state.editingTaskId === action.payload.id ? null : state.editingTaskId,
        isEditPanelOpen: false,
        isDeleteConfirmOpen: false,
      };
    }
    case "SET_DATE":
      return { ...state, currentDate: action.payload };
    case "SET_FILTER":
      return { ...state, activeFilter: action.payload };
    case "SELECT_TASK":
      return { ...state, selectedTaskId: action.payload };
    case "OPEN_EDIT":
      return { ...state, editingTaskId: action.payload, isEditPanelOpen: true };
    case "CLOSE_EDIT":
      return { ...state, editingTaskId: null, isEditPanelOpen: false, isDeleteConfirmOpen: false };
    case "SHOW_DELETE_CONFIRM":
      return { ...state, isDeleteConfirmOpen: action.payload.show, editingTaskId: action.payload.taskId };
    case "UPDATE_PROGRESS": {
      const tasks = { ...state.tasks };
      const dateTasks = [...(tasks[action.payload.date] ?? [])];
      const idx = dateTasks.findIndex((t) => t.id === action.payload.id);
      if (idx === -1) {
        console.warn("[OrbitAN] UPDATE_PROGRESS: task not found", action.payload.id, "on", action.payload.date);
        return state;
      }
      dateTasks[idx] = { ...dateTasks[idx]!, progress: action.payload.progress, completed: action.payload.progress >= 100 };
      tasks[action.payload.date] = dateTasks;
      return { ...state, tasks };
    }
    case "UPDATE_ORBIT_MODE":
      return { ...state, isOrbitModeOpen: action.payload };
    case "TOGGLE_ORBIT_MODE":
      return { ...state, isOrbitModeOpen: !state.isOrbitModeOpen };
    case "SET_VIEW_MODE":
      return { ...state, viewMode: action.payload };
    case "LOAD_FOCUS":
      return { ...state, focusBlocks: action.payload };
    case "ADD_FOCUS_BLOCK": {
      const fb = { ...state.focusBlocks };
      const arr = [...(fb[action.payload.date] ?? [])];
      arr.push(action.payload.block);
      arr.sort((a, b) => a.startTime.localeCompare(b.startTime));
      fb[action.payload.date] = arr;
      return { ...state, focusBlocks: fb };
    }
    case "UPDATE_FOCUS_BLOCK": {
      const fb = { ...state.focusBlocks };
      const arr = [...(fb[action.payload.date] ?? [])];
      const idx = arr.findIndex((b) => b.id === action.payload.block.id);
      if (idx !== -1) arr[idx] = action.payload.block;
      fb[action.payload.date] = arr;
      return { ...state, focusBlocks: fb };
    }
    case "DELETE_FOCUS_BLOCK": {
      const fb = { ...state.focusBlocks };
      const arr = (fb[action.payload.date] ?? []).filter((b) => b.id !== action.payload.id);
      if (arr.length === 0) delete fb[action.payload.date];
      else fb[action.payload.date] = arr;
      return { ...state, focusBlocks: fb };
    }
    case "SET_FOCUS_BLOCK_STATUS": {
      const fb = { ...state.focusBlocks };
      const arr = [...(fb[action.payload.date] ?? [])];
      const idx = arr.findIndex((b) => b.id === action.payload.id);
      if (idx !== -1) arr[idx] = { ...arr[idx]!, status: action.payload.status };
      fb[action.payload.date] = arr;
      return { ...state, focusBlocks: fb };
    }
    case "LOAD_REMINDERS":
      return { ...state, dailyReminders: action.payload };
    case "ADD_REMINDER": {
      const rm = { ...state.dailyReminders };
      rm[action.payload.date] = [...(rm[action.payload.date] ?? []), action.payload.reminder];
      return { ...state, dailyReminders: rm };
    }
    case "TOGGLE_REMINDER": {
      const rm = { ...state.dailyReminders };
      const arr = [...(rm[action.payload.date] ?? [])];
      const idx = arr.findIndex((r) => r.id === action.payload.id);
      if (idx !== -1) arr[idx] = { ...arr[idx]!, done: !arr[idx]!.done };
      rm[action.payload.date] = arr;
      return { ...state, dailyReminders: rm };
    }
    case "DELETE_REMINDER": {
      const rm = { ...state.dailyReminders };
      rm[action.payload.date] = (rm[action.payload.date] ?? []).filter((r) => r.id !== action.payload.id);
      if (rm[action.payload.date]!.length === 0) delete rm[action.payload.date];
      return { ...state, dailyReminders: rm };
    }
    case "UPDATE_REMINDER": {
      const rm = { ...state.dailyReminders };
      const arr = [...(rm[action.payload.date] ?? [])];
      const idx = arr.findIndex((r) => r.id === action.payload.id);
      if (idx !== -1) arr[idx] = { ...arr[idx]!, ...action.payload.updates };
      rm[action.payload.date] = arr;
      return { ...state, dailyReminders: rm };
    }
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const stored = loadTasks();
    const hasStored = Object.keys(stored).length > 0;
    dispatch({ type: "LOAD", payload: hasStored ? stored : getDefaultTasks() });
    const storedFocus = loadFocusBlocks();
    if (Object.keys(storedFocus).length > 0) {
      dispatch({ type: "LOAD_FOCUS", payload: storedFocus });
    }
    dispatch({ type: "LOAD_REMINDERS", payload: loadReminders() });
    // Sync custom type colors to the global cache for getTaskColor()
    setCustomTypeCache(loadCustomTypes());
  }, []);

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    saveTasks(state.tasks);
  }, [state.tasks]);

  const isFirstFocusRender = useRef(true);
  useEffect(() => {
    if (isFirstFocusRender.current) { isFirstFocusRender.current = false; return; }
    saveFocusBlocks(state.focusBlocks);
  }, [state.focusBlocks]);

  const isFirstReminderRender = useRef(true);
  useEffect(() => {
    if (isFirstReminderRender.current) { isFirstReminderRender.current = false; return; }
    saveReminders(state.dailyReminders);
  }, [state.dailyReminders]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}

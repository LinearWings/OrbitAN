import type {
  TasksByDate,
  Task,
  CustomTypeDef,
  GTDItem,
  ParetoItem,
  MoffattSession,
  HowellMatrixData,
  SWOTData,
} from "@/types";
import type { FocusBlocksByDate } from "@/types/focus";

const STORAGE_KEY = "orbital_schedule_v1";
const CURRENT_VERSION = 2;

interface StoredData {
  version: number;
  tasks: TasksByDate;
  methodologies?: {
    gtd?: GTDItem[];
    pareto?: ParetoItem[];
    moffatt?: MoffattSession[];
    howell?: HowellMatrixData;
    swot?: SWOTData;
    pomodoro?: { focusDuration: number; shortBreakDuration: number; longBreakDuration: number; cyclesBeforeLongBreak: number };
  };
}

function migrateTasks(tasks: TasksByDate): TasksByDate {
  const migrated: TasksByDate = {};
  for (const [date, dateTasks] of Object.entries(tasks)) {
    migrated[date] = (dateTasks as unknown[]).map((raw) => {
      const task = raw as Record<string, unknown>;
      // Check if already migrated — has startTime/endTime on the object
      if (typeof task.startTime === "string" && typeof task.endTime === "string") {
        return raw as Task;
      }
      // Old format: { time: "09:00", duration: 120, ...other Task fields }
      const time = (task.time as string) ?? "09:00";
      const dur = (task.duration as number) ?? 60;
      const [h, m] = time.split(":").map(Number);
      const startH = h ?? 0;
      const startM = m ?? 0;
      const totalEnd = startH * 60 + startM + dur;
      const endH = Math.floor(totalEnd / 60) % 24;
      const endM = totalEnd % 60;
      const endTime = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
      delete task.time;
      delete task.duration;
      task.startTime = time;
      task.endTime = endTime;
      return task as unknown as Task;
    });
  }
  return migrated;
}

function loadAll(): StoredData {
  if (typeof window === "undefined") return { version: CURRENT_VERSION, tasks: {} };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { version: CURRENT_VERSION, tasks: {} };
    const parsed = JSON.parse(raw);
    const version = parsed.version ?? 1;
    let tasks = parsed.tasks ?? {};

    // Run migrations if needed
    if (version < CURRENT_VERSION) {
      if (version < 2) {
        tasks = migrateTasks(tasks);
      }
    }

    return { ...parsed, version: CURRENT_VERSION, tasks };
  } catch (e) {
    console.error("[OrbitAN] Failed to load/parse stored data, resetting:", e);
    return { version: CURRENT_VERSION, tasks: {} };
  }
}

function saveAll(data: StoredData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, version: CURRENT_VERSION }));
  } catch (e) {
    console.error("Failed to save data:", e);
  }
}

export function loadTasks(): TasksByDate {
  return loadAll().tasks ?? {};
}

export function saveTasks(tasks: TasksByDate): void {
  const data = loadAll();
  data.tasks = tasks;
  saveAll(data);
}

export function loadMethodologyData<T>(key: string): T | null {
  const data = loadAll();
  const methodologies = data.methodologies ?? {};
  return (methodologies as Record<string, unknown>)[key] as T | null ?? null;
}

export function saveMethodologyData<T>(key: string, value: T): void {
  const data = loadAll();
  if (!data.methodologies) data.methodologies = {};
  (data.methodologies as Record<string, unknown>)[key] = value;
  saveAll(data);
}

export function clearStorage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(FOCUS_STORAGE_KEY);
  localStorage.removeItem(CUSTOM_TYPES_KEY);
}

const CUSTOM_TYPES_KEY = "orbital_custom_types_v1";

export function loadCustomTypes(): CustomTypeDef[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOM_TYPES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveCustomTypes(types: CustomTypeDef[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CUSTOM_TYPES_KEY, JSON.stringify(types));
}

const FOCUS_STORAGE_KEY = "orbital_focus_v1";

export function loadFocusBlocks(): FocusBlocksByDate {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(FOCUS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FocusBlocksByDate) : {};
  } catch { return {}; }
}

export function saveFocusBlocks(blocks: FocusBlocksByDate): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(FOCUS_STORAGE_KEY, JSON.stringify(blocks)); }
  catch (e) { console.error("[OrbitAN] Failed to save focus blocks (quota exceeded?):", e); }
}

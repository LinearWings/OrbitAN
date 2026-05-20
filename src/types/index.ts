export type TaskType = "work" | "study" | "meeting" | "personal";

/** Filter type: built-in types + "all" + custom type IDs */
export type FilterType = TaskType | "all" | string;

export interface CustomTypeDef {
  id: string;
  name: string;
  color: string;
}

export type RepeatMode = "none" | "daily" | "weekly" | "weekdays";

export interface Task {
  id: string;
  type: string;
  name: string;
  startTime: string;
  endTime: string;
  progress: number;
  completed: boolean;
  note: string;
  createdAt: string;
  method?: import("./focus").FocusMethodId;
  repeat?: RepeatMode;
  location?: string;
}

export type TasksByDate = Record<string, Task[]>;

export interface AppState {
  tasks: TasksByDate;
  currentDate: string;
  viewMode: "day" | "week" | "month";
  selectedTaskId: string | null;
  editingTaskId: string | null;
  activeFilter: FilterType;
  isEditPanelOpen: boolean;
  isDeleteConfirmOpen: boolean;
  isOrbitModeOpen: boolean;
  focusBlocks: Record<string, import("./focus").FocusBlock[]>;
}

export type AppAction =
  | { type: "LOAD"; payload: TasksByDate }
  | { type: "ADD"; payload: { date: string; task: Task } }
  | { type: "UPDATE"; payload: { date: string; task: Task } }
  | { type: "DELETE"; payload: { date: string; id: string } }
  | { type: "SET_DATE"; payload: string }
  | { type: "SET_FILTER"; payload: FilterType }
  | { type: "SELECT_TASK"; payload: string | null }
  | { type: "OPEN_EDIT"; payload: string | null }
  | { type: "CLOSE_EDIT" }
  | { type: "SHOW_DELETE_CONFIRM"; payload: { show: boolean; taskId: string | null } }
  | { type: "UPDATE_PROGRESS"; payload: { date: string; id: string; progress: number } }
  | { type: "UPDATE_ORBIT_MODE"; payload: boolean }
  | { type: "TOGGLE_ORBIT_MODE" }
  | { type: "SET_VIEW_MODE"; payload: "day" | "week" | "month" }
  | { type: "ADD_FOCUS_BLOCK"; payload: { date: string; block: import("./focus").FocusBlock } }
  | { type: "UPDATE_FOCUS_BLOCK"; payload: { date: string; block: import("./focus").FocusBlock } }
  | { type: "DELETE_FOCUS_BLOCK"; payload: { date: string; id: string } }
  | { type: "SET_FOCUS_BLOCK_STATUS"; payload: { date: string; id: string; status: import("./focus").FocusBlockStatus } }
  | { type: "LOAD_FOCUS"; payload: import("./focus").FocusBlocksByDate };

export interface CometPosition {
  tailX: number;
  tailY: number;
  headX: number;
  headY: number;
  headRadius: number;
  startAngle: number;
  endAngle: number;
  orbitRadius: number;
  color: string;
  colorRgb: { r: number; g: number; b: number };
  progress: number;
  opacity: number;
  taskName?: string;
  taskId?: string;
}

export type PlanetRadius = 4 | 5 | 7 | 9;

export interface MethodologyType {
  id: "gtd" | "pomodoro" | "pareto" | "moffatt" | "howell" | "swot";
  name: string;
  nameEn: string;
  description: string;
  icon: string;
}

export interface GTDItem {
  id: string;
  content: string;
  stage: "inbox" | "next" | "waiting" | "someday" | "done";
  createdAt: string;
}

export interface QuadrantItem {
  id: string;
  content: string;
  createdAt: string;
}

export interface HowellMatrixData {
  urgentImportant: QuadrantItem[];
  urgentNotImportant: QuadrantItem[];
  notUrgentImportant: QuadrantItem[];
  notUrgentNotImportant: QuadrantItem[];
}

export interface SWOTData {
  strengths: QuadrantItem[];
  weaknesses: QuadrantItem[];
  opportunities: QuadrantItem[];
  threats: QuadrantItem[];
}

export interface ParetoItem {
  id: string;
  content: string;
  impact: number;
  effort: number;
  score: number;
  isVital: boolean;
}

export interface MoffattSession {
  id: string;
  label: string;
  duration: number;
  remaining: number;
  isActive: boolean;
  isCompleted: boolean;
}

export type PomodoroPhase = "focus" | "shortBreak" | "longBreak";

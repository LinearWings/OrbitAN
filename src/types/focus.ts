export type FocusMethodId = "gtd" | "pomodoro" | "pareto" | "moffatt" | "howell" | "swot";

export type FocusBlockStatus = "planned" | "active" | "paused" | "completed";

export interface FocusBlock {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  method: FocusMethodId;
  status: FocusBlockStatus;
  linkedTaskId?: string;
  name: string;
  note: string;
  createdAt: string;
}

export type FocusBlocksByDate = Record<string, FocusBlock[]>;

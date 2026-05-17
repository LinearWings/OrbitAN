import type { Task, TasksByDate, MethodologyType } from "@/types";
import { getToday } from "@/utils/time";
import { getMethodologyGuide } from "./methodology-content";

export const DEMO_TASKS: Task[] = [
  {
    id: "demo-1",
    type: "work",
    name: "轨道计划前端开发",
    startTime: "09:00",
    endTime: "11:00",
    progress: 45,
    completed: false,
    note: "完成 Canvas 轨道引擎的 4 层渲染管线",
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-2",
    type: "meeting",
    name: "设计评审会议",
    startTime: "11:30",
    endTime: "12:30",
    progress: 0,
    completed: false,
    note: "评审宇宙主题视觉方案",
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-3",
    type: "study",
    name: "Canvas 2D 性能优化",
    startTime: "14:00",
    endTime: "15:30",
    progress: 0,
    completed: false,
    note: "OffscreenCanvas 缓存 + requestAnimationFrame 优化",
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-4",
    type: "personal",
    name: "午间阅读",
    startTime: "12:30",
    endTime: "13:00",
    progress: 100,
    completed: true,
    note: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: "demo-5",
    type: "work",
    name: "代码审查",
    startTime: "16:00",
    endTime: "16:45",
    progress: 0,
    completed: false,
    note: "审查 Orbit Mode 组件代码",
    createdAt: new Date().toISOString(),
  },
];

export function getDefaultTasks(): TasksByDate {
  const today = getToday();
  return { [today]: DEMO_TASKS };
}

export const METHODOLOGIES: MethodologyType[] = [
  {
    id: "gtd",
    name: "GTD 搞定",
    nameEn: "Getting Things Done",
    description: getMethodologyGuide("gtd").shortZh,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-5l-2 3H9l-2-3H2"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>`,
  },
  {
    id: "pomodoro",
    name: "番茄钟",
    nameEn: "Pomodoro",
    description: getMethodologyGuide("pomodoro").shortZh,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/><circle cx="12" cy="12" r="9" stroke-dasharray="8 4" opacity="0.4"/></svg>`,
  },
  {
    id: "pareto",
    name: "帕累托原则",
    nameEn: "Pareto Principle",
    description: getMethodologyGuide("pareto").shortZh,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="14" width="4" height="6" rx="1"/><rect x="10" y="10" width="4" height="10" rx="1" opacity="0.5"/><rect x="17" y="6" width="4" height="14" rx="1" opacity="0.3"/><path d="M3 20h18" stroke-width="1.5"/></svg>`,
  },
  {
    id: "moffatt",
    name: "莫法特休息法",
    nameEn: "Moffatt Rest",
    description: getMethodologyGuide("moffatt").shortZh,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/><path d="M21 3v5h-5"/><path d="M12 8v4l3 3"/></svg>`,
  },
  {
    id: "howell",
    name: "豪威尔矩阵",
    nameEn: "Howell Matrix",
    description: getMethodologyGuide("howell").shortZh,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="3" y1="12" x2="21" y2="12"/><circle cx="7" cy="7" r="1.5" fill="currentColor" opacity="0.6"/><circle cx="17" cy="7" r="1.5" fill="currentColor" opacity="0.3"/><circle cx="7" cy="17" r="1.5" fill="currentColor" opacity="0.3"/><circle cx="17" cy="17" r="1.5" fill="currentColor" opacity="0.6"/></svg>`,
  },
  {
    id: "swot",
    name: "SWOT 分析",
    nameEn: "SWOT Analysis",
    description: getMethodologyGuide("swot").shortZh,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2" fill="currentColor"/><line x1="12" y1="4" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="20"/><line x1="4" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="20" y2="12"/></svg>`,
  },
];

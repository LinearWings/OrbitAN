# Orbital Schedule — 实现计划 (Momus 审查通过)

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。
> **计划审查**: Momus v1 → 3 处阻塞 → 全部修复 → v2 通过

**目标：** 构建轨道计划 (Orbital Schedule) — 宇宙主题桌面日程管理应用，包含 Canvas 2D 轨道时钟、3D 行星球体、超现实先锋主义视觉风格，以及支持 6 种时间管理方法论的 Orbit Mode 聚焦模式。

**架构：** Next.js 16 App Router + React 19 + TypeScript strict + Tailwind CSS v4 + CSS Modules。Canvas 2D API 渲染轨道时钟/星云/行星/粒子，React DOM 渲染结构化内容。单 Context + useReducer 状态管理，localStorage 持久化。~70 文件按 7 个组件子目录组织。

**技术栈：** Next.js 16 (App Router) | React 19 | TypeScript 5 strict | Tailwind CSS v4 | CSS Modules | Canvas 2D API | oklch() 色彩 | Clash Display / Satoshi / JetBrains Mono 字体 | pnpm

**设计规格：** `docs/superpowers/specs/2026-04-28-orbital-schedule-design.md`

---

## 文件结构映射

```
orbitan/
├── next.config.ts                    # Next.js 配置 (字体加载)
├── tsconfig.json                     # TypeScript strict
├── tailwind.config.ts                # Tailwind v4 配置
├── package.json                      # 依赖声明
├── postcss.config.mjs                # PostCSS (Tailwind v4)
├── public/
│   └── noise-texture.png             # 256×256 噪点纹理 (PNG)
├── src/
│   ├── app/
│   │   ├── layout.tsx                # 根布局 (字体 + AppProvider)
│   │   ├── page.tsx                  # 主页面 (区域编排)
│   │   └── globals.css              # 全局样式 + 字体定义 + 关键帧
│   ├── components/
│   │   ├── orbital/
│   │   │   ├── OrbitalClock.tsx      # Canvas 容器 + RAF 循环
│   │   │   └── orbital-engine.ts     # 纯函数: drawOrbits/drawClock/drawPlanets/drawParticles/drawNoise
│   │   ├── layout/
│   │   │   ├── GeometricBg.tsx       # 几何切割背景 (Void Black / Cosmic White)
│   │   │   ├── TitleHeader.tsx       # 标题头 (日期/农历/AuxInfo容器)
│   │   │   ├── LegendBar.tsx         # 图例栏 (4类型 + 全部)
│   │   │   ├── LegendItem.tsx        # 单个图例标签
│   │   │   └── AuxInfo.tsx           # 辅助信息 (完成率/时辰)
│   │   ├── schedule/
│   │   │   ├── ScheduleList.tsx      # 日程列表容器 (排序+筛选+空态)
│   │   │   ├── ScheduleItem.tsx      # 日程项 (色点+时间+双语名+进度条)
│   │   │   ├── ProgressBar.tsx       # 可拖拽进度条
│   │   │   ├── TaskDetail.tsx        # 任务详情手风琴
│   │   │   └── MiniOrbitPreview.tsx  # 迷你轨道缩略图 Canvas
│   │   ├── editor/
│   │   │   ├── EditPanel.tsx         # 右侧滑出编辑面板
│   │   │   ├── TaskForm.tsx          # 任务表单
│   │   │   └── DeleteConfirm.tsx     # 删除确认
│   │   ├── ui/
│   │   │   ├── ColorDot.tsx          # 彩色圆点组件
│   │   │   ├── ProgressSlider.tsx    # 进度滑块基础组件
│   │   │   └── OrbitalCursor.tsx     # 自定义轨道光标
│   │   └── orbit-mode/
│   │       ├── OrbitModeOverlay.tsx  # Orbit Mode 覆盖层容器
│   │       ├── LiquidGlass.tsx       # 液态玻璃层 (SVG滤镜+backdrop)
│   │       ├── WeekTimeline.tsx      # 周视图时间轴
│   │       ├── TimeSlotColumn.tsx    # 每日时间列
│   │       ├── FocusBlock.tsx        # 聚焦块
│   │       ├── FocusBlockForm.tsx    # 聚焦块表单
│   │       ├── MethodSelector.tsx    # 方法论选择器
│   │       └── methods/
│   │           ├── GTDPanel.tsx
│   │           ├── PomodoroPanel.tsx
│   │           ├── ParetoPanel.tsx
│   │           ├── MoffattPanel.tsx
│   │           ├── HowellMatrix.tsx
│   │           └── SWOTPanel.tsx
│   ├── context/
│   │   ├── AppContext.tsx            # Context Provider + useReducer
│   │   └── appReducer.ts            # Reducer (15 actions)
│   ├── hooks/
│   │   ├── useTasks.ts              # 任务 CRUD + localStorage
│   │   ├── useClock.ts              # 实时时钟 hook
│   │   ├── useOrbital.ts            # Canvas RAF + 渲染
│   │   ├── useFilter.ts             # 筛选状态
│   │   ├── useDateNavigation.ts     # 日期导航 (本周)
│   │   ├── useKeyboard.ts           # 键盘快捷键
│   │   ├── usePomodoro.ts           # 番茄钟倒计时
│   │   ├── useMoffattScheduler.ts   # 莫法特轮换调度
│   │   ├── useParetoAnalysis.ts     # 帕累托分析
│   │   └── useWeekView.ts           # 周视图数据
│   ├── types/
│   │   ├── task.ts                  # Task / TaskType / ColorMap
│   │   ├── orbital.ts               # OrbitalConfig / Planet / Particle
│   │   ├── focus-block.ts           # FocusBlock / WeekData
│   │   └── methodology.ts           # MethodType / MethodConfig
│   ├── utils/
│   │   ├── storage.ts               # localStorage 读写
│   │   ├── time.ts                  # 时间工具 (角度计算/格式化)
│   │   ├── color.ts                 # 颜色工具 (oklch/hex/渐变)
│   │   ├── constants.ts             # 全局常量
│   │   ├── pareto.ts                # 帕累托排序算法
│   │   └── moffatt.ts               # 莫法特轮换算法
│   └── data/
│       └── sample-tasks.ts          # 示例任务数据
└── docs/
    ├── README.md
    ├── CHANGELOG.md
    ├── FEATURES.md
    └── methodologies/
        ├── gtd.md
        ├── pomodoro.md
        ├── pareto.md
        ├── moffatt.md
        ├── howell-matrix.md
        └── swot.md
```

---

### Phase 1: 骨架搭建

### 任务 1：Next.js 项目初始化

**文件：**
- 创建：`package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.mjs`, `.eslintrc.json`, `.prettierrc`

- [ ] **步骤 1：使用 create-next-app 初始化项目**

```bash
npx create-next-app@latest orbitan --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm --no-turbopack
```

- [ ] **步骤 2：验证项目结构**

运行：`pnpm dev`
预期：Next.js 默认页面在 http://localhost:3000 正常渲染

- [ ] **步骤 3：安装额外依赖**

```bash
pnpm add @fontsource/clash-display @fontsource/satoshi @fontsource/jetbrains-mono
```

- [ ] **步骤 4：配置 next.config.ts 加载自定义字体**

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@fontsource/clash-display", "@fontsource/satoshi"],
  },
};

export default nextConfig;
```

- [ ] **步骤 5：配置 TypeScript strict**

```json
// tsconfig.json 确保以下字段
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

- [ ] **步骤 6：验证构建**

运行：`pnpm build`
预期：构建成功，无类型错误

---

### 任务 2：目录结构 + 类型定义

**文件：**
- 创建：`src/types/task.ts`, `src/types/orbital.ts`, `src/types/focus-block.ts`, `src/types/methodology.ts`
- 创建：所有空目录结构

- [ ] **步骤 1：创建目录结构**

```bash
mkdir -p src/components/{orbital,layout,schedule,editor,ui,orbit-mode/methods}
mkdir -p src/{context,hooks,types,utils,data}
mkdir -p docs/methodologies
mkdir -p public
```

- [ ] **步骤 2：编写 `src/types/task.ts`**

```typescript
// src/types/task.ts
export type TaskType = "work" | "study" | "meeting" | "personal";

export const TASK_TYPES: TaskType[] = ["work", "study", "meeting", "personal"];

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  work: "工作",
  study: "学习",
  meeting: "会议",
  personal: "个人",
};

export const TASK_TYPE_COLORS_HEX: Record<TaskType, string> = {
  work: "#2962FF",
  study: "#F5C518",
  meeting: "#2D3748",
  personal: "#6B7280",
};

export const TASK_TYPE_COLORS_OKLCH: Record<TaskType, string> = {
  work: "oklch(0.45 0.25 265)",
  study: "oklch(0.82 0.21 100)",
  meeting: "oklch(0.25 0.03 250)",
  personal: "oklch(0.45 0.01 260)",
};

export interface Task {
  id: string;
  type: TaskType;
  name: string;
  nameEn: string;
  time: string;         // "HH:MM"
  duration: number;     // 分钟
  progress: number;     // 0~1
  completed: boolean;
  note: string;
  createdAt: number;
}
```

- [ ] **步骤 3：编写 `src/types/orbital.ts`**

```typescript
// src/types/orbital.ts
export interface Planet {
  taskId: string;
  type: "work" | "study" | "meeting" | "personal";
  x: number;
  y: number;
  radius: number;
  angle: number;
  orbitRadius: number;
  progress: number;
  color: string;
}

export interface OrbitalConfig {
  centerX: number;
  centerY: number;
  canvasSize: number;
}

export interface Particle {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  color: string;
  angle: number;
  distance: number;
  speed: number;
}
```

- [ ] **步骤 4：编写 `src/types/focus-block.ts`**

```typescript
// src/types/focus-block.ts
import type { MethodType } from "./methodology";

export interface FocusBlock {
  id: string;
  date: string;
  startTime: string;    // "HH:MM"
  endTime: string;      // "HH:MM"
  title: string;
  methodology: MethodType;
  color: string;
  note: string;
}

export interface WeekData {
  monday: string;       // "YYYY-MM-DD"
  blocks: Record<string, FocusBlock[]>; // date → blocks
}
```

- [ ] **步骤 5：编写 `src/types/methodology.ts`**

```typescript
// src/types/methodology.ts
export type MethodType = "gtd" | "pomodoro" | "pareto" | "moffatt" | "howell" | "swot";

export interface MethodConfig {
  type: MethodType;
  label: string;
  labelZh: string;
  description: string;
  icon: string;
}

export const METHODOLOGIES: MethodConfig[] = [
  { type: "gtd", label: "GTD", labelZh: "搞定", description: "Getting Things Done — 捕捉→澄清→整理→回顾→执行", icon: "📥" },
  { type: "pomodoro", label: "Pomodoro", labelZh: "番茄钟", description: "25分钟专注 + 5分钟休息循环", icon: "🍅" },
  { type: "pareto", label: "Pareto", labelZh: "帕累托", description: "80/20法则 — 聚焦高ROI任务", icon: "📊" },
  { type: "moffatt", label: "Moffatt", labelZh: "莫法特", description: "任务轮换休息法 — 4类交替", icon: "🔄" },
  { type: "howell", label: "Howell", labelZh: "豪威尔矩阵", description: "紧急/重要 四象限", icon: "📐" },
  { type: "swot", label: "SWOT", labelZh: "SWOT分析", description: "优势/劣势/机会/威胁", icon: "🔍" },
];
```

- [ ] **步骤 6：验证类型定义**

运行：`pnpm exec tsc --noEmit`
预期：无类型错误

---

### 任务 3：全局常量 + 工具函数

**文件：**
- 创建：`src/utils/constants.ts`, `src/utils/time.ts`, `src/utils/color.ts`, `src/utils/storage.ts`

- [ ] **步骤 1：编写 `src/utils/constants.ts`**

```typescript
// src/utils/constants.ts
export const STORAGE_KEY = "orbital_schedule_v1";
export const STORAGE_VERSION = 1;

// Canvas 基础尺寸
export const CANVAS_SIZE_BASE = { w: 960, h: 960 };
export const CANVAS_SIZE_RATIO = 0.45; // min(45vw, 55vh) at 1920x1080

// 轨道配置
export const ORBIT_RINGS = [90, 115, 140, 165, 190, 215, 240, 265, 290, 315];
export const ORBIT_COLORS_ODD = "#F5C518";
export const ORBIT_COLORS_EVEN = "#2962FF";

// 时钟
export const CLOCK_FACE_COLOR = "#0A0A0A";
export const CLOCK_TICK_COLOR = "#E5E5E5";
export const CLOCK_BEZEL_COLORS = ["#444", "#888", "#666", "#CCC", "#444"];

// 行星大小
export const PLANET_SIZE_MAP: [number, number][] = [
  [0, 8], [30, 8], [31, 12], [60, 12], [61, 16], [120, 16], [121, 20],
];

// 粒子
export const PARTICLE_COUNT = 200;
export const PARTICLE_RADIUS_RANGE = [40, 320];

// 噪点
export const NOISE_OPACITY = 0.04;

// 时间映射 (06:00→0°, 18:00→180°)
export const TIME_ANGLE_START = 6;  // 06:00 = 0°
export const TIME_ANGLE_END = 22;   // 22:00 = 240°
export const ORBIT_BUCKET_DURATION = 4; // 每4小时一个轨道

// 动画
export const EDIT_PANEL_DURATION = 350; // ms
export const EDIT_PANEL_EASING = "cubic-bezier(0.4, 0, 0.2, 1)";
```

- [ ] **步骤 2：编写 `src/utils/time.ts`**

```typescript
// src/utils/time.ts
/** 将 "HH:MM" 字符串转为分钟数 (从 00:00 起) */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  if (h === undefined || m === undefined) return 0;
  return h * 60 + m;
}

/** 将分钟数转回 "HH:MM" 字符串 */
export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

/** 任务时间映射到轨道角度 (弧度) */
export function timeToAngle(time: string): number {
  const minutes = timeToMinutes(time);
  const startMinutes = 6 * 60;  // 06:00
  const endMinutes = 22 * 60;   // 22:00
  const totalMinutes = endMinutes - startMinutes;
  const ratio = Math.max(0, Math.min(1, (minutes - startMinutes) / totalMinutes));
  return ratio * Math.PI * 2 * (240 / 360); // 240° 弧度
}

/** 根据任务时长映射行星半径 */
export function durationToRadius(duration: number): number {
  if (duration <= 30) return 8;
  if (duration <= 60) return 12;
  if (duration <= 120) return 16;
  return 20;
}

/** 根据时长选择轨道半径 */
export function durationToOrbitRadius(duration: number): number {
  if (duration <= 30) return 90;
  if (duration <= 60) return 150;
  if (duration <= 120) return 225;
  return 315;
}

/** 获取当前日期字符串 YYYY-MM-DD */
export function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

/** 获取本周第一天 (周一) */
export function getWeekStart(dateStr: string): Date {
  const d = new Date(dateStr);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

/** 格式化日期为中文 */
export function formatDateCN(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

/** 获取星期几中文 */
export function getDayOfWeekCN(dateStr: string): string {
  const days = ["日", "一", "二", "三", "四", "五", "六"];
  return `星期${days[new Date(dateStr).getDay()]}`;
}

/** 本周日期范围限制 */
export function getWeekRange(today: string): { start: string; end: string } {
  const now = new Date(today);
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    start: monday.toISOString().slice(0, 10),
    end: sunday.toISOString().slice(0, 10),
  };
}
```

- [ ] **步骤 3：编写 `src/utils/color.ts`**

```typescript
// src/utils/color.ts
import type { TaskType } from "@/types/task";

/** hex 转 rgba */
export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** 获取任务类型对应色值 */
export function getTaskColor(type: TaskType): string {
  const map: Record<TaskType, string> = {
    work: "#2962FF",
    study: "#F5C518",
    meeting: "#2D3748",
    personal: "#6B7280",
  };
  return map[type];
}

/** 获取淡化版本的任务颜色 (用于背景) */
export function getTaskColorAlpha(type: TaskType, alpha: number): string {
  return hexToRgba(getTaskColor(type), alpha);
}

/** 明亮化颜色 (用于行星高光) */
export function lightenColor(hex: string, factor: number): string {
  const r = Math.min(255, Math.floor(parseInt(hex.slice(1, 3), 16) * factor));
  const g = Math.min(255, Math.floor(parseInt(hex.slice(3, 5), 16) * factor));
  const b = Math.min(255, Math.floor(parseInt(hex.slice(5, 7), 16) * factor));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/** 暗化颜色 (用于行星阴影面) */
export function darkenColor(hex: string, factor: number): string {
  const r = Math.floor(parseInt(hex.slice(1, 3), 16) * factor);
  const g = Math.floor(parseInt(hex.slice(3, 5), 16) * factor);
  const b = Math.floor(parseInt(hex.slice(5, 7), 16) * factor);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
```

- [ ] **步骤 4：编写 `src/utils/storage.ts`**

```typescript
// src/utils/storage.ts
import type { Task } from "@/types/task";
import type { FocusBlock } from "@/types/focus-block";
import { STORAGE_KEY, STORAGE_VERSION } from "./constants";

interface StorageData {
  version: number;
  tasks: Record<string, Task[]>;
  focusBlocks: Record<string, FocusBlock[]>;
}

export function loadStorage(): StorageData {
  if (typeof window === "undefined") {
    return { version: STORAGE_VERSION, tasks: {}, focusBlocks: {} };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { version: STORAGE_VERSION, tasks: {}, focusBlocks: {} };
    const data = JSON.parse(raw) as StorageData;
    if (data.version !== STORAGE_VERSION) {
      return { version: STORAGE_VERSION, tasks: {}, focusBlocks: {} };
    }
    return data;
  } catch {
    return { version: STORAGE_VERSION, tasks: {}, focusBlocks: {} };
  }
}

export function saveStorage(tasks: Record<string, Task[]>, focusBlocks: Record<string, FocusBlock[]>): void {
  if (typeof window === "undefined") return;
  try {
    const data: StorageData = { version: STORAGE_VERSION, tasks, focusBlocks };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save to localStorage:", e);
  }
}
```

- [ ] **步骤 5：验证工具函数**

运行：`pnpm exec tsc --noEmit`
预期：无类型错误

---

### 任务 4：Context + Reducer

**文件：**
- 创建：`src/context/appReducer.ts`, `src/context/AppContext.tsx`

- [ ] **步骤 1：编写 `src/context/appReducer.ts`**

```typescript
// src/context/appReducer.ts
import type { Task, TaskType } from "@/types/task";
import type { FocusBlock } from "@/types/focus-block";
import type { MethodType } from "@/types/methodology";

export interface AppState {
  tasks: Record<string, Task[]>;
  focusBlocks: Record<string, FocusBlock[]>;
  currentDate: string;
  selectedTaskId: string | null;
  editingTaskId: string | null;
  activeFilter: TaskType | "all";
  editPanelOpen: boolean;
  deleteConfirmId: string | null;
  orbitMode: boolean;
  activeMethodology: MethodType | null;
}

export type AppAction =
  | { type: "INIT"; payload: { tasks: Record<string, Task[]>; focusBlocks: Record<string, FocusBlock[]> } }
  | { type: "ADD_TASK"; payload: { date: string; task: Task } }
  | { type: "UPDATE_TASK"; payload: { date: string; task: Task } }
  | { type: "DELETE_TASK"; payload: { date: string; taskId: string } }
  | { type: "SET_DATE"; payload: string }
  | { type: "SET_FILTER"; payload: TaskType | "all" }
  | { type: "SELECT_TASK"; payload: string | null }
  | { type: "OPEN_EDIT"; payload: string | null }
  | { type: "CLOSE_EDIT" }
  | { type: "SHOW_DELETE_CONFIRM"; payload: string | null }
  | { type: "UPDATE_PROGRESS"; payload: { date: string; taskId: string; progress: number } }
  | { type: "TOGGLE_ORBIT_MODE" }
  | { type: "SET_METHODOLOGY"; payload: MethodType | null }
  | { type: "ADD_FOCUS_BLOCK"; payload: FocusBlock }
  | { type: "DELETE_FOCUS_BLOCK"; payload: string };

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "INIT":
      return { ...state, tasks: action.payload.tasks, focusBlocks: action.payload.focusBlocks };

    case "ADD_TASK":
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.payload.date]: [
            ...(state.tasks[action.payload.date] || []),
            action.payload.task,
          ],
        },
        editPanelOpen: false,
        editingTaskId: null,
      };

    case "UPDATE_TASK":
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.payload.date]: (state.tasks[action.payload.date] || []).map((t) =>
            t.id === action.payload.task.id ? action.payload.task : t
          ),
        },
        editPanelOpen: false,
        editingTaskId: null,
      };

    case "DELETE_TASK":
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.payload.date]: (state.tasks[action.payload.date] || []).filter(
            (t) => t.id !== action.payload.taskId
          ),
        },
        deleteConfirmId: null,
        selectedTaskId: state.selectedTaskId === action.payload.taskId ? null : state.selectedTaskId,
      };

    case "SET_DATE":
      return { ...state, currentDate: action.payload, selectedTaskId: null };

    case "SET_FILTER":
      return { ...state, activeFilter: action.payload, selectedTaskId: null };

    case "SELECT_TASK":
      return { ...state, selectedTaskId: action.payload };

    case "OPEN_EDIT":
      return { ...state, editPanelOpen: true, editingTaskId: action.payload };

    case "CLOSE_EDIT":
      return { ...state, editPanelOpen: false, editingTaskId: null };

    case "SHOW_DELETE_CONFIRM":
      return { ...state, deleteConfirmId: action.payload };

    case "UPDATE_PROGRESS":
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.payload.date]: (state.tasks[action.payload.date] || []).map((t) =>
            t.id === action.payload.taskId
              ? { ...t, progress: action.payload.progress, completed: action.payload.progress >= 1 }
              : t
          ),
        },
      };

    case "TOGGLE_ORBIT_MODE":
      return { ...state, orbitMode: !state.orbitMode, activeMethodology: state.orbitMode ? null : state.activeMethodology };

    case "SET_METHODOLOGY":
      return { ...state, activeMethodology: action.payload };

    case "ADD_FOCUS_BLOCK": {
      const block = action.payload;
      return {
        ...state,
        focusBlocks: {
          ...state.focusBlocks,
          [block.date]: [...(state.focusBlocks[block.date] || []), block],
        },
      };
    }

    case "DELETE_FOCUS_BLOCK":
      return {
        ...state,
        focusBlocks: Object.fromEntries(
          Object.entries(state.focusBlocks).map(([date, blocks]) => [
            date,
            blocks.filter((b) => b.id !== action.payload),
          ])
        ),
      };

    default:
      return state;
  }
}

export const initialAppState: AppState = {
  tasks: {},
  focusBlocks: {},
  currentDate: new Date().toISOString().slice(0, 10),
  selectedTaskId: null,
  editingTaskId: null,
  activeFilter: "all",
  editPanelOpen: false,
  deleteConfirmId: null,
  orbitMode: false,
  activeMethodology: null,
};
```

- [ ] **步骤 2：编写 `src/context/AppContext.tsx`**

```typescript
// src/context/AppContext.tsx
"use client";

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react";
import { appReducer, initialAppState, type AppState, type AppAction } from "./appReducer";
import { loadStorage, saveStorage } from "@/utils/storage";

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialAppState);

  // 初始化：从 localStorage 加载
  useEffect(() => {
    const data = loadStorage();
    dispatch({ type: "INIT", payload: { tasks: data.tasks, focusBlocks: data.focusBlocks } });
  }, []);

  // 持久化：每次 tasks 或 focusBlocks 变更时保存
  useEffect(() => {
    saveStorage(state.tasks, state.focusBlocks);
  }, [state.tasks, state.focusBlocks]);

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
```

- [ ] **步骤 3：验证类型**

运行：`pnpm exec tsc --noEmit`
预期：无类型错误

---

### 任务 5：全局样式 + 字体 + 关键帧

**文件：**
- 创建：`src/app/globals.css`

- [ ] **步骤 1：编写 `src/app/globals.css`**

```css
/* src/app/globals.css */
@import "tailwindcss";
@import "@fontsource/clash-display/400.css";
@import "@fontsource/clash-display/500.css";
@import "@fontsource/clash-display/600.css";
@import "@fontsource/clash-display/700.css";
@import "@fontsource/satoshi/300.css";
@import "@fontsource/satoshi/400.css";
@import "@fontsource/satoshi/500.css";
@import "@fontsource/satoshi/700.css";
@import "@fontsource/jetbrains-mono/400.css";
@import "@fontsource/jetbrains-mono/500.css";
@import "@fontsource/jetbrains-mono/700.css";

@theme {
  --font-display: "Clash Display", "Space Grotesk", "Outfit", sans-serif;
  --font-body: "Satoshi", "DM Sans", "Plus Jakarta Sans", sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", "Cascadia Code", monospace;

  --color-void: #020208;
  --color-cosmic-white: #F0F0F0;
  --color-cosmic-violet: #7C3AED;
  --color-work: #2962FF;
  --color-study: #F5C518;
  --color-meeting: #2D3748;
  --color-personal: #6B7280;
  --color-clock-face: #0A0A0A;
  --color-clock-tick: #E5E5E5;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  font-family: var(--font-body);
  background: var(--color-void);
  color: var(--color-cosmic-white);
  overflow: hidden;
  height: 100%;
  cursor: none;
}

/* 色散入场关键帧 */
@keyframes chromatic-converge {
  0% {
    text-shadow: -8px 0 0 rgba(255,0,0,0.6), 8px 0 0 rgba(0,255,255,0.6);
    opacity: 0;
  }
  60% {
    text-shadow: -2px 0 0 rgba(255,0,0,0.3), 2px 0 0 rgba(0,255,255,0.3);
    opacity: 0.8;
  }
  100% {
    text-shadow: 0 0 0 transparent, 0 0 0 transparent;
    opacity: 1;
  }
}

/* 引力透镜: 行星hover放大 + 位移扭曲 */
@keyframes gravity-lens {
  0% { transform: scale(1); filter: drop-shadow(0 0 4px rgba(124,58,237,0.3)); }
  50% { transform: scale(1.25); filter: drop-shadow(0 0 12px rgba(124,58,237,0.6)); }
  100% { transform: scale(1.2); filter: drop-shadow(0 0 8px rgba(124,58,237,0.5)); }
}

/* 超新星脉冲: 选中行星效果 */
@keyframes supernova-pulse {
  0% { box-shadow: 0 0 0 0 rgba(124,58,237,0.6); }
  50% { box-shadow: 0 0 20px 4px rgba(124,58,237,0.3), 0 0 40px 8px rgba(41,98,255,0.2); }
  100% { box-shadow: 0 0 0 0 rgba(124,58,237,0); }
}

/* 时空撕裂: 编辑面板入场色散拖尾 */
@keyframes temporal-tear {
  0% { filter: blur(2px); opacity: 0.7; }
  10% { filter: blur(0px); opacity: 1; }
  15% { filter: blur(1px); opacity: 0.9; }
  20% { filter: blur(0px); opacity: 1; }
  100% { filter: blur(0px); opacity: 1; }
}

/* 退相干: 隐藏元素色散→褪色→缩小 */
@keyframes decohere {
  0% { opacity: 1; transform: scale(1); filter: blur(0); }
  30% { filter: blur(2px); }
  100% { opacity: 0.15; transform: scale(0.95); filter: blur(1px); }
}

/* 量子隧穿: 粒子消散 + 重组 */
@keyframes quantum-tunnel-out {
  0% { opacity: 1; filter: blur(0); }
  100% { opacity: 0; filter: blur(4px); transform: scale(0.9); }
}

@keyframes quantum-tunnel-in {
  0% { opacity: 0; filter: blur(4px); transform: scale(1.1); }
  100% { opacity: 1; filter: blur(0); transform: scale(1); }
}

/* 聚焦块呼吸 */
@keyframes focus-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(124,58,237,0.15), 0 0 60px rgba(124,58,237,0.05); }
  50% { box-shadow: 0 0 30px rgba(124,58,237,0.25), 0 0 80px rgba(41,98,255,0.1); }
}

/* 事件视界: Orbit Mode入场 */
@keyframes event-horizon-expand {
  0% { clip-path: circle(24px at calc(100% - 48px) calc(100% - 48px)); }
  60% { clip-path: circle(60% at calc(100% - 48px) calc(100% - 48px)); }
  100% { clip-path: circle(150% at calc(100% - 48px) calc(100% - 48px)); }
}

/* 编辑面板滑入 */
@keyframes slide-in-right {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

/* 编辑面板滑出 */
@keyframes slide-out-right {
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
}

/* 色散hover */
.chromatic-hover:hover {
  animation: chromatic-converge 0.3s ease-out;
}

/* 标题色散入场 */
.title-chromatic {
  animation: chromatic-converge 0.8s ease-out both;
}

/* 图层入场 (staggered) */
.fade-up {
  opacity: 0;
  animation: fade-up 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 自定义光标 */
.custom-cursor {
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  transition: width 0.2s, height 0.2s, border-color 0.2s;
}

.cursor-outer-ring {
  width: 40px;
  height: 40px;
  border: 1px solid rgba(255,255,255,0.4);
  border-radius: 50%;
  transition: width 0.3s, height 0.3s, border-color 0.3s;
}

.cursor-inner-dot {
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
}

.cursor-hover-task .cursor-outer-ring {
  width: 56px;
  height: 56px;
  border-color: var(--task-color);
}
```

- [ ] **步骤 2：验证 CSS 加载**

运行：`pnpm dev`，检查浏览器 console 无CSS错误
预期：页面背景为 Void Black (#020208)，无字体加载错误

---

### 任务 6：根布局 + 主页面

**文件：**
- 创建：`src/app/layout.tsx`, `src/app/page.tsx`

- [ ] **步骤 1：编写 `src/app/layout.tsx`**

```typescript
// src/app/layout.tsx
import type { Metadata } from "next";
import { AppProvider } from "@/context/AppContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "OrbitAN — 轨道计划",
  description: "一天即一圈轨道，专注是你引力。超现实先锋主义桌面日程管理。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
```

- [ ] **步骤 2：编写 `src/app/page.tsx` (空壳)** — 仅包含 5 区域占位

```typescript
// src/app/page.tsx
"use client";

import { useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { getTodayStr } from "@/utils/time";

export default function HomePage() {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    dispatch({ type: "SET_DATE", payload: getTodayStr() });
  }, [dispatch]);

  if (state.orbitMode) {
    return <div className="fixed inset-0 z-50">Orbit Mode (待实现)</div>;
  }

  return (
    <main className="fixed inset-0 overflow-hidden">
      {/* 1. GeometricBg */}
      <div className="fixed inset-0" style={{
        background: "linear-gradient(135deg, #020208 0% 55%, #F0F0F0 55% 100%)",
      }} />

      {/* 2. OrbitalClock */}
      <div className="absolute" style={{ left: "5vw", top: "12vh", width: "min(45vw, 55vh)", height: "min(45vw, 55vh)" }}>
        Canvas Clock (待实现)
      </div>

      {/* 3. TitleHeader */}
      <div className="absolute right-[5vw] top-[5vh] text-right">
        <h1 className="font-display text-[clamp(3rem,8vw,6rem)] leading-none text-cosmic-white title-chromatic">
          ORBIT·AN
        </h1>
        <p className="font-mono text-cosmic-white/60 text-sm mt-2">
          {state.currentDate}
        </p>
      </div>

      {/* 4. ScheduleList */}
      <div className="absolute right-[5vw] top-[32vh] bottom-[12vh] w-[28vw] overflow-y-auto">
        Schedule List (待实现)
      </div>

      {/* 5. LegendBar + AuxInfo */}
      <div className="absolute right-[5vw] bottom-[5vh] flex gap-4">
        Legend Bar (待实现)
      </div>
    </main>
  );
}
```

- [ ] **步骤 3：验证页面渲染**

运行：`pnpm dev`，访问 http://localhost:3000
预期：看到几何切割背景 (黑白对角线分割)、标题 "ORBIT·AN" 大字、今日日期

---

### Phase 2: 核心视觉

### 任务 7：Canvas 轨道引擎 — 静态层 (轨道环 + 3D 表盘)

**文件：**
- 创建：`src/utils/color.ts` (已创建，补充 Canvas 绘制函数)
- 修改：`src/components/orbital/orbital-engine.ts`

- [ ] **步骤 1：编写 `src/components/orbital/orbital-engine.ts` — 静态层绘制**

```typescript
// src/components/orbital/orbital-engine.ts
import { CLOCK_FACE_COLOR, CLOCK_TICK_COLOR, CLOCK_BEZEL_COLORS, ORBIT_RINGS, ORBIT_COLORS_ODD, ORBIT_COLORS_EVEN } from "@/utils/constants";

// ========== 静态层 ==========

/** 绘制阿基米德螺旋轨道环 */
export function drawOrbits(ctx: CanvasRenderingContext2D, cx: number, cy: number): void {
  ORBIT_RINGS.forEach((radius, index) => {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = index % 2 === 0 ? ORBIT_COLORS_EVEN : ORBIT_COLORS_ODD;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.15 + index * 0.02;
    ctx.setLineDash([4, 12]);
    ctx.lineDashOffset = index * 3;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  });
}

/** 绘制 3D 金属表盘 — 4环同心斜面渐变外框 */
export function drawClockDial(ctx: CanvasRenderingContext2D, cx: number, cy: number, outerRadius: number): void {
  const ringWidth = 4;

  for (let i = 0; i < 4; i++) {
    const radius = outerRadius - i * ringWidth;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);

    // 金属斜面渐变模拟 3D
    const gradient = ctx.createConicGradient(i * Math.PI / 6, cx, cy);
    gradient.addColorStop(0, CLOCK_BEZEL_COLORS[0]!);
    gradient.addColorStop(0.25, CLOCK_BEZEL_COLORS[1]!);
    gradient.addColorStop(0.5, CLOCK_BEZEL_COLORS[2]!);
    gradient.addColorStop(0.75, CLOCK_BEZEL_COLORS[3]!);
    gradient.addColorStop(1, CLOCK_BEZEL_COLORS[4]!);

    ctx.strokeStyle = gradient;
    ctx.lineWidth = ringWidth;
    ctx.stroke();
  }

  // 表盘底色
  ctx.beginPath();
  ctx.arc(cx, cy, outerRadius - 16, 0, Math.PI * 2);
  ctx.fillStyle = CLOCK_FACE_COLOR;
  ctx.fill();

  // 刻度
  for (let i = 0; i < 60; i++) {
    const angle = (i / 60) * Math.PI * 2 - Math.PI / 2;
    const isHour = i % 5 === 0;
    const tickStart = outerRadius - 22;
    const tickEnd = isHour ? outerRadius - 32 : outerRadius - 24;

    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * tickStart, cy + Math.sin(angle) * tickStart);
    ctx.lineTo(cx + Math.cos(angle) * tickEnd, cy + Math.sin(angle) * tickEnd);
    ctx.strokeStyle = CLOCK_TICK_COLOR;
    ctx.lineWidth = isHour ? 2 : 0.5;
    ctx.stroke();
  }
}

/** 创建静态层 OffscreenCanvas */
export function createStaticLayer(
  canvasSize: number,
  clockRadius: number
): OffscreenCanvas {
  const oc = new OffscreenCanvas(canvasSize, canvasSize);
  const ctx = oc.getContext("2d");
  if (!ctx) throw new Error("Cannot get 2d context");

  const cx = canvasSize / 2;
  const cy = canvasSize / 2;

  drawOrbits(ctx, cx, cy);
  drawClockDial(ctx, cx, cy, clockRadius);

  return oc;
}
```

- [ ] **步骤 2：验证类型**

运行：`pnpm exec tsc --noEmit`
预期：无类型错误

---

### 任务 8：Canvas 轨道引擎 — 动态层 (行星 + 时钟指针)

**文件：**
- 修改：`src/components/orbital/orbital-engine.ts` (追加内容)

- [ ] **步骤 1：追加动态层绘制函数到 orbital-engine.ts**

```typescript
// 追加到 src/components/orbital/orbital-engine.ts

import type { Planet } from "@/types/orbital";
import { durationToRadius, timeToAngle, durationToOrbitRadius } from "@/utils/time";
import { getTaskColor, lightenColor, darkenColor } from "@/utils/color";
import type { Task } from "@/types/task";

// ========== 动态层 ==========

/** 任务列表 → 行星数据数组 */
export function computePlanets(
  tasks: Task[],
  cx: number,
  cy: number
): Planet[] {
  return tasks.map((task) => {
    const angle = timeToAngle(task.time) - Math.PI / 2; // 0弧度在右侧
    const orbitRadius = durationToOrbitRadius(task.duration);
    const x = cx + Math.cos(angle) * orbitRadius;
    const y = cy + Math.sin(angle) * orbitRadius;
    const radius = durationToRadius(task.duration);
    const color = getTaskColor(task.type);

    return {
      taskId: task.id,
      type: task.type,
      x,
      y,
      radius,
      angle,
      orbitRadius,
      progress: task.progress,
      color,
    };
  });
}

/** 绘制3D行星球体 (径向渐变 + 高光 + 阴影 + 进度弧) */
export function drawPlanet(
  ctx: CanvasRenderingContext2D,
  planet: Planet,
  isSelected: boolean,
  isHovered: boolean
): void {
  const { x, y, radius, color, progress } = planet;

  // 缩放
  const scale = isSelected ? 1.35 : isHovered ? 1.2 : 1;
  const r = radius * scale;

  ctx.save();

  // 选中光晕
  if (isSelected) {
    ctx.beginPath();
    ctx.arc(x, y, r + 12, 0, Math.PI * 2);
    const glowGrad = ctx.createRadialGradient(x, y, r, x, y, r + 12);
    glowGrad.addColorStop(0, "rgba(124,58,237,0.4)");
    glowGrad.addColorStop(1, "rgba(124,58,237,0)");
    ctx.fillStyle = glowGrad;
    ctx.fill();
  }

  // 投影阴影
  ctx.beginPath();
  ctx.ellipse(x + 2, y + r + 4, r * 0.8, r * 0.25, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fill();

  // 3D 球体径向渐变 (高光在左上)
  const highlightX = x - r * 0.3;
  const highlightY = y - r * 0.3;
  const gradient = ctx.createRadialGradient(highlightX, highlightY, r * 0.1, x, y, r);
  gradient.addColorStop(0, lightenColor(color, 1.6));       // 高光
  gradient.addColorStop(0.4, color);                         // 主色
  gradient.addColorStop(0.8, darkenColor(color, 0.5));      // 暗面
  gradient.addColorStop(1, darkenColor(color, 0.25));       // 边缘

  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();

  // 高光小白点
  ctx.beginPath();
  ctx.arc(highlightX, highlightY, r * 0.15, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.fill();

  // 进度弧线
  if (progress > 0 && progress < 1) {
    ctx.beginPath();
    ctx.arc(x, y, r + 3, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // 完成标记 (绿色勾)
  if (progress >= 1) {
    ctx.beginPath();
    ctx.arc(x, y, r + 3, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(34,197,94,0.8)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  ctx.restore();
}

/** 绘制时钟指针 */
export function drawClockHands(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  hours: number,
  minutes: number,
  seconds: number
): void {
  const hourAngle = ((hours % 12) + minutes / 60) * 30 * Math.PI / 180 - Math.PI / 2;
  const minuteAngle = (minutes + seconds / 60) * 6 * Math.PI / 180 - Math.PI / 2;
  const secondAngle = seconds * 6 * Math.PI / 180 - Math.PI / 2;

  // 时针
  drawHand(ctx, cx, cy, hourAngle, 50, 3, CLOCK_TICK_COLOR);
  // 分针
  drawHand(ctx, cx, cy, minuteAngle, 70, 2, CLOCK_TICK_COLOR);
  // 秒针
  drawHand(ctx, cx, cy, secondAngle, 75, 1, "#F5C518");

  // 中心点
  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fillStyle = "#F5C518";
  ctx.fill();
}

function drawHand(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  angle: number, length: number, width: number, color: string
): void {
  ctx.beginPath();
  ctx.moveTo(cx + Math.cos(angle + Math.PI / 2) * width / 2, cy + Math.sin(angle + Math.PI / 2) * width / 2);
  ctx.lineTo(cx + Math.cos(angle) * length, cy + Math.sin(angle) * length);
  ctx.lineTo(cx + Math.cos(angle - Math.PI / 2) * width / 2, cy + Math.sin(angle - Math.PI / 2) * width / 2);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

/** 行星点击检测 (平方距离) */
export function hitTestPlanet(
  x: number, y: number,
  planets: Planet[]
): Planet | null {
  // 反向遍历 (上层先命中)
  for (let i = planets.length - 1; i >= 0; i--) {
    const p = planets[i]!;
    const dx = x - p.x;
    const dy = y - p.y;
    if (dx * dx + dy * dy <= (p.radius + 6) * (p.radius + 6)) {
      return p;
    }
  }
  return null;
}
```

- [ ] **步骤 2：验证类型**

运行：`pnpm exec tsc --noEmit`
预期：无类型错误

---

### 任务 9：Canvas — 星云粒子 + 噪点纹理

**文件：**
- 修改：`src/components/orbital/orbital-engine.ts` (追加)
- 创建：`public/noise-texture.png` (占位 — 后续动态生成)

- [ ] **步骤 1：追加粒子系统到 orbital-engine.ts**

```typescript
// 追加到 src/components/orbital/orbital-engine.ts

import type { Particle } from "@/types/orbital";
import { PARTICLE_COUNT, PARTICLE_RADIUS_RANGE, NOISE_OPACITY } from "@/utils/constants";

/** 初始化星云粒子 */
export function createParticles(cx: number, cy: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const isAmber = i % 2 === 0;
    const angle = Math.random() * Math.PI * 2;
    const distance = PARTICLE_RADIUS_RANGE[0]! + Math.random() * (PARTICLE_RADIUS_RANGE[1]! - PARTICLE_RADIUS_RANGE[0]!);
    particles.push({
      x: cx + Math.cos(angle) * distance,
      y: cy + Math.sin(angle) * distance,
      radius: 0.5 + Math.random() * 1.5,
      opacity: 0.1 + Math.random() * 0.3,
      color: isAmber ? "#F5C518" : "#2962FF",
      angle,
      distance,
      speed: 0.001 + Math.random() * 0.003,
    });
  }
  return particles;
}

/** 更新粒子位置 (布朗漂移) */
export function updateParticles(particles: Particle[], cx: number, cy: number): void {
  for (const p of particles) {
    p.angle += p.speed;
    p.distance += (Math.random() - 0.5) * 2;
    p.distance = Math.max(PARTICLE_RADIUS_RANGE[0]!, Math.min(PARTICLE_RADIUS_RANGE[1]!, p.distance));
    p.x = cx + Math.cos(p.angle) * p.distance;
    p.y = cy + Math.sin(p.angle) * p.distance;
  }
}

/** 绘制粒子 */
export function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]): void {
  for (const p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.opacity;
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/** 绘制噪点纹理 (如果图片未加载则用Canvas动态生成) */
export function drawNoiseTexture(ctx: CanvasRenderingContext2D, noiseImage: HTMLImageElement | null, w: number, h: number): void {
  if (noiseImage && noiseImage.complete) {
    ctx.globalAlpha = NOISE_OPACITY;
    ctx.globalCompositeOperation = "overlay";
    ctx.drawImage(noiseImage, 0, 0, w, h);
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
  } else {
    // 动态生成噪点
    const imageData = ctx.createImageData(w, h);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const v = Math.random() * 255;
      imageData.data[i] = v;
      imageData.data[i + 1] = v;
      imageData.data[i + 2] = v;
      imageData.data[i + 3] = 255 * NOISE_OPACITY;
    }
    ctx.putImageData(imageData, 0, 0);
  }
}
```

- [ ] **步骤 2：动态生成噪点纹理 PNG**

```bash
# 在项目中创建简单的噪点纹理生成脚本 (可选，Canvas 动态生成已覆盖)
```

- [ ] **步骤 3：验证类型**

运行：`pnpm exec tsc --noEmit`
预期：无类型错误

---

### 任务 10：OrbitalClock 组件 (Canvas 容器 + RAF)

**文件：**
- 创建：`src/components/orbital/OrbitalClock.tsx`
- 创建：`src/hooks/useOrbital.ts`
- 创建：`src/hooks/useClock.ts`

- [ ] **步骤 1：编写 `src/hooks/useClock.ts`**

```typescript
// src/hooks/useClock.ts
"use client";

import { useState, useEffect } from "react";

export function useClock() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  return { time, hours, minutes, seconds };
}
```

- [ ] **步骤 2：编写 `src/hooks/useOrbital.ts`**

```typescript
// src/hooks/useOrbital.ts
"use client";

import { useRef, useEffect, useCallback } from "react";

export function useOrbital(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  draw: (ctx: CanvasRenderingContext2D, timestamp: number) => void
) {
  const rafRef = useRef<number>(0);

  const animate = useCallback(
    (timestamp: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      draw(ctx, timestamp);
      rafRef.current = requestAnimationFrame(animate);
    },
    [canvasRef, draw]
  );

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);
}
```

- [ ] **步骤 3：编写 `src/components/orbital/OrbitalClock.tsx`**

```typescript
// src/components/orbital/OrbitalClock.tsx
"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { useClock } from "@/hooks/useClock";
import { useOrbital } from "@/hooks/useOrbital";
import {
  createStaticLayer,
  computePlanets,
  drawPlanet,
  drawClockHands,
  createParticles,
  updateParticles,
  drawParticles,
  drawNoiseTexture,
  hitTestPlanet,
} from "./orbital-engine";
import type { Particle } from "@/types/orbital";
import { CANVAS_SIZE_BASE } from "@/utils/constants";

export default function OrbitalClock() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const staticLayerRef = useRef<OffscreenCanvas | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const noiseImgRef = useRef<HTMLImageElement | null>(null);
  const [hoveredPlanetId, setHoveredPlanetId] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState(CANVAS_SIZE_BASE.w);

  const { state, dispatch } = useAppContext();
  const { hours, minutes, seconds } = useClock();

  // 初始化静态层
  useEffect(() => {
    const clockRadius = canvasSize * 0.38;
    const oc = createStaticLayer(canvasSize, clockRadius);
    staticLayerRef.current = oc;
  }, [canvasSize]);

  // 初始化粒子
  useEffect(() => {
    particlesRef.current = createParticles(canvasSize / 2, canvasSize / 2);
  }, [canvasSize]);

  // 加载噪点纹理
  useEffect(() => {
    const img = new Image();
    img.src = "/noise-texture.png";
    img.onload = () => { noiseImgRef.current = img; };
  }, []);

  // 响应式 Canvas 尺寸
  useEffect(() => {
    const updateSize = () => {
      const size = Math.min(window.innerWidth * 0.45, window.innerHeight * 0.55);
      setCanvasSize(Math.floor(size));
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // HiDPI 适配
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasSize * dpr;
    canvas.height = canvasSize * dpr;
    canvas.style.width = `${canvasSize}px`;
    canvas.style.height = `${canvasSize}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
  }, [canvasSize]);

  // 行星点击
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const tasks = state.tasks[state.currentDate] || [];
      const filtered = state.activeFilter === "all"
        ? tasks
        : tasks.filter((t) => t.type === state.activeFilter);
      const planets = computePlanets(filtered, canvasSize / 2, canvasSize / 2);
      const hit = hitTestPlanet(x, y, planets);
      if (hit) {
        dispatch({ type: "SELECT_TASK", payload: hit.taskId });
      }
    },
    [state, dispatch, canvasSize]
  );

  // 渲染循环
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, _timestamp: number) => {
      const cx = canvasSize / 2;
      const cy = canvasSize / 2;

      ctx.clearRect(0, 0, canvasSize, canvasSize);

      // 绘制静态层
      if (staticLayerRef.current) {
        ctx.drawImage(staticLayerRef.current, 0, 0);
      }

      // 更新 + 绘制粒子
      updateParticles(particlesRef.current, cx, cy);
      drawParticles(ctx, particlesRef.current);

      // 绘制行星
      const tasks = state.tasks[state.currentDate] || [];
      const filtered = state.activeFilter === "all"
        ? tasks
        : tasks.filter((t) => t.type === state.activeFilter);
      const planets = computePlanets(filtered, cx, cy);
      for (const planet of planets) {
        const isSelected = planet.taskId === state.selectedTaskId;
        const isHovered = planet.taskId === hoveredPlanetId;
        drawPlanet(ctx, planet, isSelected, isHovered);
      }

      // 绘制噪点
      drawNoiseTexture(ctx, noiseImgRef.current, canvasSize, canvasSize);

      // 绘制时钟指针
      drawClockHands(ctx, cx, cy, hours, minutes, seconds);
    },
    [state, hoveredPlanetId, canvasSize, hours, minutes, seconds]
  );

  useOrbital(canvasRef, draw);

  return (
    <canvas
      ref={canvasRef}
      onClick={handleCanvasClick}
      style={{ cursor: "none" }}
    />
  );
}
```

- [ ] **步骤 4：集成到 page.tsx**

在 page.tsx 中将 Canvas 占位替换为 `<OrbitalClock />`

- [ ] **步骤 5：验证渲染**

运行：`pnpm dev`
预期：看到轨道环、3D 表盘、时钟指针移动、粒子漂移。控制台无错误。

---

### 任务 11：布局组件 (GeometricBg + TitleHeader + LegendBar + AuxInfo)

**文件：**
- 创建：`src/components/layout/GeometricBg.tsx`
- 创建：`src/components/layout/TitleHeader.tsx`
- 创建：`src/components/layout/LegendBar.tsx`
- 创建：`src/components/layout/LegendItem.tsx`
- 创建：`src/components/layout/AuxInfo.tsx`

- [ ] **步骤 1：编写 `src/components/layout/GeometricBg.tsx`**

```typescript
// src/components/layout/GeometricBg.tsx
export default function GeometricBg() {
  return (
    <div
      className="fixed inset-0 -z-10"
      style={{
        background: `linear-gradient(135deg, #020208 0% 55%, #F0F0F0 55% 100%)`,
      }}
    >
      {/* 切割线虹彩色散光晕 */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          background: `conic-gradient(from 315deg at 55%, oklch(0.7 0.25 265), oklch(0.8 0.22 100), oklch(0.65 0.2 180), oklch(0.7 0.25 265))`,
        }}
      />
    </div>
  );
}
```

- [ ] **步骤 2：编写 `src/components/layout/TitleHeader.tsx`**

```typescript
// src/components/layout/TitleHeader.tsx
import { useAppContext } from "@/context/AppContext";
import { formatDateCN, getDayOfWeekCN } from "@/utils/time";

export default function TitleHeader() {
  const { state } = useAppContext();

  return (
    <header className="absolute right-[5vw] top-[5vh] text-right">
      {/* Ghost文字 (文字层叠) */}
      <span
        className="absolute top-0 right-0 font-display text-[clamp(3rem,8vw,6rem)] leading-none opacity-[0.04] select-none"
        style={{ transform: "translate(8px, -8px)", mixBlendMode: "difference" as const }}
        aria-hidden="true"
      >
        ORBIT·AN
      </span>

      <h1 className="font-display text-[clamp(3rem,8vw,6rem)] leading-none tracking-tighter text-cosmic-white title-chromatic">
        ORBIT·AN
      </h1>
      <p className="font-display text-[clamp(1rem,2vw,1.5rem)] text-cosmic-violet mt-1 tracking-wide">
        轨道计划
      </p>

      <div className="mt-3 flex items-center justify-end gap-3 font-mono text-cosmic-white/70 text-sm">
        <span>{formatDateCN(state.currentDate)}</span>
        <span className="text-cosmic-white/40">·</span>
        <span>{getDayOfWeekCN(state.currentDate)}</span>
      </div>
    </header>
  );
}
```

- [ ] **步骤 3：编写 `src/components/layout/LegendItem.tsx`**

```typescript
// src/components/layout/LegendItem.tsx
import type { TaskType } from "@/types/task";
import { TASK_TYPE_LABELS } from "@/types/task";

interface LegendItemProps {
  type: TaskType;
  color: string;
  isActive: boolean;
  onClick: () => void;
}

export default function LegendItem({ type, color, isActive, onClick }: LegendItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-full font-body text-sm transition-all duration-300
        ${isActive ? "scale-105" : "opacity-50 hover:opacity-75"}
      `}
      style={{
        borderBottom: isActive ? `2px solid ${color}` : "2px solid transparent",
      }}
    >
      <span
        className={`inline-block w-2.5 h-2.5 rounded-full transition-all duration-300 ${
          isActive ? "scale-125 animate-pulse" : ""
        }`}
        style={{ backgroundColor: color }}
      />
      <span className={isActive ? "font-bold" : ""}>
        {TASK_TYPE_LABELS[type]}
      </span>
    </button>
  );
}
```

- [ ] **步骤 4：编写 `src/components/layout/LegendBar.tsx`**

```typescript
// src/components/layout/LegendBar.tsx
import { useAppContext } from "@/context/AppContext";
import { TASK_TYPES, TASK_TYPE_COLORS_HEX, type TaskType } from "@/types/task";
import LegendItem from "./LegendItem";

export default function LegendBar() {
  const { state, dispatch } = useAppContext();

  return (
    <div className="absolute right-[5vw] bottom-[5vh] flex items-center gap-1">
      <button
        onClick={() => dispatch({ type: "SET_FILTER", payload: "all" })}
        className={`px-3 py-1.5 rounded-full font-body text-sm transition-all duration-300 ${
          state.activeFilter === "all"
            ? "font-bold border-b-2 border-cosmic-violet text-cosmic-white"
            : "opacity-50 text-cosmic-white/60 hover:opacity-75"
        }`}
      >
        全部
      </button>
      {TASK_TYPES.map((type) => (
        <LegendItem
          key={type}
          type={type}
          color={TASK_TYPE_COLORS_HEX[type]}
          isActive={state.activeFilter === type}
          onClick={() => dispatch({ type: "SET_FILTER", payload: type })}
        />
      ))}
    </div>
  );
}
```

- [ ] **步骤 5：编写 `src/components/layout/AuxInfo.tsx`**

```typescript
// src/components/layout/AuxInfo.tsx
import { useAppContext } from "@/context/AppContext";

export default function AuxInfo() {
  const { state } = useAppContext();
  const todayTasks = state.tasks[state.currentDate] || [];
  const completed = todayTasks.filter((t) => t.completed).length;
  const total = todayTasks.length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="absolute left-[5vw] bottom-[5vh] font-mono text-sm text-cosmic-white/50">
      <p>
        完成率 <span className="text-cosmic-violet font-bold">{completionRate}%</span>
        {" "}({completed}/{total})
      </p>
    </div>
  );
}
```

- [ ] **步骤 6：集成到 page.tsx**

替换 page.tsx 中所有占位内容为实际组件。

- [ ] **步骤 7：验证渲染**

运行：`pnpm dev`
预期：看到完整页面布局 — TitleHeader (大字 + 日期) / LegendBar (4类型筛选 + 全部) / AuxInfo (完成率)

---

### Phase 3: 日程功能

### 任务 12：ScheduleList + ScheduleItem 组件

**文件：**
- 创建：`src/components/schedule/ScheduleList.tsx`
- 创建：`src/components/schedule/ScheduleItem.tsx`
- 创建：`src/components/ui/ColorDot.tsx`

- [ ] **步骤 1：编写 `src/components/ui/ColorDot.tsx`**

```typescript
// src/components/ui/ColorDot.tsx
import { TASK_TYPE_COLORS_OKLCH, type TaskType } from "@/types/task";

export default function ColorDot({ type }: { type: TaskType }) {
  return (
    <span
      className="inline-block w-3 h-3 rounded-full flex-shrink-0"
      style={{ backgroundColor: TASK_TYPE_COLORS_OKLCH[type] }}
    />
  );
}
```

- [ ] **步骤 2：编写 `src/components/schedule/ScheduleItem.tsx`**

```typescript
// src/components/schedule/ScheduleItem.tsx
import type { Task } from "@/types/task";
import ColorDot from "@/components/ui/ColorDot";

interface ScheduleItemProps {
  task: Task;
  isSelected: boolean;
  isFiltered: boolean;
  onSelect: () => void;
  onProgressChange: (progress: number) => void;
}

export default function ScheduleItem({
  task,
  isSelected,
  isFiltered,
  onSelect,
}: ScheduleItemProps) {
  return (
    <div
      onClick={onSelect}
      className={`
        flex items-center gap-3 py-2.5 px-3 rounded-lg cursor-pointer transition-all duration-300
        ${isSelected ? "bg-white/10" : "hover:bg-white/5"}
        ${isFiltered ? "opacity-30 scale-95" : ""}
      `}
    >
      <ColorDot type={task.type} />
      <span className="font-mono text-xs text-cosmic-white/60 w-12">{task.time}</span>
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm text-cosmic-white truncate">{task.name}</p>
        {task.nameEn && (
          <p className="font-body text-xs text-cosmic-white/40 truncate">{task.nameEn}</p>
        )}
      </div>
    </div>
  );
}
```

- [ ] **步骤 3：编写 `src/components/schedule/ScheduleList.tsx`**

```typescript
// src/components/schedule/ScheduleList.tsx
import { useRef, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import ScheduleItem from "./ScheduleItem";

export default function ScheduleList() {
  const { state, dispatch } = useAppContext();
  const listRef = useRef<HTMLDivElement>(null);

  const tasks = state.tasks[state.currentDate] || [];
  const filtered = state.activeFilter === "all"
    ? tasks
    : tasks.filter((t) => t.type === state.activeFilter);

  // 排序: 时间升序
  const sorted = [...filtered].sort((a, b) => a.time.localeCompare(b.time));

  // 选中任务自动滚动
  useEffect(() => {
    if (state.selectedTaskId && listRef.current) {
      const el = listRef.current.querySelector(`[data-task-id="${state.selectedTaskId}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [state.selectedTaskId]);

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-cosmic-white/30">
        <p className="font-display text-lg mb-2">今日暂无任务</p>
        <button
          onClick={() => dispatch({ type: "OPEN_EDIT", payload: null })}
          className="text-sm text-cosmic-violet hover:text-cosmic-violet/80 transition-colors"
        >
          + 添加新任务
        </button>
      </div>
    );
  }

  return (
    <div ref={listRef} className="space-y-0.5 overflow-y-auto pr-2">
      {sorted.map((task) => (
        <div key={task.id} data-task-id={task.id}>
          <ScheduleItem
            task={task}
            isSelected={task.id === state.selectedTaskId}
            isFiltered={false}
            onSelect={() => dispatch({ type: "SELECT_TASK", payload: task.id })}
            onProgressChange={(p) => dispatch({
              type: "UPDATE_PROGRESS",
              payload: { date: state.currentDate, taskId: task.id, progress: p },
            })}
          />
        </div>
      ))}
    </div>
  );
}
```

- [ ] **步骤 4：集成到 page.tsx**

替换 ScheduleList 占位为 `<ScheduleList />`

- [ ] **步骤 5：测试数据**

创建 `src/data/sample-tasks.ts` 并为今天生成几条测试任务，验证列表渲染。

---

### 任务 13：ProgressBar + TaskDetail 组件

**文件：**
- 创建：`src/components/schedule/ProgressBar.tsx`
- 创建：`src/components/schedule/TaskDetail.tsx`

- [ ] **步骤 1：编写 `src/components/schedule/ProgressBar.tsx`**

```typescript
// src/components/schedule/ProgressBar.tsx
"use client";

import { useRef, useCallback } from "react";

interface ProgressBarProps {
  progress: number;
  color: string;
  onChange: (newProgress: number) => void;
}

export default function ProgressBar({ progress, color, onChange }: ProgressBarProps) {
  const barRef = useRef<HTMLDivElement>(null);

  const updateFromMouse = useCallback(
    (e: React.MouseEvent) => {
      const bar = barRef.current;
      if (!bar) return;
      const rect = bar.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      // 临近0/1时吸附
      const snapped = ratio < 0.03 ? 0 : ratio > 0.97 ? 1 : ratio;
      onChange(snapped);
    },
    [onChange]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      updateFromMouse(e);
      const handleMove = (ev: MouseEvent) => {
        const bar = barRef.current;
        if (!bar) return;
        const rect = bar.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
        const snapped = ratio < 0.03 ? 0 : ratio > 0.97 ? 1 : ratio;
        onChange(snapped);
      };
      const handleUp = () => {
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleUp);
      };
      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleUp);
    },
    [updateFromMouse, onChange]
  );

  return (
    <div
      ref={barRef}
      className="relative w-full h-1.5 rounded-full cursor-pointer"
      style={{ backgroundColor: `${color}33` }}
      onMouseDown={handleMouseDown}
    >
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-75"
        style={{ width: `${progress * 100}%`, backgroundColor: color }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 shadow-md transition-[left] duration-75"
        style={{
          left: `calc(${progress * 100}% - 6px)`,
          backgroundColor: color,
          borderColor: color,
        }}
      />
    </div>
  );
}
```

- [ ] **步骤 2：编写 `src/components/schedule/TaskDetail.tsx`**

```typescript
// src/components/schedule/TaskDetail.tsx
import type { Task } from "@/types/task";
import ProgressBar from "./ProgressBar";
import { TASK_TYPE_COLORS_HEX, TASK_TYPE_LABELS, type TaskType } from "@/types/task";
import { useAppContext } from "@/context/AppContext";

interface TaskDetailProps {
  task: Task;
}

export default function TaskDetail({ task }: TaskDetailProps) {
  const { dispatch } = useAppContext();

  return (
    <div
      className="overflow-hidden transition-all duration-300"
      style={{ maxHeight: "200px" }}
    >
      <div className="px-3 pb-3 pt-1 space-y-2">
        {/* 进度条 */}
        <ProgressBar
          progress={task.progress}
          color={TASK_TYPE_COLORS_HEX[task.type]}
          onChange={(p) => dispatch({
            type: "UPDATE_PROGRESS",
            payload: { date: useAppContext().state.currentDate, taskId: task.id, progress: p },
          })}
        />

        {/* 元数据 */}
        <div className="flex gap-4 text-xs text-cosmic-white/50 font-body">
          <span>时长: {task.duration}分钟</span>
          <span>类型: {TASK_TYPE_LABELS[task.type]}</span>
        </div>

        {/* 备注 */}
        {task.note && (
          <p className="text-xs text-cosmic-white/60 font-body">{task.note}</p>
        )}

        {/* 操作 */}
        <div className="flex gap-3">
          <button
            onClick={() => dispatch({ type: "OPEN_EDIT", payload: task.id })}
            className="text-xs text-cosmic-violet hover:underline"
          >
            编辑
          </button>
          <button
            onClick={() => dispatch({ type: "SHOW_DELETE_CONFIRM", payload: task.id })}
            className="text-xs text-red-400 hover:underline"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **步骤 3：集成 ProgressBar 和 TaskDetail 到 ScheduleItem**

更新 ScheduleItem 组件，在选中时展开 TaskDetail。

- [ ] **步骤 4：验证功能**

运行：`pnpm dev`，添加测试任务后验证进度条拖拽、详情展开/收起功能。

---

### 任务 14：EditPanel + TaskForm 组件

**文件：**
- 创建：`src/components/editor/EditPanel.tsx`
- 创建：`src/components/editor/TaskForm.tsx`
- 创建：`src/components/editor/DeleteConfirm.tsx`

- [ ] **步骤 1：编写 `src/components/editor/TaskForm.tsx`**

```typescript
// src/components/editor/TaskForm.tsx
"use client";

import { useState } from "react";
import type { Task, TaskType } from "@/types/task";
import { TASK_TYPES, TASK_TYPE_LABELS } from "@/types/task";

interface TaskFormProps {
  initial?: Task | null;
  onSubmit: (task: Task) => void;
  onCancel: () => void;
}

export default function TaskForm({ initial, onSubmit, onCancel }: TaskFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [nameEn, setNameEn] = useState(initial?.nameEn ?? "");
  const [type, setType] = useState<TaskType>(initial?.type ?? "work");
  const [time, setTime] = useState(initial?.time ?? "09:00");
  const [duration, setDuration] = useState(initial?.duration ?? 60);
  const [note, setNote] = useState(initial?.note ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const task: Task = {
      id: initial?.id ?? `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type,
      name: name.trim(),
      nameEn: nameEn.trim(),
      time,
      duration,
      progress: initial?.progress ?? 0,
      completed: initial?.completed ?? false,
      note: note.trim(),
      createdAt: initial?.createdAt ?? Date.now(),
    };
    onSubmit(task);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="font-display text-xl text-cosmic-white">
        {initial ? "编辑任务" : "新增任务"}
      </h2>

      {/* 任务名称 */}
      <div>
        <label className="block text-xs text-cosmic-white/50 mb-1">任务名称</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="任务名称"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-cosmic-white placeholder-cosmic-white/30 focus:outline-none focus:border-cosmic-violet"
          autoFocus
        />
      </div>

      {/* 英文名称 */}
      <div>
        <label className="block text-xs text-cosmic-white/50 mb-1">英文名称</label>
        <input
          type="text"
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
          placeholder="English name"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-cosmic-white placeholder-cosmic-white/30 focus:outline-none focus:border-cosmic-violet"
        />
      </div>

      {/* 任务类型 */}
      <div>
        <label className="block text-xs text-cosmic-white/50 mb-1">类型</label>
        <div className="flex gap-2">
          {TASK_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                type === t
                  ? "bg-cosmic-violet/20 text-cosmic-violet border border-cosmic-violet/50"
                  : "bg-white/5 text-cosmic-white/50 border border-white/10 hover:bg-white/10"
              }`}
            >
              {TASK_TYPE_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      {/* 时间 + 时长 */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs text-cosmic-white/50 mb-1">时间</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-cosmic-white focus:outline-none focus:border-cosmic-violet"
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs text-cosmic-white/50 mb-1">时长 (分钟)</label>
          <input
            type="number"
            min={5}
            max={480}
            step={5}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-cosmic-white focus:outline-none focus:border-cosmic-violet"
          />
        </div>
      </div>

      {/* 备注 */}
      <div>
        <label className="block text-xs text-cosmic-white/50 mb-1">备注</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="备注信息..."
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-cosmic-white placeholder-cosmic-white/30 focus:outline-none focus:border-cosmic-violet resize-none"
        />
      </div>

      {/* 按钮 */}
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-cosmic-white/50 hover:text-cosmic-white transition-colors"
        >
          取消
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-cosmic-violet text-white rounded-lg text-sm hover:bg-cosmic-violet/80 transition-colors"
        >
          {initial ? "保存" : "创建"}
        </button>
      </div>
    </form>
  );
}
```

- [ ] **步骤 2：编写 `src/components/editor/EditPanel.tsx`**

```typescript
// src/components/editor/EditPanel.tsx
"use client";

import { useAppContext } from "@/context/AppContext";
import TaskForm from "./TaskForm";
import DeleteConfirm from "./DeleteConfirm";
import type { Task } from "@/types/task";
import { EDIT_PANEL_DURATION, EDIT_PANEL_EASING } from "@/utils/constants";

export default function EditPanel() {
  const { state, dispatch } = useAppContext();

  if (!state.editPanelOpen) return null;

  const editingTask = state.editingTaskId
    ? (state.tasks[state.currentDate] || []).find((t) => t.id === state.editingTaskId) ?? null
    : null;

  const handleSubmit = (task: Task) => {
    if (editingTask) {
      dispatch({ type: "UPDATE_TASK", payload: { date: state.currentDate, task } });
    } else {
      dispatch({ type: "ADD_TASK", payload: { date: state.currentDate, task } });
    }
  };

  const handleCancel = () => {
    dispatch({ type: "CLOSE_EDIT" });
  };

  return (
    <>
      {/* 遮罩 */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={handleCancel}
      />

      {/* 面板 */}
      <div
        className="fixed right-0 top-0 h-full w-[420px] z-50 overflow-y-auto"
        style={{
          background: "linear-gradient(180deg, rgba(2,2,8,0.95), rgba(20,20,40,0.95))",
          borderLeft: "1px solid rgba(124,58,237,0.2)",
          backdropFilter: "blur(20px)",
          animation: `slide-in-right ${EDIT_PANEL_DURATION}ms ${EDIT_PANEL_EASING}`,
          boxShadow: "-4px 0 30px rgba(0,0,0,0.5)",
        }}
      >
        <div className="p-6">
          <TaskForm
            initial={editingTask}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>

      {/* 删除确认 */}
      {state.deleteConfirmId && (
        <DeleteConfirm
          taskId={state.deleteConfirmId}
          onConfirm={() => {
            dispatch({
              type: "DELETE_TASK",
              payload: { date: state.currentDate, taskId: state.deleteConfirmId! },
            });
          }}
          onCancel={() => dispatch({ type: "SHOW_DELETE_CONFIRM", payload: null })}
        />
      )}
    </>
  );
}
```

- [ ] **步骤 3：编写 `src/components/editor/DeleteConfirm.tsx`**

```typescript
// src/components/editor/DeleteConfirm.tsx
interface DeleteConfirmProps {
  taskId: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirm({ onConfirm, onCancel }: DeleteConfirmProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center">
      <div className="bg-[#0a0a0f] border border-white/10 rounded-xl p-6 max-w-sm mx-4">
        <p className="text-cosmic-white mb-4">确定要删除这个任务吗？此操作不可撤销。</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-cosmic-white/50 hover:text-cosmic-white"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **步骤 4：集成到 page.tsx 并验证**

将 `<EditPanel />` 添加到 page.tsx。运行 `pnpm dev`，点击列表项右侧的编辑按钮，验证表单打开/提交功能。

---

### Phase 4: 辅助功能

### 任务 15：日期导航 + MiniOrbitPreview

**文件：**
- 创建：`src/hooks/useDateNavigation.ts`
- 创建：`src/components/schedule/MiniOrbitPreview.tsx`

- [ ] **步骤 1：编写 `src/hooks/useDateNavigation.ts`**

```typescript
// src/hooks/useDateNavigation.ts
"use client";

import { useCallback } from "react";
import { useAppContext } from "@/context/AppContext";

export function useDateNavigation() {
  const { state, dispatch } = useAppContext();

  const goToPrevDay = useCallback(() => {
    const d = new Date(state.currentDate);
    d.setDate(d.getDate() - 1);
    dispatch({ type: "SET_DATE", payload: d.toISOString().slice(0, 10) });
  }, [state.currentDate, dispatch]);

  const goToNextDay = useCallback(() => {
    const d = new Date(state.currentDate);
    d.setDate(d.getDate() + 1);
    dispatch({ type: "SET_DATE", payload: d.toISOString().slice(0, 10) });
  }, [state.currentDate, dispatch]);

  const goToToday = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10);
    dispatch({ type: "SET_DATE", payload: today });
  }, [dispatch]);

  return { goToPrevDay, goToNextDay, goToToday };
}
```

- [ ] **步骤 2：创建 MiniOrbitPreview.tsx**

```typescript
// src/components/schedule/MiniOrbitPreview.tsx
"use client";

import { useRef, useEffect } from "react";

export default function MiniOrbitPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const size = 80;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;

    // 迷你轨道环
    [22, 32].forEach((r) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 0.5;
      ctx.stroke();
    });
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="rounded-full border border-white/5"
      style={{ width: 80, height: 80 }}
    />
  );
}
```

- [ ] **步骤 3：在 TitleHeader 或 page.tsx 中添加日期导航控件**

```tsx
<div className="flex items-center gap-4">
  <button onClick={goToPrevDay} className="text-lg">&larr;</button>
  <button onClick={goToToday}>今</button>
  <button onClick={goToNextDay} className="text-lg">&rarr;</button>
</div>
```

---

### 任务 16：键盘快捷键

**文件：**
- 创建：`src/hooks/useKeyboard.ts`

- [ ] **步骤 1：编写 `src/hooks/useKeyboard.ts`**

```typescript
// src/hooks/useKeyboard.ts
"use client";

import { useEffect } from "react";
import { useAppContext } from "@/context/AppContext";

export function useKeyboard() {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // 在输入框中忽略快捷键
      const target = e.target as HTMLElement;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;

      switch (e.key) {
        case "Escape":
          if (state.editPanelOpen) dispatch({ type: "CLOSE_EDIT" });
          else if (state.deleteConfirmId) dispatch({ type: "SHOW_DELETE_CONFIRM", payload: null });
          else if (state.activeFilter !== "all") dispatch({ type: "SET_FILTER", payload: "all" });
          else if (state.orbitMode) dispatch({ type: "TOGGLE_ORBIT_MODE" });
          else dispatch({ type: "SELECT_TASK", payload: null });
          break;
        case "n":
        case "N":
          if (!state.editPanelOpen && !state.orbitMode) dispatch({ type: "OPEN_EDIT", payload: null });
          break;
        case "ArrowLeft":
          e.preventDefault();
          { const d = new Date(state.currentDate); d.setDate(d.getDate() - 1); dispatch({ type: "SET_DATE", payload: d.toISOString().slice(0, 10) }); }
          break;
        case "ArrowRight":
          e.preventDefault();
          { const d = new Date(state.currentDate); d.setDate(d.getDate() + 1); dispatch({ type: "SET_DATE", payload: d.toISOString().slice(0, 10) }); }
          break;
        case "t":
        case "T":
          if (!state.editPanelOpen) {
            dispatch({ type: "SET_DATE", payload: new Date().toISOString().slice(0, 10) });
          }
          break;
        case "o":
        case "O":
          dispatch({ type: "TOGGLE_ORBIT_MODE" });
          break;
        case "1": dispatch({ type: "SET_FILTER", payload: "work" }); break;
        case "2": dispatch({ type: "SET_FILTER", payload: "study" }); break;
        case "3": dispatch({ type: "SET_FILTER", payload: "meeting" }); break;
        case "4": dispatch({ type: "SET_FILTER", payload: "personal" }); break;
        case "0": dispatch({ type: "SET_FILTER", payload: "all" }); break;
        case "Delete":
          if (state.selectedTaskId && !state.editPanelOpen) {
            dispatch({ type: "SHOW_DELETE_CONFIRM", payload: state.selectedTaskId });
          }
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [state, dispatch]);
}
```

- [ ] **步骤 2：在 layout.tsx 或 page.tsx 中调用 useKeyboard()**

```typescript
// 在 page.tsx 中添加
import { useKeyboard } from "@/hooks/useKeyboard";
// ...
useKeyboard();
```

- [ ] **步骤 3：验证快捷键**

运行 `pnpm dev`，测试 Esc / N / ← → / T / 1-4 / O 按键响应。

---

### 任务 17：页面入场动画

**文件：**
- 修改：`src/app/page.tsx` (添加 staggered 入场动画)
- 修改：`src/app/globals.css` (已有关键帧)

- [ ] **步骤 1：在 page.tsx 中添加 staggered 入场延迟**

给每个区域添加 `fade-up` 类 + 内联延迟：

```tsx
<div style={{ animationDelay: "0ms" }} className="fade-up">TitleHeader</div>
<div style={{ animationDelay: "100ms" }} className="fade-up">LegendBar</div>
<div style={{ animationDelay: "200ms" }} className="fade-up">OrbitalClock</div>
<div style={{ animationDelay: "400ms" }} className="fade-up">ScheduleList</div>
<div style={{ animationDelay: "500ms" }} className="fade-up">AuxInfo</div>
```

- [ ] **步骤 2：验证动画**

刷新页面，确认各区域依次淡入。

---

### 任务 18：自定义轨道光标

**文件：**
- 创建：`src/components/ui/OrbitalCursor.tsx`

- [ ] **步骤 1：编写 `src/components/ui/OrbitalCursor.tsx`**

```typescript
// src/components/ui/OrbitalCursor.tsx
"use client";

import { useEffect, useRef, useState } from "react";

export default function OrbitalCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    let rafId: number;
    const animate = () => {
      const outer = outerRef.current;
      const inner = innerRef.current;
      if (!outer || !inner) { rafId = requestAnimationFrame(animate); return; }

      // 外层环: 慢速 lerp
      const dx = targetRef.current.x - pos.x;
      const dy = targetRef.current.y - pos.y;
      const newX = pos.x + dx * 0.08;
      const newY = pos.y + dy * 0.08;

      setPos({ x: newX, y: newY });
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [pos]);

  return (
    <>
      {/* 外层轨道环 */}
      <div
        ref={outerRef}
        className="custom-cursor cursor-outer-ring fixed pointer-events-none z-[9999]"
        style={{
          left: pos.x - 20,
          top: pos.y - 20,
        }}
      />
      {/* 内层点 */}
      <div
        ref={innerRef}
        className="cursor-inner-dot fixed pointer-events-none z-[9999]"
        style={{
          left: targetRef.current.x - 4,
          top: targetRef.current.y - 4,
        }}
      />
    </>
  );
}
```

- [ ] **步骤 2：集成到 layout.tsx**

```tsx
import OrbitalCursor from "@/components/ui/OrbitalCursor";
// ...
<OrbitalCursor />
```

- [ ] **步骤 3：验证光标**

运行 `pnpm dev`，确认自定义光标 (双层环) 替换了原生光标。

---

### 任务 19：示例数据

**文件：**
- 创建：`src/data/sample-tasks.ts`

- [ ] **步骤 1：编写 `src/data/sample-tasks.ts`**

```typescript
// src/data/sample-tasks.ts
import type { Task } from "@/types/task";
import { getTodayStr } from "@/utils/time";

export function generateSampleTasks(): Record<string, Task[]> {
  const today = getTodayStr();

  const tasks: Task[] = [
    {
      id: "sample_1", type: "work", name: "项目架构评审", nameEn: "Architecture Review",
      time: "09:00", duration: 90, progress: 0.3, completed: false,
      note: "评审OrbitAN前端架构", createdAt: Date.now(),
    },
    {
      id: "sample_2", type: "study", name: "React 19 新特性", nameEn: "React 19 Features",
      time: "11:00", duration: 60, progress: 0, completed: false,
      note: "学习 Server Components 和 Actions", createdAt: Date.now(),
    },
    {
      id: "sample_3", type: "meeting", name: "周会", nameEn: "Weekly Sync",
      time: "14:00", duration: 45, progress: 0, completed: false,
      note: "", createdAt: Date.now(),
    },
    {
      id: "sample_4", type: "work", name: "编写单元测试", nameEn: "Unit Tests",
      time: "15:00", duration: 120, progress: 0.7, completed: false,
      note: "覆盖率目标 80%", createdAt: Date.now(),
    },
    {
      id: "sample_5", type: "personal", name: "健身", nameEn: "Workout",
      time: "18:00", duration: 60, progress: 0, completed: false,
      note: "力量训练", createdAt: Date.now(),
    },
  ];

  return { [today]: tasks };
}
```

- [ ] **步骤 2：在 AppContext 初始化时加载示例数据**

修改 `AppContext.tsx`，当 localStorage 为空时加载示例任务。

```typescript
useEffect(() => {
  const data = loadStorage();
  const tasks = Object.keys(data.tasks).length > 0 ? data.tasks : generateSampleTasks();
  dispatch({ type: "INIT", payload: { tasks, focusBlocks: data.focusBlocks } });
}, []);
```

---

### Phase 5: Orbit Mode

### 任务 20：液态玻璃层 + 事件视界动画

**文件：**
- 创建：`src/components/orbit-mode/LiquidGlass.tsx`

- [ ] **步骤 1：编写 `src/components/orbit-mode/LiquidGlass.tsx`**

```typescript
// src/components/orbit-mode/LiquidGlass.tsx
"use client";

import { useEffect, useState } from "react";

interface LiquidGlassProps {
  isOpen: boolean;
  onAnimationEnd: () => void;
}

export default function LiquidGlass({ isOpen, onAnimationEnd }: LiquidGlassProps) {
  const [phase, setPhase] = useState<"idle" | "expanding" | "stable">("idle");

  useEffect(() => {
    if (isOpen) {
      setPhase("expanding");
      const timer = setTimeout(() => {
        setPhase("stable");
        onAnimationEnd();
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setPhase("idle");
    }
  }, [isOpen, onAnimationEnd]);

  if (phase === "idle") return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      style={{
        animation: phase === "expanding"
          ? "event-horizon-expand 800ms cubic-bezier(0.4, 0, 0.2, 1) forwards"
          : "none",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        background: "linear-gradient(135deg, rgba(2,2,8,0.85), rgba(20,20,40,0.75))",
      }}
    >
      {/* SVG gooey滤镜 */}
      <svg className="absolute inset-0 w-0 h-0">
        <defs>
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
              result="goo"
            />
          </filter>
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.15 0" />
            <feBlend in="SourceGraphic" mode="overlay" />
          </filter>
        </defs>
      </svg>

      {/* 液态玻璃纹理叠加 */}
      <div
        className="absolute inset-0"
        style={{ filter: "url(#noise)" }}
      />
    </div>
  );
}
```

- [ ] **步骤 2：创建 OrbitModeOverlay 容器**

见下一任务。

---

### 任务 21：OrbitModeOverlay 容器 + 周视图

**文件：**
- 创建：`src/components/orbit-mode/OrbitModeOverlay.tsx`
- 创建：`src/components/orbit-mode/WeekTimeline.tsx`
- 创建：`src/components/orbit-mode/TimeSlotColumn.tsx`
- 创建：`src/hooks/useWeekView.ts`

- [ ] **步骤 1：编写 `src/hooks/useWeekView.ts`**

```typescript
// src/hooks/useWeekView.ts
"use client";

import { useMemo } from "react";
import { getWeekStart } from "@/utils/time";

export function useWeekView(currentDate: string) {
  return useMemo(() => {
    const monday = getWeekStart(currentDate);
    const days: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push(d.toISOString().slice(0, 10));
    }
    return days;
  }, [currentDate]);
}
```

- [ ] **步骤 2：编写 `src/components/orbit-mode/WeekTimeline.tsx`**

```typescript
// src/components/orbit-mode/WeekTimeline.tsx
"use client";

import { useAppContext } from "@/context/AppContext";
import { useWeekView } from "@/hooks/useWeekView";

export default function WeekTimeline() {
  const { state } = useAppContext();
  const weekDays = useWeekView(state.currentDate);

  const dayLabels = ["一", "二", "三", "四", "五", "六", "日"];

  return (
    <div className="flex-1 grid grid-cols-7 gap-2 overflow-auto p-6">
      {weekDays.map((date, i) => {
        const isToday = date === new Date().toISOString().slice(0, 10);
        const tasks = state.tasks[date] || [];

        return (
          <div
            key={date}
            className={`rounded-xl p-3 min-h-[200px] ${
              isToday ? "bg-cosmic-violet/10 border border-cosmic-violet/30" : "bg-white/[0.03] border border-white/5"
            }`}
          >
            <div className="text-center mb-3">
              <p className={`text-xs ${isToday ? "text-cosmic-violet" : "text-cosmic-white/50"}`}>
                周{dayLabels[i]}
              </p>
              <p className={`text-sm font-mono ${isToday ? "text-cosmic-violet" : "text-cosmic-white/70"}`}>
                {date.slice(5)}
              </p>
            </div>
            <div className="space-y-1.5">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="text-xs px-2 py-1 rounded"
                  style={{ backgroundColor: `${task.type === "work" ? "#2962FF" : task.type === "study" ? "#F5C518" : task.type === "meeting" ? "#2D3748" : "#6B7280"}33` }}
                >
                  <span className="truncate block text-cosmic-white/80">{task.name}</span>
                  <span className="text-cosmic-white/40 font-mono">{task.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}
```

- [ ] **步骤 3：编写 `src/components/orbit-mode/OrbitModeOverlay.tsx`**

```typescript
// src/components/orbit-mode/OrbitModeOverlay.tsx
"use client";

import { useCallback, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import LiquidGlass from "./LiquidGlass";
import WeekTimeline from "./WeekTimeline";
import MethodSelector from "./MethodSelector";

export default function OrbitModeOverlay() {
  const { state, dispatch } = useAppContext();
  const [glassReady, setGlassReady] = useState(false);

  const handleGlassReady = useCallback(() => {
    setGlassReady(true);
  }, []);

  if (!state.orbitMode) return null;

  return (
    <LiquidGlass isOpen={state.orbitMode} onAnimationEnd={handleGlassReady}>
      <div className="fixed inset-0 z-50 flex flex-col">
        {/* 顶栏 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h2 className="font-display text-2xl text-cosmic-white">聚焦模式</h2>
          <div className="flex items-center gap-4">
            <MethodSelector />
            <button
              onClick={() => dispatch({ type: "TOGGLE_ORBIT_MODE" })}
              className="px-4 py-2 text-sm text-cosmic-white/50 hover:text-cosmic-white border border-white/10 rounded-lg transition-colors"
            >
              退出 ✕
            </button>
          </div>
        </div>

        {/* 内容区: 周视图 + 方法面板 */}
        <div className="flex-1 flex overflow-hidden">
          <WeekTimeline />
          {state.activeMethodology && (
            <div className="w-[380px] border-l border-white/5 p-4 overflow-auto">
              <MethodologyPanel type={state.activeMethodology} />
            </div>
          )}
        </div>
      </div>
    </LiquidGlass>
  );
}
```

---

### 任务 22：MethodSelector + FocusBlock

**文件：**
- 创建：`src/components/orbit-mode/MethodSelector.tsx`
- 创建：`src/components/orbit-mode/FocusBlock.tsx`
- 创建：`src/components/orbit-mode/FocusBlockForm.tsx`

- [ ] **步骤 1：编写 MethodSelector.tsx**

```typescript
// src/components/orbit-mode/MethodSelector.tsx
"use client";

import { useAppContext } from "@/context/AppContext";
import { METHODOLOGIES, type MethodType } from "@/types/methodology";

export default function MethodSelector() {
  const { state, dispatch } = useAppContext();

  return (
    <div className="flex gap-1">
      {METHODOLOGIES.map((m) => (
        <button
          key={m.type}
          onClick={() =>
            dispatch({
              type: "SET_METHODOLOGY",
              payload: state.activeMethodology === m.type ? null : m.type,
            })
          }
          className={`px-2.5 py-1.5 rounded-full text-xs transition-all duration-200 ${
            state.activeMethodology === m.type
              ? "bg-cosmic-violet/20 text-cosmic-violet border border-cosmic-violet/50 scale-105"
              : "bg-white/5 text-cosmic-white/50 border border-white/10 hover:bg-white/10"
          }`}
          title={m.description}
        >
          {m.icon} {m.labelZh}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **步骤 2：编写 FocusBlock.tsx**

```typescript
// src/components/orbit-mode/FocusBlock.tsx
"use client";

import type { FocusBlock } from "@/types/focus-block";

interface FocusBlockProps {
  block: FocusBlock;
  onDelete: (id: string) => void;
}

export default function FocusBlock({ block, onDelete }: FocusBlockProps) {
  return (
    <div
      className="relative group rounded-lg px-3 py-2 text-xs"
      style={{
        background: "linear-gradient(135deg, rgba(41,98,255,0.15), rgba(41,98,255,0.08), rgba(245,197,24,0.06))",
        border: "1.5px solid rgba(124,58,237,0.3)",
        boxShadow: "0 0 20px rgba(124,58,237,0.15), 0 0 60px rgba(124,58,237,0.05)",
        backdropFilter: "blur(8px)",
        animation: "focus-pulse 3s infinite",
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-cosmic-white font-medium">{block.title}</span>
        <button
          onClick={() => onDelete(block.id)}
          className="opacity-0 group-hover:opacity-100 text-cosmic-white/50 hover:text-red-400 transition-all"
        >
          ✕
        </button>
      </div>
      <div className="text-cosmic-white/40 mt-1">
        {block.startTime} - {block.endTime}
      </div>
      {block.note && (
        <div className="text-cosmic-white/30 mt-1">{block.note}</div>
      )}
    </div>
  );
}
```

---

### 任务 23：帕累托面板 (ParetoPanel)

**文件：**
- 创建：`src/components/orbit-mode/methods/ParetoPanel.tsx`
- 创建：`src/hooks/useParetoAnalysis.ts`
- 创建：`src/utils/pareto.ts`

- [ ] **步骤 1：编写 `src/utils/pareto.ts` — 帕累托排序算法**

```typescript
// src/utils/pareto.ts
import type { Task } from "@/types/task";

export interface ParetoItem {
  task: Task;
  impact: number;       // 0-100 影响力分数
  cumulativeImpact: number; // 累积影响力
}

/** 计算任务的影响力分数 (基于时长+进度判断) */
export function calculateImpact(task: Task): number {
  const durationWeight = Math.min(task.duration / 120, 1); // 最长2小时满分
  const progressWeight = task.progress < 1 ? (1 - task.progress) : 0;
  return Math.round((durationWeight * 0.6 + progressWeight * 0.4) * 100);
}

/** 按 "Vital 20% / Rest 80%" 分组 */
export function analyzePareto(tasks: Task[]): {
  vital: ParetoItem[];
  rest: ParetoItem[];
  vitalImpactSum: number;
  totalImpactSum: number;
} {
  const items: ParetoItem[] = tasks
    .map((task) => ({
      task,
      impact: calculateImpact(task),
      cumulativeImpact: 0,
    }))
    .sort((a, b) => b.impact - a.impact);

  const totalImpact = items.reduce((sum, i) => sum + i.impact, 0);
  let cumulativeSum = 0;

  for (const item of items) {
    cumulativeSum += item.impact;
    item.cumulativeImpact = cumulativeSum;
  }

  // 按 80/20 分组: 累积影响达总影响80%的任务 = Vital 20%
  const threshold = totalImpact * 0.8;
  let splitIndex = items.findIndex((i) => i.cumulativeImpact >= threshold);
  if (splitIndex === -1) splitIndex = Math.ceil(items.length * 0.2);

  return {
    vital: items.slice(0, splitIndex + 1),
    rest: items.slice(splitIndex + 1),
    vitalImpactSum: items.slice(0, splitIndex + 1).reduce((s, i) => s + i.impact, 0),
    totalImpactSum: totalImpact,
  };
}
```

- [ ] **步骤 2：编写 `src/hooks/useParetoAnalysis.ts`**

```typescript
// src/hooks/useParetoAnalysis.ts
"use client";

import { useMemo } from "react";
import { useAppContext } from "@/context/AppContext";
import { analyzePareto } from "@/utils/pareto";

export function useParetoAnalysis() {
  const { state } = useAppContext();
  const tasks = state.tasks[state.currentDate] || [];

  const result = useMemo(() => analyzePareto(tasks), [tasks]);

  return {
    vital: result.vital,
    rest: result.rest,
    totalImpact: result.totalImpactSum,
    vitalPercentage: result.totalImpactSum > 0
      ? Math.round((result.vitalImpactSum / result.totalImpactSum) * 100)
      : 0,
  };
}
```

- [ ] **步骤 3：编写 `src/components/orbit-mode/methods/ParetoPanel.tsx`**

```typescript
// src/components/orbit-mode/methods/ParetoPanel.tsx
"use client";

import { useParetoAnalysis } from "@/hooks/useParetoAnalysis";
import { TASK_TYPE_COLORS_HEX } from "@/types/task";

export default function ParetoPanel() {
  const { vital, rest, totalImpact, vitalPercentage } = useParetoAnalysis();

  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg text-cosmic-white">📊 帕累托分析 (80/20)</h3>

      {vital.length === 0 ? (
        <p className="text-xs text-cosmic-white/40">暂无任务数据</p>
      ) : (
        <>
          {/* Vital 20% */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-bold text-cosmic-violet">🎯 Vital 20%</span>
              <span className="text-xs text-cosmic-white/40">(贡献 {vitalPercentage}% 影响力)</span>
            </div>
            {vital.map((item) => (
              <div
                key={item.task.id}
                className="flex items-center gap-2 px-3 py-2 rounded-lg mb-1"
                style={{ backgroundColor: TASK_TYPE_COLORS_HEX[item.task.type] + "22", borderLeft: `3px solid ${TASK_TYPE_COLORS_HEX[item.task.type]}` }}
              >
                <span className="flex-1 text-xs text-cosmic-white">{item.task.name}</span>
                <span className="text-xs text-cosmic-white/60 font-mono">{item.impact}分</span>
              </div>
            ))}
          </div>

          {/* Rest 80% */}
          <div>
            <span className="text-xs text-cosmic-white/50 mb-2 block">📋 Rest 80%</span>
            {rest.map((item) => (
              <div key={item.task.id} className="flex items-center gap-2 px-3 py-1.5 rounded text-xs opacity-60 hover:opacity-80 transition-opacity">
                <span className="flex-1 text-cosmic-white/60">{item.task.name}</span>
                <span className="text-cosmic-white/40 font-mono">{item.impact}分</span>
              </div>
            ))}
            {rest.length === 0 && <p className="text-xs text-cosmic-white/30">无需关注的低ROI任务</p>}
          </div>
        </>
      )}
    </div>
  );
}
```

- [ ] **步骤 4：验证 ParetoPanel**

运行：`pnpm exec tsc --noEmit` → 无错误
添加 10+ 条不同时长/进度的测试任务 → 面板显示 Vital 高亮 + Rest 列表 → 累积影响比例 > 80%

---

### 任务 24：莫法特面板 (MoffattPanel)

**文件：**
- 创建：`src/components/orbit-mode/methods/MoffattPanel.tsx`
- 创建：`src/hooks/useMoffattScheduler.ts`
- 创建：`src/utils/moffatt.ts`

- [ ] **步骤 1：编写 `src/utils/moffatt.ts` — 莫法特轮换算法**

```typescript
// src/utils/moffatt.ts
export type MoffattCategory = "deepWork" | "shallowWork" | "learning" | "maintenance";

export interface MoffattSession {
  category: MoffattCategory;
  label: string;
  duration: number; // 分钟
  remaining: number; // 剩余秒数
}

export const MOFFATT_SCHEDULE: MoffattSession[] = [
  { category: "deepWork", label: "深度工作", duration: 50, remaining: 50 * 60 },
  { category: "shallowWork", label: "浅层任务", duration: 10, remaining: 10 * 60 },
  { category: "deepWork", label: "深度工作", duration: 50, remaining: 50 * 60 },
  { category: "learning", label: "学习充电", duration: 30, remaining: 30 * 60 },
  { category: "maintenance", label: "日常维护", duration: 15, remaining: 15 * 60 },
  { category: "shallowWork", label: "浅层任务", duration: 20, remaining: 20 * 60 },
  { category: "deepWork", label: "深度工作", duration: 50, remaining: 50 * 60 },
  { category: "learning", label: "学习充电", duration: 30, remaining: 30 * 60 },
];

export const CATEGORY_COLORS: Record<MoffattCategory, string> = {
  deepWork: "#2962FF",
  shallowWork: "#6B7280",
  learning: "#F5C518",
  maintenance: "#7C3AED",
};

export const CATEGORY_ICONS: Record<MoffattCategory, string> = {
  deepWork: "🧠",
  shallowWork: "📋",
  learning: "📚",
  maintenance: "🔧",
};
```

- [ ] **步骤 2：编写 `src/hooks/useMoffattScheduler.ts`**

```typescript
// src/hooks/useMoffattScheduler.ts
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MOFFATT_SCHEDULE, type MoffattSession } from "@/utils/moffatt";

export function useMoffattScheduler() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState(MOFFATT_SCHEDULE[0]!.remaining);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);
  const pausedRemainingRef = useRef<number>(MOFFATT_SCHEDULE[0]!.remaining);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          // 切换到下一轮
          setActiveIndex((i) => (i + 1) % MOFFATT_SCHEDULE.length);
          const nextSession = MOFFATT_SCHEDULE[(activeIndex + 1) % MOFFATT_SCHEDULE.length]!;
          return nextSession.duration * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, activeIndex]);

  return { activeIndex, remainingTime, isRunning, toggle: () => setIsRunning(!isRunning) };
}
```

- [ ] **步骤 3：编写 `src/components/orbit-mode/methods/MoffattPanel.tsx`**

```typescript
// src/components/orbit-mode/methods/MoffattPanel.tsx
"use client";

import { useMoffattScheduler } from "@/hooks/useMoffattScheduler";
import { MOFFATT_SCHEDULE, CATEGORY_COLORS, CATEGORY_ICONS } from "@/utils/moffatt";

export default function MoffattPanel() {
  const { activeIndex, remainingTime, isRunning, toggle } = useMoffattScheduler();
  const current = MOFFATT_SCHEDULE[activeIndex]!;
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  const progress = 1 - remainingTime / (current.duration * 60);

  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg text-cosmic-white">🔄 莫法特轮换</h3>

      {/* 当前类别 */}
      <div
        className="rounded-xl p-4 text-center"
        style={{ backgroundColor: CATEGORY_COLORS[current.category] + "15", border: `1px solid ${CATEGORY_COLORS[current.category]}33` }}
      >
        <span className="text-2xl">{CATEGORY_ICONS[current.category]}</span>
        <p className="font-display text-lg text-cosmic-white mt-1">{current.label}</p>
        <div className="font-mono text-3xl text-cosmic-white mt-2">
          {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full mt-3">
          <div
            className="h-full rounded-full transition-[width] duration-1000"
            style={{ width: `${progress * 100}%`, backgroundColor: CATEGORY_COLORS[current.category] }}
          />
        </div>
      </div>

      {/* 轮换队列 */}
      <div className="space-y-1">
        <p className="text-xs text-cosmic-white/40 mb-2">轮换队列</p>
        {MOFFATT_SCHEDULE.map((session, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-all ${
              i === activeIndex ? "bg-white/10 scale-105" : i < activeIndex ? "opacity-30 line-through" : "opacity-50"
            }`}
          >
            <span>{CATEGORY_ICONS[session.category]}</span>
            <span className="flex-1">{session.label}</span>
            <span className="font-mono text-cosmic-white/50">{session.duration}min</span>
          </div>
        ))}
      </div>

      <button onClick={toggle} className="w-full py-2 bg-cosmic-violet/20 border border-cosmic-violet/30 text-cosmic-violet rounded-lg text-sm">
        {isRunning ? "暂停" : "开始轮换"}
      </button>
    </div>
  );
}
```

- [ ] **步骤 4：验证 MoffattPanel**

运行：`pnpm exec tsc --noEmit` → 无错误
点击"开始轮换" → 倒计时开始 → 到达0后自动切换到下一类型 → 队列中已完成项标记 line-through

---

### 任务 25：豪威尔矩阵 (HowellMatrix)

**文件：**
- 创建：`src/components/orbit-mode/methods/HowellMatrix.tsx`

- [ ] **步骤 1：编写 HowellMatrix.tsx — 紧急/重要 四象限**

```typescript
// src/components/orbit-mode/methods/HowellMatrix.tsx
"use client";

import { useState } from "react";
import { TASK_TYPE_COLORS_HEX, type TaskType } from "@/types/task";

type Quadrant = "urgent-important" | "not-urgent-important" | "urgent-not-important" | "not-urgent-not-important";

interface MatrixItem {
  id: string;
  text: string;
  quadrant: Quadrant;
}

const QUADRANT_CONFIG: Record<Quadrant, { label: string; color: string; bg: string; tip: string }> = {
  "urgent-important": {
    label: "紧急且重要",
    color: "#2962FF",
    bg: "rgba(41,98,255,0.08)",
    tip: "立即处理",
  },
  "not-urgent-important": {
    label: "不紧急但重要",
    color: "#7C3AED",
    bg: "rgba(124,58,237,0.08)",
    tip: "计划安排",
  },
  "urgent-not-important": {
    label: "紧急但不重要",
    color: "#F5C518",
    bg: "rgba(245,197,24,0.08)",
    tip: "委托他人",
  },
  "not-urgent-not-important": {
    label: "不紧急不重要",
    color: "#6B7280",
    bg: "rgba(107,114,128,0.08)",
    tip: "删除/推迟",
  },
};

export default function HowellMatrix() {
  const [items, setItems] = useState<MatrixItem[]>([]);
  const [inputText, setInputText] = useState("");
  const [selectedQuadrant, setSelectedQuadrant] = useState<Quadrant>("urgent-important");

  const addItem = () => {
    if (!inputText.trim()) return;
    setItems((prev) => [...prev, { id: crypto.randomUUID(), text: inputText.trim(), quadrant: selectedQuadrant }]);
    setInputText("");
  };

  const moveItem = (id: string, quadrant: Quadrant) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quadrant } : i)));
  };

  const getQuadrantItems = (q: Quadrant) => items.filter((i) => i.quadrant === q);

  return (
    <div className="space-y-3">
      <h3 className="font-display text-lg text-cosmic-white">📐 豪威尔矩阵</h3>

      {/* 四象限网格 */}
      <div className="grid grid-cols-2 gap-2">
        {(["urgent-important", "not-urgent-important", "urgent-not-important", "not-urgent-not-important"] as Quadrant[]).map((q) => {
          const cfg = QUADRANT_CONFIG[q];
          const quadrantItems = getQuadrantItems(q);
          return (
            <div
              key={q}
              className="rounded-lg p-2 min-h-[80px] border transition-colors"
              style={{ backgroundColor: cfg.bg, borderColor: cfg.color + "33" }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold" style={{ color: cfg.color }}>{cfg.label}</span>
                <span className="text-[10px] text-cosmic-white/30">{cfg.tip}</span>
              </div>
              <div className="space-y-0.5">
                {quadrantItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-1 group">
                    <span className="text-[11px] text-cosmic-white/70 flex-1 truncate">{item.text}</span>
                    <select
                      value={item.quadrant}
                      onChange={(e) => moveItem(item.id, e.target.value as Quadrant)}
                      className="opacity-0 group-hover:opacity-100 text-[10px] bg-transparent text-cosmic-white/40 border-none outline-none"
                    >
                      {Object.entries(QUADRANT_CONFIG).map(([k, v]) => (
                        <option key={k} value={k}>{v.label}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 输入 */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
          placeholder="添加条目..."
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-cosmic-white placeholder-cosmic-white/30"
        />
        <select
          value={selectedQuadrant}
          onChange={(e) => setSelectedQuadrant(e.target.value as Quadrant)}
          className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-cosmic-white/70"
        >
          {Object.entries(QUADRANT_CONFIG).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        <button onClick={addItem} className="px-3 py-1.5 bg-cosmic-violet/20 rounded-lg text-xs text-cosmic-violet">+</button>
      </div>
    </div>
  );
}
```

- [ ] **步骤 2：验证 HowellMatrix**

运行：`pnpm exec tsc --noEmit` → 无错误
添加条目到各象限 → 四象限正确分布 → 拖拽迁移条目到不同象限 → 颜色/位置更新

---

### 任务 26：SWOT 矩阵 (SWOTPanel)

**文件：**
- 创建：`src/components/orbit-mode/methods/SWOTPanel.tsx`

- [ ] **步骤 1：编写 SWOTPanel.tsx — 优势/劣势/机会/威胁 2×2 分析**

```typescript
// src/components/orbit-mode/methods/SWOTPanel.tsx
"use client";

import { useState } from "react";

type SWOTCategory = "strengths" | "weaknesses" | "opportunities" | "threats";

interface SWOTItem {
  id: string;
  text: string;
  category: SWOTCategory;
}

const SWOT_CONFIG: Record<SWOTCategory, { label: string; color: string; bg: string }> = {
  strengths: { label: "💪 优势", color: "#22c55e", bg: "rgba(34,197,94,0.08)" },
  weaknesses: { label: "⚠ 劣势", color: "#F5C518", bg: "rgba(245,197,24,0.08)" },
  opportunities: { label: "🚀 机会", color: "#2962FF", bg: "rgba(41,98,255,0.08)" },
  threats: { label: "🛡 威胁", color: "#ef4444", bg: "rgba(239,68,68,0.08)" },
};

export default function SWOTPanel() {
  const [items, setItems] = useState<SWOTItem[]>([]);
  const [inputText, setInputText] = useState("");
  const [selected, setSelected] = useState<SWOTCategory>("strengths");

  const addItem = () => {
    if (!inputText.trim()) return;
    setItems((prev) => [...prev, { id: crypto.randomUUID(), text: inputText.trim(), category: selected }]);
    setInputText("");
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const getCategoryItems = (c: SWOTCategory) => items.filter((i) => i.category === c);

  return (
    <div className="space-y-3">
      <h3 className="font-display text-lg text-cosmic-white">🔍 SWOT 分析</h3>

      {/* 2×2 网格 */}
      <div className="grid grid-cols-2 gap-2">
        {(Object.entries(SWOT_CONFIG) as [SWOTCategory, typeof SWOT_CONFIG[SWOTCategory]][]).map(([key, cfg]) => {
          const catItems = getCategoryItems(key);
          return (
            <div
              key={key}
              className="rounded-lg p-2 min-h-[80px] border"
              style={{ backgroundColor: cfg.bg, borderColor: cfg.color + "33" }}
            >
              <span className="text-[11px] font-bold" style={{ color: cfg.color }}>{cfg.label}</span>
              <span className="text-[10px] text-cosmic-white/30 ml-1">({catItems.length})</span>
              <div className="mt-1 space-y-0.5">
                {catItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-1 group">
                    <span className="text-[11px] text-cosmic-white/70 flex-1 truncate">{item.text}</span>
                    <button onClick={() => deleteItem(item.id)} className="opacity-0 group-hover:opacity-100 text-[10px] text-red-400">✕</button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 输入 */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
          placeholder="添加分析条目..."
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-cosmic-white placeholder-cosmic-white/30"
        />
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value as SWOTCategory)}
          className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-cosmic-white/70"
        >
          {Object.entries(SWOT_CONFIG).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        <button onClick={addItem} className="px-3 py-1.5 bg-cosmic-violet/20 rounded-lg text-xs text-cosmic-violet">+</button>
      </div>
    </div>
  );
}
```

- [ ] **步骤 2：验证 SWOTPanel**

运行：`pnpm exec tsc --noEmit` → 无错误
添加条目到四个象限 → 各象限显示正确计数 → 删除按钮可移除条目

---

### 任务 27：方法论面板 QA 测试

- [ ] **步骤 1：GTDPanel 测试清单**
  | # | 测试场景 | 操作 | 预期结果 |
  |---|---------|------|---------|
  | 1 | 初始渲染 | 打开 GTD 面板 | 显示"📥 GTD 工作流"标题 + 5阶段按钮 |
  | 2 | 空状态 | 不添加任何条目 | 收件箱区域为空，无错误日志 |
  | 3 | 添加条目 | 输入文字 → Enter | 条目出现在收件箱，输入框清空 |
  | 4 | 空输入防护 | 输入框为空 → Enter | 不添加条目 |
  | 5 | 阶段切换 | 点击"下一步"按钮 | 仅显示该阶段的条目 |
  | 6 | 迁移条目 | 下拉选择"完成" | 条目从当前阶段移至"完成" |

- [ ] **步骤 2：PomodoroPanel 测试清单**
  | # | 测试场景 | 操作 | 预期结果 |
  |---|---------|------|---------|
  | 1 | 初始渲染 | 打开番茄钟面板 | 显示 25:00 倒计时 + "专注"标签 |
  | 2 | 开始/暂停 | 点击"开始" → 等待3秒 → 点击"暂停" | 倒计时从25:00开始减少 → 暂停后停止 |
  | 3 | 倒计时动画 | 观察 SVG 环 | 环 stroke-dasharray 随秒数递减 |
  | 4 | 阶段切换 | 倒计时至0 | 自动切换到"休息"阶段，显示 05:00 |
  | 5 | 4轮循环 | 完成4轮专注→休息 | 第4轮后切换到"长休息" 15:00 |
  | 6 | 重置 | 点击"重置" | 回到 25:00 专注 第1轮 |
  | 7 | 内存检查 | 组件卸载后 | 无残留 interval |

- [ ] **步骤 3：ParetoPanel 测试清单**
  | # | 测试场景 | 操作 | 预期结果 |
  |---|---------|------|---------|
  | 1 | 空状态 | 无任务时打开面板 | 显示"暂无任务数据" |
  | 2 | 数据分析 | 添加10+任务 → 打开面板 | Vital 区域高亮+彩色左边框，Rest 区域半透明 |
  | 3 | 排序 | 检查 Vital 列表 | 按影响力分数从高到低排序 |
  | 4 | 累积比例 | 检查 Vital 百分比 | 标签显示"贡献 XX% 影响力" |

- [ ] **步骤 4：MoffattPanel 测试清单**
  | # | 测试场景 | 操作 | 预期结果 |
  |---|---------|------|---------|
  | 1 | 初始渲染 | 打开莫法特面板 | 显示"深度工作" + 50:00 倒计时 + 8项轮换队列 |
  | 2 | 开始轮换 | 点击"开始轮换" | 倒计时开始减少 |
  | 3 | 自动切换 | 倒计时至0 | 自动切到"浅层任务"，已完成的标记 line-through |
  | 4 | 循环 | 等待完整一轮 (8项) | 回到第1项"深度工作"继续 |

- [ ] **步骤 5：HowellMatrix 测试清单**
  | # | 测试场景 | 操作 | 预期结果 |
  |---|---------|------|---------|
  | 1 | 初始渲染 | 打开豪威尔面板 | 2×2 网格 + 4象限标签/提示语 |
  | 2 | 添加条目 | 选择象限 → 输入文字 → + | 条目出现在对应象限 |
  | 3 | 迁移 | 下拉切换象限 | 条目移动到目标象限，颜色更新 |
  | 4 | 空象限 | 不添加条目的象限 | 显示空区域，无报错 |

- [ ] **步骤 6：SWOTPanel 测试清单**
  | # | 测试场景 | 操作 | 预期结果 |
  |---|---------|------|---------|
  | 1 | 初始渲染 | 打开 SWOT 面板 | 2×2 网格 + S/W/O/T 标签 |
  | 2 | 添加条目 | 选择"优势" → 输入 → + | 条目出现在优势象限，计数+1 |
  | 3 | 删除 | hover条目 → 点击 ✕ | 条目从象限移除 |
  | 4 | 计数 | 添加3条到不同象限 | 各象限显示正确数量 |

---

### 任务 28：方法论面板与 MethodSelector 集成测试

- [ ] **步骤 1：切换联动测试**
  | # | 场景 | 操作 | 预期 |
  |---|------|------|------|
  | 1 | 打开 Orbit Mode | 点击 🪐 | 右侧面板区域为空 (无激活方法论) |
  | 2 | 选择 GTD | 点击"📥 搞定" | 右侧显示 GTDPanel |
  | 3 | 切换 Pomodoro | 点击"🍅 番茄钟" | 右侧切换为 PomodoroPanel，GTD 隐藏 |
  | 4 | 取消选择 | 再次点击"🍅 番茄钟" | 右侧面板清空 |
  | 5 | Esc 退出 | 按 Esc | Orbit Mode 关闭，回到主界面 |

- [ ] **步骤 2：类型验证**

```bash
pnpm exec tsc --noEmit
```
预期：0 错误

---

### Phase 6: 文档



- [ ] **步骤 1：更新 page.tsx，启动按钮 + 集成 OrbitModeOverlay**

```tsx
{state.orbitMode ? (
  <OrbitModeOverlay />
) : (
  <main className="...">
    {/* 原有5区域 */}
    {/* ... */}
    {/* Orbit Mode 启动按钮 */}
    <button
      onClick={() => dispatch({ type: "TOGGLE_ORBIT_MODE" })}
      className="fixed right-6 bottom-6 w-14 h-14 rounded-full bg-cosmic-violet/20 border border-cosmic-violet/30 flex items-center justify-center text-2xl hover:scale-110 hover:bg-cosmic-violet/30 transition-all duration-300 z-30"
    >
      🪐
    </button>
  </main>
)}
```

- [ ] **步骤 2：端到端测试 Orbit Mode 流程**

1. 点击 🪐 按钮 → 事件视界动画展开
2. 确认周视图显示本周 7 天
3. 切换方法论 → 确认相应面板显示
4. 按 Esc → 退出 Orbit Mode

---

### Phase 6: 文档

### 任务 30-35：文档编写

**文件：**
- 创建：`docs/README.md`
- 创建：`docs/CHANGELOG.md`
- 创建：`docs/FEATURES.md`
- 创建：`docs/methodologies/gtd.md`
- 创建：`docs/methodologies/pomodoro.md`
- 创建：`docs/methodologies/pareto.md`
- 创建：`docs/methodologies/moffatt.md`
- 创建：`docs/methodologies/howell-matrix.md`
- 创建：`docs/methodologies/swot.md`

- [ ] **步骤 1：README.md** — 项目介绍 + 快速开始 + 技术栈 + 截图
- [ ] **步骤 2：CHANGELOG.md** — v1.0.0 初始发布
- [ ] **步骤 3：FEATURES.md** — 所有功能列表
- [ ] **步骤 4：gtd.md** — GTD方法论原理 + OrbitAN实现
- [ ] **步骤 5：pomodoro.md** — 番茄钟原理 + OrbitAN实现
- [ ] **步骤 6：pareto.md** — 帕累托原理 + OrbitAN实现
- [ ] **步骤 7：moffatt.md** — 莫法特休息法原理 + OrbitAN实现
- [ ] **步骤 8：howell-matrix.md** — 豪威尔矩阵原理 + OrbitAN实现
- [ ] **步骤 9：swot.md** — SWOT分析原理 + OrbitAN实现

> 每篇方法论文档格式模板：
> ```markdown
> # [方法名] — 原理与实现
> 
> ## 方法原理
> [核心概念、历史背景、适用场景]
> 
> ## 在 OrbitAN 中的实现
> [界面布局、交互流程、数据模型]
> 
> ## 使用指南
> [步骤说明、快捷键、最佳实践]
> ```

---

### Phase 7: 打磨

### 任务 35：最终 QA

- [ ] **步骤 1：完整功能测试 — 逐项核对**

| 功能 | 测试操作 | 判定标准 |
|---|---|---|
| 日期导航 | ← / → / T 键 或 点击箭头/今天 | 日期变更 ≤ 200ms，日期范围锁定本周 |
| 任务新增 | N 键 → 填写表单 → 提交 | 任务出现在列表 + Canvas行星渲染 |
| 任务编辑 | 选中任务 → 点击编辑 → 修改名称 → 保存 | 名称更新 + 行星更新 (颜色/大小不变) |
| 任务删除 | 选中 → Del → 确认 | 任务消失 + Canvas行星移除 |
| 进度拖拽 | 拖拽进度条手柄 | 实时跟随鼠标，释放后持久化，0%/100%吸附 |
| 筛选 | 点击类型标签或按1-4 | 非匹配行星 opacity≤0.15，列表条目 opacity≤0.3 |
| 清除筛选 | 点击"全部"或按0 | 所有行星/列表恢复完整显示 |
| Canvas 时钟 | 等待 60s | 时钟指针准确移动，每秒更新 |
| 行星联动 | 点击 Canvas 行星 | 列表对应项高亮 + scrollIntoView |
| 列表联动 | 点击列表项 | 行星 scale 1.35 + 超新星光晕 |
| Orbit Mode 入场 | 点击 🪐 或按 O | 事件视界 800ms 动画 → 全屏玻璃覆盖 |
| Orbit Mode 退出 | Esc 或点击退出 | 玻璃层消失，回到主界面 |
| 周视图 | Orbit Mode 中查看 7 列 | 每日任务正确显示，今日高亮 |
| GTD 面板 | 选择 GTD → 添加/迁移条目 | 5 阶段按钮计数更新，条目可跨阶段移动 |
| 番茄钟 | 选择 Pomodoro → 开始 | 25:00 倒计时 → 自动切换 5:00 休息 → 4轮后长休息 |
| 帕累托 | 选择 Pareto | Vital 20% 高亮 + 累积影响比例 > 80% |
| 莫法特 | 选择 Moffatt → 开始轮换 | 8 项轮换队列，到达 0 后自动切换 |
| 豪威尔 | 选择 Howell → 添加条目到四象限 | 4 象限独立，条目可跨象限迁移 |
| SWOT | 选择 SWOT → 添加/删除条目 | 4 象限计数更新，删除后条目移除 |
| localStorage | 添加任务 → 刷新页面 | 所有任务数据完整保留 |
| 键盘快捷键 | 逐个测试所有快捷键 (Esc/N/←→/T/1-4/0/Del/O) | 每个快捷键触发正确行为 |

- [ ] **步骤 2：类型检查**
  ```bash
  pnpm exec tsc --noEmit
  ```
  预期：0 错误

- [ ] **步骤 3：构建检查**
  ```bash
  pnpm build
  ```
  预期：构建成功，无 Error

- [ ] **步骤 4：性能检查 — 可重复测试**

**环境**：Chrome 120+ | Windows | 1920×1080 | 无浏览器扩展 | 关闭其他标签页

| 指标 | 测试方法 | 基线 | 测量工具 |
|---|---|---|---|
| Canvas FPS | 打开 DevTools → Performance → 录制 10s → 查看 Frames | **稳定 58-62 FPS** (无掉帧到 <50) | Chrome DevTools Performance |
| FCP (首次内容绘制) | Lighthouse → Performance 报告 | **< 1000ms** | Lighthouse |
| TTI (可交互时间) | Lighthouse → Performance | **< 1500ms** | Lighthouse |
| 内存占用 | DevTools → Memory → 录制 60s 堆快照 (打开+操作+关闭 Orbit Mode) | **波动 < 20MB**，JS heap < 80MB | Chrome DevTools Memory |
| 内存泄漏检查 | 操作 3 个完整循环 (新增→编辑→删除→Orbit Mode→退出) → 手动 GC → 堆快照 | 无持续增长趋势 | Memory → Allocation sampling on timeline |
| localStorage 写入性能 | 连续新增 100 条任务 → Performance 录制 | 无 > 50ms 的长任务 | Chrome DevTools Performance |
| Canvas 渲染时间 | requestAnimationFrame callback 耗时 | **单帧 < 16ms** (含静态层复制 + 行星绘制 + 粒子更新) | console.time / Performance API |
| 编辑面板动画 | 打开面板 → Performance 录制 | translateX 帧率 ≥ 60fps，无 layout thrashing | Performance → Rendering → FPS meter |

**性能测试剧本** (可复制到自动化)：
```
1. 启动 `pnpm dev`，打开 http://localhost:3000
2. 打开 DevTools Performance，录制 30 秒
3. 执行以下操作序列:
   a. 滚动任务列表 (0-5s)
   b. 切换日期 (5-10s)
   c. 新增 3 个任务 (10-15s)
   d. 切换 Orbit Mode → 切换全部 6 个方法论 → 退出 (15-25s)
   e. 空闲等待 (25-30s)
4. 停止录制，检查 Frames 面板无红色长帧 (>50ms)
5. 导出截图保存为 performance-baseline.png
```

- [ ] **步骤 5：视觉验收清单**

| 检查项 | 判定标准 |
|---|---|
| 几何切割背景 | 对角线 135°，#020208→#F0F0F0，硬切在 55% |
| 字体加载 | Clash Display (标题) + Satoshi (正文) + JetBrains Mono (时间) 均正确渲染 |
| 轨道环颜色 | 奇圈 #F5C518 / 偶圈 #2962FF，10 环分层 |
| 行星 3D 渲染 | 径向渐变 + 左上高光点 + 投影阴影 |
| 色散入场 | 标题加载时 RGB 通道分离→合焦效果 |
| 自定义光标 | 外层环 (40px) + 内层点 (8px)，替换原生光标 |
| 编辑面板 | 右侧滑出，350ms cubic-bezier，backdrop blur 遮罩 |
| Liquid Glass | Orbit Mode 背景 blur(20px) saturate(180%)，噪点纹理叠加 |
| Focus Block | 发光液态玻璃样式 + focus-pulse 呼吸动画 |

- [ ] **步骤 6：验收通过条件**

所有以下条件满足方可视为 Phase 7 完成：

1. 功能测试 20 项全部通过 (步骤 1)
2. `pnpm exec tsc --noEmit` 返回 0 错误
3. `pnpm build` 成功无 Error
4. Canvas FPS 基线达标 (58-62fps)
5. FCP < 1000ms
6. 内存无泄漏 (5 次操作循环后堆内存稳定)
7. 刷新后数据完整保留
8. 所有 9 项视觉检查通过

---

**实现计划完成时间预估**：各任务按 2-5 分钟计，总计约 120-180 分钟 (2-3 小时连续工作)。

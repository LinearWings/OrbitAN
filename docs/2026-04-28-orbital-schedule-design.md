# Orbital Schedule — 设计规格文档 v2 (超现实先锋主义)

> **生成日期**: 2026-04-28
> **技术栈**: Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 + Canvas 2D API + oklch()
> **状态**: 设计确认 (超现实先锋主义视觉方向已集成)
> **文件数**: 70+ | **实现步数**: 35 | **章节**: 17

---

## 1. 项目概述

桌面端日程管理应用。核心理念「一天是一个轨道，专注是你的引力」——将每日时间管理类比为行星轨道系统。界面采用 3D 宇宙天体风格，融合复古颗粒噪点质感与极简信息图设计。

**核心功能矩阵**:
- 实时时钟 + 螺旋星云轨道 + 行星球体可视化
- 日程列表（CRUD + 进度追踪 + 中英双语）
- 按日视图（本周内自由切换）
- 图例筛选（按任务类型高亮/隐藏）
- Orbit Mode 聚焦模式（6 种时间管理方法论）

---

## 2. 超现实先锋主义设计方向

### 2.1 设计哲学

> **视觉悖论**：精确的宇宙科学感 × 有机的超现实形态。
> 冷酷的几何切割 × 流动的液态玻璃。黑白的绝对理性 × 霓虹的感性脉冲。

**五感映射**：
| 感官 | 设计手段 | 体验目标 |
|------|---------|---------|
| 视觉 | 色散(chromatic aberration) + 光线体积光 | 视网膜残留般的梦幻感 |
| 触觉 | 磁性轨道光标 + 元素吸附 | 引力场的物理暗示 |
| 空间 | 多层视差 + Z轴深度 | 置身轨道系统的沉浸感 |
| 听觉 | (预留) 低频环境音 + UI 反馈音 | 宇宙尺度的静谧 |
| 时间 | 实时时钟 + 粒子漂移 | 时间作为可感知的第四维度 |

**先锋主义三原则**：
1. **打破预期**：标题不居中对齐，列表不规则排列，正负空间故意失衡
2. **材质混搭**：拉丝金属 × 液态玻璃 × 像素噪点 × 霓虹发光 → 材质冲突即视觉张力
3. **去AI化**：拒绝 Inter/Roboto/紫色渐变/均分圆角，每一处都是手工雕刻般的独特质感

### 2.2 字体系统

```
┌──────────────────────────────────────────────────┐
│  CLASH DISPLAY (Variable)                        │
│  标题 · 数字 · 大字号                              │
│  ─────────────────────────────────               │
│  几何怪诞体 (Geometric Grotesk)                   │
│  5轴可变: wght 200→700                            │
│  特征: 尖锐转角 · 收紧字怀 · 科技感                │
├──────────────────────────────────────────────────┤
│  SATOSHI (Variable)                               │
│  正文 · 标签 · 小字号                              │
│  ─────────────────────────────────               │
│  几何人文体 (Geometric Humanist)                   │
│  2轴可变: wght 300→700                            │
│  特征: 开放字怀 · 高x高 · 清晰易读                  │
├──────────────────────────────────────────────────┤
│  JETBRAINS MONO                                   │
│  时间 · 代码 · 数据                                │
│  ─────────────────────────────────               │
│  开发者等宽体                                      │
│  特征: 连字 · 清晰区分 1lI 0O · 工程美学            │
└──────────────────────────────────────────────────┘
```

**大小对比系统** (极端对比 = 先锋感):
```
标题 (display):   clamp(3rem, 8vw, 6rem)     ← 巨大冲击
副标题 (h2):      clamp(1.5rem, 3vw, 2.5rem)
时间数字:         clamp(2rem, 5vw, 4rem)     ← 等宽时间醒目
正文:             0.875rem (14px)             ← 极克制
微文案:           0.75rem (12px)
```

**替代字体** (fallback chain):
```
'Clash Display', 'Space Grotesk', 'Outfit', sans-serif
'Satoshi', 'DM Sans', 'Plus Jakarta Sans', sans-serif
'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace
```

### 2.3 色彩系统 (Surrealist Palette)

```
╔══════════════════════════════════════════════════════════╗
║  VOID BLACK           COSMIC WHITE        COSMIC VIOLET  ║
║  #020208              #F0F0F0             #7C3AED        ║
║  oklch(0.05 0 270)    oklch(0.95 0 0)     oklch(0.45     ║
║  绝对背景黑             几何切割白            0.28 290)     ║
║                        (非纯白,微暖)        超现实强调色     ║
╚══════════════════════════════════════════════════════════╝

任务类型色 (增强饱和度, oklch 定义):
┌──────────┬─────────────┬──────────────────────┬───────────┐
│ 类型     │ 中文        │ HEX       │ oklch()  │ 语义      │
├──────────┼─────────────┼───────────┼──────────┼───────────┤
│ work     │ 工作        │ #2962FF   │ 0.45 0.25│ 精确/理性 │
│          │             │           │ 265      │           │
│ study    │ 学习        │ #F5C518   │ 0.82 0.21│ 能量/灵感 │
│          │             │           │ 100      │           │
│ meeting  │ 会议        │ #2D3748   │ 0.25 0.03│ 正式/克制 │
│          │             │           │ 250      │           │
│ personal │ 个人        │ #6B7280   │ 0.45 0.01│ 中性/自洽 │
│          │             │           │ 260      │           │
└──────────┴─────────────┴───────────┴──────────┴───────────┘

虹彩色散渐变 (Iridescent Gradient) — 用于光晕/玻璃/过渡:
  background: conic-gradient(
    from 0deg,
    oklch(0.7 0.25 265),   /* 蓝紫 */
    oklch(0.8 0.22 100),   /* 金  */
    oklch(0.65 0.20 180),  /* 青  */
    oklch(0.7 0.25 265)    /* 回到蓝紫 */
  );

霓虹发光色 (仅用于超现实强调, 不替代主色):
  --neon-blue:   oklch(0.7 0.28 250);    /* 赛博蓝 */
  --neon-gold:   oklch(0.85 0.24 95);     /* 脉冲金 */
  --neon-violet: oklch(0.55 0.30 290);    /* 紫电 */
```

### 2.4 超现实视觉技法

#### 2.4.1 色散效果 (Chromatic Aberration)

```css
/* 标题hover时产生RGB通道分离 — 模拟光学镜头色散 */
.chromatic {
  position: relative;
}
.chromatic:hover {
  text-shadow:
    -2px 0 0 rgba(255, 0, 0, 0.5),    /* R 通道左移 */
     2px 0 0 rgba(0, 255, 255, 0.5);   /* B 通道右移 */
  animation: chromatic-shift 0.3s ease-out;
}
@keyframes chromatic-shift {
  0%   { text-shadow: 0 0 0 transparent, 0 0 0 transparent; }
  50%  { text-shadow: -4px 0 0 rgba(255,0,0,0.6), 4px 0 0 rgba(0,255,255,0.6); }
  100% { text-shadow: -2px 0 0 rgba(255,0,0,0.5), 2px 0 0 rgba(0,255,255,0.5); }
}
```

#### 2.4.2 体积光/光线 (Volumetric Light Rays)

```css
/* 从Orbit Mode中心向外辐射的光线束 */
.light-rays {
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    rgba(124, 58, 237, 0.03) 2deg,
    transparent 4deg,
    rgba(37, 99, 235, 0.03) 6deg,
    transparent 8deg,
    /* ... 循环 */
  );
  animation: ray-rotate 40s linear infinite;
}
@keyframes ray-rotate {
  to { transform: rotate(360deg); }
}
```

#### 2.4.3 故障解构文字 (Glitch Text Deconstruction)

```css
/* 选中任务时名称短暂故障效果 */
@keyframes glitch-text {
  0%, 100% { clip-path: inset(0 0 0 0); transform: translate(0); }
  20%      { clip-path: inset(20% 0 60% 0); transform: translate(-2px, 1px); }
  40%      { clip-path: inset(60% 0 20% 0); transform: translate(2px, -1px); }
  60%      { clip-path: inset(40% 0 40% 0); transform: translate(-1px, -1px); }
  80%      { clip-path: inset(10% 0 70% 0); transform: translate(1px, 2px); }
}
```

#### 2.4.4 文字遮罩/渐变揭示

```css
/* 标题文字内部填充虹彩渐变 */
.title-masked {
  background: linear-gradient(135deg, #2962FF, #F5C518, #7C3AED);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 20px rgba(124, 58, 237, 0.4));
}
```

### 2.5 定制光标 (Orbital Cursor)

```typescript
// 轨道环光标 — 两个同心细环跟随鼠标, 慢速lerp
interface CursorState {
  x: number; y: number;           // 实际位置
  targetX: number; targetY: number; // 目标位置
}

// 外层环: lerp factor 0.08 (慢跟随, drift感)
// 内层环: lerp factor 0.15 (快跟随, precision感)
// hover任务时: 内环扩大 + 发光 + 显示任务类型色
// click: 环波纹扩散 (ripple)

// CSS:
.outer-ring { width: 40px; height: 40px; border: 1px solid rgba(255,255,255,0.4); border-radius: 50%; }
.inner-ring { width: 8px; height: 8px; background: white; border-radius: 50%; }
.hovering-task .outer-ring { width: 56px; height: 56px; border-color: var(--task-color); }
```

### 2.6 先锋排版规则

```
┌─ 规则1: 极端对比 ──────────────────────────────┐
│ 标题 8vw (≈120px)  vs  正文 14px                │
│ 比例 8.5:1 — 超越常规层级的视觉冲击               │
└────────────────────────────────────────────────┘

┌─ 规则2: 斜向锚定 ──────────────────────────────┐
│ 主标题区: 左对齐 + 15° 倾斜 (clip-path 斜切)     │
│ 时间显示: 右对齐 + 等宽数字                       │
│ 产生对角线阅读流: 左上→右下                       │
└────────────────────────────────────────────────┘

┌─ 规则3: 文字层叠 ──────────────────────────────┐
│ 标题背后: 超大、半透明、偏移的重复文字 (ghost)     │
│ 营造深度错觉: 前景清晰 + 背景模糊 + 远处半透明    │
│ mix-blend-mode: difference / overlay            │
└────────────────────────────────────────────────┘

┌─ 规则4: 断裂网格 ──────────────────────────────┐
│ 不对齐 = 不做完美居中                             │
│ Canvas居中, 其余全部偏离中心轴                    │
│ 列表: 交替缩进 (奇数行正常, 偶数行 offset 12px)   │
│ 营造 "手工排版" 的非机械感                        │
└────────────────────────────────────────────────┘
```

### 2.7 材质与纹理系统

```
┌────────────────────────────────────────────────┐
│  材质层 (Z轴从上到下)                            │
│                                                 │
│  Layer 5: 动态噪点 (animated grain)              │
│    opacity 0.035, 每帧微扰                       │
│    ┌──────────────────────────────────┐         │
│    │  SVG feTurbulence (fractalNoise)  │         │
│    │  baseFrequency: 0.65              │         │
│    │  numOctaves: 3                    │         │
│    │  seed: 每帧随机 → 粒子感           │         │
│    └──────────────────────────────────┘         │
│                                                 │
│  Layer 4: 光线 (volumetric rays)                 │
│    conic-gradient 旋转光柱                       │
│                                                 │
│  Layer 3: 虹彩色散 (iridescent overlay)          │
│    仅 Orbit Mode / hover 时显现                  │
│    mix-blend-mode: overlay                      │
│                                                 │
│  Layer 2: 液态玻璃 (liquid glass)                │
│    backdrop-filter: blur(20px) saturate(180%)    │
│    SVG gooey filter (feGaussianBlur + colormatrix)│
│                                                 │
│  Layer 1: 拉丝金属 (brushed metal)               │
│    时钟边框专用                                   │
│    repeating-linear-gradient + noise             │
│    ┌──────────────────────────────────┐         │
│    │  白→灰→暗→灰→白  (0.5px 微条纹)   │         │
│    │  + 金属高光 (左上角 brightness 1.3)│         │
│    └──────────────────────────────────┘         │
│                                                 │
│  Layer 0: 几何切割背景                            │
│    linear-gradient(135deg, #020208, #F0F0F0)     │
└────────────────────────────────────────────────┘
```

### 2.8 动画编排 (超现实增强)

| 动画 | 原方案 | 超现实增强 |
|------|--------|-----------|
| 页面入场 | 各区域 fade+up | **色散入场**: 元素通过 RGB 通道分离 → 合焦 (chromatic convergence), 600ms |
| 行星 hover | scale 1.2 | **引力透镜**: scale 1.25 + 周围空间轻微扭曲 (displacement filter) |
| 行星选中 | scale 1.35 + 光晕 | **超新星脉冲**: 虹彩环向外扩散 + 粒子喷射 (12颗粒子 300ms消散) |
| 编辑面板滑入 | translateX | **时空撕裂**: 面板边缘带色散拖尾 + 内容区故障闪现 (100ms glitch) |
| Orbit Mode 入场 | 按钮脉冲→全屏 | **事件视界**: 按钮坍缩为奇点 → 事件视界膨胀 → 全屏玻璃 (800ms, cinematic) |
| 日程切换 | opacity 200ms | **量子隧穿**: 旧内容粒子化消散 + 新内容从粒子重组 (400ms) |
| 图例筛选 | opacity 变化 | **退相干**: 隐藏元素先色散 → 褪色 → 缩小 (non-matching items decohere) 400ms |
| 进度条拖拽 | 实时跟随 | **引力拖拽**: 拖拽点产生磁力线效果 + 释放时弹性回弹 |

### 2.9 微交互增强

```
┌─ 磁性按钮 ────────────────────────────────────┐
│ 所有交互元素: 轻微吸附鼠标 (max offset 6px)     │
│ lerp: 0.1, 释放: elastic.out(1, 0.4)          │
│ hover 深度: 距中心越近 offset 越大              │
└───────────────────────────────────────────────┘

┌─ Z轴深度滑入 ──────────────────────────────────┐
│ 列表项 hover: translateZ(10px) + shadow 增强    │
│ 模拟卡片从屏幕平面浮出                           │
│ perspective: 800px on container                │
└───────────────────────────────────────────────┘

┌─ 粒子反馈 ─────────────────────────────────────┐
│ 完成任务: 对应行星迸发12颗粒子 → 轨道加速旋转     │
│ 新增任务: 粒子从虚空汇聚 → 凝结为行星球体         │
│ 删除任务: 行星坍缩 → 8方向粒子喷射 + 湮灭         │
└───────────────────────────────────────────────┘
```

---

## 3. 技术选型

| 层 | 选择 | 理由 |
|---|---|---|
| 框架 | Next.js 16 (App Router) | RSC 默认，最新稳定版 |
| 语言 | TypeScript strict | 70+ 文件规模必需 |
| 样式 | Tailwind CSS v4 + CSS Modules | Tailwind 排版/布局，CSS Modules 复杂视觉特效 |
| 状态管理 | React Context + useReducer | 无额外依赖，单页应用规模足够 |
| Canvas | Canvas 2D API | useRef + requestAnimationFrame，60fps |
| 存储 | localStorage + 自定义 Hook | 可后续迁移 IndexedDB |
| 包管理 | pnpm | 磁盘效率高 |
| 字体 | next/font → Clash Display / Satoshi / JetBrains Mono | 几何怪诞标题 + 人文正文 + 等宽时间 |
| 色彩 | oklch() 全系 | 现代广色域，精确控制亮度/色度 |
| 光标 | 自定义轨道光标 (CSS + Canvas) | 磁性跟随 + 上下文感知 |

---

## 4. 目录结构（70+ 文件）

```
orbitan/
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── package.json
├── .eslintrc.json
├── .prettierrc
├── public/
│   └── noise-texture.png
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── favicon.ico
│   ├── components/
│   │   ├── orbital/
│   │   │   ├── OrbitalClock.tsx
│   │   │   └── orbital-engine.ts
│   │   ├── layout/
│   │   │   ├── GeometricBg.tsx
│   │   │   ├── TitleHeader.tsx
│   │   │   ├── LegendBar.tsx
│   │   │   ├── LegendItem.tsx
│   │   │   └── AuxInfo.tsx
│   │   ├── schedule/
│   │   │   ├── ScheduleList.tsx
│   │   │   ├── ScheduleItem.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── TaskDetail.tsx
│   │   │   └── MiniOrbitPreview.tsx
│   │   ├── editor/
│   │   │   ├── EditPanel.tsx
│   │   │   ├── TaskForm.tsx
│   │   │   └── DeleteConfirm.tsx
│   │   ├── ui/
│   │   │   ├── ColorDot.tsx
│   │   │   └── ProgressSlider.tsx
│   │   └── orbit-mode/
│   │       ├── OrbitModeOverlay.tsx
│   │       ├── WeekTimeline.tsx
│   │       ├── TimeSlotColumn.tsx
│   │       ├── FocusBlock.tsx
│   │       ├── FocusBlockForm.tsx
│   │       ├── MethodSelector.tsx
│   │       ├── methods/
│   │       │   ├── GTDPanel.tsx
│   │       │   ├── PomodoroPanel.tsx
│   │       │   ├── ParetoPanel.tsx
│   │       │   ├── MoffattPanel.tsx
│   │       │   ├── HowellMatrix.tsx
│   │       │   └── SWOTPanel.tsx
│   │       └── LiquidGlass.tsx
│   ├── context/
│   │   ├── AppContext.tsx
│   │   └── appReducer.ts
│   ├── hooks/
│   │   ├── useTasks.ts
│   │   ├── useClock.ts
│   │   ├── useOrbital.ts
│   │   ├── useFilter.ts
│   │   ├── useDateNavigation.ts
│   │   ├── useKeyboard.ts
│   │   ├── usePomodoro.ts
│   │   ├── useMoffattScheduler.ts
│   │   ├── useParetoAnalysis.ts
│   │   └── useWeekView.ts
│   ├── types/
│   │   ├── task.ts
│   │   ├── orbital.ts
│   │   ├── focus-block.ts
│   │   └── methodology.ts
│   ├── utils/
│   │   ├── storage.ts
│   │   ├── time.ts
│   │   ├── color.ts
│   │   ├── constants.ts
│   │   ├── pareto.ts
│   │   └── moffatt.ts
│   └── data/
│       └── sample-tasks.ts
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

## 5. 数据模型

### 5.1 任务 (Task)

```typescript
interface Task {
  id: string;                    // "task_1714276800000_abc123"
  type: TaskType;               // "work" | "study" | "meeting" | "personal"
  name: string;                  // 中文任务名
  nameEn: string;                // 英文任务名
  time: string;                  // "HH:MM"
  duration: number;              // 分钟
  progress: number;              // 0~1
  completed: boolean;
  note: string;                  // 备注
  createdAt: number;             // timestamp
}
```

### 5.2 任务类型 (TaskType)

```typescript
type TaskType = "work" | "study" | "meeting" | "personal";
```

### 5.3 颜色映射 (超现实增强)

| 类型 | 中文 | 色值 | oklch() | 行星/圆点 |
|------|------|------|---------|-----------|
| work | 工作 | `#2962FF` | `oklch(0.45 0.25 265)` | 宝蓝 (精确/理性) |
| study | 学习 | `#F5C518` | `oklch(0.82 0.21 100)` | 暖黄 (能量/灵感) |
| meeting | 会议 | `#2D3748` | `oklch(0.25 0.03 250)` | 深灰 (正式/克制) |
| personal | 个人 | `#6B7280` | `oklch(0.45 0.01 260)` | 中灰 (中性/自洽) |

### 5.4 行星大小映射

| duration | radius |
|----------|--------|
| < 30min | 8px |
| 30-60min | 12px |
| 60-120min | 16px |
| > 120min | 20px |

### 5.5 聚焦块 (FocusBlock)

```typescript
interface FocusBlock {
  id: string;
  date: string;              // "2026-04-28"
  startTime: string;         // "09:30"
  endTime: string;           // "11:00"
  methodology: MethodType;   // "gtd"|"pomodoro"|"pareto"|"moffatt"|"howell"|"swot"
  title: string;
  color: string;
  progress: number;
  linkedTaskIds: string[];
  note: string;
}
```

### 5.6 全局状态 (AppState)

```typescript
interface AppState {
  tasks: Record<string, Task[]>;        // date → tasks
  focusBlocks: Record<string, FocusBlock[]>; // date → blocks
  currentDate: string;
  selectedTaskId: string | null;
  editingTaskId: string | null;
  activeFilter: TaskType | "all";
  editPanelOpen: boolean;
  deleteConfirmId: string | null;
  orbitMode: boolean;
  activeMethodology: MethodType | null;
}
```

---

## 6. 页面布局

### 6.1 几何切割背景

- 实现: `linear-gradient(135deg, #020208 0% 55%, #F0F0F0 55% 100%)` (Void Black → Cosmic White)
- `position: fixed; inset: 0; z-0`
- 切割线带**虹彩色散光晕**: 渐变线上叠加 `conic-gradient` 微光
- 切割线带**虹彩色散光晕**: 渐变线上叠加 `conic-gradient` 微光

### 6.2 区域定位

| 区域 | 定位 | z-index |
|------|------|---------|
| GeometricBg | fixed, inset 0 | 0 |
| LegendBar | fixed, top center | 30 |
| TitleHeader | fixed, left-8 top-[12%] | 20 |
| OrbitalClock | fixed, center (translate -50%,-50%) | 10 |
| ScheduleList | fixed, right-8 top-[10%] bottom-[5%], w-[340px] | 20 |
| AuxInfo | fixed, left-8 bottom-8 | 20 |
| EditPanel | fixed, right-0 top-0 bottom-0, w-[420px] | 40 |

### 6.3 响应式策略

- 流体缩放用 `clamp()` + `vw/vh`
- Canvas 尺寸: `min(45vw, 55vh)` @ 1920×1080
- ScheduleList 宽度: 280px→380px 随分辨率

---

## 7. Canvas 轨道引擎

### 7.1 渲染分层

| Layer | 内容 | 刷新 |
|-------|------|------|
| 1 | 星云轨道 + 金属表盘 | 静态 |
| 2 | 行星 + 时钟指针 | 60fps |
| 3 | 粒子星云 (200颗) | 静态 (每3帧微扰) |
| 4 | 复古噪点纹理 | 静态 (预加载PNG) |

### 7.2 螺旋星云轨道

- 阿基米德螺旋: `r = 60 + orbit * 45` (6圈)
- 颜色交替: 奇数圈#F5C518, 偶数圈#2962FF (学习黄 + 工作蓝)
- opacity: 0.08~0.15，外圈渐淡

### 7.3 3D 金属表盘

- 外框: 4px 渐变金属环 (#444→#888→#666→#CCC→#444)
- 刻度: 12个白点，12点加粗
- 指针: 时/分白色，秒暖黄 (#F5C518)
- 表盘: #0A0A0A

### 7.4 行星球体

- 径向渐变模拟3D光照 (高光→主色→暗面→阴影)
- 进度环外圈弧线
- 投影椭圆阴影 (y+3px, rgba(0,0,0,0.3))
- 左上角白色高光反光点

### 7.5 行星位置计算

```typescript
function getPlanetPosition(task: Task): { x, y } {
  const [h, m] = task.time.split(":").map(Number);
  const angle = ((h - 6 + m / 60) / 24) * 2π;
  const orbitIndex = Math.floor((h - 6) / 4);
  const radius = 90 + orbitIndex * 45;  // 90→315px
  return { x: cx + cos(angle)*radius, y: cy + sin(angle)*radius };
}
```

### 7.6 行星点击检测

- hit-test: 点到行星中心距离 ≤ radius
- 命中 → `dispatch(SELECT_TASK)` → 列表联动滚动

---

## 8. 日程列表交互

### 8.1 ScheduleItem 结构

- 时间点 (HH:MM) + 彩色圆点 + 中英双语名称 + 进度条
- 排序: `time` 升序
- hover: `bg-white/5`，行星 scale 1.2
- 选中: `bg-white/8`，行星 scale 1.35 + 光晕

### 8.2 ProgressBar 拖拽

- mousedown → mousemove 实时更新 → mouseup 持久化
- requestAnimationFrame 节流
- 拖拽时颜色过渡: 默认灰 → 任务类型色
- 0% / 100% 处轻微吸附

### 8.3 TaskDetail 展开

- max-height 0→200px + opacity 动画
- 手风琴模式 (同时只有一个展开)
- 展开时自动 scrollIntoView

### 8.4 EditPanel

- 右侧滑出: translateX(100%→0), 350ms cubic-bezier
- 关闭: translateX(0→100%), 250ms
- 主界面遮罩: bg-black/30 + backdrop-blur
- 表单字段: 任务类型/名称/英文名/时间/时长/备注

---

## 9. 图例筛选 & 日期导航

### 9.1 LegendBar

- 4个图例标签 + "全部"
- 选中: 底划线 + 加粗 + 圆点脉冲
- 未选中: opacity 0.5
- 筛选: 非匹配行星opacity 0.15, 列表条目opacity 0.3

### 9.2 日期导航

- 本周内自由切换 (周一~周日)
- ◀ ▶ 按钮 + "今天"快捷
- 切换动画: 列表fade 200ms
- MiniOrbitPreview: 80×80 迷你Canvas轨道缩略图

---

## 10. orbit mode 聚焦模式

### 10.1 启动流程

1. 点击右下角 🪐 按钮
2. 液态玻璃层动画 (**事件视界** 800ms): 按钮坍缩为奇点 → 事件视界膨胀 → 全屏玻璃 + backdrop-filter 稳定
3. 显示周视图时间轴 + 方法论选择器

### 10.2 液态玻璃动画

- SVG gooey滤镜: feGaussianBlur(12) + feColorMatrix
- SVG 纹理滤镜: feTurbulence + feColorMatrix + feBlend(overlay)
- CSS backdrop-filter: blur(20px) saturate(180%)
- 发光边框: border-image gradient + box-shadow

### 10.3 周视图

- 7列时间轴 (周一~周日)
- 每列: 06:00~22:00，30min刻度
- 普通任务: 彩色填充块
- 聚焦块: 发光液态玻璃块 (focus-pulse动画)

### 10.4 聚焦块样式

```css
.focus-block {
  background: linear-gradient(135deg, rgba(41,98,255,0.15), rgba(41,98,255,0.08), rgba(245,197,24,0.06));
  border: 1.5px solid gradient;
  box-shadow: 0 0 20px rgba(124,58,237,0.15), 0 0 60px rgba(124,58,237,0.05);
  backdrop-filter: blur(8px);
  animation: focus-pulse 3s infinite;
}
```

### 10.5 六种方法论

| 模式 | 核心面板 | 关键交互 |
|------|---------|---------|
| GTD | Inbox + Next Actions + 项目列表 | 捕捉→澄清→整理流 |
| 番茄钟 | SVG圆环倒计时 + 循环指示 | 25/5min, 4循环, 自动切换 |
| 帕累托 | Vital 20% 高亮 + Rest 80% 列表 | 按ROI排序, 累积impact超80% |
| 莫法特 | 当前轮换类别 + 倒计时 + 待办队列 | DeepWork/ShallowWork/Learning/Maintenance 自动轮换 |
| 豪威尔矩阵 | 2×2 四象限 (紧急/重要) | 拖拽分配, 颜色分区 |
| SWOT | 2×2 网格 (S/W/O/T) | 添加条目, 导出分析 |

---

## 11. 状态管理

### 11.1 Reducer Actions

```typescript
type AppAction =
  | { type: "LOAD_TASKS"; payload: Record<string, Task[]> }
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
```

### 11.2 数据流核心路径

```
localStorage → AppReducer → Tasks (date-filtered)
                          → FocusBlocks (date-filtered)
                          → currentDate / filter / methodology
                          → UI components
```

### 11.3 双向联动

- 行星点击 → SELECT_TASK → 列表滚动
- 列表点击 → SELECT_TASK → 行星高亮
- 进度拖拽 → UPDATE_PROGRESS → 行星弧线更新
- 筛选点击 → SET_FILTER → 行星/列表同步显隐
- 日期切换 → SET_DATE → 全量重算

---

## 12. 动画系统 (超现实增强)

| 动画 | 原方案 | 超现实增强 | 时长 | 缓动 |
|------|--------|-----------|------|------|
| 页面入场 | 各区域 fade+up | **色散入场**: RGB通道分离→合焦 | 600ms | staggered |
| 编辑面板滑入 | translateX | **时空撕裂**: 色散拖尾+故障闪现 | 350ms | cubic-bezier |
| 详情展开 | max-height+opacity | 保留 | 300ms | ease |
| 行星hover | scale 1.2 | **引力透镜**: scale 1.25 + 位移扭曲 | 200ms | ease-out |
| 行星选中 | scale+光晕 | **超新星脉冲**: 虹彩环扩散+粒子喷射 | 350ms | ease-out-back |
| 筛选显隐 | opacity+scale | **退相干**: 色散→褪色→缩小 | 400ms | cubic-bezier |
| Orbit Mode入场 | 按钮脉冲→全屏 | **事件视界**: 坍缩→膨胀→全屏玻璃 | 800ms | cinematic |
| 聚焦块呼吸 | box-shadow | 保留 | 3s loop | ease-in-out |
| 日期切换 | opacity 200ms | **量子隧穿**: 粒子消散→重组 | 400ms | custom |
| 图例筛选(非匹配) | opacity变化 | **退相干**: 色散→褪色→缩小 | 400ms | cubic-bezier |
| 进度条拖拽 | 实时跟随 | **引力拖拽**: 磁力线+弹性回弹 | 实时 | spring |

### 12.1 Staggered 入场

```
0ms   → TitleHeader (chromatic converge 600ms)
100ms → LegendBar
200ms → OrbitalClock
400ms → ScheduleList
500ms → AuxInfo
```

### 12.2 自定义轨道光标

```
外层环 (40px): lerp 0.08 — 慢速漂移跟随
内层点 (8px):  lerp 0.15 — 精确定位
hover任务:     内环扩大至56px + 任务类型色发光
click:         环波纹扩散 (ripple 600ms)
```

---

## 13. 键盘快捷键

| 按键 | 作用 |
|------|------|
| `Esc` | 关闭面板/收起详情/取消筛选/退出Orbit Mode |
| `N` | 新增任务 |
| `←` `→` | 前一天/后一天 |
| `T` | 回到今天 |
| `1-4` | 筛选: 工作/学习/会议/个人 |
| `0` | 清除筛选 |
| `Del` | 删除选中任务 (确认后) |
| `O` | 切换 Orbit Mode |

---

## 14. 配色方案 (超现实增强)

### 14.1 基础色

| 用途 | 色值 | oklch() |
|------|------|---------|
| Void Black (背景黑) | `#020208` | `oklch(0.05 0 270)` |
| Cosmic White (背景白) | `#F0F0F0` | `oklch(0.95 0 0)` |
| Cosmic Violet (超现实强调) | `#7C3AED` | `oklch(0.45 0.28 290)` |

### 14.2 任务类型色

| 类型 | 色值 | oklch() | 语义 |
|------|------|---------|------|
| 工作蓝 | `#2962FF` | `oklch(0.45 0.25 265)` | 精确/理性 |
| 学习黄 | `#F5C518` | `oklch(0.82 0.21 100)` | 能量/灵感 |
| 会议深灰 | `#2D3748` | `oklch(0.25 0.03 250)` | 正式/克制 |
| 个人中灰 | `#6B7280` | `oklch(0.45 0.01 260)` | 中性/自洽 |

### 14.3 霓虹发光 (仅超现实强调)

| 用途 | 色值 | oklch() |
|------|------|---------|
| 赛博蓝 | `oklch(0.7 0.28 250)` | hover 发光 |
| 脉冲金 | `oklch(0.85 0.24 95)` | 选中脉冲 |
| 紫电 | `oklch(0.55 0.30 290)` | 超现实点缀 |

### 14.4 材质色

| 材质 | 说明 |
|------|------|
| 金属边框 | `#444 → #888 → #666 → #CCC → #444` (拉丝效果) |
| 表盘底色 | `#0A0A0A` |
| 刻度/指针 | `#E5E5E5` |

---

## 15. 实现路线图

### Phase 1: 骨架搭建
1. Next.js 项目初始化 (create-next-app)
2. 目录结构 + 类型定义
3. Context + Reducer
4. 几何切割背景 (Void Black / Cosmic White) + 5区域空壳布局

### Phase 2: 核心视觉
5. Canvas 轨道引擎 (时钟 + 星云 + 粒子 + 动态噪点 + 体积光)
6. 行星渲染 + 位置计算 (色散/引力透镜效果)
7. 行星点击检测 + 联动

### Phase 3: 日程功能
8. 日程列表渲染 + 排序
9. 进度条拖拽 (引力拖拽效果)
10. 详情展开/收起
11. 编辑面板 (时空撕裂入场)
12. 删除确认
13. localStorage 持久化

### Phase 4: 辅助功能
14. 图例筛选 (退相干效果)
15. 日期导航 + MiniOrbitPreview
16. 键盘快捷键
17. 页面入场动画 (色散合焦)
18. 自定义轨道光标

### Phase 5: Orbit Mode
19. 液态玻璃层 + 事件视界动画
20. 周视图时间轴
21. 聚焦块创建/渲染
22. 方法论选择器
23. GTD 面板
24. 番茄钟面板
25. 帕累托面板
26. 莫法特面板
27. 豪威尔矩阵面板
28. SWOT 面板

### Phase 6: 文档
29. README
30. CHANGELOG
31. FEATURES
32. 6篇方法论文档

### Phase 7: 打磨
33. 响应式适配
34. 性能优化 (Canvas 60fps 锁定)
35. 最终QA

---

## 16. 约束与边界

| 约束 | 说明 |
|------|------|
| 零依赖 (UI库) | 不使用 shadcn/ui 或其他组件库，全部手写 |
| 纯CSS动画 | 无 framer-motion，使用 CSS transitions + keyframes + Canvas |
| 无后端 | 纯前端，localStorage 存储 |
| 一周视图 | GTD/莫法特等面板在周视图内，不额外弹窗 |
| 桌面优先 | 不处理移动端 (< 1024px) |

---

## 17. 设计决策记录

| 决策 | 选项 | 理由 |
|------|------|------|
| Canvas vs SVG | Canvas 2D | 星云渐变+粒子+噪点+金属高光均需Canvas |
| Context vs Zustand | React Context + useReducer | 零依赖，单页规模足够 |
| Tailwind vs 纯CSS | 混合 | Tailwind布局/排版，复杂视觉用CSS Modules |
| App Router vs Pages | App Router | Next.js 16默认，RSC优势 |
| 按日vs周视图 | 日为主，周在Orbit Mode | 主界面简洁，Orbit Mode扩展为周视图 |
| Clash Display + Satoshi | over Inter/Roboto | 几何怪诞+人文感 = 超现实先锋，拒绝AI slop |
| oklch() 色彩空间 | over hex | 现代广色域，精确控制亮度/色度/色相 |
| 35步实现 | over 34 | 新增: 自定义轨道光标 + 超现实动画

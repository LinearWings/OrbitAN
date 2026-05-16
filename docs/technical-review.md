# OrbitAN 技术审查报告

**生成日期**: 2026-04-29  
**项目版本**: 0.1.0  
**审查范围**: 全量代码审查 + 13 项已知问题根因分析

---

## 目录

1. [审查概述](#1-审查概述)
2. [架构全景](#2-架构全景)
3. [根因分析：P0 — 崩溃/阻塞项](#3-根因分析p0--崩溃阻塞项)
4. [根因分析：P1 — 功能性 bug](#4-根因分析p1--功能性-bug)
5. [根因分析：P2 — 视觉大修](#5-根因分析p2--视觉大修)
6. [根因分析：P3 — 动画与交互](#6-根因分析p3--动画与交互)
7. [根因分析：P4 — 技术债务](#7-根因分析p4--技术债务)
8. [改进计划](#8-改进计划)
9. [执行策略](#9-执行策略)

---

## 1. 审查概述

OrbitAN（轨道计划）是一个以宇宙为主题的日程规划应用，采用 Next.js 16 (App Router) + React 19 + TypeScript strict + Tailwind CSS v4 构建。核心特色是 Canvas 2D 轨道时钟渲染引擎，以及 6 种时间管理方法论的内置面板（GTD、Pomodoro、Pareto、Moffatt、Howell、SWOT）。

本次审查涵盖全部 13 项已知问题，覆盖渲染管线、状态管理、交互逻辑、数据持久化和视觉效果。

### 项目规模

| 维度 | 数据 |
|------|------|
| 源文件 | ~45 文件 |
| 类型定义 | 18 个接口/类型 |
| Canvas 渲染管线 | 4 层（静态轨道 → 动态时钟 → 交互层 → 噪点叠加） |
| 状态管理 | Context + useReducer + localStorage 自动持久化 |
| 方法论面板 | 6 个独立组件 |

---

## 2. 架构全景

### 2.1 目录结构

```
src/
├── app/                 # Next.js 页面/布局
├── components/
│   ├── editor/          # 编辑面板（右滑出）
│   ├── layout/          # 标题头、日期导航、图例
│   ├── orbital/         # 轨道时钟引擎 + 方法论面板
│   └── schedule/        # 任务列表组件
├── context/             # AppContext (useReducer)
├── data/                # 常量 + 默认值
├── hooks/               # 自定义 hooks
├── types/               # TypeScript 类型定义
└── utils/               # 工具函数（time, colors, orbital, storage）
```

### 2.2 数据流

```
localStorage (orbital_schedule_v1)
       ↕
  AppContext (useReducer)
       ↕
  自定义 Hooks (useTasks, useFilter, useEditPanel...)
       ↕
  React 组件 + Canvas 渲染引擎
```

### 2.3 Canvas 渲染管线（orbital-engine.ts）

```
renderFrame()
  1. clearRect
  2. drawOrbitRings()     — 6 条阿基米德螺旋轨道
  3. drawClockDial()      — 4 层金属斜角表盘
  4. drawNebulaParticles() — 200 粒子星云
  5. drawComet() [循环]    — 慧星拖尾多边形 + 头部核心
  6. drawCometLabel() [循环] — 标签
  7. drawClockHands()     — 时分秒针
  8. drawFilmGrain()      — 噪点叠加层 (overlay blend)
```

---

## 3. 根因分析：P0 — 崩溃/阻塞项

### P0a: React Key 重复 `Encountered two children with the same key, '1777451297827'`

**严重性**: 阻塞性 — 违反 React 核心契约，可能导致元素重复/丢失

**影响组件**:
- `SWOTPanel.tsx:67` — `id: \`${Date.now()}\``
- `ParetoPanel.tsx:38` — `const id = \`${Date.now()}\``
- `MoffattPanel.tsx` — 使用 `\`${idx}\``（序列初始化 OK 的）
- `HowellMatrix.tsx:49` — `id: \`${Date.now()}\``
- `GTDPanel.tsx:12` — 使用 `uid()` 带有 `Math.random() + Date.now()`（✅ OK 的）

**根因**: `Date.now()` 在毫秒级别返回相同值。当用户在 <1ms 内连续添加多个项目时，生成相同的 ID。

**证据链**:
```
SWOTPanel.tsx:    id: `${Date.now()}`       ← 同一毫秒内重复
ParetoPanel.tsx:  const id = `${Date.now()}` ← 同一毫秒内重复  
HowellMatrix.tsx: id: `${Date.now()}`        ← 同一毫秒内重复
GTDPanel.tsx:     uid() = Math.random()+Date.now()  ← 足够随机
```

### P0b: SWOT 浅拷贝 + 数组突变

**文件**: `SWOTPanel.tsx:55-59`

**根因**: `const next = { ...d }` 仅浅拷贝对象。`next[section]` 仍然指向 `d[section]` 的同一数组引用。使用 `push(item)` 突变了原始状态。

```typescript
// 当前（错误）
const next = { ...d } as SWOTData;
(next[section] as QuadrantItem[]).push(item); // 突变了原始数组！

// 正确
const next = { ...d } as SWOTData;
next[section] = [...next[section], item];
```

### P0c: 番茄钟无法启动

**文件**: `PomodoroPanel.tsx`

**根因**: Timer 逻辑存在 3 个耦合缺陷：

1. **初始化时序缺陷**：第 46-48 行的 `useEffect` 在挂载时无条件设置 `remaining`（即使 `running=false`）。在 React 19 Strict Mode 下，双重调用可能导致 `remaining` 被重置为空状态。

2. **闭包 stale capture**：第 85-89 行的 `reset()` 从组件顶层的解构中捕捉 `focusDuration`。由于 `POMODORO_DEFAULTS` 是常量，这应该能工作——但如果 `remaining` 从未被正确初始化（见 #1），点击"开始"（`running=true`）时 timer 从 `remaining=0` 或 `remaining=NaN` 启动。

3. **`setPhase` 在 `setRemaining` 回调内部调用**（第 63-78 行）：React 可以将这两者批处理在同一个渲染周期中，但 interval 的 `useEffect` 清理函数依赖 `phase` 的当前值。当在 `setRemaining` 回调内部调用 `setPhase` 时，interval 清理发生在 `useEffect` 重新运行之前，导致短暂的双重 interval 或无 interval 状态。

**核心 bug 路径**:
```
点击"开始" → setRunning(true)
  → useEffect 启动 interval（deps: [running=true, phase="focus", ...]）
  → interval fires: remaining = 0
    → setRemaining 回调检查 r > 0: false
    → setPhase("shortBreak")  // 在 setRemaining 回调内部
    → return nextDur
  → React 批处理: phase="shortBreak", remaining=nextDur
  → cleanup old interval
  → start new interval with phase="shortBreak"
  → 如果 phase transition 逻辑中的 focusCount 是 stale 的 → 循环
```

---

## 4. 根因分析：P1 — 功能性 bug

### P1a: 莫法特休息法 Timer 忽略 `isRunning`

**文件**: `MoffattPanel.tsx:43`

**根因**: Timer `useEffect([])` 在挂载时无条件启动，从不停止。`isRunning` 状态已在组件中声明（第 35 行）但从未用于守卫 timer。

```typescript
// 当前
useEffect(() => {
  const id = setInterval(() => { ... }, 1000);
  return () => clearInterval(id);
}, []); // 没有 isRunning 守卫
```

### P1b: Moffatt 完成动画不断触发

**文件**: `MoffattPanel.tsx:120-122`

**根因**: `allCompleted` 是一个计算值，不是状态标志。当 timer 运行且所有会话完成时，`allCompleted` 持续为 true，使 `animate-pulse` 在每一次渲染中不断触发。

### P1c: GTD 缺少删除功能

**文件**: `GTDPanel.tsx:117-130`

**根因**: `Card` 组件有两个按钮（◀/▶）但完全缺少删除按钮。没有 `onDelete` 回调。用户无法移除已完成的条目或误添加的条目。

### P1d: Pareto `badge` CSS 类兼容性

**文件**: `ParetoPanel.tsx:85`

**根因**: `badge` 不是 Tailwind v4 的标准类。在 TW v4 中，如果项目配置中没有显式的 `badge` 工具类定义，类如 `badge bg-blue-600 text-white text-xs px-2 py-1 rounded-full` 会失败。

---

## 5. 根因分析：P2 — 视觉大修

### P2a: 行星在表盘内部

**文件**: `orbital-engine.ts:780-785` + `utils/colors.ts:40-46`

**根因**: 两个不匹配的坐标系：

1. 表盘半径：`dialRadius = maxRadius * 0.9`（相对于 canvas 动态缩放）
2. 慧星轨道半径：`getCometOrbitRadius()` 返回固定像素值 90-315px

当 canvas 尺寸较小时（`maxRadius < 350px`），`dialRadius`（0.9 × maxRadius）大于或等于慧星的轨道半径，导致慧星绘制在表盘内部。

| canvas 宽度 | maxRadius (×0.4) | dialRadius (×0.9) | 慧星轨道半径 (min) | 慧星位置 |
|-------------|-------------------|--------------------|--------------------|----------|
| 800px       | 320px             | 288px              | 90-315px           | ✅ 外部   |
| 500px       | 200px             | 180px              | 90-315px           | ❌ 重叠   |
| 400px       | 160px             | 144px              | 90-315px           | ❌ 内部   |

### P2b: 彗星拖尾美感不足

**文件**: `orbital-engine.ts:552-610`

**根因**:
- 拖尾多边形使用二次渐变 `halfW = tailWidth * t²`（第 579 行），尾部非常细（接近不可见）
- 渐变透明度太低：尾部 0% → 40% 位置 8% → 75% 位置 18% → 头部 35%
- 没有动态粒子尾迹
- 没有发光/辉光渲染
- 没有微粒/星尘沿拖尾

### P2c: 粒子特效设计

**文件**: `orbital-engine.ts:57-67, 236-265`

**根因**:
- 200 个粒子过多，在 canvas 上表现为白色噪声而非星云
- 尺寸太小（0.5-2px）
- 只有 2 种颜色（琥珀色 50% / 蓝色 50%），缺乏紫色/白色变化

### P2d: 标签页编号显示索引而非任务数

**文件**: `LegendBar.tsx:22, 42`

**根因**:
- 第 22 行：`全部` 徽章显示硬编码的 `0`
- 第 42 行：各类型显示数组索引 `{idx + 1}`（即 1, 2, 3, 4）

需要改为从 `state.tasks[currentDate]` 读取并按类型统计。

### P2e: 背景 UI：故障色块 → 噪点渐变

**文件**: `globals.css:72-152`

**根因**: 当前背景有 5 层 `linear-gradient` 创建故障色块效果。在轨道时钟引擎中的影片颗粒渲染（`drawFilmGrain`，叠加层混合模式，4% 透明度）与 CSS 背景中的故障色块不协调。用户希望背景视觉与影片颗粒美学一致。

### P2f: 方法论图标用 SVG 替换 Emoji

**文件**: `defaults.ts:72-115` + `MethodSelector.tsx`

**根因**: 所有 6 个 MethodologyType 条目使用 emoji 字符（"📥", "🍅", "📊", "🔄", "📐", "🔍"）。`MethodSelector.tsx` 将它们渲染为 `<span>` 文本。需要替换为 SVG 内联组件以提升显示一致性（不同操作系统上的 emoji 渲染不一致）。

---

## 6. 根因分析：P3 — 动画与交互

### P3a: Orbit Mode 切换没有丝滑过渡

**文件**: `page.tsx:70` + `OrbitModePage.tsx`

**根因**: `{isOrbitModeOpen && <OrbitModePage />}` — 简单的条件渲染，没有 enter/leave 动画。`OrbitModePage` 上有 CSS 类 `animate-event-horizon`，但 `@keyframes event-horizon` 未在 `globals.css` 中定义。

### P3b: GTD 缺少拖拽支持

**文件**: `GTDPanel.tsx`

**根因**: 只有 ◀/▶ 按钮用于在阶段间移动。没有直观的拖放交互。相比之下，`HowellMatrix.tsx` 实现了 HTML5 拖放 API。

---

## 7. 根因分析：P4 — 技术债务

### P4a: Pareto 空字符串拼接

**文件**: `ParetoPanel.tsx:100`

```typescript
className={`...` + (0 ? "" : "")}
```
表达式 `(0 ? "" : "")` 总是产生空字符串，对样式无影响。

### P4b: Pomodoro `as any`

**文件**: `PomodoroPanel.tsx:5, 55`

```typescript
import { POMODORO_DEFAULTS } from "@/data/constants";
const { focusDuration, ... } = POMODORO_DEFAULTS as any;
```
类型错误：`POMODORO_DEFAULTS` 已被正确定义了属性。`as any` 隐藏了潜在的类型错误。

### P4c: SWOT `React.useEffect`

**文件**: `SWOTPanel.tsx:57`

```typescript
React.useEffect(() => { ... }, []);
```
不一致：文件顶部没有从 `"react"` 导入 `useEffect`。所有其他面板在顶部导入 `useEffect`。

---

## 8. 改进计划

### P0 — 崩溃/阻塞项（必须立即修复）

| ID  | 问题              | 文件                | 修复方案                                                                    |
| --- | ----------------- | ------------------- | --------------------------------------------------------------------------- |
| P0a | React key 重复    | 所有 Panel          | 创建统一 `uid()` 工具函数：`math.random + Date.now + counter`。替换全部 `Date.now()` ID 生成 |
| P0b | SWOT 数组突变     | SWOTPanel.tsx:55-59 | 用 `next[section] = [...next[section], item]` 替换 `push()`                    |
| P0c | Pomodoro 无法启动 | PomodoroPanel.tsx   | 重写 timer：ref-based interval 管理，分离 phase transition 与 remaining 更新     |

### P1 — 功能性 bug

| ID  | 问题                        | 文件                     | 修复方案                                    |
| --- | --------------------------- | ------------------------ | ------------------------------------------- |
| P1a | Moffatt timer 忽略 running   | MoffattPanel.tsx:43      | Timer 添加 `isRunning` 守卫                   |
| P1b | Moffatt 完成动画不断触发     | MoffattPanel.tsx:120     | 用 `useState` 标志追踪是否已展示过完成动画      |
| P1c | GTD 缺少删除功能              | GTDPanel.tsx:117-130     | 添加 `onDelete` 回调和删除按钮                 |
| P1d | Pareto badge CSS 兼容性      | ParetoPanel.tsx:85, 105  | 用内联组件替换 `badge` 类                      |

### P2 — 视觉大修

| ID  | 问题                  | 文件                          | 修复方案                                                       |
| --- | --------------------- | ----------------------------- | -------------------------------------------------------------- |
| P2a | 表盘缩小到 60%        | orbital-engine.ts:784         | `dialRadius = maxRadius * 0.6`，轨道半径相对于表盘外径         |
| P2b | 彗星拖尾美感增强      | orbital-engine.ts:552-674     | 增加辉光粒子、更宽的发光光晕、头部星爆效果                     |
| P2c | 粒子重新设计          | orbital-engine.ts:236-265     | 80 粒子，更大尺寸 1.5-4px，3 种颜色，降低漂移速度                |
| P2d | 背景重设计            | globals.css:72-152            | 深色渐变 + 微妙边缘发光 + CSS 噪点                              |
| P2e | 标签页编号反映真实计数 | LegendBar.tsx:22,42           | 通过 `useTasks()` 注入真实计数                                    |
| P2f | 6 个 SVG 方法论图标   | defaults.ts + MethodSelector  | 自定义 SVG 内联图标                                              |

### P3 — 动画与交互

| ID  | 问题                | 文件                            | 修复方案                                        |
| --- | ------------------- | ------------------------------- | ----------------------------------------------- |
| P3a | Orbit Mode 切换动画 | page.tsx + OrbitModePage.tsx    | `@keyframes fade-scale-in` + 100ms 延迟 unmount |
| P3b | GTD 拖拽支持        | GTDPanel.tsx                    | 实现 HTML5 拖放 API                             |

### P4 — 技术债务

| ID  | 问题                    | 文件                  | 修复方案                               |
| --- | ----------------------- | --------------------- | -------------------------------------- |
| P4a | Pareto 空字符串拼接     | ParetoPanel.tsx:100   | 删除 `+ (0 ? "" : "")`                |
| P4b | Pomodoro `as any`       | PomodoroPanel.tsx:5   | 删除 `as any`，使用正确的类型推断      |
| P4c | SWOT React.useEffect    | SWOTPanel.tsx         | 添加 `import { useEffect } from "react"` |

---

## 9. 执行策略

按 4 个批次顺序执行，每批完成后验证 `tsc --noEmit` 构建：

```
批次 1 (P0): 崩溃修复      → 3 项修复，文件：SWOTPanel, ParetoPanel, PomodoroPanel + uid()
批次 2 (P1): 功能完整性    → 4 项修复，文件：MoffattPanel, GTDPanel, ParetoPanel
批次 3 (P2): 视觉大修      → 6 项修复，文件：orbital-engine, globals.css, LegendBar, defaults.ts, MethodSelector
批次 4 (P3+P4): 动画+清理 → 5 项修复，文件：OrbitModePage, GTDPanel, ParetoPanel, PomodoroPanel, SWOTPanel
```

**每次构建后**: `npx tsc --noEmit` + LSP diagnostics（受影响文件）

---

# OrbitAN

A cosmic-themed daily schedule planner — 24-hour orbital clock visualization, six time-management methodologies, and an isometric pseudo-3D engine. Built as a pure client-side SPA with zero external runtime dependencies.

> A day is an orbit. Focus is your gravity.

![License](https://img.shields.io/badge/license-MIT-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4)

---

## Quick Start / 快速开始

```bash
pnpm install
pnpm dev        # → http://localhost:3000 (landing 落地页)  |  /orbit (应用)
pnpm build      # Production build → out/
pnpm lint       # ESLint
```

Requires **Node.js ≥18** and **pnpm**.

GitHub Pages production builds use the `/OrbitAN` base path automatically. Local dev runs from `/` for simpler testing.

---

## Features / 功能特性

### Orbital Clock Visualization / 轨道时钟可视化

- 24-hour radial Canvas 2D clock with constructivist geometry and 6 concentric orbit rings
- Tasks rendered as **comet trails** and **glass-sphere planet heads** — segmented arcs with varying opacity
- **Overlap-aware ring assignment**: overlapping time slots push to outer rings; non-overlapping tasks share rings
- Clock hands (blue accent), day/night sector shading (amber 06–18, blue 18–06), 3-tier tick marks
- Real-time animation at device refresh rate with offscreen canvas caching for static background
- **Isometric pseudo-3D engine**: 8 rendering layers, planet glass spheres with atmosphere/subsurface scattering/Fresnel rim light, 80-particle nebula field

### Six Time-Management Methodologies / 六种时间管理方法论

| Methodology | 方法论 | Panel | Core Mechanic |
|---|---|---|---|
| **GTD** | 搞定工作法 | 5-stage kanban / 五列看板 | Drag-and-drop inbox→next→waiting→someday→done |
| **Pomodoro** | 番茄工作法 | Timer + ring progress | 25min focus / 5min break cycles, long break every 4 |
| **Pareto** | 帕累托法则 | 80/20 analysis | Impact/effort scoring with bar chart visualization |
| **Moffatt** | 莫法特休息法 | 8-session timer | 8×25min timed sessions with progress tracking |
| **Howell Matrix** | 豪威尔矩阵 | 2×2 quadrant | Urgent/important drag-and-drop matrix |
| **SWOT** | SWOT分析法 | 2×2 analysis grid | Strengths/weaknesses/opportunities/threats |

All methodologies persist data to localStorage alongside task data.

### Focus Blocks System / 专注块系统

- Time-boxed methodology sessions displayed as colored arcs on the clock's outer rings
- Four statuses: planned → active → paused → completed
- Method-specific colors: GTD green, Pomodoro red, Pareto blue, Moffatt purple, Howell orange, SWOT amber
- Schedule cards with PCB-routing-style connector arrows

### Landing Page — Orbital Control Station / 轨道控制站落地页

- **Deep Space layer**: Nebula glows, star field (50 points with micro-flicker), far-field Tyndall beams
- **Instrument layer**: LiveClock with precision casing, 6 rotating orbit rings, status indicators
- **Interface layer**: Instrument panels, sequential timeline, docking CTA
- Parallax-scrolling depth system (0.1× / 0.5× / 1.0×), orchestrated page-load animation sequence
- Color discipline: Blue = structure, Amber = status, Violet = atmosphere

### More Features / 更多特性

- **Full keyboard navigation** / 全键盘操作: ← → T N O Delete Escape 1-4 0
- **Mobile-first** / 移动优先: Touch swipe, left-swipe delete, long-press drag, 44px touch targets
- **localStorage persistence** / 本地持久化 with schema migration (v1→v2)
- **Custom task types** / 自定义任务类型 with configurable colors
- **i18n** / 国际化: Chinese (zh, default) and English (en), ~70 translation keys
- Week & month views, progress tracking with auto-timer, film grain overlay, custom orbital cursor

---

## Tech Stack / 技术栈

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Runtime | React 19 + TypeScript 6 |
| Styling | Tailwind CSS v4 + custom CSS effects |
| State | React Context + useReducer |
| Persistence | localStorage with schema versioning |
| Rendering | Canvas 2D (dual engines: orbital + isometric pseudo-3D) |
| Fonts | Clash Display, Satoshi (Fontshare) + JetBrains Mono (Google Fonts) |
| Package manager | pnpm |
| Deployment | GitHub Pages (static export, `basePath: "/OrbitAN"`) |

**Zero external runtime dependencies** — only `next`, `react`, and `react-dom`. No React Query, Zustand, date-fns, Framer Motion, or UI libraries.

---

## Project Structure / 项目结构

```
src/
├── app/
│   ├── (landing)/         # Landing page + /docs/*
│   │   ├── page.tsx       # Orbital Control Station landing
│   │   └── docs/          # Tutorial, methodology, usage, changelog
│   ├── orbit/             # Main schedule application
│   │   └── page.tsx       # ~1137 lines — core app page
│   ├── layout.tsx         # Root layout (fonts, metadata)
│   ├── providers.tsx      # Client-side AppProvider wrapper
│   └── globals.css        # Global styles + Tailwind v4
├── components/
│   ├── orbital/           # Canvas engines, clock, 6 methodology panels
│   ├── layout/            # Title, date nav, week/month grids, arrows
│   ├── schedule/          # Schedule cards, progress bars
│   ├── editor/            # Task editor, inline creator, delete confirm
│   ├── focus/             # Focus block cards, timeline overlay
│   ├── landing/           # LiveClock, LangSwitch
│   ├── docs/              # Docs overlay + navigation
│   └── ui/                # SVG icon set
├── context/               # AppContext — centralized reducer + persistence
├── hooks/                 # 12 custom hooks (useTasks, useKeyboard, useClock, etc.)
├── lib/                   # i18n dictionary (~70 keys, zh/en)
├── types/                 # Task, FocusBlock, AppState, methodology types
├── utils/                 # Orbital math, time utils, storage, colors, UID
└── data/                  # Constants, defaults, focus method configs
```

---

## Architecture / 架构

**State flow / 状态流**: User interaction → dispatch action → reducer updates `AppState` → components re-render → localStorage persistence (skipping initial render).

**20 reducer actions** covering tasks, focus blocks, view mode, filters, selection, and edit panel state. **12 custom hooks** following one-hook-per-concern.

**Two Canvas 2D engines** (no WebGL/Three.js):
1. **Orbital Engine** — 2D constructivist clock with offscreen canvas caching
2. **Isometric Engine** — Pseudo-3D projection (cos30° axes), 8 render layers

**Static export** (`output: "export"`): Pure client-side SPA. No SSR, no API routes, no middleware. All pages use `"use client"`. Deployed at `basePath: "/OrbitAN"`.

---

## Design Language / 设计语言

- **Palette**: Deep space blue-black `#06080D`, instrument blue `#3B82F6`, alert amber `#F59E0B`, nebula violet `#6366F1`
- **Three depth layers**: Deep Space (0.1× parallax) → Instrument (0.5×) → Interface (1.0×)
- **Tyndall effect**: Near-field narrow beams + far-field wide beams with dust particles
- **Orchestrated load sequence**: 1200ms staggered reveal across all layers
- **Fonts**: Clash Display (headings), Satoshi (body), JetBrains Mono (data/tabular)

---

## Documentation / 文档

- [Tutorial / 教程](/OrbitAN/docs/tutorial)
- [Methodology / 方法论](/OrbitAN/docs/methodology)
- [Usage / 使用指南](/OrbitAN/docs/usage)
- [Changelog / 更新日志](/OrbitAN/docs/changelog)

---

## Contributing / 参与贡献

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, architecture details, code conventions, and pull request guidelines.

详见 [CONTRIBUTING.md](CONTRIBUTING.md) 了解开发环境搭建、架构细节、代码规范和 PR 指南。

---

## License / 许可证

MIT — see [LICENSE](LICENSE) for details.

---

*浙江大学 SQTP 项目 &nbsp;|&nbsp; Zhejiang University SQTP Project*

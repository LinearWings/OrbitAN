# OrbitAN (轨道计划)

A cosmic-themed daily schedule planner with a Canvas 2D orbital clock, six time-management methodologies, and an isometric pseudo-3D engine.

> A day is an orbit, focus is your gravity.

![License](https://img.shields.io/badge/license-MIT-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6)

## Quick Start

```bash
pnpm install
pnpm dev        # → http://localhost:3000 (landing)  |  /orbit (app)
pnpm build      # Production build
pnpm lint       # ESLint
```

## Features

- **24-Hour Orbital Clock** — Canvas 2D rendering with comet trails, orbit rings, and constructivist geometry
- **Six Methodologies** — GTD, Pomodoro, Pareto, Moffatt, Howell Matrix, SWOT — with full execution panels
- **Orbit Mode** — Focus blocks with liquid glass design, overlap-aware ring assignment, methodology glow
- **Week & Month Views** — Scrollable timeline with lane-based overlap avoidance
- **Orbit Plan** — Assign methodologies to tasks, cards glow with method colors
- **Keyboard-Driven** — Full keyboard shortcut support, Ctrl+Z undo, long-press delete
- **Dark Mode** — Cosmic void theme (#080808) with amber and blue constructivist accents
- **i18n** — Chinese and English support for landing page and documentation

## Tech Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19** + TypeScript 6
- **Canvas 2D** (dual engines: orbital + isometric pseudo-3D)
- **React Context + useReducer** (state management)
- **localStorage** (persistence with schema migration)
- **Tailwind CSS v4** + custom design tokens

## Project Structure

```
src/
├── app/
│   ├── (landing)/     # Landing page & docs
│   └── orbit/         # Main application
├── components/
│   ├── editor/        # Task creation, delete bubble
│   ├── focus/         # Focus blocks, timeline, cards
│   ├── layout/        # Week grid, month grid, arrows
│   ├── orbital/       # Clock engine, methodology panels
│   └── schedule/      # Schedule items, progress bars
├── context/           # AppContext (reducer + persistence)
├── hooks/             # useTasks, useFocusBlocks, useKeyboard, etc.
├── lib/               # i18n, utilities
├── types/             # Task, FocusBlock, AppState types
└── utils/             # Orbital math, time, colors, storage
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, conventions, and PR guidelines.

## License

MIT — see [LICENSE](LICENSE) for details.

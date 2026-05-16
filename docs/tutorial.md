# OrbitAN Frontend Tutorial

This tutorial walks through setting up and running the OrbitAN frontend using Next.js 16 App Router, React 19, TypeScript, and Tailwind CSS v4. The project stores all task data locally in localStorage under a single namespace: `orbital_schedule_v1`.

## Prerequisites
- Node.js >= 18.x (LTS) installed
- Git installed (optional for cloning, not required for local copy)
- Access to the OrbitAN project root: `E:/DS AI Workspace/OrbitAN`

## 1) Install dependencies
Open your terminal and run the following from the project root:

```bash
npm install
```

This installs Next.js, React, TypeScript, Tailwind and project-specific tooling.

## 2) Run the development server
Start the dev server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser to view the app. The app uses the App Router structure provided by Next.js 16.

## 3) Project structure overview
The codebase is organized under src/ with ~45 files in the following subdirectories:
- src/orbital/ – Canvas 2D orbital clock rendering and orbit data structures
- src/layout/ – Global layout components and pages
- src/schedule/ – Task models, reducers, and localStorage persistence hooks
- src/editor/ – Slide-out EditPanel for task creation and editing
- src/ui/ – Reusable UI components (buttons, inputs, cards, etc.)

Key architectural notes:
- Canvas 2D rendering uses a 4-layer pipeline: static orbit + nebula + grain (cached), dynamic planets and clock hands updated at ~60fps via requestAnimationFrame.
- React Context + useReducer provides a single source of truth for app state; components consume via atomic hooks.
- No external state-management libraries or animation frameworks are used beyond the browser APIs.
- All task data persists in localStorage under the key `orbital_schedule_v1`.

## 4) Core interactions
- Daily view shows an orbital clock with planets. Click the Edit edge on the right to open the EditPanel and create a new task.
- Tasks can be filtered by type: Work, Study, Meeting, Personal.
- Navigate by date: previous, next, today; the Week view focuses on the current week only.
- WeekView presents a 7-column grid (Mon–Sun) with a time axis from 06:00 to 18:00. Click an empty slot to create a task, or click an existing block to edit.
- Orbit Mode in the left sidebar contains 6 methodology panels. Data for each panel persists automatically as you edit.

## 5) Configuration tips
- Type mapping:
  - Work: 宝蓝 (#2563EB)
  - Study: 暖黄 (#EAB308)
  - Meeting: 深灰 (#374151)
  - Personal: 中灰 (#6B7280)
- Data persistence is automatic; no manual save button is required.
- To reset data during development, clear the `orbital_schedule_v1` item in localStorage from the browser DevTools.

## 6) Common commands
```bash
# Start a fresh dev session (install prerequisites first)
npm install
npm run dev
```

## 7) Next steps
- Explore each of the six Orbit Mode panels to understand time-management integrations.
- Inspect the localStorage data structure to learn how tasks are stored and retrieved.
- Modify UI tweaks in src/ui to tailor appearance if needed.

This completes a concise overview of setting up and running OrbitAN's frontend locally.

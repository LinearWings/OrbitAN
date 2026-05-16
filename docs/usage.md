# OrbitAN Usage Guide

This guide covers daily usage, WeekView interactions, and Orbit Mode with its six methodology panels. All data persists under the single localStorage key: `orbital_schedule_v1`.

## Keyboard shortcuts
- Focus the app: Tab to navigate focusable elements
- Create task: Open EditPanel via right-edge slide or press a global create shortcut (if available in UI)
- Navigate weeks: Arrow keys or dedicated prev/next controls
- Save: Changes auto-save to localStorage

## Daily view
- Visual: Orbital clock canvas rendering with planets and a backdrop grain layer.
- Task creation: Click the EditPanel slide-out from the right edge to create a new task.
- Filtering: Filter tasks by type: 工作 (Work), 学习 (Study), 会议 (Meeting), 个人 (Personal).
- Date navigation: Prev, Next, Today; current week focus is enforced.

## WeekView
- Layout: 7-column grid for Mon–Sun; time axis from 06:00 to 18:00.
- Liquid-glass blocks: Focus blocks overlay the weekly timeline.
- Interactions: Click an empty slot to create a task; click a block to edit.

## Orbit Mode
- Sidebar: 6 tabs representing GTD, Pomodoro, Pareto, Moffatt, Howell, and SWOT.
- Data persistence: Each panel stores its data; changes no longer require manual saves.
- Automatic persistence: All panels share the same underlying storage namespace.

## Color-to-type mapping
- Work: 宝蓝 (#2563EB)
- Study: 暖黄 (#EAB308)
- Meeting: 深灰 (#374151)
- Personal: 中灰 (#6B7280)

## Data persistence
- All data is stored under: orbital_schedule_v1
- Saving is automatic on every change; no explicit save required
- To reset during development: clear localStorage key in browser DevTools

## Commands and configuration
```bash
## Install dependencies (from project root)
npm install

## Run dev server
npm run dev
```

## LocalStorage data schema (summary)
- Key: orbital_schedule_v1
- Value: JSON object containing panels, tasks, and state per methodology

## Troubleshooting
- If data seems missing after reload, verify localStorage for the key orbital_schedule_v1 and ensure the app loads without error in the browser console.

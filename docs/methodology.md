# OrbitAN Methodologies

This document describes all six time-management methodologies implemented in OrbitAN, including their theoretical principles, app translation, and technical architecture.

| Method | Theory | App translation | Core components | Data structures |
|---|---|---|---|---|
| GTD (Getting Things Done) | Capture, Clarify, Organize, Reflect, Engage | The app presents a GTDPanel with inbox, next-actions, waiting, and someday/maybe lists | GTDPanel, InboxPanel, NextActionsPanel, WaitingPanel | TaskRow, TaskList, GTDContext | 
| Pomodoro | Work cycles: 25/5 | Implemented via PomodoroPanel with timers and session tracking | PomodoroPanel, Timer hook, BreakManager | TimerState, SessionRecord | 
| Pareto Principle (80/20) | Focus on vital few | ParetoPanel lists tasks and scores impact/effort | ParetoPanel, ParetoScoreCalculator | ParetoItem, ParetoScore | 
| Moffatt Rest Method | Alternating activity types to sustain energy | MoffattPanel manages activity sessions with rotation | MoffattPanel, ActivityCard, RotationTimer | Activity, ScheduleSlot | 
| Howell Matrix | 4-quadrant prioritization | HowellMatrix with drag-and-drop quadrants and color coding | HowellMatrix, DragDropGrid | Quadrant, PriorityColor | 
| SWOT Analysis | Strengths, Weaknesses, Opportunities, Threats | SWOTPanel with 4-quadrant item management | SWOTPanel, SWOTCard, ToggleMatrix | SWOTItem, Quadrant | 

## How to read this document
- For each method, we cover theory, app implementation, and technical architecture (React components, TypeScript types, data structures).
- This doc is designed to align with the project structure under src/ and the persistent localStorage model.

## The six methodologies in detail

### GTD (Getting Things Done)
- Theory: Capture, Clarify, Organize, Reflect, Engage.
- App implementation: GTDPanel provides inbox, next-actions, waiting, someday/maybes. Tasks flow from Inbox to Next Actions.
- Architecture: React components for panels, TypeScript types for Task, and Reducer actions for state transitions.

### Pomodoro
- Theory: 25-minute focus, 5-minute break cycles.
- App implementation: PomodoroPanel with a configurable timer, breakdown of cycles, and break management.
- Architecture: useReducer stores timer state; separate effects handle ticking via setInterval.

### Pareto Principle (80/20)
- Theory: Identify the 20% of tasks that yield 80% of results.
- App implementation: ParetoPanel lists tasks, allows rating impact and effort, automatically computes a Pareto score and highlights vital tasks.
- Architecture: ParetoScore calculation uses a simple algorithm on task properties, highlighting with visual cues in the UI.

### Moffatt Rest Method
- Theory: Alternate between mental, physical, creative, and social activities to manage energy cycles.
- App implementation: MoffattPanel manages a queue of activity sessions with timer-based rotation.
- Architecture: Activity types enumerated in TS, rotation logic in a panel hook.

### Howell Matrix
- Theory: 4-quadrant prioritization: Important+Urgent, Important+Not Urgent, Not Important+Urgent, Not Important+Not Urgent.
- App implementation: HowellMatrix component with four draggable quadrants and color-coded priorities.
- Architecture: Quadrant state modeled as a 4x4 grid; drag-and-drop implemented via a minimal internal pattern.

### SWOT Analysis
- Theory: Strengths, Weaknesses, Opportunities, Threats for strategic planning.
- App implementation: SWOTPanel with 4 quadrants and item management per quadrant.
- Architecture: SWOTItem types and quadrant mapping in TS types; persistence via the same global store.

## Architecture references
- React components: GTDPanel, PomodoroPanel, ParetoPanel, MoffattPanel, HowellMatrix, SWOTPanel
- TypeScript types: Task, PanelState, Quadrant, SWOTItem, etc.
- Data structures: Tasks stored under a unified localStorage approach; panels read/write via a single context store.

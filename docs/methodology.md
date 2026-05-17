# OrbitAN Methodologies

This document records the six time-management methodologies implemented in OrbitAN. The current product copy is derived from the six DOCX research notes in `docs/` and is centralized in `src/data/methodology-content.ts`.

## Source Documents

| Method | Source document | Product surface |
|---|---|---|
| GTD | `GTD研究报告.docx` | GTD kanban, docs, methodology drawer |
| Pomodoro | `番茄工作法.docx` | Timer panel, docs, methodology drawer |
| Pareto | `帕累托法则：大学生时间管理的底层逻辑与理论重构(1).docx` | 80/20 scoring panel, docs, methodology drawer |
| Moffatt | `莫法特休息法.docx` | Rotation timer, docs, methodology drawer |
| Howell Matrix | `豪威尔矩阵.docx` | Urgent/important quadrant matrix, docs, methodology drawer |
| SWOT | `SWOT.docx` | SWOT matrix, docs, methodology drawer |

## Implementation Map

| Method | Core principle | App translation | Main files |
|---|---|---|---|
| GTD | Externalize open loops, clarify next actions, review regularly | Five-stage kanban: collect, clarify, organize, review, engage | `src/components/orbital/GTDPanel.tsx` |
| Pomodoro | 25-minute focus, 5-minute break, tracked improvement loop | Phase timer with focus, short break, long break and persisted state | `src/components/orbital/PomodoroPanel.tsx` |
| Pareto | Identify vital few tasks with multiplier effects | Impact/effort scoring and automatic Vital 20% highlighting | `src/components/orbital/ParetoPanel.tsx`, `src/utils/pareto.ts` |
| Moffatt | Recover by switching cognitive modes instead of merely stopping | Eight-session rotation timer for different activity types | `src/components/orbital/MoffattPanel.tsx` |
| Howell Matrix | Separate importance from urgency to reduce reactive firefighting | Drag-and-drop four-quadrant priority matrix | `src/components/orbital/HowellMatrix.tsx` |
| SWOT | Use internal/external factors for strategic self-management | Strengths, weaknesses, opportunities, threats item grid | `src/components/orbital/SWOTPanel.tsx` |

## Shared Content Model

The structured method content lives in `src/data/methodology-content.ts`.

Each `MethodologyGuide` contains:

- `shortZh` / `shortEn`: compact descriptions for selectors and summaries
- `originZh`: theory source and background
- `principles`: core ideas extracted from the DOCX notes
- `workflow`: ordered operational steps
- `tactics`: practical use strategies
- `bestFor`: recommended use cases
- `cautions`: constraints and risks
- `appModel`: how OrbitAN implements the method
- `prompts`: pre-work reflection questions

This single source feeds:

- `src/data/defaults.ts` for selector descriptions
- `src/components/orbital/MethodGuide.tsx` for in-app method guidance
- `src/app/(landing)/docs/methodology/page.tsx` for the public methodology page
- `src/data/docs-content.ts` for the Orbit Mode knowledge base

## Method Notes

### GTD

GTD is used when the user has many open loops and needs a trusted external system. OrbitAN maps the method into a five-column board: collect, clarify, organize, review, and engage. The most important product behavior is helping the user convert vague commitments into concrete next actions.

### Pomodoro

Pomodoro is not only a timer. The source note emphasizes planning, prediction, tracking, recording, processing, and improvement. OrbitAN keeps the timer simple, but the guide copy now prompts the user to predict cycles, record interruptions, and review the gap between expectation and reality.

### Pareto

The Pareto note frames 80/20 as a non-linear choice model, especially useful for students deciding between courses, research, internships, competitions, and long-term skill building. OrbitAN translates this into impact/effort scoring and marks the vital few tasks visually.

### Moffatt

Moffatt Rest focuses on active recovery through task switching: logical vs. creative, static vs. dynamic, hard vs. easy, and different interest areas. OrbitAN models this as an eight-part rotation, allowing a long work period to be divided into varied cognitive modes.

### Howell Matrix

Howell Matrix follows the Eisenhower urgent/important framework. The source note stresses that time management is not filling time, but choosing accurately. OrbitAN's quadrant matrix is designed around the four actions: do now, schedule, delegate/simplify, and drop/control.

### SWOT

SWOT is used as a time-management and self-understanding tool, not just a business analysis model. OrbitAN uses it for project planning, weekly review, and personal strategy: strengths/opportunities become leverage, weaknesses/threats become risk controls.

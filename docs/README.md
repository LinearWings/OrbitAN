# OrbitAN Documentation

English documentation for the OrbitAN project, formatted with Chinese-culture-aware conventions in mind. This repository is organized to help you understand, install, and use OrbitAN’s orbital calendar, time-management panels, and data persistence model.

## Project overview
- Canvas-based 2D orbital clock rendering with a layered pipeline.
- React DOM UI for structured components and navigation.
- Zero external state-management dependencies; single React Context + useReducer for app state.
- All task data stored locally under a single localStorage namespace: `orbital_schedule_v1`.
- Sidebar-driven Orbit Mode with 6 time-management panels and automatic data persistence.
- Color-to-type mapping: Work, Study, Meeting, Personal.

## Documentation index
- [docs/tutorial.md](tutorial.md) — Frontend setup and development workflow.
- [docs/usage.md](usage.md) — How to use Daily view, WeekView, and Orbit Mode.
- [docs/methodology.md](methodology.md) — All six time-management methodologies implemented.
- [docs/changelog.md](changelog.md) — Version history from v0.1.0 to current.
- [docs/README.md](README.md) — This index page.

## Quick links
- [Source code location (local)](E:/DS AI Workspace/OrbitAN)
- [Dev server notes](tutorial.md#development-server)
- [Data persistence key](usage.md#data-persistence)

## How to contribute
- Please follow the repository’s guidelines and use the documentation pages as the single source of truth for user-facing explanations.

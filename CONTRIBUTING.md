# Contributing to OrbitAN

Thanks for your interest in contributing! OrbitAN is a cosmic-themed daily schedule planner built with Next.js 16, React 19, and TypeScript.

## Setup

```bash
pnpm install
pnpm dev      # Start dev server at localhost:3000
pnpm build    # Production build
pnpm lint     # Run ESLint
```

## Project Structure

- `src/app/(landing)/` — Landing page and documentation
- `src/app/orbit/` — Main application
- `src/components/` — React components
- `src/hooks/` — Custom hooks
- `src/context/` — State management (React Context + useReducer)
- `src/utils/` — Utility functions
- `src/types/` — TypeScript type definitions
- `src/data/` — Static data and constants

## Architecture

- **State**: React Context + `useReducer` in `AppContext.tsx`
- **Persistence**: Auto-saves to `localStorage` key `orbital_schedule_v1`
- **Rendering**: Two Canvas 2D engines — 2D orbital clock + isometric pseudo-3D
- **Fonts**: Clash Display (headings), Satoshi (body), JetBrains Mono (mono)

## Commit Convention

- `feat:` — New feature
- `fix:` — Bug fix
- `refactor:` — Code restructuring
- `style:` — Visual/styling changes
- `docs:` — Documentation
- `chore:` — Maintenance

## Pull Requests

1. Fork the repo and create a feature branch
2. Make your changes
3. Run `pnpm lint` and ensure type-checking passes
4. Submit a PR with a clear description

## Code Style

- No unnecessary comments — code should be self-documenting
- Prefer editing existing files over creating new ones
- Follow existing patterns for hooks, components, and state management

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

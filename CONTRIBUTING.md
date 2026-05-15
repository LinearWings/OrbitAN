# Contributing to OrbitAN / 贡献指南

Thanks for your interest in contributing to OrbitAN (轨道计划)! This guide covers everything you need to get started.

感谢你有兴趣为 OrbitAN 做贡献！本指南涵盖入门所需的一切。

---

## Development Setup / 开发环境

### Prerequisites / 前置条件

- **Node.js ≥18** (LTS recommended / 推荐 LTS)
- **pnpm** — install via `npm i -g pnpm` or `corepack enable`
- Git

### First-Time Setup / 首次搭建

```bash
git clone https://github.com/LinearWings/OrbitAN.git
cd OrbitAN
pnpm install
pnpm dev        # Starts dev server at http://localhost:3000
```

The project uses **Turbopack** (Next.js 16 default) for fast HMR. First compilation may take a moment; subsequent hot reloads are near-instant.

项目使用 **Turbopack**（Next.js 16 默认）实现快速热更新。首次编译可能需要一些时间，后续热更新几乎瞬间完成。

### Available Scripts / 可用脚本

| Command | Purpose / 用途 |
|---|---|
| `pnpm dev` | Start dev server with Turbopack HMR / 启动开发服务器 |
| `pnpm build` | Production build → `out/` directory / 生产构建 |
| `pnpm start` | Serve production build locally / 本地运行生产版本 |
| `pnpm lint` | Run ESLint across the project / 运行 ESLint |

There is **no test framework** configured yet — contributions to set up testing are welcome.

项目**尚未配置测试框架** — 欢迎贡献测试基础设施。

---

## Project Architecture / 项目架构

### Critical Constraints / 关键约束

**This is a static export (`output: "export"`).** The app is a pure client-side SPA with zero SSR.

**这是一个静态导出项目。** 应用是纯客户端 SPA，零服务端渲染。

Key implications / 关键影响：

- **No Server Components / 无服务端组件** — every UI file must have `"use client"`
- **No API routes / 无 API 路由** — all data lives in localStorage
- **No middleware / 无中间件** — routing is entirely client-side
- **Images are unoptimized** — `images: { unoptimized: true }` is required for static export
- **`basePath: "/OrbitAN"`** — all internal links and asset paths must be prefixed
- Always check `node_modules/next/dist/docs/` before writing Next.js-specific code — APIs change between versions

### State Management / 状态管理

Single `AppContext` using React Context + `useReducer`. All state flows through the reducer:

单一 `AppContext`，使用 React Context + `useReducer`。所有状态通过 reducer 流转：

```
User Action → dispatch(action) → reducer(state, action) → new state → re-render → localStorage persistence
```

- **20 discriminated union actions** in `src/context/AppContext.tsx`
- Persistence skips first render (tracked via ref) to avoid overwriting saved data
- Schema migration v1→v2 handled in `src/utils/storage.ts`

### Hooks Organization / Hooks 组织

Each hook handles exactly one concern / 每个 Hook 只负责一个关注点：

| Hook | File | Purpose / 用途 |
|---|---|---|
| `useTasks` | `src/hooks/useTasks.ts` | Task CRUD + filtered task list |
| `useFocusBlocks` | `src/hooks/useFocusBlocks.ts` | Focus block CRUD + status management |
| `useKeyboard` | `src/hooks/useKeyboard.ts` | Global keyboard shortcut handler |
| `useDateNavigation` | `src/hooks/useViewNavigation.ts` | Day/week/month navigation with boundary safety |
| `useOrbital` | `src/hooks/useOrbital.ts` | Orbit mode toggle state |
| `useFilter` | `src/hooks/useFilter.ts` | Task type filter state |
| `useSelectedTask` | `src/hooks/useSelectedTask.ts` | Selected/editing task ID |
| `useEditPanel` | `src/hooks/useEditPanel.ts` | Edit panel and delete confirm state |
| `useClock` | `src/hooks/useClock.ts` | Real-time Date updated every 1s |
| `useLanguage` | `src/hooks/useLanguage.ts` | Language from cookie or browser |
| `useMediaQuery` | `src/hooks/useMediaQuery.ts` | Responsive media query (768px) |

### Rendering Engines / 渲染引擎

Two independent Canvas 2D engines in `src/components/orbital/`:

两个独立的 Canvas 2D 引擎，位于 `src/components/orbital/`：

1. **`orbital-engine.ts`** — 2D orbital clock: offscreen canvas for static background (constructivist geometry, dial, rings, day/night sectors), dynamic layer for hands, comet trails, comet heads
2. **`isometric-engine.ts`** — Pseudo-3D isometric projection: 8 render layers, glass-sphere planet rendering with atmosphere/subsurface scattering/Fresnel effects, 80-particle nebula

Both use Canvas 2D API only — no WebGL or Three.js.

### File Organization / 文件组织

- **Components**: One file per component, organized by domain (`orbital/`, `schedule/`, `layout/`, `editor/`, `focus/`, `landing/`, `docs/`, `ui/`)
- **Types**: `src/types/index.ts` (core types), `src/types/focus.ts` (focus block types)
- **Data**: `src/data/constants.ts` (design tokens), `src/data/defaults.ts` (seed data), `src/data/focus-defaults.ts` (method colors/labels)
- **Utils**: `src/utils/orbital.ts` (comet math), `src/utils/time.ts` (time helpers), `src/utils/storage.ts` (persistence), `src/utils/colors.ts` (color utilities), `src/utils/uid.ts` (ID generation)

### localStorage Keys / localStorage 键

| Key | Content / 内容 |
|---|---|
| `orbital_schedule_v1` | Tasks + methodology data (v2 schema) |
| `orbital_focus_v1` | Focus blocks by date |
| `orbital_custom_types_v1` | Custom task type definitions |

---

## Code Conventions / 代码规范

### TypeScript
- Strict mode enabled / 严格模式开启
- All component props must be explicitly typed / 所有组件 props 必须显式类型标注
- Use discriminated unions for action types (see `AppAction`)
- No `any` — use `unknown` and narrow

### React
- All components use `"use client"` (required for static export)
- Functional components only — no class components
- Hooks at top level only, never conditionally
- `useMemo`/`useCallback` only when profiling shows measurable benefit
- `React.memo` requires stable object references — avoid passing new objects as props

### CSS / Styling
- Tailwind CSS v4 with `@tailwindcss/postcss`
- Custom effects in `src/app/globals.css`
- **No gradients on structural lines** — use solid rgba for dividers, rails, borders
- Font edges must NOT glow (no `text-shadow` bloom) — glow from `radial-gradient` backgrounds
- Color discipline: Blue = structure/time, Amber = status/action, Violet = atmosphere/depth

### Naming / 命名
- Components: PascalCase (`ScheduleItem.tsx`)
- Hooks: camelCase with `use` prefix (`useTasks.ts`)
- Utils/types/data: camelCase (`orbital.ts`)
- One component per file, named after the component

### Imports / 导入
- Path aliases: `@/` maps to `src/`
- Group: React/Next → third-party → project modules
- No circular imports — extract shared logic to a utility if needed

---

## Commit Conventions / 提交规范

Follow conventional commit style / 遵循约定式提交：

```
<type>: <short description / 简短描述>

<optional body — what and why, not how>
```

Types: `feat`, `fix`, `refactor`, `style`, `docs`, `chore`, `perf`

Examples:
- `feat: add focus block timeline overlay`
- `fix: prevent date overflow in month navigation`
- `refactor: extract comet positioning to shared utility`

First line under 72 characters. Present tense, imperative mood.

---

## Pull Request Guidelines / PR 指南

1. **One concern per PR** — don't mix features with refactoring or unrelated fixes
2. **Test manually** — run `pnpm dev` and verify changes in browser before submitting
3. **Check the build** — `pnpm build` must succeed (verifies static export compatibility)
4. **Run lint** — `pnpm lint` must pass
5. **No new dependencies** — the project maintains zero external runtime deps. Discuss first if needed
6. **Respect static export** — no server components, no API routes, no SSR features

### Before Submitting / 提交前检查

```bash
pnpm lint        # Must pass / 必须通过
pnpm build       # Must succeed / 必须成功
pnpm start       # Optional: verify locally / 可选：本地验证
```

### PR Description Template / PR 描述模板

```markdown
## Summary / 概述
<Brief description of the change and why>

## Changes / 变更
- <List key changes>

## Screenshots / 截图
<Before/after if UI changed>

## Test Plan / 测试计划
- [ ] `pnpm lint` passes
- [ ] `pnpm build` succeeds
- [ ] Manual test: <scenarios>
```

---

## Known Gaps / 已知缺口

Areas where contributions are especially welcome / 特别欢迎贡献的领域：

- **Tests / 测试**: No test framework configured. Jest/Vitest + React Testing Library setup needed
- **i18n**: ~30+ hardcoded Chinese strings in the orbit app need migration to `getT()`
- **Accessibility / 无障碍**: ARIA labels, focus management, keyboard nav, screen reader support
- **Isometric engine**: 1,034-line engine is implemented but not integrated — needs wiring or removal
- **Performance / 性能**: Animation loop memoization, ConnectorArrows DOM churn, memo cascade fix
- **PWA support**: Service worker, manifest, offline caching
- **Data export/import**: JSON/CSV export and import

See [docs/project-analysis.md](docs/project-analysis.md) for the full bug list and improvement roadmap.

详见 [docs/project-analysis.md](docs/project-analysis.md) 查看完整 Bug 清单和改进路线图。

---

## Questions? / 有问题？

Open an issue on GitHub or start a discussion.

在 GitHub 上提交 Issue 或发起讨论。

---

*OrbitAN is a Zhejiang University SQTP project / 浙江大学 SQTP 项目*

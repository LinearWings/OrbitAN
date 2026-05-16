# OrbitAN 2 - Full-Stack Integration Implementation Plan

> **Generated**: 2026-05-01
> **Codename**: OrbitAN 2 - Orbital Schedule Full-Stack Edition
> **Scale**: Super-large project (150+ files, 160+ tasks, 12 phases)
> **Target**: AI agent workflow (Sisyphus + sub-agents, parallel execution)
> **Design Spec**: docs/superpowers/specs/2026-04-28-orbital-schedule-design.md
> **Existing Reference**: E:\DS AI Workspace\OrbitAN (frontend-only, ~50 files)

---

## 0. Project Overview

### 0.1 Vision

Upgrade OrbitAN from a **pure frontend localStorage app** to a **full-stack SaaS product**.

### 0.2 Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | Full-stack: API Routes + RSC + Frontend |
| **Language** | TypeScript 6 strict | 150+ files, end-to-end type safety |
| **API** | tRPC v11 | End-to-end types, no manual REST endpoints |
| **ORM** | Prisma 6 | Type-safe DB access, migration management |
| **Database** | PostgreSQL 17 | Relational + JSON + full-text search |
| **Cache** | Redis 7 | Sessions, rate limiting, realtime state |
| **Auth** | NextAuth v5 | OAuth2 + Credentials + email verification |
| **Realtime** | Server-Sent Events | Cross-device sync (lightweight) |
| **Styling** | Tailwind CSS v4 + CSS Modules | Existing approach |
| **UI** | shadcn/ui + Radix UI | Accessible, customizable, modern |
| **State** | Zustand + React Context | Global Zustand, module-level Context |
| **Storage** | AWS S3 / MinIO | User avatars, exports |
| **Email** | Resend | Verification, notifications |
| **CI/CD** | GitHub Actions + Vercel | Automated deployment |
| **Container** | Docker Compose | Dev environment consistency |
| **Package** | pnpm (workspace) | Monorepo support |
| **Testing** | Vitest + Playwright + MSW | Unit + E2E + API Mock |

### 0.3 Monorepo Structure

`
orbitan-2/
+-- apps/
|   +-- web/                    # Next.js main app (frontend + API)
|       +-- src/
|       |   +-- app/            # App Router pages
|       |   +-- components/     # React components
|       |   +-- server/         # Server code (tRPC, auth, services)
|       |   +-- hooks/          # Custom hooks
|       |   +-- types/          # TypeScript types
|       |   +-- styles/         # Global styles
|       |   +-- trpc/           # tRPC client
|       |   +-- lib/            # Utilities
|       |   +-- store/          # Zustand stores
|       +-- prisma/             # Schema + migrations
|       +-- public/             # Static assets
|       +-- tests/              # Tests
+-- packages/
|   +-- shared/                 # Shared types and utilities
|   +-- ui/                     # Shared UI components
+-- docker-compose.yml
+-- turbo.json
+-- pnpm-workspace.yaml
+-- package.json
`

### 0.4 Existing Asset Inventory

| Module | Files | Status | Migration Strategy |
|---|---|---|---|
| Type definitions (types/) | 1 | Complete | Reuse, extend backend fields |
| State management (context/) | 1 | Complete | Keep client, add server state |
| Orbital engine | 1 (35KB) | Complete | Pure frontend, direct reuse |
| Isometric engine | 1 (36KB) | Complete | Pure frontend, direct reuse |
| Canvas components | 5 | Complete | Direct reuse |
| Layout components | 7 | Complete | Direct reuse |
| Schedule components | 4 | Complete | API migration |
| Editor components | 2 | Complete | API migration |
| Orbit Mode panels | 9 | Complete | API migration |
| Hooks | 11 | Partial | localStorage to API |
| Utilities | 6 | Complete | Direct reuse |
| Data/defaults | 2 | Complete | Migrate to DB seed |
| Styles/CSS | 3 | Complete | Direct reuse |
| **Known Bugs** | - | P0-P4 | Fix during migration |

---

## 1. Phase Summary

| Phase | Name | Tasks | Effort | Dependencies |
|---|---|---|---|---|
| **Phase 0** | Environment and Monorepo Setup | 8 | 1-2 days | - |
| **Phase 1** | Database Design and Prisma Schema | 4 | 1-2 days | Phase 0 |
| **Phase 2** | Auth System (NextAuth v5) | 5 | 2-3 days | Phase 1 |
| **Phase 3** | tRPC API Layer | 3 | 1-2 days | Phase 1 |
| **Phase 4** | Core CRUD API (Tasks/Schedule) | 5 | 2-3 days | Phase 3 |
| **Phase 5** | Existing Code Migration | 6 | 3-4 days | Phase 0, 3 |
| **Phase 6** | Orbit Mode API + Focus Blocks | 4 | 2-3 days | Phase 4 |
| **Phase 7** | Realtime Sync (SSE) | 3 | 2-3 days | Phase 4, 5 |
| **Phase 8** | File Storage and Export | 3 | 1-2 days | Phase 3 |
| **Phase 9** | Notification System | 3 | 1-2 days | Phase 2, 4 |
| **Phase 10** | Test Coverage (Unit + E2E) | 5 | 3-4 days | Phase 4-9 |
| **Phase 11** | CI/CD + Docker + Deployment | 4 | 2-3 days | Phase 10 |
| **Phase 12** | Monitoring + Perf + Security | 4 | 2-3 days | Phase 11 |
| **Total** | | **~57 subtasks** | **~4-6 weeks** | |

---

## Phase 0: Environment and Monorepo Setup

**Goal**: Establish monorepo infrastructure, configure development environment
**Done when**: Docker running, Next.js builds, all toolchains ready

### Task 0.1: Initialize Monorepo Root
- Create directory structure: apps/web, packages/shared, packages/ui
- Initialize pnpm-workspace.yaml
- Create root package.json with turbo, typescript devDeps
- Create turbo.json (build/dev/lint/test tasks)
- Create .gitignore
- Verify pnpm install succeeds

### Task 0.2: Initialize Next.js Web App
- Create Next.js 16 project in apps/web/
- Configure tsconfig.json (strict, paths)
- Configure Tailwind CSS v4
- Install full-stack dependencies (tRPC, Prisma, NextAuth, Zod, Redis, Resend, Zustand, bcryptjs)
- Install dev dependencies (Vitest, Playwright, MSW, tsx)
- Verify pnpm build succeeds

### Task 0.3: Initialize Shared Package (packages/shared)
- Create packages/shared/package.json with exports
- Migrate existing type definitions
- Create shared Zod schemas
- Create shared constants and utilities

### Task 0.4: Docker Development Environment
- Create docker-compose.yml (PostgreSQL 17 + Redis 7 + Mailpit)
- Create .env.example and .env.local
- Verify docker compose up -d

### Task 0.5: Initialize Shared UI Package (packages/ui)
- Initialize packages/ui/
- Configure shadcn/ui
- Extract base components (Button, Input, Dialog, Popover, Select, Slider)

### Task 0.6: Code Quality Toolchain
- Root ESLint configuration
- Prettier configuration
- lint-staged + husky
- VS Code workspace settings

### Task 0.7: Create Base File Structure
Create all empty directories for server, routers, store, tests, docs

### Task 0.8: Phase 0 Verification
- Docker running, pnpm install, pnpm build, pnpm dev, pnpm lint all pass
- **Phase 0 Complete**

---

## Phase 1: Database Design and Prisma Schema

**Goal**: Design complete data models - users, tasks, focus blocks, notifications
**Done when**: Migration succeeds, Prisma Client generated, seed data verified

### Task 1.1: Prisma Schema Design
Create apps/web/prisma/schema.prisma with models:
- **User** - id, email, password, displayName, timezone, locale
- **Account** - OAuth accounts
- **Session** - session management
- **VerificationToken** - email verification
- **Task** - id, userId, type, name, date, startTime, endTime, duration, progress, completed, note, tags (with indexes on userId+date, userId+type, userId+completed)
- **FocusBlock** - id, userId, date, startTime, endTime, title, methodology, methodologyData (JSON)
- **FocusBlockTask** - junction table
- **Notification** - id, userId, type, title, message, read, data
- **UserSettings** - theme, accentColor, clockStyle, notifications, language, timeFormat
- **ExportLog** - id, userId, format, url, size

Enums: TaskType (work/study/meeting/personal), MethodologyType (gtd/pomodoro/pareto/moffatt/howell/swot), NotificationType (task_reminder/focus_block_start/pomodoro_complete/achievement/system)

### Task 1.2: Prisma Migration
- Run prisma migrate dev --name init
- Run prisma generate
- Create Prisma Client singleton (src/server/prisma.ts)

### Task 1.3: Database Seed
- Create seed user (dev@orbitan.app)
- Create sample task data (7 days, 3-5 tasks/day)
- Create sample focus blocks
- Create default user settings

### Task 1.4: Prisma Studio Verification
- Verify all tables, seed data, relationships
- **Phase 1 Complete**

---

## Phase 2: Auth System (NextAuth v5)

**Goal**: Complete user registration, login, OAuth, email verification, session management
**Done when**: Registration/login/OAuth full flow works, middleware protection active

### Task 2.1: NextAuth Configuration
- Create src/server/auth/index.ts (PrismaAdapter, Credentials, Google, GitHub, JWT)
- Create src/app/api/auth/[...nextauth]/route.ts
- Create src/types/next-auth.d.ts

### Task 2.2: Registration and Email Verification API
- Create src/app/api/auth/register/route.ts
- Create src/app/api/auth/verify-email/route.ts
- Create src/app/api/auth/forgot-password/route.ts

### Task 2.3: Auth Pages
- Create src/app/(auth)/layout.tsx
- Create src/app/(auth)/login/page.tsx
- Create src/app/(auth)/register/page.tsx
- Create src/app/(auth)/verify-email/page.tsx
- Create src/app/(auth)/reset-password/page.tsx

### Task 2.4: Session Protection Middleware
- Create src/middleware.ts (protect all non-auth pages)

### Task 2.5: Auth Hooks and Context
- Create src/hooks/useAuth.ts
- Extend SessionProvider wrapper
- Create SignOutButton, UserAvatar components
- **Phase 2 Complete**

---

## Phase 3: tRPC API Layer

**Goal**: Type-safe API layer, all data operations through tRPC
**Done when**: tRPC client/server connected, all routers registered

### Task 3.1: tRPC Initialization
- Create src/server/trpc/index.ts (context, superjson, Zod errors, protectedProcedure)
- Create src/server/routers/_app.ts (merge all routers)
- Create src/app/api/trpc/[trpc]/route.ts

### Task 3.2: tRPC Router Registration
Create router files:
- **auth.ts** - auth.me, auth.updateProfile
- **tasks.ts** - tasks.list, tasks.get, tasks.create, tasks.update, tasks.delete, tasks.updateProgress, tasks.getStats
- **focus-blocks.ts** - focusBlocks.list, create, update, delete, linkTask, unlinkTask
- **notifications.ts** - notifications.list, markRead, markAllRead
- **settings.ts** - settings.get, settings.update
- **export.ts** - export.json, export.csv

### Task 3.3: tRPC Client
- Create src/trpc/client.ts
- Create src/trpc/Provider.tsx
- Update src/app/providers.tsx
- **Phase 3 Complete**

---

## Phase 4: Core CRUD API (Tasks/Schedule)

**Goal**: Complete task management API with CRUD, filtering, sorting, progress tracking
**Done when**: All task API endpoints tested, frontend can fully operate tasks

### Task 4.1: Task Zod Schemas
Create src/server/validators/task.ts (createTaskSchema, updateTaskSchema, listTasksSchema, updateProgressSchema)

### Task 4.2: Tasks Router Implementation
Full CRUD with filtering, pagination, soft delete, progress update, statistics

### Task 4.3: Focus Blocks Router
Full CRUD with methodologyData, task linking/unlinking

### Task 4.4: Settings Router
Get and partial update user settings

### Task 4.5: API Integration Tests
- Create tests/api/tasks.test.ts
- Test all CRUD, authorization
- **Phase 4 Complete**

---

## Phase 5: Existing Code Migration

**Goal**: Migrate ~50 frontend files from E:\DS AI Workspace\OrbitAN to monorepo, API-ize
**Done when**: All components run in new project, localStorage replaced with tRPC

### Task 5.1: Core File Migration
Copy types/, utils/, data/, components/orbital/, components/layout/ from existing project

### Task 5.2: Component API Migration
- ScheduleList.tsx - localStorage to trpc.tasks.list.useQuery()
- ScheduleItem.tsx - operations to tRPC mutations
- EditPanel.tsx - form submit to trpc.tasks.create.mutate()
- TaskDetail.tsx - detail fetch to trpc.tasks.get.useQuery()
- ProgressBar.tsx - progress update to trpc.tasks.updateProgress.mutate()

### Task 5.3: Orbit Mode Migration
Migrate all 6 methodology panels, OrbitModePage.tsx, WeekView.tsx, MethodSelector.tsx

### Task 5.4: Hooks Migration
- useTasks.ts - localStorage to tRPC + React Query
- useFilter.ts, useEditPanel.ts, useDateNavigation.ts - state to Zustand
- New: useFocusBlocks.ts

### Task 5.5: State Management Refactor
- Create src/store/taskStore.ts (Zustand)
- Create src/store/uiStore.ts (Zustand)
- Create src/store/orbitStore.ts (Zustand)
- Keep AppContext for auth only
- Remove all localStorage calls

### Task 5.6: Styles and Visual Migration
Migrate globals.css, CSS Modules, fonts, NoiseOverlay.tsx, verify Canvas rendering
- **Phase 5 Complete**

---

## Phase 6: Orbit Mode API + Focus Blocks

**Goal**: Backend API for all 6 time-management methodologies
**Done when**: All methodology panels have persistent data, cross-device sync

### Task 6.1: Methodology Data Model Extensions
Extend methodologyData JSON schemas for GTD, Pomodoro, Pareto, Moffatt, Howell, SWOT

### Task 6.2: Methodology API Endpoints
Add to focus-blocks router: gtd.add, gtd.move, pomodoro.start, pomodoro.tick, pareto.analyze, moffatt.next

### Task 6.3: Methodology Panel Frontend Migration
Migrate all 6 panels to use tRPC

### Task 6.4: Focus Block Calendar View
Create WeekTimeline.tsx, TimeSlotColumn.tsx, FocusBlockCard.tsx with drag support
- **Phase 6 Complete**

---

## Phase 7: Realtime Sync (SSE)

**Goal**: Cross-device realtime data sync, multi-tab state consistency
**Done when**: Edit task in one tab, other tabs auto-update

### Task 7.1: SSE Server
Create src/app/api/sse/route.ts with Redis Pub/Sub, heartbeat

### Task 7.2: SSE Client
Create src/hooks/useSSE.ts with auto-reconnect, React Query cache invalidation

### Task 7.3: Realtime Hooks
Create useRealtimeTasks.ts, useRealtimeFocusBlocks.ts
- **Phase 7 Complete**

---

## Phase 8: File Storage and Export

**Goal**: User data export (JSON/CSV/PDF), avatar upload
**Done when**: Export works, files downloadable

### Task 8.1: Export API
Create src/server/routers/export.ts (export.json, export.csv, export.pdf)

### Task 8.2: File Storage
Configure S3/MinIO, create storage.service.ts

### Task 8.3: Export UI
Create ExportPanel.tsx, progress indicator, export history
- **Phase 8 Complete**

---

## Phase 9: Notification System

**Goal**: Task reminders, Pomodoro completion notifications, system notifications
**Done when**: Email notifications sent, in-app notifications displayed in realtime

### Task 9.1: Notification API
Create src/server/routers/notifications.ts

### Task 9.2: Email Notification Service
Create email.service.ts with Resend, templates, Redis queue

### Task 9.3: Notification UI
Create NotificationBell.tsx, NotificationDropdown.tsx, notifications page
- **Phase 9 Complete**

---

## Phase 10: Test Coverage (Unit + E2E)

**Goal**: Core function test coverage > 80%, E2E covers key user flows
**Done when**: All tests pass, CI integration

### Task 10.1: Unit Tests - API
Configure Vitest, create tests for tasks, focus-blocks, email, validators

### Task 10.2: Unit Tests - Components
Configure Testing Library, create tests for ScheduleItem, EditPanel, OrbitMode

### Task 10.3: API Integration Tests
Create tests/integration/api.test.ts with MSW

### Task 10.4: E2E Tests
Configure Playwright, create auth.spec.ts, tasks.spec.ts, orbit-mode.spec.ts

### Task 10.5: Test Coverage Report
Configure coverage thresholds (80% lines, 70% branches)
- **Phase 10 Complete**

---

## Phase 11: CI/CD + Docker + Deployment

**Goal**: Automated testing, building, and deployment pipeline
**Done when**: Push to main auto-deploys, all checks pass

### Task 11.1: GitHub Actions CI
Create .github/workflows/ci.yml, staging.yml, production.yml

### Task 11.2: Docker Production Build
Create Dockerfile (multi-stage), .dockerignore, docker-compose.prod.yml

### Task 11.3: Vercel Deployment
Configure vercel.json, environment variables, preview deployments

### Task 11.4: Database Migration Pipeline
Add migration step to CI/CD, configure production DATABASE_URL
- **Phase 11 Complete**

---

## Phase 12: Monitoring + Performance + Security

**Goal**: Production monitoring, performance optimization, security audit
**Done when**: Monitoring dashboards active, performance baselines set, security reviewed

### Task 12.1: Error Monitoring (Sentry)
Initialize @sentry/nextjs, configure client/server/edge, source maps, alerts

### Task 12.2: Performance Monitoring
Vercel Analytics, Web Vitals, performance budgets (LCP < 2.5s, FID < 100ms, CLS < 0.1)

### Task 12.3: Security Audit
- Auth: JWT rotation, CSRF, rate limiting, CORS
- Authorization: protectedProcedure verification, row-level security
- Data: Zod validation, Prisma parameterized queries, CSP headers
- Infrastructure: HTTPS, HSTS, DDoS protection

### Task 12.4: Performance Optimization
- Frontend: Canvas throttling, memoization, dynamic imports
- Backend: Query optimization, Redis caching, connection pooling
- Infrastructure: CDN, compression, ISR
- Load testing: Artillery/k6 for 100 concurrent users
- **Phase 12 Complete**

---

## Appendix A: API Endpoint Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login (Credentials) |
| GET | /api/auth/[...nextauth] | NextAuth handlers |
| POST | /api/auth/verify-email | Verify email |
| POST | /api/auth/forgot-password | Request password reset |

### Tasks (tRPC)
| Procedure | Type | Description |
|---|---|---|
| tasks.list | Query | List tasks (filter/paginate) |
| tasks.get | Query | Get single task |
| tasks.create | Mutation | Create task |
| tasks.update | Mutation | Update task |
| tasks.delete | Mutation | Soft delete task |
| tasks.updateProgress | Mutation | Update progress |
| tasks.getStats | Query | Task statistics |

### Focus Blocks (tRPC)
| Procedure | Type | Description |
|---|---|---|
| focusBlocks.list | Query | List focus blocks |
| focusBlocks.create | Mutation | Create focus block |
| focusBlocks.update | Mutation | Update focus block |
| focusBlocks.delete | Mutation | Delete focus block |
| focusBlocks.linkTask | Mutation | Link task |
| focusBlocks.gtd.add | Mutation | Add GTD item |
| focusBlocks.pomodoro.start | Mutation | Start Pomodoro |

### Notifications (tRPC)
| Procedure | Type | Description |
|---|---|---|
| notifications.list | Query | List notifications |
| notifications.markRead | Mutation | Mark as read |
| notifications.markAllRead | Mutation | Mark all read |

### Export (tRPC)
| Procedure | Type | Description |
|---|---|---|
| export.json | Query | Export as JSON |
| export.csv | Query | Export as CSV |

### Realtime
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/sse | Server-Sent Events stream |

---

## Appendix B: Database Schema Diagram

`
User ||--o{ Task : has
User ||--o{ FocusBlock : has
User ||--o{ Notification : has
User ||--o{ UserSettings : has
User ||--o{ ExportLog : has
User ||--o{ Account : has
User ||--o{ Session : has
FocusBlock ||--o{ FocusBlockTask : links
Task ||--o{ FocusBlockTask : linked_by
`

---

## Appendix C: Environment Variables

| Variable | Description | Example |
|---|---|---|
| DATABASE_URL | PostgreSQL connection string | postgresql://orbitan:password@localhost:5432/orbitan_dev |
| REDIS_URL | Redis connection string | redis://localhost:6379 |
| NEXTAUTH_SECRET | NextAuth JWT secret | (generate with openssl rand -base64 32) |
| NEXTAUTH_URL | NextAuth callback URL | http://localhost:3000 |
| GOOGLE_CLIENT_ID | Google OAuth client ID | From Google Cloud Console |
| GOOGLE_CLIENT_SECRET | Google OAuth secret | From Google Cloud Console |
| GITHUB_CLIENT_ID | GitHub OAuth client ID | From GitHub Settings |
| GITHUB_CLIENT_SECRET | GitHub OAuth secret | From GitHub Settings |
| RESEND_API_KEY | Resend email API key | re_xxxxxxxx |
| S3_BUCKET | S3 bucket for file storage | orbitan-uploads |
| S3_REGION | S3 region | us-east-1 |
| S3_ACCESS_KEY | S3 access key | From AWS IAM |
| S3_SECRET_KEY | S3 secret key | From AWS IAM |
| SENTRY_DSN | Sentry DSN | From Sentry dashboard |
| NEXT_PUBLIC_APP_URL | Public app URL | https://orbitan.app |

---

## Appendix D: Execution Strategy for AI Agents

### Parallel Execution Guidelines

1. **Phase 0-1**: Sequential (foundation)
2. **Phase 2-3**: Can run in parallel (auth + tRPC are independent)
3. **Phase 4-6**: Sequential dependency chain (CRUD -> Orbit Mode depends on API)
4. **Phase 7-9**: Can run in parallel (SSE, export, notifications are independent)
5. **Phase 10**: After all features complete
6. **Phase 11-12**: Sequential (deploy then monitor)

### Sub-agent Delegation

| Category | Use For |
|---|---|
| visual-engineering | UI components, styling, Canvas optimization |
| quick | Single-file changes, config updates, typo fixes |
| deep | Complex migration tasks, architecture decisions |
| ultrabrain | Security audit, performance optimization |
| writing | Documentation, API docs |

### Verification Checkpoints

After each phase:
1. Run pnpm lint - zero errors
2. Run pnpm typecheck - zero type errors
3. Run pnpm build - successful build
4. Run pnpm test - all tests pass
5. Manual smoke test of new features

---

*Plan generated by Sisyphus on 2026-05-01. For questions or updates, edit this file directly.*

# OrbitAN（轨道计划）— 完整项目分析

## 浙江大学 SQTP 项目

> 分析日期：2026-05-13
> 代码库版本：863349f
> 分析范围：全部 80 个源文件，约 12,000 行代码

---

## 一、项目概况

| 维度 | 详情 |
|--------|---------|
| **代码库规模** | 80 个源文件（72 TS/TSX + 5 CSS + 2 CSS 模块 + 1 SVG），约 12,000 行 |
| **技术栈** | Next.js 16.2.4 + React 19.2.4 + TypeScript 6 + Tailwind CSS v4 + pnpm 10 |
| **架构模式** | 纯客户端静态导出（`output: "export"`），GitHub Pages 部署（`basePath: "/OrbitAN"`） |
| **状态管理** | React Context + `useReducer`，localStorage 持久化（模式版本 v2） |
| **渲染引擎** | 两个 Canvas 2D 引擎：轨道引擎（constructivist 2D）+ 等距引擎（伪 3D） |
| **方法论** | 6 个时间管理面板：GTD、番茄钟、帕累托、莫法特、豪威尔矩阵、SWOT |
| **测试覆盖** | 无测试。未配置测试框架 |
| **国际化** | `lib/i18n.ts` 存在，但仅落地页使用；主应用约 30+ 处硬编码中文 |

### 完整文件结构

```
src/
├── app/
│   ├── orbit/page.tsx              # 主应用页面（~1133 行）— 核心文件
│   ├── (landing)/                  # 落地页 + 文档/教程/更新日志/方法论指南页
│   ├── layout.tsx                  # 根布局（字体、元数据）
│   ├── providers.tsx               # 客户端 Provider 包装器
│   └── globals.css                 # 全局样式 + Tailwind v4 导入
├── components/
│   ├── orbital/                    # Canvas 引擎、时钟、6 个方法论面板、抽屉
│   │   ├── HybridClock.tsx         # Canvas 2D 时钟（切换 2D/等距引擎）
│   │   ├── orbital-engine.ts       # 2D 轨道引擎（constructivist 几何、彗星轨迹）
│   │   ├── isometric-engine.ts     # 等距伪 3D 引擎（死代码，从未导入）
│   │   ├── GTDPanel.tsx            # GTD 5 列看板
│   │   ├── PomodoroPanel.tsx       # 番茄钟计时器（无持久化）
│   │   ├── ParetoPanel.tsx         # 帕累托 80/20 分析
│   │   ├── MoffattPanel.tsx        # 莫法特 8 阶段会话
│   │   ├── HowellMatrix.tsx        # 豪威尔 2×2 象限矩阵
│   │   ├── SWOTPanel.tsx           # SWOT 分析
│   │   ├── MethodologyDrawer.tsx   # 方法论滑入抽屉
│   │   └── MethodSelector.tsx      # 方法论选择器
│   ├── layout/                     # 标题、日期导航、图例、箭头、周/月网格、移动端栏
│   ├── schedule/                   # 日程卡片、进度条
│   ├── editor/                     # 任务编辑器、内联创建器、删除确认
│   ├── focus/                      # 聚焦块卡片、时间线叠加层
│   ├── docs/                       # 文档叠加层 + 导航
│   └── ui/Icons.tsx                # SVG 图标集合
├── context/AppContext.tsx           # 集中式状态 + reducer + 持久化
├── hooks/                          # 12 个自定义 hook
│   ├── useTasks.ts                 # 任务 CRUD
│   ├── useFocusBlocks.ts           # 聚焦块 CRUD
│   ├── useKeyboard.ts             # 键盘快捷键
│   ├── useViewNavigation.ts        # 日/周/月视图 + 日期导航（含月份溢出 bug）
│   ├── useMediaQuery.ts            # 响应式断点
│   ├── useLanguage.ts              # 语言检测（非响应式）
│   └── ...                         # useClock, useOrbital, useFilter 等
├── types/
│   ├── index.ts                    # Task, AppState, AppAction, 方法论类型
│   └── focus.ts                    # FocusBlock, FocusMethodId
├── data/
│   ├── constants.ts                # 设计常量、统一半径
│   ├── defaults.ts                 # DEMO_TASKS, METHODOLOGIES
│   └── focus-defaults.ts           # FOCUS_METHOD_COLORS, FOCUS_METHOD_LABELS
├── utils/
│   ├── orbital.ts                  # 轨道数学（彗星定位、重叠避免）— 含缺失检测情况
│   ├── time.ts                     # 时间工具（getToday, timeToMinutes, timeToAngle）
│   ├── storage.ts                  # localStorage 持久化 + 模式迁移 v1→v2
│   ├── colors.ts                   # 颜色工具（返回十六进制，renderer 中使用存在问题）
│   ├── orbit-clock-renderer.ts     # 轨道时钟渲染器 — 含十六进制颜色 bug
│   └── uid.ts                      # 唯一 ID 生成器
└── lib/i18n.ts                     # 国际化字典（中/英）— 未被主应用充分使用
```

---

## 二、已完成功能清单

### 完整运行

- 24 小时径向时钟与 Canvas 2D 轨道可视化
- 带拖拽重新定位的日程任务卡片（指针事件 + 触控长按）
- 任务 CRUD 与 localStorage 持久化（含模式迁移 v1→v2）
- 日/周/月视图切换
- 4 种任务类型筛选（工作/学习/会议/个人）+ 自定义类型
- 任务进度跟踪与自动计时器
- GTD 5 列看板（HTML5 拖放 + 触控回退）
- 豪威尔矩阵 2×2 象限（HTML5 拖放 + 触控回退）
- SWOT 分析面板（2×2 网格）
- 帕累托 80/20 评分 + 柱状图
- 莫法特 8 阶段会话计时器
- 番茄钟计时器（SVG 环形进度条，阶段自动切换）
- Orbit Mode（6 种聚焦方法论，环分配）
- SVG 连接箭头（PCB 风格路由，120° 钝角转折）
- 胶片颗粒纹理叠加层 + 自定义轨道光标
- 移动端响应式布局（底部栏、滑动删除、紧凑卡片）
- 移动端/平板电脑的触控回退（拖放、周视图拖拽创建）
- 键盘快捷键（← → T N O Delete Escape 1-4 0）
- 落地页（中/英双语）
- 文档页面（教程、方法论指南、使用指南、更新日志）
- CI/CD：GitHub Actions → GitHub Pages

---

## 三、Bug 清单

### P0 — 严重 Bug（功能性损坏）

| # | 文件 | 行号 | 描述 | 修复状态 |
|---|------|------|-------------|------|
| 1 | `useViewNavigation.ts` | 26-31, 44-49 | **月份导航日期溢出**：1月31日 → `setMonth(+1)` → 3月3日而非2月1日 | ✅ 已修复 |
| 2 | `GTDPanel.tsx` | 86 | **GTD 空状态下种子数据重生**：`saved?.items?.length` 在用户删除所有条目后为假，重新创建初始种子 | ✅ 已修复 |
| 3 | `PomodoroPanel.tsx` | 88-103 | **focusCount 在首个长休息后冻结**：`focusCount` 达到4后永不重置，导致每个后续聚焦阶段都触发长休息 | ✅ 已修复 |
| 4 | `PomodoroPanel.tsx` | 70-72 | **倒计时少计 1 秒**：`prev <= 1` 导致 `00:02 → 00:00`，跳过 `00:01` | ✅ 已修复 |
| 5 | `orbital-engine.ts` | 71-77 | **胶片颗粒逐像素生成**：65,536 次 `fillRect(x, y, 1, 1)` 调用极其缓慢 | ✅ 已修复 |
| 6 | `orbital.ts` | 61-66 | **缺少重叠检测情况**：遗漏凌晨任务（00:00-02:00）与跨夜任务（23:00-01:00）冲突 | ✅ 已修复 |
| 7 | `useFocusBlocks.ts` | 17-23 | **`crypto.randomUUID()` 在 HTTP 上失败**：非安全上下文中抛出 TypeError | ✅ 已修复 |
| 8 | `orbit/page.tsx` | 867 | **滑动删除处理器过期闭包**：`let swipeStartX` 在 touchstart/touchend 之间重新渲染时重置为 0 | ✅ 已修复 |
| 9 | `ProgressBar.tsx` | 37-39 | **自动计时器过期闭包**：`setInterval` 在 60 秒后覆盖用户手动进度更改 | ✅ 已修复 |
| 10 | `orbit-clock-renderer.ts` | 168-171 | **颜色字符串替换对十六进制颜色无效**：`.replace(")", ...)` 对 `"#2563EB"` 无效，所有弧段以完全不透明度渲染 | ✅ 已修复 |

### P1 — 重大 Bug（显著影响）

| # | 文件 | 描述 | 修复状态 |
|---|------|------|------|
| 11 | `AppContext.tsx` | 聚焦块持久化在首次渲染时以 `{}` 写入，可能在 LOAD 分发之前覆盖保存的数据 | ✅ 已修复 |
| 12 | `PomodoroPanel.tsx` | 零持久化 — 与其他所有 5 个面板不一致；刷新会丢失所有计时器状态 | ✅ 已修复 |
| 13 | `orbit/page.tsx` | 滑动删除 + 滑动导航双重触发 — 向左滑 >70px 同时触发删除和导航 | ✅ 已修复 |
| 14 | `MoffattPanel.tsx` | 每秒写入 localStorage — 计时器运行时每秒完整的 JSON 序列化 + 写入 | ✅ 已修复 |
| 15 | `AppContext.tsx` | UPDATE 在任务未找到时静默失败 — 无警告、无错误 | ✅ 已修复 |
| 16 | `storage.ts` | `clearStorage` 仅删除一个键；`orbital_focus_v1` 和 `orbital_custom_types_v1` 保留 | ✅ 已修复 |
| 17 | `storage.ts` | 损坏的 localStorage 默默重置 — 用户看到空日程，无损坏警告 | ✅ 已修复 |
| 18 | `HybridClock.tsx` | 动画循环以 60fps 重新计算所有彗星位置 — 应被记忆化 | ⬜ 待处理 |
| 19 | `ConnectorArrows.tsx` | 每次更新都进行完整 DOM 销毁/重建 | ⬜ 待处理 |
| 20 | `orbit/page.tsx` | memo 级联中断 — ScheduleCardWrapper 每次都收到新对象引用 | ⬜ 待处理 |
| 21 | `isometric-engine.ts` | 1,034 行死代码，从未导入 — 应移除或用特性标志激活 | ⬜ 待处理 |
| 22 | `orbit/page.tsx` | `AppState.viewMode` 是无用状态 — 主页面使用本地状态绕过 reducer | ⬜ 待处理 |

### P2 — 次要 Bug（边界情况）

| # | 文件 | 描述 | 修复状态 |
|---|------|------|------|
| 23 | `HowellMatrix.tsx` | `onDrop` 中 `JSON.parse` 未用 try-catch 保护 | ✅ 已修复 |
| 24 | `MoffattPanel.tsx` | 会话运行超出预期 1 秒 — `remaining <= 0` 在递减后每秒检查 | ✅ 已修复 |
| 25 | `GTDPanel.tsx` | 未知阶段名称导致 `byStage[it.stage].push(it)` 崩溃 | ✅ 已修复 |
| 26 | `ScheduleItem.tsx` | `entryDelay` 计算但从未应用（死代码） | ✅ 已修复 |
| 27 | `WeekGridView.tsx` | `t.span = totalLanes` 语义错误 — 所有任务获得相同的跨列值 | ⬜ 待处理 |
| 28 | `globals.css` | CSS 悬停中和规则为空 — 触控设备上"粘性悬停"仍然存在 | ⬜ 待处理 |
| 29 | `InlineTaskCreator.tsx` | 自定义类型名称冲突无错误消息 | ⬜ 待处理 |
| 30 | `HowellMatrix.tsx` | 删除按钮使用 `invisible group-hover:visible` — 键盘用户看不到 | ⬜ 待处理 |
| 31 | `useLanguage.ts` | 语言更改不是响应式的 — 设置 cookie 直到刷新才生效 | ⬜ 待处理 |
| 32 | `MethodologyDrawer.tsx` | 无焦点陷阱、无 body 滚动锁定、无 `aria-modal` | ⬜ 待处理 |

---

## 四、架构弱点

### 1. 无测试
项目中零测试。无单元测试、集成测试或端到端测试。关键路径均未验证：
- 状态管理（reducer 行为）
- 时间计算（`timeToMinutes`、`timeToAngle`、月份导航）
- 轨道数学（重叠避免、彗星定位）
- 存储迁移（v1→v2 任务迁移）
- 方法论面板数据持久化

### 2. 国际化未完成
`lib/i18n.ts` 包含完整的中英文字典，但仅在落地页使用。主应用（`orbit/page.tsx` 及其所有子组件）约 30+ 处硬编码中文：
- 所有按钮标签、提示、占位符
- 状态栏（"进度"、"分布"）
- 日期格式（"5月13日"、"周一"）
- 空状态消息
- 方法论面板标签

### 3. 等距引擎是死代码
`isometric-engine.ts` 有 1,034 行完全实现的代码（35 个导出），但从未在任何地方导入。这是一个重要的未使用资产，要么完成集成，要么移除。

### 4. memo 优化被破坏
`ScheduleCardWrapper`（memo'd）每次都接收新的 `task` 和 `position` 对象引用。浅比较总是检测到更改，导致整个卡片层级重新渲染。所有 memo 包装器都被绕过。

### 5. 方法论面板持久化不一致
- GTD、帕累托、莫法特、豪威尔、SWOT：使用 `saveMethodologyData`
- 番茄钟：完全无持久化
- 所有方法论文本数据存储在同一个 `orbital_schedule_v1` 键下，无独立的模式版本

---

## 五、改进路线图

### 第一阶段：关键 Bug 修复（已完成 ✅）
- ✅ 全部 10 个 P0 错误已修复
- ✅ 12 个 P1 错误中的 8 个已修复

### 第二阶段：重大改进（进行中）
- [ ] 为所有 6 个方法论面板添加错误边界
- [ ] 修复 memo 级联（稳定任务对象引用）
- [ ] 动画循环性能优化（记忆化彗星位置）
- [ ] 清理 AppState 无用字段
- [ ] 移除或集成等距引擎
- [ ] 修复 ConnectorArrows DOM 销毁/重建
- [ ] 修复 CSS 悬停中和

### 第三阶段：完整性
- [ ] 主应用全面国际化（30+ 字符串迁移到 `getT()`）
- [ ] PWA 支持（service worker、清单、离线缓存）
- [ ] 关键路径单元测试
- [ ] Playwright 端到端测试
- [ ] 修复所有 P2 错误

### 第四阶段：打磨
- [ ] 全面无障碍审计和修复（ARIA、焦点管理、键盘导航）
- [ ] 重型面板虚拟化
- [ ] `React.lazy()` 代码分割
- [ ] 计时器音频/通知系统

---

## 六、未来方向

### 近期（1-3 个月）— SQTP 完成

- 完成第二阶段和第三阶段
- 用户引导/入门流程
- 数据导出/导入（JSON、CSV）
- 跨日拖放任务
- 富文本编辑（Markdown 支持）
- 可自定义任务类型颜色
- 深色/浅色主题（目前仅深色）

### 中期（3-6 个月）— 功能扩展

- 云同步（Supabase/Firebase 后端，冲突解决）
- 用户账户（OAuth：GitHub、Google）
- 统计仪表板（热图、生产力趋势、方法论有效性指标）
- 日历双向同步（Google Calendar、Apple Calendar）
- REST API
- 插件系统（社区贡献的方法论面板）
- 原生移动端封装（Capacitor/Tauri）

### 远期（6-12 个月以上）— 生态系统愿景

- 方法论市场
- 团队功能（共享工作区、协作日程）
- 智能通知（上下文感知提醒）
- 可穿戴设备集成（Apple Watch、Wear OS）
- 数据可移植性（CalDAV、Jira、Notion、Obsidian 格式）
- 社区本地化（日语、韩语、西班牙语、法语等）
- 学术研究数据收集（匿名、选择加入）— 与 SQTP 教育使命一致

---

## 七、对 SQTP 的建议

1. **文档：** 为渲染引擎、状态管理系统和方法论文本插件架构编写技术文档 —— 可形成学术论文或技术报告。

2. **可用性研究：** 对 10-20 名学生进行用户研究，比较 OrbitAN 与现有生产力应用的效果。收集定量数据。

3. **开源社区建设：** 积极维护 GitHub 仓库，提供良好的首次 issue、贡献指南和讨论区。在浙大校园内招募贡献者。

4. **展示：** 在浙大创新博览会或计算机科学系研讨会上展示。独特的宇宙可视化使其在视觉上引人注目。

5. **论文潜力：** Canvas 2D 渲染、触控交互模式、方法论集成 —— 可作为会议论文或毕业论文的基础。

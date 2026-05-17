# OrbitAN — MiMo Orbit 创作者激励计划申请材料

## 一、目前主要使用的底层模型系列

| 模型系列 | 使用场景 |
|----------|----------|
| **Claude (Opus 4.7 / Sonnet 4.6)** | 核心开发引擎。全部前端代码生成（React 19 + Next.js 16 + TypeScript + Tailwind CSS v4）、Canvas 2D 渲染引擎编写、CSS 动画系统设计、SVG Logo 迭代设计、多轮设计评审与重构。日均调用 80-150 次，单次上下文 30K-80K tokens，含完整文件读写与跨文件重构 |
| **DeepSeek (V4-Pro)** | 辅助代码审查、CSS 性能优化建议、复杂布局 debug。用于长上下文场景（全量 globals.css 约 1000 行一次性加载分析） |
| **GPT (4o)** | 文案润色、中英文 i18n 翻译校对、文档生成 |

**工具链**：Claude Code CLI（主）+ Playwright MCP（浏览器验证）+ Vercel MCP（部署）+ Context7 MCP（文档查询）

---

## 二、AI 驱动构建的具体成果

### 项目：OrbitAN — 轨道计划

**核心痛点**：传统日程管理工具的界面同质化严重，缺乏将时间管理方法论（GTD、番茄钟、帕累托等六种）与视觉化时间感知结合的方案。用户需要的是一个"看得见时间流动"的规划系统，而非另一份待办清单。

**目标用户**：需要深度时间管理的学生与知识工作者，偏好视觉化、空间化时间感知的用户。

**核心逻辑流（完整 Agent 工作流）**：

```
需求理解 → 任务拆解 → 并行 Agent 执行 → 结果验证 → 人工审核闭环
    │            │              │              │              │
    ▼            ▼              ▼              ▼              ▼
 用户描述     Plan Agent    Explore Agent   build 验证    浏览器实测
 设计方向     生成实施计划   读取全量代码    TypeScript    Playwright
             + 架构设计     分析现有模式    编译检查      MCP 截图
                           + 依赖追踪                   人工确认
```

- **长链推理**：单次设计变更（如 Logo 从文字→SVG→阴阳块→轨道星座→环字融合）经历 6+ 轮迭代，每轮包含：现有代码分析→设计方案→CSS/TSX 实现→构建验证→用户反馈→下一轮。上下文跨越 15+ 次文件读写
- **多 Agent 协作**：Explore Agent（代码探索）+ Plan Agent（架构设计）+ 主 Agent（代码执行），三者通过结构化输出协同
- **工具调用**：Read/Write/Edit/Grep/Glob（文件操作）+ Bash（构建验证）+ MCP Playwright（浏览器测试）+ MCP Vercel（部署）
- **自动化执行**：CSS 批量替换通过 Node.js 脚本自动化（单次修改 20+ 选择器），构建验证自动化（每次提交前 `next build`）
- **人工审核闭环**：每次设计变更后用户反馈→调整→再构建→再审核，形成完整迭代闭环

**已取得成果**：
- 14 个功能完整的 React 组件（landing page 全部组件 + Logo + 交互系统）
- 60+ 次 git commit，全部通过构建验证
- GitHub 仓库：https://github.com/LinearWings/OrbitAN
- 在线 Demo：https://linearwings.github.io/OrbitAN
- 完整的 deep-space 视觉系统：Tyndall 光束、SVG 噪点、径向星云辉光、三层景深系统
- 交互式 192→320 格实时时间戳矩阵（HH:MM:SS 每秒刷新 + 三级辉光扩散悬浮）
- 自定义 SVG Logo（6 轮迭代：文字→阴阳块→轨道星座→环字融合）
- 工程图学箭头分隔系统（6 个 section 之间）
- i18n 双语支持（中/英，70+ 翻译键）

**Token 消耗潜力**：
- 日均 Claude API 调用：80-150 次
- 平均上下文窗口：30K-80K tokens/次（全文件读写模式）
- 预计月消耗：15M-30M tokens（Claude 系列）
- 高频场景：全量 CSS 重构（1000+ 行单文件）、多文件联动修改（6+ 文件同时编辑）、长链设计迭代（15+ 轮连续对话）

---

## 三、使用证明与影响力证明

### 主证据（通过率最高）
1. **GitHub 仓库**：https://github.com/LinearWings/OrbitAN — 60+ commits，完整项目历史
2. **在线 Demo**：https://linearwings.github.io/OrbitAN — 可直接访问的产品

### 补充证据
3. **Git commit 日志**：展示 AI 协作的完整迭代过程（每个 commit 的 Co-Authored-By: Claude）
4. **CLAUDE.md**：项目根目录下的 AI 编码指南，证明系统化的 AI 协作流程
5. **项目文档**：README.md（中英双语）、CONTRIBUTING.md、docs/project-analysis.md

---

## 四、最终输出

### 正式申请版

OrbitAN 是一个基于 AI Agent 工作流驱动开发的深度时间管理应用。项目核心创新在于将六种经典时间管理方法论（GTD、番茄钟、帕累托、莫法特、豪威尔矩阵、SWOT）与轨道力学隐喻融合，通过 Canvas 2D 渲染引擎和 CSS 视觉系统构建了一个"看得见时间流动"的规划界面。

技术栈为 Next.js 16 + React 19 + TypeScript + Tailwind CSS v4，纯静态导出部署于 GitHub Pages。全部前端代码由 Claude Code CLI 驱动生成，采用"需求理解→任务拆解→多 Agent 并行探索→实施计划→代码生成→构建验证→人工审核"的七步 Agent 工作流。项目累计 60+ 次 AI 辅助提交，14 个功能组件，1000+ 行全局 CSS 视觉系统。

开发过程中涉及大量长链推理场景：Logo 设计经历 6 轮迭代（文字→阴阳块→轨道星座→环字融合），每轮跨越 15+ 次文件读写；时间戳矩阵从 60→96→192→320 格逐步加密，悬浮交互从简单高亮升级为三级辉光扩散系统；全局光效经历 4 轮调整（初始→提亮→暖化→压暗）。日均 API 调用 80-150 次，单次上下文 30K-80K tokens。

未来计划使用 MiMo API Token 继续推进：完成 Orbit Mode 全屏交互的 Canvas 渲染优化（高帧率场景需要大量迭代）、扩展方法论面板的 AI 辅助建议功能（长上下文推理）、以及移动端响应式适配的全面测试（多轮浏览器自动化验证）。

### 精简版（300 字以内）

OrbitAN 是一个轨道力学隐喻的时间管理应用，由 Claude Code CLI 驱动的 AI Agent 工作流全程开发。项目将 GTD、番茄钟等六种方法论与 Canvas 2D 轨道可视化融合，构建了完整的 deep-space 视觉系统。技术栈：Next.js 16 + React 19 + TypeScript，纯静态部署。

开发采用七步 Agent 工作流闭环：需求理解→任务拆解→多 Agent 并行探索→实施计划→代码生成→构建验证→人工审核。累计 60+ 次 AI 辅助提交，日均 API 调用 80-150 次，单次上下文 30K-80K tokens。涉及大量长链推理（Logo 6 轮迭代、光效 4 轮调整、交互系统 3 轮升级）和多 Agent 协作（Explore + Plan + 主 Agent 协同）。

GitHub: https://github.com/LinearWings/OrbitAN
Demo: https://linearwings.github.io/OrbitAN

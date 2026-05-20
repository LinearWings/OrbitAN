"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { getT } from "@/lib/i18n";

const CHANGELOG = [
  {
    version: "v0.6",
    date: "2026-05-20",
    changes: {
      zh: [
        "全面代码审计：修复闭包过期、渲染错误、性能问题",
        "全站 i18n 支持（orbit 页面所有组件）",
        "Logo 升级：精致静态设计，去掉动画特效",
        "周视图自包含新建日程（时间轴点击选择时间）",
        "周视图日程条显示开始–结束时间",
        "Tag 颜色系统修复：自定义类型颜色实时同步",
        "自定义类型扩展：16 色调色板 + 原生颜色选择器",
        "OrbitalLaunchWizard 支持自定义类型",
        "移动端适配：iPad 箭头、长按删除、按钮尺寸、字体大小",
        "Landing 页 section 过渡效果优化",
        "去掉所有「轨道计划」标识",
        "ErrorBoundary 全局错误捕获",
        "新增 sanitizeSvg 安全工具",
      ],
      en: [
        "Comprehensive code audit: stale closures, rendering bugs, performance",
        "Full i18n support for all orbit page components",
        "Logo upgrade: refined static design, animations removed",
        "Week view self-contained task creation (timeline click-to-select)",
        "Week view task blocks show start–end time range",
        "Tag color system fix: custom type colors sync in real-time",
        "Custom type expansion: 16-color palette + native color picker",
        "OrbitalLaunchWizard supports custom types",
        "Mobile: iPad arrows, long-press delete, button sizes, font sizes",
        "Landing page section transition smoothing",
        "Remove all 「轨道计划」 branding",
        "ErrorBoundary global error catching",
        "New sanitizeSvg security utility",
      ],
    },
  },
  {
    version: "v0.5",
    date: "2026-05-13",
    changes: {
      zh: [
        "Landing 页面与文档网站（i18n 中英双语）",
        "鼠标长按删除 + 动画垃圾桶气泡",
        "Ctrl+Z 撤销删除任务和聚焦块",
        "周视图液态玻璃聚焦块重设计",
        "Orbit Plan 任务属性 + 方法论发光",
        "点击聚焦弧线/卡片进入方法论",
      ],
      en: [
        "Landing page & documentation website with i18n (zh/en)",
        "Mouse long-press delete with animated trash bubble",
        "Ctrl+Z undo for deleted tasks and focus blocks",
        "Week view liquid glass focus block redesign",
        "Orbit Plan task property with methodology glow",
        "Click-to-enter methodology from focus arcs and cards",
      ],
    },
  },
  {
    version: "v0.4",
    date: "2026-05-10",
    changes: {
      zh: ["周/月视图导航", "时钟双击创建聚焦块", "方法选择弹窗", "聚焦弧线重叠感知环分配", "液态玻璃卡片揭示动画"],
      en: ["Week & month view navigation", "Focus block creation via click-twice on clock", "Method picker popup after focus creation", "Focus block arc overlap-aware ring assignment", "Liquid glass card reveal animations"],
    },
  },
  {
    version: "v0.3",
    date: "2026-04-28",
    changes: {
      zh: ["Orbit Mode 聚焦系统", "六大方法论面板", "24 小时径向时钟 + 彗星轨迹"],
      en: ["Orbit Mode with focus block system", "Six methodology panels", "24-hour radial clock with comet trails"],
    },
  },
  {
    version: "v0.2",
    date: "2026-04-20",
    changes: {
      zh: ["时钟表盘内联创建任务", "日程卡片重叠感知分配", "连接箭头系统", "进度条与内联时间编辑"],
      en: ["Inline task creation on the clock face", "Schedule card distribution with overlap avoidance", "Connector arrow system", "Progress bar and inline time editing"],
    },
  },
  {
    version: "v0.1",
    date: "2026-04-15",
    changes: {
      zh: ["初始版本：Canvas 2D 轨道时钟", "任务 CRUD + localStorage 持久化", "键盘快捷键与日期导航", "构造主义宇宙视觉主题"],
      en: ["Initial release with Canvas 2D orbital clock", "Task CRUD with localStorage persistence", "Keyboard shortcuts and day navigation", "Constructivist cosmic visual theme"],
    },
  },
];

export default function ChangelogPage() {
  const lang = useLanguage();
  const t = getT(lang);

  return (
    <div className="max-w-3xl mx-auto px-8 py-16">
      <Link href="/docs" className="text-xs text-white/20 hover:text-white/40 transition-colors mb-8 inline-block">{t.back_docs}</Link>
      <h1 className="text-4xl font-semibold tracking-tight mb-2 text-white/85" style={{ fontFamily: "'Clash Display', sans-serif" }}>{t.changelog_title}</h1>
      <p className="text-white/30 mb-12">{t.changelog_desc}</p>

      <div className="space-y-10">
        {CHANGELOG.map((v) => (
          <div key={v.version}>
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-sm font-semibold text-white/70" style={{ fontFamily: "'Clash Display', sans-serif" }}>{v.version}</span>
              <span className="text-xs text-white/15">{v.date}</span>
            </div>
            <ul className="space-y-1.5">
              {(v.changes[lang] ?? v.changes.zh).map((c) => (
                <li key={c} className="text-sm text-white/30 flex items-start gap-2">
                  <span className="text-white/10 mt-0.5">&bull;</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

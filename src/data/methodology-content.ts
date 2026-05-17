import type { FocusMethodId } from "@/types/focus";

export interface MethodologyStep {
  label: string;
  detail: string;
}

export interface MethodologyGuide {
  id: FocusMethodId;
  titleZh: string;
  titleEn: string;
  shortZh: string;
  shortEn: string;
  sourceDoc: string;
  originZh: string;
  principles: string[];
  workflow: MethodologyStep[];
  tactics: string[];
  bestFor: string[];
  cautions: string[];
  appModel: string;
  prompts: string[];
}

export const METHODOLOGY_GUIDES: MethodologyGuide[] = [
  {
    id: "gtd",
    titleZh: "GTD 搞定工作法",
    titleEn: "Getting Things Done",
    shortZh: "把所有待处理事项移出大脑，放进可信系统，再按情境、时间、精力和重要性选择下一步行动。",
    shortEn: "Externalize open loops into a trusted system, then choose next actions by context, time, energy, and importance.",
    sourceDoc: "GTD研究报告.docx",
    originZh: "GTD 由 David Allen 提出，核心不是把日程排满，而是清空大脑、明确行动、减少焦虑，让注意力回到当前可执行的动作上。",
    principles: [
      "大脑用于思考，不用于记事；所有任务、想法、提醒都先进入外部收件箱。",
      "每个项目都要被澄清成具体的下一步行动，避免“继续推进项目”这类模糊表达。",
      "两分钟内能完成的事项立即处理，避免轻量杂务堆积成心理负担。",
      "每周回顾是系统可信的关键：清空收件箱、更新项目、检查等待清单。",
    ],
    workflow: [
      { label: "收集", detail: "记录所有待处理事项，不在记录当下判断价值或优先级。" },
      { label: "理清", detail: "逐项判断是否需要行动；无需行动的归档、删除或放入将来/也许。" },
      { label: "组织", detail: "按下一步行动、等待、日历、项目、参考资料等清单分类。" },
      { label: "回顾", detail: "定期检查清单和项目，保证系统可靠，避免遗漏。" },
      { label: "执行", detail: "按情境、可用时间、精力水平和重要性选择当前行动。" },
    ],
    tactics: [
      "为每条任务写出动词开头的下一步行动，例如“发送确认邮件”而不是“处理合作”。",
      "把委托给他人的事项放进等待清单，并写清楚等待对象和下一次跟进时间。",
      "在聚焦块开始前先清空收件箱，减少工作中反复想起杂事的概率。",
    ],
    bestFor: [
      "事务繁杂、容易遗漏的学习或工作阶段",
      "害怕忘事而反复回想，导致注意力被占用的情况",
      "需要把长期项目拆成可执行动作的项目管理场景",
    ],
    cautions: [
      "如果事情很少或高度规律，维护完整 GTD 系统的成本可能高于收益。",
      "GTD 不能替代价值判断；它负责让任务变清楚，优先级仍需要你决定。",
    ],
    appModel: "OrbitAN 使用五列看板承载 GTD：收集、整理、组织、回顾、执行。条目可以拖拽迁移，所有数据保存在本地。",
    prompts: [
      "这件事是否需要行动？",
      "如果需要，下一步具体动作是什么？",
      "这件事是否两分钟内可以完成？",
      "它应该进入下一步行动、等待、日历，还是将来/也许？",
    ],
  },
  {
    id: "pomodoro",
    titleZh: "番茄工作法",
    titleEn: "Pomodoro Technique",
    shortZh: "用 25 分钟专注和 5 分钟休息建立节奏，并通过预测、记录和复盘持续改善专注质量。",
    shortEn: "Use 25-minute focus cycles and 5-minute breaks, then improve attention quality through prediction, tracking, and review.",
    sourceDoc: "番茄工作法.docx",
    originZh: "番茄工作法由 Francesco Cirillo 在 1992 年正式创立，来自其使用番茄形厨房定时器提升学习效率的实践。",
    principles: [
      "一个标准番茄时间由 25 分钟专注和 5 分钟休息组成，完成 4 轮后进行 15 至 30 分钟长休息。",
      "方法完整闭环包括规划、预测、跟踪、记录、处理、改善，而不只是倒计时。",
      "专注期间遇到临时念头，先快速记到计划外事项中，休息时再处理。",
      "25+5 是默认节奏，不是铁律；可根据精力状态调整为更合适的专注长度。",
    ],
    workflow: [
      { label: "规划", detail: "准备活动清单和今日待办，并预留计划外紧急项。" },
      { label: "预测", detail: "估计每项活动需要几个番茄时间。" },
      { label: "专注", detail: "启动计时，在一个番茄时间内只处理当前任务。" },
      { label: "记录", detail: "记录完成数量、干扰次数、预测与实际之间的差异。" },
      { label: "改善", detail: "按天或按周复盘数据，调整任务拆分和节奏。" },
    ],
    tactics: [
      "把任务拆到 1 到 4 个番茄内可完成的粒度，过大的任务先拆分。",
      "中断想法只记录关键词，不展开处理，避免一个番茄被打断。",
      "若正在处理连续性极强的工作，可延长专注段，但仍要保留强制休息。",
    ],
    bestFor: [
      "容易分心、需要外部节奏约束的学习和写作",
      "可以拆成小步骤的作业、编码、阅读和整理任务",
      "需要积累可复盘专注数据的备考或长期项目",
    ],
    cautions: [
      "连续思路很强的任务可能不适合被机械切断，应根据任务性质调整时长。",
      "休息是方法的一部分，跳过休息会让后续番茄质量下降。",
    ],
    appModel: "OrbitAN 的番茄面板提供专注、短休息、长休息三阶段倒计时，4 轮后自动进入长休息，并持久化剩余时间和阶段。",
    prompts: [
      "这个番茄的唯一目标是什么？",
      "我预计它需要几个番茄？",
      "刚才的中断来自外部，还是来自自己的念头？",
      "今天的预测和实际差异说明了什么？",
    ],
  },
  {
    id: "pareto",
    titleZh: "帕累托法则",
    titleEn: "Pareto Principle",
    shortZh: "识别少数能产生乘数效应的关键任务，把有限注意力从平均用力转向精准发力。",
    shortEn: "Identify the vital few tasks with multiplier effects and move from equal effort to strategic focus.",
    sourceDoc: "帕累托法则：大学生时间管理的底层逻辑与理论重构(1).docx",
    originZh: "帕累托法则源于 Vilfredo Pareto 对财富分配的观察，在时间管理中可理解为一种“选择的智慧”。",
    principles: [
      "关键因子通常只占少数，却决定大部分结果；时间投入和产出常呈非线性关系。",
      "机会成本是核心意识：把时间花在低价值 80% 上，就失去攻克高价值 20% 的可能。",
      "关键任务不一定永远固定，应随阶段目标、课程、项目和精力状态动态调整。",
      "帕累托不是只做 20%，而是先识别能撬动整体结果的关键支点。",
    ],
    workflow: [
      { label: "列出任务", detail: "把同一目标下的任务放到同一张清单中比较。" },
      { label: "评估影响", detail: "判断完成后对绩点、项目、升学、就业或长期能力的贡献。" },
      { label: "评估成本", detail: "估算时间、精力、依赖和切换成本。" },
      { label: "筛选关键", detail: "优先选择高影响、低或中等成本的任务。" },
      { label: "动态复评", detail: "完成关键任务后重新评估剩余任务，避免旧优先级失效。" },
    ],
    tactics: [
      "用“对目标的贡献”而不是“看起来多紧急”来评估影响分。",
      "为核心专业课、关键项目、外语能力、科研经历等高杠杆任务预留黄金时段。",
      "把低价值任务简化、合并、延后或委托，减少注意力碎片化。",
    ],
    bestFor: [
      "任务很多但不知道先做什么",
      "大学生课程、竞赛、科研、实习等多目标并行",
      "需要从忙碌状态转向高价值产出的阶段规划",
    ],
    cautions: [
      "不要把二八比例当成精确数学公式，它更像动态筛选原则。",
      "长尾探索仍有价值，尤其在不确定环境下可以提升反脆弱性。",
    ],
    appModel: "OrbitAN 的帕累托面板用 Impact/Effort 滑块计算得分，自动高亮 Vital 20%，并用分布条展示关键任务的贡献占比。",
    prompts: [
      "哪件事完成后会让其他任务变得更容易？",
      "这项任务的边际收益是否已经递减？",
      "如果今天只能完成一件事，哪件最能改变结果？",
      "我是否在用低价值忙碌逃避关键任务？",
    ],
  },
  {
    id: "moffatt",
    titleZh: "莫法特休息法",
    titleEn: "Moffatt Rest Method",
    shortZh: "通过主动切换任务类型和用脑区域来恢复精力，把“换脑”变成可计划的休息。",
    shortEn: "Recover energy by switching task types and cognitive modes, turning context change into planned rest.",
    sourceDoc: "莫法特休息法.docx",
    originZh: "莫法特休息法的核心不是停止工作，而是通过转换活动让原先高度兴奋的脑区休息，同时激发新的活力。",
    principles: [
      "长时间持续处理同一种任务会让相应用脑区域疲劳，效率下降。",
      "切换到另一类活动可以形成主动休息，尤其适合长期项目和多任务学习。",
      "切换不是随意分心，而是在计划内进行左右脑、动静、难易和兴趣之间的转换。",
      "巅峰时间处理要事，低潮时间处理简单事务，能让轮换更符合精力曲线。",
    ],
    workflow: [
      { label: "分类任务", detail: "把待办按逻辑分析、创意发散、动态整理、机械事务等类型分组。" },
      { label: "安排周期", detail: "以 90 至 120 分钟为大周期，周期内穿插不同任务类型。" },
      { label: "主动切换", detail: "在疲劳前切换到另一种用脑方式，把切换当作微型休息。" },
      { label: "记录能量", detail: "观察不同组合对效率和疲劳感的影响。" },
      { label: "调整顺序", detail: "把高难任务放到精力峰值，把简单事务放到低潮段。" },
    ],
    tactics: [
      "逻辑分析后切换到创意构思，写报告后切换到画图或头脑风暴。",
      "静坐任务后插入整理文件、伸展、走动等动态活动。",
      "高难任务和机械任务交替，避免持续压榨同一种注意力。",
    ],
    bestFor: [
      "长时间学习、写作、开发或备赛",
      "单一任务持续太久后效率明显下降",
      "一天内必须推进多类工作的情况",
    ],
    cautions: [
      "切换应服务于恢复和推进，不应变成逃避核心任务的借口。",
      "任务之间最好保留清晰结束标记，避免频繁切换造成上下文损耗。",
    ],
    appModel: "OrbitAN 使用 8 个会话阶段呈现莫法特轮换，默认每段 25 分钟，适合把一个大周期拆成可执行的任务类型序列。",
    prompts: [
      "我现在疲劳的是哪一种能力：逻辑、语言、创意、社交还是体力？",
      "下一个任务能否使用不同的脑区或身体状态？",
      "这个切换是在恢复精力，还是在逃避难题？",
      "今天的巅峰时间应该留给哪件最重要的事？",
    ],
  },
  {
    id: "howell",
    titleZh: "豪威尔矩阵",
    titleEn: "Howell / Eisenhower Matrix",
    shortZh: "用重要性和紧急性区分事务，减少救火式忙碌，把时间转向真正有长期价值的第二象限。",
    shortEn: "Separate urgency from importance, reduce reactive firefighting, and invest more time in valuable non-urgent work.",
    sourceDoc: "豪威尔矩阵.docx",
    originZh: "豪威尔矩阵与艾森豪威尔矩阵同源，通过重要性和紧急性两个维度建立任务取舍框架。",
    principles: [
      "高效时间管理不是填满时间，而是精准选择。",
      "很多焦虑来自把紧急误当重要，被低价值的紧急事务牵着走。",
      "长期效率来自第二象限：重要但不紧急的学习、规划、预防和关系维护。",
      "授权与舍弃是矩阵不可缺少的一部分，否则第三、第四象限会持续吞噬精力。",
    ],
    workflow: [
      { label: "重要且紧急", detail: "立即执行。处理截止迫近、会造成损失或影响核心目标的事项。" },
      { label: "重要不紧急", detail: "规划落实。固定时间推进长期成长、核心项目和能力建设。" },
      { label: "紧急不重要", detail: "委托或简化。处理临时通知、非核心会议、他人的一般请求。" },
      { label: "不重要不紧急", detail: "控制或舍弃。减少无目的消遣、无效闲聊和重复琐事。" },
    ],
    tactics: [
      "每天先为第二象限预留时间，减少未来第一象限的危机。",
      "对第三象限任务写下最小处理方式：委托、模板回复、延后批处理。",
      "复盘第一象限任务来源，找出哪些本可通过提前规划避免。",
    ],
    bestFor: [
      "优先级混乱、同时被多个截止日期追赶",
      "学习和工作中总在救火，长期目标被挤压",
      "需要判断哪些请求应接受、委托或拒绝",
    ],
    cautions: [
      "紧急性容易制造错觉，分类时必须先问它是否真正服务核心目标。",
      "第二象限不会主动催促你，必须主动安排，否则最容易被牺牲。",
    ],
    appModel: "OrbitAN 的豪威尔矩阵提供四象限输入和拖拽迁移，分别对应立即执行、规划落实、委托简化、控制舍弃。",
    prompts: [
      "这件事不做会不会影响核心目标？",
      "它是真的紧急，还是只是别人希望我立刻响应？",
      "哪些第一象限任务可以通过第二象限投入减少？",
      "这件事能否委托、批处理或直接舍弃？",
    ],
  },
  {
    id: "swot",
    titleZh: "SWOT 时间管理分析",
    titleEn: "SWOT Analysis",
    shortZh: "从优势、劣势、机会和威胁审视自我与环境，把时间管理从排日程提升到策略选择。",
    shortEn: "Analyze strengths, weaknesses, opportunities, and threats to move time management from scheduling to strategy.",
    sourceDoc: "SWOT.docx",
    originZh: "SWOT 分析源于战略管理，用内部因素和外部因素的分类帮助决策；在时间管理中，它用于认识自身处境和行动约束。",
    principles: [
      "优势和劣势属于内部因素，机会和威胁属于外部因素。",
      "时间管理不是把人变成机器，而是在承认自身状态、资源和限制后做策略选择。",
      "拖延有时不是懒惰，而是完美主义、害怕失败或环境干扰的外显结果。",
      "屏蔽干扰与接纳突发之间需要判断：它是刚性时间窗口的救急，还是逃避动机的伪紧急？",
    ],
    workflow: [
      { label: "S 优势", detail: "列出高效时段、擅长学科、已有资源、稳定习惯和支持系统。" },
      { label: "W 劣势", detail: "列出拖延模式、技能短板、情绪阻力、容易被打断的场景。" },
      { label: "O 机会", detail: "列出课程资源、竞赛、导师、社群、碎片时间和外部支持。" },
      { label: "T 威胁", detail: "列出临时 ddl、通知干扰、健康风险、环境噪音和时间窗口收紧。" },
      { label: "转行动", detail: "把 SO、WO、ST、WT 组合转成具体策略。" },
    ],
    tactics: [
      "SO 杠杆策略：用优势抓住机会，例如在最高效时段推进最重要任务。",
      "WO 补强策略：利用外部机会弥补弱点，例如用图书馆闭关时间对抗拖延。",
      "ST 防御策略：用优势抵御威胁，例如用清晰边界减少通知干扰。",
      "WT 保守策略：降低弱点和威胁叠加的风险，例如为长期 ddl 设置提前缓冲。",
    ],
    bestFor: [
      "项目启动、周复盘、季度规划和自我提升计划",
      "需要看清拖延、焦虑、干扰背后原因的阶段",
      "学习、工作和生活目标互相冲突时的策略选择",
    ],
    cautions: [
      "SWOT 不是完美计划表，而是一张认知地图；分析后必须落到行动。",
      "不要只写抽象词，要写具体场景，例如“公开演讲焦虑”比“表达弱”更可执行。",
    ],
    appModel: "OrbitAN 的 SWOT 面板提供四格输入，用于记录内外部因素，并引导用户从分析条目转成下一步策略。",
    prompts: [
      "我擅长什么，哪些资源已经在手里？",
      "我害怕什么，哪些拖延模式反复出现？",
      "环境能给我什么机会或支持？",
      "什么因素正在阻碍我，我要屏蔽、接纳还是预案处理？",
    ],
  },
];

export function getMethodologyGuide(id: FocusMethodId): MethodologyGuide {
  return METHODOLOGY_GUIDES.find((guide) => guide.id === id) ?? METHODOLOGY_GUIDES[0]!;
}

function list(items: string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

function numberedSteps(items: MethodologyStep[]): string {
  return items.map((item, index) => `${index + 1}. **${item.label}**：${item.detail}`).join("\n");
}

export function methodologyGuideToMarkdown(guide: MethodologyGuide): string {
  return `# ${guide.titleZh} · ${guide.titleEn}

${guide.shortZh}

## 理论来源

${guide.originZh}

资料来源：${guide.sourceDoc}

## 核心原则

${list(guide.principles)}

## 操作流程

${numberedSteps(guide.workflow)}

## 实践策略

${list(guide.tactics)}

## 适用场景

${list(guide.bestFor)}

## 注意事项

${list(guide.cautions)}

## OrbitAN 中的实现

${guide.appModel}

## 开始前自问

${list(guide.prompts)}`;
}

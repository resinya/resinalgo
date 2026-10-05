import { createGetUrl } from "fumadocs-core/source";

export const appName = "resin-notes";

// 部署后如果有自定义域名，在 Vercel 配 NEXT_PUBLIC_SITE_URL 覆盖即可
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://resinalgo.vercel.app";

export const siteTitle = `${appName} · 树脂的 AI Agent 笔记`;

export const siteDescription =
  "resin-notes 是树脂的技术笔记站，记录 AI Agent 与大语言模型应用的工程化实践：" +
  "Agent 架构设计、工具调用与 MCP、上下文工程、多智能体协作与工作流编排、" +
  "RAG 检索增强、记忆与状态管理、评测与可观测性，以及 TypeScript / Next.js 全栈落地经验。" +
  "持续更新的学习笔记与工程复盘。";

export const author = {
  name: "树脂",
  url: "https://github.com/resinya",
};

export const keywords = [
  "AI Agent",
  "AI 智能体",
  "Agent 工程化",
  "LLM 应用",
  "大语言模型",
  "Multi-Agent",
  "多智能体协作",
  "Agent 架构设计",
  "Tool Calling",
  "Function Calling",
  "MCP",
  "上下文工程",
  "Context Engineering",
  "Prompt Engineering",
  "提示词工程",
  "RAG",
  "检索增强生成",
  "向量检索",
  "Agent 记忆",
  "记忆与状态管理",
  "工作流编排",
  "Workflow Orchestration",
  "LangGraph",
  "LangChain",
  "Agent 评测",
  "LLM Eval",
  "可观测性",
  "Observability",
  "Tracing",
  "LLM Ops",
  "Agent 安全",
  "TypeScript",
  "Next.js",
  "全栈工程化",
  "工程实践",
  "技术笔记",
  "学习笔记",
  "树脂",
];

/**
 * 首页 Hero 视频源。
 *
 * 默认读 public/ 下的本地文件；如果视频放到对象存储（OSS/COS/R2 等），
 * 在部署环境配对应的 NEXT_PUBLIC_HERO_* 环境变量即可，代码不用动。
 *
 * 注意 NEXT_PUBLIC_ 变量是**构建时内联**的：改了之后要重新部署才生效。
 * 本地开发写在项目根目录的 .env.local 里（该文件已在 .gitignore 中）。
 */
/**
 * 环境变量留空时读到的是空字符串 ''，不是 undefined，
 * 所以额外做一次 trim 判断，避免产生空的 src。
 */
function configured(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export const heroVideo = {
  webm: configured(process.env.NEXT_PUBLIC_HERO_VIDEO_WEBM) ?? "/hero.webm",
  mp4: configured(process.env.NEXT_PUBLIC_HERO_VIDEO_MP4) ?? "/hero.mp4",
  poster:
    configured(process.env.NEXT_PUBLIC_HERO_VIDEO_POSTER) ?? "/hero-poster.jpg",
};

/**
 * 首页 Hero 中间显示的圆形头像。
 * 默认放在对象存储上；想换成本地图就配 NEXT_PUBLIC_AVATAR_URL=/resin.jpg。
 */
export const avatarUrl =
  configured(process.env.NEXT_PUBLIC_AVATAR_URL) ??
  "https://resin-notes.oss-cn-hangzhou.aliyuncs.com/public/resin.jpg";

/**
 * 站点上线时间，首页底部的「已运行」计时器从这一刻开始算。
 *
 * 想改起点就改这个字符串——写成带时区偏移的本地时间最直观，
 * 例如 "2026-10-05T00:00:00+08:00" 表示北京时间 2026-10-05 零点。
 */
export const siteLaunchAt =
  configured(process.env.NEXT_PUBLIC_SITE_LAUNCH_AT) ??
  "2026-10-05T00:00:00+08:00";

export const categories = [
  {
    slug: "feelings",
    title: "感触",
    description: "日常记录与心里话，不谈技术，只写当下的想法。",
  },
  {
    slug: "engineering",
    title: "工程化",
    description:
      "实际开发中的工程实践：架构决策、构建部署、质量保障与协作方式。",
  },
  {
    slug: "stack",
    title: "技术栈",
    description: "前后端技术文章：语言、框架、运行时与底层原理。",
  },
];

export const docsRoute = "/docs";
export const docsImageRoute = "/og/docs";
export const docsContentRoute = "/llms.mdx/docs";

// fill this with your actual GitHub info, for example:
export const gitConfig = {
  user: "resinya",
  repo: "resinalgo",
  branch: "main",
};

const getContentUrl = createGetUrl(docsContentRoute);

export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, "content.md"];

  return { segments, url: getContentUrl(segments, page.locale) };
}

const getImageUrl = createGetUrl(docsImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, "image.png"];

  return { segments, url: getImageUrl(segments, page.locale) };
}

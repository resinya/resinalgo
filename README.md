# resin-notes

> 树脂的个人技术笔记站 —— 记录 AI Agent 与 LLM 应用的工程化实践，以及 TypeScript / Next.js 全栈落地经验。

一个由 [Fumadocs](https://fumadocs.dev) 驱动的静态文档站：首页全屏视频 Hero + 四个内容分类 + 全文搜索，同时对搜索引擎和 LLM 友好（自动生成 `llms.txt`、支持 Markdown 内容协商、按页生成 OG 分享图）。

## 技术栈

| 分类 | 选型 | 版本 | 说明 |
| --- | --- | --- | --- |
| 框架 | Next.js（App Router） | 16.3.5 | 默认走 Turbopack 构建 |
| UI 运行时 | React | 19.3 | — |
| 文档框架 | Fumadocs Core / MDX / UI | 16.15.17 | UI 包为 `@fumadocs/base-ui` |
| 样式 | Tailwind CSS | 4.3 | 无 `tailwind.config`，配置写在 CSS 里 |
| 类型 | TypeScript | 7.0 | — |
| 代码规范 | Biome | 2.5 | 同时承担 lint 与 format |
| 包管理 | pnpm | — | 仓库内含 `pnpm-lock.yaml` |

## 目录结构

```
resinalgo/
├── content/docs/            # 所有文档内容（唯一的内容源）
│   ├── meta.json            # 顶层排序：index, feelings, engineering, stack, algo
│   ├── index.mdx            # /docs 首页
│   ├── feelings/            # 感触
│   ├── engineering/         # 工程化
│   ├── stack/               # 技术栈
│   └── algo/                # 算法
├── public/
│   ├── img/                 # 文档配图，按 /img/xxx.jpg 引用
│   └── hero.mp4|webm|poster # 首页 Hero 视频（环境变量未配置时的兜底）
├── scripts/check-oss.mjs    # 自检 Hero 远程视频是否可播
├── src/
│   ├── app/
│   │   ├── (home)/          # 首页路由组（透明导航 + 全屏 Hero）
│   │   ├── docs/            # 文档布局与页面
│   │   ├── api/search/      # 全文搜索接口
│   │   ├── og/docs/         # OG 分享图动态生成
│   │   ├── llms.txt/        # LLM 索引
│   │   ├── llms-full.txt/   # 全站 Markdown
│   │   ├── llms.mdx/docs/   # 单页 Markdown
│   │   └── layout.tsx       # 全站 SEO metadata
│   ├── components/home/     # Hero 相关组件（头像、状态栏、装饰线）
│   ├── lib/
│   │   ├── shared.ts        # ★ 全站配置中枢
│   │   ├── source.ts        # 内容源适配（loader）
│   │   └── layout.shared.tsx# 导航栏 / 布局选项
│   ├── proxy.ts             # 内容协商（Next 16 起 middleware.ts 更名）
│   └── app/global.css       # Tailwind 入口 + 站点自定义样式
└── .env.example             # 环境变量样例
```

**改动优先级**：调站名 / 导航 / 路由 → `src/lib/shared.ts`；调导航渲染方式 → `src/lib/layout.shared.tsx`；调内容 → `content/docs/`；调视觉细节 → `src/app/global.css`。

## 快速开始

### 环境要求

- Node.js **≥ 20.9**（Next.js 16 的硬性要求）
- 包管理器推荐 **pnpm**，`npm` / `yarn` 亦可，但请勿混用（会生成冲突的 lockfile）

### 安装与运行

```bash
# pnpm（推荐，与仓库 lockfile 一致）
pnpm install
pnpm dev

# npm
npm install
npm run dev
```

打开 <http://localhost:3000> 查看首页，<http://localhost:3000/docs> 查看文档。

> `npm run dev` 底层是 `next dev`，README 里的 `pnpm dev` 等价于 `pnpm run dev`。

### 常用命令

| 命令 | 作用 |
| --- | --- |
| `pnpm dev` | 启动开发服务器（Turbopack，热更新） |
| `pnpm build` | 生产构建 |
| `pnpm start` | 以生产模式运行构建产物（需先 `build`） |
| `pnpm types:check` | `next typegen` 生成路由类型后跑 `tsc --noEmit` |
| `pnpm lint` | Biome 静态检查 |
| `pnpm format` | Biome 格式化写入 |
| `node scripts/check-oss.mjs` | 自检首页 Hero 远程视频是否可用 |

推荐提交前自检顺序：`pnpm types:check` → `pnpm lint` → `pnpm build`。

### Windows / Linux 差异

| 事项 | Windows | Linux / macOS |
| --- | --- | --- |
| 终端 | 建议用 PowerShell 或项目自带的 Git Bash；**CMD 不支持本仓库脚本** | bash / zsh 直接可用 |
| 路径分隔符 | 命令行里 `\` 与 `/` 通常都能被 Node 接受，但**配置文件一律写正斜杠 `/`** | `/` |
| `NODE_ENV=... pnpm build` 内联环境变量 | CMD 不支持，需 `cross-env` 或 PowerShell `$env:NODE_ENV="production"` | 原生支持 |
| 换行符 | Git Bash 若开启 `autocrlf`，`.mjs` 脚本可能报 `^M: bad interpreter`；建议 `git config core.autocrlf input` | 无此问题 |
| 端口占用 | 3000 被占会顺延到 3001，注意看终端输出 | 同 |

## 环境变量

首次开发不需要配置任何变量即可跑起来 —— 所有变量都有安全兜底。复制样例文件按需覆盖：

```bash
cp .env.example .env.local   # Linux / macOS
copy .env.example .env.local # Windows CMD
```

| 变量 | 作用 | 留空时的行为 |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | canonical 链接与 OG 图域名 | 回退到 `https://resinalgo.vercel.app` |
| `NEXT_PUBLIC_HERO_VIDEO_WEBM` | Hero 视频 WebM(VP9) 源 | 回退到 `public/hero.webm` |
| `NEXT_PUBLIC_HERO_VIDEO_MP4` | Hero 视频 MP4(H.264) 源 | 回退到 `public/hero.mp4` |
| `NEXT_PUBLIC_HERO_VIDEO_POSTER` | 视频封面 | 回退到 `public/hero-poster.jpg` |
| `NEXT_PUBLIC_AVATAR_URL` | 首页圆形头像 | 回退到 OSS 默认地址 |
| `NEXT_PUBLIC_SITE_LAUNCH_AT` | 首页「已运行」计时起点 | 回退到 `2026-10-05T00:00:00+08:00` |

两个必须知道的约束：

1. **`NEXT_PUBLIC_` 前缀的变量是构建时内联的**，改完必须重启 dev 或重新部署才生效。
2. **`.env.local` 已在 `.gitignore` 中**，不要提交；生产环境在 Vercel → *Project Settings* → *Environment Variables* 配置。

`NEXT_PUBLIC_SITE_URL` 建议**带协议头**填写（`https://example.com`，而非 `example.com`）。代码里做了「补协议 → 去尾斜杠 → 非法则回退」三级兜底（见 `src/lib/shared.ts` 的 `resolveSiteUrl`），不会因为填错让整个构建失败，但会在构建日志里打警告。

## 新增一篇笔记

1. **建文件**：在 `content/docs/<分类>/` 下新建 `<文件名>.mdx`，frontmatter 至少要有 `title` 和 `description`：

   ```mdx
   ---
   title: 文章标题
   description: 一句话摘要，会显示在列表与 OG 图上
   ---

   正文……
   ```

2. **排顺序**：把文件名写进该分类的 `meta.json` 的 `pages` 数组。未在数组中的文件**依然可访问，但不会出现在侧边栏**。

   ```json
   { "pages": ["index", "login", "grayscale"] }
   ```

3. **放配图**：图片放 `public/img/`，文中用**站点根路径**引用：

   ```mdx
   ![截图](/img/mac-guide/cover.jpg)
   ```

   切勿写 `C:/Users/...` 这类本地绝对路径 —— 部署后必然 404。

4. **（可选）新增分类**：在 `src/lib/shared.ts` 的 `categories` 数组里追加一项，导航栏和排序会同步生效。

## 站点特性说明

| 能力 | 路由 | 实现位置 |
| --- | --- | --- |
| 全文搜索 | `GET /api/search` | `src/app/api/search/route.ts`，基于 `createFromSource` |
| LLM 索引 | `/llms.txt` | 站点级目录 |
| 全站 Markdown | `/llms-full.txt` | 所有页面的正文拼接 |
| 单页 Markdown | `/llms.mdx/docs/<slug>/content.md` | 每篇笔记的原始内容 |
| Markdown 内容协商 | `/docs/<slug>.md`，或 `Accept: text/markdown` 请求 `/docs/<slug>` | `src/proxy.ts` 做 rewrite |
| OG 分享图 | `/og/docs/<slug>/image.png` | `src/app/og/docs/[...slug]/route.tsx` |

**内容协商**是本站对 AI 友好的关键：爬虫或 Agent 只要带 `Accept: text/markdown` 请求任意文档 URL，就能拿到纯 Markdown 而不是 HTML 页面。注意这是 Next.js 16 的 `proxy.ts`（旧版叫 `middleware.ts`），改名后行为不变。

## 部署

项目针对 **Vercel** 做了适配：

1. 导入仓库，框架预设选 Next.js，构建命令 `pnpm build`（默认即可）。
2. 在环境变量里配置 `NEXT_PUBLIC_SITE_URL`（正式域名）与 Hero 视频地址。
3. Hero 视频等大文件建议放对象存储而非仓库内 —— 仓库体积膨胀会显著拖慢 Vercel 的构建缓存。

配完视频后跑一次自检，确认 HTTPS、匿名可读、Content-Type、Range 请求四项都能过：

```bash
node scripts/check-oss.mjs
```

## 开发约定

- **内容图片**统一放 `public/img/`；后续内容变多时建议按文档分二级目录（如 `public/img/mac-guide/`），避免 22 张图平铺难以维护。
- **样式覆盖**写在 `src/app/global.css`，所有站点自定义类以 `rn-` 前缀命名（如 `.rn-fade-up`、`.rn-hero-shade`），便于与 Fumadocs 内置样式区分。
- **注释口径**：核心逻辑（环境变量兜底、导航 `on` 字段、Hero 淡入动画延迟等）已在代码里写明「为什么这么做」和当时踩过的坑，改动前请先读注释，避免改回曾经的 bug。
- **提交前**执行 `pnpm types:check && pnpm lint`。

## 相关链接

- 线上站点：<https://resinalgo.vercel.app>
- [Next.js 文档](https://nextjs.org/docs) · [Fumadocs 文档](https://fumadocs.dev) · [Tailwind CSS v4](https://tailwindcss.com) · [Biome](https://biomejs.dev)

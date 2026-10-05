import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { appName, categories, docsRoute, gitConfig } from "./shared";

/**
 * 导航栏右侧的三个分类入口。
 *
 * 数据源是 shared.ts 里的 `categories`——导航栏和新分类都从这里出，
 * 以后加第四个分类改一处就够。
 *
 * active 用 nested-url：分类下的子页面（如 /docs/feelings/xxx）
 * 也会让顶层「感触」保持高亮。
 *
 * `on: "nav"` 是必须的，否则侧边栏会出现两份重复入口：
 * fumadocs 的 links 有一个 on 字段（'nav' | 'menu' | 'all'，默认 'all'），
 * 表示这条链接渲染到顶栏（nav）、左侧边栏（menu）还是两边都放。
 * docs 布局的侧边栏实现里明确写着「先渲染 menuItems，再渲染页面树」
 * （@fumadocs/base-ui/dist/layouts/docs/slots/sidebar.js 第 31-37 行），
 * 而页面树本来就有「关于 resin-notes / 感触 / 工程化 / 技术栈」这几项，
 * 于是默认值 'all' 会把三个分类在侧边栏里重复一遍。
 * 文档页的顶栏在桌面端还是 md:hidden 的，重复的那份没有对应的高亮语义，纯属噪音。
 *
 * 改成 'nav' 后：顶栏（首页等有顶栏的页面）保留这三个入口，
 * 文档页的侧边栏只留页面树那一份，职责清晰。
 */
const navLinks: BaseLayoutProps["links"] = categories.map((category) => ({
  text: category.title,
  url: `${docsRoute}/${category.slug}`,
  active: "nested-url" as const,
  on: "nav" as const,
}));

export function baseOptions(
  options: { navTransparent?: boolean } = {},
): BaseLayoutProps {
  return {
    nav: {
      // JSX supported
      title: appName,
      // 只在需要「内容顶到页面最上方」的页面开启（比如首页的全屏视频）
      ...(options.navTransparent ? { transparentMode: "top" as const } : {}),
    },
    links: navLinks,
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}

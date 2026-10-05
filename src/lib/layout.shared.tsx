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
 */
const navLinks: BaseLayoutProps["links"] = categories.map((category) => ({
  text: category.title,
  url: `${docsRoute}/${category.slug}`,
  active: "nested-url" as const,
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

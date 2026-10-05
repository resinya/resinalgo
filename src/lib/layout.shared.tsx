import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { appName, categories, docsRoute, gitConfig } from "./shared";

/**
 * 顶部导航里的三个分类入口。
 *
 * 数据源是 shared.ts 里的 `categories`——导航栏要加分类从这里出，
 * 以后加第四个分类改一处就够。
 *
 * active 用 nested-url：分类下的子页面（如 /docs/feelings/xxx）
 * 也会让顶层「感触」保持高亮。
 *
 * ⚠️ 这里刻意不写 `on` 字段，让它保持默认值 'all'。
 * fumadocs 的 links 有 on 字段（'nav' | 'menu' | 'all'，默认 'all'）：
 *   - 'nav'  → 只进顶栏的桌面横向列表（navItems）
 *   - 'menu' → 只进窄屏那个「收起来」的下拉面板（menuItems）
 *   - 'all'  → 两边都放
 * 首页布局的 Header（layouts/home/slots/header.js）里，桌面横向列表是
 * `max-sm:hidden`——**窗口窄于 640px 时整个列表被隐藏**，此时唯一入口就是
 * 右上角那个箭头展开的下拉面板，而那个面板渲染的是 menuItems。
 * 所以只写 'nav' 的话，窄屏下点开箭头是个空面板（10-05 遇到的现象）。
 *
 * 至于「分类在文档页侧边栏重复一份」的问题，不靠 on 字段解决——那会让窄屏
 * 下拉变空。改成在 docs 布局里不传这批 links（见 baseOptions 的 includeNavLinks），
 * 因为文档页侧边栏的页面树本来就带着这几个分类，职责更清晰。
 */
const navLinks: BaseLayoutProps["links"] = categories.map((category) => ({
  text: category.title,
  url: `${docsRoute}/${category.slug}`,
  active: "nested-url" as const,
}));

export function baseOptions(
  options: { navTransparent?: boolean; includeNavLinks?: boolean } = {},
): BaseLayoutProps {
  return {
    nav: {
      // JSX supported
      title: appName,
      // 只在需要「内容顶到页面最上方」的页面开启（比如首页的全屏视频）
      ...(options.navTransparent ? { transparentMode: "top" as const } : {}),
    },
    // 文档页传 false：侧边栏的页面树已经列出这几个分类了，再渲染一遍就是重复。
    // 注意 GitHub 图标不受影响——它是 fumadocs 由 githubUrl 自动追加的。
    links: options.includeNavLinks === false ? [] : navLinks,
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}

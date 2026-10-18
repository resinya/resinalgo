import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { NavigationDropdown } from "@/components/home/navigation-dropdown";
import { getNavigationSections, navigationDropdown } from "./navigation";
import { appName, gitConfig } from "./shared";
import { source } from "./source";

/**
 * 桌面使用独立定位的标题列表，移动端沿用 Fumadocs 的分组菜单。
 * 两处都读取同一份栏目和文章配置。
 */
function navigationLinks(): BaseLayoutProps["links"] {
  return getNavigationSections(source.getPageTree()).flatMap(
    (section): NonNullable<BaseLayoutProps["links"]> => [
      {
        type: "custom",
        on: "nav",
        children: (
          <NavigationDropdown section={section} {...navigationDropdown} />
        ),
      },
      {
        type: "menu",
        on: "menu",
        text: section.title,
        items: section.items.map((item) => ({
          text: item.title,
          url: item.url,
          external: item.external,
        })),
      },
    ],
  );
}

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
    links: options.includeNavLinks === false ? [] : navigationLinks(),
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}

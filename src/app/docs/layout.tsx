import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";

export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    // includeNavLinks: false —— 不把「感触/工程化/技术栈」这批顶栏链接传进文档布局。
    // 文档页侧边栏本来就用页面树渲染这些分类（fumadocs 会把 menuItems 先画一遍、
    // 再画页面树），传进来会重复；而它的顶栏在桌面端是 md:hidden 的，用不上。
    <DocsLayout
      tree={source.getPageTree()}
      {...baseOptions({ includeNavLinks: false })}
    >
      {children}
    </DocsLayout>
  );
}

import { flattenTree, type Root } from "fumadocs-core/page-tree";
import type { ReactNode } from "react";
import { docsRoute } from "./shared";

/** 栏目的名称、顺序和简介统一在这里维护；文章从文档页面树读取。 */
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
  {
    slug: "algo",
    title: "算法",
    description: "记录算法题的拆解过程、解题思路与复杂度分析。",
  },
  {
    slug: "agent",
    title: "Agent",
    description: "从前端到 Agent，记录智能体架构、工具调用与多智能体协作。",
  },
] as const;

type CategorySlug = (typeof categories)[number]["slug"];

/** 桌面卡片面板固定高度；移动端限制展开内容的最大高度。 */
export const navigationDropdown = {
  height: 224,
  mobileMaxHeight: 480,
};

export interface NavigationSection {
  slug: string;
  title: string;
  items: {
    title: ReactNode;
    description?: ReactNode;
    url: string;
    external?: boolean;
  }[];
}

export function getCategoryUrl(slug: CategorySlug) {
  return `${docsRoute}/${slug}`;
}

/** 复用侧边栏的页面树，保留 meta.json 排序，并支持目录继续嵌套。 */
export function getNavigationSections(tree: Root): NavigationSection[] {
  return categories.map((category) => {
    const url = getCategoryUrl(category.slug);
    const folder = tree.children.find(
      (node) =>
        node.type === "folder" &&
        (node.index?.url === url || node.$ref?.folder === category.slug),
    );
    const pages = folder?.type === "folder" ? flattenTree(folder.children) : [];
    const index =
      folder?.type === "folder"
        ? (folder.index ?? pages.find((page) => page.url === url))
        : undefined;

    return {
      slug: category.slug,
      title: category.title,
      items: [
        {
          title: index?.name ?? `${category.title}概览`,
          description: category.description,
          url,
        },
        ...pages
          .filter((page) => page.url !== url)
          .map((page) => ({
            title: page.name,
            description: page.description,
            url: page.url,
            external: page.external,
          })),
      ],
    };
  });
}

"use client";

import {
  NavbarMenu,
  NavbarMenuContent,
  NavbarMenuLink,
  NavbarMenuTrigger,
} from "fumadocs-ui/layouts/home/navbar";
import { ChevronDown } from "lucide-react";
import type { NavigationSection } from "@/lib/navigation";

export function NavigationDropdown({
  section,
  height,
}: {
  section: NavigationSection;
  height: number;
}) {
  return (
    <NavbarMenu>
      <NavbarMenuTrigger className="rn-nav-trigger group gap-1.5">
        {section.title}
        <ChevronDown
          aria-hidden
          className="size-3.5 opacity-70 transition-transform group-aria-expanded:rotate-180"
        />
      </NavbarMenuTrigger>
      <NavbarMenuContent
        aria-label={`${section.title}笔记`}
        className="rn-nav-dropdown"
        style={{ height }}
      >
        {section.items.map((item) => (
          <NavbarMenuLink
            key={item.url}
            href={item.url}
            external={item.external}
            prefetch={false}
            className="rn-nav-card focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-fd-ring"
          >
            <p className="text-base font-medium">{item.title}</p>
            {item.description && (
              <p className="text-sm text-fd-muted-foreground">
                {item.description}
              </p>
            )}
          </NavbarMenuLink>
        ))}
      </NavbarMenuContent>
    </NavbarMenu>
  );
}

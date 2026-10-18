"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "fumadocs-ui/components/ui/popover";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { NavigationSection } from "@/lib/navigation";

export function NavigationDropdown({
  section,
  width,
  height,
}: {
  section: NavigationSection;
  width: number;
  height: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <li className="list-none">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          openOnHover
          delay={120}
          closeDelay={150}
          className="rn-nav-trigger inline-flex items-center gap-1.5 rounded-md p-2 text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent/60 hover:text-fd-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fd-ring"
        >
          {section.title}
          <ChevronDown
            aria-hidden
            className={`size-3.5 opacity-70 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={10}
          aria-label={`${section.title}笔记`}
          className="rn-nav-dropdown"
          style={{ width, height, minWidth: 0 }}
        >
          <nav aria-label={`${section.title}文章列表`}>
            <ul className="flex flex-col gap-1">
              {section.items.map((item) => (
                <li key={item.url}>
                  <Link
                    href={item.url}
                    prefetch={false}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noreferrer noopener" : undefined}
                    onClick={() => setOpen(false)}
                    className="rn-nav-link block rounded-md px-3 py-2.5 leading-5 transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground focus-visible:bg-fd-accent focus-visible:text-fd-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-fd-ring"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </PopoverContent>
      </Popover>
    </li>
  );
}

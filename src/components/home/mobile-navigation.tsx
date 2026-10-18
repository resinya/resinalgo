"use client";

import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from "fumadocs-ui/components/ui/accordion";
import Link from "next/link";
import type { NavigationSection } from "@/lib/navigation";

export function MobileNavigation({
  sections,
  maxHeight,
}: {
  sections: NavigationSection[];
  maxHeight: number;
}) {
  return (
    <nav
      aria-label="笔记栏目"
      className="rn-mobile-navigation"
      style={{ maxHeight: `min(${maxHeight}px, calc(100dvh - 9rem))` }}
    >
      <Accordion multiple={false}>
        {sections.map((section) => (
          <AccordionItem key={section.slug} value={section.slug}>
            <AccordionHeader>
              <AccordionTrigger className="min-h-11 [&>svg]:order-last [&>svg]:ms-auto">
                {section.title}
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent>
              <ul className="flex flex-col gap-1 px-2 pb-2">
                {section.items.map((item) => (
                  <li key={item.url}>
                    <Link
                      href={item.url}
                      prefetch={false}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noreferrer noopener" : undefined}
                      className="rn-nav-link block rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground focus-visible:bg-fd-accent focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-fd-ring"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </nav>
  );
}

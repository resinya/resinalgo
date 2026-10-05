"use client";

import { useEffect, useRef } from "react";

/** 导航栏高度，和 fumadocs 的 `h-14` 保持一致 */
const NAV_HEIGHT = 56;

/**
 * 放在首页 Hero 底部的哨兵元素（零高度、不可见）。
 *
 * 只要导航栏还压在 Hero 视频上，就给 <html> 加上 `rn-nav-over-hero`，
 * 让导航切换成「浮在视频上」的样式（透明底 + 白字 + 顶部渐变压暗）；
 * 滚过 Hero 之后类名自动移除，导航恢复常规样式。
 *
 * 这里用「哨兵距视口顶部的距离」判断，而不是 IntersectionObserver：
 * 后者在 Hero 正好一屏高时，哨兵会精确落在观察区边界上被判成「不相交」。
 */
export function HeroBoundary() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const root = document.documentElement;
    let frame = 0;

    const update = () => {
      frame = 0;
      root.classList.toggle(
        "rn-nav-over-hero",
        element.getBoundingClientRect().top > NAV_HEIGHT,
      );
    };

    // 用 rAF 合帧，滚动时每帧最多算一次
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
      root.classList.remove("rn-nav-over-hero");
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
    />
  );
}

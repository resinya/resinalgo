"use client";

import { useEffect, useState } from "react";

type Elapsed = { days: number; hh: string; mm: string; ss: string };

function elapsedSince(startMs: number): Elapsed {
  const total = Math.max(0, Math.floor((Date.now() - startMs) / 1000));
  const pad = (n: number) => String(n).padStart(2, "0");

  return {
    days: Math.floor(total / 86400),
    hh: pad(Math.floor((total % 86400) / 3600)),
    mm: pad(Math.floor((total % 3600) / 60)),
    ss: pad(total % 60),
  };
}

/**
 * Hero 底部的状态条：站点已运行时长。
 *
 * 时间在客户端读，首屏渲染成占位符，避免 hydration 不一致。
 *
 * 原本这里还有一个「深色模式 / 浅色模式」按钮（转发点击给导航栏的主题切换器），
 * 已经去掉——导航栏那个图标现在能明确区分选中态，没必要再重复一次，
 * 而且首页是整屏视频 + 白字，深浅色画面本就接近，写个模式名也帮不上判断。
 */
export function HeroStatusBar({ launchAt }: { launchAt: string }) {
  const [elapsed, setElapsed] = useState<Elapsed | null>(null);

  useEffect(() => {
    const start = new Date(launchAt).getTime();
    if (Number.isNaN(start)) return;

    const tick = () => setElapsed(elapsedSince(start));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [launchAt]);

  return (
    <div
      className="rn-fade-up absolute inset-x-0 bottom-6 z-10 flex items-center justify-center px-4 text-xs text-white/85 [text-shadow:0_1px_10px_rgba(0,0,0,0.55)]"
      style={{ animationDelay: "560ms" }}
    >
      <span className="tabular-nums tracking-wide">
        {elapsed
          ? `已运行 ${elapsed.days} 天 ${elapsed.hh}:${elapsed.mm}:${elapsed.ss}`
          : "已运行 — 天 --:--:--"}
      </span>
    </div>
  );
}

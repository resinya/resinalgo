"use client";

import { useState } from "react";
import { appName } from "@/lib/shared";

/**
 * Hero 中间的圆形头像。
 *
 * 为什么是客户端组件：需要 onError。图片放在对象存储上时，
 * 只要桶没开公共读就会返回 403，直接渲染出来是个破图图标。
 * 这里失败后自动退化成「首字母占位圆」，视觉上始终是完整的。
 *
 * 尺寸用内联 style 控制（而不是 Tailwind 的 w-28 h-28），
 * 这样同一个组件可以直接传 size 复用，不用维护尺寸到类名的映射表。
 */
export function Avatar({
  src,
  alt,
  size = 112,
}: {
  src: string;
  alt: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);

  const box = { width: size, height: size };

  if (failed) {
    return (
      <div
        className="rn-fade-up flex items-center justify-center rounded-full border border-white/45 bg-white/15 text-white backdrop-blur-sm [text-shadow:0_1px_10px_rgba(0,0,0,0.5)]"
        style={{ ...box, animationDelay: "120ms" }}
      >
        <span style={{ fontSize: size * 0.36 }} className="font-medium">
          {appName.slice(0, 1).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    // biome-ignore lint/performance/noImgElement: 头像是小尺寸远程图，直接用 <img> 从对象存储取，不必经 next/image 转发优化
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      onError={() => setFailed(true)}
      className="rn-fade-up rounded-full border border-white/45 object-cover shadow-[0_6px_28px_rgba(0,0,0,0.4)]"
      style={{ ...box, animationDelay: "120ms" }}
    />
  );
}

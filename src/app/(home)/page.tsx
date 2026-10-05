import type { Metadata } from "next";
import Link from "next/link";
import { Avatar } from "@/components/home/avatar";
import { HeroBoundary } from "@/components/home/hero-boundary";
import { HeroStatusBar } from "@/components/home/hero-status-bar";
import {
  author,
  avatarUrl,
  docsRoute,
  heroVideo,
  siteDescription,
  siteLaunchAt,
  siteTitle,
} from "@/lib/shared";

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
};

const REMOTE = /^https?:\/\//;

const localSources = [
  { src: heroVideo.webm, type: "video/webm" },
  { src: heroVideo.mp4, type: "video/mp4" },
];

/**
 * 一旦配了对象存储地址，就只用远程源——
 * 否则残留的本地路径会 404，白白多一次失败请求拖慢首屏。
 * 一个都没配时，回落到 public/ 下的本地文件。
 */
const videoSources = localSources.some((s) => REMOTE.test(s.src))
  ? localSources.filter((s) => REMOTE.test(s.src))
  : localSources;

export default function HomePage() {
  return (
    <main>
      {/*
       * 全屏 Hero：-mt-14 把自己顶到页面最上方（导航栏是 sticky，在文档流里占了 3.5rem，
       * 负 margin 正好抵消）。高度就是 100svh——刚好一屏，不会多出一点。
       * 用 svh 而不是 vh：手机浏览器地址栏收起时画面不会跳动。
       */}
      <section className="relative -mt-14 h-[100svh] min-h-[520px] w-full overflow-hidden bg-neutral-900">
        <video
          className="rn-fade absolute inset-0 h-full w-full object-cover"
          poster={heroVideo.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          tabIndex={-1}
        >
          {/* 浏览器按顺序挑能播的第一个：WebM(VP9) 体积更小，MP4 兼容性最好 */}
          {videoSources.map((s) => (
            <source key={s.type} src={s.src} type={s.type} />
          ))}
        </video>
        {/*
         * 主题响应层：整屏视频 + 白字在深浅色模式下长得一模一样，
         * 点主题切换会「看起来没反应」。这层只在深色模式下淡入，压暗视频——
         * 既给切换一个明确的视觉反馈，也让深色模式下的画面与站点其他页更协调。
         * 浅色模式完全不压暗，保持你要的通透。想更暗/更亮改下面的 .rn-hero-shade 即可。
         */}
        <div className="rn-hero-shade pointer-events-none absolute inset-0 bg-black" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-5 px-6 pt-6 text-center">
          <Avatar src={avatarUrl} alt={author.name} />
          {/* <h1
            className="rn-fade-up text-4xl font-semibold tracking-tight text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.4)] md:text-5xl"
            style={{ animationDelay: "200ms" }}
          >
            {appName}
          </h1> */}
          <p
            className="rn-fade-up max-w-xl text-sm leading-7 text-white/90 [text-shadow:0_1px_12px_rgba(0,0,0,0.45)] md:text-base"
            style={{ animationDelay: "300ms" }}
          >
            一个记录站主在学习中总结的实践笔记
          </p>
          <div
            className="rn-fade-up flex flex-wrap justify-center gap-3"
            style={{ animationDelay: "400ms" }}
          >
            <Link
              href={docsRoute}
              className="rounded-full bg-white px-5 py-2 text-sm font-medium text-neutral-900 transition-opacity hover:opacity-85"
            >
              进入笔记
            </Link>
            <Link
              href={`${docsRoute}/feelings`}
              className="rounded-full border border-white/70 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/15"
            >
              先读感触
            </Link>
          </div>
          <p
            className="rn-fade-up text-xs text-white/80 [text-shadow:0_1px_10px_rgba(0,0,0,0.45)]"
            style={{ animationDelay: "480ms" }}
          >
            {author.name} · 持续更新
          </p>
        </div>
        <HeroStatusBar launchAt={siteLaunchAt} />
        <HeroBoundary />
      </section>
    </main>
  );
}

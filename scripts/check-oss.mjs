/**
 * 自检首页 Hero 视频的远程地址是否可用。
 *
 * 用法：  node scripts/check-oss.mjs
 *
 * 它会读取 .env.local（优先）和 .env 里的三个 Hero 地址，
 * 逐个发起真实请求，检查「能否被浏览器直接播放」的四项必要条件：
 *   1. HTTPS            —— 否则会被浏览器按混合内容拦截
 *   2. 匿名可访问(200)  —— 否则是桶/对象权限没开，页面上一片黑
 *   3. Content-Type     —— .webm 最容易被标成 octet-stream 而拒播
 *   4. Range 请求(206)  —— 缺了它 Safari 可能整段不播、进度条也拖不动
 * 另外顺带报告体积与缓存头。
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** 简易 .env 解析：只认 KEY=VALUE，忽略 # 注释行 */
function parseEnv(file) {
  const path = join(root, file);
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf("=");
    if (i < 0) continue;
    out[trimmed.slice(0, i).trim()] = trimmed.slice(i + 1).trim();
  }
  return out;
}

// .env.local 优先级高于 .env（与 Next.js 一致）
const env = { ...parseEnv(".env"), ...parseEnv(".env.local") };

const targets = [
  {
    key: "NEXT_PUBLIC_HERO_VIDEO_WEBM",
    label: "视频 WebM(VP9)",
    want: ["video/webm"],
  },
  {
    key: "NEXT_PUBLIC_HERO_VIDEO_MP4",
    label: "视频 MP4(H.264)",
    want: ["video/mp4"],
  },
  {
    key: "NEXT_PUBLIC_HERO_VIDEO_POSTER",
    label: "封面图 JPG",
    want: ["image/jpeg"],
  },
];

const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const YELLOW = "\x1b[33m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

const ok = (s) => `${GREEN}✓${RESET} ${s}`;
const bad = (s) => `${RED}✗${RESET} ${s}`;
const warn = (s) => `${YELLOW}!${RESET} ${s}`;

let allPass = true;

for (const t of targets) {
  const url = env[t.key];
  console.log(`\n${"─".repeat(64)}`);
  console.log(`${t.label}   ${DIM}${t.key}${RESET}`);

  if (!url) {
    console.log(`  ${warn("未配置，将回退到 public/ 下的本地文件")}`);
    continue;
  }
  console.log(`  ${DIM}${url}${RESET}`);

  // 1. HTTPS
  let isHttps;
  try {
    isHttps = new URL(url).protocol === "https:";
  } catch {
    console.log(`  ${bad("URL 格式非法")}`);
    allPass = false;
    continue;
  }
  console.log(
    `  ${isHttps ? ok("HTTPS") : bad("不是 HTTPS —— 会被浏览器按混合内容拦截")}`,
  );
  if (!isHttps) allPass = false;

  try {
    // 2 + 3. 匿名可读 + Content-Type
    const res = await fetch(url);
    const type = (res.headers.get("content-type") || "").split(";")[0].trim();
    const size = Number(res.headers.get("content-length") || 0);
    const cache = res.headers.get("cache-control") || "(未设置)";

    if (res.status === 200) {
      console.log(`  ${ok(`匿名可访问 (200)`)}`);
    } else if (res.status === 403) {
      const body = await res.text();
      const code = body.match(/<Code>([^<]+)<\/Code>/)?.[1] || "";
      console.log(`  ${bad("403 拒绝访问 —— 桶或对象没有公共读权限")}`);
      if (code) console.log(`     ${DIM}OSS 错误码：${code}${RESET}`);
      allPass = false;
      continue;
    } else if (res.status === 404) {
      console.log(`  ${bad("404 文件不存在 —— 检查路径/文件名")}`);
      allPass = false;
      continue;
    } else {
      console.log(`  ${bad(`状态码 ${res.status}`)}`);
      allPass = false;
      continue;
    }

    const typeOk = t.want.includes(type);
    console.log(
      `  ${typeOk ? ok(`Content-Type: ${type}`) : bad(`Content-Type: ${type || "(空)"} —— 应为 ${t.want.join(" / ")}，浏览器可能拒播`)}`,
    );
    if (!typeOk) allPass = false;

    console.log(
      `  ${DIM}体积 ${(size / 1024 / 1024).toFixed(2)} MB · 缓存 ${cache}${RESET}`,
    );
    if (cache === "(未设置)") {
      console.log(
        `  ${warn("建议设置 Cache-Control: public, max-age=31536000, immutable")}`,
      );
    }

    // 4. Range 请求（封面图不强求）
    const ranged = await fetch(url, { headers: { Range: "bytes=0-1023" } });
    const supportsRange = ranged.status === 206;
    if (t.label.startsWith("视频")) {
      console.log(
        `  ${supportsRange ? ok("支持 Range 请求 (206)") : bad("不支持 Range —— Safari 可能不播、进度条失效")}`,
      );
      if (!supportsRange) allPass = false;
    }
  } catch (e) {
    console.log(`  ${bad(`请求失败：${e.message}`)}`);
    allPass = false;
  }
}

console.log(`\n${"─".repeat(64)}`);
if (allPass) {
  console.log(`${GREEN}全部通过${RESET} —— 视频可以正常播放。`);
  console.log(
    `${DIM}注意：NEXT_PUBLIC_ 变量是构建时内联的，改完需重启 dev / 重新部署。${RESET}`,
  );
} else {
  console.log(`${RED}存在未通过项${RESET}，按上面的提示处理后重跑本脚本。`);
  console.log(
    `${DIM}最常见原因：OSS 桶的读写权限仍是「私有」，需改为「公共读」。${RESET}`,
  );
}

import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import "./global.css";
import { Inter } from "next/font/google";
import {
  appName,
  author,
  keywords,
  siteDescription,
  siteTitle,
  siteUrl,
} from "@/lib/shared";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s | ${appName}`,
  },
  description: siteDescription,
  keywords,
  applicationName: appName,
  authors: [author],
  creator: author.name,
  publisher: author.name,
  category: "technology",
  icons: {
    icon: "https://resin-notes.oss-cn-hangzhou.aliyuncs.com/public/resin.jpg",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: appName,
    title: siteTitle,
    description: siteDescription,
    locale: "zh_CN",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    creator: "@resinya",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const inter = Inter({
  subsets: ["latin"],
});

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}

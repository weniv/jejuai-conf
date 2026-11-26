import "../styles/globals.scss";
import localFont from "next/font/local";
import type { Metadata, Viewport } from "next";
import { ReactNode } from "react";

const TITLE = "2026 제주 AI 컨퍼런스";
const DESCRIPTION =
  "AI에 관심 있는 누구에게나 열려 있는 2026 제주 AI 컨퍼런스";
const LINK = "https://jejuai.kr";
const OGIMG = {
  url: "/images/og-2026.jpg",
  width: 1200,
  height: 630,
  alt: "2026 제주 AI 컨퍼런스, 12월 8일부터 9일까지 제주창조경제혁신센터 3층 J-SPACE",
};

const pretendard = localFont({
  src: [
    {
      path: "./font/Pretendard-Regular.woff",
      weight: "400",
      style: "normal",
    },

    {
      path: "./font/Pretendard-SemiBold.woff",
      weight: "600",
      style: "normal",
    },
    {
      path: "./font/Pretendard-Bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL(LINK),
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico?v=2026-kv", sizes: "16x16 32x32 48x48" },
      { url: "/icon.svg?v=2026-kv", type: "image/svg+xml", sizes: "any" },
    ],
    shortcut: "/favicon.ico?v=2026-kv",
    apple: { url: "/apple-touch-icon.png?v=2026-kv", sizes: "180x180", type: "image/png" },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: LINK,
    type: "website",
    siteName: TITLE,
    images: [OGIMG],
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OGIMG],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#120f2a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="ko-KR"
      className={pretendard.className}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}

import "../styles/globals.scss";
import localFont from "next/font/local";
import type { Metadata, Viewport } from "next";
import { ReactNode } from "react";
import { BUILD_SCRIPT } from "../components/stage/constants";

const TITLE = "2026 제주 AI 컨퍼런스";
const DESCRIPTION =
  "AI에 관심 있는 누구에게나 열려 있는 2026 제주 AI 컨퍼런스. 12월 8일(화)–9일(수), 제주창조경제혁신센터. 프로그램과 참가 신청을 준비하고 있습니다.";
const LINK = "https://jejuai.kr";
const OGIMG = {
  url: "/images/og-2026-wordmark.png",
  width: 1200,
  height: 630,
  alt: "2026 제주 AI 컨퍼런스, 12월 8일부터 9일까지 제주창조경제혁신센터",
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
      { url: "/favicon.ico?v=2026-wordmark", sizes: "16x16 32x32 48x48" },
      { url: "/icon.svg?v=2026-wordmark", type: "image/svg+xml", sizes: "any" },
    ],
    shortcut: "/favicon.ico?v=2026-wordmark",
    apple: { url: "/apple-touch-icon.png?v=2026-wordmark", sizes: "180x180", type: "image/png" },
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
  themeColor: "#10110f",
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
      <head>
        <script dangerouslySetInnerHTML={{ __html: BUILD_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

import "../styles/globals.scss";
import localFont from "next/font/local";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { BUILD_SCRIPT } from "../components/stage/constants";

const TITLE = "2026 제주 AI 컨퍼런스";
const DESCRIPTION =
  "<2026 제주 AI Conference> 준비중 · 2026년 12월 8일(화) 13:00(예정) ~ 12월 9일(수) 18:00 · 제주창조경제혁신센터";
const LINK = "https://jejuai.kr";
const OGIMG = {
  url: "/images/og-2026.png",
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
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

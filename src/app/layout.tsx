import "../styles/globals.scss";
import localFont from "next/font/local";
import type { Metadata } from "next";
import { ReactNode } from "react";
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";
import Script from "next/script";
import { BUILD_SCRIPT } from "../components/build/swarmData";

const TITLE = "제주 AI 컨퍼런스";
const DESCRIPTION =
  "<2026 제주 AI Conference> 준비중 · 2026년 12월 8일(화) ~ 12월 9일(수) 18:00";
const LINK = "https://www.jejuai.kr";
const OGIMG = "/images/OG.png";

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
    card: "summary",
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
const KAKAO_SDK_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_JS_KEY}&autoload=false`;

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
      <body>
        <Header />
        {children}
        <Footer />
        <Script src={KAKAO_SDK_URL} strategy="beforeInteractive" />
      </body>
    </html>
  );
}

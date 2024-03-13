import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.scss";
import { ReactNode } from "react";
import Header from "../components/sections/Header";
import Footer from "../components/sections/Footer";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

const TITLE = "제주 AI 컨퍼런스";
const DESCRIPTION =
  "AI, 모두를 위한 미래, 지식을 넘어 혁신으로 <2024 제주 AI Conference>";
const LINK = "https://www.jejuai.kr";
const OGIMG = "/images/OG.png";

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
    <html lang="ko-KR">
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
        <Script src={KAKAO_SDK_URL} strategy="beforeInteractive" />
      </body>
    </html>
  );
}

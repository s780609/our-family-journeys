import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PWAInit } from "@/components/PWAInit";

export const metadata: Metadata = {
  title: "Our Family Journeys · 家族旅行手帳",
  description: "家庭旅遊手帳 · 一次一次的家族旅行紀錄",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "家族旅行",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f1e3",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;500;700;900&family=Caveat:wght@400;500;600;700&family=Shippori+Mincho:wght@400;500;700&family=Kalam:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <PWAInit />
      </body>
    </html>
  );
}

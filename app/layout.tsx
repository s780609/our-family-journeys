import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PWAInit } from "@/components/PWAInit";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  ),
  title: "家庭旅行手帳 · Our Family Journeys",
  description: "把每一趟旅行、景點、記憶都收藏起來。",
  manifest: "/manifest.json",
  openGraph: {
    title: "家庭旅行手帳 · Our Family Journeys",
    description: "把每一趟旅行、景點、記憶都收藏起來。",
    type: "website",
    siteName: "Our Family Journeys",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "家庭旅行手帳 · Our Family Journeys",
    description: "把每一趟旅行、景點、記憶都收藏起來。",
    images: ["/og-image.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "家族旅行",
  },
  icons: {
    icon: "/favicon-32.png",
    apple: "/icon-512.png",
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

import type { Metadata } from "next";
import Script from "next/script";
import { prisma } from "@/lib/db";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://chatserver.tr";

function toAbsolute(url: string): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const s = await prisma.siteSettings.findUnique({ where: { id: 1 } });
    if (!s) return { title: "ChatServer.tr" };

    const faviconAbs = toAbsolute(s.faviconUrl);
    const ogImageAbs = toAbsolute(s.ogImageUrl);
    const twImageAbs = toAbsolute(s.twitterImageUrl);

    return {
      metadataBase: new URL(BASE_URL),
      title: s.metaTitle || "ChatServer.tr | Professional Chat Hosting",
      description: s.metaDescription || "Deploy fully managed chat servers with bots, customization, and 24/7 uptime.",
      keywords: s.metaKeywords ? s.metaKeywords.split(",").map((k) => k.trim()) : [],
      icons: faviconAbs
        ? [
            { rel: "icon", url: faviconAbs, sizes: "32x32" },
            { rel: "icon", url: faviconAbs, sizes: "16x16" },
            { rel: "apple-touch-icon", url: faviconAbs, sizes: "180x180" },
          ]
        : [],
      openGraph: {
        title: s.ogTitle || s.metaTitle || "ChatServer.tr",
        description: s.ogDescription || s.metaDescription || "",
        siteName: s.siteName || "ChatServer.tr",
        type: "website",
        url: BASE_URL,
        ...(ogImageAbs ? { images: [{ url: ogImageAbs, width: 1200, height: 630, alt: s.ogTitle || s.siteName || "ChatServer.tr" }] } : {}),
      },
      twitter: {
        card: "summary_large_image",
        title: s.twitterTitle || s.metaTitle || "ChatServer.tr",
        description: s.twitterDescription || s.metaDescription || "",
        ...(twImageAbs ? { images: [twImageAbs] } : {}),
      },
    };
  } catch {
    return {
      title: "ChatServer.tr | Professional Chat Hosting",
      description: "Deploy fully managed chat servers with bots, customization, and 24/7 uptime.",
    };
  }
}

async function getGtagId(): Promise<string> {
  try {
    const s = await prisma.siteSettings.findUnique({ where: { id: 1 }, select: { gtagId: true } });
    return s?.gtagId || "";
  } catch {
    return "";
  }
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const gtagId = await getGtagId();

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-[#1e293b]">
        {gtagId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gtagId}');
              `}
            </Script>
          </>
        )}
        {children}
      </body>
    </html>
  );
}

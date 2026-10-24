import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PreviewBanner } from "@/components/PreviewBanner";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { getSession } from "@/lib/data";
import { siteUrl } from "@/lib/env";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const t = getDictionary(isLocale(lang) ? lang : "en");
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: t.meta.title, template: "%s — Wadajir Give" },
    description: t.meta.description,
    alternates: { languages: { en: "/en", so: "/so" } },
    openGraph: { siteName: "Wadajir Give", type: "website" },
  };
}

export const viewport: Viewport = { themeColor: "#f7f7ed" };

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const session = await getSession();
  return (
    <html lang={lang}>
      <body className="flex min-h-screen flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-paper focus:p-3">
          Skip to content
        </a>
        <PreviewBanner t={t} />
        <SiteHeader locale={lang} t={t} session={session} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter locale={lang} t={t} />
      </body>
    </html>
  );
}

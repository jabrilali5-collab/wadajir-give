import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ContentView } from "@/components/ContentView";
import { plain } from "@/components/ui/Emphasis";
import { getContent } from "@/lib/content";
import { getDictionary, isLocale } from "@/lib/i18n";
import { photos } from "@/lib/photos";

export async function generateMetadata({ params }: PageProps<"/[lang]/trust-safety">): Promise<Metadata> {
  const { lang } = await params;
  return { title: plain(getContent(isLocale(lang) ? lang : "en", "trust").title) };
}

export default async function Page({ params }: PageProps<"/[lang]/trust-safety">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return <ContentView page={getContent(lang, "trust")} kicker={t.nav.trust} image={photos.village.src} imageAlt={photos.village.alt} />;
}

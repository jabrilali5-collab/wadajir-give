import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ContentView } from "@/components/ContentView";
import { plain } from "@/components/ui/Emphasis";
import { getContent } from "@/lib/content";
import { getDictionary, isLocale } from "@/lib/i18n";
import { photos } from "@/lib/photos";

export async function generateMetadata({ params }: PageProps<"/[lang]/how-it-works">): Promise<Metadata> {
  const { lang } = await params;
  return { title: plain(getContent(isLocale(lang) ? lang : "en", "how").title) };
}

export default async function Page({ params }: PageProps<"/[lang]/how-it-works">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return <ContentView page={getContent(lang, "how")} kicker={t.nav.howItWorks} image={photos.hills.src} imageAlt={photos.hills.alt} />;
}

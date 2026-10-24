import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ContentView } from "@/components/ContentView";
import { plain } from "@/components/ui/Emphasis";
import { getContent } from "@/lib/content";
import { getDictionary, isLocale } from "@/lib/i18n";


export async function generateMetadata({ params }: PageProps<"/[lang]/terms">): Promise<Metadata> {
  const { lang } = await params;
  return { title: plain(getContent(isLocale(lang) ? lang : "en", "terms").title) };
}

export default async function Page({ params }: PageProps<"/[lang]/terms">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return <ContentView page={getContent(lang, "terms")} kicker={t.footer.legal} />;
}

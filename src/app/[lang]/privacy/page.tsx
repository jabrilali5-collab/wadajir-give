import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ContentView } from "@/components/ContentView";
import { plain } from "@/components/ui/Emphasis";
import { getContent } from "@/lib/content";
import { getDictionary, isLocale } from "@/lib/i18n";


export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params;
  return { title: plain(getContent(isLocale(lang) ? lang : "en", "privacy").title) };
}

export default async function Page({ params }: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return <ContentView page={getContent(lang, "privacy")} kicker={t.footer.legal} />;
}

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ContentView } from "@/components/ContentView";
import { getContent } from "@/lib/content";
import { isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/how-it-works">): Promise<Metadata> {
  const { lang } = await params;
  return { title: getContent(isLocale(lang) ? lang : "en", "how").title };
}

export default async function Page({ params }: PageProps<"/[lang]/how-it-works">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <ContentView page={getContent(lang, "how")} />;
}

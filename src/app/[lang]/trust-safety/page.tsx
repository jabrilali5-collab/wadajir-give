import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ContentView } from "@/components/ContentView";
import { getContent } from "@/lib/content";
import { isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/trust-safety">): Promise<Metadata> {
  const { lang } = await params;
  return { title: getContent(isLocale(lang) ? lang : "en", "trust").title };
}

export default async function Page({ params }: PageProps<"/[lang]/trust-safety">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <ContentView page={getContent(lang, "trust")} />;
}

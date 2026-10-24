import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ContentView } from "@/components/ContentView";
import { plain } from "@/components/ui/Emphasis";
import { getContent } from "@/lib/content";
import { getDictionary, isLocale } from "@/lib/i18n";
import { photos } from "@/lib/photos";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  return { title: plain(getContent(isLocale(lang) ? lang : "en", "about").title) };
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  return (
    <ContentView page={getContent(lang, "about")} kicker={t.nav.about} image={photos.portrait.src} imageAlt={photos.portrait.alt}>
      <section id="credits" className="scroll-mt-28">
        <h2>Photography</h2>
        <p>
          Photos on Wadajir Give are used under the Unsplash License. They show places and everyday life across Somalia and East Africa — they are not photos of the people any fundraiser supports.
        </p>
        <ul>
          {Object.values(photos).map((p) => (
            <li key={p.creditUrl + p.place}>
              {p.place} —{" "}
              <a href={p.creditUrl} className="link">
                {p.credit}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </ContentView>
  );
}

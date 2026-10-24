import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Feather } from "lucide-react";
import { PageIntro } from "@/components/PreviewBanner";
import { plain } from "@/components/ui/Emphasis";
import { getRecentStories } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { getDictionary, href, isLocale } from "@/lib/i18n";
import { photos } from "@/lib/photos";

export async function generateMetadata({ params }: PageProps<"/[lang]/stories">): Promise<Metadata> {
  const { lang } = await params;
  return { title: plain(getDictionary(isLocale(lang) ? lang : "en").stories.title) };
}

export default async function StoriesPage({ params }: PageProps<"/[lang]/stories">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const stories = await getRecentStories(24);

  return (
    <>
      <PageIntro kicker={t.nav.stories} title={t.stories.title} body={t.stories.body} image={photos.camels.src} imageAlt={photos.camels.alt} />
      <div className="wrap border-t border-line pb-28 pt-12">
        {stories.length ? (
          <div className="columns-1 gap-5 md:columns-2 lg:columns-3 [&>*]:mb-5">
            {stories.map((s) => (
              <Link key={s.id} href={href(lang, `/fundraisers/${s.campaigns.slug}`)} className="card group block break-inside-avoid overflow-hidden transition-colors hover:border-line-strong">
                {s.campaigns.cover_image_url && (
                  <div className="relative aspect-[16/10]">
                    <Image src={s.campaigns.cover_image_url} alt="" fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover" />
                  </div>
                )}
                <div className="p-6">
                  <p className="text-[0.8125rem] text-muted">{formatDate(s.created_at, lang)}</p>
                  <p className="mt-3 line-clamp-6 font-serif text-[1.375rem] leading-snug text-pine">“{s.body}”</p>
                  <p className="mt-5 flex items-center gap-1.5 text-[0.875rem] font-medium text-forest">
                    {t.stories.from} {s.campaigns.title}
                    <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            <div className="card flex flex-col items-start gap-6 p-8 md:col-span-3 md:flex-row md:items-center">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-sage-soft text-forest">
                <Feather className="h-6 w-6" strokeWidth={1.5} aria-hidden />
              </span>
              <p className="t-h3 max-w-[40ch]">{t.stories.empty}</p>
            </div>
            {t.home.storyPlaceholders.map((text, i) => (
              <div key={i} className="card flex min-h-56 flex-col justify-between gap-6 border-dashed p-6">
                <span className="badge badge-line w-fit">{t.home.storyPlaceholderLabel}</span>
                <p className="font-serif text-[1.375rem] leading-snug text-pine/70">{text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

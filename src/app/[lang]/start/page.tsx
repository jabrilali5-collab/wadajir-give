import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CampaignForm } from "@/components/CampaignForm";
import { PageIntro } from "@/components/PreviewBanner";
import { getSession } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/env";
import { getDictionary, href, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/start">): Promise<Metadata> {
  const { lang } = await params;
  return { title: getDictionary(isLocale(lang) ? lang : "en").start.title };
}

export default async function StartPage({ params }: PageProps<"/[lang]/start">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const session = await getSession();

  return (
    <>
      <PageIntro title={t.start.title} body={t.start.body} />
      <div className="container-page max-w-3xl py-10">
        {session ? (
          <CampaignForm t={t} locale={lang} />
        ) : (
          <div className="rounded-[var(--radius-card)] border border-line p-8">
            <p className="text-lg">{isSupabaseConfigured ? t.start.signInFirst : t.auth.notConfigured}</p>
            {isSupabaseConfigured && (
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href={`${href(lang, "/signup")}?next=${encodeURIComponent(href(lang, "/start"))}`} className="btn btn-primary">{t.nav.signUp}</Link>
                <Link href={`${href(lang, "/login")}?next=${encodeURIComponent(href(lang, "/start"))}`} className="btn btn-secondary">{t.nav.signIn}</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

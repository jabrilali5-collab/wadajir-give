import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, MessageCircle, ShieldCheck } from "lucide-react";
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
  const next = encodeURIComponent(href(lang, "/start"));

  return (
    <>
      <PageIntro kicker={t.nav.start} title={t.start.title} body={t.start.body} />
      <div className="wrap border-t border-line pb-28 pt-12">
        {session ? (
          <div className="mx-auto max-w-4xl">
            <CampaignForm t={t} locale={lang} />
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div className="card card-pad flex flex-col justify-between gap-10">
              <p className="t-h3 max-w-[22ch]">{isSupabaseConfigured ? t.start.signInFirst : t.auth.notConfigured}</p>
              {isSupabaseConfigured && (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href={`${href(lang, "/signup")}?next=${next}`} className="btn btn-primary btn-lg">
                    {t.nav.signUp} <ArrowRight className="arrow" aria-hidden />
                  </Link>
                  <Link href={`${href(lang, "/login")}?next=${next}`} className="btn btn-secondary btn-lg">{t.nav.signIn}</Link>
                </div>
              )}
            </div>
            <ul className="space-y-6">
              {[
                { icon: ShieldCheck, text: t.home.trustPoints[0].body },
                { icon: BadgeCheck, text: t.home.trustPoints[1].body },
                { icon: MessageCircle, text: t.home.heroBody },
              ].map((x, i) => (
                <li key={i} className="flex gap-4 border-b border-line pb-6 last:border-0">
                  <x.icon className="mt-0.5 h-5 w-5 shrink-0 text-forest" strokeWidth={1.6} aria-hidden />
                  <p className="text-[0.9375rem] text-muted">{x.text}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

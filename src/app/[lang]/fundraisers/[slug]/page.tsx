import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, CalendarDays, Heart, MapPin, UserRound } from "lucide-react";
import { CampaignCover, Progress, SampleBadge, VerifiedBadge } from "@/components/campaign-ui";
import { DonateForm, ReportForm, ShareButtons } from "@/components/campaign-forms";
import { categoryLabel } from "@/lib/categories";
import { getCampaignBySlug, getCampaignUpdates, getPublicDonations } from "@/lib/data";
import { isStripeConfigured, siteUrl } from "@/lib/env";
import { formatDate, formatMoney, progressPercent } from "@/lib/format";
import { getDictionary, href, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/fundraisers/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCampaignBySlug(slug);
  if (!c) return {};
  return {
    title: c.title,
    description: c.story.slice(0, 160),
    openGraph: { title: c.title, description: c.story.slice(0, 160), images: c.cover_image_url ? [c.cover_image_url] : [] },
    robots: c.status === "approved" ? undefined : { index: false },
  };
}

export default async function CampaignPage({ params }: PageProps<"/[lang]/fundraisers/[slug]">) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const c = await getCampaignBySlug(slug);
  if (!c) notFound();

  const [updates, donations] = await Promise.all([getCampaignUpdates(c.id), getPublicDonations(c.id)]);
  const url = `${siteUrl()}${href(lang, `/fundraisers/${c.slug}`)}`;
  const isLive = c.status === "approved";
  const canPay = isLive && !c.is_sample && isStripeConfigured() && !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  const pct = progressPercent(c.raised_cents, c.goal_cents);
  const place = [c.city, c.country].filter(Boolean).join(", ");

  const summary = (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <p className="font-serif text-[2.75rem] leading-none text-pine">{formatMoney(c.raised_cents, lang)}</p>
        <p className="pb-1 text-[0.875rem] font-medium text-forest">{pct}%</p>
      </div>
      <Progress raised={c.raised_cents} goal={c.goal_cents} label={c.title} />
      <div className="flex justify-between text-[0.8125rem] text-muted">
        <span>
          {t.common.raised} — {t.common.goal} {formatMoney(c.goal_cents, lang)}
        </span>
        <span className="flex items-center gap-1.5">
          <Heart className="h-3.5 w-3.5" aria-hidden /> {c.donor_count} {c.donor_count === 1 ? t.common.donor : t.common.donors}
        </span>
      </div>
    </div>
  );

  return (
    <article className="pb-28 lg:pb-24">
      <div className="wrap pt-6 md:pt-10">
        <Link href={href(lang, "/fundraisers")} className="inline-flex items-center gap-2 text-[0.875rem] text-muted transition-colors hover:text-pine">
          <ArrowLeft className="h-4 w-4" aria-hidden /> {t.nav.causes}
        </Link>

        {!isLive && <p role="status" className="alert alert-warn mt-6">{t.campaign.notApproved} ({t.dashboard.statusLabels[c.status]})</p>}
        {c.is_sample && <p className="alert alert-warn mt-6">{t.common.sampleCampaignNote}</p>}

        <header className="mt-8 max-w-4xl">
          <div className="flex flex-wrap gap-2">
            <span className="badge">{categoryLabel(c.category, lang)}</span>
            {c.is_sample && <SampleBadge t={t} />}
            {c.organizer_verified && <VerifiedBadge t={t} />}
          </div>
          <h1 className="t-h1 mt-5">{c.title}</h1>
          <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[0.875rem] text-muted">
            <div className="flex items-center gap-2">
              <UserRound className="h-4 w-4" aria-hidden />
              <dt className="sr-only">{t.common.organizedBy}</dt>
              <dd>
                {t.common.organizedBy} <span className="text-pine">{c.organizer_name}</span> {t.common.for} <span className="text-pine">{c.beneficiary_name}</span>
              </dd>
            </div>
            {place && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" aria-hidden />
                <dt className="sr-only">{t.campaign.location}</dt>
                <dd>{place}</dd>
              </div>
            )}
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" aria-hidden />
              <dt className="sr-only">{t.common.created}</dt>
              <dd>{formatDate(c.approved_at ?? c.created_at, lang)}</dd>
            </div>
          </dl>
        </header>
      </div>

      <div className="wrap mt-10 grid gap-12 lg:grid-cols-[minmax(0,1.55fr)_minmax(360px,1fr)] lg:gap-16">
        <div className="min-w-0">
          <CampaignCover campaign={c} className="aspect-[16/10] rounded-[var(--radius-ui)]" sizes="(min-width: 1024px) 60vw, 100vw" priority />

          <div className="card card-pad mt-6 lg:hidden">{summary}</div>

          <section className="mt-14">
            <h2 className="t-h3">{t.campaign.story}</h2>
            <div className="mt-6 max-w-[64ch] whitespace-pre-line text-[1.0625rem] leading-[1.75] text-charcoal/90">{c.story}</div>
          </section>

          <section className="mt-14 border-t border-line pt-10">
            <h2 className="t-h3">{t.campaign.updates}</h2>
            {updates.length ? (
              <ol className="mt-8 space-y-8">
                {updates.map((u) => (
                  <li key={u.id} className="relative border-l border-line-strong pl-6">
                    <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-gold" aria-hidden />
                    <time className="text-[0.8125rem] text-muted" dateTime={u.created_at}>{formatDate(u.created_at, lang)}</time>
                    <p className="mt-2 max-w-[62ch] whitespace-pre-line leading-relaxed">{u.body}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-4 text-muted">{t.campaign.noUpdates}</p>
            )}
          </section>

          <section className="mt-14 border-t border-line pt-10">
            <h2 className="t-h3">{t.campaign.shareTitle}</h2>
            <div className="mt-6"><ShareButtons t={t} url={url} title={c.title} /></div>
          </section>

          {isLive && !c.is_sample && (
            <section className="mt-14 border-t border-line pt-8">
              <ReportForm t={t} campaignId={c.id} />
            </section>
          )}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div id="donate" className="card scroll-mt-24 overflow-hidden">
            <div className="hidden border-b border-line p-6 lg:block">{summary}</div>
            <div className="p-6">
              <h2 className="t-h3 mb-6">{t.campaign.donateTitle}</h2>
              <DonateForm t={t} locale={lang} campaignId={c.id} disabled={!canPay} />
            </div>
          </div>

          <section className="card p-6">
            <h2 className="text-[0.9375rem] font-semibold text-pine">{t.campaign.recentDonations}</h2>
            {donations.length ? (
              <ul className="mt-4 divide-y divide-line">
                {donations.map((d) => (
                  <li key={d.id} className="flex gap-3 py-3.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage-soft text-[0.75rem] font-medium text-forest">
                      {d.display_name === "Anonymous" ? "—" : d.display_name.slice(0, 1).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-3 text-[0.9375rem]">
                        <span className="truncate font-medium text-pine">{d.display_name === "Anonymous" ? t.common.anonymous : d.display_name}</span>
                        <span className="text-pine">{formatMoney(d.amount_cents, lang)}</span>
                      </div>
                      {d.message && <p className="mt-1 text-[0.875rem] text-muted">{d.message}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-[0.9375rem] text-muted">{t.campaign.noDonations}</p>
            )}
          </section>
        </aside>
      </div>

      {/* Mobile donate bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ivory/95 px-5 py-3 backdrop-blur-md lg:hidden">
        <div className="flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="font-serif text-[1.375rem] leading-none text-pine">{formatMoney(c.raised_cents, lang)}</p>
            <p className="mt-1 text-[0.75rem] text-muted">
              {pct}% {t.common.of} {formatMoney(c.goal_cents, lang)}
            </p>
          </div>
          <a href="#donate" className="btn btn-primary">
            <Heart aria-hidden /> {t.common.donate}
          </a>
        </div>
      </div>
    </article>
  );
}

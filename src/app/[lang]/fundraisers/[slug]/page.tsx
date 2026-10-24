import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
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

  return (
    <article className="container-page py-8 md:py-12">
      <Link href={href(lang, "/fundraisers")} className="text-sm font-semibold text-teal hover:underline">
        {t.common.back}
      </Link>

      {!isLive && (
        <p role="status" className="mt-4 rounded-[var(--radius-control)] bg-warn-bg p-3 text-sm text-warn">
          {t.campaign.notApproved} ({t.dashboard.statusLabels[c.status]})
        </p>
      )}
      {c.is_sample && (
        <p className="mt-4 rounded-[var(--radius-control)] bg-warn-bg p-3 text-sm text-warn">{t.common.sampleCampaignNote}</p>
      )}

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            {c.is_sample && <SampleBadge t={t} />}
            {c.organizer_verified && <VerifiedBadge t={t} />}
            <span className="pill bg-mist text-teal-deep">{categoryLabel(c.category, lang)}</span>
          </div>
          <h1 className="mt-4 text-[2rem] leading-tight md:text-[2.6rem]">{c.title}</h1>
          <p className="mt-3 text-ink-soft">
            {t.common.organizedBy} <strong className="text-ink">{c.organizer_name}</strong> {t.common.for}{" "}
            <strong className="text-ink">{c.beneficiary_name}</strong>
            {(c.city || c.country) && <> — {[c.city, c.country].filter(Boolean).join(", ")}</>}
          </p>

          <CampaignCover campaign={c} locale={lang} className="mt-6 aspect-[16/9] rounded-[var(--radius-card)]" priority />

          {/* Mobile progress summary */}
          <div className="mt-6 space-y-2 lg:hidden">
            <Progress raised={c.raised_cents} goal={c.goal_cents} label={c.title} />
            <p>
              <strong className="text-xl">{formatMoney(c.raised_cents, lang)}</strong>{" "}
              <span className="text-ink-soft">
                {t.common.raised}, {t.common.goal} {formatMoney(c.goal_cents, lang)}
              </span>
            </p>
            <a href="#donate" className="btn btn-primary w-full">{t.common.donate}</a>
          </div>

          <section className="mt-10">
            <h2 className="text-2xl">{t.campaign.story}</h2>
            <div className="mt-4 max-w-[68ch] space-y-4 whitespace-pre-line text-[1.05rem] leading-relaxed text-ink">
              {c.story}
            </div>
          </section>

          <section className="mt-10 border-t border-line pt-8">
            <h2 className="text-2xl">{t.campaign.updates}</h2>
            {updates.length ? (
              <ol className="mt-4 space-y-5">
                {updates.map((u) => (
                  <li key={u.id} className="border-l-2 border-emerald pl-4">
                    <time className="text-sm text-ink-soft" dateTime={u.created_at}>{formatDate(u.created_at, lang)}</time>
                    <p className="mt-1 whitespace-pre-line">{u.body}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-3 text-ink-soft">{t.campaign.noUpdates}</p>
            )}
          </section>

          <section className="mt-10 border-t border-line pt-8">
            <h2 className="text-2xl">{t.campaign.shareTitle}</h2>
            <div className="mt-4"><ShareButtons t={t} url={url} title={c.title} /></div>
          </section>

          {isLive && !c.is_sample && (
            <section className="mt-10 border-t border-line pt-8">
              <ReportForm t={t} campaignId={c.id} />
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[var(--radius-card)] border border-line p-5 md:p-6">
            <div className="hidden space-y-2 lg:block">
              <p>
                <strong className="font-[family-name:var(--font-display)] text-3xl">{formatMoney(c.raised_cents, lang)}</strong>
              </p>
              <p className="text-ink-soft">
                {t.common.raised}, {t.common.goal} {formatMoney(c.goal_cents, lang)}
              </p>
              <Progress raised={c.raised_cents} goal={c.goal_cents} label={c.title} />
              <p className="text-sm text-ink-soft">
                {progressPercent(c.raised_cents, c.goal_cents)}% · {c.donor_count} {c.donor_count === 1 ? t.common.donor : t.common.donors}
              </p>
            </div>
            <div id="donate" className="scroll-mt-24 pt-2 lg:mt-6 lg:border-t lg:border-line lg:pt-6">
              <h2 className="mb-4 text-xl">{t.campaign.donateTitle}</h2>
              <DonateForm t={t} locale={lang} campaignId={c.id} disabled={!canPay} />
            </div>
          </div>

          <section className="mt-6 rounded-[var(--radius-card)] border border-line p-5">
            <h2 className="text-lg">{t.campaign.recentDonations}</h2>
            {donations.length ? (
              <ul className="mt-3 divide-y divide-line">
                {donations.map((d) => (
                  <li key={d.id} className="py-3">
                    <div className="flex justify-between gap-3">
                      <span className="font-semibold">{d.display_name === "Anonymous" ? t.common.anonymous : d.display_name}</span>
                      <span>{formatMoney(d.amount_cents, lang)}</span>
                    </div>
                    {d.message && <p className="mt-1 text-sm text-ink-soft">{d.message}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-ink-soft">{t.campaign.noDonations}</p>
            )}
          </section>
        </aside>
      </div>
    </article>
  );
}

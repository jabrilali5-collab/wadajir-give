import Link from "next/link";
import { notFound } from "next/navigation";
import { CampaignGrid, CampaignCover, Progress, SampleBadge, VerifiedBadge } from "@/components/campaign-ui";
import { categories } from "@/lib/categories";
import { listCampaigns } from "@/lib/data";
import { getFaq } from "@/lib/faq";
import { formatMoney } from "@/lib/format";
import { getDictionary, href, isLocale } from "@/lib/i18n";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const campaigns = await listCampaigns({ limit: 7 });
  const [lead, ...rest] = campaigns;
  const faq = getFaq(lang).slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line">
        <div className="container-page grid items-center gap-10 py-12 md:py-20 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <h1 className="max-w-[15ch] text-[2.6rem] leading-[1.02] text-teal-deep sm:text-[3.4rem] lg:text-[4rem]">
              {t.home.heroTitle}
            </h1>
            <p className="mt-6 max-w-[52ch] text-lg text-ink-soft">{t.home.heroBody}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={href(lang, "/start")} className="btn btn-primary">
                {t.home.startCta}
              </Link>
              <Link href={href(lang, "/fundraisers")} className="btn btn-secondary">
                {t.home.donateCta}
              </Link>
            </div>
            <ul className="mt-8 space-y-2">
              {t.home.heroPoints.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-ink-soft">
                  <svg viewBox="0 0 20 20" className="mt-1 h-4 w-4 shrink-0" aria-hidden="true">
                    <rect x="4" y="4" width="12" height="12" rx="2" transform="rotate(45 10 10)" fill="var(--color-emerald)" />
                  </svg>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* The woven panel carries the most urgent fundraiser */}
          <div className="weave relative rounded-[22px] p-5 sm:p-8">
            {lead ? (
              <article className="relative overflow-hidden rounded-[var(--radius-card)] bg-white">
                <CampaignCover campaign={lead} locale={lang} className="aspect-[16/9]" priority />
                <div className="space-y-3 p-5">
                  <div className="flex flex-wrap gap-2">
                    {lead.is_sample && <SampleBadge t={t} />}
                    {lead.organizer_verified && <VerifiedBadge t={t} />}
                  </div>
                  <h2 className="text-xl leading-snug">
                    <Link href={href(lang, `/fundraisers/${lead.slug}`)} className="hover:text-teal">
                      {lead.title}
                    </Link>
                  </h2>
                  <Progress raised={lead.raised_cents} goal={lead.goal_cents} label={lead.title} />
                  <div className="flex items-end justify-between gap-3">
                    <p className="text-sm text-ink-soft">
                      <strong className="block text-xl text-ink">{formatMoney(lead.raised_cents, lang)}</strong>
                      {t.common.raised}, {t.common.goal} {formatMoney(lead.goal_cents, lang)}
                    </p>
                    <Link href={href(lang, `/fundraisers/${lead.slug}#donate`)} className="btn btn-primary">
                      {t.common.donate}
                    </Link>
                  </div>
                  {lead.is_sample && <p className="text-xs text-warn">{t.common.sampleCampaignNote}</p>}
                </div>
              </article>
            ) : (
              <div className="rounded-[var(--radius-card)] bg-white p-8">
                <h2 className="text-2xl">{t.home.impactCta}</h2>
                <p className="mt-3 text-ink-soft">{t.home.featuredBody}</p>
                <Link href={href(lang, "/start")} className="btn btn-primary mt-6">
                  {t.home.startCta}
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured */}
      {rest.length > 0 && (
        <section className="container-page py-16 md:py-20">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-[1.9rem] md:text-[2.3rem]">{t.home.featuredTitle}</h2>
              <p className="mt-2 text-ink-soft">{t.home.featuredBody}</p>
            </div>
            <Link href={href(lang, "/fundraisers")} className="font-semibold text-teal underline-offset-4 hover:underline">
              {t.common.seeAll}
            </Link>
          </div>
          <CampaignGrid campaigns={rest.slice(0, 6)} locale={lang} t={t} />
        </section>
      )}

      {/* Categories */}
      <section className="bg-mist py-16 md:py-20">
        <div className="container-page">
          <h2 className="text-[1.9rem] md:text-[2.3rem]">{t.home.categoriesTitle}</h2>
          <ul className="mt-8 flex flex-wrap gap-3">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`${href(lang, "/fundraisers")}?category=${c.slug}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-line bg-white px-4 font-semibold text-teal-deep hover:border-teal"
                >
                  {c[lang]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works — a real sequence, so it's numbered */}
      <section className="container-page py-16 md:py-20">
        <h2 className="text-[1.9rem] md:text-[2.3rem]">{t.home.howTitle}</h2>
        <ol className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {t.home.howSteps.map((s, i) => (
            <li key={s.title} className="border-t-2 border-teal pt-5">
              <span className="font-[family-name:var(--font-display)] text-3xl font-bold text-emerald">{i + 1}</span>
              <h3 className="mt-2 text-xl">{s.title}</h3>
              <p className="mt-2 text-ink-soft">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Trust */}
      <section className="weave text-white">
        <div className="container-page grid gap-10 py-16 md:py-20 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <h2 className="text-[1.9rem] text-white md:text-[2.3rem]">{t.home.trustTitle}</h2>
            <p className="mt-4 max-w-[48ch] text-white/85">{t.home.trustBody}</p>
            <Link href={href(lang, "/trust-safety")} className="btn mt-6 bg-white text-teal-deep hover:bg-mist">
              {t.nav.trust}
            </Link>
          </div>
          <dl className="grid gap-6 sm:grid-cols-2">
            {t.home.trustPoints.map((p) => (
              <div key={p.title} className="rounded-[var(--radius-card)] bg-teal-deep/80 p-5 ring-1 ring-white/15">
                <dt className="font-[family-name:var(--font-display)] text-lg font-semibold">{p.title}</dt>
                <dd className="mt-2 text-white/80">{p.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Impact: honest placeholder until real numbers exist */}
      <section className="container-page py-16 md:py-20">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-[1.9rem] md:text-[2.3rem]">{t.home.impactTitle}</h2>
            <p className="mt-3 max-w-[60ch] text-ink-soft">{t.home.impactBody}</p>
          </div>
          <Link href={href(lang, "/start")} className="btn btn-secondary">
            {t.home.impactCta}
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-line">
        <div className="container-page py-16 md:py-20">
          <h2 className="text-[1.9rem] md:text-[2.3rem]">{t.home.faqTitle}</h2>
          <div className="mt-8 max-w-3xl divide-y divide-line border-y border-line">
            {faq.map((f) => (
              <details key={f.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden="true" className="text-2xl text-teal transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-[65ch] text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
          <Link href={href(lang, "/faq")} className="mt-6 inline-block font-semibold text-teal underline-offset-4 hover:underline">
            {t.home.faqMore}
          </Link>
        </div>
      </section>
    </>
  );
}

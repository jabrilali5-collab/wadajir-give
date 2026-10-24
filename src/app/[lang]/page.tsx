import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, BadgeCheck, Flag, HandHeart, Lock, Search, Sprout, UsersRound } from "lucide-react";
import { CampaignCard } from "@/components/campaign-ui";
import { Emphasis } from "@/components/ui/Emphasis";
import { FaqList } from "@/components/FaqList";
import { getPlatformStats, getRecentStories, listCampaigns } from "@/lib/data";
import { getFaq } from "@/lib/faq";
import { formatDate, formatMoney } from "@/lib/format";
import { getDictionary, href, isLocale } from "@/lib/i18n";
import { causeAreas, photos } from "@/lib/photos";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const h = t.home;
  const [campaigns, stats, stories] = await Promise.all([listCampaigns({ limit: 3 }), getPlatformStats(), getRecentStories(3)]);
  const faq = getFaq(lang).slice(0, 5);
  const hasStats = stats.active > 0;

  return (
    <>
      {/* ───────────── Hero ───────────── */}
      <section className="relative -mt-[72px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={photos.hero.src}
            alt={photos.hero.alt}
            fill
            priority
            placeholder="blur"
            sizes="100vw"
            className="settle object-cover object-[60%_center]"
          />
          {/* Ivory veil: from the left on desktop, from the bottom on mobile */}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(247_247_237/0.85)_0%,rgb(247_247_237/0.35)_28%,rgb(247_247_237/0.55)_55%,rgb(247_247_237/1)_86%)] lg:bg-[linear-gradient(90deg,rgb(247_247_237/0.97)_0%,rgb(247_247_237/0.86)_34%,rgb(247_247_237/0.15)_62%,rgb(247_247_237/0)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 hidden h-40 bg-gradient-to-b from-transparent to-ivory lg:block" />
        </div>

        <div className="wrap relative flex min-h-[640px] flex-col justify-end pb-28 pt-[160px] sm:min-h-[720px] lg:min-h-[860px] lg:justify-center lg:pb-40">
          <p className="t-kicker rise">{h.kicker}</p>
          <h1 className="t-display rise rise-1 mt-6 max-w-[11ch]">
            <Emphasis text={h.heroTitle} />
          </h1>
          <p className="t-lead rise rise-2 mt-7 max-w-[44ch] text-charcoal/80">{h.heroBody}</p>
          <div className="rise rise-3 mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href={href(lang, "/fundraisers")} className="btn btn-primary btn-lg">
              {h.exploreCta} <ArrowRight className="arrow" aria-hidden />
            </Link>
            <Link href={href(lang, "/start")} className="btn btn-lg border border-line-strong bg-ivory/70 text-pine backdrop-blur-sm hover:bg-ivory">
              {h.startCta}
            </Link>
          </div>
        </div>

        <p className="absolute bottom-24 right-6 hidden text-right text-[0.75rem] text-ivory/90 [text-shadow:0_1px_8px_rgb(0_0_0/0.35)] lg:right-14 lg:block">
          {h.heroCaption} — {h.photoCredit}{" "}
          <a href={photos.hero.creditUrl} className="underline decoration-ivory/40 underline-offset-2">
            {photos.hero.credit}
          </a>
        </p>
      </section>

      {/* ───────────── Live stats (real data only) ───────────── */}
      <section className="wrap relative z-10 -mt-16">
        <div className="card overflow-hidden bg-paper/95 backdrop-blur">
          {hasStats ? (
            <dl className="grid grid-cols-2 lg:grid-cols-4">
              {[
                { icon: HandHeart, label: h.stats.donated, value: formatMoney(stats.donatedCents, lang) },
                { icon: UsersRound, label: h.stats.gifts, value: stats.gifts.toLocaleString("en-US") },
                { icon: Sprout, label: h.stats.active, value: stats.active.toLocaleString("en-US") },
                { icon: Flag, label: h.stats.communities, value: stats.communities.toLocaleString("en-US") },
              ].map((s, i) => (
                <div key={s.label} className={`flex items-start gap-4 p-6 lg:items-center lg:p-8 ${i % 2 ? "border-l border-line" : ""} ${i > 1 ? "border-t border-line lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}>
                  <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sage-soft text-forest sm:flex">
                    <s.icon className="h-5 w-5" aria-hidden strokeWidth={1.6} />
                  </span>
                  <div>
                    <dd className="font-serif text-[2rem] leading-none text-pine lg:text-[2.5rem]">{s.value}</dd>
                    <dt className="mt-2 text-[0.8125rem] text-muted">{s.label}</dt>
                  </div>
                </div>
              ))}
            </dl>
          ) : (
            <div className="grid gap-6 p-6 md:grid-cols-[1.2fr_1fr] md:items-center md:p-8">
              <p className="max-w-[52ch] text-[0.9375rem] leading-relaxed text-muted">{h.stats.empty}</p>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
                {[h.stats.donated, h.stats.gifts, h.stats.active, h.stats.communities].map((l) => (
                  <li key={l} className="flex items-center gap-2 text-[0.8125rem] text-pine">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden /> {l}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {hasStats && (
            <p className="flex items-center gap-2 border-t border-line px-6 py-3 text-[0.75rem] text-muted lg:px-8">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-forest" aria-hidden />
              {stats.isSample ? t.common.sampleCampaignNote : h.stats.live}
            </p>
          )}
        </div>
      </section>

      {/* ───────────── Cause areas ───────────── */}
      <section className="section">
        <div className="wrap">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="t-kicker">{h.causesKicker}</p>
              <h2 className="t-h2 mt-4">
                <Emphasis text={h.causesTitle} />
              </h2>
              <p className="t-lead mt-4 max-w-[52ch]">{h.causesBody}</p>
            </div>
            <Link href={href(lang, "/fundraisers")} className="link inline-flex items-center gap-1.5 text-[0.9375rem]">
              {h.viewAll} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <div className="rail mt-12 md:grid md:grid-cols-12 md:grid-rows-2 md:gap-5">
            {causeAreas.map((a, i) => {
              const copy = h.causeAreas[a.key];
              const big = i === 0;
              return (
                <Link
                  key={a.key}
                  href={`${href(lang, "/fundraisers")}?category=${a.category}`}
                  className={`img-zoom group relative block min-h-[420px] overflow-hidden rounded-[var(--radius-ui)] md:min-h-0 ${
                    big ? "md:col-span-6 md:row-span-2 md:min-h-[600px]" : i === 1 ? "md:col-span-6" : "md:col-span-3 md:min-h-[290px]"
                  }`}
                >
                  <Image src={a.photo.src} alt={a.photo.alt} fill placeholder="blur" sizes="(min-width: 768px) 50vw, 85vw" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-pine/90 via-pine/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-ivory md:p-7">
                    <h3 className={`font-serif text-ivory ${big ? "text-[2.5rem]" : "text-[1.875rem]"} leading-none`}>{copy.title}</h3>
                    <p className={`mt-3 max-w-[36ch] text-[0.9375rem] leading-relaxed text-ivory/80 ${big || i === 1 ? "" : "md:hidden"}`}>{copy.body}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-ivory">
                      {h.exploreArea}
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────── Live fundraisers (only when real ones exist) ───────────── */}
      {campaigns.length > 0 && (
        <section className="section border-t border-line pt-16 lg:pt-24">
          <div className="wrap">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="t-kicker">{h.featuredKicker}</p>
                <h2 className="t-h2 mt-4">
                  <Emphasis text={h.featuredTitle} />
                </h2>
              </div>
              <Link href={href(lang, "/fundraisers")} className="link inline-flex items-center gap-1.5 text-[0.9375rem]">
                {h.viewAll} <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <div className="rail mt-10 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
              {campaigns.map((c) => (
                <CampaignCard key={c.id} campaign={c} locale={lang} t={t} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───────────── How it works ───────────── */}
      <section className="section bg-paper">
        <div className="wrap grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="t-kicker">{h.howKicker}</p>
            <h2 className="t-h2 mt-4 max-w-[14ch]">
              <Emphasis text={h.howTitle} />
            </h2>
            <p className="t-lead mt-5 max-w-[46ch]">{h.howBody}</p>
            <div className="relative mt-10 hidden aspect-[16/10] overflow-hidden rounded-[var(--radius-ui)] lg:block">
              <Image src={photos.hills.src} alt={photos.hills.alt} fill placeholder="blur" sizes="40vw" className="object-cover" />
            </div>
          </div>
          <ol className="relative">
            {h.howSteps.map((s, i) => {
              const Icon = [Search, HandHeart, Sprout][i];
              return (
                <li key={s.title} className="relative grid grid-cols-[56px_1fr] gap-6 pb-14 last:pb-0">
                  {i < h.howSteps.length - 1 && <span className="absolute left-[27px] top-16 h-[calc(100%-72px)] w-px bg-line-strong" aria-hidden />}
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-line-strong bg-ivory text-forest">
                    <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden />
                  </span>
                  <div className="pt-1">
                    <p className="text-[0.8125rem] font-medium text-gold">0{i + 1}</p>
                    <h3 className="t-h3 mt-1">{s.title}</h3>
                    <p className="mt-3 max-w-[42ch] text-muted">{s.body}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ───────────── Trust ───────────── */}
      <section className="bg-pine text-ivory">
        <div className="wrap grid gap-12 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 lg:py-28">
          <div>
            <h2 className="t-h2 max-w-[12ch] !text-ivory">{h.trustTitle}</h2>
            <Link href={href(lang, "/trust-safety")} className="btn btn-ghost-light mt-8">
              {t.nav.trust} <ArrowRight className="arrow" aria-hidden />
            </Link>
          </div>
          <dl className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {h.trustPoints.map((p, i) => {
              const Icon = [UsersRound, BadgeCheck, Flag, Lock][i];
              return (
                <div key={p.title} className="border-t border-ivory/15 pt-6">
                  <Icon className="h-5 w-5 text-gold" strokeWidth={1.6} aria-hidden />
                  <dt className="mt-4 text-[1.0625rem] font-medium">{p.title}</dt>
                  <dd className="mt-2 text-[0.9375rem] leading-relaxed text-ivory/70">{p.body}</dd>
                </div>
              );
            })}
          </dl>
        </div>
      </section>

      {/* ───────────── Stories ───────────── */}
      <section className="section">
        <div className="wrap">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="t-kicker">{h.storiesKicker}</p>
              <h2 className="t-h2 mt-4 max-w-[18ch]">
                <Emphasis text={h.storiesTitle} />
              </h2>
              <p className="t-lead mt-4 max-w-[52ch]">{h.storiesBody}</p>
            </div>
            <Link href={href(lang, "/stories")} className="link inline-flex items-center gap-1.5 text-[0.9375rem]">
              {t.nav.stories} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-12">
            <figure className="relative min-h-[420px] overflow-hidden rounded-[var(--radius-ui)] lg:col-span-5 lg:min-h-[560px]">
              <Image src={photos.camels.src} alt={photos.camels.alt} fill placeholder="blur" sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-pine/80 to-transparent p-6 pt-16 text-[0.75rem] text-ivory/85">
                {photos.camels.place} — {h.photoCredit}{" "}
                <a href={photos.camels.creditUrl} className="underline decoration-ivory/40 underline-offset-2">{photos.camels.credit}</a>
              </figcaption>
            </figure>
            <div className="grid gap-5 lg:col-span-7">
              {stories.length > 0
                ? stories.map((s) => (
                    <Link key={s.id} href={href(lang, `/fundraisers/${s.campaigns.slug}`)} className="card card-pad group block transition-colors hover:border-line-strong">
                      <p className="text-[0.8125rem] text-muted">
                        {formatDate(s.created_at, lang)} — {s.campaigns.title}
                      </p>
                      <p className="mt-4 line-clamp-4 font-serif text-[1.5rem] leading-snug text-pine">“{s.body}”</p>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-forest">
                        {h.readStory} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                      </span>
                    </Link>
                  ))
                : h.storyPlaceholders.map((text, i) => (
                    <div key={i} className="card card-pad flex flex-col justify-between gap-6 border-dashed">
                      <span className="badge badge-line w-fit">{h.storyPlaceholderLabel}</span>
                      <p className="font-serif text-[1.5rem] leading-snug text-pine/70">{text}</p>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── FAQ ───────────── */}
      <section className="section border-t border-line">
        <div className="wrap grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <h2 className="t-h2">
              <Emphasis text={h.faqTitle} />
            </h2>
            <Link href={href(lang, "/faq")} className="link mt-6 inline-flex items-center gap-1.5 text-[0.9375rem]">
              {h.faqMore} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <FaqList items={faq} />
        </div>
      </section>

      {/* ───────────── Final CTA ───────────── */}
      <section className="relative overflow-hidden">
        <Image src={photos.cta.src} alt={photos.cta.alt} fill placeholder="blur" sizes="100vw" className="object-cover object-[50%_60%]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(16_44_37/0.25)_0%,rgb(16_44_37/0.55)_55%,rgb(16_44_37/0.85)_100%)]" />
        <div className="wrap relative flex min-h-[560px] flex-col justify-end py-16 lg:min-h-[640px] lg:py-24">
          <h2 className="t-h1 max-w-[19ch] !text-ivory [&_em]:!text-gold-soft">
            <Emphasis text={h.ctaTitle} />
          </h2>
          <p className="mt-5 max-w-[46ch] text-[1.0625rem] text-ivory/80">{h.ctaBody}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={href(lang, "/start")} className="btn btn-ivory btn-lg">
              {h.ctaPrimary} <ArrowRight className="arrow" aria-hidden />
            </Link>
            <Link href={href(lang, "/fundraisers")} className="btn btn-ghost-light btn-lg">
              {h.ctaSecondary}
            </Link>
          </div>
          <p className="mt-10 text-[0.75rem] text-ivory/60">
            {photos.cta.place} — {h.photoCredit}{" "}
            <a href={photos.cta.creditUrl} className="underline decoration-ivory/30 underline-offset-2">{photos.cta.credit}</a>
          </p>
        </div>
      </section>
    </>
  );
}

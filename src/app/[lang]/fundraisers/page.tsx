import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Search, Sprout } from "lucide-react";
import { CampaignGrid } from "@/components/campaign-ui";
import { PageIntro } from "@/components/PreviewBanner";
import { plain } from "@/components/ui/Emphasis";
import { categories, isCategory } from "@/lib/categories";
import { listCampaigns } from "@/lib/data";
import { getDictionary, href, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/fundraisers">): Promise<Metadata> {
  const { lang } = await params;
  return { title: plain(getDictionary(isLocale(lang) ? lang : "en").nav.causes) };
}

export default async function Explore({ params, searchParams }: PageProps<"/[lang]/fundraisers">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const sp = await searchParams;
  const category = typeof sp.category === "string" && isCategory(sp.category) ? sp.category : undefined;
  const q = typeof sp.q === "string" ? sp.q.slice(0, 80) : undefined;
  const campaigns = await listCampaigns({ category, q, limit: 48 });
  const base = href(lang, "/fundraisers");
  const chip = (active: boolean) =>
    `inline-flex h-10 items-center rounded-full px-4 text-[0.875rem] transition-colors ${
      active ? "bg-forest text-ivory" : "border border-line-strong text-pine hover:border-forest"
    }`;

  return (
    <>
      <PageIntro kicker={t.nav.causes} title={t.explore.title} body={t.explore.body}>
        <form action={base} method="get" role="search" className="flex max-w-xl gap-2">
          {category && <input type="hidden" name="category" value={category} />}
          <label htmlFor="q" className="sr-only">{t.explore.search}</label>
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
            <input id="q" name="q" defaultValue={q} placeholder={t.explore.search} className="field pl-11" />
          </div>
          <button className="btn btn-primary">{t.explore.searchButton}</button>
        </form>
      </PageIntro>

      <div className="wrap pb-24">
        <nav aria-label={t.campaign.category} className="-mx-5 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:px-0">
          <ul className="flex gap-2 whitespace-nowrap md:flex-wrap">
            <li>
              <Link href={q ? `${base}?q=${encodeURIComponent(q)}` : base} aria-current={!category ? "page" : undefined} className={chip(!category)}>
                {t.explore.allCategories}
              </Link>
            </li>
            {categories.map((c) => {
              const active = c.slug === category;
              const qs = new URLSearchParams({ category: c.slug, ...(q ? { q } : {}) });
              return (
                <li key={c.slug}>
                  <Link href={`${base}?${qs}`} aria-current={active ? "page" : undefined} className={chip(active)}>
                    {c[lang]}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-10 border-t border-line pt-10">
          {campaigns.length ? (
            <CampaignGrid campaigns={campaigns} locale={lang} t={t} />
          ) : (
            <div className="card flex flex-col items-center px-6 py-20 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sage-soft text-forest">
                <Sprout className="h-6 w-6" strokeWidth={1.5} aria-hidden />
              </span>
              <p className="t-h3 mt-6 max-w-[24ch]">{t.explore.empty}</p>
              <Link href={href(lang, "/start")} className="btn btn-primary mt-8">
                {t.nav.start} <ArrowRight className="arrow" aria-hidden />
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

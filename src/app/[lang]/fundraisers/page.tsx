import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CampaignGrid } from "@/components/campaign-ui";
import { PageIntro } from "@/components/PreviewBanner";
import { categories, isCategory } from "@/lib/categories";
import { listCampaigns } from "@/lib/data";
import { getDictionary, href, isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/fundraisers">): Promise<Metadata> {
  const { lang } = await params;
  return { title: getDictionary(isLocale(lang) ? lang : "en").explore.title };
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

  return (
    <>
      <PageIntro title={t.explore.title} body={t.explore.body}>
        <form action={base} method="get" role="search" className="mt-8 flex max-w-xl gap-2">
          {category && <input type="hidden" name="category" value={category} />}
          <label htmlFor="q" className="sr-only">{t.explore.search}</label>
          <input id="q" name="q" defaultValue={q} placeholder={t.explore.search} className="field" />
          <button className="btn btn-primary">{t.explore.searchButton}</button>
        </form>
      </PageIntro>

      <div className="container-page py-10">
        <nav aria-label={t.home.categoriesTitle} className="-mx-4 overflow-x-auto px-4 pb-2">
          <ul className="flex gap-2 whitespace-nowrap">
            <li>
              <Link
                href={q ? `${base}?q=${encodeURIComponent(q)}` : base}
                aria-current={!category ? "page" : undefined}
                className={`inline-flex min-h-10 items-center rounded-full px-4 text-sm font-semibold ${!category ? "bg-teal text-white" : "border border-line text-teal-deep hover:border-teal"}`}
              >
                {t.explore.allCategories}
              </Link>
            </li>
            {categories.map((c) => {
              const active = c.slug === category;
              const qs = new URLSearchParams({ category: c.slug, ...(q ? { q } : {}) });
              return (
                <li key={c.slug}>
                  <Link
                    href={`${base}?${qs}`}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex min-h-10 items-center rounded-full px-4 text-sm font-semibold ${active ? "bg-teal text-white" : "border border-line text-teal-deep hover:border-teal"}`}
                  >
                    {c[lang]}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-8">
          {campaigns.length ? (
            <CampaignGrid campaigns={campaigns} locale={lang} t={t} />
          ) : (
            <div className="rounded-[var(--radius-card)] border border-dashed border-line p-10 text-center">
              <p className="text-ink-soft">{t.explore.empty}</p>
              <Link href={href(lang, "/start")} className="btn btn-primary mt-5">
                {t.nav.start}
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusPill } from "@/components/SideNav";
import { requireSession } from "@/lib/data";
import { myCampaigns } from "@/lib/dashboard-data";
import { formatDate, formatMoney } from "@/lib/format";
import { getDictionary, href, isLocale } from "@/lib/i18n";

export default async function MyFundraisers({ params }: PageProps<"/[lang]/dashboard/fundraisers">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const d = t.dashboard;
  const session = await requireSession(lang, href(lang, "/dashboard/fundraisers"));
  const campaigns = await myCampaigns(session.userId);
  return (
    <section>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl">{d.myFundraisers}</h2>
        <Link href={href(lang, "/start")} className="btn btn-primary">{t.nav.start}</Link>
      </div>
      {campaigns.length === 0 ? (
        <p className="mt-6 text-ink-soft">{d.noFundraisers}</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {campaigns.map((c) => (
            <li key={c.id} className="rounded-[var(--radius-card)] border border-line p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-lg">{c.title}</h3>
                  <p className="text-sm text-ink-soft">
                    {formatMoney(c.raised_cents, lang)} / {formatMoney(c.goal_cents, lang)} — {t.common.created} {formatDate(c.created_at, lang)}
                  </p>
                </div>
                <StatusPill status={c.status} label={d.statusLabels[c.status]} />
              </div>
              {c.status === "rejected" && c.review_note && (
                <p className="mt-3 rounded-[var(--radius-control)] bg-warn-bg p-3 text-sm text-warn">{c.review_note}</p>
              )}
              <div className="mt-3 flex gap-4 text-sm font-semibold">
                <Link href={href(lang, `/dashboard/fundraisers/${c.id}`)} className="text-teal hover:underline">{d.edit}</Link>
                <Link href={href(lang, `/fundraisers/${c.slug}`)} className="text-teal hover:underline">{d.view}</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

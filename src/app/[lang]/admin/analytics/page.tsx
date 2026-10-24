import { notFound } from "next/navigation";
import { EmptyState, SectionTitle, StatCard } from "@/components/app-ui";
import { adminAnalytics } from "@/lib/admin-data";
import { categoryLabel } from "@/lib/categories";
import { formatMoney } from "@/lib/format";
import { getDictionary, isLocale } from "@/lib/i18n";

export default async function AdminAnalytics({ params }: PageProps<"/[lang]/admin/analytics">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const a = await adminAnalytics();
  const maxDay = Math.max(1, ...a.byDay.map(([, v]) => v));
  const cats = Object.entries(a.byCategory).sort(([, x], [, y]) => y - x);
  const maxCat = Math.max(1, ...cats.map(([, n]) => n));
  return (
    <div className="space-y-10">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Donated (succeeded)" value={formatMoney(a.totalDonated, lang)} />
        <StatCard label="Tips" value={formatMoney(a.totalTips, lang)} />
        <StatCard label="Donations" value={String(a.count)} hint={`${a.testCount} in test mode`} />
      </div>
      <section>
        <SectionTitle title="Donations by day" />
        {a.byDay.length === 0 ? <EmptyState text={t.common.noResults} /> : (
          <div className="panel p-6">
            <div className="flex h-48 items-end gap-1.5" role="img" aria-label="Donations per day, last 30 days with activity">
              {a.byDay.map(([day, cents]) => (
                <div key={day} className="group relative flex-1">
                  <div className="w-full rounded-t-[4px] bg-forest transition-colors group-hover:bg-gold" style={{ height: `${Math.max(3, (cents / maxDay) * 176)}px` }} />
                  <span className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-pine px-2 py-1 text-[0.6875rem] text-ivory group-hover:block">
                    {day}: {formatMoney(cents, lang)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between text-[0.75rem] text-muted">
              <span>{a.byDay[0]?.[0]}</span>
              <span>{a.byDay[a.byDay.length - 1]?.[0]}</span>
            </div>
          </div>
        )}
      </section>
      <section>
        <SectionTitle title="Live fundraisers by cause" />
        {cats.length === 0 ? <EmptyState text={t.common.noResults} /> : (
          <ul className="panel space-y-4 p-6">
            {cats.map(([c, n]) => (
              <li key={c} className="grid grid-cols-[160px_1fr_32px] items-center gap-4 text-[0.875rem]">
                <span className="truncate text-pine">{categoryLabel(c, lang)}</span>
                <span className="h-2 rounded-full bg-sage-soft"><span className="block h-2 rounded-full bg-forest" style={{ width: `${(n / maxCat) * 100}%` }} /></span>
                <span className="text-right text-muted">{n}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

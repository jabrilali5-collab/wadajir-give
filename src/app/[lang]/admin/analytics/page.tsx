import { notFound } from "next/navigation";
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
  return (
    <div className="space-y-10">
      <h2 className="text-2xl">{t.admin.analytics}</h2>
      <dl className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[var(--radius-card)] border border-line p-5"><dt className="text-ink-soft">Donated (succeeded)</dt><dd className="text-2xl font-semibold">{formatMoney(a.totalDonated, lang)}</dd></div>
        <div className="rounded-[var(--radius-card)] border border-line p-5"><dt className="text-ink-soft">Tips</dt><dd className="text-2xl font-semibold">{formatMoney(a.totalTips, lang)}</dd></div>
        <div className="rounded-[var(--radius-card)] border border-line p-5"><dt className="text-ink-soft">Donations</dt><dd className="text-2xl font-semibold">{a.count}<span className="ml-2 text-sm font-normal text-ink-soft">{a.testCount} test-mode</span></dd></div>
      </dl>

      <section>
        <h3 className="text-xl">Donations by day (last 30 days with activity)</h3>
        {a.byDay.length === 0 ? <p className="mt-3 text-ink-soft">{t.common.noResults}</p> : (
          <ul className="mt-4 space-y-1.5">
            {a.byDay.map(([day, cents]) => (
              <li key={day} className="grid grid-cols-[90px_1fr_90px] items-center gap-3 text-sm">
                <span className="text-ink-soft">{day}</span>
                <span className="h-3 rounded-full bg-emerald" style={{ width: `${Math.max(2, (cents / maxDay) * 100)}%` }} />
                <span className="text-right">{formatMoney(cents, lang)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h3 className="text-xl">Live fundraisers by cause</h3>
        {cats.length === 0 ? <p className="mt-3 text-ink-soft">{t.common.noResults}</p> : (
          <ul className="mt-4 divide-y divide-line rounded-[var(--radius-card)] border border-line">
            {cats.map(([c, n]) => <li key={c} className="flex justify-between p-3"><span>{categoryLabel(c, lang)}</span><strong>{n}</strong></li>)}
          </ul>
        )}
      </section>
    </div>
  );
}

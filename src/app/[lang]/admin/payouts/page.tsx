import { notFound } from "next/navigation";
import { EmptyState } from "@/components/app-ui";
import { StatusPill } from "@/components/SideNav";
import { adminCampaigns } from "@/lib/admin-data";
import { setPayoutStatus } from "@/lib/actions/admin";
import { formatMoney } from "@/lib/format";
import { getDictionary, isLocale } from "@/lib/i18n";

export default async function AdminPayouts({ params }: PageProps<"/[lang]/admin/payouts">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const [live, closed] = await Promise.all([adminCampaigns("approved"), adminCampaigns("closed")]);
  const rows = [...live, ...closed].filter((c) => c.raised_cents > 0 || c.payout_status !== "not_started");
  return (
    <div className="space-y-4">
      <p className="text-[0.875rem] text-muted">Tracks payout readiness per fundraiser. Money moves in Stripe (Connect) — nothing on this page sends funds.</p>
      {rows.length === 0 ? <EmptyState text={t.common.noResults} /> : (
        <ul className="panel divide-y divide-line">
          {rows.map((c) => (
            <li key={c.id} className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
              <div className="min-w-0">
                <p className="font-medium text-pine">{c.title}</p>
                <p className="text-[0.8125rem] text-muted">{c.organizer_name} — {formatMoney(c.raised_cents, lang)} {t.common.raised}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <StatusPill status={c.payout_status} label={t.dashboard.payoutLabels[c.payout_status]} />
                <form action={setPayoutStatus} className="flex gap-2">
                  <input type="hidden" name="id" value={c.id} />
                  <label className="sr-only" htmlFor={`ps-${c.id}`}>{t.dashboard.payoutStatus}</label>
                  <select id={`ps-${c.id}`} name="payout_status" defaultValue={c.payout_status} className="field !min-h-10 !py-2 !text-[0.875rem]">
                    {Object.entries(t.dashboard.payoutLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                  <button className="btn btn-quiet btn-sm">{t.common.save}</button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

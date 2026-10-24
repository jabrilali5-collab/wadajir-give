import { notFound } from "next/navigation";
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
    <div>
      <h2 className="text-2xl">{t.admin.payouts}</h2>
      <p className="mt-2 max-w-[65ch] text-ink-soft">
        Tracks payout readiness per fundraiser. Money movement itself happens in Stripe (Connect) — nothing on this page sends funds.
      </p>
      {rows.length === 0 ? <p className="mt-8 text-ink-soft">{t.common.noResults}</p> : (
        <ul className="mt-6 space-y-3">
          {rows.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-card)] border border-line p-4">
              <div className="min-w-0">
                <p className="font-semibold">{c.title}</p>
                <p className="text-sm text-ink-soft">{c.organizer_name} — {formatMoney(c.raised_cents, lang)} raised</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusPill status={c.payout_status} label={t.dashboard.payoutLabels[c.payout_status]} />
                <form action={setPayoutStatus} className="flex gap-2">
                  <input type="hidden" name="id" value={c.id} />
                  <label className="sr-only" htmlFor={`ps-${c.id}`}>{t.dashboard.payoutStatus}</label>
                  <select id={`ps-${c.id}`} name="payout_status" defaultValue={c.payout_status} className="field !min-h-10 !py-1.5">
                    {Object.entries(t.dashboard.payoutLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                  <button className="btn btn-quiet !min-h-10">{t.common.save}</button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

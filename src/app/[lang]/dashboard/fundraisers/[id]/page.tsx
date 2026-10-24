import Link from "next/link";
import { notFound } from "next/navigation";
import { CampaignForm } from "@/components/CampaignForm";
import { UpdateForm } from "@/components/DashboardForms";
import { StatusPill } from "@/components/SideNav";
import { getCampaignById, getCampaignUpdates, requireSession } from "@/lib/data";
import { campaignDonations } from "@/lib/dashboard-data";
import { formatDate, formatMoney } from "@/lib/format";
import { getDictionary, href, isLocale } from "@/lib/i18n";

export default async function EditFundraiser({ params, searchParams }: PageProps<"/[lang]/dashboard/fundraisers/[id]">) {
  const { lang, id } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const d = t.dashboard;
  const session = await requireSession(lang, href(lang, `/dashboard/fundraisers/${id}`));
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const c = await getCampaignById(id);
  if (!c || c.organizer_id !== session.userId) notFound();
  const sp = await searchParams;
  const editable = ["draft", "pending_review", "rejected"].includes(c.status);
  const [updates, donations] = await Promise.all([getCampaignUpdates(c.id), campaignDonations(c.id)]);

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl">{c.title}</h2>
        <StatusPill status={c.status} label={d.statusLabels[c.status]} />
      </div>
      {sp.saved && (
        <p role="status" className="rounded-[var(--radius-control)] bg-mist p-3 text-emerald-deep">
          {sp.saved === "submit" ? t.start.submitted : d.saved}
        </p>
      )}
      {c.review_note && c.status === "rejected" && <p className="rounded-[var(--radius-control)] bg-warn-bg p-3 text-warn">{c.review_note}</p>}

      <dl className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[var(--radius-card)] border border-line p-4"><dt className="text-sm text-ink-soft">{t.common.raised}</dt><dd className="text-2xl font-semibold">{formatMoney(c.raised_cents, lang)}</dd></div>
        <div className="rounded-[var(--radius-card)] border border-line p-4"><dt className="text-sm text-ink-soft">{t.common.donors}</dt><dd className="text-2xl font-semibold">{c.donor_count}</dd></div>
        <div className="rounded-[var(--radius-card)] border border-line p-4"><dt className="text-sm text-ink-soft">{d.payoutStatus}</dt><dd className="mt-1"><StatusPill status={c.payout_status} label={d.payoutLabels[c.payout_status]} /></dd></div>
      </dl>

      <Link href={href(lang, `/fundraisers/${c.slug}`)} className="btn btn-secondary">{d.view}</Link>

      {editable ? (
        <section>
          <h3 className="mb-4 text-xl">{d.edit}</h3>
          <CampaignForm t={t} locale={lang} campaign={c} />
        </section>
      ) : (
        <section>
          <h3 className="text-xl">{d.postUpdate}</h3>
          <div className="mt-4"><UpdateForm t={t} locale={lang} campaignId={c.id} /></div>
          {updates.length > 0 && (
            <ol className="mt-6 space-y-4">
              {updates.map((u) => (
                <li key={u.id} className="border-l-2 border-emerald pl-4">
                  <time className="text-sm text-ink-soft">{formatDate(u.created_at, lang)}</time>
                  <p className="whitespace-pre-line">{u.body}</p>
                </li>
              ))}
            </ol>
          )}
        </section>
      )}

      <section>
        <h3 className="text-xl">{t.campaign.recentDonations}</h3>
        {donations.length ? (
          <div className="mt-4 overflow-x-auto rounded-[var(--radius-card)] border border-line">
            <table className="w-full text-left text-sm">
              <thead className="bg-mist"><tr><th className="p-3">{t.common.date}</th><th className="p-3">{t.campaign.nameLabel}</th><th className="p-3">{t.common.amount}</th><th className="p-3">{t.common.status}</th></tr></thead>
              <tbody className="divide-y divide-line">
                {donations.map((x) => (
                  <tr key={x.id}>
                    <td className="p-3">{formatDate(x.created_at, lang)}</td>
                    <td className="p-3">{x.is_anonymous ? `${t.common.anonymous} (${x.donor_name ?? "—"})` : x.donor_name ?? "—"}</td>
                    <td className="p-3">{formatMoney(x.amount_cents, lang)}</td>
                    <td className="p-3"><StatusPill status={x.status} label={x.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-3 text-ink-soft">{t.campaign.noDonations}</p>
        )}
      </section>
    </div>
  );
}

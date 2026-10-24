import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Eye } from "lucide-react";
import { CampaignForm } from "@/components/CampaignForm";
import { UpdateForm } from "@/components/DashboardForms";
import { EmptyState, SectionTitle, StatCard, TablePanel } from "@/components/app-ui";
import { StatusPill } from "@/components/SideNav";
import { getCampaignById, getCampaignUpdates, requireSession } from "@/lib/data";
import { campaignDonations } from "@/lib/dashboard-data";
import { formatDate, formatMoney, progressPercent } from "@/lib/format";
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
      <div>
        <Link href={href(lang, "/dashboard/fundraisers")} className="inline-flex items-center gap-2 text-[0.875rem] text-muted hover:text-pine">
          <ArrowLeft className="h-4 w-4" aria-hidden /> {d.myFundraisers}
        </Link>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <h2 className="t-h3 max-w-[30ch]">{c.title}</h2>
          <div className="flex items-center gap-3">
            <StatusPill status={c.status} label={d.statusLabels[c.status]} />
            <Link href={href(lang, `/fundraisers/${c.slug}`)} className="btn btn-secondary btn-sm"><Eye aria-hidden /> {d.view}</Link>
          </div>
        </div>
      </div>

      {sp.saved && <p role="status" className="alert alert-ok">{sp.saved === "submit" ? t.start.submitted : d.saved}</p>}
      {c.review_note && c.status === "rejected" && <p className="alert alert-warn">{c.review_note}</p>}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label={t.common.raised} value={formatMoney(c.raised_cents, lang)} hint={`${progressPercent(c.raised_cents, c.goal_cents)}% — ${t.common.goal} ${formatMoney(c.goal_cents, lang)}`} />
        <StatCard label={t.common.donors} value={String(c.donor_count)} />
        <div className="panel p-5 md:p-6">
          <p className="text-[0.8125rem] text-muted">{d.payoutStatus}</p>
          <div className="mt-4"><StatusPill status={c.payout_status} label={d.payoutLabels[c.payout_status]} /></div>
        </div>
      </div>

      {editable ? (
        <section className="panel p-6 md:p-10">
          <CampaignForm t={t} locale={lang} campaign={c} />
        </section>
      ) : (
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="panel p-6">
            <SectionTitle title={d.postUpdate} />
            <UpdateForm t={t} locale={lang} campaignId={c.id} />
          </div>
          <div className="panel p-6">
            <SectionTitle title={t.campaign.updates} />
            {updates.length ? (
              <ol className="space-y-5">
                {updates.map((u) => (
                  <li key={u.id} className="border-l border-line-strong pl-4">
                    <time className="text-[0.75rem] text-muted">{formatDate(u.created_at, lang)}</time>
                    <p className="mt-1 whitespace-pre-line text-[0.9375rem]">{u.body}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-[0.9375rem] text-muted">{t.campaign.noUpdates}</p>
            )}
          </div>
        </section>
      )}

      <section>
        <SectionTitle title={t.campaign.recentDonations} />
        {donations.length ? (
          <TablePanel>
            <table className="table">
              <thead><tr><th>{t.common.date}</th><th>{t.campaign.nameLabel}</th><th>{t.common.amount}</th><th>{t.common.status}</th></tr></thead>
              <tbody>
                {donations.map((x) => (
                  <tr key={x.id}>
                    <td className="whitespace-nowrap">{formatDate(x.created_at, lang)}</td>
                    <td>{x.is_anonymous ? `${t.common.anonymous} (${x.donor_name ?? "—"})` : x.donor_name ?? "—"}</td>
                    <td className="whitespace-nowrap">{formatMoney(x.amount_cents, lang)}</td>
                    <td><StatusPill status={x.status} label={x.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TablePanel>
        ) : (
          <EmptyState text={t.campaign.noDonations} />
        )}
      </section>
    </div>
  );
}

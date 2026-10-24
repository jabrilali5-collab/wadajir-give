import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusPill } from "@/components/SideNav";
import { adminReports } from "@/lib/admin-data";
import { decideReport, reviewCampaign } from "@/lib/actions/admin";
import { formatDate } from "@/lib/format";
import { getDictionary, href, isLocale } from "@/lib/i18n";

export default async function AdminReports({ params }: PageProps<"/[lang]/admin/reports">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const rows = await adminReports();
  return (
    <div>
      <h2 className="text-2xl">{t.admin.reports}</h2>
      {rows.length === 0 ? <p className="mt-8 text-ink-soft">{t.common.noResults}</p> : (
        <ul className="mt-6 space-y-3">
          {rows.map((r) => (
            <li key={r.id} className="rounded-[var(--radius-card)] border border-line p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold">{t.campaign.reportReasons[r.reason as keyof typeof t.campaign.reportReasons] ?? r.reason}</p>
                  {r.campaigns && <Link href={href(lang, `/fundraisers/${r.campaigns.slug}`)} className="text-sm text-teal hover:underline">{r.campaigns.title}</Link>}
                  <p className="text-sm text-ink-soft">{formatDate(r.created_at, lang)}</p>
                  {r.details && <p className="mt-2 whitespace-pre-line text-sm">{r.details}</p>}
                </div>
                <StatusPill status={r.status} label={r.status} />
              </div>
              {["open", "reviewing"].includes(r.status) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <form action={decideReport} className="flex flex-wrap gap-2">
                    <input type="hidden" name="id" value={r.id} />
                    {r.status === "open" && <button name="status" value="reviewing" className="btn btn-quiet">Start review</button>}
                    <button name="status" value="resolved" className="btn btn-secondary">{t.admin.resolve}</button>
                    <button name="status" value="dismissed" className="btn btn-quiet">{t.admin.dismiss}</button>
                  </form>
                  {r.campaigns?.status === "approved" && (
                    <form action={reviewCampaign}>
                      <input type="hidden" name="id" value={r.campaign_id} />
                      <input type="hidden" name="note" value="Paused while a report is reviewed." />
                      <button name="decision" value="paused" className="btn btn-danger">{t.admin.pause} fundraiser</button>
                    </form>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

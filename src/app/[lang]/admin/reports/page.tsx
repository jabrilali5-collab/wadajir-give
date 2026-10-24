import Link from "next/link";
import { notFound } from "next/navigation";
import { Pause } from "lucide-react";
import { EmptyState } from "@/components/app-ui";
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
  return rows.length === 0 ? (
    <EmptyState text={t.common.noResults} />
  ) : (
    <ul className="space-y-4">
      {rows.map((r) => (
        <li key={r.id} className={`panel p-5 ${r.status === "open" ? "border-l-4 !border-l-gold" : ""}`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-medium text-pine">{t.campaign.reportReasons[r.reason as keyof typeof t.campaign.reportReasons] ?? r.reason}</p>
              <p className="mt-1 text-[0.8125rem] text-muted">
                {formatDate(r.created_at, lang)}
                {r.campaigns && (
                  <> — <Link href={href(lang, `/fundraisers/${r.campaigns.slug}`)} className="link">{r.campaigns.title}</Link></>
                )}
              </p>
              {r.details && <p className="mt-3 max-w-[70ch] whitespace-pre-line text-[0.9375rem]">{r.details}</p>}
            </div>
            <StatusPill status={r.status} label={r.status} />
          </div>
          {["open", "reviewing"].includes(r.status) && (
            <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
              <form action={decideReport} className="flex flex-wrap gap-2">
                <input type="hidden" name="id" value={r.id} />
                {r.status === "open" && <button name="status" value="reviewing" className="btn btn-quiet btn-sm">Start review</button>}
                <button name="status" value="resolved" className="btn btn-secondary btn-sm">{t.admin.resolve}</button>
                <button name="status" value="dismissed" className="btn btn-sm text-muted hover:bg-sage-soft">{t.admin.dismiss}</button>
              </form>
              {r.campaigns?.status === "approved" && (
                <form action={reviewCampaign}>
                  <input type="hidden" name="id" value={r.campaign_id} />
                  <input type="hidden" name="note" value="Paused while a report is reviewed." />
                  <button name="decision" value="paused" className="btn btn-danger btn-sm"><Pause aria-hidden /> {t.admin.pause}</button>
                </form>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

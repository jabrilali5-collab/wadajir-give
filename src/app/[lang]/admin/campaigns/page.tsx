import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusPill } from "@/components/SideNav";
import { adminCampaigns } from "@/lib/admin-data";
import { reviewCampaign } from "@/lib/actions/admin";
import { categoryLabel } from "@/lib/categories";
import { formatDate, formatMoney } from "@/lib/format";
import { getDictionary, href, isLocale } from "@/lib/i18n";
import type { CampaignStatus } from "@/lib/types";

const STATUSES: CampaignStatus[] = ["pending_review", "approved", "rejected", "paused", "draft", "closed"];

export default async function AdminCampaigns({ params, searchParams }: PageProps<"/[lang]/admin/campaigns">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const sp = await searchParams;
  const status = (STATUSES as string[]).includes(String(sp.status)) ? (sp.status as CampaignStatus) : "pending_review";
  const campaigns = await adminCampaigns(status);
  const base = href(lang, "/admin/campaigns");

  return (
    <div>
      <h2 className="text-2xl">{t.admin.review}</h2>
      <nav aria-label="Filter by status" className="mt-4 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <Link key={s} href={`${base}?status=${s}`} aria-current={s === status ? "page" : undefined}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold ${s === status ? "bg-teal text-white" : "border border-line text-ink-soft"}`}>
            {t.dashboard.statusLabels[s]}
          </Link>
        ))}
      </nav>

      {campaigns.length === 0 ? (
        <p className="mt-8 text-ink-soft">{t.common.noResults}</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {campaigns.map((c) => (
            <li key={c.id} className="rounded-[var(--radius-card)] border border-line p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-lg"><Link href={href(lang, `/fundraisers/${c.slug}`)} className="hover:text-teal">{c.title}</Link></h3>
                  <p className="text-sm text-ink-soft">
                    {c.organizer_name}{c.organizer_verified ? " (verified)" : ""} for {c.beneficiary_name} ({c.beneficiary_relationship}) — {categoryLabel(c.category, "en")} — goal {formatMoney(c.goal_cents, lang)}
                  </p>
                  <p className="text-sm text-ink-soft">
                    {[c.city, c.country].filter(Boolean).join(", ")} — submitted {c.submitted_at ? formatDate(c.submitted_at, lang) : "—"}
                  </p>
                </div>
                <StatusPill status={c.status} label={t.dashboard.statusLabels[c.status]} />
              </div>
              <details className="mt-3">
                <summary className="cursor-pointer text-sm font-semibold text-teal">{t.campaign.story}</summary>
                <p className="mt-2 max-w-[70ch] whitespace-pre-line text-sm">{c.story}</p>
              </details>
              <form action={reviewCampaign} className="mt-4 space-y-3 border-t border-line pt-4">
                <input type="hidden" name="id" value={c.id} />
                <label className="block">
                  <span className="field-label">{t.admin.reason}</span>
                  <input name="note" maxLength={1000} defaultValue={c.review_note ?? ""} className="field" />
                </label>
                <div className="flex flex-wrap gap-2">
                  {c.status !== "approved" && <button name="decision" value="approved" className="btn btn-primary">{t.admin.approve}</button>}
                  {c.status !== "rejected" && <button name="decision" value="rejected" className="btn btn-secondary">{t.admin.reject}</button>}
                  {c.status === "approved" && <button name="decision" value="paused" className="btn btn-danger">{t.admin.pause}</button>}
                  {c.status === "approved" && <button name="decision" value="closed" className="btn btn-quiet">Close</button>}
                </div>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

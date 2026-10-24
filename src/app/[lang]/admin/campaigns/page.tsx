import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Eye, Pause, Undo2, X } from "lucide-react";
import { EmptyState } from "@/components/app-ui";
import { CampaignCover } from "@/components/campaign-ui";
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
      <nav aria-label="Filter by status" className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:px-0">
        <ul className="flex gap-2 whitespace-nowrap">
          {STATUSES.map((s) => (
            <li key={s}>
              <Link
                href={`${base}?status=${s}`}
                aria-current={s === status ? "page" : undefined}
                className={`inline-flex h-9 items-center rounded-full px-4 text-[0.8125rem] ${s === status ? "bg-forest text-ivory" : "border border-line-strong text-muted hover:text-pine"}`}
              >
                {t.dashboard.statusLabels[s]}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-6">
        {campaigns.length === 0 ? (
          <EmptyState text={t.common.noResults} />
        ) : (
          <ul className="space-y-4">
            {campaigns.map((c) => (
              <li key={c.id} className="panel overflow-hidden">
                <div className="grid sm:grid-cols-[180px_1fr]">
                  <CampaignCover campaign={c} className="aspect-[16/9] sm:aspect-auto sm:h-full" sizes="180px" />
                  <div className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-sans text-[1.0625rem] font-semibold text-pine">{c.title}</h3>
                        <p className="mt-1 text-[0.8125rem] text-muted">
                          {c.organizer_name}{c.organizer_verified ? " (verified)" : ""} for {c.beneficiary_name} ({c.beneficiary_relationship})
                        </p>
                      </div>
                      <StatusPill status={c.status} label={t.dashboard.statusLabels[c.status]} />
                    </div>
                    <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-[0.8125rem] sm:grid-cols-4">
                      <div><dt className="text-muted">Cause</dt><dd className="text-pine">{categoryLabel(c.category, "en")}</dd></div>
                      <div><dt className="text-muted">Goal</dt><dd className="text-pine">{formatMoney(c.goal_cents, lang)}</dd></div>
                      <div><dt className="text-muted">Place</dt><dd className="text-pine">{[c.city, c.country].filter(Boolean).join(", ") || "—"}</dd></div>
                      <div><dt className="text-muted">Submitted</dt><dd className="text-pine">{c.submitted_at ? formatDate(c.submitted_at, lang) : "—"}</dd></div>
                    </dl>
                    <details className="mt-4">
                      <summary className="cursor-pointer text-[0.8125rem] font-medium text-forest">{t.campaign.story}</summary>
                      <p className="mt-3 max-w-[70ch] whitespace-pre-line text-[0.9375rem] leading-relaxed">{c.story}</p>
                    </details>
                  </div>
                </div>
                <form action={reviewCampaign} className="grid gap-3 border-t border-line bg-paper p-5 md:grid-cols-[1fr_auto] md:items-end">
                  <input type="hidden" name="id" value={c.id} />
                  <label className="block">
                    <span className="field-label">{t.admin.reason}</span>
                    <input name="note" maxLength={1000} defaultValue={c.review_note ?? ""} className="field" />
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <Link href={href(lang, `/fundraisers/${c.slug}`)} className="btn btn-sm text-forest hover:bg-sage-soft"><Eye aria-hidden /> View</Link>
                    {c.status !== "approved" && <button name="decision" value="approved" className="btn btn-primary btn-sm"><Check aria-hidden /> {t.admin.approve}</button>}
                    {c.status !== "rejected" && c.status !== "approved" && <button name="decision" value="rejected" className="btn btn-secondary btn-sm"><Undo2 aria-hidden /> {t.admin.reject}</button>}
                    {c.status === "approved" && <button name="decision" value="paused" className="btn btn-danger btn-sm"><Pause aria-hidden /> {t.admin.pause}</button>}
                    {c.status === "approved" && <button name="decision" value="closed" className="btn btn-secondary btn-sm"><X aria-hidden /> Close</button>}
                  </div>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

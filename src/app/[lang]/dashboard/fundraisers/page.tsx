import Link from "next/link";
import { notFound } from "next/navigation";
import { Eye, Pencil } from "lucide-react";
import { EmptyState, SectionTitle } from "@/components/app-ui";
import { CampaignCover, Progress } from "@/components/campaign-ui";
import { StatusPill } from "@/components/SideNav";
import { requireSession } from "@/lib/data";
import { myCampaigns } from "@/lib/dashboard-data";
import { formatDate, formatMoney } from "@/lib/format";
import { getDictionary, href, isLocale } from "@/lib/i18n";

export default async function MyFundraisers({ params }: PageProps<"/[lang]/dashboard/fundraisers">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const d = t.dashboard;
  const session = await requireSession(lang, href(lang, "/dashboard/fundraisers"));
  const campaigns = await myCampaigns(session.userId);
  return (
    <section>
      <SectionTitle title={d.myFundraisers} />
      {campaigns.length === 0 ? (
        <EmptyState text={d.noFundraisers} href={href(lang, "/start")} cta={t.nav.start} />
      ) : (
        <ul className="space-y-4">
          {campaigns.map((c) => (
            <li key={c.id} className="panel grid overflow-hidden sm:grid-cols-[200px_1fr]">
              <CampaignCover campaign={c} className="aspect-[16/9] sm:aspect-auto sm:h-full" sizes="200px" />
              <div className="flex flex-col gap-4 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-sans text-[1.0625rem] font-semibold text-pine">{c.title}</h3>
                    <p className="mt-1 text-[0.8125rem] text-muted">{t.common.created} {formatDate(c.created_at, lang)}</p>
                  </div>
                  <StatusPill status={c.status} label={d.statusLabels[c.status]} />
                </div>
                {c.status === "rejected" && c.review_note && <p className="alert alert-warn text-[0.875rem]">{c.review_note}</p>}
                <div className="space-y-2">
                  <Progress raised={c.raised_cents} goal={c.goal_cents} label={c.title} />
                  <p className="text-[0.8125rem] text-muted">
                    <span className="text-pine">{formatMoney(c.raised_cents, lang)}</span> {t.common.raised} — {t.common.goal} {formatMoney(c.goal_cents, lang)}
                  </p>
                </div>
                <div className="mt-auto flex gap-2">
                  <Link href={href(lang, `/dashboard/fundraisers/${c.id}`)} className="btn btn-secondary btn-sm"><Pencil aria-hidden /> {d.edit}</Link>
                  <Link href={href(lang, `/fundraisers/${c.slug}`)} className="btn btn-sm text-forest hover:bg-sage-soft"><Eye aria-hidden /> {d.view}</Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

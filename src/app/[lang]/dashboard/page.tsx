import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { EmptyState, SectionTitle, StatCard } from "@/components/app-ui";
import { Progress } from "@/components/campaign-ui";
import { StatusPill } from "@/components/SideNav";
import { VerificationRequest } from "@/components/DashboardForms";
import { requireSession } from "@/lib/data";
import { myCampaigns, myDonations, myVerification } from "@/lib/dashboard-data";
import { formatDate, formatMoney } from "@/lib/format";
import { getDictionary, href, isLocale } from "@/lib/i18n";

export default async function DashboardHome({ params }: PageProps<"/[lang]/dashboard">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const d = t.dashboard;
  const session = await requireSession(lang, href(lang, "/dashboard"));
  const [campaigns, donations, verification] = await Promise.all([
    myCampaigns(session.userId),
    myDonations(session.userId),
    myVerification(session.userId),
  ]);
  const raised = campaigns.reduce((s, c) => s + c.raised_cents, 0);
  const succeeded = donations.filter((x) => x.status === "succeeded");
  const given = succeeded.reduce((s, x) => s + x.amount_cents, 0);
  const live = campaigns.filter((c) => c.status === "approved").length;

  return (
    <div className="space-y-10">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label={d.totalRaised} value={formatMoney(raised, lang)} />
        <StatCard label={d.totalGiven} value={formatMoney(given, lang)} hint={`${succeeded.length} ${t.common.donors}`} />
        <StatCard label={d.myFundraisers} value={String(campaigns.length)} hint={`${live} ${d.statusLabels.approved.toLowerCase()}`} />
      </div>

      <section>
        <SectionTitle
          title={d.myFundraisers}
          action={
            campaigns.length > 0 && (
              <Link href={href(lang, "/dashboard/fundraisers")} className="link text-[0.875rem]">{t.common.seeAll}</Link>
            )
          }
        />
        {campaigns.length ? (
          <ul className="panel divide-y divide-line">
            {campaigns.slice(0, 5).map((c) => (
              <li key={c.id}>
                <Link href={href(lang, `/dashboard/fundraisers/${c.id}`)} className="group grid gap-3 p-5 transition-colors hover:bg-paper sm:grid-cols-[1fr_200px_150px] sm:items-center sm:gap-8">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-pine">{c.title}</p>
                    <p className="mt-1 text-[0.8125rem] text-muted">{t.common.created} {formatDate(c.created_at, lang)}</p>
                  </div>
                  <div className="space-y-2">
                    <Progress raised={c.raised_cents} goal={c.goal_cents} label={c.title} />
                    <p className="text-[0.75rem] text-muted">
                      {formatMoney(c.raised_cents, lang)} / {formatMoney(c.goal_cents, lang)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 sm:justify-end">
                    <StatusPill status={c.status} label={d.statusLabels[c.status]} />
                    <ArrowRight className="hidden h-4 w-4 text-muted transition-transform group-hover:translate-x-0.5 sm:block" aria-hidden />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState text={d.noFundraisers} href={href(lang, "/start")} cta={t.nav.start} />
        )}
      </section>

      <section className="panel grid gap-6 p-6 md:grid-cols-[1fr_1.2fr] md:p-8">
        <div>
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold-soft text-[#6b5226]">
            <BadgeCheck className="h-5 w-5" strokeWidth={1.6} aria-hidden />
          </span>
          <h2 className="t-h3 mt-5">{d.verification}</h2>
          <p className="mt-3 text-[0.9375rem] text-muted">{d.verificationHint}</p>
        </div>
        <div className="md:pt-2">
          {session.profile?.is_verified_organizer ? (
            <StatusPill status="approved" label={t.common.verifiedOrganizer} />
          ) : verification && ["requested", "in_review"].includes(verification.status) ? (
            <StatusPill status="requested" label={verification.status === "requested" ? "Requested" : "In review"} />
          ) : (
            <VerificationRequest t={t} />
          )}
        </div>
      </section>
    </div>
  );
}

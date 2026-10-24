import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusPill } from "@/components/SideNav";
import { VerificationRequest } from "@/components/DashboardForms";
import { requireSession } from "@/lib/data";
import { myCampaigns, myDonations, myVerification } from "@/lib/dashboard-data";
import { formatMoney } from "@/lib/format";
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
  const given = donations.filter((x) => x.status === "succeeded").reduce((s, x) => s + x.amount_cents, 0);

  return (
    <div className="space-y-10">
      <dl className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[var(--radius-card)] border border-line p-5">
          <dt className="text-ink-soft">{d.totalRaised}</dt>
          <dd className="mt-1 font-[family-name:var(--font-display)] text-3xl font-semibold">{formatMoney(raised, lang)}</dd>
        </div>
        <div className="rounded-[var(--radius-card)] border border-line p-5">
          <dt className="text-ink-soft">{d.totalGiven}</dt>
          <dd className="mt-1 font-[family-name:var(--font-display)] text-3xl font-semibold">{formatMoney(given, lang)}</dd>
        </div>
      </dl>

      <section>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl">{d.myFundraisers}</h2>
          <Link href={href(lang, "/start")} className="btn btn-primary">{t.nav.start}</Link>
        </div>
        {campaigns.length ? (
          <ul className="mt-4 divide-y divide-line rounded-[var(--radius-card)] border border-line">
            {campaigns.slice(0, 5).map((c) => (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <Link href={href(lang, `/dashboard/fundraisers/${c.id}`)} className="font-semibold hover:text-teal">{c.title}</Link>
                  <p className="text-sm text-ink-soft">{formatMoney(c.raised_cents, lang)} / {formatMoney(c.goal_cents, lang)}</p>
                </div>
                <StatusPill status={c.status} label={d.statusLabels[c.status]} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-ink-soft">{d.noFundraisers}</p>
        )}
      </section>

      <section className="rounded-[var(--radius-card)] border border-line p-5">
        <h2 className="text-xl">{d.verification}</h2>
        <p className="mt-2 text-ink-soft">{d.verificationHint}</p>
        <div className="mt-4">
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

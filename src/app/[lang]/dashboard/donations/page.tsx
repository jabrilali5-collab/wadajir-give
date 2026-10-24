import Link from "next/link";
import { notFound } from "next/navigation";
import { EmptyState, SectionTitle, TablePanel } from "@/components/app-ui";
import { StatusPill } from "@/components/SideNav";
import { requireSession } from "@/lib/data";
import { myDonations } from "@/lib/dashboard-data";
import { formatDate, formatMoney } from "@/lib/format";
import { getDictionary, href, isLocale } from "@/lib/i18n";

export default async function DonationHistory({ params }: PageProps<"/[lang]/dashboard/donations">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const session = await requireSession(lang, href(lang, "/dashboard/donations"));
  const donations = await myDonations(session.userId);
  return (
    <section>
      <SectionTitle title={t.dashboard.donations} />
      {donations.length === 0 ? (
        <EmptyState text={t.dashboard.noDonations} href={href(lang, "/fundraisers")} cta={t.home.exploreCta} />
      ) : (
        <TablePanel>
          <table className="table">
            <thead>
              <tr><th>{t.common.date}</th><th>{t.campaign.donateTitle}</th><th>{t.common.amount}</th><th>{t.common.status}</th><th>{t.donate.receipt}</th></tr>
            </thead>
            <tbody>
              {donations.map((x) => (
                <tr key={x.id}>
                  <td className="whitespace-nowrap">{formatDate(x.created_at, lang)}</td>
                  <td className="min-w-[200px]">
                    {x.campaign_slug ? <Link className="link" href={href(lang, `/fundraisers/${x.campaign_slug}`)}>{x.campaign_title}</Link> : "—"}
                  </td>
                  <td className="whitespace-nowrap">
                    {formatMoney(x.amount_cents, lang)}
                    {x.tip_cents > 0 && <span className="block text-[0.75rem] text-muted">+ {formatMoney(x.tip_cents, lang)} tip</span>}
                  </td>
                  <td className="whitespace-nowrap">
                    <StatusPill status={x.status} label={x.status} />
                    {!x.livemode && <span className="ml-2 text-[0.75rem] text-warn">test</span>}
                  </td>
                  <td className="whitespace-nowrap text-muted">#{x.id.slice(0, 8).toUpperCase()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TablePanel>
      )}
    </section>
  );
}

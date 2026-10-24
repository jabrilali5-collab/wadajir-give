import Link from "next/link";
import { notFound } from "next/navigation";
import { EmptyState, TablePanel } from "@/components/app-ui";
import { StatusPill } from "@/components/SideNav";
import { adminDonations } from "@/lib/admin-data";
import { formatDate, formatMoney } from "@/lib/format";
import { getDictionary, href, isLocale } from "@/lib/i18n";

export default async function AdminDonations({ params }: PageProps<"/[lang]/admin/donations">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const rows = await adminDonations();
  const large = 100000;
  return (
    <div className="space-y-4">
      <p className="text-[0.875rem] text-muted">Latest 200. Gifts of $1,000 or more are highlighted for a second look.</p>
      {rows.length === 0 ? <EmptyState text={t.common.noResults} /> : (
        <TablePanel>
          <table className="table">
            <thead><tr><th>Date</th><th>Fundraiser</th><th>Donor</th><th>Amount</th><th>Tip</th><th>Status</th><th>Mode</th></tr></thead>
            <tbody>
              {rows.map((d) => (
                <tr key={d.id} className={d.amount_cents >= large ? "bg-gold-soft/50" : undefined}>
                  <td className="whitespace-nowrap">{formatDate(d.created_at, lang)}</td>
                  <td className="min-w-[180px]">{d.campaign_slug ? <Link className="link" href={href(lang, `/fundraisers/${d.campaign_slug}`)}>{d.campaign_title}</Link> : "—"}</td>
                  <td>{d.donor_name ?? "—"}<span className="block text-[0.75rem] text-muted">{d.donor_email}</span></td>
                  <td className="whitespace-nowrap font-medium text-pine">{formatMoney(d.amount_cents, lang)}</td>
                  <td className="whitespace-nowrap">{formatMoney(d.tip_cents, lang)}</td>
                  <td><StatusPill status={d.status} label={d.status} /></td>
                  <td>{d.livemode ? "live" : "test"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TablePanel>
      )}
    </div>
  );
}

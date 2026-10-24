import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusPill } from "@/components/SideNav";
import { adminDonations } from "@/lib/admin-data";
import { formatDate, formatMoney } from "@/lib/format";
import { getDictionary, href, isLocale } from "@/lib/i18n";

export default async function AdminDonations({ params }: PageProps<"/[lang]/admin/donations">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const rows = await adminDonations();
  const large = 100000; // flag donations of $1,000+ for a second look
  return (
    <div>
      <h2 className="text-2xl">{t.admin.donations}</h2>
      <p className="mt-2 text-ink-soft">Latest 200. Donations of $1,000 or more are highlighted for review.</p>
      {rows.length === 0 ? <p className="mt-8 text-ink-soft">{t.common.noResults}</p> : (
        <div className="mt-6 overflow-x-auto rounded-[var(--radius-card)] border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-mist"><tr><th className="p-3">Date</th><th className="p-3">Fundraiser</th><th className="p-3">Donor</th><th className="p-3">Amount</th><th className="p-3">Tip</th><th className="p-3">Status</th><th className="p-3">Mode</th></tr></thead>
            <tbody className="divide-y divide-line">
              {rows.map((d) => (
                <tr key={d.id} className={d.amount_cents >= large ? "bg-warn-bg" : undefined}>
                  <td className="p-3 whitespace-nowrap">{formatDate(d.created_at, lang)}</td>
                  <td className="p-3">{d.campaign_slug ? <Link className="text-teal hover:underline" href={href(lang, `/fundraisers/${d.campaign_slug}`)}>{d.campaign_title}</Link> : "—"}</td>
                  <td className="p-3">{d.donor_name ?? "—"}<br /><span className="text-ink-soft">{d.donor_email}</span></td>
                  <td className="p-3">{formatMoney(d.amount_cents, lang)}</td>
                  <td className="p-3">{formatMoney(d.tip_cents, lang)}</td>
                  <td className="p-3"><StatusPill status={d.status} label={d.status} /></td>
                  <td className="p-3">{d.livemode ? "live" : "test"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

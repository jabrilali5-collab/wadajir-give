import Link from "next/link";
import { notFound } from "next/navigation";
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
      <h2 className="text-2xl">{t.dashboard.donations}</h2>
      {donations.length === 0 ? (
        <p className="mt-6 text-ink-soft">{t.dashboard.noDonations}</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-[var(--radius-card)] border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-mist">
              <tr><th className="p-3">{t.common.date}</th><th className="p-3">{t.campaign.category}</th><th className="p-3">{t.common.amount}</th><th className="p-3">{t.common.status}</th><th className="p-3">Ref</th></tr>
            </thead>
            <tbody className="divide-y divide-line">
              {donations.map((x) => (
                <tr key={x.id}>
                  <td className="p-3 whitespace-nowrap">{formatDate(x.created_at, lang)}</td>
                  <td className="p-3">{x.campaign_slug ? <Link className="text-teal hover:underline" href={href(lang, `/fundraisers/${x.campaign_slug}`)}>{x.campaign_title}</Link> : "—"}</td>
                  <td className="p-3 whitespace-nowrap">{formatMoney(x.amount_cents, lang)}{x.tip_cents > 0 && <span className="text-ink-soft"> + {formatMoney(x.tip_cents, lang)} tip</span>}</td>
                  <td className="p-3"><StatusPill status={x.status} label={x.status} />{!x.livemode && <span className="ml-1 text-xs text-warn">test</span>}</td>
                  <td className="p-3 font-mono text-xs">{x.id.slice(0, 8).toUpperCase()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { adminCounts } from "@/lib/admin-data";
import { getDictionary, href, isLocale } from "@/lib/i18n";

export default async function AdminHome({ params }: PageProps<"/[lang]/admin">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const c = await adminCounts();
  const base = href(lang, "/admin");
  const tiles = [
    { label: "Waiting for review", value: c.pending, link: `${base}/campaigns?status=pending_review`, urgent: c.pending > 0 },
    { label: "Open reports", value: c.openReports, link: `${base}/reports`, urgent: c.openReports > 0 },
    { label: "Verification requests", value: c.verifications, link: `${base}/verification`, urgent: c.verifications > 0 },
    { label: "Live fundraisers", value: c.live, link: `${base}/campaigns?status=approved` },
    { label: "Successful donations", value: c.donations, link: `${base}/donations` },
    { label: "Users", value: c.users, link: `${base}/users` },
  ];
  return (
    <div>
      <h2 className="text-2xl">{t.admin.overview}</h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tiles.map((tile) => (
          <li key={tile.label}>
            <Link href={tile.link} className={`block rounded-[var(--radius-card)] border p-5 hover:border-teal ${tile.urgent ? "border-[#e8c98a] bg-warn-bg" : "border-line"}`}>
              <span className="block text-ink-soft">{tile.label}</span>
              <span className="mt-1 block font-[family-name:var(--font-display)] text-3xl font-semibold">{tile.value}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

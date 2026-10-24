import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { SectionTitle, StatCard } from "@/components/app-ui";
import { adminCounts } from "@/lib/admin-data";
import { getDictionary, href, isLocale } from "@/lib/i18n";

export default async function AdminHome({ params }: PageProps<"/[lang]/admin">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const c = await adminCounts();
  const base = href(lang, "/admin");
  const queues = [
    { label: "Waiting for review", value: c.pending, link: `${base}/campaigns?status=pending_review` },
    { label: "Open reports", value: c.openReports, link: `${base}/reports` },
    { label: "Verification requests", value: c.verifications, link: `${base}/verification` },
  ];
  return (
    <div className="space-y-10">
      <section>
        <SectionTitle title="Needs attention" />
        <ul className="grid gap-4 md:grid-cols-3">
          {queues.map((q) => (
            <li key={q.label}>
              <Link
                href={q.link}
                className={`panel group flex h-full flex-col justify-between gap-6 p-6 transition-colors hover:border-forest ${q.value > 0 ? "!border-gold/60 !bg-gold-soft/40" : ""}`}
              >
                <span className="text-[0.875rem] text-muted">{q.label}</span>
                <span className="flex items-end justify-between">
                  <span className="font-serif text-[3rem] leading-none text-pine">{q.value}</span>
                  <ArrowRight className="h-5 w-5 text-forest transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <SectionTitle title={t.admin.overview} />
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Live fundraisers" value={String(c.live)} />
          <StatCard label="Successful donations" value={String(c.donations)} />
          <StatCard label="Users" value={String(c.users)} />
        </div>
      </section>
    </div>
  );
}

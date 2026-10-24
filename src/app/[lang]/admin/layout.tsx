import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AppShell } from "@/components/app-ui";
import { adminCounts } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/env";
import { getDictionary, href, isLocale } from "@/lib/i18n";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

export default async function AdminLayout({ children, params }: LayoutProps<"/[lang]/admin">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  if (!isSupabaseConfigured) return <div className="wrap py-24"><p className="t-h3">{t.auth.notConfigured}</p></div>;
  await requireAdmin(lang);
  const c = await adminCounts();
  const a = t.admin;
  const base = href(lang, "/admin");
  return (
    <AppShell
      eyebrow="Wadajir Give"
      title={a.title}
      navLabel={a.title}
      nav={[
        { href: base, label: a.overview, icon: "overview", exact: true },
        { href: `${base}/campaigns`, label: a.review, icon: "review", count: c.pending },
        { href: `${base}/verification`, label: a.verification, icon: "verification", count: c.verifications },
        { href: `${base}/reports`, label: a.reports, icon: "reports", count: c.openReports },
        { href: `${base}/donations`, label: a.donations, icon: "donations" },
        { href: `${base}/payouts`, label: a.payouts, icon: "payouts" },
        { href: `${base}/users`, label: a.users, icon: "users" },
        { href: `${base}/analytics`, label: a.analytics, icon: "analytics" },
      ]}
    >
      {children}
    </AppShell>
  );
}

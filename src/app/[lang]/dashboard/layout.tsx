import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/app-ui";
import { requireSession } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/env";
import { getDictionary, href, isLocale } from "@/lib/i18n";

export const metadata: Metadata = { title: "Dashboard", robots: { index: false } };

export default async function DashboardLayout({ children, params }: LayoutProps<"/[lang]/dashboard">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  if (!isSupabaseConfigured) {
    return <div className="wrap py-24"><p className="t-h3">{t.auth.notConfigured}</p></div>;
  }
  const session = await requireSession(lang, href(lang, "/dashboard"));
  const d = t.dashboard;
  const first = session.profile?.full_name?.split(" ")[0] || session.email?.split("@")[0] || "";
  return (
    <AppShell
      eyebrow={`${d.welcome}, ${first}`}
      title={d.title}
      navLabel={d.title}
      nav={[
        { href: href(lang, "/dashboard"), label: d.overview, icon: "overview", exact: true },
        { href: href(lang, "/dashboard/fundraisers"), label: d.myFundraisers, icon: "fundraisers" },
        { href: href(lang, "/dashboard/donations"), label: d.donations, icon: "donations" },
        { href: href(lang, "/dashboard/settings"), label: d.settings, icon: "settings" },
      ]}
      actions={
        <Link href={href(lang, "/start")} className="btn btn-primary">
          <Plus aria-hidden /> {t.nav.start}
        </Link>
      }
    >
      {children}
    </AppShell>
  );
}

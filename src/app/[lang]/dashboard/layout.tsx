import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SideNav } from "@/components/SideNav";
import { requireSession } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/env";
import { getDictionary, href, isLocale } from "@/lib/i18n";

export const metadata: Metadata = { robots: { index: false } };

export default async function DashboardLayout({ children, params }: LayoutProps<"/[lang]/dashboard">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  if (!isSupabaseConfigured) {
    return <div className="container-page py-14"><p className="text-lg">{t.auth.notConfigured}</p></div>;
  }
  const session = await requireSession(lang, href(lang, "/dashboard"));
  const d = t.dashboard;
  return (
    <div className="container-page py-8 md:py-12">
      <h1 className="text-[2rem]">
        {d.welcome}, {session.profile?.full_name?.split(" ")[0] || session.email}
      </h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        <SideNav
          label={d.title}
          items={[
            { href: href(lang, "/dashboard"), label: d.overview, exact: true },
            { href: href(lang, "/dashboard/fundraisers"), label: d.myFundraisers },
            { href: href(lang, "/dashboard/donations"), label: d.donations },
            { href: href(lang, "/dashboard/settings"), label: d.settings },
          ]}
        />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}

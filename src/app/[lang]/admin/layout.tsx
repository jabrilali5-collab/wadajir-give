import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SideNav } from "@/components/SideNav";
import { requireAdmin } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/env";
import { getDictionary, href, isLocale } from "@/lib/i18n";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

export default async function AdminLayout({ children, params }: LayoutProps<"/[lang]/admin">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  if (!isSupabaseConfigured) return <div className="container-page py-14"><p>{t.auth.notConfigured}</p></div>;
  await requireAdmin(lang);
  const a = t.admin;
  const base = href(lang, "/admin");
  return (
    <div className="container-page py-8 md:py-12">
      <h1 className="text-[2rem]">{a.title}</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        <SideNav
          label={a.title}
          items={[
            { href: base, label: a.overview, exact: true },
            { href: `${base}/campaigns`, label: a.review },
            { href: `${base}/verification`, label: a.verification },
            { href: `${base}/reports`, label: a.reports },
            { href: `${base}/donations`, label: a.donations },
            { href: `${base}/payouts`, label: a.payouts },
            { href: `${base}/users`, label: a.users },
            { href: `${base}/analytics`, label: a.analytics },
          ]}
        />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}

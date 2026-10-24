import { notFound } from "next/navigation";
import { ProfileForm } from "@/components/DashboardForms";
import { requireSession } from "@/lib/data";
import { getDictionary, href, isLocale } from "@/lib/i18n";

export default async function SettingsPage({ params }: PageProps<"/[lang]/dashboard/settings">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const session = await requireSession(lang, href(lang, "/dashboard/settings"));
  return (
    <section>
      <h2 className="text-2xl">{t.dashboard.settings}</h2>
      <p className="mt-2 text-ink-soft">{t.auth.email}: {session.email}</p>
      <div className="mt-6"><ProfileForm t={t} profile={session.profile} /></div>
    </section>
  );
}

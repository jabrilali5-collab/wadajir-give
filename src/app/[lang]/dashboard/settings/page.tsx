import { notFound } from "next/navigation";
import { ProfileForm } from "@/components/DashboardForms";
import { SectionTitle } from "@/components/app-ui";
import { requireSession } from "@/lib/data";
import { getDictionary, href, isLocale } from "@/lib/i18n";

export default async function SettingsPage({ params }: PageProps<"/[lang]/dashboard/settings">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const session = await requireSession(lang, href(lang, "/dashboard/settings"));
  return (
    <section>
      <SectionTitle title={t.dashboard.settings} />
      <div className="panel p-6 md:p-8">
        <div className="mb-8 flex items-center gap-4 border-b border-line pb-8">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-forest font-serif text-[1.5rem] text-ivory">
            {(session.profile?.full_name || session.email || "?").slice(0, 1).toUpperCase()}
          </span>
          <div>
            <p className="font-medium text-pine">{session.profile?.full_name || "—"}</p>
            <p className="text-[0.875rem] text-muted">{session.email}</p>
          </div>
        </div>
        <ProfileForm t={t} profile={session.profile} />
      </div>
    </section>
  );
}

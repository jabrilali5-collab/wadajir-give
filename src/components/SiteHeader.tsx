import { HeaderClient } from "./HeaderClient";
import { href, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";
import type { SessionInfo } from "@/lib/data";

export function SiteHeader({ locale, t, session }: { locale: Locale; t: Dictionary; session: SessionInfo | null }) {
  const links = [
    { href: href(locale), label: t.nav.home, exact: true },
    { href: href(locale, "/about"), label: t.nav.about },
    { href: href(locale, "/fundraisers"), label: t.nav.causes },
    { href: href(locale, "/stories"), label: t.nav.stories },
    { href: href(locale, "/how-it-works"), label: t.nav.howItWorks },
  ];
  const name = session?.profile?.full_name || session?.email || "";
  return (
    <HeaderClient
      locale={locale}
      links={links}
      labels={{
        signIn: t.nav.signIn,
        getStarted: t.nav.getStarted,
        dashboard: t.nav.dashboard,
        admin: t.nav.admin,
        signOut: t.nav.signOut,
        menu: t.nav.menu,
        language: t.nav.language,
        start: t.nav.start,
        trust: t.nav.trust,
      }}
      user={
        session
          ? { initials: initials(name), name, isAdmin: session.profile?.role === "admin" }
          : null
      }
      paths={{
        home: href(locale),
        login: href(locale, "/login"),
        signup: href(locale, "/signup"),
        start: href(locale, "/start"),
        dashboard: href(locale, "/dashboard"),
        admin: href(locale, "/admin"),
        trust: href(locale, "/trust-safety"),
      }}
    />
  );
}

function initials(name: string) {
  const parts = name.replace(/@.*/, "").split(/[\s._-]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

import Link from "next/link";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { href, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";
import type { SessionInfo } from "@/lib/data";
import { signOut } from "@/lib/actions/auth";

export function SiteHeader({ locale, t, session }: { locale: Locale; t: Dictionary; session: SessionInfo | null }) {
  const links = [
    { path: "/fundraisers", label: t.nav.explore },
    { path: "/how-it-works", label: t.nav.howItWorks },
    { path: "/trust-safety", label: t.nav.trust },
    { path: "/about", label: t.nav.about },
  ];
  const isAdmin = session?.profile?.role === "admin";

  const account = session ? (
    <>
      {isAdmin && (
        <Link href={href(locale, "/admin")} className="font-semibold text-ink-soft hover:text-teal">
          {t.nav.admin}
        </Link>
      )}
      <Link href={href(locale, "/dashboard")} className="font-semibold text-ink-soft hover:text-teal">
        {t.nav.dashboard}
      </Link>
      <form action={signOut}>
        <input type="hidden" name="locale" value={locale} />
        <button className="font-semibold text-ink-soft hover:text-teal">{t.nav.signOut}</button>
      </form>
    </>
  ) : (
    <Link href={href(locale, "/login")} className="font-semibold text-ink-soft hover:text-teal">
      {t.nav.signIn}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-4">
        <Link href={href(locale)} aria-label="Wadajir Give home" className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Main" className="ml-6 hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <Link key={l.path} href={href(locale, l.path)} className="font-semibold text-ink-soft hover:text-teal">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-5 lg:flex">
          <LanguageSwitcher current={locale} label={t.nav.language} />
          {account}
          <Link href={href(locale, "/start")} className="btn btn-primary">
            {t.nav.start}
          </Link>
        </div>

        {/* Mobile: language + menu (works without JavaScript) */}
        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <LanguageSwitcher current={locale} label={t.nav.language} />
          <details className="group relative">
            <summary
              className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-[var(--radius-control)] border border-line [&::-webkit-details-marker]:hidden"
              aria-label={t.nav.menu}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </summary>
            <div className="absolute right-0 top-13 w-[min(88vw,320px)] rounded-[var(--radius-card)] border border-line bg-white p-4 shadow-lg">
              <nav aria-label="Mobile" className="flex flex-col gap-3">
                {links.map((l) => (
                  <Link key={l.path} href={href(locale, l.path)} className="py-1 font-semibold text-ink">
                    {l.label}
                  </Link>
                ))}
                <hr className="border-line" />
                <div className="flex flex-col items-start gap-3">{account}</div>
                <Link href={href(locale, "/start")} className="btn btn-primary mt-2 w-full">
                  {t.nav.start}
                </Link>
              </nav>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}

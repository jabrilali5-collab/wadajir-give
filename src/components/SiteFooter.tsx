import Link from "next/link";
import { Logo } from "./Logo";
import { href, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";

export function SiteFooter({ locale, t }: { locale: Locale; t: Dictionary }) {
  const cols = [
    {
      title: t.footer.platform,
      links: [
        { path: "/fundraisers", label: t.nav.explore },
        { path: "/start", label: t.nav.start },
        { path: "/how-it-works", label: t.nav.howItWorks },
      ],
    },
    {
      title: t.footer.company,
      links: [
        { path: "/about", label: t.nav.about },
        { path: "/trust-safety", label: t.nav.trust },
        { path: "/faq", label: t.footer.faq },
        { path: "/contact", label: t.footer.contact },
      ],
    },
    {
      title: t.footer.legal,
      links: [
        { path: "/terms", label: t.footer.terms },
        { path: "/privacy", label: t.footer.privacy },
      ],
    },
  ];
  return (
    <footer className="mt-24 border-t border-line">
      <div className="weave h-3" aria-hidden="true" />
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-ink-soft">{t.footer.tagline}</p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h2 className="text-base font-semibold text-ink">{c.title}</h2>
            <ul className="mt-3 space-y-2">
              {c.links.map((l) => (
                <li key={l.path}>
                  <Link href={href(locale, l.path)} className="text-ink-soft hover:text-teal">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <p className="container-page py-5 text-sm text-ink-soft">
          © {new Date().getFullYear()} {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}

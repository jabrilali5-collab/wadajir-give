import Link from "next/link";
import { Logo } from "./Logo";
import { href, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n";

export function SiteFooter({ locale, t }: { locale: Locale; t: Dictionary }) {
  const cols = [
    {
      title: t.footer.platform,
      links: [
        { path: "/fundraisers", label: t.nav.causes },
        { path: "/start", label: t.nav.start },
        { path: "/stories", label: t.nav.stories },
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
    <footer className="bg-pine text-ivory">
      <div className="wrap grid gap-12 pb-12 pt-20 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo tone="ivory" />
          <p className="mt-6 max-w-sm text-[0.9375rem] leading-relaxed text-ivory/70">{t.footer.tagline}</p>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:col-span-7">
          {cols.map((c) => (
            <div key={c.title}>
              <h2 className="font-sans text-[0.8125rem] font-medium text-gold">{c.title}</h2>
              <ul className="mt-4 space-y-3">
                {c.links.map((l) => (
                  <li key={l.path}>
                    <Link href={href(locale, l.path)} className="text-[0.9375rem] text-ivory/80 transition-colors hover:text-ivory">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="wrap">
        <div className="flex flex-col gap-3 border-t border-ivory/15 py-8 text-[0.8125rem] text-ivory/55 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {t.footer.rights}</p>
          <p>
            Photography via{" "}
            <a href="https://unsplash.com/?utm_source=wadajir_give&utm_medium=referral" className="underline decoration-ivory/30 underline-offset-4 hover:text-ivory">
              Unsplash
            </a>{" "}
            — <Link href={href(locale, "/about#credits")} className="underline decoration-ivory/30 underline-offset-4 hover:text-ivory">credits</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

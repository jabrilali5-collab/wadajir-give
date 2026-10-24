"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeNames, type Locale } from "@/lib/i18n/config";

export function LanguageSwitcher({ current, label }: { current: Locale; label: string }) {
  const pathname = usePathname() ?? `/${current}`;
  const rest = pathname.replace(/^\/(en|so)(?=\/|$)/, "");
  return (
    <nav aria-label={label} className="flex rounded-[var(--radius-control)] border border-line p-0.5 text-sm">
      {locales.map((l) => (
        <Link
          key={l}
          href={`/${l}${rest}`}
          hrefLang={l}
          lang={l}
          aria-current={l === current ? "true" : undefined}
          className={
            "rounded-[8px] px-2.5 py-1 font-semibold " +
            (l === current ? "bg-teal text-white" : "text-ink-soft hover:text-teal")
          }
        >
          {l === "so" ? "SO" : "EN"}
          <span className="sr-only"> {localeNames[l]}</span>
        </Link>
      ))}
    </nav>
  );
}

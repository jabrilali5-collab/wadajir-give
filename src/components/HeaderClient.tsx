"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, LayoutDashboard, LogOut, Menu, ShieldCheck, X } from "lucide-react";
import { Logo } from "./Logo";
import { signOut } from "@/lib/actions/auth";
import type { Locale } from "@/lib/i18n/config";

type NavLink = { href: string; label: string; exact?: boolean };

export function HeaderClient({
  locale,
  links,
  labels,
  user,
  paths,
}: {
  locale: Locale;
  links: NavLink[];
  labels: Record<"signIn" | "getStarted" | "dashboard" | "admin" | "signOut" | "menu" | "language" | "start" | "trust", string>;
  user: { initials: string; name: string; isAdmin: boolean } | null;
  paths: Record<"home" | "login" | "signup" | "start" | "dashboard" | "admin" | "trust", string>;
}) {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Close the mobile sheet when the route changes.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (l: NavLink) => (l.exact ? pathname === l.href : pathname === l.href || pathname.startsWith(`${l.href}/`));
  const rest = pathname.replace(/^\/(en|so)(?=\/|$)/, "");

  const langToggle = (
    <nav aria-label={labels.language} className="flex items-center rounded-full border border-line-strong bg-ivory/80 p-0.5 text-[0.75rem] font-medium backdrop-blur-sm">
      {(["en", "so"] as const).map((l) => (
        <Link
          key={l}
          href={`/${l}${rest}`}
          hrefLang={l}
          lang={l}
          aria-current={l === locale ? "true" : undefined}
          className={`rounded-full px-2.5 py-1 transition-colors ${l === locale ? "bg-forest text-ivory" : "text-muted hover:text-forest"}`}
        >
          {l.toUpperCase()}
          <span className="sr-only">{l === "en" ? " English" : " Soomaali"}</span>
        </Link>
      ))}
    </nav>
  );

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,border-color] duration-300 ${
        scrolled || open ? "border-b border-line bg-ivory/90 backdrop-blur-md" : "border-b border-transparent bg-ivory/0"
      }`}
    >
      <div className="wrap flex h-[72px] items-center gap-6">
        <Link href={paths.home} aria-label="Wadajir Give" className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Main" className="ml-8 hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l) ? "page" : undefined}
              className={`rounded-full px-3.5 py-2 text-[0.875rem] transition-colors ${
                isActive(l) ? "text-pine" : "text-muted hover:text-pine"
              }`}
            >
              <span className={isActive(l) ? "border-b border-gold pb-0.5" : ""}>{l.label}</span>
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-3 lg:flex">
          {langToggle}
          {user ? (
            <details className="relative">
              <summary
                className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full bg-forest text-[0.8125rem] font-medium text-ivory [&::-webkit-details-marker]:hidden"
                aria-label={user.name}
              >
                {user.initials}
              </summary>
              <div className="absolute right-0 top-12 w-60 overflow-hidden rounded-[var(--radius-ui)] border border-line bg-paper p-1.5 shadow-[0_12px_32px_-16px_rgb(16_44_37/0.25)]">
                <p className="truncate px-3 py-2 text-[0.8125rem] text-muted">{user.name}</p>
                <Link href={paths.dashboard} className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm hover:bg-sage-soft">
                  <LayoutDashboard className="h-4 w-4 text-forest" aria-hidden /> {labels.dashboard}
                </Link>
                {user.isAdmin && (
                  <Link href={paths.admin} className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm hover:bg-sage-soft">
                    <ShieldCheck className="h-4 w-4 text-forest" aria-hidden /> {labels.admin}
                  </Link>
                )}
                <form action={signOut}>
                  <input type="hidden" name="locale" value={locale} />
                  <button className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm hover:bg-sage-soft">
                    <LogOut className="h-4 w-4 text-forest" aria-hidden /> {labels.signOut}
                  </button>
                </form>
              </div>
            </details>
          ) : (
            <Link href={paths.login} className="btn btn-sm text-pine hover:bg-sage-soft">
              {labels.signIn}
            </Link>
          )}
          <Link href={user ? paths.start : paths.signup} className="btn btn-sm btn-primary">
            {user ? labels.start : labels.getStarted}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={labels.menu}
          className="ml-auto flex h-11 w-11 items-center justify-center rounded-full border border-line-strong text-pine lg:hidden"
        >
          {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>
      </div>

      {/* Mobile sheet */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[72px] z-40 overflow-y-auto bg-ivory lg:hidden"
      >
        <div className="wrap flex min-h-full flex-col pb-8 pt-4">
          <nav aria-label="Mobile" className="flex flex-col">
            {links.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l) ? "page" : undefined}
                className="rise flex items-center justify-between border-b border-line py-4 font-serif text-[2rem] leading-none text-pine"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {l.label}
                <ArrowRight className="h-5 w-5 text-sage" aria-hidden />
              </Link>
            ))}
            <Link href={paths.trust} className="border-b border-line py-4 text-[1rem] text-muted">
              {labels.trust}
            </Link>
          </nav>

          <div className="mt-8 flex items-center justify-between">
            <span className="text-sm text-muted">{labels.language}</span>
            {langToggle}
          </div>

          <div className="mt-auto flex flex-col gap-3 pt-10">
            {user ? (
              <>
                <Link href={paths.dashboard} className="btn btn-secondary btn-lg w-full">
                  <LayoutDashboard aria-hidden /> {labels.dashboard}
                </Link>
                {user.isAdmin && (
                  <Link href={paths.admin} className="btn btn-secondary btn-lg w-full">
                    <ShieldCheck aria-hidden /> {labels.admin}
                  </Link>
                )}
                <Link href={paths.start} className="btn btn-primary btn-lg w-full">
                  {labels.start} <ArrowRight className="arrow" aria-hidden />
                </Link>
                <form action={signOut}>
                  <input type="hidden" name="locale" value={locale} />
                  <button className="btn btn-lg w-full text-muted">{labels.signOut}</button>
                </form>
              </>
            ) : (
              <>
                <Link href={paths.signup} className="btn btn-primary btn-lg w-full">
                  {labels.getStarted} <ArrowRight className="arrow" aria-hidden />
                </Link>
                <Link href={paths.login} className="btn btn-secondary btn-lg w-full">
                  {labels.signIn}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

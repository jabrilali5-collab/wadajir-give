import Link from "next/link";
import { ArrowRight, Inbox } from "lucide-react";
import { SideNav, type NavIcon } from "./SideNav";

/** Shared frame for the signed-in areas (dashboard, admin): calmer, data-first, same identity. */
export function AppShell({
  eyebrow,
  title,
  nav,
  navLabel,
  actions,
  children,
}: {
  eyebrow: string;
  title: string;
  nav: { href: string; label: string; icon: NavIcon; exact?: boolean; count?: number }[];
  navLabel: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="wrap pb-24 pt-8 md:pt-12">
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
        <div>
          <p className="t-kicker">{eyebrow}</p>
          <h1 className="mt-3 font-serif text-[2.5rem] leading-none text-pine md:text-[3rem]">{title}</h1>
        </div>
        {actions}
      </div>
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[232px_minmax(0,1fr)] lg:gap-12">
        <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <SideNav items={nav} label={navLabel} />
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}

export function SectionTitle({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="font-sans text-[1.0625rem] font-semibold text-pine">{title}</h2>
      {action}
    </div>
  );
}

export function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="panel p-5 md:p-6">
      <p className="text-[0.8125rem] text-muted">{label}</p>
      <p className="mt-3 font-serif text-[2.25rem] leading-none text-pine">{value}</p>
      {hint && <p className="mt-2 text-[0.75rem] text-muted">{hint}</p>}
    </div>
  );
}

export function EmptyState({ text, href, cta }: { text: string; href?: string; cta?: string }) {
  return (
    <div className="panel flex flex-col items-center px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-soft text-forest">
        <Inbox className="h-5 w-5" strokeWidth={1.6} aria-hidden />
      </span>
      <p className="mt-4 max-w-[36ch] text-[0.9375rem] text-muted">{text}</p>
      {href && cta && (
        <Link href={href} className="btn btn-primary btn-sm mt-6">
          {cta} <ArrowRight className="arrow" aria-hidden />
        </Link>
      )}
    </div>
  );
}

/** Horizontally scrollable table wrapper in a panel. */
export function TablePanel({ children }: { children: React.ReactNode }) {
  return <div className="panel overflow-x-auto">{children}</div>;
}

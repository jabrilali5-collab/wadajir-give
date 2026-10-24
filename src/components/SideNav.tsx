"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BadgeCheck,
  Flag,
  HandHeart,
  LayoutDashboard,
  ListChecks,
  Megaphone,
  Settings,
  Users,
  Wallet,
} from "lucide-react";

const icons = {
  overview: LayoutDashboard,
  fundraisers: Megaphone,
  donations: HandHeart,
  settings: Settings,
  review: ListChecks,
  verification: BadgeCheck,
  reports: Flag,
  payouts: Wallet,
  users: Users,
  analytics: BarChart3,
} as const;

export type NavIcon = keyof typeof icons;

export function SideNav({ items, label }: { items: { href: string; label: string; icon: NavIcon; exact?: boolean; count?: number }[]; label: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label={label} className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] lg:mx-0 lg:overflow-visible lg:px-0">
      <ul className="flex gap-1 whitespace-nowrap lg:flex-col">
        {items.map((i) => {
          const active = i.exact ? pathname === i.href : pathname === i.href || pathname.startsWith(`${i.href}/`);
          const Icon = icons[i.icon];
          return (
            <li key={i.href}>
              <Link
                href={i.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-[var(--radius-ui)] px-3.5 py-2.5 text-[0.9rem] transition-colors ${
                  active ? "bg-forest text-ivory" : "text-muted hover:bg-sage-soft hover:text-pine"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={1.7} aria-hidden />
                <span className="flex-1">{i.label}</span>
                {!!i.count && (
                  <span className={`rounded-full px-2 py-0.5 text-[0.6875rem] font-medium ${active ? "bg-ivory/15 text-ivory" : "bg-gold-soft text-[#6b5226]"}`}>
                    {i.count}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

const tone: Record<string, string> = {
  approved: "badge",
  succeeded: "badge",
  paid: "badge",
  ready: "badge",
  resolved: "badge",
  pending_review: "badge badge-gold",
  pending: "badge badge-gold",
  open: "badge badge-gold",
  requested: "badge badge-gold",
  in_review: "badge badge-gold",
  onboarding: "badge badge-gold",
  reviewing: "badge badge-gold",
  rejected: "badge badge-danger",
  failed: "badge badge-danger",
  on_hold: "badge badge-danger",
  paused: "badge badge-danger",
  denied: "badge badge-danger",
  refunded: "badge badge-line",
};

export function StatusPill({ status, label }: { status: string; label: string }) {
  return <span className={tone[status] ?? "badge badge-line"}>{label.replace(/_/g, " ")}</span>;
}

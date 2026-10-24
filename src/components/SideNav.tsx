"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SideNav({ items, label }: { items: { href: string; label: string; exact?: boolean }[]; label: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label={label} className="-mx-4 overflow-x-auto px-4 lg:mx-0 lg:overflow-visible lg:px-0">
      <ul className="flex gap-1 whitespace-nowrap lg:flex-col">
        {items.map((i) => {
          const active = i.exact ? pathname === i.href : pathname === i.href || pathname.startsWith(`${i.href}/`);
          return (
            <li key={i.href}>
              <Link
                href={i.href}
                aria-current={active ? "page" : undefined}
                className={`block rounded-[var(--radius-control)] px-3 py-2 font-semibold ${active ? "bg-teal text-white" : "text-ink-soft hover:bg-mist hover:text-teal-deep"}`}
              >
                {i.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function StatusPill({ status, label }: { status: string; label: string }) {
  const tone: Record<string, string> = {
    approved: "bg-[#e3f4ec] text-emerald-deep",
    succeeded: "bg-[#e3f4ec] text-emerald-deep",
    paid: "bg-[#e3f4ec] text-emerald-deep",
    ready: "bg-[#e3f4ec] text-emerald-deep",
    resolved: "bg-[#e3f4ec] text-emerald-deep",
    pending_review: "bg-warn-bg text-warn",
    pending: "bg-warn-bg text-warn",
    open: "bg-warn-bg text-warn",
    requested: "bg-warn-bg text-warn",
    onboarding: "bg-warn-bg text-warn",
    rejected: "bg-[#fde8e6] text-danger",
    failed: "bg-[#fde8e6] text-danger",
    on_hold: "bg-[#fde8e6] text-danger",
    paused: "bg-[#fde8e6] text-danger",
    denied: "bg-[#fde8e6] text-danger",
  };
  return <span className={`pill ${tone[status] ?? "bg-mist text-ink-soft"}`}>{label}</span>;
}

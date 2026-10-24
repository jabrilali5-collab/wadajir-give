/**
 * Mark: two arcs meeting beneath a five-pointed star (from the Somali flag) —
 * hands joined under a shared light. Wordmark: serif "Wadajir", sans "Give".
 */
export function LogoMark({ className = "h-8 w-8", tone = "forest" }: { className?: string; tone?: "forest" | "ivory" }) {
  const fg = tone === "forest" ? "var(--color-forest)" : "var(--color-ivory)";
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" fill="none">
      <path d="M5 26c0-7.2 4.9-12 11-12s11 4.8 11 12" stroke={fg} strokeWidth="2.2" strokeLinecap="round" />
      <path d="M10 26c0-4 2.7-6.6 6-6.6s6 2.6 6 6.6" stroke="var(--color-gold)" strokeWidth="2.2" strokeLinecap="round" />
      <path
        d="m16 3.2 1.65 3.95 4.27.36-3.25 2.8.98 4.17L16 12.25l-3.65 2.23.98-4.17-3.25-2.8 4.27-.36Z"
        fill={fg}
      />
    </svg>
  );
}

export function Logo({ tone = "forest" }: { tone?: "forest" | "ivory" }) {
  const text = tone === "forest" ? "text-pine" : "text-ivory";
  return (
    <span className={`flex items-center gap-2.5 ${text}`}>
      <LogoMark tone={tone} />
      <span className="flex items-baseline gap-1.5 leading-none">
        <span className="font-serif text-[1.6rem] tracking-tight">Wadajir</span>
        <span className="text-[0.95rem] font-medium tracking-tight opacity-80">Give</span>
      </span>
    </span>
  );
}

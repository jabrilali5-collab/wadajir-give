/** Wordmark: a five-pointed star (from the Somali flag) set inside a woven diamond. */
export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect x="6" y="6" width="28" height="28" rx="5" transform="rotate(45 20 20)" fill="var(--color-teal)" />
      <path
        d="M20 9.5 22.6 16.6 30.2 16.9 24.2 21.6 26.3 28.9 20 24.7 13.7 28.9 15.8 21.6 9.8 16.9 17.4 16.6Z"
        fill="#fff"
      />
      <path d="M6 20h4M30 20h4" stroke="var(--color-emerald)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2">
      <LogoMark />
      <span className="font-[family-name:var(--font-display)] text-[1.3rem] font-bold tracking-tight text-teal-deep">
        Wadajir<span className="font-medium text-emerald"> Give</span>
      </span>
    </span>
  );
}

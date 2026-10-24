import type { Locale } from "./i18n/config";

export function formatMoney(cents: number, locale: Locale, currency = "usd"): string {
  return new Intl.NumberFormat(locale === "so" ? "en-US" : "en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

export function formatDate(iso: string, locale: Locale): string {
  const d = new Date(iso);
  if (locale === "so") {
    // Intl has limited Somali support; use an unambiguous day-month-year form.
    const months = ["Jan", "Feb", "Mar", "Abr", "May", "Jun", "Lul", "Ago", "Seb", "Okt", "Nof", "Dis"];
    return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  }
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}

export function progressPercent(raised: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(100, Math.round((raised / goal) * 100));
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

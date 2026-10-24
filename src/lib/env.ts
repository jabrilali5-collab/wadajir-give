export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** True when the app is wired to a real Supabase project. Otherwise we run in labelled preview mode. */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/** Stripe is only ever used with a test-mode key unless ALLOW_LIVE_PAYMENTS=true is set deliberately. */
export function getStripeSecretKey(): string | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (key.startsWith("sk_live_") && process.env.ALLOW_LIVE_PAYMENTS !== "true") return null;
  return key;
}

export const isStripeConfigured = () => getStripeSecretKey() !== null;

export function siteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

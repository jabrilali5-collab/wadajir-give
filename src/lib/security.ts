import "server-only";
import { headers } from "next/headers";

/**
 * Best-effort, per-instance rate limiter. Good enough to blunt casual spam on a single
 * serverless instance; replace with a shared store (Upstash/Redis or a Postgres table) before launch.
 */
const buckets = new Map<string, { count: number; reset: number }>();

export async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

export async function rateLimit(key: string, limit: number, windowMs: number): Promise<boolean> {
  const ip = await clientIp();
  const id = `${key}:${ip}`;
  const now = Date.now();
  const b = buckets.get(id);
  if (!b || b.reset < now) {
    buckets.set(id, { count: 1, reset: now + windowMs });
    return true;
  }
  b.count += 1;
  return b.count <= limit;
}

/** Hidden form field that humans leave empty and naive bots fill in. */
export const HONEYPOT_FIELD = "website";
export function isBot(form: FormData): boolean {
  const v = form.get(HONEYPOT_FIELD);
  return typeof v === "string" && v.length > 0;
}

/** Only allow same-site relative redirects (prevents open-redirects via ?next=). */
export function safeNext(next: unknown, fallback: string): string {
  if (typeof next !== "string") return fallback;
  if (!next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return fallback;
  return next;
}

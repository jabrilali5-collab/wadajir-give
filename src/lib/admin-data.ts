import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import { CAMPAIGN_COLUMNS, getSession } from "./data";
import type { Campaign, CampaignStatus, Donation, Profile } from "./types";

/**
 * All reads go through the signed-in admin's client; RLS (is_admin()) grants the access.
 * The role is re-checked here too, because pages render in parallel with the admin layout's guard.
 */
async function db() {
  const supabase = await createClient();
  const session = await getSession();
  if (!supabase || session?.profile?.role !== "admin") redirect("/");
  return supabase;
}

export async function adminCampaigns(status?: CampaignStatus): Promise<Campaign[]> {
  let q = (await db()).from("campaigns").select(CAMPAIGN_COLUMNS).order("submitted_at", { ascending: true, nullsFirst: false }).limit(200);
  if (status) q = q.eq("status", status);
  const { data } = await q;
  return (data ?? []) as Campaign[];
}

export async function adminCounts() {
  const s = await db();
  const count = async (table: string, filter?: [string, string]) => {
    let q = s.from(table).select("*", { count: "exact", head: true });
    if (filter) q = q.eq(filter[0], filter[1]);
    const { count } = await q;
    return count ?? 0;
  };
  const [pending, live, openReports, verifications, users, donations] = await Promise.all([
    count("campaigns", ["status", "pending_review"]),
    count("campaigns", ["status", "approved"]),
    count("reports", ["status", "open"]),
    count("verification_requests", ["status", "requested"]),
    count("profiles"),
    count("donations", ["status", "succeeded"]),
  ]);
  return { pending, live, openReports, verifications, users, donations };
}

export async function adminDonations(): Promise<Donation[]> {
  const { data } = await (await db())
    .from("donations")
    .select("*, campaigns(title, slug)")
    .order("created_at", { ascending: false })
    .limit(200);
  return (data ?? []).map((d) => {
    const c = d.campaigns as { title: string; slug: string } | null;
    return { ...d, campaign_title: c?.title, campaign_slug: c?.slug } as Donation;
  });
}

export async function adminReports() {
  const { data } = await (await db())
    .from("reports")
    .select("id, reason, details, status, created_at, campaign_id, campaigns(title, slug, status)")
    .order("created_at", { ascending: false })
    .limit(200);
  return (data ?? []) as unknown as {
    id: string; reason: string; details: string | null; status: string; created_at: string; campaign_id: string;
    campaigns: { title: string; slug: string; status: string } | null;
  }[];
}

export async function adminVerifications() {
  const { data } = await (await db())
    .from("verification_requests")
    .select("id, user_id, status, note, created_at, profiles(full_name, email, country)")
    .order("created_at", { ascending: false })
    .limit(200);
  return (data ?? []) as unknown as {
    id: string; user_id: string; status: string; note: string | null; created_at: string;
    profiles: { full_name: string | null; email: string | null; country: string | null } | null;
  }[];
}

export async function adminUsers(): Promise<Profile[]> {
  const { data } = await (await db()).from("profiles").select("*").order("created_at", { ascending: false }).limit(500);
  return (data ?? []) as Profile[];
}

export async function adminAnalytics() {
  const s = await db();
  const { data: donations } = await s
    .from("donations")
    .select("amount_cents, tip_cents, created_at, livemode")
    .eq("status", "succeeded")
    .order("created_at", { ascending: false })
    .limit(5000);
  const { data: campaigns } = await s.from("campaigns").select("category, status").limit(5000);
  const rows = donations ?? [];
  const byCategory: Record<string, number> = {};
  for (const c of campaigns ?? []) if (c.status === "approved") byCategory[c.category] = (byCategory[c.category] ?? 0) + 1;
  const byDay: Record<string, number> = {};
  for (const d of rows) {
    const day = d.created_at.slice(0, 10);
    byDay[day] = (byDay[day] ?? 0) + d.amount_cents;
  }
  return {
    totalDonated: rows.reduce((s, d) => s + d.amount_cents, 0),
    totalTips: rows.reduce((s, d) => s + d.tip_cents, 0),
    count: rows.length,
    testCount: rows.filter((d) => !d.livemode).length,
    byCategory,
    byDay: Object.entries(byDay).sort(([a], [b]) => a.localeCompare(b)).slice(-30),
  };
}

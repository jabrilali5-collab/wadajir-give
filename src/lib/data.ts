import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { isSupabaseConfigured } from "./env";
import { createClient } from "./supabase/server";
import { sampleCampaigns, sampleDonations, sampleUpdates } from "./sample-data";
import type { Campaign, CampaignUpdate, Profile, PublicDonation } from "./types";
import { href, type Locale } from "./i18n/config";

export const CAMPAIGN_COLUMNS =
  "id, slug, organizer_id, organizer_name, organizer_verified, title, story, category, goal_cents, raised_cents, donor_count, currency, beneficiary_name, beneficiary_relationship, city, country, cover_image_url, status, review_note, payout_status, created_at, submitted_at, approved_at";

export async function listCampaigns(opts: { category?: string; q?: string; limit?: number } = {}): Promise<Campaign[]> {
  const { category, q, limit = 24 } = opts;
  if (!isSupabaseConfigured) {
    return sampleCampaigns
      .filter((c) => !category || c.category === category)
      .filter((c) => !q || `${c.title} ${c.city} ${c.country}`.toLowerCase().includes(q.toLowerCase()))
      .slice(0, limit);
  }
  const supabase = await createClient();
  let query = supabase!
    .from("campaigns")
    .select(CAMPAIGN_COLUMNS)
    .eq("status", "approved")
    .order("approved_at", { ascending: false })
    .limit(limit);
  if (category) query = query.eq("category", category);
  if (q) {
    const term = q.replace(/[%_,()]/g, " ").trim().slice(0, 60);
    if (term) query = query.or(`title.ilike.%${term}%,city.ilike.%${term}%,country.ilike.%${term}%`);
  }
  const { data, error } = await query;
  if (error) {
    console.error("listCampaigns", error.message);
    return [];
  }
  return (data ?? []) as Campaign[];
}

export interface PlatformStats {
  donatedCents: number;
  gifts: number;
  active: number;
  communities: number;
  isSample: boolean;
}

/** Real totals derived from public campaign rows (totals are maintained by DB triggers from succeeded donations). */
export async function getPlatformStats(): Promise<PlatformStats> {
  const summarize = (rows: Pick<Campaign, "raised_cents" | "donor_count" | "status" | "city" | "country">[], isSample: boolean) => ({
    donatedCents: rows.reduce((s, c) => s + c.raised_cents, 0),
    gifts: rows.reduce((s, c) => s + c.donor_count, 0),
    active: rows.filter((c) => c.status === "approved").length,
    communities: new Set(rows.map((c) => `${c.city ?? ""}|${c.country ?? ""}`.toLowerCase()).filter((k) => k !== "|")).size,
    isSample,
  });
  if (!isSupabaseConfigured) return summarize(sampleCampaigns, true);
  const supabase = await createClient();
  const { data } = await supabase!
    .from("campaigns")
    .select("raised_cents, donor_count, status, city, country")
    .in("status", ["approved", "closed"])
    .limit(10000);
  return summarize((data ?? []) as Campaign[], false);
}

export async function getRecentStories(limit = 6) {
  if (!isSupabaseConfigured) return [];
  const supabase = await createClient();
  const { data } = await supabase!
    .from("campaign_updates")
    .select("id, body, created_at, campaigns!inner(title, slug, city, country, cover_image_url, category, status)")
    .eq("campaigns.status", "approved")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as unknown as {
    id: string;
    body: string;
    created_at: string;
    campaigns: { title: string; slug: string; city: string | null; country: string | null; cover_image_url: string | null; category: string };
  }[];
}

export async function getCampaignBySlug(slug: string): Promise<Campaign | null> {
  if (!isSupabaseConfigured) return sampleCampaigns.find((c) => c.slug === slug) ?? null;
  const supabase = await createClient();
  const { data } = await supabase!.from("campaigns").select(CAMPAIGN_COLUMNS).eq("slug", slug).maybeSingle();
  return (data as Campaign) ?? null;
}

export async function getCampaignById(id: string): Promise<Campaign | null> {
  if (!isSupabaseConfigured) return sampleCampaigns.find((c) => c.id === id) ?? null;
  const supabase = await createClient();
  const { data } = await supabase!.from("campaigns").select(CAMPAIGN_COLUMNS).eq("id", id).maybeSingle();
  return (data as Campaign) ?? null;
}

export async function getCampaignUpdates(campaignId: string): Promise<CampaignUpdate[]> {
  if (!isSupabaseConfigured) return sampleUpdates[campaignId] ?? [];
  const supabase = await createClient();
  const { data } = await supabase!
    .from("campaign_updates")
    .select("id, campaign_id, body, created_at")
    .eq("campaign_id", campaignId)
    .order("created_at", { ascending: false });
  return (data ?? []) as CampaignUpdate[];
}

export async function getPublicDonations(campaignId: string): Promise<PublicDonation[]> {
  if (!isSupabaseConfigured) return campaignId.startsWith("sample") ? sampleDonations : [];
  const supabase = await createClient();
  const { data, error } = await supabase!.rpc("campaign_recent_donations", { p_campaign_id: campaignId, p_limit: 10 });
  if (error) {
    console.error("getPublicDonations", error.message);
    return [];
  }
  return (data ?? []) as PublicDonation[];
}

export interface SessionInfo {
  userId: string;
  email: string | null;
  profile: Profile | null;
}

/** Cached per request so the layout and page share one auth lookup. */
export const getSession = cache(async function getSession(): Promise<SessionInfo | null> {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase!.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase!.from("profiles").select("*").eq("id", user.id).maybeSingle();
  return { userId: user.id, email: user.email ?? null, profile: (profile as Profile) ?? null };
});

export async function requireSession(locale: Locale, next: string): Promise<SessionInfo> {
  const session = await getSession();
  if (!session) redirect(`${href(locale, "/login")}?next=${encodeURIComponent(next)}`);
  return session;
}

export async function requireAdmin(locale: Locale): Promise<SessionInfo> {
  const session = await requireSession(locale, href(locale, "/admin"));
  if (session.profile?.role !== "admin") redirect(href(locale, "/dashboard"));
  return session;
}

import "server-only";
import { createClient } from "./supabase/server";
import { CAMPAIGN_COLUMNS } from "./data";
import type { Campaign, Donation } from "./types";

export async function myCampaigns(userId: string): Promise<Campaign[]> {
  const supabase = await createClient();
  const { data } = await supabase!
    .from("campaigns")
    .select(CAMPAIGN_COLUMNS)
    .eq("organizer_id", userId)
    .order("created_at", { ascending: false });
  return (data ?? []) as Campaign[];
}

export async function myDonations(userId: string): Promise<Donation[]> {
  const supabase = await createClient();
  const { data } = await supabase!
    .from("donations")
    .select("*, campaigns(title, slug)")
    .eq("donor_id", userId)
    .order("created_at", { ascending: false })
    .limit(200);
  return (data ?? []).map((d) => {
    const c = d.campaigns as { title: string; slug: string } | null;
    return { ...d, campaign_title: c?.title, campaign_slug: c?.slug } as Donation;
  });
}

export async function campaignDonations(campaignId: string): Promise<Donation[]> {
  const supabase = await createClient();
  const { data } = await supabase!
    .from("donations")
    .select("*")
    .eq("campaign_id", campaignId)
    .order("created_at", { ascending: false })
    .limit(200);
  return (data ?? []) as Donation[];
}

export async function myVerification(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase!
    .from("verification_requests")
    .select("id, status, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data as { id: string; status: string; created_at: string } | null;
}

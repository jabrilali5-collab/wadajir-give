"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "../supabase/server";
import { href, isLocale, type Locale } from "../i18n/config";
import { slugify } from "../format";
import { IMAGE_TYPES, MAX_IMAGE_BYTES, campaignSchema, contactSchema, reportSchema } from "../validation";
import { isBot, rateLimit } from "../security";
import { isSupabaseConfigured } from "../env";
import type { FormState } from "./auth";

function localeOf(form: FormData): Locale {
  const l = String(form.get("locale") ?? "en");
  return isLocale(l) ? l : "en";
}

async function uploadCover(
  supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>,
  userId: string,
  file: FormDataEntryValue | null,
): Promise<{ url?: string; error?: string }> {
  if (!(file instanceof File) || file.size === 0) return {};
  if (file.size > MAX_IMAGE_BYTES) return { error: "Photo must be 4 MB or smaller." };
  if (!(IMAGE_TYPES as readonly string[]).includes(file.type)) return { error: "Photo must be JPG, PNG or WebP." };
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `${userId}/${randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("campaign-images").upload(path, file, { contentType: file.type, upsert: false });
  if (error) return { error: `Photo upload failed: ${error.message}` };
  return { url: supabase.storage.from("campaign-images").getPublicUrl(path).data.publicUrl };
}

export async function saveCampaign(_: FormState, form: FormData): Promise<FormState> {
  const locale = localeOf(form);
  if (isBot(form)) return { error: "Could not save." };
  const supabase = await createClient();
  if (!supabase) return { error: "Fundraisers can't be created in preview mode." };
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect(`${href(locale, "/login")}?next=${encodeURIComponent(href(locale, "/start"))}`);
  if (!(await rateLimit("campaign", 20, 60 * 60_000))) return { error: "Too many submissions. Try again later." };

  const intent = form.get("intent") === "submit" ? "submit" : "draft";
  const id = String(form.get("id") ?? "");
  if (intent === "submit" && form.get("agree") !== "on") return { error: "Confirm the information is true before submitting." };

  const parsed = campaignSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  const v = parsed.data;

  const cover = await uploadCover(supabase, auth.user.id, form.get("photo"));
  if (cover.error) return { error: cover.error };

  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", auth.user.id).single();
  const row = {
    title: v.title,
    category: v.category,
    goal_cents: v.goal * 100,
    beneficiary_name: v.beneficiary_name,
    beneficiary_relationship: v.beneficiary_relationship,
    city: v.city || null,
    country: v.country || null,
    story: v.story,
    status: intent === "submit" ? ("pending_review" as const) : ("draft" as const),
    ...(cover.url ? { cover_image_url: cover.url } : {}),
  };

  if (id) {
    const { error } = await supabase.from("campaigns").update(row).eq("id", id).eq("organizer_id", auth.user.id);
    if (error) return { error: error.message };
    revalidatePath(`/${locale}/dashboard`, "layout");
    return { ok: true, message: intent === "submit" ? "submitted" : "saved" };
  }

  const slug = `${slugify(v.title) || "fundraiser"}-${randomUUID().slice(0, 6)}`;
  const { data, error } = await supabase
    .from("campaigns")
    .insert({ ...row, slug, organizer_id: auth.user.id, organizer_name: profile?.full_name || "Organizer" })
    .select("id")
    .single();
  if (error) return { error: error.message };
  revalidatePath(`/${locale}/dashboard`, "layout");
  redirect(`${href(locale, `/dashboard/fundraisers/${data.id}`)}?saved=${intent}`);
}

export async function postCampaignUpdate(_: FormState, form: FormData): Promise<FormState> {
  const locale = localeOf(form);
  const supabase = await createClient();
  if (!supabase) return { error: "Not available in preview mode." };
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { error: "Log in again." };
  const parsed = z
    .object({ campaign_id: z.string().uuid(), body: z.string().trim().min(10).max(4000) })
    .safeParse({ campaign_id: form.get("campaign_id"), body: form.get("body") });
  if (!parsed.success) return { error: "Updates must be between 10 and 4,000 characters." };
  const { error } = await supabase.from("campaign_updates").insert({ ...parsed.data, author_id: auth.user.id });
  if (error) return { error: "Updates can be posted once the fundraiser is live." };
  revalidatePath(`/${locale}/fundraisers`, "layout");
  revalidatePath(`/${locale}/dashboard`, "layout");
  return { ok: true };
}

export async function requestVerification(_: FormState, form: FormData): Promise<FormState> {
  const supabase = await createClient();
  if (!supabase) return { error: "Not available in preview mode." };
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { error: "Log in again." };
  const note = String(form.get("note") ?? "").trim().slice(0, 1000);
  const { error } = await supabase.from("verification_requests").insert({ user_id: auth.user.id, note: note || null });
  if (error) return { error: error.code === "23505" ? "You already have a request in progress." : error.message };
  return { ok: true };
}

export async function reportCampaign(_: FormState, form: FormData): Promise<FormState> {
  if (isBot(form)) return { ok: true };
  if (!(await rateLimit("report", 5, 60 * 60_000))) return { error: "Too many reports. Try again later." };
  const parsed = reportSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: "Choose a reason." };
  if (!isSupabaseConfigured) return { ok: true };
  const supabase = await createClient();
  const { data: auth } = await supabase!.auth.getUser();
  const { error } = await supabase!.from("reports").insert({
    campaign_id: parsed.data.campaign_id,
    reason: parsed.data.reason,
    details: parsed.data.details || null,
    reporter_id: auth.user?.id ?? null,
  });
  if (error) return { error: "Could not send the report. Try again." };
  return { ok: true };
}

export async function sendContact(_: FormState, form: FormData): Promise<FormState> {
  if (isBot(form)) return { ok: true };
  if (!(await rateLimit("contact", 5, 60 * 60_000))) return { error: "Too many messages. Try again later." };
  const parsed = contactSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  if (!isSupabaseConfigured) return { ok: true };
  const supabase = await createClient();
  const { error } = await supabase!.from("contact_messages").insert(parsed.data);
  if (error) return { error: "Could not send. Try again." };
  return { ok: true };
}

export async function updateProfile(_: FormState, form: FormData): Promise<FormState> {
  const supabase = await createClient();
  if (!supabase) return { error: "Not available in preview mode." };
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { error: "Log in again." };
  const parsed = z
    .object({
      full_name: z.string().trim().min(2).max(120),
      phone: z.string().trim().max(40).optional().default(""),
      country: z.string().trim().max(80).optional().default(""),
      preferred_locale: z.enum(["en", "so"]),
    })
    .safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form." };
  const { error } = await supabase
    .from("profiles")
    .update({ ...parsed.data, phone: parsed.data.phone || null, country: parsed.data.country || null })
    .eq("id", auth.user.id);
  if (error) return { error: error.message };
  return { ok: true };
}

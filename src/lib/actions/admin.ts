"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "../supabase/server";

/** Every admin action re-checks the role on the server; RLS (is_admin()) enforces it again in the database. */
async function adminClient() {
  const supabase = await createClient();
  if (!supabase) throw new Error("Not configured");
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) throw new Error("Not signed in");
  const { data: profile } = await supabase.from("profiles").select("role, is_suspended").eq("id", auth.user.id).single();
  if (profile?.role !== "admin" || profile.is_suspended) throw new Error("Forbidden");
  return { supabase, adminId: auth.user.id };
}

async function audit(
  supabase: Awaited<ReturnType<typeof adminClient>>["supabase"],
  adminId: string,
  action: string,
  targetType: string,
  targetId: string,
  details?: Record<string, unknown>,
) {
  await supabase.from("audit_log").insert({ actor_id: adminId, action, target_type: targetType, target_id: targetId, details: details ?? null });
}

const uuid = z.string().uuid();

export async function reviewCampaign(form: FormData) {
  const { supabase, adminId } = await adminClient();
  const id = uuid.parse(form.get("id"));
  const decision = z.enum(["approved", "rejected", "paused", "closed"]).parse(form.get("decision"));
  const note = String(form.get("note") ?? "").trim().slice(0, 1000) || null;
  const { error } = await supabase
    .from("campaigns")
    .update({ status: decision, review_note: note, reviewed_by: adminId })
    .eq("id", id);
  if (error) throw new Error(error.message);
  await audit(supabase, adminId, `campaign.${decision}`, "campaign", id, { note });
  revalidatePath("/", "layout");
}

export async function setPayoutStatus(form: FormData) {
  const { supabase, adminId } = await adminClient();
  const id = uuid.parse(form.get("id"));
  const status = z.enum(["not_started", "onboarding", "ready", "paid", "on_hold"]).parse(form.get("payout_status"));
  const { error } = await supabase.from("campaigns").update({ payout_status: status }).eq("id", id);
  if (error) throw new Error(error.message);
  await audit(supabase, adminId, "campaign.payout_status", "campaign", id, { status });
  revalidatePath("/", "layout");
}

export async function decideVerification(form: FormData) {
  const { supabase, adminId } = await adminClient();
  const id = uuid.parse(form.get("id"));
  const userId = uuid.parse(form.get("user_id"));
  const decision = z.enum(["approved", "denied", "in_review"]).parse(form.get("decision"));
  const { error } = await supabase
    .from("verification_requests")
    .update({ status: decision, decided_at: decision === "in_review" ? null : new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  if (decision !== "in_review") {
    await supabase.from("profiles").update({ is_verified_organizer: decision === "approved" }).eq("id", userId);
  }
  await audit(supabase, adminId, `verification.${decision}`, "profile", userId);
  revalidatePath("/", "layout");
}

export async function setUserFlags(form: FormData) {
  const { supabase, adminId } = await adminClient();
  const id = uuid.parse(form.get("id"));
  if (id === adminId) throw new Error("You can't change your own account flags.");
  const field = z.enum(["is_suspended", "is_verified_organizer"]).parse(form.get("field"));
  const value = form.get("value") === "true";
  const { error } = await supabase.from("profiles").update({ [field]: value }).eq("id", id);
  if (error) throw new Error(error.message);
  await audit(supabase, adminId, `profile.${field}`, "profile", id, { value });
  revalidatePath("/", "layout");
}

export async function decideReport(form: FormData) {
  const { supabase, adminId } = await adminClient();
  const id = uuid.parse(form.get("id"));
  const status = z.enum(["reviewing", "resolved", "dismissed"]).parse(form.get("status"));
  const { error } = await supabase
    .from("reports")
    .update({ status, resolved_at: status === "reviewing" ? null : new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  await audit(supabase, adminId, `report.${status}`, "report", id);
  revalidatePath("/", "layout");
}

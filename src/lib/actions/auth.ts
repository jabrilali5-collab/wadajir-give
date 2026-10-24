"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "../supabase/server";
import { href, isLocale, type Locale } from "../i18n/config";
import { isBot, rateLimit, safeNext } from "../security";
import { siteUrl } from "../env";

export type FormState = { ok?: boolean; error?: string; message?: string } | undefined;

function localeOf(form: FormData): Locale {
  const l = String(form.get("locale") ?? "en");
  return isLocale(l) ? l : "en";
}

const credentials = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(8).max(128),
});

export async function login(_: FormState, form: FormData): Promise<FormState> {
  const locale = localeOf(form);
  if (!(await rateLimit("login", 10, 10 * 60_000))) return { error: "Too many attempts. Wait a few minutes and try again." };
  const parsed = credentials.safeParse({ email: form.get("email"), password: form.get("password") });
  if (!parsed.success) return { error: "invalid" };
  const supabase = await createClient();
  if (!supabase) return { error: "not_configured" };
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { error: error.message.includes("confirm") ? error.message : "invalid" };
  redirect(safeNext(form.get("next"), href(locale, "/dashboard")));
}

export async function signup(_: FormState, form: FormData): Promise<FormState> {
  const locale = localeOf(form);
  if (isBot(form)) return { ok: true, message: "check_email" };
  if (!(await rateLimit("signup", 5, 60 * 60_000))) return { error: "Too many sign-ups from this network. Try again later." };
  const parsed = credentials
    .extend({ full_name: z.string().trim().min(2).max(120) })
    .safeParse({ email: form.get("email"), password: form.get("password"), full_name: form.get("full_name") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  const supabase = await createClient();
  if (!supabase) return { error: "not_configured" };
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.full_name, locale },
      emailRedirectTo: `${siteUrl()}/auth/callback?next=${encodeURIComponent(href(locale, "/dashboard"))}`,
    },
  });
  if (error) return { error: error.message };
  if (data.session) redirect(safeNext(form.get("next"), href(locale, "/dashboard")));
  return { ok: true, message: "check_email" };
}

export async function signOut(form: FormData) {
  const locale = localeOf(form);
  const supabase = await createClient();
  await supabase?.auth.signOut();
  redirect(href(locale));
}

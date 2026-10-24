"use server";

import { redirect } from "next/navigation";
import { createAdminClient, createClient } from "../supabase/server";
import { getStripe } from "../stripe";
import { href, isLocale, type Locale } from "../i18n/config";
import { donationSchema, toCents } from "../validation";
import { isBot, rateLimit } from "../security";
import { siteUrl } from "../env";
import type { FormState } from "./auth";

/**
 * Starts a Stripe Checkout Session (test mode) for a donation.
 * Card data is entered on Stripe's hosted page — it never touches our servers.
 */
export async function startCheckout(_: FormState, form: FormData): Promise<FormState> {
  const l = String(form.get("locale") ?? "en");
  const locale: Locale = isLocale(l) ? l : "en";
  if (isBot(form)) return { error: "payments_off" };
  if (!(await rateLimit("checkout", 15, 10 * 60_000))) return { error: "Too many attempts. Wait a few minutes and try again." };

  const parsed = donationSchema.safeParse({
    ...Object.fromEntries(form),
    is_anonymous: form.get("is_anonymous") === "on",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  const v = parsed.data;

  const stripe = getStripe();
  const admin = createAdminClient();
  const supabase = await createClient();
  if (!stripe || !admin || !supabase) return { error: "payments_off" };

  // Read the campaign as the current user so RLS decides visibility; only approved fundraisers accept money.
  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id, slug, title, status, organizer_id")
    .eq("id", v.campaign_id)
    .maybeSingle();
  if (!campaign || campaign.status !== "approved") return { error: "This fundraiser isn't accepting donations." };

  const { data: auth } = await supabase.auth.getUser();
  const { amount_cents, tip_cents } = toCents(v.amount, v.tip_percent);

  const { data: organizer } = await admin
    .from("profiles")
    .select("stripe_account_id")
    .eq("id", campaign.organizer_id)
    .single();

  const base = siteUrl();
  const lineItems = [
    {
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: amount_cents,
        product_data: { name: `Donation: ${campaign.title}`.slice(0, 250) },
      },
    },
  ];
  if (tip_cents > 0) {
    lineItems.push({
      quantity: 1,
      price_data: { currency: "usd", unit_amount: tip_cents, product_data: { name: "Optional tip to Wadajir Give" } },
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    customer_email: v.donor_email,
    submit_type: "donate",
    locale: "en",
    success_url: `${base}${href(locale, "/donate/success")}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}${href(locale, `/fundraisers/${campaign.slug}`)}`,
    metadata: { campaign_id: campaign.id },
    payment_intent_data: {
      receipt_email: v.donor_email,
      metadata: { campaign_id: campaign.id },
      // Stripe Connect destination charge when the organizer has finished onboarding (US accounts only for MVP).
      ...(organizer?.stripe_account_id
        ? { transfer_data: { destination: organizer.stripe_account_id }, application_fee_amount: tip_cents }
        : {}),
    },
  });

  const { error } = await admin.from("donations").insert({
    campaign_id: campaign.id,
    donor_id: auth.user?.id ?? null,
    donor_name: v.donor_name || null,
    donor_email: v.donor_email,
    is_anonymous: v.is_anonymous,
    amount_cents,
    tip_cents,
    message: v.message || null,
    stripe_checkout_session_id: session.id,
    livemode: session.livemode,
  });
  if (error) {
    await stripe.checkout.sessions.expire(session.id).catch(() => undefined);
    return { error: "Could not start checkout. Try again." };
  }

  redirect(session.url!);
}

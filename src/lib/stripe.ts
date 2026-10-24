import "server-only";
import Stripe from "stripe";
import { getStripeSecretKey } from "./env";
import { createAdminClient } from "./supabase/server";

let client: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = getStripeSecretKey();
  if (!key) return null;
  client ??= new Stripe(key);
  return client;
}

/**
 * Applies a Checkout Session's final state to our donations table. Safe to call more than once
 * (webhook + success page): it only ever moves a donation forward from `pending`.
 */
export async function reconcileCheckoutSession(session: Stripe.Checkout.Session) {
  const admin = createAdminClient();
  if (!admin) return;
  const paymentIntent = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null;
  let status: "succeeded" | "failed" | null = null;
  if (session.status === "complete" && session.payment_status === "paid") status = "succeeded";
  if (session.status === "expired") status = "failed";
  if (!status) return;
  await admin
    .from("donations")
    .update({ status, stripe_payment_intent_id: paymentIntent, livemode: session.livemode, updated_at: new Date().toISOString() })
    .eq("stripe_checkout_session_id", session.id)
    .eq("status", "pending");
}

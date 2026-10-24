import type Stripe from "stripe";
import { getStripe, reconcileCheckoutSession } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) return new Response("Payments not configured", { status: 503 });

  const signature = request.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await request.text(), signature, secret);
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
    case "checkout.session.expired":
      await reconcileCheckoutSession(event.data.object);
      break;
    case "checkout.session.async_payment_failed": {
      const admin = createAdminClient();
      await admin
        ?.from("donations")
        .update({ status: "failed" })
        .eq("stripe_checkout_session_id", event.data.object.id)
        .eq("status", "pending");
      break;
    }
    case "charge.refunded": {
      const charge = event.data.object;
      const pi = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
      if (pi && charge.refunded) {
        await createAdminClient()?.from("donations").update({ status: "refunded" }).eq("stripe_payment_intent_id", pi);
      }
      break;
    }
  }
  return Response.json({ received: true });
}

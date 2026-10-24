import Link from "next/link";
import { ArrowLeft, CircleCheck, Clock, Receipt } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getStripe, reconcileCheckoutSession } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";
import { formatDate, formatMoney } from "@/lib/format";
import { getDictionary, href, isLocale } from "@/lib/i18n";

export const metadata: Metadata = { title: "Donation receipt", robots: { index: false } };

export default async function DonateSuccess({ params, searchParams }: PageProps<"/[lang]/donate/success">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const t = getDictionary(lang);
  const sp = await searchParams;
  const sessionId = typeof sp.session_id === "string" && /^cs_(test|live)_[A-Za-z0-9]+$/.test(sp.session_id) ? sp.session_id : null;
  const stripe = getStripe();
  const admin = createAdminClient();
  if (!sessionId || !stripe || !admin) notFound();

  // Stripe is the source of truth; reconcile here too in case the webhook hasn't arrived yet.
  const session = await stripe.checkout.sessions.retrieve(sessionId).catch(() => null);
  if (!session) notFound();
  await reconcileCheckoutSession(session);

  const { data: donation } = await admin
    .from("donations")
    .select("id, amount_cents, tip_cents, status, created_at, livemode, campaigns(title, slug)")
    .eq("stripe_checkout_session_id", sessionId)
    .maybeSingle();
  if (!donation) notFound();
  const campaign = donation.campaigns as unknown as { title: string; slug: string } | null;
  const paid = donation.status === "succeeded";

  return (
    <div className="wrap max-w-3xl pb-28 pt-12 md:pt-20">
      <span className="rise flex h-14 w-14 items-center justify-center rounded-full bg-sage-soft text-forest">
        {paid ? <CircleCheck className="h-6 w-6" strokeWidth={1.6} aria-hidden /> : <Clock className="h-6 w-6" strokeWidth={1.6} aria-hidden />}
      </span>
      <h1 className="t-h1 rise rise-1 mt-8">{paid ? t.donate.successTitle : t.common.loading}</h1>
      <p className="t-lead rise rise-2 mt-4">{paid ? t.donate.successBody : t.donate.pendingBody}</p>
      {!donation.livemode && <p className="alert alert-warn mt-6">{t.donate.successTestNote}</p>}

      <section className="card mt-10 overflow-hidden" aria-labelledby="receipt">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 id="receipt" className="flex items-center gap-2 font-sans text-[0.9375rem] font-semibold text-pine">
            <Receipt className="h-4 w-4" aria-hidden /> {t.donate.receipt}
          </h2>
          <span className="text-[0.8125rem] text-muted">#{donation.id.slice(0, 8).toUpperCase()}</span>
        </div>
        <dl className="divide-y divide-line text-[0.9375rem]">
          {[
            [t.common.date, formatDate(donation.created_at, lang)],
            [t.campaign.donateTitle, campaign?.title ?? "—"],
            [t.common.amount, formatMoney(donation.amount_cents, lang)],
            ...(donation.tip_cents > 0 ? [["Tip", formatMoney(donation.tip_cents, lang)]] : []),
            [t.common.status, donation.status],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-6 px-6 py-4">
              <dt className="text-muted">{k}</dt>
              <dd className="text-right text-pine">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="border-t border-line bg-paper px-6 py-4 text-[0.8125rem] text-muted">{t.campaign.notDeductible}</p>
      </section>

      {campaign && (
        <Link href={href(lang, `/fundraisers/${campaign.slug}`)} className="btn btn-secondary mt-8">
          <ArrowLeft aria-hidden /> {t.donate.backToFundraiser}
        </Link>
      )}
    </div>
  );
}

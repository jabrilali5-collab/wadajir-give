import Link from "next/link";
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
    <div className="container-page max-w-2xl py-14">
      <h1 className="text-[2.2rem]">{paid ? t.donate.successTitle : t.common.loading}</h1>
      <p className="mt-3 text-ink-soft">{paid ? t.donate.successBody : t.donate.pendingBody}</p>
      {!donation.livemode && <p className="mt-3 rounded-[var(--radius-control)] bg-warn-bg p-3 text-sm text-warn">{t.donate.successTestNote}</p>}

      <section className="mt-8 rounded-[var(--radius-card)] border border-line p-6" aria-labelledby="receipt">
        <h2 id="receipt" className="text-xl">{t.donate.receipt}</h2>
        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
          <dt className="text-ink-soft">Reference</dt><dd className="font-mono">{donation.id.slice(0, 8).toUpperCase()}</dd>
          <dt className="text-ink-soft">{t.common.date}</dt><dd>{formatDate(donation.created_at, lang)}</dd>
          <dt className="text-ink-soft">{t.campaign.donateTitle}</dt><dd>{campaign?.title}</dd>
          <dt className="text-ink-soft">{t.common.amount}</dt><dd>{formatMoney(donation.amount_cents, lang)}</dd>
          {donation.tip_cents > 0 && (<><dt className="text-ink-soft">Tip</dt><dd>{formatMoney(donation.tip_cents, lang)}</dd></>)}
          <dt className="text-ink-soft">{t.common.status}</dt><dd>{donation.status}</dd>
        </dl>
        <p className="mt-4 text-xs text-ink-soft">{t.campaign.notDeductible}</p>
      </section>

      {campaign && (
        <Link href={href(lang, `/fundraisers/${campaign.slug}`)} className="btn btn-secondary mt-8">
          {t.donate.backToFundraiser}
        </Link>
      )}
    </div>
  );
}

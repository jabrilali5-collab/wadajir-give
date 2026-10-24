"use client";

import { useActionState, useState } from "react";
import { Check, Link2, Lock, MessageCircle, Share2 } from "lucide-react";
import { startCheckout } from "@/lib/actions/donate";
import { reportCampaign } from "@/lib/actions/campaigns";
import { Honeypot } from "./honeypot";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

const PRESETS = [25, 50, 100, 250];
const TIPS = [0, 5, 10, 15];

export function DonateForm({
  t,
  locale,
  campaignId,
  disabled,
}: {
  t: Dictionary;
  locale: Locale;
  campaignId: string;
  disabled: boolean;
}) {
  const [state, action, pending] = useActionState(startCheckout, undefined);
  const [amount, setAmount] = useState<number>(50);
  const [tip, setTip] = useState<number>(0);
  const tipDollars = Math.round(amount * tip) / 100;
  const total = (Number.isFinite(amount) ? amount : 0) + tipDollars;

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="campaign_id" value={campaignId} />
      <Honeypot />

      <fieldset>
        <legend className="field-label">{t.campaign.amountLabel}</legend>
        <div className="grid grid-cols-4 gap-2">
          {PRESETS.map((p) => (
            <button type="button" key={p} onClick={() => setAmount(p)} aria-pressed={amount === p} className="choice text-[0.9375rem]">
              ${p}
            </button>
          ))}
        </div>
        <label className="relative mt-2 block">
          <span className="sr-only">{t.campaign.customAmount}</span>
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">$</span>
          <input
            name="amount"
            type="number"
            min={5}
            max={25000}
            step="1"
            inputMode="numeric"
            required
            value={Number.isFinite(amount) ? amount : ""}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="field pl-8 font-medium"
            aria-label={t.campaign.customAmount}
          />
        </label>
      </fieldset>

      <fieldset>
        <legend className="field-label">{t.campaign.tipLabel}</legend>
        <div className="grid grid-cols-4 gap-2">
          {TIPS.map((p) => (
            <label key={p} className="choice text-[0.8125rem]">
              <input type="radio" name="tip_percent" value={p} checked={tip === p} onChange={() => setTip(p)} className="sr-only" />
              {p === 0 ? t.campaign.tipNone : `${p}%`}
            </label>
          ))}
        </div>
        <p className="field-hint">{t.campaign.tipHint}</p>
      </fieldset>

      <div className="grid gap-4">
        <div>
          <label htmlFor="donor_name" className="field-label">{t.campaign.nameLabel}</label>
          <input id="donor_name" name="donor_name" autoComplete="name" maxLength={120} className="field" />
        </div>
        <div>
          <label htmlFor="donor_email" className="field-label">{t.campaign.emailLabel}</label>
          <input id="donor_email" name="donor_email" type="email" autoComplete="email" required maxLength={254} className="field" />
        </div>
        <div>
          <label htmlFor="message" className="field-label">{t.campaign.messageLabel}</label>
          <textarea id="message" name="message" maxLength={500} className="field !min-h-24" />
        </div>
        <label className="flex cursor-pointer items-center gap-3 text-[0.9375rem]">
          <input type="checkbox" name="is_anonymous" className="h-5 w-5 rounded accent-[var(--color-forest)]" />
          {t.campaign.anonymousLabel}
        </label>
      </div>

      {state?.error && (
        <p role="alert" className="alert alert-warn">
          {state.error === "payments_off" ? t.demo.paymentsOff : state.error}
        </p>
      )}

      <div className="space-y-3 border-t border-line pt-6">
        <div className="flex items-baseline justify-between text-[0.9375rem]">
          <span className="text-muted">Total</span>
          <span className="font-serif text-[1.75rem] leading-none text-pine">${total.toFixed(2)}</span>
        </div>
        <button type="submit" disabled={pending || disabled} className="btn btn-primary btn-lg w-full">
          <Lock aria-hidden /> {pending ? t.common.loading : t.campaign.continueToPayment}
        </button>
        {disabled && <p className="text-[0.8125rem] text-warn">{t.demo.paymentsOff}</p>}
        <p className="text-[0.75rem] leading-relaxed text-muted">{t.campaign.notDeductible}</p>
      </div>
    </form>
  );
}

export function ShareButtons({ t, url, title }: { t: Dictionary; url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const text = `${title} ${url}`;
  return (
    <div className="flex flex-wrap gap-2">
      <a className="btn btn-secondary btn-sm" href={`https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer">
        <MessageCircle aria-hidden /> {t.campaign.shareWhatsApp}
      </a>
      <a className="btn btn-secondary btn-sm" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer">
        <Share2 aria-hidden /> {t.campaign.shareFacebook}
      </a>
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
          } catch {
            window.prompt(t.campaign.copyLink, url);
          }
        }}
      >
        {copied ? <Check aria-hidden /> : <Link2 aria-hidden />} {copied ? t.campaign.copied : t.campaign.copyLink}
      </button>
      <span aria-live="polite" className="sr-only">{copied ? t.campaign.copied : ""}</span>
    </div>
  );
}

export function ReportForm({ t, campaignId }: { t: Dictionary; campaignId: string }) {
  const [state, action, pending] = useActionState(reportCampaign, undefined);
  if (state?.ok) return <p role="status" className="alert alert-ok">{t.campaign.reportThanks}</p>;
  return (
    <details className="group">
      <summary className="cursor-pointer list-none text-[0.875rem] text-muted underline decoration-line-strong underline-offset-4 hover:text-danger [&::-webkit-details-marker]:hidden">
        {t.campaign.report}
      </summary>
      <form action={action} className="card card-pad mt-4 space-y-5">
        <h3 className="t-h3">{t.campaign.reportTitle}</h3>
        <input type="hidden" name="campaign_id" value={campaignId} />
        <Honeypot />
        <fieldset className="space-y-2.5">
          <legend className="field-label">{t.campaign.reportReason}</legend>
          {Object.entries(t.campaign.reportReasons).map(([key, label]) => (
            <label key={key} className="flex cursor-pointer items-start gap-3 text-[0.9375rem]">
              <input type="radio" name="reason" value={key} required className="mt-1 accent-[var(--color-forest)]" />
              {label}
            </label>
          ))}
        </fieldset>
        <div>
          <label htmlFor="report-details" className="field-label">{t.campaign.reportDetails}</label>
          <textarea id="report-details" name="details" maxLength={2000} className="field !min-h-24" />
        </div>
        {state?.error && <p role="alert" className="alert alert-danger">{state.error}</p>}
        <button disabled={pending} className="btn btn-danger">{pending ? t.common.loading : t.campaign.reportSubmit}</button>
      </form>
    </details>
  );
}

"use client";

import { useActionState, useState } from "react";
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

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="campaign_id" value={campaignId} />
      <Honeypot />

      <fieldset>
        <legend className="field-label">{t.campaign.amountLabel}</legend>
        <div className="grid grid-cols-4 gap-2">
          {PRESETS.map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => setAmount(p)}
              aria-pressed={amount === p}
              className={`min-h-11 rounded-[var(--radius-control)] border-[1.5px] font-semibold ${amount === p ? "border-emerald bg-emerald text-white" : "border-line text-ink hover:border-teal"}`}
            >
              ${p}
            </button>
          ))}
        </div>
        <label className="mt-3 block">
          <span className="sr-only">{t.campaign.customAmount}</span>
          <span className="relative block">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft">$</span>
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
              className="field pl-7"
              aria-label={t.campaign.customAmount}
            />
          </span>
        </label>
      </fieldset>

      <fieldset>
        <legend className="field-label">{t.campaign.tipLabel}</legend>
        <div className="grid grid-cols-4 gap-2">
          {TIPS.map((p) => (
            <label key={p} className={`flex min-h-11 cursor-pointer items-center justify-center rounded-[var(--radius-control)] border-[1.5px] text-sm font-semibold has-[:checked]:border-teal has-[:checked]:bg-mist has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-sky ${"border-line"}`}>
              <input type="radio" name="tip_percent" value={p} checked={tip === p} onChange={() => setTip(p)} className="sr-only" />
              {p === 0 ? t.campaign.tipNone : `${p}%`}
            </label>
          ))}
        </div>
        <p className="field-hint">
          {t.campaign.tipHint}
          {tip > 0 && ` (+$${tipDollars.toFixed(2)})`}
        </p>
      </fieldset>

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
      <label className="flex items-center gap-2.5">
        <input type="checkbox" name="is_anonymous" className="h-5 w-5 accent-[var(--color-teal)]" />
        {t.campaign.anonymousLabel}
      </label>

      {state?.error && (
        <p role="alert" className="rounded-[var(--radius-control)] bg-warn-bg p-3 text-sm text-warn">
          {state.error === "payments_off" ? t.demo.paymentsOff : state.error}
        </p>
      )}

      <button type="submit" disabled={pending || disabled} className="btn btn-primary w-full">
        {pending ? t.common.loading : `${t.campaign.continueToPayment} ($${(amount + tipDollars || 0).toFixed(2)})`}
      </button>
      {disabled && <p className="text-sm text-warn">{t.demo.paymentsOff}</p>}
      <p className="text-xs text-ink-soft">{t.campaign.notDeductible}</p>
    </form>
  );
}

export function ShareButtons({ t, url, title }: { t: Dictionary; url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const text = `${title} ${url}`;
  return (
    <div className="flex flex-wrap gap-2">
      <a
        className="btn btn-quiet"
        href={`https://wa.me/?text=${encodeURIComponent(text)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.1.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3Z"/></svg>
        {t.campaign.shareWhatsApp}
      </a>
      <a
        className="btn btn-quiet"
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t.campaign.shareFacebook}
      </a>
      <button
        type="button"
        className="btn btn-quiet"
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
        {copied ? t.campaign.copied : t.campaign.copyLink}
      </button>
      <span aria-live="polite" className="sr-only">{copied ? t.campaign.copied : ""}</span>
    </div>
  );
}

export function ReportForm({ t, campaignId }: { t: Dictionary; campaignId: string }) {
  const [state, action, pending] = useActionState(reportCampaign, undefined);
  if (state?.ok) return <p role="status" className="text-sm text-emerald-deep">{t.campaign.reportThanks}</p>;
  return (
    <details className="group">
      <summary className="cursor-pointer list-none text-sm font-semibold text-ink-soft underline underline-offset-4 hover:text-danger [&::-webkit-details-marker]:hidden">
        {t.campaign.report}
      </summary>
      <form action={action} className="mt-4 space-y-4 rounded-[var(--radius-card)] border border-line p-4">
        <h3 className="text-lg">{t.campaign.reportTitle}</h3>
        <input type="hidden" name="campaign_id" value={campaignId} />
        <Honeypot />
        <fieldset className="space-y-2">
          <legend className="field-label">{t.campaign.reportReason}</legend>
          {Object.entries(t.campaign.reportReasons).map(([key, label]) => (
            <label key={key} className="flex items-start gap-2.5 text-sm">
              <input type="radio" name="reason" value={key} required className="mt-1 accent-[var(--color-teal)]" />
              {label}
            </label>
          ))}
        </fieldset>
        <div>
          <label htmlFor="report-details" className="field-label">{t.campaign.reportDetails}</label>
          <textarea id="report-details" name="details" maxLength={2000} className="field !min-h-24" />
        </div>
        {state?.error && <p role="alert" className="text-sm text-danger">{state.error}</p>}
        <button disabled={pending} className="btn btn-danger">{pending ? t.common.loading : t.campaign.reportSubmit}</button>
      </form>
    </details>
  );
}

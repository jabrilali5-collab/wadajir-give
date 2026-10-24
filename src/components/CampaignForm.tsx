"use client";

import { useActionState } from "react";
import { saveCampaign } from "@/lib/actions/campaigns";
import { categories } from "@/lib/categories";
import { Honeypot } from "./honeypot";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import type { Campaign } from "@/lib/types";

export function CampaignForm({ t, locale, campaign }: { t: Dictionary; locale: Locale; campaign?: Campaign | null }) {
  const [state, action, pending] = useActionState(saveCampaign, undefined);
  const s = t.start;

  return (
    <form action={action} className="space-y-6" encType="multipart/form-data">
      <input type="hidden" name="locale" value={locale} />
      {campaign && <input type="hidden" name="id" value={campaign.id} />}
      <Honeypot />

      <div>
        <label htmlFor="title" className="field-label">{s.titleLabel}</label>
        <input id="title" name="title" required minLength={10} maxLength={120} defaultValue={campaign?.title} className="field" aria-describedby="title-hint" />
        <p id="title-hint" className="field-hint">{s.titleHint}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="field-label">{s.categoryLabel}</label>
          <select id="category" name="category" required defaultValue={campaign?.category ?? ""} className="field">
            <option value="" disabled>—</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c[locale]}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="goal" className="field-label">{s.goalLabel}</label>
          <input id="goal" name="goal" type="number" inputMode="numeric" min={100} max={1000000} step={1} required defaultValue={campaign ? campaign.goal_cents / 100 : undefined} className="field" />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="beneficiary_name" className="field-label">{s.beneficiaryLabel}</label>
          <input id="beneficiary_name" name="beneficiary_name" required minLength={2} maxLength={120} defaultValue={campaign?.beneficiary_name} className="field" aria-describedby="ben-hint" />
          <p id="ben-hint" className="field-hint">{s.beneficiaryHint}</p>
        </div>
        <div>
          <label htmlFor="beneficiary_relationship" className="field-label">{s.relationshipLabel}</label>
          <select id="beneficiary_relationship" name="beneficiary_relationship" required defaultValue={campaign?.beneficiary_relationship ?? "family"} className="field">
            {Object.entries(s.relationshipOptions).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="city" className="field-label">{s.cityLabel}</label>
          <input id="city" name="city" maxLength={80} defaultValue={campaign?.city ?? ""} className="field" />
        </div>
        <div>
          <label htmlFor="country" className="field-label">{s.countryLabel}</label>
          <input id="country" name="country" maxLength={80} defaultValue={campaign?.country ?? ""} className="field" />
        </div>
      </div>

      <div>
        <label htmlFor="story" className="field-label">{s.storyLabel}</label>
        <textarea id="story" name="story" required minLength={100} maxLength={10000} defaultValue={campaign?.story} className="field !min-h-64" aria-describedby="story-hint" />
        <p id="story-hint" className="field-hint">{s.storyHint}</p>
      </div>

      <div>
        <label htmlFor="photo" className="field-label">{s.photoLabel}</label>
        <input id="photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp" className="block w-full text-sm file:mr-3 file:rounded-[var(--radius-control)] file:border-0 file:bg-mist file:px-4 file:py-2.5 file:font-semibold file:text-teal-deep" aria-describedby="photo-hint" />
        <p id="photo-hint" className="field-hint">{s.photoHint}</p>
      </div>

      <p className="rounded-[var(--radius-control)] bg-mist p-3 text-sm text-ink-soft">{s.payoutNote}</p>

      <label className="flex items-start gap-3">
        <input type="checkbox" name="agree" className="mt-1 h-5 w-5 shrink-0 accent-[var(--color-teal)]" />
        <span className="text-sm">{s.agree}</span>
      </label>

      {state?.error && <p role="alert" className="rounded-[var(--radius-control)] bg-warn-bg p-3 text-sm text-warn">{state.error}</p>}
      {state?.ok && (
        <p role="status" className="rounded-[var(--radius-control)] bg-mist p-3 text-sm text-emerald-deep">
          {state.message === "submitted" ? s.submitted : t.dashboard.saved}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button name="intent" value="submit" disabled={pending} className="btn btn-primary">{pending ? t.common.loading : s.submit}</button>
        <button name="intent" value="draft" disabled={pending} className="btn btn-secondary">{s.saveDraft}</button>
      </div>
    </form>
  );
}

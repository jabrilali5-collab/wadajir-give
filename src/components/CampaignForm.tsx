"use client";

import { useActionState, useState } from "react";
import { ImagePlus, Send } from "lucide-react";
import { saveCampaign } from "@/lib/actions/campaigns";
import { categories } from "@/lib/categories";
import { Honeypot } from "./honeypot";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import type { Campaign } from "@/lib/types";

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <fieldset className="grid gap-6 border-t border-line pt-10 first-of-type:border-t-0 first-of-type:pt-0 md:grid-cols-[180px_1fr] md:gap-10">
      <legend className="contents">
        <span className="block">
          <span className="block text-[0.8125rem] font-medium text-gold">0{n}</span>
          <span className="mt-1 block font-serif text-[1.5rem] leading-tight text-pine">{title}</span>
        </span>
      </legend>
      <div className="space-y-6">{children}</div>
    </fieldset>
  );
}

export function CampaignForm({ t, locale, campaign }: { t: Dictionary; locale: Locale; campaign?: Campaign | null }) {
  const [state, action, pending] = useActionState(saveCampaign, undefined);
  const [fileName, setFileName] = useState<string>("");
  const [storyLen, setStoryLen] = useState<number>(campaign?.story.length ?? 0);
  const s = t.start;

  return (
    <form action={action} className="space-y-10" encType="multipart/form-data">
      <input type="hidden" name="locale" value={locale} />
      {campaign && <input type="hidden" name="id" value={campaign.id} />}
      <Honeypot />

      <Step n={1} title={s.titleLabel}>
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
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">$</span>
              <input id="goal" name="goal" type="number" inputMode="numeric" min={100} max={1000000} step={1} required defaultValue={campaign ? campaign.goal_cents / 100 : undefined} className="field pl-8" />
            </div>
          </div>
        </div>
      </Step>

      <Step n={2} title={s.beneficiaryLabel}>
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
          <div>
            <label htmlFor="city" className="field-label">{s.cityLabel}</label>
            <input id="city" name="city" maxLength={80} defaultValue={campaign?.city ?? ""} className="field" />
          </div>
          <div>
            <label htmlFor="country" className="field-label">{s.countryLabel}</label>
            <input id="country" name="country" maxLength={80} defaultValue={campaign?.country ?? ""} className="field" />
          </div>
        </div>
        <p className="alert alert-ok text-[0.875rem]">{s.payoutNote}</p>
      </Step>

      <Step n={3} title={s.storyLabel}>
        <div>
          <label htmlFor="story" className="field-label">{s.storyLabel}</label>
          <textarea
            id="story"
            name="story"
            required
            minLength={100}
            maxLength={10000}
            defaultValue={campaign?.story}
            onChange={(e) => setStoryLen(e.target.value.length)}
            className="field !min-h-72"
            aria-describedby="story-hint"
          />
          <p id="story-hint" className="field-hint flex justify-between gap-4">
            <span>{s.storyHint}</span>
            <span className={storyLen >= 100 ? "text-forest" : ""}>{storyLen}/100</span>
          </p>
        </div>
      </Step>

      <Step n={4} title={s.photoLabel}>
        <label htmlFor="photo" className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[var(--radius-ui)] border border-dashed border-line-strong bg-paper px-6 py-10 text-center transition-colors hover:border-forest">
          <ImagePlus className="h-7 w-7 text-forest" strokeWidth={1.5} aria-hidden />
          <span className="text-[0.9375rem] font-medium text-pine">{fileName || s.photoLabel}</span>
          <span className="text-[0.8125rem] text-muted" id="photo-hint">{s.photoHint}</span>
          <input
            id="photo"
            name="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            aria-describedby="photo-hint"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
          />
        </label>
      </Step>

      <div className="space-y-6 border-t border-line pt-10 md:pl-[220px]">
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" name="agree" className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-forest)]" />
          <span className="text-[0.9375rem]">{s.agree}</span>
        </label>

        {state?.error && <p role="alert" className="alert alert-danger">{state.error}</p>}
        {state?.ok && <p role="status" className="alert alert-ok">{state.message === "submitted" ? s.submitted : t.dashboard.saved}</p>}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button name="intent" value="submit" disabled={pending} className="btn btn-primary btn-lg">
            <Send aria-hidden /> {pending ? t.common.loading : s.submit}
          </button>
          <button name="intent" value="draft" disabled={pending} className="btn btn-secondary btn-lg">{s.saveDraft}</button>
        </div>
      </div>
    </form>
  );
}

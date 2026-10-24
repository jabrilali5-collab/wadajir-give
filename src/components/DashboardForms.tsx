"use client";

import { useActionState } from "react";
import { postCampaignUpdate, requestVerification, updateProfile } from "@/lib/actions/campaigns";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";
import type { Profile } from "@/lib/types";

export function VerificationRequest({ t }: { t: Dictionary }) {
  const [state, action, pending] = useActionState(requestVerification, undefined);
  if (state?.ok) return <p role="status" className="text-emerald-deep">{t.dashboard.saved}</p>;
  return (
    <form action={action} className="space-y-3">
      <label htmlFor="vnote" className="field-label">Note for our team (optional)</label>
      <textarea id="vnote" name="note" maxLength={1000} className="field !min-h-20" />
      {state?.error && <p role="alert" className="text-sm text-danger">{state.error}</p>}
      <button disabled={pending} className="btn btn-secondary">{t.dashboard.requestVerification}</button>
    </form>
  );
}

export function UpdateForm({ t, locale, campaignId }: { t: Dictionary; locale: Locale; campaignId: string }) {
  const [state, action, pending] = useActionState(postCampaignUpdate, undefined);
  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="campaign_id" value={campaignId} />
      <label htmlFor="update-body" className="field-label">{t.dashboard.updateBody}</label>
      <textarea id="update-body" name="body" required minLength={10} maxLength={4000} className="field !min-h-28" />
      {state?.error && <p role="alert" className="text-sm text-danger">{state.error}</p>}
      {state?.ok && <p role="status" className="text-sm text-emerald-deep">{t.dashboard.saved}</p>}
      <button disabled={pending} className="btn btn-primary">{t.dashboard.publishUpdate}</button>
    </form>
  );
}

export function ProfileForm({ t, profile }: { t: Dictionary; profile: Profile | null }) {
  const [state, action, pending] = useActionState(updateProfile, undefined);
  return (
    <form action={action} className="max-w-xl space-y-5">
      <div>
        <label htmlFor="full_name" className="field-label">{t.auth.fullName}</label>
        <input id="full_name" name="full_name" required minLength={2} maxLength={120} defaultValue={profile?.full_name ?? ""} className="field" />
      </div>
      <div>
        <label htmlFor="phone" className="field-label">{t.dashboard.phone}</label>
        <input id="phone" name="phone" type="tel" maxLength={40} defaultValue={profile?.phone ?? ""} className="field" />
      </div>
      <div>
        <label htmlFor="country" className="field-label">{t.dashboard.country}</label>
        <input id="country" name="country" maxLength={80} defaultValue={profile?.country ?? ""} className="field" />
      </div>
      <div>
        <label htmlFor="preferred_locale" className="field-label">{t.dashboard.preferredLanguage}</label>
        <select id="preferred_locale" name="preferred_locale" defaultValue={profile?.preferred_locale ?? "en"} className="field">
          <option value="en">English</option>
          <option value="so">Soomaali</option>
        </select>
      </div>
      {state?.error && <p role="alert" className="text-sm text-danger">{state.error}</p>}
      {state?.ok && <p role="status" className="text-sm text-emerald-deep">{t.dashboard.saved}</p>}
      <button disabled={pending} className="btn btn-primary">{t.common.save}</button>
    </form>
  );
}

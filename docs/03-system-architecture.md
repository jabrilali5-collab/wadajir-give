# System Architecture

```
Browser ──► Vercel (Next.js 16)
             ├─ proxy.ts ............ locale redirect (/ → /en|/so), Supabase session refresh
             ├─ app/[lang]/* ........ Server Components; read via user-scoped Supabase client (RLS applies)
             ├─ lib/actions/* ....... Server Actions: auth, campaigns, reports, contact, admin, donate
             ├─ api/stripe/webhook .. verifies Stripe signature → updates donations (service role)
             └─ auth/callback ....... exchanges email-confirmation code for a session
                    │
                    ├──► Supabase Postgres (RLS on every table, triggers guard protected columns)
                    ├──► Supabase Auth (email + password)
                    ├──► Supabase Storage (campaign-images, public read by URL, owner-folder writes)
                    └──► Stripe (Checkout Sessions, webhooks; Connect destination charges when ready)
```

## Key decisions
- **Server-side everything.** No Supabase client in the browser; all reads/writes happen in Server Components or Server Actions with the user's session cookie. Fewer moving parts and no keys beyond the publishable one in the bundle.
- **Two Supabase clients.** `createClient()` acts as the user (RLS enforced). `createAdminClient()` uses the service role and is used only for donations (checkout start, webhook, success-page reconciliation).
- **Database is the last line of defence.** Even if app code is wrong, triggers stop organizers from approving their own fundraisers, editing totals, or giving themselves a badge; RLS stops anyone reading others' donations.
- **Money in integer cents**, USD only for MVP.
- **Totals are derived.** `raised_cents`/`donor_count` are recomputed by trigger from succeeded donations — never written by clients.
- **Stripe is the source of truth** for payment state. Donations are inserted `pending` before redirecting to Checkout and moved to `succeeded`/`failed` only from Stripe data (webhook or a server-side session retrieve on the success page). Updates only move forward from `pending`, so replays are harmless.
- **Live-payment gate.** `getStripeSecretKey()` refuses `sk_live_` keys unless `ALLOW_LIVE_PAYMENTS=true`.
- **Preview mode.** Without Supabase env vars, data comes from `lib/sample-data.ts`, every card says "Sample", and accounts/payments are disabled.
- **i18n.** `[lang]` segment + typed dictionaries; a unit test fails if Somali is missing any English key. Locale chosen from cookie → `Accept-Language` → English.

## Request flows
**Create fundraiser:** form → `saveCampaign` (zod validation, honeypot, rate limit, optional photo upload to `campaign-images/{uid}/…`) → insert as `draft` or `pending_review` → trigger forces safe defaults.

**Review:** admin → `reviewCampaign` (role checked in action + RLS) → status change → audit log entry.

**Donate:** form → `startCheckout` → campaign must be `approved` → Stripe Checkout Session (+ optional tip line item; destination charge if organizer has a Connect account) → insert pending donation → redirect to Stripe → webhook / success page reconcile → trigger updates totals.

**Report:** anyone → `reportCampaign` → `reports` (insert-only for public; admins read) → admin can pause fundraiser.

## Environments
| Env | Supabase | Stripe |
| --- | --- | --- |
| Local / Preview | `wadajir-give` (free tier) | test keys |
| Production | separate project recommended before launch | live keys only after approval |

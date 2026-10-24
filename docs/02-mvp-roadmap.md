# MVP Feature Roadmap

## Phase 0 — Foundation ✅ (24 Oct 2026)
- Next.js app, design system (teal/emerald, woven-mat pattern, Bricolage Grotesque + Source Sans 3)
- English + Somali routes and dictionaries (Somali is a first draft)
- All public, dashboard and admin pages
- Supabase project, schema, RLS, storage bucket
- Stripe Checkout test-mode code path and webhook
- Unit tests, lint, production build

## Phase 1 — Private preview (next 1–2 weeks)
- [ ] Push to GitHub, connect Vercel, preview deploy (waiting on repo)
- [ ] Set Supabase Auth Site URL + redirect URLs to the preview domain
- [ ] Add `SUPABASE_SERVICE_ROLE_KEY`, Stripe test keys and webhook secret to Vercel
- [ ] Promote the owner account to admin
- [ ] End-to-end test: sign up → create → submit → approve → donate (test card 4242…) → receipt → dashboard
- [ ] Native Somali speaker reviews all Somali copy
- [ ] Custom SMTP for auth emails (Supabase default mailer is rate-limited)

## Phase 2 — Closed beta (US organizers)
- [ ] Stripe Connect Express onboarding for organizers (US only); store `stripe_account_id`
- [ ] Email notifications: submission received, approved/rejected, donation received, payout sent
- [ ] Shared rate limiting (Postgres or Redis) instead of per-instance memory
- [ ] Image moderation + resizing
- [ ] Document upload for review (private bucket, signed URLs)
- [ ] Lawyer-reviewed Terms, Privacy, Refund and Disbursement policies
- [ ] Analytics + error monitoring (Vercel Analytics, Sentry)

## Phase 3 — Public launch
- [ ] Brand + domain decision, trademark check
- [ ] Live payments (owner approval required)
- [ ] Fundraiser search ranking, featured curation
- [ ] Organizer withdrawal history in dashboard
- [ ] Donor accounts linking past guest donations by email

## Later
- International payouts through a licensed remittance partner (Somalia, Kenya, Ethiopia, Djibouti)
- Mobile money donation methods
- Registered-nonprofit accounts with tax receipts
- Recurring giving (e.g. monthly sadaqah)
- Team fundraisers, comments, Ramadan campaigns

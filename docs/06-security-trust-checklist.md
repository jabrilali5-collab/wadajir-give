# Security & Trust Checklist

## In place
- [x] Row-level security enabled on every table; policies per table (see Database Schema)
- [x] Protected columns enforced by triggers (status, totals, verification, payouts, role)
- [x] Donations writable only with the service-role key, server-side
- [x] Admin actions check role in the Server Action **and** in RLS; every admin action writes `audit_log`
- [x] Admin data loader re-checks role (pages render in parallel with layout guards)
- [x] Input validation with zod on every action; DB `CHECK` constraints mirror limits
- [x] Honeypot field on sign-up, fundraiser, donation, report and contact forms
- [x] Per-IP rate limits on login, sign-up, fundraiser, checkout, report, contact (per instance — see gaps)
- [x] Open-redirect protection on `?next=`
- [x] Card data never touches our servers (Stripe Checkout); webhook signature verified
- [x] Live Stripe keys refused unless `ALLOW_LIVE_PAYMENTS=true`
- [x] Security headers: `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`
- [x] Image uploads: type allow-list, 4 MB cap, stored under the uploader's folder, random file names
- [x] Search input sanitized before building PostgREST filters
- [x] Trigger functions not callable via REST; Supabase security advisor clean except intentional public functions
- [x] Trust UI: "Verified organizer" badge only from a DB flag set by admins; sample data always labelled; no invented stats; not-tax-deductible notice on every donation form

## Gaps to close before launch
- [ ] Shared rate limiting (current limiter is in-memory per serverless instance)
- [ ] CAPTCHA (e.g. Turnstile) on sign-up and reports if spam appears
- [ ] Content-Security-Policy header
- [ ] Image moderation, EXIF stripping and resizing
- [ ] Private bucket + signed URLs for verification documents
- [ ] OFAC / sanctions screening process for organizers and beneficiaries
- [ ] Reviewer playbook: what documents to request per category, red flags, response times
- [ ] Payout holds wired to open reports (Stripe manual payouts)
- [ ] Leaked-password protection and MFA for admins (Supabase Auth settings)
- [ ] Backups / PITR on the production database
- [x] SQL-level RLS test (24 Oct, rolled back): an organizer inserting `status=approved, raised=$9,999, verified=true` was forced to draft/0/false; self-promotion to admin was blocked; a second user saw 0 drafts, 0 donations and only their own profile
- [ ] End-to-end RLS test through the app with two real accounts

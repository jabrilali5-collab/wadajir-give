# Database Schema

Source of truth: `supabase/migrations/0001_init.sql`, `0002_revoke_trigger_function_exec.sql`. Applied to Supabase project `wadajir-give` (ref `mtabphcvuicvvszfwtoc`, us-east-1).

## Tables
| Table | Purpose | Who can read | Who can write |
| --- | --- | --- | --- |
| `profiles` | one row per auth user (name, locale, role, verified, suspended, `stripe_account_id`) | self, admins | self (protected columns blocked by trigger), admins |
| `campaigns` | fundraisers | everyone for `approved`/`closed`; organizer; admins | organizer inserts/edits while `draft`/`pending_review`/`rejected`; admins |
| `campaign_updates` | organizer updates | anyone who can see the campaign | organizer of an `approved` campaign; admin delete |
| `donations` | one row per checkout | donor, campaign organizer, admins | **service role only** (server) |
| `reports` | fraud/abuse reports | admins | anyone can file (as `open`) on a public campaign; admins update |
| `verification_requests` | organizer identity verification | requester, admins | requester inserts; admins decide |
| `payouts` | payout records (manual/Stripe reference) | organizer, admins | admins |
| `contact_messages` | contact form | admins | anyone |
| `audit_log` | admin actions | admins | admins (as themselves) |

## Enums
`campaign_status`: draft, pending_review, approved, rejected, paused, closed
`payout_status`: not_started, onboarding, ready, paid, on_hold
`donation_status`: pending, succeeded, failed, refunded
`report_status`: open, reviewing, resolved, dismissed
`verification_status`: requested, in_review, approved, denied
`user_role`: user, admin

## Functions & triggers
| Name | What it does |
| --- | --- |
| `is_admin()` | security-definer role check used by policies |
| `handle_new_user` | creates a profile on sign-up (name + locale from metadata) |
| `guard_profile_columns` | non-admins can't change role, verified, suspended, stripe account, email |
| `guard_campaign_columns` | non-admins can only set draft/pending_review; can't touch totals, verification, payout, review fields, slug, owner; can't edit once live |
| `sync_organizer_verified` | copies the profile's verified flag to their campaigns |
| `refresh_campaign_totals` | recomputes `raised_cents`/`donor_count` from succeeded donations |
| `campaign_recent_donations(id, limit)` | public donor wall; hides anonymous names, never returns emails |

Trigger functions have `EXECUTE` revoked from `anon`/`authenticated` so they can't be called through the REST API.

## Constraints worth knowing
- Goal $100–$1,000,000; donation $5–$25,000; story 100–10,000 chars; title 10–120 chars.
- `category` is checked against the 11 allowed slugs (keep in sync with `src/lib/categories.ts`).
- Currency fixed to `usd`.

## Storage
Bucket `campaign-images` — public URLs, 5 MB limit, JPEG/PNG/WebP. Authenticated users can upload only under `{their user id}/…`. No SELECT policy, so the bucket can't be listed.

# Wadajir Give (working name)

Fundraising for Somali communities — in Somali and English. Organizers raise money for medical needs, families, funerals, mosques, education, water wells and relief; donors give by card through Stripe. Every fundraiser is reviewed by a person before it goes live.

> Status: MVP in development. Payments run in **Stripe test mode only**. Legal pages are drafts. Not a registered charity.

## Stack

| Layer | Choice |
| --- | --- |
| App | Next.js 16 (App Router, Server Actions, `proxy.ts`), TypeScript, Tailwind CSS v4 |
| Data/auth/files | Supabase — Postgres with row-level security, Auth (email + password), Storage |
| Payments | Stripe Checkout (test mode), webhook reconciliation, Connect-ready destination charges |
| i18n | Locale routes `/en`, `/so`; typed dictionaries in `src/lib/i18n` |
| Hosting | Vercel |

## Run locally

```bash
cp .env.example .env.local   # fill in values (see below)
npm install
npm run dev                  # http://localhost:3000
npm run lint && npm test && npm run build
```

Without Supabase variables the app runs in **preview mode**: it shows clearly labelled sample fundraisers, and accounts and payments are disabled.

### Environment variables

| Name | Where | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project settings → API | public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | same (publishable key) | public; RLS protects data |
| `SUPABASE_SERVICE_ROLE_KEY` | same (secret) | **server only** — used by checkout + Stripe webhook to write donations |
| `STRIPE_SECRET_KEY` | Stripe dashboard (test mode) | `sk_test_…`. Live keys are ignored unless `ALLOW_LIVE_PAYMENTS=true` |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Developers → Webhooks | endpoint: `/api/stripe/webhook` |
| `NEXT_PUBLIC_SITE_URL` | your deployed URL | used for Stripe and auth redirect URLs |

### Database

Migrations live in `supabase/migrations`. They are already applied to the Supabase project `wadajir-give` (`mtabphcvuicvvszfwtoc`). For a new project, run them in order in the SQL editor or with `supabase db push`.

Make yourself an admin after signing up:

```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```

## Project layout

```
src/app/[lang]/...        pages (public, dashboard, admin)
src/app/api/stripe/webhook Stripe webhook
src/app/auth/callback     Supabase email-confirmation landing
src/lib/actions/*         Server Actions (auth, campaigns, donate, admin)
src/lib/i18n/*            English + Somali dictionaries
src/lib/supabase/*        server / proxy clients
src/proxy.ts              locale redirect + session refresh
supabase/migrations       schema, RLS, triggers, storage
docs/                     PRD, roadmap, architecture, checklists
```

## Docs

- [Product requirements](docs/01-product-requirements.md)
- [MVP roadmap](docs/02-mvp-roadmap.md)
- [System architecture](docs/03-system-architecture.md)
- [Database schema](docs/04-database-schema.md)
- [Deployment checklist](docs/05-deployment-checklist.md)
- [Security & trust checklist](docs/06-security-trust-checklist.md)
- [Payments & compliance open questions](docs/07-payments-compliance-questions.md)
- [Launch checklist](docs/08-launch-checklist.md)

# Deployment Checklist

## Done
- [x] Supabase project `wadajir-give` created (free tier), migrations applied, security advisors addressed
- [x] Vercel project `wadajir-give` created with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`; Vercel Authentication protects all non-custom-domain URLs
- [x] `npm run lint`, `npm test`, `npm run build` pass locally
- [x] `.npmrc` sets `legacy-peer-deps=true` (React 19.3 peer ranges) so Vercel installs cleanly

## To do for a working preview
1. [x] GitHub repo `jabrilali5-collab/wadajir-give` created; `main` pushed
2. [x] Deployed to Vercel from GitHub: https://wadajir-give.vercel.app (behind Vercel login). `NEXT_PUBLIC_SITE_URL` set. Confirm in Vercel → Settings → Git that pushes auto-deploy.
3. [ ] Vercel → Settings → Environment Variables (Preview + Production):
   - `SUPABASE_SERVICE_ROLE_KEY` (Supabase → Project settings → API keys → secret) — mark **Sensitive**
   - `STRIPE_SECRET_KEY` = `sk_test_…`
   - `STRIPE_WEBHOOK_SECRET` (after step 5)
   - `NEXT_PUBLIC_SITE_URL` = the deployment URL
4. [ ] Supabase → Authentication → URL configuration: Site URL = deployment URL; add `https://<deployment>/auth/callback` to redirect URLs
5. [ ] Stripe (test mode) → Developers → Webhooks → endpoint `https://<deployment>/api/stripe/webhook`, events: `checkout.session.completed`, `checkout.session.expired`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `charge.refunded`
   - Note: Vercel Authentication blocks Stripe from calling preview URLs. Either add a protection-bypass for the webhook path, or rely on the success-page reconciliation during testing.
6. [ ] Sign up, then promote yourself: `update public.profiles set role='admin' where email='…';`
7. [ ] Smoke test (see Launch checklist §Test script)

## Before production
- [ ] Separate Supabase project for production (keep preview data out)
- [ ] Custom SMTP for auth emails
- [ ] Custom domain + DNS (purchase needs owner approval)
- [ ] Error monitoring and log drains
- Sample data never loads once Supabase variables are set; it exists only for preview mode.

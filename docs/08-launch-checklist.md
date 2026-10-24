# Launch Checklist

## Brand & legal
- [ ] Final name; check trademark and domain availability for "Wadajir Give" (placeholder)
- [ ] Legal entity and platform bank account
- [ ] Lawyer-reviewed Terms, Privacy, Refund, Donor Guarantee, Disbursement and Acceptable Use policies (current pages are drafts and say so)
- [ ] Somali translations of legal pages
- [ ] Native-speaker review of all Somali UI copy (`src/lib/i18n/so.ts`, `src/lib/content.ts`, `src/lib/faq.ts`, `src/lib/categories.ts`)

## Payments (owner approval required at each step)
- [ ] Stripe platform/crowdfunding approval (see Payments & Compliance questions)
- [ ] Connect Express onboarding for US organizers
- [ ] Webhook on production URL; test refunds and chargebacks in test mode
- [ ] Set `ALLOW_LIVE_PAYMENTS=true` and live keys — **only after explicit approval**

## Operations
- [ ] At least two trained reviewers; target review time ≤ 2 business days
- [ ] Support inbox monitored (contact form → `contact_messages`)
- [ ] Incident plan for a reported scam: pause → hold payouts → contact organizer → refund decision
- [ ] Monitoring and alerts

## Test script (run on preview before every release)
1. Visit `/` — redirects to `/en` (or `/so` for Somali browsers); switch language on several pages
2. Sign up → confirm email → land on dashboard
3. Start a fundraiser with a photo → submit for review → appears "In review" in dashboard
4. As admin: approve it → it appears on Explore and the home page
5. Donate $25 + 10% tip with test card `4242 4242 4242 4242` → receipt page shows succeeded → totals update → donation in history
6. Post an update as organizer → visible on fundraiser page
7. Report the fundraiser → appears in admin Reports → pause it → it disappears from Explore
8. Request verification → approve in admin → badge appears on fundraiser
9. Check a non-admin can't open `/en/admin` and can't see other users' donations
10. Mobile check at 375 px width: home, fundraiser page, donate form, dashboard

## Go-live
- [ ] Production Supabase project, migrations applied, admin promoted
- [ ] Custom domain on Vercel; turn off Vercel Authentication for that domain only
- [ ] Soft launch with a small set of invited organizers in one city

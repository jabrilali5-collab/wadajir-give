# Product Requirements — Wadajir Give (working name)

## Mission
Connecting Somali communities through generosity, transparency and collective support.

## Problem
Somali families give quickly and generously — through WhatsApp groups, masjid collections and relatives who keep track by hand. That works, but donors can't see where money goes, organizers have no receipts or records, and scammers exploit the trust. General crowdfunding sites aren't in Somali and don't reflect the causes the community raises for (janaza costs, zakat, wells back home).

## Users
| User | Need |
| --- | --- |
| Organizer (individual/family) | Raise money fast for a person they know; share on WhatsApp; get paid out |
| Organizer (masjid, community group, nonprofit) | Run a project fundraiser with updates and a public record |
| Donor (diaspora) | Give safely, in Somali or English, to something they can trust; get a receipt |
| Reviewer / admin | Approve or reject fundraisers, verify organizers, act on reports, track payouts |

## Product inspiration (from UniteGive, reviewed 24 Oct 2026)
Observed publicly on unitegive.com: header with Browse / How it works / Fundraise and a "Start a campaign" button; a 3-step how-it-works (create → share → receive and withdraw); 0% platform fee funded by optional donor tips, with card processing (2.9% + $0.30) the only mandatory cost; sign-in/sign-up, dashboard and "My donations"; policy pages including Trust & Safety, Refund, Donor Guarantee and Disbursement. Not stated publicly: verification process, payout timing, campaign page layout. We adopt the **fee model concept** (no platform fee, optional tip) and the **simple create → share → receive flow**. We do not reuse any of its code, copy, branding or layout.

What Wadajir Give does differently: human review before publishing, an organizer verification badge that only appears when real, Somali as a first-class language, community-specific causes, and an explicit "not tax-deductible" notice.

## MVP scope (built)
**Public:** home, explore (category filter + search), fundraiser page, start a fundraiser, how it works, about, trust & safety, contact, FAQ, terms, privacy — all in `/en` and `/so`.
**Accounts:** sign up / log in (email + password, email confirmation), dashboard overview, my fundraisers, edit fundraiser, post updates, donation history, account settings, verification request.
**Admin:** overview, campaign review (approve / request changes / pause / close), verification queue, reports, donation monitoring (large-gift highlight), payout status tracking, users (verify / suspend), analytics.
**Payments:** Stripe Checkout in test mode, optional tip, receipt page, webhook reconciliation, refunds tracked.
**Trust:** review-before-publish, verified badge from a real flag, report button, honeypot + rate limits, RLS everywhere.

## Categories
Medical emergencies · Family assistance · Funeral support · Mosques & Islamic projects · Zakat & Sadaqah · Education & scholarships · Orphans & vulnerable families · Somalia humanitarian relief · Water wells · Community projects · Small business support.

## Rules the product must keep
- Never present personal fundraisers as tax-deductible.
- Never show totals, user counts, testimonials or badges that aren't real. Sample data is labelled "Sample" everywhere.
- Never certify a fundraiser as Zakat-eligible.
- Payouts only to eligible US organizers until international disbursement is confirmed with a licensed partner.
- No live payments without explicit owner approval (`ALLOW_LIVE_PAYMENTS` gate in code).

## Success metrics (post-launch)
Time from submission to review decision; % of fundraisers approved; donation conversion on fundraiser pages; report rate and time-to-action; share of traffic in Somali.

## Out of scope for MVP
Recurring donations, team fundraisers, mobile apps, non-USD currencies, direct payouts outside the US, mobile money (EVC Plus, Zaad, M-Pesa), comments.

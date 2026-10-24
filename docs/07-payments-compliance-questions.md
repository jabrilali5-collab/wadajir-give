# Payments & Compliance — Open Questions

**Status:** test mode only. Nothing here is legal advice; each item needs an answer from Stripe, a payments lawyer, or both before live money moves.

## What the code does today
- Stripe Checkout on the **platform** Stripe account, in test mode. Card data stays on Stripe's page.
- If an organizer's profile has a `stripe_account_id`, the charge becomes a **destination charge** to that Connect account and the donor tip is kept as `application_fee_amount`. Without one, funds stay on the platform account (fine for test mode; **not acceptable for live** — see Q2).
- `sk_live_` keys are ignored unless `ALLOW_LIVE_PAYMENTS=true`.

## What we confirmed (Stripe public docs, 24 Oct 2026)
- Stripe allows crowdfunding only through a platform **Stripe has approved** to use Connect; unapproved crowdfunding is a reason accounts get restricted. Stripe also lists "crowdfunding services" among unsupported financial services except via that approved-platform route. ([Prohibited & restricted businesses FAQ](https://support.stripe.com/questions/restricted-business-list-faqs))
- Self-serve Connect cross-border payouts from a US platform only reach connected accounts in the **US, UK, EEA, Canada and Switzerland**. Other countries need Stripe sales or Global Payouts, which shifts compliance (possibly money-transmitter licensing) onto the platform. ([Cross-border payouts](https://docs.stripe.com/connect/cross-border-payouts-to-recipients))
- Somalia is not in those regions → **no direct Stripe payouts to Somalia**. Organizers in the US must forward funds through licensed remittance providers.

## Open questions
1. **Stripe approval.** Apply to Stripe as a crowdfunding platform using Connect. What documentation, policies (refunds, donor guarantee, disbursement, prohibited uses) and review controls will Stripe require?
2. **Funds flow.** Destination charges with Express accounts (our current design) vs separate charges and transfers. Which does Stripe approve for us, and who is merchant of record?
3. **Money transmission.** With Connect, Stripe holds and moves funds. Confirm with counsel that Wadajir Give never takes possession of donor funds and doesn't need state money-transmitter licenses. What changes if we add Global Payouts or a remittance partner later?
4. **Sanctions / OFAC.** Somalia-related fundraising carries sanctions-screening obligations (e.g. al-Shabaab designations). What screening of organizers, beneficiaries and reports is required, and does Stripe's screening cover it?
5. **Tax.** Personal fundraisers are generally gifts, not deductible — we say so. How do we support registered 501(c)(3) organizations (masjids, nonprofits) issuing their own receipts? Do organizers above IRS thresholds receive 1099-K forms through Stripe?
6. **Tips.** Is the optional tip revenue to Wadajir Give? How must it be disclosed, and is it refundable?
7. **Zakat.** We don't certify Zakat eligibility. Do we want a scholar-reviewed policy or partner organizations for Zakat campaigns?
8. **Refunds & chargebacks.** Who absorbs chargebacks on destination charges? Set a refund window and a donor-guarantee policy.
9. **Holding funds.** Can we delay payouts while a report is investigated (Connect payout schedules / manual payouts)?
10. **International organizers.** Canada and UK organizers are reachable via Connect cross-border payouts — enable in Phase 2? Fees and currency?
11. **Remittance partners.** Which licensed providers (e.g. Dahabshiil, Amal, Taaj, WorldRemit) offer B2B or API disbursement to Somalia, Kenya and Ethiopia, and what KYC/AML do they require?
12. **Data retention.** How long must donation and KYC records be kept?

## Owner decisions needed
- Approve applying to Stripe for platform/crowdfunding approval (account registration — not done).
- Legal entity, jurisdiction and bank account for the platform.
- Whether to launch US-only first (recommended) or include Canada/UK.

/**
 * SAMPLE DATA — used only when Supabase is not configured (preview mode).
 * Every record is fictional and every UI surface showing it carries a "Sample" label.
 * Do not seed these into a production database.
 */
import type { Campaign, CampaignUpdate, PublicDonation } from "./types";

const base = {
  organizer_id: "sample",
  currency: "usd",
  review_note: null,
  payout_status: "not_started" as const,
  submitted_at: "2026-10-01T00:00:00Z",
  approved_at: "2026-10-02T00:00:00Z",
  status: "approved" as const,
  cover_image_url: null,
  is_sample: true,
};

export const sampleCampaigns: Campaign[] = [
  {
    ...base,
    id: "sample-1",
    slug: "sample-hospital-bills-minneapolis",
    organizer_name: "Sample Organizer A",
    organizer_verified: false,
    title: "Help a Minneapolis family with hospital bills",
    story:
      "This is sample text for preview purposes.\n\nA father of four was hospitalized after a sudden illness and cannot work for several months. The family is asking for help covering rent and medical costs not paid by insurance while he recovers.\n\nFunds would go toward three months of rent, outstanding hospital co-pays and transportation to follow-up appointments.",
    category: "medical",
    goal_cents: 1500000,
    raised_cents: 615000,
    donor_count: 48,
    beneficiary_name: "A local family (sample)",
    beneficiary_relationship: "friend",
    city: "Minneapolis",
    country: "United States",
    created_at: "2026-10-01T00:00:00Z",
  },
  {
    ...base,
    id: "sample-2",
    slug: "sample-water-well-gedo",
    organizer_name: "Sample Community Group",
    organizer_verified: false,
    title: "A shared water well for a village in Gedo",
    story:
      "This is sample text for preview purposes.\n\nResidents walk several hours a day to reach water during the dry season. A diaspora community group is raising money to drill and maintain a shallow well with a hand pump.\n\nThe budget covers drilling, the pump, a concrete platform and one year of maintenance.",
    category: "water-wells",
    goal_cents: 800000,
    raised_cents: 512000,
    donor_count: 91,
    beneficiary_name: "Village residents (sample)",
    beneficiary_relationship: "organization",
    city: "Gedo region",
    country: "Somalia",
    created_at: "2026-09-20T00:00:00Z",
  },
  {
    ...base,
    id: "sample-3",
    slug: "sample-funeral-support-columbus",
    organizer_name: "Sample Organizer B",
    organizer_verified: false,
    title: "Funeral and janaza costs for a beloved aunt",
    story:
      "This is sample text for preview purposes.\n\nOur aunt passed away unexpectedly. The family is raising money for the janaza, burial and support for her children during the mourning period.",
    category: "funeral",
    goal_cents: 1000000,
    raised_cents: 940000,
    donor_count: 132,
    beneficiary_name: "The family (sample)",
    beneficiary_relationship: "family",
    city: "Columbus",
    country: "United States",
    created_at: "2026-10-10T00:00:00Z",
  },
  {
    ...base,
    id: "sample-4",
    slug: "sample-mosque-roof-toronto",
    organizer_name: "Sample Masjid Committee",
    organizer_verified: false,
    title: "Repair the masjid roof before winter",
    story:
      "This is sample text for preview purposes.\n\nThe community masjid roof leaks during heavy rain and snow. The committee is raising money to replace the damaged section before winter.",
    category: "mosque",
    goal_cents: 3000000,
    raised_cents: 870000,
    donor_count: 64,
    beneficiary_name: "Community masjid (sample)",
    beneficiary_relationship: "organization",
    city: "Toronto",
    country: "Canada",
    created_at: "2026-09-28T00:00:00Z",
  },
  {
    ...base,
    id: "sample-5",
    slug: "sample-university-fees-seattle",
    organizer_name: "Sample Organizer C",
    organizer_verified: false,
    title: "First-year nursing school fees",
    story:
      "This is sample text for preview purposes.\n\nA first-generation college student was accepted to nursing school and needs help with the first-year tuition gap after scholarships.",
    category: "education",
    goal_cents: 600000,
    raised_cents: 150000,
    donor_count: 22,
    beneficiary_name: "Student (sample)",
    beneficiary_relationship: "self",
    city: "Seattle",
    country: "United States",
    created_at: "2026-10-12T00:00:00Z",
  },
  {
    ...base,
    id: "sample-6",
    slug: "sample-small-business-restart",
    organizer_name: "Sample Organizer D",
    organizer_verified: false,
    title: "Restart a family grocery stall after a fire",
    story:
      "This is sample text for preview purposes.\n\nA mother of three lost her grocery stall's stock in a market fire. She is raising money to restock and rebuild.",
    category: "small-business",
    goal_cents: 400000,
    raised_cents: 88000,
    donor_count: 15,
    beneficiary_name: "Business owner (sample)",
    beneficiary_relationship: "self",
    city: "Nairobi",
    country: "Kenya",
    created_at: "2026-10-14T00:00:00Z",
  },
];

export const sampleUpdates: Record<string, CampaignUpdate[]> = {
  "sample-2": [
    {
      id: "u1",
      campaign_id: "sample-2",
      body: "Sample update: a drilling contractor has provided a written quote. We'll share it here once the goal is reached.",
      created_at: "2026-10-08T00:00:00Z",
    },
  ],
};

export const sampleDonations: PublicDonation[] = [
  { id: "d1", display_name: "Sample donor", amount_cents: 5000, message: "Sample message of support.", created_at: "2026-10-15T00:00:00Z" },
  { id: "d2", display_name: "Anonymous", amount_cents: 10000, message: null, created_at: "2026-10-14T00:00:00Z" },
  { id: "d3", display_name: "Sample donor", amount_cents: 2500, message: null, created_at: "2026-10-13T00:00:00Z" },
];

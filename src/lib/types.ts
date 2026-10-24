export type CampaignStatus = "draft" | "pending_review" | "approved" | "rejected" | "paused" | "closed";
export type PayoutStatus = "not_started" | "onboarding" | "ready" | "paid" | "on_hold";
export type DonationStatus = "pending" | "succeeded" | "failed" | "refunded";
export type ReportStatus = "open" | "reviewing" | "resolved" | "dismissed";
export type VerificationStatus = "requested" | "in_review" | "approved" | "denied";
export type Role = "user" | "admin";

export interface Campaign {
  id: string;
  slug: string;
  organizer_id: string;
  organizer_name: string;
  organizer_verified: boolean;
  title: string;
  story: string;
  category: string;
  goal_cents: number;
  raised_cents: number;
  donor_count: number;
  currency: string;
  beneficiary_name: string;
  beneficiary_relationship: string;
  city: string | null;
  country: string | null;
  cover_image_url: string | null;
  status: CampaignStatus;
  review_note: string | null;
  payout_status: PayoutStatus;
  created_at: string;
  submitted_at: string | null;
  approved_at: string | null;
  /** True only for built-in preview data; never set on database rows. */
  is_sample?: boolean;
}

export interface CampaignUpdate {
  id: string;
  campaign_id: string;
  body: string;
  created_at: string;
}

export interface PublicDonation {
  id: string;
  display_name: string;
  amount_cents: number;
  message: string | null;
  created_at: string;
}

export interface Donation {
  id: string;
  campaign_id: string;
  campaign_title?: string;
  campaign_slug?: string;
  donor_id: string | null;
  donor_name: string | null;
  donor_email: string | null;
  is_anonymous: boolean;
  amount_cents: number;
  tip_cents: number;
  currency: string;
  status: DonationStatus;
  message: string | null;
  stripe_checkout_session_id: string | null;
  livemode: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  preferred_locale: "en" | "so";
  role: Role;
  is_verified_organizer: boolean;
  is_suspended: boolean;
  created_at: string;
}

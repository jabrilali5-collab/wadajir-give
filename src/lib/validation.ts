import { z } from "zod";
import { categorySlugs } from "./categories";

export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export const campaignSchema = z.object({
  title: z.string().trim().min(10, "Title must be at least 10 characters.").max(120),
  category: z.enum(categorySlugs),
  goal: z.coerce.number().int("Goal must be a whole number of dollars.").min(100, "Goal must be at least $100.").max(1_000_000),
  beneficiary_name: z.string().trim().min(2).max(120),
  beneficiary_relationship: z.enum(["self", "family", "friend", "organization"]),
  city: z.string().trim().max(80).optional().default(""),
  country: z.string().trim().max(80).optional().default(""),
  story: z.string().trim().min(100, "Story must be at least 100 characters.").max(10_000),
});

export const donationSchema = z.object({
  campaign_id: z.string().uuid(),
  amount: z.coerce.number().min(5, "Minimum donation is $5.").max(25_000, "Maximum donation is $25,000."),
  tip_percent: z.coerce.number().int().min(0).max(20).default(0),
  donor_name: z.string().trim().max(120).optional().default(""),
  donor_email: z.string().trim().toLowerCase().email().max(254),
  message: z.string().trim().max(500).optional().default(""),
  is_anonymous: z.boolean().default(false),
});

export const reportSchema = z.object({
  campaign_id: z.string().uuid(),
  reason: z.enum(["fraud", "misleading", "no_permission", "inappropriate", "other"]),
  details: z.string().trim().max(2000).optional().default(""),
});

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().toLowerCase().email().max(254),
  topic: z.enum(["general", "donation", "fundraiser", "safety"]),
  message: z.string().trim().min(10, "Message must be at least 10 characters.").max(4000),
});

/** Converts a dollar amount and tip percentage to integer cents. */
export function toCents(amountDollars: number, tipPercent: number) {
  const amount_cents = Math.round(amountDollars * 100);
  const tip_cents = Math.round((amount_cents * tipPercent) / 100);
  return { amount_cents, tip_cents };
}

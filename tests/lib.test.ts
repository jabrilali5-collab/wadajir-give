import { describe, expect, it } from "vitest";
import { formatMoney, progressPercent, slugify } from "../src/lib/format";
import { campaignSchema, donationSchema, toCents } from "../src/lib/validation";
import { safeNextClient } from "../src/lib/safe-next";
import { href, isLocale } from "../src/lib/i18n/config";
import en from "../src/lib/i18n/en";
import so from "../src/lib/i18n/so";

function keys(o: unknown, prefix = ""): string[] {
  if (typeof o !== "object" || o === null || Array.isArray(o)) return [prefix];
  return Object.entries(o).flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k));
}

describe("i18n", () => {
  it("Somali dictionary covers every English key", () => {
    expect(keys(so).sort()).toEqual(keys(en).sort());
  });
  it("builds locale paths", () => {
    expect(href("so", "/fundraisers")).toBe("/so/fundraisers");
    expect(href("en")).toBe("/en");
    expect(isLocale("so")).toBe(true);
    expect(isLocale("fr")).toBe(false);
  });
});

describe("money", () => {
  it("converts dollars and tip percent to integer cents", () => {
    expect(toCents(50, 10)).toEqual({ amount_cents: 5000, tip_cents: 500 });
    expect(toCents(19.99, 15)).toEqual({ amount_cents: 1999, tip_cents: 300 });
    expect(toCents(25, 0)).toEqual({ amount_cents: 2500, tip_cents: 0 });
  });
  it("formats and caps progress", () => {
    expect(formatMoney(150000, "en")).toBe("$1,500");
    expect(progressPercent(5000, 10000)).toBe(50);
    expect(progressPercent(20000, 10000)).toBe(100);
    expect(progressPercent(100, 0)).toBe(0);
  });
});

describe("validation", () => {
  const good = {
    title: "Help a family with hospital bills",
    category: "medical",
    goal: "1500",
    beneficiary_name: "Hodan",
    beneficiary_relationship: "family",
    story: "x".repeat(120),
  };
  it("accepts a valid campaign", () => {
    expect(campaignSchema.safeParse(good).success).toBe(true);
  });
  it("rejects short stories, unknown categories and tiny goals", () => {
    expect(campaignSchema.safeParse({ ...good, story: "short" }).success).toBe(false);
    expect(campaignSchema.safeParse({ ...good, category: "crypto" }).success).toBe(false);
    expect(campaignSchema.safeParse({ ...good, goal: "50" }).success).toBe(false);
  });
  it("enforces donation limits", () => {
    const base = { campaign_id: "4b1d3c1e-1111-4a2b-9c3d-123456789abc", donor_email: "a@b.co", is_anonymous: false };
    expect(donationSchema.safeParse({ ...base, amount: "4" }).success).toBe(false);
    expect(donationSchema.safeParse({ ...base, amount: "30000" }).success).toBe(false);
    expect(donationSchema.safeParse({ ...base, amount: "25", tip_percent: "50" }).success).toBe(false);
    expect(donationSchema.safeParse({ ...base, amount: "25", tip_percent: "10" }).success).toBe(true);
  });
});

describe("security helpers", () => {
  it("blocks open redirects", () => {
    expect(safeNextClient("/en/dashboard")).toBe("/en/dashboard");
    expect(safeNextClient("//evil.com")).toBeUndefined();
    expect(safeNextClient("https://evil.com")).toBeUndefined();
    expect(safeNextClient("/\\evil.com")).toBeUndefined();
  });
  it("slugifies titles", () => {
    expect(slugify("Caawi Qoyska Hodan — Minneapolis!")).toBe("caawi-qoyska-hodan-minneapolis");
  });
});

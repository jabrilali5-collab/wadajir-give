import type { Locale } from "./i18n/config";

export const categories = [
  { slug: "medical", en: "Medical emergencies", so: "Xaalado caafimaad oo degdeg ah" },
  { slug: "family", en: "Family assistance", so: "Taageerada qoyska" },
  { slug: "funeral", en: "Funeral support", so: "Taageerada aaska" },
  { slug: "mosque", en: "Mosques & Islamic projects", so: "Masaajid & mashaariic Islaami ah" },
  { slug: "zakat-sadaqah", en: "Zakat & Sadaqah", so: "Sako & Sadaqo" },
  { slug: "education", en: "Education & scholarships", so: "Waxbarasho & deeqo waxbarasho" },
  { slug: "orphans", en: "Orphans & vulnerable families", so: "Agoonta & qoysaska nugul" },
  { slug: "somalia-relief", en: "Somalia humanitarian relief", so: "Gargaarka bini'aadannimo ee Soomaaliya" },
  { slug: "water-wells", en: "Water wells", so: "Ceelal biyood" },
  { slug: "community", en: "Community projects", so: "Mashaariicda bulshada" },
  { slug: "small-business", en: "Small business support", so: "Taageerada ganacsiga yar" },
] as const;

export type CategorySlug = (typeof categories)[number]["slug"];

export const categorySlugs = categories.map((c) => c.slug) as [CategorySlug, ...CategorySlug[]];

export function categoryLabel(slug: string, locale: Locale): string {
  const c = categories.find((c) => c.slug === slug);
  return c ? c[locale] : slug;
}

export function isCategory(slug: string | undefined | null): slug is CategorySlug {
  return !!slug && categories.some((c) => c.slug === slug);
}

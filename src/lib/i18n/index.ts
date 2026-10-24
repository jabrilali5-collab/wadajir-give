import en, { type Dictionary } from "./en";
import so from "./so";
import type { Locale } from "./config";

const dictionaries: Record<Locale, Dictionary> = { en, so };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
export * from "./config";

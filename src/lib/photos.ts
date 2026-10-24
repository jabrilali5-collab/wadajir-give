/**
 * Editorial photography. All images are used under the Unsplash License (free for commercial use).
 * They illustrate cause areas and places — they are NOT photos of beneficiaries of any fundraiser.
 */
import type { StaticImageData } from "next/image";
import heroHargeisa from "@/assets/photos/hero-hargeisa.jpg";
import ctaAcacia from "@/assets/photos/cta-acacia.jpg";
import hillsGreen from "@/assets/photos/hills-green.jpg";
import camelsArabsiyo from "@/assets/photos/camels-arabsiyo.jpg";
import causeEducation from "@/assets/photos/cause-education.jpg";
import causeWater from "@/assets/photos/cause-water.jpg";
import causeHealth from "@/assets/photos/cause-health.jpg";
import causeRelief from "@/assets/photos/cause-relief.jpg";
import portraitMogadishu from "@/assets/photos/portrait-mogadishu.jpg";
import villageHills from "@/assets/photos/village-hills.jpg";

export interface Photo {
  src: StaticImageData;
  alt: string;
  place: string;
  credit: string;
  creditUrl: string;
}

const u = (handle: string) => `https://unsplash.com/@${handle}?utm_source=wadajir_give&utm_medium=referral`;

export const photos = {
  hero: { src: heroHargeisa, alt: "Hargeisa at sunset, the city spread beneath hills in golden light", place: "Hargeisa", credit: "Abdulkadir Hirabe", creditUrl: u("abdulkadirhirabe") },
  cta: { src: ctaAcacia, alt: "A lone acacia tree on red earth at sunset", place: "Tsavo East, Kenya", credit: "Damian Patkowski", creditUrl: u("damianpatkowski") },
  hills: { src: hillsGreen, alt: "Green hills with sun breaking through cloud over small homes", place: "Ngorongoro, Tanzania", credit: "Lesly Derksen", creditUrl: u("lderksen") },
  camels: { src: camelsArabsiyo, alt: "Two camels among granite boulders", place: "Dhagax Kure, Arabsiyo", credit: "Yasin Yusuf", creditUrl: u("yasinyusuf") },
  village: { src: villageHills, alt: "A village of red-earth homes on a hillside above green trees", place: "East Africa", credit: "Quentin Touvard", creditUrl: u("qt_picture") },
  portrait: { src: portraitMogadishu, alt: "A woman in a patterned headscarf smiling on a Mogadishu street", place: "Mogadishu", credit: "Abdulkadir Hirabe", creditUrl: u("abdulkadirhirabe") },
  education: { src: causeEducation, alt: "Children reading books together on the floor of a classroom", place: "Mogadishu", credit: "Ismail Salad Osman Hajji dirir", creditUrl: u("hajjidirir") },
  water: { src: causeWater, alt: "Children beside a hand water pump in a village", place: "East Africa", credit: "Andrew Itaga", creditUrl: u("and73w") },
  health: { src: causeHealth, alt: "A mother smiling at her young child", place: "East Africa", credit: "Moses Sichach", creditUrl: u("sichach") },
  relief: { src: causeRelief, alt: "A boy sitting beside relief tents on red earth", place: "Relief camp", credit: "Salah Darwish", creditUrl: u("salahdarwish") },
} satisfies Record<string, Photo>;

/**
 * Fallback cover for a fundraiser with no uploaded photo. Landscapes only: a photo of a real
 * person on someone else's fundraiser would imply they are the beneficiary.
 */
export function fallbackCover(category: string): Photo {
  const pool = [photos.hills, photos.village, photos.camels, photos.cta, photos.hero];
  let h = 0;
  for (const ch of category) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return pool[h % pool.length];
}

/** Illustrative photo for a cause area tile (not a specific fundraiser). */
export const causeAreas = [
  { key: "education", category: "education", photo: photos.education },
  { key: "water", category: "water-wells", photo: photos.water },
  { key: "health", category: "medical", photo: photos.health },
  { key: "relief", category: "somalia-relief", photo: photos.relief },
] as const;

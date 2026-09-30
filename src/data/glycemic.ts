/**
 * Glycemic index on the glucose scale (ISO 26642), from the international tables.
 * A value is stored only when those tables give a mean for that food and preparation.
 * Low carbohydrate foods are usually not tested. Missing stays missing.
 *
 * Glycemic load per 100 g = GI × available carbohydrate (g) / 100.
 */

import type { LocalizedText } from "../i18n/locale";
import type { FoodRecord } from "../scoring/types";

export const GLYCEMIC_SOURCES = {
  atkinson2021: {
    citation:
      "Atkinson FS, Brand-Miller JC, Foster-Powell K, Buyken AE, Goletzke J (2021). International tables of glycemic index and glycemic load values 2021. Am J Clin Nutr 114(5):1625–1632. Supplemental Table 1 (ISO 26642 methods).",
    doi: "10.1093/ajcn/nqab233",
  },
} as const;

export type GlycemicSourceId = keyof typeof GLYCEMIC_SOURCES;

/** ISO bands: low ≤55, medium 56–69, high ≥70. */
export type GlycemicBand = "low" | "medium" | "high";

interface GlycemicEntry {
  gi: number;
  tested: LocalizedText;
  /** True when the tested food is a close preparation, not this one. */
  carriedOver: boolean;
}

const BY_FOOD: Readonly<Record<string, GlycemicEntry>> = {
  potato_boiled: {
    gi: 73,
    tested: { en: "boiled potato, mean of 29 studies", de: "gekochte Kartoffel, Mittel aus 29 Studien" },
    carriedOver: false,
  },
  potato_steamed: {
    gi: 73,
    tested: { en: "boiled potato, mean of 29 studies; steamed was not tested on its own", de: "gekochte Kartoffel, Mittel aus 29 Studien; gedämpft wurde nicht eigens gemessen" },
    carriedOver: true,
  },
  potato_mash: {
    gi: 79,
    tested: { en: "mashed potato, mean of 5 studies", de: "Kartoffelpüree, Mittel aus 5 Studien" },
    carriedOver: false,
  },
  potato_mash_instant: {
    gi: 84,
    tested: { en: "instant mashed potato, mean of 5 studies", de: "Instant-Kartoffelpüree, Mittel aus 5 Studien" },
    carriedOver: false,
  },
  sweet_potato_boiled: {
    gi: 46,
    tested: { en: "boiled sweet potato, mean of 13 studies", de: "gekochte Süßkartoffel, Mittel aus 13 Studien" },
    carriedOver: false,
  },
  sweet_potato_baked: {
    gi: 86,
    tested: { en: "roasted sweet potato, mean of 11 studies", de: "geröstete Süßkartoffel, Mittel aus 11 Studien" },
    carriedOver: false,
  },
  lentils_boiled: {
    gi: 16,
    tested: { en: "boiled lentils, mean of 8 foods", de: "gekochte Linsen, Mittel aus 8 Lebensmitteln" },
    carriedOver: false,
  },
  red_lentils_boiled: {
    gi: 16,
    tested: { en: "boiled lentils, mean of 8 foods; red lentils were not listed apart", de: "gekochte Linsen, Mittel aus 8 Lebensmitteln; rote Linsen stehen nicht extra" },
    carriedOver: true,
  },
  chickpeas_boiled: {
    gi: 36,
    tested: {
      en: "canned drained chickpeas, two ISO tests (35 and 38); boiled chickpeas were not listed apart",
      de: "Kichererbsen aus der Dose, abgegossen, zwei ISO-Tests (35 und 38); gekochte stehen nicht extra",
    },
    carriedOver: true,
  },
  kidney_beans_boiled: {
    gi: 40,
    tested: {
      en: "canned drained red kidney beans, two ISO tests (36 and 43); boiled beans were not listed apart",
      de: "rote Kidneybohnen aus der Dose, abgegossen, zwei ISO-Tests (36 und 43); gekochte stehen nicht extra",
    },
    carriedOver: true,
  },
  carrot_boiled: {
    gi: 32,
    tested: { en: "carrots, mean of 2 foods", de: "Karotten, Mittel aus 2 Lebensmitteln" },
    carriedOver: false,
  },
  milk_whole: {
    gi: 37,
    tested: { en: "full-fat milk, mean of 3 studies", de: "Vollmilch, Mittel aus 3 Studien" },
    carriedOver: false,
  },
  yogurt_plain_whole: {
    gi: 33,
    tested: { en: "all yoghurts, mean of 72 studies", de: "alle Joghurts, Mittel aus 72 Studien" },
    carriedOver: false,
  },
};

/** Available carbohydrate below which the tables usually do not test a GI. */
export const GI_CARB_FLOOR_G = 5;

export type GlycemicAssessment =
  | { status: "value"; gi: number; band: GlycemicBand; loadPer100g: number; tested: LocalizedText; carriedOver: boolean; source: GlycemicSourceId }
  | { status: "tooLittleCarbohydrate"; availableCarbG: number }
  | { status: "noData" };

export function availableCarbG(food: FoodRecord): number {
  return food.carbs.sugars + food.carbs.starch;
}

export function glycemicBand(gi: number): GlycemicBand {
  if (gi <= 55) return "low";
  if (gi <= 69) return "medium";
  return "high";
}

/** Glycemic load of 100 g. */
export function glycemicLoad(gi: number, carbG: number): number {
  return Math.round((gi * carbG) / 10) / 10;
}

export function glycemicAssessment(food: FoodRecord): GlycemicAssessment {
  const entry = BY_FOOD[food.id];
  const carbs = availableCarbG(food);
  if (!entry) {
    return carbs < GI_CARB_FLOOR_G ? { status: "tooLittleCarbohydrate", availableCarbG: Math.round(carbs * 10) / 10 } : { status: "noData" };
  }
  return {
    status: "value",
    gi: entry.gi,
    band: glycemicBand(entry.gi),
    loadPer100g: glycemicLoad(entry.gi, carbs),
    tested: entry.tested,
    carriedOver: entry.carriedOver,
    source: "atkinson2021",
  };
}

export const GLYCEMIC_FOOD_IDS: readonly string[] = Object.keys(BY_FOOD);

/** Cooled cooked potato, for the preparation note. Same tables, not a catalog food. */
export const COOLED_POTATO_GI = 49;

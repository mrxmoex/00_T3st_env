/**
 * Documented conversion and bioavailability coefficients.
 * These are literature midpoints, not individual absorption rates.
 * Versioned with the dataset. See docs/scoring-formulas.md.
 */

import type { MicroNutrient } from "../scoring/types";

/** FAO 2013 adult amino acid scoring pattern, mg/g protein. */
export const FAO_2013_ADULT_MG_PER_G = {
  his: 15,
  ile: 30,
  leu: 61,
  lys: 48,
  saa: 23,
  aaa: 41,
  thr: 25,
  trp: 6.6,
  val: 40,
} as const;

/** Conservative ALA → long-chain conversion (adult mixed-sex literature mid-low). */
export const ALA_TO_EPA_EFFICIENCY = 0.08;
export const ALA_TO_DHA_EFFICIENCY = 0.01;

/** µg RAE per µg carotenoid in mixed food (IOM / EFSA food conversion). */
export const BETA_CAROTENE_TO_RAE = 1 / 12;
export const OTHER_CAROTENOID_TO_RAE = 1 / 24;

/** Fractional absorption midpoints used for iron adjustment. */
export const IRON_ABSORPTION = {
  heme: 0.25,
  nonhemeBase: 0.05,
  nonhemeWithVitaminC: 0.12,
  nonhemeHighPhytate: 0.03,
} as const;

/** Share of iron present as heme in meat, fish, and organs ("mixed" iron form). */
export const HEME_SHARE_OF_MIXED_IRON = 0.6;

export const ZINC_ABSORPTION = {
  animal: 0.4,
  lowPhytatePlant: 0.25,
  phytateBound: 0.15,
} as const;

/**
 * FDA Daily Values for adults (21 CFR 101.9, 2016 rule), used only for density per
 * calorie, not as clinical advice. Units match MicrosPer100g: mg, µg RAE, µg DFE, µg.
 */
export const DENSITY_REFS: Readonly<Record<MicroNutrient, number>> = {
  iron: 18,
  zinc: 11,
  vitaminA: 900,
  vitaminB12: 2.4,
  folate: 400,
  vitaminC: 90,
  vitaminD: 20,
  vitaminE: 15,
  vitaminK: 120,
  thiamin: 1.2,
  riboflavin: 1.3,
  niacin: 16,
  vitaminB6: 1.7,
  choline: 550,
  calcium: 1300,
  magnesium: 420,
  potassium: 4700,
  copper: 0.9,
  selenium: 55,
  iodine: 150,
};

export const DENSITY_REF_UNITS: Readonly<Record<MicroNutrient, string>> = {
  iron: "mg",
  zinc: "mg",
  vitaminA: "µg RAE",
  vitaminB12: "µg",
  folate: "µg DFE",
  vitaminC: "mg",
  vitaminD: "µg",
  vitaminE: "mg",
  vitaminK: "µg",
  thiamin: "mg",
  riboflavin: "mg",
  niacin: "mg",
  vitaminB6: "mg",
  choline: "mg",
  calcium: "mg",
  magnesium: "mg",
  potassium: "mg",
  copper: "mg",
  selenium: "µg",
  iodine: "µg",
};

/** %DV per 100 kcal at which one nutrient counts as fully covered (FDA "excellent source" level). */
export const DENSITY_SATURATION_PCT_DV = 20;

/**
 * EFSA tolerable upper intake levels for adults, per day (EFSA 2006 compendium; selenium
 * 2023, vitamin B6 2023, vitamin D 2023). Vitamin A applies to preformed retinol only.
 * When 100 kcal of a food already exceed a whole day's UL, that nutrient counts as a cost.
 */
export const UPPER_LIMITS: Readonly<Partial<Record<MicroNutrient, number>>> = {
  vitaminA: 3000,
  iodine: 600,
  selenium: 255,
  copper: 5,
  zinc: 25,
  vitaminD: 100,
  calcium: 2500,
  vitaminB6: 12,
};

export const VITAMIN_C_IRON_ENHANCER_MG = 25;

export const DATASET_VERSION = "2026.09.27";
export const LAST_VERIFIED = "2026-09-27";

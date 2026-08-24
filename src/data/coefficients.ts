/**
 * Documented conversion and bioavailability coefficients.
 * These are literature midpoints, not individual absorption rates.
 * Versioned with the dataset. See docs/scoring-formulas.md.
 */

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

export const ZINC_ABSORPTION = {
  animal: 0.4,
  lowPhytatePlant: 0.25,
  phytateBound: 0.15,
} as const;

/** Adult reference intakes used only for density-per-calorie (not clinical RDA advice). */
export const DENSITY_REFS = {
  ironMg: 18,
  zincMg: 11,
  vitaminARaeUg: 900,
  vitaminB12Ug: 2.4,
  folateUg: 400,
  vitaminCMg: 90,
  vitaminDUg: 20,
  vitaminKUg: 120,
  calciumMg: 1000,
  seleniumUg: 55,
  iodineUg: 150,
  cholineMg: 550,
  magnesiumMg: 400,
} as const;

export const VITAMIN_C_IRON_ENHANCER_MG = 25;

export const DATASET_VERSION = "2026.08.24";
export const LAST_VERIFIED = "2026-08-24";

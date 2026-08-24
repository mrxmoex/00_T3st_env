import type { AminoAcidKey } from "./types";

/** FAO/WHO/UNU 2007 adult scoring pattern, mg/g protein. */
export const FAO_2007_PATTERN = {
  his: 15,
  ile: 30,
  leu: 59,
  lys: 45,
  saa: 22,
  aaa: 38,
  thr: 23,
  trp: 6,
  val: 39,
} as const;

export const AMINO_ACID_KEYS: readonly AminoAcidKey[] = [
  "his",
  "ile",
  "leu",
  "lys",
  "met",
  "cys",
  "phe",
  "tyr",
  "thr",
  "trp",
  "val",
] as const;

/** Mid estimate of ALA → long-chain n-3 (EPA-equivalent). DHA conversion is lower. */
export const ALA_TO_LC_N3 = 0.08;

export const IRON_HEME = 1.0;
export const IRON_NONHEME = 0.35;
export const IRON_MIXED = 0.7;

export const ZINC_ANIMAL = 1.0;
export const ZINC_PHYTATE = 0.4;

export const VITAMIN_A_RETINOL = 1.0;
/** Extra uncertainty after RAE 12:1 / 24:1 conversion. */
export const VITAMIN_A_CAROTENOID = 0.7;
export const VITAMIN_A_MIXED = 0.85;

export const B12_BIOACTIVE = 1.0;
export const B12_ANALOG_OR_ABSENT = 0.0;

export const MICRO_REFS = {
  ironMg: 8,
  zincMg: 11,
  vitaminARae: 900,
  b12Ug: 2.4,
  folateUg: 400,
  vitaminCMg: 90,
  vitaminDUg: 15,
  calciumMg: 1000,
  seleniumUg: 55,
  iodineUg: 150,
} as const;

export const MICRO_WEIGHTS = {
  ironMg: 1.4,
  zincMg: 1.3,
  vitaminARae: 1.3,
  b12Ug: 1.5,
  folateUg: 0.8,
  vitaminCMg: 0.7,
  vitaminDUg: 1.0,
  calciumMg: 0.8,
  seleniumUg: 0.8,
  iodineUg: 1.2,
} as const;

export const SURFACE_RISK = {
  low: 0.22,
  medium: 0.5,
  high: 0.9,
} as const;

export const DIAAS_SURPLUS_CAP = 1.18;
export const DIAAS_SURPLUS_POINTS = 8;

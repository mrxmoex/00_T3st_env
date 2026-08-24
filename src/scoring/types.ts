/**
 * Domain types for the biochemical evaluation matrix.
 * Scores are 0–100 unless noted. Formulas live in sibling modules.
 */

export const PLANT_CLASSES = [
  "leafy_salad",
  "legumes",
  "sprouts",
  "cruciferous_fresh",
  "cruciferous_fermented",
  "mushrooms",
  "algae",
  "roots_tubers",
  "other_vegetables",
] as const;

export const ANIMAL_CLASSES = [
  "muscle_ruminant",
  "muscle_monogastric",
  "muscle_poultry",
  "muscle_fish",
  "organs",
  "eggs",
  "dairy",
  "fermented_animal",
] as const;

export const FOOD_CLASSES = [...PLANT_CLASSES, ...ANIMAL_CLASSES] as const;

export type PlantClass = (typeof PLANT_CLASSES)[number];
export type AnimalClass = (typeof ANIMAL_CLASSES)[number];
export type FoodClass = (typeof FOOD_CLASSES)[number];

export const KINGDOMS = ["plant", "animal"] as const;
export type Kingdom = (typeof KINGDOMS)[number];

export const DIETARY_PATTERNS = [
  "plant-only",
  "animal-inclusive",
  "hybrid",
] as const;
export type DietaryPattern = (typeof DIETARY_PATTERNS)[number];

export const TIERS = ["S", "A", "B", "C", "D"] as const;
export type Tier = (typeof TIERS)[number];

export const AXIS_KEYS = [
  "eaa",
  "efa",
  "carb",
  "micro",
  "fibre",
  "residue",
  "degradation",
  "composite",
] as const;
export type AxisKey = (typeof AXIS_KEYS)[number];

export const SURFACE_AREA_CLASSES = ["high", "medium", "low", "none"] as const;
export type SurfaceAreaClass = (typeof SURFACE_AREA_CLASSES)[number];

export const HEAVY_METAL_CLASSES = ["low", "moderate", "elevated"] as const;
export type HeavyMetalClass = (typeof HEAVY_METAL_CLASSES)[number];

export const VET_RESIDUE_CLASSES = ["none", "low", "moderate"] as const;
export type VetResidueClass = (typeof VET_RESIDUE_CLASSES)[number];

export const PROCESSING_STABILITY = [
  "fresh",
  "fermented",
  "dried",
  "cooked",
] as const;
export type ProcessingStability = (typeof PROCESSING_STABILITY)[number];

export const IRON_FORMS = ["heme", "nonheme", "mixed"] as const;
export type IronForm = (typeof IRON_FORMS)[number];

export interface AminoAcidsMgPerGProtein {
  his: number;
  ile: number;
  leu: number;
  lys: number;
  met: number;
  cys: number;
  phe: number;
  tyr: number;
  thr: number;
  trp: number;
  val: number;
}

export interface FattyAcidsGPer100g {
  sfa: number;
  mufa: number;
  pufa: number;
  omega3Ala: number;
  omega3Epa: number;
  omega3Dha: number;
  omega6La: number;
  omega6Aa: number;
  oddChain: number;
  cla: number;
}

export interface CarbsGPer100g {
  total: number;
  sugars: number;
  starch: number;
  fibre: number;
  resistantStarch: number;
}

export interface MicrosPer100g {
  ironMg: number;
  ironForm: IronForm;
  zincMg: number;
  zincBoundByPhytate: boolean;
  vitaminARetinolUg: number;
  vitaminABetaCaroteneUg: number;
  vitaminAOtherCarotenoidsUg: number;
  vitaminB12Ug: number;
  /** True when measured B12 is largely inactive corrinoid analogues (typical of many algae). */
  b12IsAnalogue: boolean;
  folateUg: number;
  vitaminCMg: number;
  vitaminDUg: number;
  vitaminKUg: number;
  calciumMg: number;
  seleniumUg: number;
  iodineUg: number;
  cholineMg: number;
  magnesiumMg: number;
}

export interface AnimalExclusiveCompounds {
  creatineMg: number;
  taurineMg: number;
  carnosineMg: number;
}

export interface ResidueProfile {
  surfaceAreaClass: SurfaceAreaClass;
  systemicPesticideLikelihood: number;
  contactPesticideLikelihood: number;
  typicalMrlProximity: number;
  heavyMetalClass: HeavyMetalClass;
  veterinaryResidueClass: VetResidueClass;
}

export interface DegradationProfile {
  waterSolubleVitaminLoad: number;
  cutSurfaceSensitivity: number;
  heatSensitivity: number;
  oxygenLightSensitivity: number;
  perishabilityDays: number;
  processingStability: ProcessingStability;
}

export interface SourceRef {
  label: string;
  id?: string;
  url?: string;
  note?: string;
}

export interface FoodRecord {
  id: string;
  name: string;
  nameDe: string;
  class: FoodClass;
  edibleState: string;
  fdcId?: string;
  kcalPer100g: number;
  proteinG: number;
  fatG: number;
  aminoAcids: AminoAcidsMgPerGProtein;
  /** True ileal digestibility coefficient (0–1), FAO DIAAS convention. */
  ilealDigestibility: number;
  fattyAcids: FattyAcidsGPer100g;
  carbs: CarbsGPer100g;
  micros: MicrosPer100g;
  animalCompounds: AnimalExclusiveCompounds;
  residue: ResidueProfile;
  degradation: DegradationProfile;
  /** 0–1 expert-curated phytochemical load relative to class peak. */
  phytochemicalIndex: number;
  sources: SourceRef[];
  notes: string[];
}

export interface AxisBreakdown {
  score: number;
  parts: Record<string, number>;
  flags: string[];
}

export interface EaaBreakdown extends AxisBreakdown {
  aas: number;
  diaas: number;
  pdcaas: number;
  limitingAa: string;
  ratios: Record<string, number>;
}

export interface CarbBreakdown extends AxisBreakdown {
  activeG: number;
  passiveG: number;
  activeScore: number;
  passiveScore: number;
}

export interface MicroBreakdown extends AxisBreakdown {
  raeUg: number;
  absorbableIronMg: number;
  absorbableZincMg: number;
  effectiveB12Ug: number;
}

export interface ScoreCard {
  foodId: string;
  eaa: EaaBreakdown;
  efa: AxisBreakdown;
  carb: CarbBreakdown;
  micro: MicroBreakdown;
  fibre: AxisBreakdown;
  residue: AxisBreakdown;
  degradation: AxisBreakdown;
  extras: Record<string, number>;
  composite: number;
  tier: Tier;
  classRank: number;
  classSize: number;
}

export interface ClassWeights {
  eaa: number;
  efa: number;
  carb: number;
  micro: number;
  fibre: number;
  residue: number;
  degradation: number;
}

export function kingdomOf(foodClass: FoodClass): Kingdom {
  switch (foodClass) {
    case "leafy_salad":
    case "legumes":
    case "sprouts":
    case "cruciferous_fresh":
    case "cruciferous_fermented":
    case "mushrooms":
    case "algae":
    case "roots_tubers":
    case "other_vegetables":
      return "plant";
    case "muscle_ruminant":
    case "muscle_monogastric":
    case "muscle_poultry":
    case "muscle_fish":
    case "organs":
    case "eggs":
    case "dairy":
    case "fermented_animal":
      return "animal";
    default: {
      const _exhaustive: never = foodClass;
      return _exhaustive;
    }
  }
}

export function isPlantClass(foodClass: FoodClass): foodClass is PlantClass {
  return kingdomOf(foodClass) === "plant";
}

export function isAnimalClass(foodClass: FoodClass): foodClass is AnimalClass {
  return kingdomOf(foodClass) === "animal";
}

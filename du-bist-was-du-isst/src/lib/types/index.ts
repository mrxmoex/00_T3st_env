/** Strict food ontology — plant categories are fundamentally unequal. */

export const PLANT_CATEGORIES = [
  "leafy_greens",
  "legumes",
  "sprouts_microgreens",
  "fermented",
  "mushrooms_fungi",
  "algae_seaweed",
] as const;

export const ANIMAL_CATEGORIES = [
  "muscle_meat",
  "organs",
  "eggs",
  "dairy",
  "fish_seafood",
] as const;

export type PlantCategory = (typeof PLANT_CATEGORIES)[number];
export type AnimalCategory = (typeof ANIMAL_CATEGORIES)[number];
export type FoodCategory = PlantCategory | AnimalCategory;

export const EVALUATION_AXES = [
  "nutrient_density",
  "protein_quality",
  "essential_fatty_acids",
  "carbohydrate_quality",
  "bioavailability_antinutrients",
  "unique_bioactives",
  "practical_efficiency",
] as const;

export type EvaluationAxis = (typeof EVALUATION_AXES)[number];

export type Tier = "S" | "A" | "B" | "C" | "D";

export type Locale = "de" | "en";

export type LocalizedString = Record<Locale, string>;

export interface SourceReference {
  id: string;
  title: string;
  url: string;
  year: number;
  organization: string;
}

export interface Penalty {
  reason: LocalizedString;
  magnitude: number;
  sourceIds: string[];
}

export interface Tradeoff {
  relatedAxis: EvaluationAxis;
  note: LocalizedString;
}

export interface AxisScore {
  raw: number;
  adjusted: number;
  tier: Tier;
  methodology: LocalizedString;
  sourceIds: string[];
  penalties?: Penalty[];
  tradeoffs?: Tradeoff[];
  dataQuality?: "verified" | "sparse" | "contested";
}

export interface NutrientProfile {
  /** Per 100 g edible portion */
  energyKcal: number;
  proteinG: number;
  fatG: number;
  carbsG: number;
  fiberG: number;
  sugarsG: number;
  /** Micronutrients per 100 g */
  ironMg: number;
  zincMg: number;
  calciumMg: number;
  magnesiumMg: number;
  potassiumMg: number;
  vitaminCMg: number;
  vitaminB12Mcg: number;
  folateMcg: number;
  vitaminAMcgRae: number;
  vitaminDIu: number;
  vitaminEMg: number;
  vitaminKMcg: number;
  omega3AlaG: number;
  omega3EpaG: number;
  omega3DhaG: number;
  omega6G: number;
  /** Resistant starch g if known */
  resistantStarchG?: number;
}

export interface ProteinQuality {
  method: "DIAAS" | "PDCAAS";
  score: number;
  limitingAminoAcid?: string;
  isComplete: boolean;
  sourceIds: string[];
}

export interface BioavailabilityProfile {
  ironType: "heme" | "non_heme" | "none";
  ironAbsorptionModifier: number;
  phytateLoad: "none" | "low" | "moderate" | "high";
  oxalateLoad: "none" | "low" | "moderate" | "high";
  lectinLoad: "none" | "low" | "moderate" | "high";
  b12Status: "preformed" | "active_algae" | "inactive_analog" | "absent";
  retinolStatus: "preformed" | "carotenoid_only" | "absent";
  epaDhaStatus: "preformed" | "ala_only" | "algae_source" | "absent";
  alaConversionEfficiency?: number;
  sourceIds: string[];
}

export interface BioactiveProfile {
  items: Array<{
    name: LocalizedString;
    presence: "high" | "moderate" | "low" | "absent";
    note?: LocalizedString;
  }>;
  sourceIds: string[];
}

export interface ResidueProfile {
  pesticideLoad: "low" | "moderate" | "high" | "unknown";
  surfaceAreaRisk: "low" | "moderate" | "high";
  mitigation: LocalizedString;
  sourceIds: string[];
}

export interface PreparationProfile {
  requiredSteps: LocalizedString[];
  stability: "high" | "moderate" | "low";
  heatLability: LocalizedString;
  yieldNotes: LocalizedString;
  sourceIds: string[];
}

export interface FoodItem {
  id: string;
  name: LocalizedString;
  kingdom: "plant" | "animal";
  category: FoodCategory;
  usdaFdcId?: number;
  nutrientProfile: NutrientProfile;
  proteinQuality: ProteinQuality;
  bioavailability: BioavailabilityProfile;
  bioactives: BioactiveProfile;
  residues?: ResidueProfile;
  preparation: PreparationProfile;
  axisScores: Record<EvaluationAxis, AxisScore>;
  overallTier: Tier;
  classTier: Tier;
  globalTier: Tier;
  dataFlags: Array<"sparse" | "contested" | "estimated">;
  sourceIds: string[];
}

export interface ScoredFood extends FoodItem {
  compositeScore: number;
}

export interface Invariant {
  id: string;
  title: LocalizedString;
  body: LocalizedString;
  sourceIds: string[];
}

export type Kingdom = "plant" | "animal";

export type PlantClass =
  | "leafy_salad"
  | "legumes_beans"
  | "sprouts"
  | "cruciferous_kraut"
  | "mushrooms"
  | "algae_seaweed"
  | "roots_tubers"
  | "other_vegetables";

export type AnimalClass =
  | "muscle_ruminant"
  | "muscle_monogastric"
  | "muscle_poultry"
  | "muscle_fish"
  | "organs"
  | "eggs"
  | "dairy"
  | "fermented_animal";

export type FoodClass = PlantClass | AnimalClass;

export type ScoreAxis =
  | "eaa_digestibility"
  | "efa_glyceride"
  | "carb_type"
  | "micronutrient_bioavail"
  | "fibre_phyto"
  | "residue_risk"
  | "degradation"
  | "composite";

export type Tier = "S" | "A" | "B" | "C" | "D";

export type DietaryPattern = "plant_only" | "animal_inclusive" | "hybrid";

export type ValueFlag = "measured" | "derived" | "estimate" | "literature";

export type ProteinCompleteness = "complete" | "incomplete";

export type B12Form = "active" | "absent" | "analog";

export type IronForm = "heme" | "nonheme" | "mixed";

export type VitaminAForm = "retinol" | "carotenoid" | "mixed";

export interface AminoAcidsGPer100g {
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
  ala: number;
  epa: number;
  dha: number;
  linoleic: number;
  cla: number;
  oddChain: number;
  claFlag: ValueFlag;
  oddChainFlag: ValueFlag;
}

export interface CarbsGPer100g {
  total: number;
  sugars: number;
  fiber: number;
  starch: number;
  starchFlag: ValueFlag;
  resistantStarch: number;
  resistantStarchFlag: ValueFlag;
}

export interface MicrosPer100g {
  ironMg: number;
  ironForm: IronForm;
  hemeFraction: number;
  zincMg: number;
  zincBoundToPhytate: boolean;
  vitaminARaeUg: number;
  vitaminAForm: VitaminAForm;
  carotenoidFraction: number;
  vitaminCMg: number;
  b12Ug: number;
  b12Form: B12Form;
  folateUg: number;
  cholineMg: number;
  vitaminDUg: number;
  iodineUg: number;
  iodineFlag: ValueFlag;
}

export interface ResidueProfile {
  pdpDetectRate: number;
  heavyMetalRisk: number;
  mercuryRisk: number;
  iodineExcessRisk: number;
  note: string;
  sourceId: string;
}

export interface QualityInputs {
  ilealDigestibility: number;
  digestibilityFlag: ValueFlag;
  digestibilitySourceId: string;
  publishedDiaas: number | null;
  publishedPdcaas: number | null;
  qualityIndexSourceId: string | null;
  phytateMg: number | null;
  phytateFlag: ValueFlag;
  phytochemicalTags: readonly string[];
  residue: ResidueProfile;
  waterActivity: number;
  fermented: boolean;
  dried: boolean;
}

export interface AnimalExclusiveMarkers {
  creatine: boolean;
  taurine: boolean;
  carnosine: boolean;
  longChainEpaDha: boolean;
  activeB12: boolean;
  hemeIron: boolean;
  preformedRetinol: boolean;
}

export interface SourceRef {
  id: string;
  title: string;
  publisher: string;
  url: string;
  accessed: string;
  notes?: string;
}

export interface Food {
  id: string;
  name: string;
  nameDe: string;
  kingdom: Kingdom;
  foodClass: FoodClass;
  fdcId: number | null;
  state: string;
  energyKcal: number;
  proteinG: number;
  fatG: number;
  aminoAcids: AminoAcidsGPer100g;
  fattyAcids: FattyAcidsGPer100g;
  carbs: CarbsGPer100g;
  micros: MicrosPer100g;
  quality: QualityInputs;
  animalExclusive: AnimalExclusiveMarkers;
  sourceIds: readonly string[];
  notes: readonly string[];
}

export interface AxisBreakdown {
  axis: ScoreAxis;
  score: number;
  formulaId: string;
  inputs: Readonly<Record<string, number | string | boolean | null>>;
  notes: readonly string[];
}

export interface EaaResult {
  completeness: ProteinCompleteness;
  limitingAminoAcid: string;
  aminoAcidScores: Readonly<Record<string, number>>;
  chemicalScore: number;
  digestibility: number;
  diaasLike: number;
  usedPublishedDiaas: boolean;
  score: number;
}

export interface FoodEvaluation {
  foodId: string;
  scores: Readonly<Record<ScoreAxis, number>>;
  tiers: Readonly<Record<ScoreAxis, Tier>>;
  eaa: EaaResult;
  breakdowns: readonly AxisBreakdown[];
}

export interface DatasetMeta {
  name: string;
  version: string;
  lastVerified: string;
  unitBasis: "per_100g";
  notes: readonly string[];
}

export interface Recommendation {
  id: string;
  severity: "required" | "advised" | "context";
  title: string;
  body: string;
}

export interface RecommendationReport {
  pattern: DietaryPattern;
  cannotClaim: readonly string[];
  items: readonly Recommendation[];
  suggestedFoodIds: readonly string[];
}

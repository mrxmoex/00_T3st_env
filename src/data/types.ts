export type Kingdom = "plant" | "animal";

export type PlantClass =
  | "leafy_salad"
  | "legumes"
  | "sprouts"
  | "cruciferous_kraut"
  | "mushrooms"
  | "algae"
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

export type ProteinQualityMethod = "DIAAS" | "PDCAAS" | "estimated";

export type IronForm = "heme" | "nonheme" | "mixed";

export type VitaminAForm = "retinol" | "carotenoid" | "mixed";

export type SurfaceAreaClass = "low" | "medium" | "high";

export type AminoAcidKey =
  | "his"
  | "ile"
  | "leu"
  | "lys"
  | "met"
  | "cys"
  | "phe"
  | "tyr"
  | "thr"
  | "trp"
  | "val";

export type AminoAcidProfile = Record<AminoAcidKey, number>;

export interface FattyAcidProfile {
  sfa: number;
  mufa: number;
  pufa: number;
  ala: number;
  epa: number;
  dha: number;
  la: number;
  aa: number;
  oddChain: number;
  cla: number;
}

export interface CarbProfile {
  sugars: number;
  starch: number;
  fibre: number;
  resistantStarch: number;
}

export interface MicronutrientProfile {
  ironMg: number;
  ironForm: IronForm;
  zincMg: number;
  zincPhytateBound: boolean;
  vitaminARae: number;
  vitaminAForm: VitaminAForm;
  b12Ug: number;
  b12Bioactive: boolean;
  folateUg: number;
  vitaminCMg: number;
  vitaminDUg: number;
  calciumMg: number;
  seleniumUg: number;
  iodineUg: number;
}

export interface ExclusiveCompounds {
  creatineMg: number;
  taurineMg: number;
  carnosineMg: number;
}

export interface ResidueProfile {
  surfaceAreaClass: SurfaceAreaClass;
  systemicRisk: number;
  contactRisk: number;
  mrlExceedanceRate: number;
  aquaticMercuryRisk: number;
}

export interface DegradationProfile {
  waterSolubleVitaminRisk: number;
  fatSolubleOxidationRisk: number;
  cuttingSensitivity: number;
  heatSensitivity: number;
  storageDaysTypical: number;
}

export interface SourceRef {
  id: string;
  label: string;
  url: string;
  retrieved: string;
  notes?: string;
}

export interface FoodBase {
  id: string;
  name: string;
  nameDe: string;
  ediblePortionNote: string;
  kcalPer100g: number;
  proteinG: number;
  fatG: number;
  waterG: number;
  aminoAcids: AminoAcidProfile;
  proteinQuality: {
    method: ProteinQualityMethod;
    value: number;
    sourceId: string;
  };
  fattyAcids: FattyAcidProfile;
  carbs: CarbProfile;
  micros: MicronutrientProfile;
  exclusive: ExclusiveCompounds;
  phytochemicalLoad: number;
  residues: ResidueProfile;
  degradation: DegradationProfile;
  fermented: boolean;
  fortified: boolean;
  sources: SourceRef[];
  lastVerified: string;
  estimateFlags: string[];
}

export interface PlantFood extends FoodBase {
  kingdom: "plant";
  foodClass: PlantClass;
}

export interface AnimalFood extends FoodBase {
  kingdom: "animal";
  foodClass: AnimalClass;
}

export type Food = PlantFood | AnimalFood;

export type ScoreAxis =
  | "eaa"
  | "fat"
  | "carb"
  | "micro"
  | "fibre"
  | "residue"
  | "degradation"
  | "composite";

export type AxisWeights = Record<Exclude<ScoreAxis, "composite">, number>;

export type Tier = "S" | "A" | "B" | "C" | "D";

export type DietaryPattern = "plant-only" | "animal-inclusive" | "hybrid";

export interface CoefficientFlag {
  key: string;
  applied: boolean;
  value: number;
  reason: string;
}

export interface AxisBreakdown {
  score: number;
  flags: CoefficientFlag[];
  notes: string[];
}

export interface FoodScores {
  foodId: string;
  eaa: AxisBreakdown;
  fat: AxisBreakdown;
  carb: AxisBreakdown;
  micro: AxisBreakdown;
  fibre: AxisBreakdown;
  residue: AxisBreakdown;
  degradation: AxisBreakdown;
  composite: number;
  tier: Tier;
  formulaVersion: string;
  dataVersion: string;
}

export interface CatalogManifest {
  schemaVersion: number;
  dataVersion: string;
  formulaVersion: string;
  lastVerified: string;
  title: string;
}

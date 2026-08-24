export type Locale = "en" | "de";

export type Localized = {
  en: string;
  de: string;
};

export type Kingdom = "plant" | "animal" | "fungi" | "algae";

export type PlantCategoryId =
  | "leafy-greens"
  | "legumes"
  | "sprouts-microgreens"
  | "fermented-plant"
  | "mushrooms-fungi"
  | "algae-seaweed";

export type AnimalCategoryId =
  | "muscle-meats"
  | "organs"
  | "eggs"
  | "dairy"
  | "fish-seafood";

export type CategoryId = PlantCategoryId | AnimalCategoryId;

export type AxisId =
  | "nutrientDensity"
  | "proteinQuality"
  | "efaProfile"
  | "carbQuality"
  | "bioavailability"
  | "uniqueBioactives"
  | "practicalEfficiency";

export type Tier = "S" | "A" | "B" | "C" | "D";

export type Confidence = "high" | "moderate" | "sparse" | "contested";

export type EssentialAA =
  | "his"
  | "ile"
  | "leu"
  | "lys"
  | "met"
  | "phe"
  | "thr"
  | "trp"
  | "val"
  | "met+cys"
  | "phe+tyr";

export type ProteinMethod = "DIAAS" | "PDCAAS" | "DIAAS-proxy";

export type IronForm = "heme" | "nonheme" | "mixed-heme";

export type SourceKind =
  | "usda"
  | "fao"
  | "efsa"
  | "dge"
  | "nih"
  | "peer-reviewed"
  | "residue";

export interface Source {
  id: string;
  kind: SourceKind;
  year: number;
  title: Localized;
  publisher: string;
  url: string;
  accessed: string;
  note?: Localized;
}

export interface SourcedValue<T> {
  value: T;
  unit?: string;
  sourceIds: string[];
  year: number;
  confidence: Confidence;
  notes?: Localized;
}

export interface NutrientPanel {
  energyKcal: number;
  proteinG: number;
  fatG: number;
  carbG: number;
  fiberG: number | null;
  sugarsG: number | null;
  starchG: number | null;
  resistantStarchG: number | null;
  waterG: number | null;
  naMg: number | null;
  caMg: number | null;
  feMg: number | null;
  znMg: number | null;
  mgMg: number | null;
  kMg: number | null;
  vitCMg: number | null;
  thiaminMg: number | null;
  folateUg: number | null;
  vitB12Ug: number | null;
  vitARaeUg: number | null;
  retinolUg: number | null;
  betaCaroteneUg: number | null;
  vitKUg: number | null;
  vitDUg: number | null;
  alaG: number | null;
  epaG: number | null;
  dhaG: number | null;
  omega6G: number | null;
}

export interface ProteinQualitySeed {
  method: ProteinMethod;
  diaas: number;
  limitingAA: EssentialAA | "none";
  complete: boolean;
  sourceIds: string[];
  year: number;
  confidence: Confidence;
  notes: Localized;
}

export interface AntiNutrientLoad {
  phytate: "none" | "low" | "moderate" | "high";
  oxalate: "none" | "low" | "moderate" | "high";
  lectin: "none" | "low" | "moderate" | "high";
  polyphenolMineralBind: "none" | "low" | "moderate" | "high";
  mitigation: Localized;
  sourceIds: string[];
}

export interface ResidueProfile {
  surfaceClass: "leafy" | "thin-skin" | "thick-skin" | "root" | "seed" | "animal" | "fungal" | "aquatic";
  typicalLoad: "low" | "moderate" | "high" | "not-applicable";
  note: Localized;
  sourceIds: string[];
}

export interface Bioactive {
  id: string;
  name: Localized;
  presence: "characteristic" | "present" | "trace" | "absent" | "analog-only";
  note: Localized;
  sourceIds: string[];
}

export interface PracticalProfile {
  prepBurden: "ready" | "light" | "cook" | "soak-cook" | "specialized";
  storageStability: "high" | "moderate" | "labile";
  heatLabileLoss: "low" | "moderate" | "high";
  note: Localized;
}

export interface SeedFood {
  id: string;
  name: Localized;
  category: CategoryId;
  usdaNdb: string;
  usdaDescription: string;
  form: Localized;
  nutrients: NutrientPanel;
  nutrientSourceIds: string[];
  nutrientYear: number;
  ironForm: IronForm;
  proteinQuality: ProteinQualitySeed;
  antiNutrients: AntiNutrientLoad;
  residues: ResidueProfile;
  bioactives: Bioactive[];
  practical: PracticalProfile;
  invariantIds: string[];
  dataGaps: Localized[];
}

export interface AxisScore {
  axis: AxisId;
  raw: number;
  adjusted: number;
  rationale: Localized;
  sourceIds: string[];
  tradeoffs: Localized[];
}

export interface EvaluatedFood {
  food: SeedFood;
  kingdom: Kingdom;
  scores: Record<AxisId, AxisScore>;
  combined: number;
  withinClassTier: Tier;
  acrossClassTier: Tier;
  withinClassRank: number;
  acrossClassRank: number;
}

export interface Invariant {
  id: string;
  number: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  title: Localized;
  body: Localized;
  sourceIds: string[];
}

export interface CategoryMeta {
  id: CategoryId;
  kingdom: Kingdom;
  name: Localized;
  whyUnequal: Localized;
}

export interface ReferenceValue {
  id: string;
  nutrient: Localized;
  amount: number;
  unit: string;
  population: Localized;
  sourceIds: string[];
  year: number;
}

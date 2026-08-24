export const FOOD_CATEGORIES = [
  "leafy_greens",
  "legumes",
  "sprouts",
  "fermented",
  "mushrooms",
  "algae",
  "muscle_meats",
  "organs",
  "eggs",
  "dairy",
  "fish_seafood",
] as const;

export type FoodCategory = (typeof FOOD_CATEGORIES)[number];

export const KINGDOMS = ["plant", "animal", "fungi", "algae"] as const;
export type Kingdom = (typeof KINGDOMS)[number];

export const AXES = [
  "nutrientDensity",
  "proteinQuality",
  "efaProfile",
  "carbohydrateQuality",
  "bioavailability",
  "uniqueBioactives",
  "practicalEfficiency",
] as const;

export type AxisId = (typeof AXES)[number];

export const TIERS = ["S", "A", "B", "C", "D"] as const;
export type Tier = (typeof TIERS)[number];

export const CONFIDENCE = ["high", "moderate", "sparse", "contested"] as const;
export type Confidence = (typeof CONFIDENCE)[number];

export const IRON_FORMS = ["heme", "nonheme", "mixed", "none"] as const;
export type IronForm = (typeof IRON_FORMS)[number];

export const LIMITING_AMINO_ACIDS = [
  "lysine",
  "methionine_cysteine",
  "tryptophan",
  "threonine",
  "leucine",
  "histidine",
  "none",
  "unknown",
] as const;
export type LimitingAminoAcid = (typeof LIMITING_AMINO_ACIDS)[number];

export const FOOD_FLAGS = [
  "b12_absent",
  "b12_analog",
  "b12_variable_true",
  "epa_dha_absent",
  "ala_only",
  "retinol_absent",
  "creatine_present",
  "high_oxalate",
  "high_phytate",
  "heat_labile",
  "residue_surface",
  "uv_d2_dependent",
  "probiotic_potential",
  "fortification_common",
] as const;
export type FoodFlag = (typeof FOOD_FLAGS)[number];

export type Locale = "de" | "en";

export type Localized = {
  en: string;
  de: string;
};

export type SourcedValue = {
  value: number;
  unit: string;
  sourceId: string;
  year: number;
  confidence: Confidence;
  note?: Localized;
};

export type SourceRecord = {
  id: string;
  title: string;
  publisher: string;
  year: number;
  url: string;
  accessed: string;
  kind:
    | "composition"
    | "protein_quality"
    | "reference_intake"
    | "bioavailability"
    | "residue"
    | "methodology";
};

export type ReferenceIntake = {
  id: string;
  nutrient: string;
  amount: number;
  unit: string;
  population: Localized;
  sourceId: string;
  year: number;
};

export type ProteinQuality = {
  diaas?: SourcedValue;
  pdcaas?: SourcedValue;
  limitingAA: LimitingAminoAcid;
  complete: boolean;
};

export type FattyAcids = {
  epaMg: SourcedValue;
  dhaMg: SourcedValue;
  alaMg: SourcedValue;
  laMg: SourcedValue;
};

export type Composition = {
  energyKcal: SourcedValue;
  proteinG: SourcedValue;
  fatG: SourcedValue;
  carbG: SourcedValue;
  fiberG: SourcedValue;
  sugarsG: SourcedValue;
  ironMg: SourcedValue;
  zincMg: SourcedValue;
  calciumMg: SourcedValue;
  magnesiumMg?: SourcedValue;
  seleniumUg?: SourcedValue;
  vitaminB12Ug: SourcedValue;
  retinolUg: SourcedValue;
  vitaminARaeUg: SourcedValue;
  vitaminCMg: SourcedValue;
  folateDfeUg: SourcedValue;
  vitaminDUg: SourcedValue;
  vitaminKUg?: SourcedValue;
  vitaminEMg?: SourcedValue;
  cholineMg?: SourcedValue;
  thiaminMg?: SourcedValue;
  lysineG?: SourcedValue;
  methionineG?: SourcedValue;
  cystineG?: SourcedValue;
};

export type BioavailabilityProfile = {
  ironForm: IronForm;
  phytatePenalty: 0 | 1 | 2 | 3;
  oxalatePenalty: 0 | 1 | 2 | 3;
  lectinPenalty: 0 | 1 | 2 | 3;
  preparationMitigation: 0 | 1 | 2;
  sourceId: string;
  year: number;
};

export type BioactivePresence = "high" | "moderate" | "trace";

export type UniqueBioactive = {
  id: string;
  presence: BioactivePresence;
  sourceId: string;
  year: number;
};

export type PracticalProfile = {
  prepBurden: 1 | 2 | 3 | 4 | 5;
  heatLability: 1 | 2 | 3 | 4 | 5;
  storageStability: 1 | 2 | 3 | 4 | 5;
};

export type ResidueProfile = {
  typicalLoad: "low" | "moderate" | "high";
  note: Localized;
  sourceId: string;
  year: number;
};

export type Food = {
  id: string;
  slug: string;
  name: Localized;
  scientificName?: string;
  category: FoodCategory;
  kingdom: Kingdom;
  fdcId?: number;
  publishedDate?: string;
  provenance: "api-live" | "sr-legacy-compiled";
  composition: Composition;
  proteinQuality: ProteinQuality;
  fattyAcids: FattyAcids;
  bioavailability: BioavailabilityProfile;
  uniqueBioactives: UniqueBioactive[];
  practical: PracticalProfile;
  residues: ResidueProfile;
  flags: FoodFlag[];
  tradeoffs: Localized;
  prepNote: Localized;
};

export type AxisScore = {
  axis: AxisId;
  raw: number;
  adjusted: number;
  drivers: Localized[];
};

export type FoodScore = {
  foodId: string;
  axes: Record<AxisId, AxisScore>;
  completenessMultiplier: number;
  bioavailabilityMultiplier: number;
  combined: number;
  tierAcross: Tier;
  tierWithin: Tier;
};

export type Invariant = {
  id: string;
  title: Localized;
  body: Localized;
  implication: Localized;
  sourceIds: string[];
};

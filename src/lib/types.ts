/**
 * Domain types for the evaluation matrix.
 * Illegal combinations are unrepresentable: a food has exactly one ontology
 * category, every quantitative claim carries a source id + year, and axis
 * scores exist only after completeness and bioavailability multipliers.
 */

export const FOOD_CATEGORIES = [
  "leafy_greens",
  "legumes",
  "sprouts",
  "fermented",
  "mushrooms",
  "algae",
  "muscle_meat",
  "organs",
  "eggs",
  "dairy",
  "fish_seafood",
] as const;

export type FoodCategory = (typeof FOOD_CATEGORIES)[number];

export const PLANT_CATEGORIES = [
  "leafy_greens",
  "legumes",
  "sprouts",
  "fermented",
  "mushrooms",
  "algae",
] as const satisfies readonly FoodCategory[];

export const ANIMAL_CATEGORIES = [
  "muscle_meat",
  "organs",
  "eggs",
  "dairy",
  "fish_seafood",
] as const satisfies readonly FoodCategory[];

export type PlantCategory = (typeof PLANT_CATEGORIES)[number];
export type AnimalCategory = (typeof ANIMAL_CATEGORIES)[number];

export const AXIS_IDS = [
  "nutrient_density",
  "protein_quality",
  "efa_profile",
  "carb_quality",
  "bioavailability",
  "bioactives",
  "practical_efficiency",
] as const;

export type AxisId = (typeof AXIS_IDS)[number];

export const SOURCE_KINDS = [
  "usda",
  "fao_who",
  "efsa",
  "dge",
  "nih",
  "peer_review",
  "residue",
] as const;

export type SourceKind = (typeof SOURCE_KINDS)[number];

export type Locale = "de" | "en";

export type Localized = {
  readonly de: string;
  readonly en: string;
};

export type Confidence = "high" | "medium" | "low";

export type DataFlag = "sparse" | "contested" | "estimated" | "preparation_dependent";

export type Source = {
  readonly id: string;
  readonly title: string;
  readonly publisher: string;
  readonly year: number;
  readonly url: string;
  readonly kind: SourceKind;
};

export type CitedValue = {
  readonly amount: number;
  readonly unit: string;
  readonly sourceId: string;
  readonly year: number;
  readonly flag?: DataFlag;
};

export type ProteinQuality = {
  readonly method: "DIAAS" | "PDCAAS";
  readonly score: number;
  readonly scoringPattern: "infant_0_6mo" | "child_6_36mo" | "older_child_adult";
  readonly limitingAA: readonly string[];
  readonly complete: boolean;
  readonly sourceId: string;
  readonly year: number;
  readonly flag?: DataFlag;
};

export type FattyAcidProfile = {
  readonly epaMg: CitedValue;
  readonly dhaMg: CitedValue;
  readonly alaMg: CitedValue;
  readonly laMg: CitedValue;
  readonly omega6To3: CitedValue;
  readonly preformedLongChain: boolean;
};

export type CarbohydrateProfile = {
  readonly totalG: CitedValue;
  readonly fiberG: CitedValue;
  readonly freeSugarsG: CitedValue;
  readonly starchG: CitedValue;
  readonly resistantStarchG?: CitedValue;
};

export type AntiNutrientLoad = {
  readonly phytate: "none" | "low" | "moderate" | "high";
  readonly oxalate: "none" | "low" | "moderate" | "high";
  readonly lectin: "none" | "low" | "moderate" | "high";
  readonly polyphenolInhibition: "none" | "low" | "moderate" | "high";
  readonly notes: Localized;
  readonly sourceIds: readonly string[];
};

export type ResidueProfile = {
  readonly surfaceClass: "leafy" | "root_or_thick_skin" | "seed" | "fungal" | "animal" | "aquatic";
  readonly typicalLoad: "low" | "moderate" | "high" | "not_applicable";
  readonly notes: Localized;
  readonly sourceIds: readonly string[];
};

export type PreparationEffect = {
  readonly method: Localized;
  readonly mitigatesAntiNutrients: boolean;
  readonly residualGapRemains: boolean;
  readonly labileVitaminLoss: "low" | "moderate" | "high";
  readonly carotenoidBioavailability: "decreased" | "unchanged" | "increased";
  readonly notes: Localized;
  readonly sourceIds: readonly string[];
};

export type UniqueBioactive = {
  readonly id: string;
  readonly name: Localized;
  readonly presence: "absent" | "trace" | "present" | "concentrated";
  readonly notes: Localized;
  readonly sourceId: string;
  readonly year: number;
  readonly flag?: DataFlag;
};

export type Micronutrients = {
  readonly ironMg: CitedValue;
  readonly hemeIron: boolean;
  readonly zincMg: CitedValue;
  readonly calciumMg: CitedValue;
  readonly magnesiumMg: CitedValue;
  readonly potassiumMg: CitedValue;
  readonly vitaminCMg: CitedValue;
  readonly thiaminMg: CitedValue;
  readonly folateUg: CitedValue;
  readonly b12Ug: CitedValue;
  readonly b12Status: "absent" | "inactive_analogs" | "variable_true" | "preformed";
  readonly vitaminARaeUg: CitedValue;
  readonly retinolUg: CitedValue;
  readonly vitaminDUg: CitedValue;
  readonly vitaminEMg: CitedValue;
  readonly vitaminKUg: CitedValue;
  readonly seleniumUg: CitedValue;
  readonly iodineUg?: CitedValue;
};

export type Food = {
  readonly id: string;
  readonly category: FoodCategory;
  readonly name: Localized;
  readonly scientificName?: string;
  readonly edibleForm: Localized;
  readonly fdcId?: number;
  readonly fdcType?: "SR_Legacy" | "FNDDS" | "Foundation";
  readonly compositionYear: number;
  readonly energyKcal: CitedValue;
  readonly proteinG: CitedValue;
  readonly fatG: CitedValue;
  readonly waterG: CitedValue;
  readonly micronutrients: Micronutrients;
  readonly proteinQuality: ProteinQuality;
  readonly fattyAcids: FattyAcidProfile;
  readonly carbohydrates: CarbohydrateProfile;
  readonly antiNutrients: AntiNutrientLoad;
  readonly residues: ResidueProfile;
  readonly preparation: readonly PreparationEffect[];
  readonly bioactives: readonly UniqueBioactive[];
  readonly practical: {
    readonly prepBurden: "minimal" | "moderate" | "high";
    readonly storageStability: "poor" | "moderate" | "good";
    readonly cookingStability: "labile" | "mixed" | "stable";
    readonly notes: Localized;
  };
};

export type AxisScore = {
  readonly axis: AxisId;
  readonly raw: number;
  readonly adjusted: number;
  readonly confidence: Confidence;
  readonly drivers: Localized;
  readonly sourceIds: readonly string[];
};

export type EvaluatedFood = {
  readonly food: Food;
  readonly axes: Readonly<Record<AxisId, AxisScore>>;
  readonly completenessMultiplier: number;
  readonly bioavailabilityMultiplier: number;
  readonly antinutrientPenalty: number;
  readonly residuePenalty: number;
  readonly combined: number;
  readonly globalTier: Tier;
  readonly classTier: Tier;
  readonly tradeoffs: readonly Localized[];
};

export const TIERS = ["S", "A", "B", "C", "D"] as const;
export type Tier = (typeof TIERS)[number];

export type Invariant = {
  readonly id: string;
  readonly title: Localized;
  readonly body: Localized;
  readonly sourceIds: readonly string[];
};

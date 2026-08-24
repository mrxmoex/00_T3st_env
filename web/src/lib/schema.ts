/**
 * Domain types for the Nahrungsmatrix.
 * Illegal states are unrepresentable: categories never collapse into "vegetable",
 * and every quantitative claim carries a source + year.
 */

export type LocaleCode = "de" | "en";

export type LocaleText = {
  readonly de: string;
  readonly en: string;
};

export type Confidence = "high" | "moderate" | "sparse" | "contested";

export type SourceKind =
  | "usda"
  | "fao"
  | "efsa"
  | "dge"
  | "nih"
  | "peer_review"
  | "residue_program";

export type FoodCategory =
  | "leafy_greens"
  | "legumes"
  | "sprouts"
  | "fermented"
  | "mushrooms"
  | "algae"
  | "muscle_meat"
  | "organs"
  | "eggs"
  | "dairy"
  | "fish_seafood"
  | "cereals_reference";

export type Kingdom = "plant" | "animal" | "fungi" | "algae";

export type AxisId =
  | "nutrient_density"
  | "protein_quality"
  | "efa_profile"
  | "carbohydrate_quality"
  | "bioavailability"
  | "unique_bioactives"
  | "practical_efficiency";

export type EssentialAA =
  | "his"
  | "ile"
  | "leu"
  | "lys"
  | "met_cys"
  | "phe_tyr"
  | "thr"
  | "trp"
  | "val";

export type ProteinMethod = "diaas" | "pdcaas" | "diaas_proxy";

export type IronForm = "heme" | "nonheme" | "mixed";

export type B12Status =
  | "preformed_active"
  | "absent"
  | "analog_dominant"
  | "variable_true"
  | "fermentation_variable";

export type LoadLevel = "none" | "low" | "moderate" | "high";

export type ResidueSurface =
  | "leafy"
  | "root_or_thick_skin"
  | "processed_fermented"
  | "animal_tissue"
  | "aquatic";

export type ResidueLoad = "low" | "moderate" | "high" | "not_applicable";

export type PrepBurden = "minimal" | "moderate" | "high";

export type Stability = "low" | "moderate" | "high";

export type AbsenceCompound =
  | "b12"
  | "epa_dha"
  | "creatine"
  | "carnosine"
  | "retinol"
  | "fiber";

export type Tier = "S" | "A" | "B" | "C" | "D";

export type Score0to100 = number & { readonly __brand: "Score0to100" };

export interface Source {
  readonly id: string;
  readonly title: string;
  readonly organization: string;
  readonly year: number;
  readonly url: string;
  readonly kind: SourceKind;
}

export interface Sourced<T> {
  readonly value: T;
  readonly unit?: string;
  readonly sourceId: string;
  readonly year: number;
  readonly confidence: Confidence;
  readonly note?: LocaleText;
}

export interface SourceRef {
  readonly sourceId: string;
  readonly year: number;
  readonly note?: LocaleText;
}

export interface FoodRecord {
  readonly id: string;
  readonly names: LocaleText;
  readonly scientificName?: string;
  readonly category: FoodCategory;
  readonly kingdom: Kingdom;
  readonly referenceOnly?: boolean;
  readonly fdcId?: number;
  readonly fdcDataType?: "sr_legacy" | "foundation" | "fndds";
  readonly edibleState: LocaleText;
  readonly composition: {
    readonly energyKcal: Sourced<number>;
    readonly proteinG: Sourced<number>;
    readonly fatG: Sourced<number>;
    readonly carbG: Sourced<number>;
    readonly fiberG: Sourced<number>;
    readonly sugarsG: Sourced<number>;
  };
  readonly micros: {
    readonly vitaminARaeUg?: Sourced<number>;
    readonly retinolUg?: Sourced<number>;
    readonly vitaminCMg?: Sourced<number>;
    readonly thiaminMg?: Sourced<number>;
    readonly folateUg?: Sourced<number>;
    readonly vitaminB12Ug?: Sourced<number>;
    readonly vitaminKUg?: Sourced<number>;
    readonly vitaminDUg?: Sourced<number>;
    readonly ironMg?: Sourced<number>;
    readonly zincMg?: Sourced<number>;
    readonly calciumMg?: Sourced<number>;
    readonly magnesiumMg?: Sourced<number>;
    readonly potassiumMg?: Sourced<number>;
    readonly seleniumUg?: Sourced<number>;
    readonly iodineUg?: Sourced<number>;
    readonly cholineMg?: Sourced<number>;
  };
  readonly proteinQuality: {
    readonly method: ProteinMethod;
    readonly score: Sourced<number>;
    readonly limitingAA?: EssentialAA;
  };
  readonly fattyAcids: {
    readonly epaMg: Sourced<number>;
    readonly dhaMg: Sourced<number>;
    readonly alaMg: Sourced<number>;
    readonly laMg: Sourced<number>;
  };
  readonly iron: {
    readonly form: IronForm;
    readonly hemeFraction?: Sourced<number>;
  };
  readonly b12: {
    readonly status: B12Status;
  };
  readonly absences: readonly AbsenceFact[];
  readonly antiNutrients: {
    readonly phytate: LoadLevel;
    readonly oxalate: LoadLevel;
    readonly lectin: LoadLevel;
    readonly polyphenolInhibition: LoadLevel;
    readonly sourceId: string;
    readonly year: number;
    /** 0–1; preparation never fully eliminates the gap. */
    readonly preparationMitigation: number;
  };
  readonly residues: {
    readonly surfaceClass: ResidueSurface;
    readonly load: ResidueLoad;
    readonly sourceId: string;
    readonly year: number;
    readonly note?: LocaleText;
  };
  readonly bioactives: readonly Bioactive[];
  readonly practical: {
    readonly prepBurden: PrepBurden;
    readonly heatLabileLoss: Stability;
    readonly storageStability: Stability;
    readonly sourceId: string;
    readonly year: number;
  };
  readonly tradeoffs: LocaleText;
}

export interface AbsenceFact {
  readonly compound: AbsenceCompound;
  readonly present: boolean;
  readonly sourceId: string;
  readonly year: number;
  readonly note?: LocaleText;
}

export interface Bioactive {
  readonly id: string;
  readonly names: LocaleText;
  readonly evidence: Sourced<string>;
}

export interface AxisScore {
  readonly axis: AxisId;
  readonly score: Score0to100;
  readonly rationale: LocaleText;
  readonly sourceIds: readonly string[];
}

export interface ScoredFood {
  readonly food: FoodRecord;
  readonly axes: readonly AxisScore[];
  readonly composite: Score0to100;
  readonly tierOverall: Tier;
  readonly tierInClass: Tier;
}

export interface Invariant {
  readonly id: string;
  readonly title: LocaleText;
  readonly body: LocaleText;
  readonly sourceIds: readonly string[];
}

export interface ReferenceValue {
  readonly id: string;
  readonly names: LocaleText;
  readonly unit: string;
  readonly adultMale: Sourced<number>;
  readonly adultFemale: Sourced<number>;
  readonly note?: LocaleText;
}

export const FOOD_CATEGORIES: readonly FoodCategory[] = [
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
  "cereals_reference",
] as const;

export const AXES: readonly AxisId[] = [
  "nutrient_density",
  "protein_quality",
  "efa_profile",
  "carbohydrate_quality",
  "bioavailability",
  "unique_bioactives",
  "practical_efficiency",
] as const;

export const TIERS: readonly Tier[] = ["S", "A", "B", "C", "D"] as const;

export const ESSENTIAL_AAS: readonly EssentialAA[] = [
  "his",
  "ile",
  "leu",
  "lys",
  "met_cys",
  "phe_tyr",
  "thr",
  "trp",
  "val",
] as const;

export function brandScore(value: number): Score0to100 {
  const clamped = Math.max(0, Math.min(100, value));
  return clamped as Score0to100;
}

export function assertNever(value: never, context: string): never {
  throw new Error(`Unhandled ${context}: ${String(value)}`);
}

export function categoryKingdom(category: FoodCategory): Kingdom {
  switch (category) {
    case "leafy_greens":
    case "legumes":
    case "sprouts":
    case "fermented":
    case "cereals_reference":
      return "plant";
    case "mushrooms":
      return "fungi";
    case "algae":
      return "algae";
    case "muscle_meat":
    case "organs":
    case "eggs":
    case "dairy":
    case "fish_seafood":
      return "animal";
    default: {
      const _exhaustive: never = category;
      return assertNever(_exhaustive, "FoodCategory");
    }
  }
}

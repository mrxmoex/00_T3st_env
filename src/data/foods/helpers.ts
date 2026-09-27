import { NUTRIENT_KEYS, sourcedFood, type NutrientKey } from "../sources/snapshot";
import type { LocalizedText } from "../../i18n/locale";
import type {
  AnimalExclusiveCompounds,
  DegradationProfile,
  FoodClass,
  FoodRecord,
  IronForm,
  Preparation,
  ProcessingStability,
  ResidueProfile,
  SourceRef,
} from "../../scoring/types";

/** Everything about a food that the databases do not report. Nutrients come from the snapshot. */
export interface FoodSpec {
  id: string;
  name: string;
  nameDe: string;
  class: FoodClass;
  group: string;
  preparation: Preparation;
  ilealDigestibility: number;
  ironForm: IronForm;
  zincBoundByPhytate: boolean;
  b12IsAnalogue: boolean;
  resistantStarchG: number;
  animalCompounds: AnimalExclusiveCompounds;
  residue: ResidueProfile;
  degradation: DegradationProfile;
  phytochemicalIndex: number;
  sources: SourceRef[];
  notes: LocalizedText[];
}

type Curated = Omit<FoodSpec, "ironForm" | "b12IsAnalogue" | "animalCompounds" | "sources" | "notes" | "zincBoundByPhytate">;

export const ZERO_ANIMAL: AnimalExclusiveCompounds = {
  creatineMg: 0,
  taurineMg: 0,
  carnosineMg: 0,
};

export const ANIMAL_COMPOUND_ESTIMATE: SourceRef = {
  label: "Creatine, taurine, carnosine",
  note: "curated estimates by food class; not reported by BLS 4.0 or USDA SR Legacy",
};

export function plant(
  spec: Curated & Partial<Pick<FoodSpec, "zincBoundByPhytate" | "b12IsAnalogue" | "sources" | "notes">>,
): FoodSpec {
  return {
    ironForm: "nonheme",
    zincBoundByPhytate: false,
    b12IsAnalogue: false,
    animalCompounds: ZERO_ANIMAL,
    sources: [],
    notes: [],
    ...spec,
  };
}

export function animal(
  spec: Curated &
    Pick<FoodSpec, "ironForm" | "animalCompounds"> &
    Partial<Pick<FoodSpec, "sources" | "notes">>,
): FoodSpec {
  const hasCompounds = Object.values(spec.animalCompounds).some((value) => value > 0);
  return {
    zincBoundByPhytate: false,
    b12IsAnalogue: false,
    notes: [],
    ...spec,
    sources: [...(spec.sources ?? []), ...(hasCompounds ? [ANIMAL_COMPOUND_ESTIMATE] : [])],
  };
}

const STABILITY_BY_PREPARATION: Record<Preparation, ProcessingStability | null> = {
  raw: "fresh",
  boiled: "cooked",
  steamed: "cooked",
  stewed: "cooked",
  fried: "cooked",
  roasted: "cooked",
  baked: "cooked",
  grilled: "cooked",
  braised: "cooked",
  poached: "cooked",
  canned: "cooked",
  smoked: "dried",
  dried: "dried",
  fermented: "fermented",
  processed: null,
};

/** Refrigerated shelf life once prepared; null keeps the base food's value. */
const SHELF_DAYS_BY_PREPARATION: Record<Preparation, number | null> = {
  raw: null,
  boiled: 3,
  steamed: 3,
  stewed: 3,
  fried: 3,
  roasted: 3,
  baked: 3,
  grilled: 3,
  braised: 3,
  poached: 3,
  canned: null,
  smoked: 14,
  dried: 180,
  fermented: null,
  processed: null,
};

/**
 * Another preparation of the same food. Curated fields carry over from the base;
 * stability follows the preparation. Nutrient values still come from the variant's
 * own database entry, so cooking losses are the database's, not ours.
 */
export function prepared(
  base: FoodSpec,
  changes: Pick<FoodSpec, "id" | "name" | "nameDe" | "preparation"> & Partial<FoodSpec>,
): FoodSpec {
  const stability = STABILITY_BY_PREPARATION[changes.preparation] ?? base.degradation.processingStability;
  const shelfDays = SHELF_DAYS_BY_PREPARATION[changes.preparation] ?? base.degradation.perishabilityDays;
  return {
    ...base,
    notes: [],
    ...changes,
    degradation: {
      ...base.degradation,
      processingStability: stability,
      perishabilityDays: shelfDays,
      ...changes.degradation,
    },
  };
}

export function defineFood(spec: FoodSpec): FoodRecord {
  const source = sourcedFood(spec.id);
  const required = (key: NutrientKey): number => {
    const value = source.value(key);
    if (value === null) {
      throw new Error(`${spec.id}: ${key} is missing in every source`);
    }
    return value;
  };
  const optional = (key: NutrientKey): number | null => source.value(key);
  const zeroIfMissing = (key: NutrientKey): number => source.value(key) ?? 0;

  const proteinG = required("protein");
  const perGramProtein = (key: NutrientKey): number =>
    proteinG > 0 ? Math.round((required(key) / proteinG) * 10000) / 10 : 0;
  const c15 = optional("c15");
  const c17 = optional("c17");
  const carbsAvailable = required("carbsAvailable");
  const fibre = required("fibre");

  return {
    id: spec.id,
    name: spec.name,
    nameDe: spec.nameDe,
    class: spec.class,
    group: spec.group,
    preparation: spec.preparation,
    kcalPer100g: required("kcal"),
    proteinG,
    fatG: required("fat"),
    aminoAcids: {
      his: perGramProtein("his"),
      ile: perGramProtein("ile"),
      leu: perGramProtein("leu"),
      lys: perGramProtein("lys"),
      met: perGramProtein("met"),
      cys: perGramProtein("cys"),
      phe: perGramProtein("phe"),
      tyr: perGramProtein("tyr"),
      thr: perGramProtein("thr"),
      trp: perGramProtein("trp"),
      val: perGramProtein("val"),
    },
    ilealDigestibility: spec.ilealDigestibility,
    fattyAcids: {
      sfa: required("sfa"),
      mufa: required("mufa"),
      pufa: required("pufa"),
      omega3Ala: zeroIfMissing("ala"),
      omega3Epa: zeroIfMissing("epa"),
      omega3Dha: zeroIfMissing("dha"),
      omega6La: required("la"),
      omega6Aa: zeroIfMissing("aa"),
      oddChain: c15 === null && c17 === null ? null : (c15 ?? 0) + (c17 ?? 0),
      cla: optional("cla"),
    },
    carbs: {
      total: carbsAvailable + fibre,
      sugars: required("sugars"),
      starch: required("starch"),
      fibre,
      resistantStarch: spec.resistantStarchG,
    },
    micros: {
      ironMg: required("iron"),
      ironForm: spec.ironForm,
      zincMg: required("zinc"),
      zincBoundByPhytate: spec.zincBoundByPhytate,
      vitaminARetinolUg: required("retinol"),
      vitaminABetaCaroteneUg: optional("betaCarotene"),
      vitaminAOtherCarotenoidsUg: optional("provitaminAOther"),
      vitaminARaeUg: required("vitaminARae"),
      vitaminB12Ug: optional("vitaminB12"),
      b12IsAnalogue: spec.b12IsAnalogue,
      folateUg: required("folate"),
      vitaminCMg: optional("vitaminC"),
      vitaminDUg: required("vitaminD"),
      vitaminEMg: optional("vitaminE"),
      vitaminKUg: optional("vitaminK"),
      thiaminMg: required("thiamin"),
      riboflavinMg: required("riboflavin"),
      niacinMg: required("niacin"),
      vitaminB6Mg: required("vitaminB6"),
      calciumMg: required("calcium"),
      magnesiumMg: required("magnesium"),
      potassiumMg: required("potassium"),
      copperMg: required("copper"),
      seleniumUg: optional("selenium"),
      iodineUg: optional("iodine"),
      cholineMg: optional("choline"),
    },
    composition: {
      waterG: required("water"),
      sodiumMg: required("sodium"),
      phosphorusMg: required("phosphorus"),
      cholesterolMg: required("cholesterol"),
      lactoseG: optional("lactose"),
    },
    animalCompounds: spec.animalCompounds,
    residue: spec.residue,
    degradation: spec.degradation,
    phytochemicalIndex: spec.phytochemicalIndex,
    sourceEntries: source.sources,
    aminoAcidPattern: source.aminoAcidPattern,
    provenance: Object.fromEntries(NUTRIENT_KEYS.map((key) => [key, source.provenance(key)])) as FoodRecord["provenance"],
    sources: spec.sources,
    notes: spec.notes,
  };
}

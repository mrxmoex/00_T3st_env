import { kingdomOf } from "@/lib/ontology";
import type {
  BioactivePresence,
  Composition,
  Confidence,
  Food,
  FoodCategory,
  FoodFlag,
  IronForm,
  LimitingAminoAcid,
  Localized,
  SourcedValue,
  UniqueBioactive,
} from "@/lib/types";

const USDA = "usda-sr-legacy-2019";
const USDA_YEAR = 2019;

export function sv(
  value: number,
  unit: string,
  sourceId = USDA,
  year = USDA_YEAR,
  confidence: Confidence = "high",
  note?: Localized,
): SourcedValue {
  return note
    ? { value, unit, sourceId, year, confidence, note }
    : { value, unit, sourceId, year, confidence };
}

export type CompactFood = {
  id: string;
  slug: string;
  name: Localized;
  scientificName?: string;
  category: FoodCategory;
  fdcId?: number;
  publishedDate?: string;
  provenance: Food["provenance"];
  kcal: number;
  protein: number;
  fat: number;
  carb: number;
  fiber: number;
  sugars: number;
  iron: number;
  zinc: number;
  calcium: number;
  magnesium?: number;
  selenium?: number;
  b12: number;
  retinol: number;
  vitA: number;
  vitC: number;
  folate: number;
  vitD: number;
  vitK?: number;
  vitE?: number;
  choline?: number;
  thiamin?: number;
  lysine?: number;
  methionine?: number;
  cystine?: number;
  epaMg: number;
  dhaMg: number;
  alaMg: number;
  laMg: number;
  diaas?: number;
  diaasSource?: string;
  diaasYear?: number;
  diaasConfidence?: Confidence;
  pdcaas?: number;
  limitingAA: LimitingAminoAcid;
  complete: boolean;
  ironForm: IronForm;
  phytate: 0 | 1 | 2 | 3;
  oxalate: 0 | 1 | 2 | 3;
  lectin: 0 | 1 | 2 | 3;
  mitigation: 0 | 1 | 2;
  bioSource?: string;
  bioYear?: number;
  bioactives: Array<{
    id: string;
    presence: BioactivePresence;
    sourceId?: string;
    year?: number;
  }>;
  prep: 1 | 2 | 3 | 4 | 5;
  heat: 1 | 2 | 3 | 4 | 5;
  storage: 1 | 2 | 3 | 4 | 5;
  residue: "low" | "moderate" | "high";
  residueNote: Localized;
  residueSource?: string;
  residueYear?: number;
  flags: FoodFlag[];
  tradeoffs: Localized;
  prepNote: Localized;
};

function composition(food: CompactFood): Composition {
  return {
    energyKcal: sv(food.kcal, "kcal"),
    proteinG: sv(food.protein, "g"),
    fatG: sv(food.fat, "g"),
    carbG: sv(food.carb, "g"),
    fiberG: sv(food.fiber, "g"),
    sugarsG: sv(food.sugars, "g"),
    ironMg: sv(food.iron, "mg"),
    zincMg: sv(food.zinc, "mg"),
    calciumMg: sv(food.calcium, "mg"),
    magnesiumMg:
      food.magnesium === undefined ? undefined : sv(food.magnesium, "mg"),
    seleniumUg:
      food.selenium === undefined ? undefined : sv(food.selenium, "µg"),
    vitaminB12Ug: sv(food.b12, "µg"),
    retinolUg: sv(food.retinol, "µg"),
    vitaminARaeUg: sv(food.vitA, "µg RAE"),
    vitaminCMg: sv(food.vitC, "mg"),
    folateDfeUg: sv(food.folate, "µg"),
    vitaminDUg: sv(food.vitD, "µg"),
    vitaminKUg: food.vitK === undefined ? undefined : sv(food.vitK, "µg"),
    vitaminEMg: food.vitE === undefined ? undefined : sv(food.vitE, "mg"),
    cholineMg: food.choline === undefined ? undefined : sv(food.choline, "mg"),
    thiaminMg: food.thiamin === undefined ? undefined : sv(food.thiamin, "mg"),
    lysineG: food.lysine === undefined ? undefined : sv(food.lysine, "g"),
    methionineG:
      food.methionine === undefined ? undefined : sv(food.methionine, "g"),
    cystineG: food.cystine === undefined ? undefined : sv(food.cystine, "g"),
  };
}

export function buildFood(food: CompactFood): Food {
  const uniqueBioactives: UniqueBioactive[] = food.bioactives.map((item) => ({
    id: item.id,
    presence: item.presence,
    sourceId: item.sourceId ?? USDA,
    year: item.year ?? USDA_YEAR,
  }));

  return {
    id: food.id,
    slug: food.slug,
    name: food.name,
    scientificName: food.scientificName,
    category: food.category,
    kingdom: kingdomOf(food.category),
    fdcId: food.fdcId,
    publishedDate: food.publishedDate,
    provenance: food.provenance,
    composition: composition(food),
    proteinQuality: {
      diaas:
        food.diaas === undefined
          ? undefined
          : sv(
              food.diaas,
              "ratio",
              food.diaasSource ?? "herreman-2020",
              food.diaasYear ?? 2020,
              food.diaasConfidence ?? "moderate",
            ),
      pdcaas:
        food.pdcaas === undefined
          ? undefined
          : sv(food.pdcaas, "ratio", "fao-diaas-2013", 2013, "moderate"),
      limitingAA: food.limitingAA,
      complete: food.complete,
    },
    fattyAcids: {
      epaMg: sv(food.epaMg, "mg"),
      dhaMg: sv(food.dhaMg, "mg"),
      alaMg: sv(food.alaMg, "mg"),
      laMg: sv(food.laMg, "mg"),
    },
    bioavailability: {
      ironForm: food.ironForm,
      phytatePenalty: food.phytate,
      oxalatePenalty: food.oxalate,
      lectinPenalty: food.lectin,
      preparationMitigation: food.mitigation,
      sourceId: food.bioSource ?? "nih-ods-iron",
      year: food.bioYear ?? 2023,
    },
    uniqueBioactives,
    practical: {
      prepBurden: food.prep,
      heatLability: food.heat,
      storageStability: food.storage,
    },
    residues: {
      typicalLoad: food.residue,
      note: food.residueNote,
      sourceId: food.residueSource ?? "efsa-pesticides-2023",
      year: food.residueYear ?? 2025,
    },
    flags: food.flags,
    tradeoffs: food.tradeoffs,
    prepNote: food.prepNote,
  };
}

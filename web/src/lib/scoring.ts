import { REFERENCE_VALUES } from "@/data/reference-values";
import {
  AXES,
  assertNever,
  brandScore,
  type AxisId,
  type AxisScore,
  type FoodRecord,
  type LoadLevel,
  type LocaleText,
  type Score0to100,
  type ScoredFood,
  type Tier,
} from "@/lib/schema";

/** Conservative ALA→EPA/DHA conversion used before ranking (NIH: <15%; we use 5%). */
export const ALA_CONVERSION_EFFICIENCY = 0.05;

const LOAD_PENALTY: Record<LoadLevel, number> = {
  none: 0,
  low: 4,
  moderate: 10,
  high: 18,
};

function clamp(value: number): Score0to100 {
  return brandScore(value);
}

function text(de: string, en: string): LocaleText {
  return { de, en };
}

function loadPenalty(level: LoadLevel): number {
  switch (level) {
    case "none":
    case "low":
    case "moderate":
    case "high":
      return LOAD_PENALTY[level];
    default: {
      const _exhaustive: never = level;
      return assertNever(_exhaustive, "LoadLevel");
    }
  }
}

function drv(id: string, sex: "male" | "female"): number {
  const row = REFERENCE_VALUES.find((item) => item.id === id);
  if (!row) {
    throw new Error(`Missing reference value: ${id}`);
  }
  return sex === "male" ? row.adultMale.value : row.adultFemale.value;
}

function percentDrv(amount: number | undefined, id: string): number {
  if (amount === undefined || amount <= 0) {
    return 0;
  }
  return Math.min(1.5, amount / drv(id, "male"));
}

function scoreNutrientDensity(food: FoodRecord): AxisScore {
  const energy = Math.max(food.composition.energyKcal.value, 1);
  const per100g =
    percentDrv(food.micros.vitaminARaeUg?.value, "vitamin_a") +
    percentDrv(food.micros.vitaminCMg?.value, "vitamin_c") +
    percentDrv(food.micros.folateUg?.value, "folate") +
    percentDrv(food.micros.vitaminB12Ug?.value, "b12") +
    percentDrv(food.micros.ironMg?.value, "iron") +
    percentDrv(food.micros.zincMg?.value, "zinc") +
    percentDrv(food.micros.calciumMg?.value, "calcium") +
    percentDrv(food.composition.fiberG.value, "fiber") +
    percentDrv(food.composition.proteinG.value, "protein");

  const per100kcal = per100g * (100 / energy);
  const raw = 18 * per100g + 10 * Math.min(per100kcal, 8);
  const sourceIds = [
    food.composition.energyKcal.sourceId,
    "dge-ref-2025",
    "usda-sr-legacy-2018",
  ];

  return {
    axis: "nutrient_density",
    score: clamp(raw),
    rationale: text(
      `NRF-ähnlicher Index: ${per100g.toFixed(2)} DRV-Anteile/100 g und ${per100kcal.toFixed(2)} /100 kcal. Menge ohne Bioverfügbarkeit bleibt hier Rohdichte.`,
      `NRF-like index: ${per100g.toFixed(2)} DRV fractions/100 g and ${per100kcal.toFixed(2)} /100 kcal. Quantity without bioavailability remains raw density here.`,
    ),
    sourceIds,
  };
}

function scoreProteinQuality(food: FoodRecord): AxisScore {
  const diaas = food.proteinQuality.score.value;
  const method = food.proteinQuality.method;
  const proxyPenalty = method === "diaas" ? 1 : method === "pdcaas" ? 0.92 : 0.88;
  const completeness = diaas >= 1 ? 1 : Math.max(0.35, diaas);
  const untruncated = (diaas / 1.25) * 100;
  const afterMultipliers = untruncated * completeness * proxyPenalty;
  const limiting = food.proteinQuality.limitingAA;

  return {
    axis: "protein_quality",
    score: clamp(afterMultipliers),
    rationale: text(
      `${method.toUpperCase()} ${diaas.toFixed(2)}${limiting ? `, limitierend: ${limiting}` : ", kein limitierendes IAA"}. Vollständigkeitsfaktor ${completeness.toFixed(2)} vor Rang. Komplementarität ist hier nicht unterstellt.`,
      `${method.toUpperCase()} ${diaas.toFixed(2)}${limiting ? `, limiting: ${limiting}` : ", no limiting IAA"}. Completeness factor ${completeness.toFixed(2)} applied before rank. Complementarity is not assumed here.`,
    ),
    sourceIds: [food.proteinQuality.score.sourceId, "fao-diaas-2013"],
  };
}

function scoreEfa(food: FoodRecord): AxisScore {
  const epa = food.fattyAcids.epaMg.value;
  const dha = food.fattyAcids.dhaMg.value;
  const ala = food.fattyAcids.alaMg.value;
  const la = food.fattyAcids.laMg.value;
  const preformed = epa + dha;
  const converted = ala * ALA_CONVERSION_EFFICIENCY;
  const effective = preformed + converted;
  const n3 = Math.max(epa + dha + ala, 0.1);
  const ratio = la / n3;

  let score = Math.min(70, (effective / 250) * 55);
  if (preformed >= 200) {
    score += 25;
  } else if (preformed >= 50) {
    score += 12;
  } else if (preformed <= 0 && ala > 0) {
    score += 4;
  }
  if (ratio > 10) {
    score -= 8;
  } else if (ratio > 5) {
    score -= 3;
  }

  return {
    axis: "efa_profile",
    score: clamp(score),
    rationale: text(
      `Präformiertes EPA+DHA ${preformed.toFixed(0)} mg; ALA ${ala.toFixed(0)} mg × ${ALA_CONVERSION_EFFICIENCY * 100}% = ${converted.toFixed(0)} mg effektiv. n-6:n-3 ≈ ${ratio.toFixed(1)}.`,
      `Preformed EPA+DHA ${preformed.toFixed(0)} mg; ALA ${ala.toFixed(0)} mg × ${ALA_CONVERSION_EFFICIENCY * 100}% = ${converted.toFixed(0)} mg effective. n-6:n-3 ≈ ${ratio.toFixed(1)}.`,
    ),
    sourceIds: [food.fattyAcids.epaMg.sourceId, "nih-n3-2025", "efsa-n3-2010"],
  };
}

function scoreCarbQuality(food: FoodRecord): AxisScore {
  const fiber = food.composition.fiberG.value;
  const sugars = food.composition.sugarsG.value;
  const carbs = food.composition.carbG.value;
  const starchLike = Math.max(0, carbs - fiber - sugars);
  const fiberAsset = Math.min(100, (fiber / 8) * 100);
  const activeBurden = Math.min(100, ((sugars + 0.55 * starchLike) / 20) * 100);
  const combined = 0.45 * fiberAsset + 0.55 * (100 - activeBurden);

  return {
    axis: "carbohydrate_quality",
    score: clamp(combined),
    rationale: text(
      `Passives Kohlenhydrat (Faser) ${fiber.toFixed(1)} g → Asset ${fiberAsset.toFixed(0)}. Aktive Last (Zucker ${sugars.toFixed(1)} g + rasche Stärke) → ${activeBurden.toFixed(0)}. Tierische Matrizen ohne Faser bleiben unter dem Pflanzenmaximum.`,
      `Passive carbohydrate (fibre) ${fiber.toFixed(1)} g → asset ${fiberAsset.toFixed(0)}. Active burden (sugars ${sugars.toFixed(1)} g + rapid starch) → ${activeBurden.toFixed(0)}. Animal matrices without fibre stay below the plant ceiling.`,
    ),
    sourceIds: [food.composition.fiberG.sourceId, "efsa-fiber-2010"],
  };
}

function scoreBioavailability(food: FoodRecord): AxisScore {
  let score = 62;
  switch (food.iron.form) {
    case "heme":
      score += 22;
      break;
    case "mixed":
      score += 8;
      break;
    case "nonheme":
      score -= 8;
      break;
    default: {
      const _exhaustive: never = food.iron.form;
      assertNever(_exhaustive, "IronForm");
    }
  }

  switch (food.b12.status) {
    case "preformed_active":
      score += 6;
      break;
    case "variable_true":
      score += 2;
      break;
    case "fermentation_variable":
      score -= 2;
      break;
    case "analog_dominant":
      score -= 10;
      break;
    case "absent":
      break;
    default: {
      const _exhaustive: never = food.b12.status;
      assertNever(_exhaustive, "B12Status");
    }
  }

  const anti =
    loadPenalty(food.antiNutrients.phytate) +
    loadPenalty(food.antiNutrients.oxalate) +
    loadPenalty(food.antiNutrients.lectin) +
    loadPenalty(food.antiNutrients.polyphenolInhibition);
  const mitigation = Math.min(0.55, food.antiNutrients.preparationMitigation);
  score -= anti * (1 - mitigation * 0.45);

  if (food.residues.load === "high") {
    score -= 6;
  } else if (food.residues.load === "moderate") {
    score -= 3;
  }

  return {
    axis: "bioavailability",
    score: clamp(score),
    rationale: text(
      `Eisenform ${food.iron.form}; B12-Status ${food.b12.status}. Antinährstoff-Abzug ${anti.toFixed(0)} bei Mitigationsfaktor ${mitigation.toFixed(2)} (nie vollständige Schließung).`,
      `Iron form ${food.iron.form}; B12 status ${food.b12.status}. Anti-nutrient deduction ${anti.toFixed(0)} with mitigation ${mitigation.toFixed(2)} (never full closure).`,
    ),
    sourceIds: [
      food.antiNutrients.sourceId,
      "hurrell-egli-2010",
      "efsa-iron-2015",
      "nih-b12-2025",
    ],
  };
}

function scoreBioactives(food: FoodRecord): AxisScore {
  const unique = food.bioactives.length;
  const absenceHits = food.absences.filter((item) => item.present).length;
  const score = 12 * unique + 4 * absenceHits;
  return {
    axis: "unique_bioactives",
    score: clamp(score),
    rationale: text(
      `${unique} belegte Funktionsstoffe; ${absenceHits} der strukturellen Marker (B12/EPA-DHA/Kreatin/Carnosin/Retinol/Faser) sind tatsächlich vorhanden.`,
      `${unique} evidenced functional compounds; ${absenceHits} of the structural markers (B12/EPA-DHA/creatine/carnosine/retinol/fibre) are actually present.`,
    ),
    sourceIds: food.bioactives.slice(0, 3).map((item) => item.evidence.sourceId),
  };
}

function scorePractical(food: FoodRecord): AxisScore {
  let score = 55;
  switch (food.practical.prepBurden) {
    case "minimal":
      score += 18;
      break;
    case "moderate":
      score += 6;
      break;
    case "high":
      score -= 8;
      break;
    default: {
      const _exhaustive: never = food.practical.prepBurden;
      assertNever(_exhaustive, "PrepBurden");
    }
  }
  switch (food.practical.heatLabileLoss) {
    case "low":
      score += 12;
      break;
    case "moderate":
      break;
    case "high":
      score -= 10;
      break;
    default: {
      const _exhaustive: never = food.practical.heatLabileLoss;
      assertNever(_exhaustive, "Stability");
    }
  }
  switch (food.practical.storageStability) {
    case "high":
      score += 10;
      break;
    case "moderate":
      score += 2;
      break;
    case "low":
      score -= 8;
      break;
    default: {
      const _exhaustive: never = food.practical.storageStability;
      assertNever(_exhaustive, "Stability");
    }
  }
  return {
    axis: "practical_efficiency",
    score: clamp(score),
    rationale: text(
      `Zubereitung ${food.practical.prepBurden}, Hitzeverlust ${food.practical.heatLabileLoss}, Lagerstabilität ${food.practical.storageStability}.`,
      `Preparation ${food.practical.prepBurden}, heat loss ${food.practical.heatLabileLoss}, storage ${food.practical.storageStability}.`,
    ),
    sourceIds: [food.practical.sourceId],
  };
}

export function scoreAxis(food: FoodRecord, axis: AxisId): AxisScore {
  switch (axis) {
    case "nutrient_density":
      return scoreNutrientDensity(food);
    case "protein_quality":
      return scoreProteinQuality(food);
    case "efa_profile":
      return scoreEfa(food);
    case "carbohydrate_quality":
      return scoreCarbQuality(food);
    case "bioavailability":
      return scoreBioavailability(food);
    case "unique_bioactives":
      return scoreBioactives(food);
    case "practical_efficiency":
      return scorePractical(food);
    default: {
      const _exhaustive: never = axis;
      return assertNever(_exhaustive, "AxisId");
    }
  }
}

export function compositeOf(axes: readonly AxisScore[]): Score0to100 {
  const mean = axes.reduce((sum, item) => sum + item.score, 0) / axes.length;
  return clamp(mean);
}

export function tierFromScore(score: Score0to100): Tier {
  if (score >= 82) return "S";
  if (score >= 70) return "A";
  if (score >= 58) return "B";
  if (score >= 46) return "C";
  return "D";
}

function percentileTier(rankRatio: number): Tier {
  if (rankRatio >= 0.8) return "S";
  if (rankRatio >= 0.6) return "A";
  if (rankRatio >= 0.4) return "B";
  if (rankRatio >= 0.2) return "C";
  return "D";
}

export function scoreFood(food: FoodRecord): Omit<ScoredFood, "tierInClass"> {
  const axes = AXES.map((axis) => scoreAxis(food, axis));
  const composite = compositeOf(axes);
  return {
    food,
    axes,
    composite,
    tierOverall: tierFromScore(composite),
  };
}

export function scoreCatalog(foods: readonly FoodRecord[]): ScoredFood[] {
  const scored = foods.map((food) => scoreFood(food));
  const byCategory = new Map<string, number[]>();
  for (const item of scored) {
    const list = byCategory.get(item.food.category) ?? [];
    list.push(item.composite);
    byCategory.set(item.food.category, list);
  }
  for (const list of byCategory.values()) {
    list.sort((a, b) => a - b);
  }

  return scored.map((item) => {
    const peers = byCategory.get(item.food.category) ?? [item.composite];
    const index = peers.findIndex((value) => value === item.composite);
    const rankRatio = peers.length === 1 ? 0.5 : index / (peers.length - 1);
    return {
      ...item,
      tierInClass: percentileTier(rankRatio),
    };
  });
}

export function axisValue(scored: ScoredFood, axis: AxisId): Score0to100 {
  const found = scored.axes.find((item) => item.axis === axis);
  if (!found) {
    throw new Error(`Missing axis ${axis} on ${scored.food.id}`);
  }
  return found.score;
}

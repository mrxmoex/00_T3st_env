import { ADULT_REFS, ALA_TO_LC_OMEGA3_FACTOR, AXIS_WEIGHTS } from "@/data/references";
import {
  AXIS_IDS,
  TIERS,
  type AxisId,
  type AxisScore,
  type EvaluatedFood,
  type Food,
  type Localized,
  type Tier,
} from "./types";

const LOAD_FRACTION = {
  none: 0,
  low: 0.08,
  moderate: 0.18,
  high: 0.32,
} as const;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function mean(values: readonly number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function coverage(amount: number, ref: number, cap = 1.6): number {
  if (ref <= 0) return 0;
  return clamp(amount / ref, 0, cap) / cap;
}

function loadFraction(level: keyof typeof LOAD_FRACTION): number {
  return LOAD_FRACTION[level];
}

export function completenessMultiplier(food: Food): number {
  const diaas = clamp(food.proteinQuality.score, 0, 1.4);
  if (food.proteinQuality.complete && diaas >= 1) {
    return 1;
  }
  return clamp(0.58 + 0.42 * Math.min(diaas, 1), 0.55, 0.98);
}

export function bioavailabilityMultiplier(food: Food): number {
  const hemeBonus = food.micronutrients.hemeIron ? 0.22 : 0;
  const phytateHaircut = loadFraction(food.antiNutrients.phytate) * 0.55;
  const oxalateHaircut = loadFraction(food.antiNutrients.oxalate) * 0.4;
  const polyHaircut = loadFraction(food.antiNutrients.polyphenolInhibition) * 0.25;
  const lectinHaircut = loadFraction(food.antiNutrients.lectin) * 0.15;

  const mitigated = food.preparation.some((step) => step.mitigatesAntiNutrients);
  const residual = food.preparation.every((step) => step.residualGapRemains);
  const mitigation = mitigated ? (residual ? 0.28 : 0.45) : 0;
  const antiHaircut = (phytateHaircut + oxalateHaircut + polyHaircut + lectinHaircut) * (1 - mitigation);

  return clamp(0.74 + hemeBonus - antiHaircut, 0.5, 1.15);
}

export function antinutrientPenalty(food: Food): number {
  const raw =
    loadFraction(food.antiNutrients.phytate) * 0.4 +
    loadFraction(food.antiNutrients.oxalate) * 0.3 +
    loadFraction(food.antiNutrients.lectin) * 0.15 +
    loadFraction(food.antiNutrients.polyphenolInhibition) * 0.15;
  const mitigated = food.preparation.some((step) => step.mitigatesAntiNutrients);
  return clamp(raw * (mitigated ? 0.72 : 1), 0, 0.35);
}

export function residuePenalty(food: Food): number {
  switch (food.residues.typicalLoad) {
    case "high":
      return 0.12;
    case "moderate":
      return 0.06;
    case "low":
      return 0.02;
    case "not_applicable":
      return 0;
    default: {
      const _exhaustive: never = food.residues.typicalLoad;
      return _exhaustive;
    }
  }
}

function nutrientDensityRaw(food: Food): { score: number; drivers: Localized; sourceIds: string[] } {
  const kcal = Math.max(food.energyKcal.amount, 1);
  const scaleTo100kcal = 100 / kcal;
  const micros = food.micronutrients;

  const pairs: Array<[number, number]> = [
    [micros.ironMg.amount, ADULT_REFS.ironMg.amount],
    [micros.zincMg.amount, ADULT_REFS.zincMg.amount],
    [micros.calciumMg.amount, ADULT_REFS.calciumMg.amount],
    [micros.magnesiumMg.amount, ADULT_REFS.magnesiumMg.amount],
    [micros.potassiumMg.amount, ADULT_REFS.potassiumMg.amount],
    [micros.vitaminCMg.amount, ADULT_REFS.vitaminCMg.amount],
    [micros.thiaminMg.amount, ADULT_REFS.thiaminMg.amount],
    [micros.folateUg.amount, ADULT_REFS.folateUg.amount],
    [micros.b12Ug.amount, ADULT_REFS.b12Ug.amount],
    [micros.vitaminARaeUg.amount, ADULT_REFS.vitaminARaeUg.amount],
    [micros.vitaminDUg.amount, ADULT_REFS.vitaminDUg.amount],
    [micros.vitaminEMg.amount, ADULT_REFS.vitaminEMg.amount],
    [micros.vitaminKUg.amount, ADULT_REFS.vitaminKUg.amount],
    [micros.seleniumUg.amount, ADULT_REFS.seleniumUg.amount],
    [food.carbohydrates.fiberG.amount, ADULT_REFS.fiberG.amount],
  ];

  const per100gScore = mean(pairs.map(([amount, ref]) => coverage(amount, ref))) * 100;
  const perKcalScore =
    mean(pairs.map(([amount, ref]) => coverage(amount * scaleTo100kcal, ref))) * 100;
  const score = clamp(0.48 * per100gScore + 0.52 * perKcalScore, 0, 100);

  return {
    score,
    drivers: {
      de: `${per100gScore.toFixed(0)} /100 g · ${perKcalScore.toFixed(0)} /100 kcal gegen DGE/EFSA-Anker.`,
      en: `${per100gScore.toFixed(0)} /100 g · ${perKcalScore.toFixed(0)} /100 kcal vs DGE/EFSA anchors.`,
    },
    sourceIds: [food.energyKcal.sourceId, "dge-ref-2025", "efsa-drv-2017"],
  };
}

function proteinQualityRaw(food: Food): { score: number; drivers: Localized; sourceIds: string[] } {
  const diaasPoints = clamp(food.proteinQuality.score * 100, 0, 130);
  const proteinPer100kcal = (food.proteinG.amount / Math.max(food.energyKcal.amount, 1)) * 100;
  const quantityFactor = clamp(proteinPer100kcal / 7, 0.35, 1.18);
  const score = clamp(diaasPoints * (0.62 + 0.38 * Math.min(quantityFactor, 1)), 0, 120);
  const method = food.proteinQuality.method;
  const limiting = food.proteinQuality.limitingAA.join(", ") || "—";
  return {
    score,
    drivers: {
      de: `${method} ${food.proteinQuality.score.toFixed(2)} · limitierend: ${limiting} · ${food.proteinG.amount.toFixed(1)} g Protein/100 g.`,
      en: `${method} ${food.proteinQuality.score.toFixed(2)} · limiting: ${limiting} · ${food.proteinG.amount.toFixed(1)} g protein/100 g.`,
    },
    sourceIds: [food.proteinQuality.sourceId, "fao-diaas-2013"],
  };
}

function efaRaw(food: Food): { score: number; drivers: Localized; sourceIds: string[] } {
  const epaDha = food.fattyAcids.epaMg.amount + food.fattyAcids.dhaMg.amount;
  const effectiveFromAla = food.fattyAcids.alaMg.amount * ALA_TO_LC_OMEGA3_FACTOR;
  const longChain = food.fattyAcids.preformedLongChain ? epaDha : 0;
  const combinedEffective = longChain + (food.fattyAcids.preformedLongChain ? 0 : effectiveFromAla);
  const density = coverage(combinedEffective, ADULT_REFS.epaDhaMg.amount, 2) * 100;
  const ratio = food.fattyAcids.omega6To3.amount;
  const ratioPenalty = ratio > 10 ? clamp((ratio - 10) * 1.4, 0, 28) : 0;
  const score = clamp(density - ratioPenalty + (food.fattyAcids.preformedLongChain ? 12 : 0), 0, 110);
  return {
    score,
    drivers: {
      de: food.fattyAcids.preformedLongChain
        ? `Vorgeformtes EPA+DHA ${epaDha.toFixed(0)} mg/100 g. n-6:n-3 = ${ratio.toFixed(1)}.`
        : `Kein vorgeformtes EPA/DHA. ALA ${food.fattyAcids.alaMg.amount.toFixed(0)} mg → ≤${(ALA_TO_LC_OMEGA3_FACTOR * 100).toFixed(0)} % Umwandlung.`,
      en: food.fattyAcids.preformedLongChain
        ? `Preformed EPA+DHA ${epaDha.toFixed(0)} mg/100 g. n-6:n-3 = ${ratio.toFixed(1)}.`
        : `No preformed EPA/DHA. ALA ${food.fattyAcids.alaMg.amount.toFixed(0)} mg → ≤${(ALA_TO_LC_OMEGA3_FACTOR * 100).toFixed(0)} % conversion.`,
    },
    sourceIds: [food.fattyAcids.epaMg.sourceId, "nih-omega3-2025", "efsa-drv-2017"],
  };
}

function carbQualityRaw(food: Food): { score: number; drivers: Localized; sourceIds: string[] } {
  const fiber = food.carbohydrates.fiberG.amount + (food.carbohydrates.resistantStarchG?.amount ?? 0);
  const active =
    food.carbohydrates.freeSugarsG.amount +
    Math.max(food.carbohydrates.starchG.amount - (food.carbohydrates.resistantStarchG?.amount ?? 0), 0);
  const total = fiber + active;
  if (total < 0.8) {
    return {
      score: 50,
      drivers: {
        de: "Weder aktive Kohlenhydrate noch Ballaststoff — Achse neutral, kein Faser-Vorteil.",
        en: "Neither active carbohydrate nor fiber — axis-neutral, no fiber advantage.",
      },
      sourceIds: [food.carbohydrates.fiberG.sourceId, "efsa-fibre-2010"],
    };
  }
  const score = clamp(100 * (fiber / total), 0, 100);
  return {
    score,
    drivers: {
      de: `Passiv ${fiber.toFixed(1)} g Faser/RS vs aktiv ${active.toFixed(1)} g Zucker/Stärke.`,
      en: `Passive ${fiber.toFixed(1)} g fiber/RS vs active ${active.toFixed(1)} g sugar/starch.`,
    },
    sourceIds: [food.carbohydrates.fiberG.sourceId, "efsa-fibre-2010", "dge-fibre"],
  };
}

function bioavailabilityRaw(food: Food): { score: number; drivers: Localized; sourceIds: string[] } {
  const heme = food.micronutrients.hemeIron ? 34 : 0;
  const b12 =
    food.micronutrients.b12Status === "preformed"
      ? 12
      : food.micronutrients.b12Status === "variable_true"
        ? 4
        : food.micronutrients.b12Status === "inactive_analogs"
          ? -8
          : 0;
  const anti =
    (loadFraction(food.antiNutrients.phytate) +
      loadFraction(food.antiNutrients.oxalate) +
      loadFraction(food.antiNutrients.polyphenolInhibition)) *
    70;
  const score = clamp(58 + heme + b12 - anti, 8, 100);
  return {
    score,
    drivers: {
      de: food.micronutrients.hemeIron
        ? "Häm-Eisen; Phytat/Oxalat/Polyphenole gering. NIH: Mischkost 14–18 % Fe-Absorption vs vegetarisch 5–12 %."
        : "Nur Non-Häm-Eisen. Phytat/Oxalat/Polyphenole senken Fe/Zn/Ca. Zubereitung mildert, schließt die Lücke nicht.",
      en: food.micronutrients.hemeIron
        ? "Heme iron; low phytate/oxalate/polyphenols. NIH: mixed diets 14–18 % Fe absorption vs vegetarian 5–12 %."
        : "Non-heme iron only. Phytate/oxalate/polyphenols cut Fe/Zn/Ca. Prep mitigates, does not close the gap.",
    },
    sourceIds: ["nih-iron-2026", "hurrell-egli-2010", ...food.antiNutrients.sourceIds],
  };
}

function bioactivePresencePoints(presence: UniqueBioactivePresence): number {
  switch (presence) {
    case "absent":
      return 0;
    case "trace":
      return 4;
    case "present":
      return 10;
    case "concentrated":
      return 16;
    default: {
      const _exhaustive: never = presence;
      return _exhaustive;
    }
  }
}

type UniqueBioactivePresence = Food["bioactives"][number]["presence"];

function bioactivesRaw(food: Food): { score: number; drivers: Localized; sourceIds: string[] } {
  const points = food.bioactives.reduce((sum, item) => sum + bioactivePresencePoints(item.presence), 0);
  const names = food.bioactives
    .filter((item) => item.presence !== "absent")
    .map((item) => item.name.en)
    .slice(0, 4);
  return {
    score: clamp(points, 0, 100),
    drivers: {
      de: names.length ? `Nachgewiesen: ${names.join(", ")}.` : "Keine dokumentierten einzigartigen Bioaktive in der Saat.",
      en: names.length ? `Documented: ${names.join(", ")}.` : "No documented unique bioactives in the seed set.",
    },
    sourceIds: food.bioactives.map((item) => item.sourceId),
  };
}

function practicalRaw(food: Food): { score: number; drivers: Localized; sourceIds: string[] } {
  const prep =
    food.practical.prepBurden === "minimal" ? 34 : food.practical.prepBurden === "moderate" ? 22 : 10;
  const store =
    food.practical.storageStability === "good"
      ? 28
      : food.practical.storageStability === "moderate"
        ? 18
        : 8;
  const cook =
    food.practical.cookingStability === "stable"
      ? 28
      : food.practical.cookingStability === "mixed"
        ? 18
        : 8;
  return {
    score: clamp(prep + store + cook, 0, 100),
    drivers: food.practical.notes,
    sourceIds: ["lešková-vitamins-2006", "gibson-phytate-2018"],
  };
}

function rawForAxis(food: Food, axis: AxisId): { score: number; drivers: Localized; sourceIds: string[] } {
  switch (axis) {
    case "nutrient_density":
      return nutrientDensityRaw(food);
    case "protein_quality":
      return proteinQualityRaw(food);
    case "efa_profile":
      return efaRaw(food);
    case "carb_quality":
      return carbQualityRaw(food);
    case "bioavailability":
      return bioavailabilityRaw(food);
    case "bioactives":
      return bioactivesRaw(food);
    case "practical_efficiency":
      return practicalRaw(food);
    default: {
      const _exhaustive: never = axis;
      return _exhaustive;
    }
  }
}

export function adjustAxis(raw: number, food: Food, axis: AxisId): number {
  const completeness = completenessMultiplier(food);
  const bioavail = bioavailabilityMultiplier(food);
  const anti = antinutrientPenalty(food);
  const residue = residuePenalty(food);

  switch (axis) {
    case "protein_quality":
      return clamp(raw * completeness - anti * 8, 0, 120);
    case "nutrient_density":
      return clamp(raw * bioavail - anti * 22 - residue * 12, 0, 120);
    case "bioavailability":
      return clamp(raw - anti * 24 - residue * 10, 0, 120);
    case "carb_quality":
    case "efa_profile":
    case "bioactives":
      return clamp(raw, 0, 120);
    case "practical_efficiency":
      return clamp(raw - residue * 14, 0, 120);
    default: {
      const _exhaustive: never = axis;
      return _exhaustive;
    }
  }
}

function axisConfidence(food: Food, axis: AxisId): AxisScore["confidence"] {
  if (axis === "protein_quality" && food.proteinQuality.flag) return "low";
  if (axis === "efa_profile" && food.fattyAcids.epaMg.flag) return "medium";
  if (food.energyKcal.flag === "sparse") return "low";
  return food.proteinQuality.flag ? "medium" : "high";
}

export function evaluateFood(food: Food): EvaluatedFood {
  const completeness = completenessMultiplier(food);
  const bioavail = bioavailabilityMultiplier(food);
  const anti = antinutrientPenalty(food);
  const residue = residuePenalty(food);

  const axes = {} as Record<AxisId, AxisScore>;
  for (const axis of AXIS_IDS) {
    const raw = rawForAxis(food, axis);
    axes[axis] = {
      axis,
      raw: clamp(raw.score, 0, 130),
      adjusted: adjustAxis(raw.score, food, axis),
      confidence: axisConfidence(food, axis),
      drivers: raw.drivers,
      sourceIds: raw.sourceIds,
    };
  }

  const combined = AXIS_IDS.reduce((sum, axis) => sum + axes[axis].adjusted * AXIS_WEIGHTS[axis], 0);

  const tradeoffs: Localized[] = [];
  const density = axes.nutrient_density.adjusted;
  const protein = axes.protein_quality.adjusted;
  const fiber = axes.carb_quality.adjusted;
  const efa = axes.efa_profile.adjusted;

  if (density >= 70 && protein < 55) {
    tradeoffs.push({
      de: "Hohe Mikronährstoffdichte, aber Proteinqualität/DIAAS bleibt limitierend.",
      en: "High micronutrient density, but protein quality/DIAAS remains limiting.",
    });
  }
  if (protein >= 75 && fiber < 55) {
    tradeoffs.push({
      de: "Vollständiges, hoch verdauliches Protein — ohne passiven Kohlenhydrat-/Faservorteil.",
      en: "Complete, highly digestible protein — without a passive carbohydrate/fiber advantage.",
    });
  }
  if (efa >= 75 && density < 60) {
    tradeoffs.push({
      de: "Vorgeformtes EPA/DHA führt; Mikronährstoffbreite ist schmaler als bei Innereien oder Blattgrün.",
      en: "Preformed EPA/DHA leads; micronutrient breadth is narrower than organs or leafy greens.",
    });
  }
  if (food.micronutrients.b12Status !== "preformed") {
    tradeoffs.push({
      de: "Kein verlässliches vorgeformtes B12 in dieser Matrixzeile.",
      en: "No reliable preformed B12 on this matrix row.",
    });
  }
  if (food.antiNutrients.oxalate === "high" || food.antiNutrients.phytate === "high") {
    tradeoffs.push({
      de: "Antinährstoff-Penalty ist explizit und quellengebunden — Rohwerte überzeichnen absorbierbare Mineralien.",
      en: "Anti-nutrient penalty is explicit and sourced — raw minerals overstate absorbable supply.",
    });
  }

  return {
    food,
    axes,
    completenessMultiplier: completeness,
    bioavailabilityMultiplier: bioavail,
    antinutrientPenalty: anti,
    residuePenalty: residue,
    combined,
    globalTier: "B",
    classTier: "B",
    tradeoffs,
  };
}

export function assignTiers(evaluated: readonly EvaluatedFood[]): EvaluatedFood[] {
  const byCombined = [...evaluated].sort((a, b) => b.combined - a.combined);
  const withGlobal = byCombined.map((item) => ({
    ...item,
    globalTier: absoluteTier(item.combined),
  }));

  const byClass = new Map<string, EvaluatedFood[]>();
  for (const item of withGlobal) {
    const list = byClass.get(item.food.category) ?? [];
    list.push(item);
    byClass.set(item.food.category, list);
  }

  const result: EvaluatedFood[] = [];
  for (const group of byClass.values()) {
    const ranked = [...group].sort((a, b) => b.combined - a.combined);
    ranked.forEach((item, index) => {
      result.push({
        ...item,
        classTier: classTierFromRank(index, ranked.length, item.combined),
      });
    });
  }
  return result.sort((a, b) => b.combined - a.combined);
}

export function absoluteTier(score: number): Tier {
  if (score >= 78) return "S";
  if (score >= 66) return "A";
  if (score >= 54) return "B";
  if (score >= 42) return "C";
  return "D";
}

function classTierFromRank(index: number, size: number, score: number): Tier {
  const absolute = absoluteTier(score);
  if (size <= 2) return absolute;
  if (index === 0 && score >= 60) return "S";
  return absolute;
}

export function tierIndex(tier: Tier): number {
  return TIERS.indexOf(tier);
}

export function evaluateCatalog(foods: readonly Food[]): EvaluatedFood[] {
  return assignTiers(foods.map(evaluateFood));
}

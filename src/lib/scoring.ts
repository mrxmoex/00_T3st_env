import { FOODS } from "@/data/foods";
import { intake } from "@/data/references";
import { AXES, type AxisId, type Food, type FoodScore, type Locale, type Tier } from "@/lib/types";
import { clamp, geometricMean } from "@/lib/utils";

const TIER_CUTS: Array<{ tier: Tier; min: number }> = [
  { tier: "S", min: 80 },
  { tier: "A", min: 65 },
  { tier: "B", min: 50 },
  { tier: "C", min: 35 },
  { tier: "D", min: 0 },
];

export function tierFromScore(score: number): Tier {
  const match = TIER_CUTS.find((cut) => score >= cut.min);
  return match?.tier ?? "D";
}

export function completenessMultiplier(food: Food): number {
  const diaas = food.proteinQuality.diaas?.value;
  if (diaas !== undefined) {
    if (diaas >= 1) return 1;
    if (diaas >= 0.75) return 0.92;
    if (diaas >= 0.5) return 0.8;
    return 0.68;
  }
  const pdcaas = food.proteinQuality.pdcaas?.value ?? 0.5;
  if (food.proteinQuality.complete && pdcaas >= 1) return 0.94;
  if (pdcaas >= 0.75) return 0.86;
  return 0.72;
}

export function bioavailabilityMultiplier(food: Food): number {
  const { ironForm, phytatePenalty, oxalatePenalty, lectinPenalty, preparationMitigation } =
    food.bioavailability;
  let base = 0.62;
  switch (ironForm) {
    case "heme":
      base = 1;
      break;
    case "mixed":
      base = 0.88;
      break;
    case "nonheme":
      base = 0.78;
      break;
    case "none":
      base = 0.9;
      break;
    default: {
      const _exhaustive: never = ironForm;
      return _exhaustive;
    }
  }
  const penalty = phytatePenalty * 0.05 + oxalatePenalty * 0.04 + lectinPenalty * 0.02;
  const mitigation = preparationMitigation * 0.03;
  return clamp(base - penalty + mitigation, 0.5, 1);
}

function densityDrivers(food: Food, locale: Locale): string[] {
  const drivers: string[] = [];
  if (food.composition.vitaminB12Ug.value >= 2) {
    drivers.push(locale === "de" ? "Hohes B12 pro 100 g" : "High B12 per 100 g");
  }
  if (food.composition.fiberG.value >= 4) {
    drivers.push(locale === "de" ? "Hoher Ballaststoff" : "High fiber");
  }
  if (food.composition.retinolUg.value >= 100) {
    drivers.push(locale === "de" ? "Präformiertes Retinol" : "Preformed retinol");
  }
  if (food.composition.vitaminCMg.value >= 20) {
    drivers.push(locale === "de" ? "Hohes Vitamin C" : "High vitamin C");
  }
  return drivers;
}

function densityVector(food: Food, scale: number): number[] {
  const n = food.composition;
  const amount = (value: number) => value * scale;
  return [
    Math.min(amount(n.ironMg.value) / intake("iron").amount, 2),
    Math.min(amount(n.zincMg.value) / intake("zinc").amount, 2),
    Math.min(amount(n.calciumMg.value) / intake("calcium").amount, 2),
    Math.min(amount(n.vitaminB12Ug.value) / intake("b12").amount, 2),
    Math.min(amount(n.vitaminARaeUg.value) / intake("vitaminA").amount, 2),
    Math.min(amount(n.vitaminCMg.value) / intake("vitaminC").amount, 2),
    Math.min(amount(n.folateDfeUg.value) / intake("folate").amount, 2),
    Math.min(amount(n.fiberG.value) / intake("fiber").amount, 2),
    Math.min(amount(n.proteinG.value) / intake("protein").amount, 2),
    Math.min(
      amount(n.vitaminDUg.value) / 20,
      2,
    ),
    Math.min(amount(n.cholineMg?.value ?? 0) / 400, 2),
  ];
}

export function rawNutrientDensity(food: Food): number {
  const per100 = densityVector(food, 1).reduce((sum, value) => sum + value, 0);
  const perKcal = densityVector(food, 100 / Math.max(food.composition.energyKcal.value, 1)).reduce(
    (sum, value) => sum + value,
    0,
  );
  const score100 = (per100 / 8) * 100;
  const scoreKcal = (perKcal / 10) * 100;
  return clamp(0.55 * score100 + 0.45 * scoreKcal, 0, 100);
}

export function rawProteinQuality(food: Food): number {
  const diaas = food.proteinQuality.diaas?.value;
  if (diaas !== undefined) {
    return clamp((diaas / 1.2) * 100, 0, 100);
  }
  const pdcaas = food.proteinQuality.pdcaas?.value ?? 0.4;
  return clamp(pdcaas * 80, 0, 80);
}

export function rawEfaProfile(food: Food): number {
  const epaDha = food.fattyAcids.epaMg.value + food.fattyAcids.dhaMg.value;
  const ala = food.fattyAcids.alaMg.value;
  const la = Math.max(food.fattyAcids.laMg.value, 0);
  const n3 = epaDha + ala * 0.08;
  const ratio = n3 <= 0 ? (la > 0 ? 99 : 4) : la / n3;

  let preformed = 0;
  if (epaDha >= 250) {
    preformed = 70 + clamp(((epaDha - 250) / 1750) * 15, 0, 15);
  } else if (epaDha > 0) {
    preformed = 18 + (epaDha / 250) * 52;
  }

  const alaBonus = clamp(ala / 80, 0, 14);
  let ratioPenalty = 0;
  if (ratio > 10) ratioPenalty = 16;
  else if (ratio > 5) ratioPenalty = 8;

  if (epaDha === 0 && ala > 0) {
    return clamp(preformed + alaBonus - ratioPenalty, 0, 42);
  }
  return clamp(preformed + alaBonus - ratioPenalty, 0, 100);
}

export function rawCarbohydrateQuality(food: Food): number {
  const { fiberG, sugarsG, carbG } = food.composition;
  if (carbG.value < 2 && fiberG.value < 0.5) {
    return 28;
  }
  const fiberScore = clamp((fiberG.value / 8) * 58, 0, 58);
  const sugarPenalty = clamp((sugarsG.value / 12) * 36, 0, 36);
  const starch = Math.max(carbG.value - fiberG.value - sugarsG.value, 0);
  const starchPenalty = clamp((starch / 25) * 12, 0, 12);
  return clamp(38 + fiberScore - sugarPenalty - starchPenalty, 0, 100);
}

export function rawBioavailability(food: Food): number {
  const { ironForm, phytatePenalty, oxalatePenalty, lectinPenalty, preparationMitigation } =
    food.bioavailability;
  let base = 42;
  switch (ironForm) {
    case "heme":
      base = 90;
      break;
    case "mixed":
      base = 72;
      break;
    case "nonheme":
      base = 48;
      break;
    case "none":
      base = 70;
      break;
    default: {
      const _exhaustive: never = ironForm;
      return _exhaustive;
    }
  }
  const penalty = phytatePenalty * 8 + oxalatePenalty * 6 + lectinPenalty * 4;
  const mitigation = preparationMitigation * 5;
  return clamp(base - penalty + mitigation, 0, 100);
}

export function rawUniqueBioactives(food: Food): number {
  const weight = { high: 18, moderate: 10, trace: 3 } as const;
  const sum = food.uniqueBioactives.reduce((total, item) => total + weight[item.presence], 0);
  return clamp(sum, 0, 100);
}

export function rawPracticalEfficiency(food: Food): number {
  const { prepBurden, heatLability, storageStability } = food.practical;
  const base = 100 - prepBurden * 8 - heatLability * 6 + storageStability * 5;
  const residueCut =
    food.residues.typicalLoad === "high" ? 8 : food.residues.typicalLoad === "moderate" ? 3 : 0;
  return clamp(base - residueCut, 0, 100);
}

const RAW_AXIS: Record<AxisId, (food: Food) => number> = {
  nutrientDensity: rawNutrientDensity,
  proteinQuality: rawProteinQuality,
  efaProfile: rawEfaProfile,
  carbohydrateQuality: rawCarbohydrateQuality,
  bioavailability: rawBioavailability,
  uniqueBioactives: rawUniqueBioactives,
  practicalEfficiency: rawPracticalEfficiency,
};

function driversFor(food: Food, axis: AxisId, locale: Locale): Array<{ en: string; de: string }> {
  switch (axis) {
    case "nutrientDensity":
      return densityDrivers(food, locale).map((text) =>
        locale === "de" ? { en: text, de: text } : { en: text, de: text },
      );
    case "proteinQuality":
      return [
        {
          en: `Limiting AA: ${food.proteinQuality.limitingAA}. DIAAS ${food.proteinQuality.diaas?.value ?? "n/a"}.`,
          de: `Limitierende AS: ${food.proteinQuality.limitingAA}. DIAAS ${food.proteinQuality.diaas?.value ?? "n/a"}.`,
        },
      ];
    case "efaProfile":
      return [
        {
          en: `EPA+DHA ${food.fattyAcids.epaMg.value + food.fattyAcids.dhaMg.value} mg. ALA is not EPA.`,
          de: `EPA+DHA ${food.fattyAcids.epaMg.value + food.fattyAcids.dhaMg.value} mg. ALA ist nicht EPA.`,
        },
      ];
    case "carbohydrateQuality":
      return [
        {
          en: `Fiber ${food.composition.fiberG.value} g vs sugars ${food.composition.sugarsG.value} g.`,
          de: `Ballaststoffe ${food.composition.fiberG.value} g gegen Zucker ${food.composition.sugarsG.value} g.`,
        },
      ];
    case "bioavailability":
      return [
        {
          en: `Iron form: ${food.bioavailability.ironForm}. Phytate ${food.bioavailability.phytatePenalty}/3.`,
          de: `Eisenform: ${food.bioavailability.ironForm}. Phytat ${food.bioavailability.phytatePenalty}/3.`,
        },
      ];
    case "uniqueBioactives":
      return [
        {
          en: food.uniqueBioactives.map((item) => item.id).join(", ") || "None scored",
          de: food.uniqueBioactives.map((item) => item.id).join(", ") || "Keine",
        },
      ];
    case "practicalEfficiency":
      return [
        {
          en: food.prepNote.en,
          de: food.prepNote.de,
        },
      ];
    default: {
      const _exhaustive: never = axis;
      return _exhaustive;
    }
  }
}

export function scoreFood(food: Food, locale: Locale = "en"): FoodScore {
  const completeness = completenessMultiplier(food);
  const bioavailability = bioavailabilityMultiplier(food);
  const axes = Object.fromEntries(
    AXES.map((axis) => {
      const raw = RAW_AXIS[axis](food);
      let adjusted = raw;
      switch (axis) {
        case "proteinQuality":
          adjusted = raw * completeness;
          break;
        case "nutrientDensity":
          adjusted = raw * (0.5 + 0.5 * bioavailability);
          break;
        case "bioavailability":
        case "efaProfile":
        case "carbohydrateQuality":
        case "uniqueBioactives":
        case "practicalEfficiency":
          adjusted = raw;
          break;
        default: {
          const _exhaustive: never = axis;
          return _exhaustive;
        }
      }
      return [
        axis,
        {
          axis,
          raw: clamp(raw, 0, 100),
          adjusted: clamp(adjusted, 0, 100),
          drivers: driversFor(food, axis, locale),
        },
      ];
    }),
  ) as FoodScore["axes"];

  const combined = geometricMean(AXES.map((axis) => axes[axis].adjusted));
  return {
    foodId: food.id,
    axes,
    completenessMultiplier: completeness,
    bioavailabilityMultiplier: bioavailability,
    combined: clamp(combined, 0, 100),
    tierAcross: "D",
    tierWithin: "D",
  };
}

export function scoreCatalog(foods: Food[] = FOODS, locale: Locale = "en"): FoodScore[] {
  const scored = foods.map((food) => scoreFood(food, locale));
  const ranked = [...scored].sort((a, b) => b.combined - a.combined);
  for (const row of scored) {
    row.tierAcross = tierFromScore(row.combined);
  }

  const byCategory = new Map<string, FoodScore[]>();
  for (const food of foods) {
    const row = scored.find((item) => item.foodId === food.id);
    if (!row) continue;
    const list = byCategory.get(food.category) ?? [];
    list.push(row);
    byCategory.set(food.category, list);
  }
  for (const list of byCategory.values()) {
    list.sort((a, b) => b.combined - a.combined);
    for (const row of list) {
      row.tierWithin = tierFromScore(row.combined);
    }
  }

  return ranked;
}

export function compareFoods(ids: string[], locale: Locale = "en"): FoodScore[] {
  const selected = ids.map((id) => {
    const food = FOODS.find((item) => item.id === id);
    if (!food) {
      throw new Error(`Unknown food: ${id}`);
    }
    return food;
  });
  return scoreCatalog(selected, locale);
}

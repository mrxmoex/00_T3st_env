import type {
  AxisScore,
  BioavailabilityProfile,
  BioactiveProfile,
  EvaluationAxis,
  FoodItem,
  NutrientProfile,
  PreparationProfile,
  ProteinQuality,
  ResidueProfile,
  Tier,
} from "@/lib/types";

const TIER_THRESHOLDS: { tier: Tier; min: number }[] = [
  { tier: "S", min: 85 },
  { tier: "A", min: 70 },
  { tier: "B", min: 55 },
  { tier: "C", min: 40 },
  { tier: "D", min: 0 },
];

export function scoreToTier(score: number): Tier {
  for (const { tier, min } of TIER_THRESHOLDS) {
    if (score >= min) return tier;
  }
  return "D";
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

function bioavailabilityMultiplier(bio: BioavailabilityProfile): number {
  let multiplier = 1;
  if (bio.ironType === "heme") multiplier *= 1.15;
  if (bio.ironType === "non_heme") multiplier *= 0.75 * bio.ironAbsorptionModifier;
  if (bio.b12Status === "preformed" || bio.b12Status === "active_algae") multiplier *= 1.1;
  if (bio.b12Status === "inactive_analog") multiplier *= 0.6;
  if (bio.retinolStatus === "preformed") multiplier *= 1.1;
  if (bio.epaDhaStatus === "preformed" || bio.epaDhaStatus === "algae_source") multiplier *= 1.1;

  const antiLoads = [bio.phytateLoad, bio.oxalateLoad, bio.lectinLoad];
  for (const load of antiLoads) {
    if (load === "high") multiplier *= 0.85;
    else if (load === "moderate") multiplier *= 0.92;
  }
  return multiplier;
}

export function computeNutrientDensityScore(n: NutrientProfile): number {
  const kcal = Math.max(n.energyKcal, 1);
  const microDensity =
    (n.ironMg * 10 +
      n.zincMg * 15 +
      n.calciumMg * 0.5 +
      n.magnesiumMg * 2 +
      n.potassiumMg * 0.3 +
      n.vitaminCMg * 3 +
      n.folateMcg * 0.5 +
      n.vitaminAMcgRae * 0.2 +
      n.vitaminB12Mcg * 50 +
      n.vitaminDIu * 0.05) /
    kcal;
  const fiberBonus = (n.fiberG / kcal) * 200;
  return clamp(microDensity * 8 + fiberBonus + 20);
}

export function computeProteinQualityScore(pq: ProteinQuality): number {
  const base = pq.method === "DIAAS" ? pq.score * 100 : pq.score * 90;
  const completenessBonus = pq.isComplete ? 8 : 0;
  const limitingPenalty = pq.limitingAminoAcid ? 5 : 0;
  return clamp(base + completenessBonus - limitingPenalty);
}

export function computeEfaScore(n: NutrientProfile, bio: BioavailabilityProfile): number {
  const preformed = (n.omega3EpaG + n.omega3DhaG) * 500;
  const ala = n.omega3AlaG * 30;
  const alaEffective =
    bio.epaDhaStatus === "ala_only"
      ? ala * (bio.alaConversionEfficiency ?? 0.08)
      : ala;
  const omega63 = n.omega6G / Math.max(n.omega3AlaG + n.omega3EpaG + n.omega3DhaG, 0.001);
  const ratioPenalty = omega63 > 15 ? 15 : omega63 > 8 ? 8 : 0;
  return clamp(preformed + alaEffective + 30 - ratioPenalty);
}

export function computeCarbQualityScore(n: NutrientProfile): number {
  const passive = n.fiberG + (n.resistantStarchG ?? 0);
  const active = n.sugarsG + Math.max(n.carbsG - passive, 0) * 0.3;
  const ratio = passive / Math.max(active, 0.1);
  const giProxy = n.sugarsG / Math.max(n.carbsG, 0.1);
  return clamp(30 + ratio * 25 + passive * 3 - giProxy * 40);
}

export function computeBioavailabilityScore(bio: BioavailabilityProfile): number {
  let score = 70;
  if (bio.ironType === "heme") score += 15;
  if (bio.ironType === "non_heme") score -= 10;
  if (bio.b12Status === "preformed") score += 12;
  if (bio.b12Status === "active_algae") score += 8;
  if (bio.b12Status === "inactive_analog") score -= 20;
  if (bio.b12Status === "absent") score -= 5;
  if (bio.retinolStatus === "preformed") score += 8;
  if (bio.epaDhaStatus === "preformed") score += 10;
  if (bio.epaDhaStatus === "algae_source") score += 6;
  const penalties = [bio.phytateLoad, bio.oxalateLoad, bio.lectinLoad];
  for (const p of penalties) {
    if (p === "high") score -= 12;
    if (p === "moderate") score -= 6;
    if (p === "low") score -= 2;
  }
  return clamp(score);
}

export function computeBioactivesScore(bioactives: BioactiveProfile): number {
  const weights = { high: 20, moderate: 12, low: 5, absent: 0 };
  const total = bioactives.items.reduce((sum, item) => sum + weights[item.presence], 0);
  return clamp(25 + total);
}

export function computePracticalEfficiencyScore(prep: PreparationProfile): number {
  const stabilityBonus = prep.stability === "high" ? 15 : prep.stability === "moderate" ? 8 : 0;
  const stepPenalty = prep.requiredSteps.length * 4;
  return clamp(75 + stabilityBonus - stepPenalty);
}

export function computeResiduePenalty(residues?: ResidueProfile): number {
  if (!residues) return 0;
  let penalty = 0;
  if (residues.pesticideLoad === "high") penalty += 12;
  if (residues.pesticideLoad === "moderate") penalty += 6;
  if (residues.surfaceAreaRisk === "high") penalty += 8;
  return penalty;
}

export function computeAllAxisScores(
  nutrients: NutrientProfile,
  proteinQuality: ProteinQuality,
  bioavailability: BioavailabilityProfile,
  bioactives: BioactiveProfile,
  preparation: PreparationProfile,
  residues?: ResidueProfile,
): Record<EvaluationAxis, AxisScore> {
  const multiplier = bioavailabilityMultiplier(bioavailability);
  const residuePenalty = computeResiduePenalty(residues);

  const rawScores: Record<EvaluationAxis, number> = {
    nutrient_density: computeNutrientDensityScore(nutrients),
    protein_quality: computeProteinQualityScore(proteinQuality),
    essential_fatty_acids: computeEfaScore(nutrients, bioavailability),
    carbohydrate_quality: computeCarbQualityScore(nutrients),
    bioavailability_antinutrients: computeBioavailabilityScore(bioavailability) - residuePenalty,
    unique_bioactives: computeBioactivesScore(bioactives),
    practical_efficiency: computePracticalEfficiencyScore(preparation),
  };

  const applyMultiplier = (axis: EvaluationAxis, raw: number): number => {
    if (axis === "protein_quality" || axis === "bioavailability_antinutrients" || axis === "essential_fatty_acids") {
      return clamp(raw * multiplier);
    }
    if (axis === "nutrient_density") {
      return clamp(raw * (0.9 + multiplier * 0.1));
    }
    return clamp(raw - residuePenalty * 0.3);
  };

  const buildScore = (axis: EvaluationAxis, raw: number): AxisScore => {
    const adjusted = applyMultiplier(axis, raw);
    return {
      raw: Math.round(raw),
      adjusted: Math.round(adjusted),
      tier: scoreToTier(adjusted),
      methodology: {
        de: `Rohwert ${Math.round(raw)} → angepasst ${Math.round(adjusted)} (Bioverfügbarkeits-Multiplikator: ${multiplier.toFixed(2)})`,
        en: `Raw ${Math.round(raw)} → adjusted ${Math.round(adjusted)} (bioavailability multiplier: ${multiplier.toFixed(2)})`,
      },
      sourceIds: [
        ...proteinQuality.sourceIds,
        ...bioavailability.sourceIds,
        ...(residues?.sourceIds ?? []),
      ],
    };
  };

  return {
    nutrient_density: buildScore("nutrient_density", rawScores.nutrient_density),
    protein_quality: buildScore("protein_quality", rawScores.protein_quality),
    essential_fatty_acids: buildScore("essential_fatty_acids", rawScores.essential_fatty_acids),
    carbohydrate_quality: buildScore("carbohydrate_quality", rawScores.carbohydrate_quality),
    bioavailability_antinutrients: buildScore("bioavailability_antinutrients", rawScores.bioavailability_antinutrients),
    unique_bioactives: buildScore("unique_bioactives", rawScores.unique_bioactives),
    practical_efficiency: buildScore("practical_efficiency", rawScores.practical_efficiency),
  };
}

export function computeCompositeScore(axisScores: Record<EvaluationAxis, AxisScore>): number {
  const values = Object.values(axisScores).map((s) => s.adjusted);
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

export function finalizeFoodScores(food: Omit<FoodItem, "axisScores" | "overallTier" | "classTier" | "globalTier"> & {
  axisScores?: Record<EvaluationAxis, AxisScore>;
}): FoodItem {
  const axisScores =
    food.axisScores ??
    computeAllAxisScores(
      food.nutrientProfile,
      food.proteinQuality,
      food.bioavailability,
      food.bioactives,
      food.preparation,
      food.residues,
    );

  const composite = computeCompositeScore(axisScores);
  const overallTier = scoreToTier(composite);

  return {
    ...food,
    axisScores,
    overallTier,
    classTier: overallTier,
    globalTier: overallTier,
  };
}

export function rankFoodsInClass(foods: FoodItem[]): FoodItem[] {
  const byCategory = new Map<string, FoodItem[]>();
  for (const food of foods) {
    const list = byCategory.get(food.category) ?? [];
    list.push(food);
    byCategory.set(food.category, list);
  }

  const result: FoodItem[] = [];
  for (const [, categoryFoods] of byCategory) {
    const sorted = [...categoryFoods].sort(
      (a, b) => computeCompositeScore(b.axisScores) - computeCompositeScore(a.axisScores),
    );
    sorted.forEach((food, index) => {
      const percentile = index / Math.max(sorted.length - 1, 1);
      const classTier: Tier =
        percentile <= 0.15 ? "S" : percentile <= 0.35 ? "A" : percentile <= 0.6 ? "B" : percentile <= 0.8 ? "C" : "D";
      result.push({ ...food, classTier });
    });
  }
  return result;
}

export function assignGlobalTiers(foods: FoodItem[]): FoodItem[] {
  const sorted = [...foods].sort(
    (a, b) => computeCompositeScore(b.axisScores) - computeCompositeScore(a.axisScores),
  );
  const tierMap = new Map<string, Tier>();
  sorted.forEach((food, index) => {
    const percentile = index / Math.max(sorted.length - 1, 1);
    const globalTier: Tier =
      percentile <= 0.1 ? "S" : percentile <= 0.3 ? "A" : percentile <= 0.55 ? "B" : percentile <= 0.8 ? "C" : "D";
    tierMap.set(food.id, globalTier);
  });
  return foods.map((f) => ({ ...f, globalTier: tierMap.get(f.id) ?? f.globalTier }));
}

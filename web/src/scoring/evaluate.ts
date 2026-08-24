import type { Food, FoodEvaluation, ScoreAxis } from "../types/domain.ts";
import { scoreCarbs } from "./carbs.ts";
import { scoreComposite } from "./composite.ts";
import { scoreDegradation } from "./degradation.ts";
import { scoreEaa } from "./eaa.ts";
import { scoreEfa } from "./efa.ts";
import { scoreFibrePhyto } from "./fibre.ts";
import { scoreMicros } from "./micros.ts";
import { scoreResidue } from "./residue.ts";
import { classTiers } from "./tiers.ts";

export function evaluateFood(food: Food): Omit<FoodEvaluation, "tiers"> {
  const eaa = scoreEaa(food);
  const efa = scoreEfa(food);
  const carb = scoreCarbs(food);
  const micro = scoreMicros(food);
  const fibre = scoreFibrePhyto(food);
  const residue = scoreResidue(food);
  const degrade = scoreDegradation(food);
  const composite = scoreComposite(food, {
    eaa_digestibility: eaa.score,
    efa_glyceride: efa.score,
    carb_type: carb.score,
    micronutrient_bioavail: micro.score,
    fibre_phyto: fibre.score,
    residue_risk: residue.score,
    degradation: degrade.score,
  });

  return {
    foodId: food.id,
    scores: {
      eaa_digestibility: eaa.score,
      efa_glyceride: efa.score,
      carb_type: carb.score,
      micronutrient_bioavail: micro.score,
      fibre_phyto: fibre.score,
      residue_risk: residue.score,
      degradation: degrade.score,
      composite: composite.score,
    },
    eaa,
    breakdowns: [efa, carb, micro, fibre, residue, degrade, composite],
  };
}

export function evaluateAll(foods: readonly Food[]): FoodEvaluation[] {
  const partials = foods.map((food) => evaluateFood(food));
  const scoresById: Record<string, Readonly<Record<ScoreAxis, number>>> = {};
  for (const partial of partials) {
    scoresById[partial.foodId] = partial.scores;
  }

  const axes = Object.keys(partials[0]?.scores ?? {}) as ScoreAxis[];
  const tiersByAxis = axes.map((axis) => classTiers(foods, scoresById, axis));

  return partials.map((partial) => {
    const tiers = {} as Record<ScoreAxis, FoodEvaluation["tiers"][ScoreAxis]>;
    for (const [index, axis] of axes.entries()) {
      const map = tiersByAxis[index];
      const tier = map?.[partial.foodId];
      if (!tier) {
        throw new Error(`Missing tier for ${partial.foodId} / ${axis}`);
      }
      tiers[axis] = tier;
    }
    return { ...partial, tiers };
  });
}

export function evaluationById(
  evaluations: readonly FoodEvaluation[],
): Readonly<Record<string, FoodEvaluation>> {
  const map: Record<string, FoodEvaluation> = {};
  for (const evaluation of evaluations) {
    map[evaluation.foodId] = evaluation;
  }
  return map;
}

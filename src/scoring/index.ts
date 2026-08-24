import { MANIFEST } from "../data/manifest";
import type { Food, FoodScores } from "../data/types";
import { scoreCarbs } from "./carbs";
import { scoreComposite } from "./composite";
import { scoreDegradation } from "./degradation";
import { scoreEaa } from "./eaa";
import { scoreFattyAcids } from "./fattyAcids";
import { scoreFibre } from "./fibre";
import { scoreMicros } from "./micros";
import { scoreResidues } from "./residues";
import { assignTiersWithinClasses } from "./tiers";

export function scoreFood(food: Food): FoodScores {
  const eaa = scoreEaa(food);
  const fat = scoreFattyAcids(food);
  const carb = scoreCarbs(food);
  const micro = scoreMicros(food);
  const fibre = scoreFibre(food);
  const residue = scoreResidues(food);
  const degradation = scoreDegradation(food);
  const composite = scoreComposite(food, {
    eaa,
    fat,
    carb,
    micro,
    fibre,
    residue,
    degradation,
  });
  return {
    foodId: food.id,
    eaa,
    fat,
    carb,
    micro,
    fibre,
    residue,
    degradation,
    composite,
    tier: "B",
    formulaVersion: MANIFEST.formulaVersion,
    dataVersion: MANIFEST.dataVersion,
  };
}

export function scoreCatalog(foods: Food[]): FoodScores[] {
  const raw = foods.map(scoreFood);
  return assignTiersWithinClasses(foods, raw);
}

export {
  scoreCarbs,
  scoreComposite,
  scoreDegradation,
  scoreEaa,
  scoreFattyAcids,
  scoreFibre,
  scoreMicros,
  scoreResidues,
};

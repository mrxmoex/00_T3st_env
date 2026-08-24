import { scoreCarbs } from "./carbs";
import { scoreComposite } from "./composite";
import { scoreDegradation } from "./degradation";
import { scoreEaa } from "./eaa";
import { scoreEfa } from "./efa";
import { scoreClassExtras } from "./extras";
import { scoreFibre } from "./fibre";
import { scoreMicros } from "./micros";
import { scoreResidue } from "./residue";
import { compareByCompositeDesc, tierFromScore } from "./tiers";
import type { FoodRecord, ScoreCard } from "./types";

export function scoreFood(food: FoodRecord): Omit<ScoreCard, "classRank" | "classSize"> {
  const eaa = scoreEaa(food);
  const efa = scoreEfa(food);
  const carb = scoreCarbs(food);
  const micro = scoreMicros(food);
  const fibre = scoreFibre(food);
  const residue = scoreResidue(food);
  const degradation = scoreDegradation(food);
  const composite = scoreComposite(
    {
      eaa: eaa.score,
      efa: efa.score,
      carb: carb.score,
      micro: micro.score,
      fibre: fibre.score,
      residue: residue.score,
      degradation: degradation.score,
    },
    food.class,
  );

  return {
    foodId: food.id,
    eaa,
    efa,
    carb,
    micro,
    fibre,
    residue,
    degradation,
    extras: scoreClassExtras(food),
    composite,
    tier: tierFromScore(composite),
  };
}

export function scoreCatalog(foods: readonly FoodRecord[]): ScoreCard[] {
  const raw = foods.map((food) => ({ food, card: scoreFood(food) }));
  const byClass = new Map<string, typeof raw>();
  for (const row of raw) {
    const list = byClass.get(row.food.class) ?? [];
    list.push(row);
    byClass.set(row.food.class, list);
  }

  const cards: ScoreCard[] = [];
  for (const group of byClass.values()) {
    const sorted = [...group].sort((a, b) =>
      compareByCompositeDesc(a.card.composite, b.card.composite),
    );
    sorted.forEach((row, index) => {
      cards.push({
        ...row.card,
        classRank: index + 1,
        classSize: sorted.length,
      });
    });
  }
  return cards;
}

export function cardByFoodId(cards: readonly ScoreCard[], foodId: string): ScoreCard | undefined {
  return cards.find((card) => card.foodId === foodId);
}

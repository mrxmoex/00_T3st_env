import { weightsFor } from "../data/weights";
import type { AxisBreakdown, Food, ScoreAxis } from "../data/types";
import { clamp } from "../lib/math";

export function scoreComposite(
  food: Food,
  axes: Record<Exclude<ScoreAxis, "composite">, AxisBreakdown>,
): number {
  const w = weightsFor(food.foodClass);
  const raw =
    w.eaa * axes.eaa.score +
    w.fat * axes.fat.score +
    w.carb * axes.carb.score +
    w.micro * axes.micro.score +
    w.fibre * axes.fibre.score +
    w.residue * axes.residue.score +
    w.degradation * axes.degradation.score;
  return clamp(raw, 0, 100);
}

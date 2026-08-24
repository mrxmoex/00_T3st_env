import { weightsFor } from "../data/classWeights";
import { round1 } from "./math";
import type { FoodClass } from "./types";

export interface AxisSet {
  eaa: number;
  efa: number;
  carb: number;
  micro: number;
  fibre: number;
  residue: number;
  degradation: number;
}

/**
 * Overall efficiency-value-nutrition composite.
 * Weighted sum of the seven biochemical axes using class-specific weights.
 * Not an AI score. Deterministic and reproducible.
 */
export function scoreComposite(axes: AxisSet, foodClass: FoodClass): number {
  const w = weightsFor(foodClass);
  const value =
    w.eaa * axes.eaa +
    w.efa * axes.efa +
    w.carb * axes.carb +
    w.micro * axes.micro +
    w.fibre * axes.fibre +
    w.residue * axes.residue +
    w.degradation * axes.degradation;
  return round1(value);
}

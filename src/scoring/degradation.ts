import type { AxisBreakdown, Food } from "../data/types";
import { clamp } from "../lib/math";

export function scoreDegradation(food: Food): AxisBreakdown {
  const d = food.degradation;
  const timeFactor = 1 - Math.min(1, d.storageDaysTypical / 21);
  const stress =
    0.3 * d.waterSolubleVitaminRisk +
    0.18 * d.fatSolubleOxidationRisk +
    0.2 * d.cuttingSensitivity +
    0.16 * d.heatSensitivity +
    0.16 * timeFactor;
  const notes = [
    `Water-soluble vitamin risk ${d.waterSolubleVitaminRisk.toFixed(2)}; fat-soluble oxidation ${d.fatSolubleOxidationRisk.toFixed(2)}.`,
    `Cutting ${d.cuttingSensitivity.toFixed(2)}, heat ${d.heatSensitivity.toFixed(2)}, typical storage ${d.storageDaysTypical} d.`,
  ];
  if (food.fermented) {
    notes.push(
      "Fermented item: scored as the fermented food, not its raw precursor.",
    );
  }
  return {
    score: clamp(100 * (1 - stress), 0, 100),
    flags: [
      {
        key: "time_factor",
        applied: true,
        value: timeFactor,
        reason: "1 − min(1, storageDays/21)",
      },
    ],
    notes,
  };
}

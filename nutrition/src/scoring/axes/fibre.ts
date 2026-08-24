import type { FoodRecord } from "../../types.js";
import { clamp } from "../utils.js";

export function scoreFibrePhytochemical(food: FoodRecord): number {
  const fibreScore = Math.min(60, food.per100g.fibreG * 6);
  const phytoScore = food.phytochemicalIndex * 40;
  return clamp(fibreScore + phytoScore);
}

import type { FoodRecord } from "../../types.js";
import { clamp } from "../utils.js";

export function scoreCarbs(food: FoodRecord): number {
  const { starchG, sugarsG, fibreG } = food.per100g;
  const activeG = starchG + sugarsG;
  const passiveG = fibreG;
  const activeRatio = activeG / (activeG + passiveG + 1);
  const legumeFactor = food.division === "legumes" ? 0.7 : 1;
  return clamp(100 * (1 - activeRatio * legumeFactor));
}

import type { DietaryPattern, FoodRecord, ScoredFood } from "../types.js";
export declare function scoreFood(food: FoodRecord): ScoredFood;
export declare function applyDietaryFlags(scored: ScoredFood, pattern: DietaryPattern): ScoredFood;
export declare function scoreAllFoods(foods: FoodRecord[], pattern?: DietaryPattern): ScoredFood[];

export { SAMPLE_FOODS, getFoodById, } from "./data/sample-foods.js";
export { scoreFood, scoreAllFoods, applyDietaryFlags } from "./scoring/engine.js";
export { getDivisionWeights } from "./data/division-weights.js";
export * from "./types.js";
export { DATASET_VERSION, LAST_VERIFICATION_DATE, COEFFICIENT_VERSION, } from "./data/version.js";
export declare function getNutritionMeta(): {
    title: string;
    datasetVersion: string;
    coefficientVersion: string;
    lastVerificationDate: string;
    foodCount: number;
};
export declare function getAllScored(pattern?: "omnivore" | "vegan" | "low_residue"): import("./types.js").ScoredFood[];

import { getDivisionWeights } from "../data/division-weights.js";
import { scoreEaa } from "./axes/eaa.js";
import { scoreEfa } from "./axes/efa.js";
import { scoreCarbs } from "./axes/carbs.js";
import { scoreMicronutrients } from "./axes/micronutrients.js";
import { scoreFibrePhytochemical } from "./axes/fibre.js";
import { scoreResidue } from "./axes/residue.js";
import { scoreDegradation } from "./axes/degradation.js";
import { computeComposite, tierFromComposite } from "./composite.js";
export function scoreFood(food) {
    const axisScores = {
        eaaCompletenessDigestibility: scoreEaa(food),
        efaGlycerideProfile: scoreEfa(food),
        carbohydrateType: scoreCarbs(food),
        micronutrientDensity: scoreMicronutrients(food),
        fibrePhytochemical: scoreFibrePhytochemical(food),
        residueRisk: scoreResidue(food),
        degradationSensitivity: scoreDegradation(food),
    };
    const weights = getDivisionWeights(food.division);
    const composite = computeComposite(axisScores, weights);
    const tier = tierFromComposite(composite);
    return {
        food,
        scores: { ...axisScores, composite, tier },
        flags: [],
    };
}
export function applyDietaryFlags(scored, pattern) {
    const flags = [...scored.flags];
    if (pattern === "vegan" && scored.food.kingdom === "plant") {
        if (scored.food.per100g.vitaminB12Ug < 0.1) {
            flags.push("No native B12 — plant-only diets require fortification or supplementation");
        }
        if (scored.food.per100g.fattyAcids.epa + scored.food.per100g.fattyAcids.dha <
            0.01) {
            flags.push("No EPA/DHA — ALA conversion is limited; consider algae oil or fortification");
        }
        if (scored.scores.eaaCompletenessDigestibility < 70) {
            flags.push("Incomplete plant protein — pair with complementary amino acid sources");
        }
        if (scored.food.bioavailability.ironFactor <= 0.12) {
            flags.push("Low non-heme iron bioavailability — phytate/mineral interactions apply");
        }
    }
    if (pattern === "low_residue") {
        if (scored.scores.residueRisk < 60) {
            flags.push("Elevated residue tier for this crop class — review MRL context");
        }
    }
    return { ...scored, flags };
}
export function scoreAllFoods(foods, pattern = "omnivore") {
    return foods.map((f) => applyDietaryFlags(scoreFood(f), pattern));
}

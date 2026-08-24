import { WHO_REFERENCE_AA } from "../../coefficients.js";
import { clamp } from "../utils.js";
export function scoreEaa(food) {
    const { bioavailability, per100g } = food;
    const completeness = bioavailability.completeness ??
        computeLimitingRatio(per100g.aminoAcids, per100g.proteinG);
    const digestibility = food.kingdom === "animal"
        ? bioavailability.diaas ?? 0.95
        : bioavailability.pdcaas ?? 0.5;
    return clamp(100 * completeness * digestibility);
}
function computeLimitingRatio(aminoAcids, proteinG) {
    if (proteinG <= 0)
        return 0;
    const proteinMg = proteinG * 1000;
    let limiting = 1;
    for (const key of Object.keys(WHO_REFERENCE_AA)) {
        const ref = WHO_REFERENCE_AA[key];
        const actual = aminoAcids[key] / proteinMg;
        const ratio = actual / ref;
        if (ratio < limiting)
            limiting = ratio;
    }
    return clamp(limiting, 0, 1);
}

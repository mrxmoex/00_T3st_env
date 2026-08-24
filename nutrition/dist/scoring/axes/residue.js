import { clamp } from "../utils.js";
export function scoreResidue(food) {
    const { pesticideTier, heavyMetalTier, dioxinTier } = food.residue;
    const riskIndex = pesticideTier * 0.45 + heavyMetalTier * 0.35 + dioxinTier * 0.2;
    return clamp(100 - riskIndex);
}

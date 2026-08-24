import { OMEGA_TARGET_RATIO } from "../../coefficients.js";
import { clamp } from "../utils.js";
export function scoreEfa(food) {
    const { fattyAcids } = food.per100g;
    const omega6 = fattyAcids.omega6;
    const omega3 = fattyAcids.omega3;
    const ratio = omega3 > 0 ? omega6 / omega3 : omega6 > 0 ? 20 : OMEGA_TARGET_RATIO;
    const omegaScore = 100 * Math.exp(-Math.abs(Math.log(ratio) - Math.log(OMEGA_TARGET_RATIO)));
    const epaDha = fattyAcids.epa + fattyAcids.dha;
    const epaDhaBonus = Math.min(30, epaDha * 15);
    let base = food.kingdom === "plant" && epaDha < 0.01
        ? Math.min(omegaScore, 55)
        : omegaScore;
    const satPenalty = Math.min(25, Math.max(0, (fattyAcids.saturated - 5) * 2));
    return clamp(base + epaDhaBonus - satPenalty);
}

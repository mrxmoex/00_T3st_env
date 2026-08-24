import { clamp, num, round } from "./math.js";

export function scoreFibrePhyto(food) {
  const fiber = num(food.carbs?.fiberG);
  const phyto = food.phytochemicals ?? {};
  const poly = num(phyto.polyphenolsMg);
  const gluc = num(phyto.glucosinolatesMg);
  const pigments = num(phyto.uniquePigmentsMg);
  const fiberScore = clamp(fiber / 8, 0, 1) * 50;
  const phytoScore = clamp((poly + gluc * 2 + pigments) / 80, 0, 1) * 45;
  const fermentedBonus = food.fermented && food.classId === "cruciferous_kraut" ? 6 : 0;
  const fungiBonus = food.classId === "mushrooms" ? 4 : 0;
  const algaeBonus = food.classId === "algae" ? 4 : 0;
  const score = clamp(fiberScore + phytoScore + fermentedBonus + fungiBonus + algaeBonus, 0, 100);
  return {
    score: round(score, 2),
    formula:
      "0–50 from fibre/8 g, 0–45 from polyphenols + 2×glucosinolates + unique pigments. Fermented kraut, mushrooms, and algae get class-specific (not interchangeable) bonuses.",
  };
}

export function scoreResidue(food) {
  const r = food.residues ?? {};
  const risk =
    0.4 * clamp(num(r.pesticideRisk), 0, 1) +
    0.35 * clamp(num(r.heavyMetalRisk), 0, 1) +
    0.25 * clamp(num(r.persistentOrganicRisk), 0, 1);
  return {
    risk: round(risk, 4),
    score: round(clamp(100 * (1 - risk), 0, 100), 2),
    formula: "score = 100 × (1 − (0.40×pesticide + 0.35×heavy_metal + 0.25×POP)). Higher is cleaner.",
  };
}

export function scoreDegradation(food) {
  const d = food.degradation ?? {};
  const fragility =
    0.35 * clamp(num(d.waterSolubleVitaminLoad), 0, 1) +
    0.25 * clamp(num(d.cutSurfaceIndex), 0, 1) +
    0.2 * clamp(num(d.heatLability), 0, 1) +
    0.2 * clamp(num(d.pufaOxidationRisk), 0, 1);
  return {
    fragility: round(fragility, 4),
    score: round(clamp(100 * (1 - fragility), 0, 100), 2),
    formula:
      "fragility = 0.35×water-soluble vitamin load + 0.25×cut surface + 0.20×heat lability + 0.20×PUFA oxidation; score = 100 × (1 − fragility).",
  };
}

import { bioactiveMg } from "../data/bioactives";
import { clamp01, round1 } from "./math";
import { hemeIronMg } from "./micros";
import type { FoodClass, FoodRecord } from "./types";

/**
 * Class-specific matrix columns. These do not replace the core axes.
 * They make classes non-interchangeable in the table.
 */
export function classExtraColumns(foodClass: FoodClass): string[] {
  switch (foodClass) {
    case "leafy_salad":
      return ["folateDensity", "vitaminKDensity", "nitrateProxy", "surfaceResidue"];
    case "legumes":
      return ["lysineAdequacy", "saaAdequacy", "phytatePenalty", "resistantStarch"];
    case "sprouts":
      return ["livingTissueLability", "pathogenProxy", "folateDensity"];
    case "cruciferous_fresh":
      return ["glucosinolates", "goitrogenProxy", "vitaminCRetention"];
    case "cruciferous_fermented":
      return ["organicAcidStability", "glucosinolates", "sodiumNote"];
    case "mushrooms":
      return ["ergothioneine", "vitaminDPotential", "chitinDigestPenalty"];
    case "algae":
      return ["iodineDensity", "preformedN3", "inactiveB12Flag", "metalLoad"];
    case "roots_tubers":
      return ["starchActivity", "carotenoidOnlyA", "resistantStarch"];
    case "other_vegetables":
      return ["vitaminCDensity", "waterWeight"];
    case "muscle_ruminant":
      return ["eaaCompleteness", "oddChainCla", "creatine", "hemeIron"];
    case "muscle_monogastric":
      return ["eaaCompleteness", "n6Load", "creatine", "hemeIron"];
    case "muscle_poultry":
      return ["eaaCompleteness", "leanness", "creatine", "hemeIron"];
    case "muscle_fish":
      return ["eaaCompleteness", "epaDha", "iodineSelenium", "metalLoad"];
    case "organs":
      return ["retinolDensity", "b12Density", "copperDensity", "creatine"];
    case "eggs":
      return ["eaaCompleteness", "cholineDensity", "yolkFatQuality"];
    case "dairy":
      return ["eaaCompleteness", "calciumDensity", "lactoseLoad"];
    case "fermented_animal":
      return ["eaaCompleteness", "calciumDensity", "fermentationStability"];
    default: {
      const _exhaustive: never = foodClass;
      return _exhaustive;
    }
  }
}

export function scoreClassExtras(food: FoodRecord): Record<string, number | null> {
  const extras: Record<string, number | null> = {};
  const columns = classExtraColumns(food.class);
  for (const column of columns) {
    const value = scoreExtraColumn(food, column);
    extras[column] = value === null ? null : round1(value);
  }
  return extras;
}

function per100kcal(amount: number | null, kcal: number): number | null {
  return amount === null ? null : (amount / kcal) * 100;
}

function scaled(value: number | null, full: number): number | null {
  return value === null ? null : 100 * clamp01(value / full);
}

function inverted(value: number | null, full: number): number | null {
  return value === null ? null : 100 * (1 - clamp01(value / full));
}

function scoreExtraColumn(food: FoodRecord, column: string): number | null {
  const kcal = Math.max(food.kcalPer100g, 1);
  switch (column) {
    case "folateDensity":
      return scaled(per100kcal(food.micros.folateUg, kcal), 80);
    case "vitaminKDensity":
      return scaled(per100kcal(food.micros.vitaminKUg, kcal), 200);
    case "nitrateProxy":
      return food.class === "leafy_salad" ? 70 : 40;
    case "surfaceResidue":
      return food.residue.surfaceAreaClass === "high" ? 25 : 60;
    case "lysineAdequacy":
      return 100 * clamp01(food.aminoAcids.lys / 48);
    case "saaAdequacy":
      return 100 * clamp01((food.aminoAcids.met + food.aminoAcids.cys) / 23);
    case "phytatePenalty":
      return food.micros.zincBoundByPhytate ? 35 : 80;
    case "resistantStarch":
      return 100 * clamp01(food.carbs.resistantStarch / 4);
    case "livingTissueLability":
      return 100 * (1 - clamp01(food.degradation.perishabilityDays / 10));
    case "pathogenProxy":
      return food.class === "sprouts" ? 30 : 70;
    case "glucosinolates":
      return scaled(bioactiveMg(food, "glucosinolates"), 100);
    case "goitrogenProxy":
      return 55;
    case "vitaminCRetention":
      return scaled(food.micros.vitaminCMg, 80);
    case "organicAcidStability":
      return 88;
    case "sodiumNote":
      return inverted(food.composition.sodiumMg, 800);
    case "ergothioneine":
      return scaled(bioactiveMg(food, "ergothioneine"), 10);
    case "vitaminDPotential":
      return 100 * clamp01(food.micros.vitaminDUg / 5);
    case "chitinDigestPenalty":
      return 100 * food.ilealDigestibility;
    case "iodineDensity":
      return scaled(per100kcal(food.micros.iodineUg, kcal), 80);
    case "preformedN3":
      return 100 * clamp01((food.fattyAcids.omega3Epa + food.fattyAcids.omega3Dha) / 0.3);
    case "inactiveB12Flag":
      return food.micros.b12IsAnalogue ? 0 : scaled(food.micros.vitaminB12Ug, 2.4);
    case "metalLoad":
      return food.residue.heavyMetalClass === "elevated"
        ? 25
        : food.residue.heavyMetalClass === "moderate"
          ? 55
          : 85;
    case "starchActivity":
      return 100 * (1 - clamp01(food.carbs.starch / 20));
    case "carotenoidOnlyA":
      return food.micros.vitaminARetinolUg > 0 ? 90 : 40;
    case "vitaminCDensity":
      return scaled(per100kcal(food.micros.vitaminCMg, kcal), 40);
    case "waterWeight":
      return 100 * clamp01(1 - food.kcalPer100g / 80);
    case "eaaCompleteness":
      return 100 * clamp01(Math.min(1, (food.aminoAcids.lys / 48 + (food.aminoAcids.met + food.aminoAcids.cys) / 23) / 2));
    case "oddChainCla": {
      const { oddChain, cla } = food.fattyAcids;
      return oddChain === null && cla === null ? null : scaled((oddChain ?? 0) + (cla ?? 0), 0.4);
    }
    case "creatine":
      return scaled(bioactiveMg(food, "creatine"), 400);
    case "hemeIron":
      return 100 * clamp01(hemeIronMg(food) / 1.8);
    case "n6Load":
      return 100 * (1 - clamp01(food.fattyAcids.omega6La / 3));
    case "leanness":
      return 100 * clamp01(1 - food.fatG / 20);
    case "epaDha":
      return 100 * clamp01((food.fattyAcids.omega3Epa + food.fattyAcids.omega3Dha) / 1.5);
    case "iodineSelenium": {
      const parts = [scaled(food.micros.iodineUg, 50), scaled(food.micros.seleniumUg, 40)].filter(
        (part): part is number => part !== null,
      );
      return parts.length === 0 ? null : parts.reduce((sum, part) => sum + part, 0) / parts.length;
    }
    case "retinolDensity":
      return 100 * clamp01(food.micros.vitaminARetinolUg / 3000);
    case "b12Density":
      return scaled(food.micros.vitaminB12Ug, 20);
    case "copperDensity":
      return scaled(food.micros.copperMg, 2);
    case "cholineDensity":
      return scaled(food.micros.cholineMg, 250);
    case "yolkFatQuality":
      return 72;
    case "calciumDensity":
      return scaled(per100kcal(food.micros.calciumMg, kcal), 150);
    case "lactoseLoad":
      return inverted(food.composition.lactoseG, 5);
    case "fermentationStability":
      return 85;
    default:
      return 50;
  }
}

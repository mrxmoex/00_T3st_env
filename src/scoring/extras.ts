import { clamp01, round1 } from "./math";
import type { FoodClass, FoodRecord } from "./types";
import { kingdomOf } from "./types";

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
      return ["livingTissueLability", "pathogenProxy", "sulforaphaneProxy"];
    case "cruciferous_fresh":
      return ["glucosinolateProxy", "goitrogenProxy", "vitaminCRetention"];
    case "cruciferous_fermented":
      return ["organicAcidStability", "glucosinolateProxy", "sodiumNote"];
    case "mushrooms":
      return ["ergothioneineProxy", "vitaminDPotential", "chitinDigestPenalty"];
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
      return ["retinolDensity", "b12Density", "copperProxy", "creatine"];
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

export function scoreClassExtras(food: FoodRecord): Record<string, number> {
  const extras: Record<string, number> = {};
  const columns = classExtraColumns(food.class);
  for (const column of columns) {
    extras[column] = round1(scoreExtraColumn(food, column));
  }
  return extras;
}

function scoreExtraColumn(food: FoodRecord, column: string): number {
  const kcal = Math.max(food.kcalPer100g, 1);
  switch (column) {
    case "folateDensity":
      return 100 * clamp01(((food.micros.folateUg / kcal) * 100) / 80);
    case "vitaminKDensity":
      return 100 * clamp01(((food.micros.vitaminKUg / kcal) * 100) / 200);
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
    case "sulforaphaneProxy":
      return food.id.includes("broccoli") ? 85 : 45;
    case "glucosinolateProxy":
      return 80;
    case "goitrogenProxy":
      return 55;
    case "vitaminCRetention":
      return 100 * clamp01(food.micros.vitaminCMg / 80);
    case "organicAcidStability":
      return 88;
    case "sodiumNote":
      return 40;
    case "ergothioneineProxy":
      return food.id.includes("shiitake") ? 85 : 65;
    case "vitaminDPotential":
      return 100 * clamp01(food.micros.vitaminDUg / 5);
    case "chitinDigestPenalty":
      return 100 * food.ilealDigestibility;
    case "iodineDensity":
      return 100 * clamp01(((food.micros.iodineUg / kcal) * 100) / 80);
    case "preformedN3":
      return 100 * clamp01((food.fattyAcids.omega3Epa + food.fattyAcids.omega3Dha) / 0.3);
    case "inactiveB12Flag":
      return food.micros.b12IsAnalogue ? 0 : 100 * clamp01(food.micros.vitaminB12Ug / 2.4);
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
      return 100 * clamp01(((food.micros.vitaminCMg / kcal) * 100) / 40);
    case "waterWeight":
      return 100 * clamp01(1 - food.kcalPer100g / 80);
    case "eaaCompleteness":
      return 100 * clamp01(Math.min(1, (food.aminoAcids.lys / 48 + (food.aminoAcids.met + food.aminoAcids.cys) / 23) / 2));
    case "oddChainCla":
      return 100 * clamp01((food.fattyAcids.oddChain + food.fattyAcids.cla) / 0.4);
    case "creatine":
      return 100 * clamp01(food.animalCompounds.creatineMg / 400);
    case "hemeIron":
      return food.micros.ironForm === "heme" ? 100 * clamp01(food.micros.ironMg / 3) : 20;
    case "n6Load":
      return 100 * (1 - clamp01(food.fattyAcids.omega6La / 3));
    case "leanness":
      return 100 * clamp01(1 - food.fatG / 20);
    case "epaDha":
      return 100 * clamp01((food.fattyAcids.omega3Epa + food.fattyAcids.omega3Dha) / 1.5);
    case "iodineSelenium":
      return 100 * clamp01((food.micros.iodineUg / 50 + food.micros.seleniumUg / 40) / 2);
    case "retinolDensity":
      return 100 * clamp01(food.micros.vitaminARetinolUg / 3000);
    case "b12Density":
      return 100 * clamp01(food.micros.vitaminB12Ug / 20);
    case "copperProxy":
      return food.class === "organs" ? 80 : 20;
    case "cholineDensity":
      return 100 * clamp01(food.micros.cholineMg / 250);
    case "yolkFatQuality":
      return 72;
    case "calciumDensity":
      return 100 * clamp01(((food.micros.calciumMg / kcal) * 100) / 150);
    case "lactoseLoad":
      return 100 * (1 - clamp01(food.carbs.sugars / 5));
    case "fermentationStability":
      return 85;
    default:
      return kingdomOf(food.class) === "animal" ? 50 : 50;
  }
}

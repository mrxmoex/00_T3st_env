import {
  BETA_CAROTENE_TO_RAE,
  DENSITY_REFS,
  DENSITY_SATURATION_PCT_DV,
  HEME_SHARE_OF_MIXED_IRON,
  IRON_ABSORPTION,
  OTHER_CAROTENOID_TO_RAE,
  VITAMIN_C_IRON_ENHANCER_MG,
  ZINC_ABSORPTION,
} from "../data/coefficients";
import { MICRO_LABELS } from "../i18n/labels";
import type { LocalizedText } from "../i18n/locale";
import { clamp01, mean, round1, round2, round3 } from "./math";
import {
  MICRO_NUTRIENTS,
  kingdomOf,
  type FoodRecord,
  type IronForm,
  type MicroBreakdown,
  type MicroNutrient,
  type MicroNutrientDensity,
} from "./types";

function ironAbsorptionCoefficient(form: IronForm, vitaminCMg: number, phytate: boolean): number {
  switch (form) {
    case "heme":
      return IRON_ABSORPTION.heme;
    case "mixed":
      return (
        HEME_SHARE_OF_MIXED_IRON * IRON_ABSORPTION.heme +
        (1 - HEME_SHARE_OF_MIXED_IRON) * IRON_ABSORPTION.nonhemeBase
      );
    case "nonheme":
      if (phytate) return IRON_ABSORPTION.nonhemeHighPhytate;
      if (vitaminCMg >= VITAMIN_C_IRON_ENHANCER_MG) return IRON_ABSORPTION.nonhemeWithVitaminC;
      return IRON_ABSORPTION.nonhemeBase;
    default: {
      const _exhaustive: never = form;
      return _exhaustive;
    }
  }
}

export function hemeIronMg(food: FoodRecord): number {
  switch (food.micros.ironForm) {
    case "heme":
      return food.micros.ironMg;
    case "mixed":
      return food.micros.ironMg * HEME_SHARE_OF_MIXED_IRON;
    case "nonheme":
      return 0;
    default: {
      const _exhaustive: never = food.micros.ironForm;
      return _exhaustive;
    }
  }
}

export function retinolActivityEquivalentsUg(food: FoodRecord): number {
  const m = food.micros;
  if (m.vitaminABetaCaroteneUg === null || m.vitaminAOtherCarotenoidsUg === null) {
    return m.vitaminARaeUg;
  }
  return (
    m.vitaminARetinolUg +
    m.vitaminABetaCaroteneUg * BETA_CAROTENE_TO_RAE +
    m.vitaminAOtherCarotenoidsUg * OTHER_CAROTENOID_TO_RAE
  );
}

export function absorbableIronMg(food: FoodRecord): number {
  const coeff = ironAbsorptionCoefficient(
    food.micros.ironForm,
    food.micros.vitaminCMg ?? 0,
    food.micros.zincBoundByPhytate,
  );
  return food.micros.ironMg * coeff;
}

export function absorbableZincMg(food: FoodRecord): number {
  const coeff =
    kingdomOf(food.class) === "animal"
      ? ZINC_ABSORPTION.animal
      : food.micros.zincBoundByPhytate
        ? ZINC_ABSORPTION.phytateBound
        : ZINC_ABSORPTION.lowPhytatePlant;
  return food.micros.zincMg * coeff;
}

/** Null when no source reports B12; algal and fungal analogues count as 0. */
export function effectiveB12Ug(food: FoodRecord): number | null {
  if (food.micros.b12IsAnalogue) return 0;
  return food.micros.vitaminB12Ug;
}

/** Amount per 100 g that enters the density score, after bioavailability adjustment. */
export function microAmounts(food: FoodRecord): Record<MicroNutrient, number | null> {
  const m = food.micros;
  return {
    iron: absorbableIronMg(food),
    zinc: absorbableZincMg(food),
    vitaminA: retinolActivityEquivalentsUg(food),
    vitaminB12: effectiveB12Ug(food),
    folate: m.folateUg,
    vitaminC: m.vitaminCMg,
    vitaminD: m.vitaminDUg,
    vitaminE: m.vitaminEMg,
    vitaminK: m.vitaminKUg,
    thiamin: m.thiaminMg,
    riboflavin: m.riboflavinMg,
    niacin: m.niacinMg,
    vitaminB6: m.vitaminB6Mg,
    choline: m.cholineMg,
    calcium: m.calciumMg,
    magnesium: m.magnesiumMg,
    potassium: m.potassiumMg,
    copper: m.copperMg,
    selenium: m.seleniumUg,
    iodine: m.iodineUg,
  };
}

function pctDvPer100kcal(amount: number, ref: number, kcal: number): number {
  return ((amount / Math.max(kcal, 1)) * 100 * 100) / ref;
}

function listLabels(nutrients: readonly MicroNutrient[]): LocalizedText {
  return {
    en: nutrients.map((n) => MICRO_LABELS[n].en).join(", "),
    de: nutrients.map((n) => MICRO_LABELS[n].de).join(", "),
  };
}

/**
 * Micronutrient density per calorie after bioavailability adjustment, over the
 * nutrients the sources report. Non-heme iron, phytate-bound zinc, and carotenoid-A
 * are not treated as equal to heme iron, animal zinc, or preformed retinol.
 * Algal B12 analogues contribute 0. Missing values are excluded, never read as 0.
 */
export function scoreMicros(food: FoodRecord): MicroBreakdown {
  const kcal = food.kcalPer100g;
  const amounts = microAmounts(food);
  const nutrients = Object.fromEntries(
    MICRO_NUTRIENTS.map((nutrient): [MicroNutrient, MicroNutrientDensity] => {
      const amount = amounts[nutrient];
      return [
        nutrient,
        {
          amount: amount === null ? null : round3(amount),
          pctDvPer100kcal: amount === null ? null : round1(pctDvPer100kcal(amount, DENSITY_REFS[nutrient], kcal)),
        },
      ];
    }),
  ) as Record<MicroNutrient, MicroNutrientDensity>;

  const scored = MICRO_NUTRIENTS.filter((nutrient) => amounts[nutrient] !== null);
  const contributions = scored.map((nutrient) =>
    clamp01(pctDvPer100kcal(amounts[nutrient] ?? 0, DENSITY_REFS[nutrient], kcal) / DENSITY_SATURATION_PCT_DV),
  );
  const score = 100 * mean(contributions);
  const flags: LocalizedText[] = [];

  switch (food.micros.ironForm) {
    case "heme":
      flags.push({
        en: `Heme iron ${food.micros.ironMg} mg × absorption ${IRON_ABSORPTION.heme}`,
        de: `Hämeisen ${food.micros.ironMg} mg × Resorption ${IRON_ABSORPTION.heme}`,
      });
      break;
    case "mixed":
      flags.push({
        en: `Iron ${food.micros.ironMg} mg, about ${Math.round(HEME_SHARE_OF_MIXED_IRON * 100)} % heme; weighted absorption applied`,
        de: `Eisen ${food.micros.ironMg} mg, etwa ${Math.round(HEME_SHARE_OF_MIXED_IRON * 100)} % Häm; gewichtete Resorption angewendet`,
      });
      break;
    case "nonheme": {
      const phytate = food.micros.zincBoundByPhytate;
      flags.push({
        en: `Non-heme iron ${food.micros.ironMg} mg. Not equivalent to heme. Phytate present: ${phytate ? "yes" : "no"}`,
        de: `Nicht-Hämeisen ${food.micros.ironMg} mg. Nicht gleichwertig mit Hämeisen. Phytat vorhanden: ${phytate ? "ja" : "nein"}`,
      });
      break;
    }
    default: {
      const _exhaustive: never = food.micros.ironForm;
      throw new Error(`Unhandled iron form: ${_exhaustive}`);
    }
  }

  const betaCarotene = food.micros.vitaminABetaCaroteneUg;
  if (food.micros.vitaminARetinolUg <= 0 && betaCarotene !== null && betaCarotene > 0) {
    flags.push({
      en: `No preformed retinol. β-carotene ${betaCarotene} µg × ${round3(BETA_CAROTENE_TO_RAE)} (1/12 food RAE)`,
      de: `Kein vorgeformtes Retinol. β-Carotin ${betaCarotene} µg × ${round3(BETA_CAROTENE_TO_RAE)} (1/12 Lebensmittel-RAE)`,
    });
  }
  if (food.micros.zincBoundByPhytate) {
    flags.push({
      en: `Phytate-bound zinc: absorption ${ZINC_ABSORPTION.phytateBound} vs animal ${ZINC_ABSORPTION.animal}`,
      de: `Phytatgebundenes Zink: Resorption ${ZINC_ABSORPTION.phytateBound} vs. tierisch ${ZINC_ABSORPTION.animal}`,
    });
  }
  const b12 = effectiveB12Ug(food);
  if (food.micros.b12IsAnalogue) {
    flags.push({
      en: "Measured corrinoids treated as inactive B12 analogues (0 contribution)",
      de: "Gemessene Corrinoide als inaktive B12-Analoga gewertet (Beitrag 0)",
    });
  } else if (b12 !== null && b12 <= 0) {
    flags.push({
      en: "No bioavailable vitamin B12",
      de: "Kein bioverfügbares Vitamin B12",
    });
  }
  const missing = MICRO_NUTRIENTS.filter((nutrient) => amounts[nutrient] === null);
  if (missing.length > 0) {
    const names = listLabels(missing);
    flags.push({
      en: `Not scored, no source reports it: ${names.en}`,
      de: `Nicht bewertet, keine Quelle nennt einen Wert: ${names.de}`,
    });
  }

  return {
    score: round1(score),
    raeUg: round1(retinolActivityEquivalentsUg(food)),
    absorbableIronMg: round2(absorbableIronMg(food)),
    absorbableZincMg: round2(absorbableZincMg(food)),
    effectiveB12Ug: b12 === null ? null : round2(b12),
    nutrients,
    parts: {
      meanCappedDensity: round2(mean(contributions)),
      nutrientsScored: scored.length,
    },
    flags,
  };
}

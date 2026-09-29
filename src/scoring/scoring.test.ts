import { describe, expect, it } from "vitest";
import { FOODS, requireFood } from "../data/catalog";
import { CLASS_WEIGHTS, assertWeightsSumToOne } from "../data/classWeights";
import {
  ALA_TO_DHA_EFFICIENCY,
  BETA_CAROTENE_TO_RAE,
  FAO_2013_ADULT_MG_PER_G,
  HEME_SHARE_OF_MIXED_IRON,
  IRON_ABSORPTION,
  OTHER_CAROTENOID_TO_RAE,
} from "../data/coefficients";
import { recommend } from "../recommend/engine";
import { matrixToCsv, matrixToJson, toMatrixRows } from "../export/matrixExport";
import { activeCarbsG, passiveCarbsG, scoreCarbs } from "./carbs";
import { scoreComposite } from "./composite";
import { aminoAcidScore, diaas, pdcaas, scoreEaa } from "./eaa";
import { effectiveLongChainN3G, scoreEfa } from "./efa";
import { scoreFibre } from "./fibre";
import {
  absorbableIronMg,
  effectiveB12Ug,
  retinolActivityEquivalentsUg,
  scoreMicros,
  upperLimitExceedances,
} from "./micros";
import { scoreCatalog, scoreFood } from "./scoreFood";
import { tierFromScore } from "./tiers";
import { FOOD_CLASSES, kingdomOf } from "./types";

describe("class weights", () => {
  it("sum to 1 for every class", () => {
    expect(() => assertWeightsSumToOne()).not.toThrow();
    for (const foodClass of FOOD_CLASSES) {
      const row = CLASS_WEIGHTS[foodClass];
      const sum =
        row.eaa + row.efa + row.carb + row.micro + row.fibre + row.residue + row.degradation;
      expect(sum).toBeCloseTo(1, 9);
    }
  });
});

describe("EAA completeness + digestibility", () => {
  it("uses FAO 2013 adult pattern and does not force plant AAS to 1", () => {
    const lentils = requireFood("lentils_boiled");
    const egg = requireFood("egg_boiled");
    const lentilAas = aminoAcidScore(lentils);
    const eggAas = aminoAcidScore(egg);
    expect(lentilAas).toBeLessThan(1);
    expect(eggAas).toBeGreaterThanOrEqual(1);
    expect(scoreEaa(lentils).limitingAa).toBe("saa");
    expect(scoreEaa(lentils).flags.some((flag) => flag.en.includes("Incomplete"))).toBe(true);
  });

  it("DIAAS is AAS × digestibility and is not truncated; PDCAAS is", () => {
    const egg = requireFood("egg_boiled");
    const aas = aminoAcidScore(egg);
    expect(diaas(egg)).toBeCloseTo(aas * egg.ilealDigestibility, 5);
    expect(pdcaas(egg)).toBeCloseTo(Math.min(1, aas) * egg.ilealDigestibility, 5);
    expect(diaas(egg)).toBeGreaterThan(1);
    expect(pdcaas(egg)).toBeLessThanOrEqual(1);
  });

  it("low-protein leaves do not outrank eggs on the EAA axis", () => {
    const spinach = scoreEaa(requireFood("spinach_raw"));
    const egg = scoreEaa(requireFood("egg_boiled"));
    expect(spinach.score).toBeLessThan(egg.score);
    expect(spinach.parts.proteinDensity).toBeLessThan(0.25);
  });

  it("reports FAO reference constants used in ratios", () => {
    expect(FAO_2013_ADULT_MG_PER_G.lys).toBe(48);
    expect(FAO_2013_ADULT_MG_PER_G.saa).toBe(23);
    expect(FAO_2013_ADULT_MG_PER_G.trp).toBe(6.6);
  });
});

describe("carbohydrate type split", () => {
  it("scores active and passive carbs separately", () => {
    const lentils = requireFood("lentils_boiled");
    const card = scoreCarbs(lentils);
    expect(card.activeG).toBeCloseTo(activeCarbsG(lentils), 5);
    expect(card.passiveG).toBeCloseTo(passiveCarbsG(lentils), 5);
    expect(card.activeG).toBeGreaterThan(0);
    expect(card.passiveG).toBeGreaterThan(0);
    expect(card.activeScore).not.toBe(card.passiveScore);
  });

  it("treats muscle meat as metabolically quiet, not a fibre food", () => {
    const beef = scoreCarbs(requireFood("beef_mince_braised"));
    expect(beef.score).toBe(70);
    expect(beef.flags.some((flag) => flag.en.includes("Fibre is absent"))).toBe(true);
  });

  it("penalizes sugar-dominant profiles relative to high-fibre legumes", () => {
    const pepper = scoreCarbs(requireFood("red_bell_pepper_raw"));
    const beans = scoreCarbs(requireFood("black_beans_boiled"));
    expect(beans.passiveG).toBeGreaterThan(pepper.passiveG);
    expect(beans.score).toBeGreaterThan(pepper.score);
  });
});

describe("bioavailability adjustments", () => {
  it("applies 1/12 and 1/24 RAE factors and does not equate carrot to liver retinol", () => {
    const carrot = requireFood("carrot_raw");
    const liver = requireFood("beef_liver_fried");
    const carrotRae = retinolActivityEquivalentsUg(carrot);
    expect(carrot.micros.vitaminARetinolUg).toBe(0);
    expect(carrotRae).toBeCloseTo(
      (carrot.micros.vitaminABetaCaroteneUg ?? 0) * BETA_CAROTENE_TO_RAE +
        (carrot.micros.vitaminAOtherCarotenoidsUg ?? 0) * OTHER_CAROTENOID_TO_RAE,
      5,
    );
    expect(OTHER_CAROTENOID_TO_RAE).toBeCloseTo(1 / 24, 8);
    expect(liver.micros.vitaminARetinolUg).toBeGreaterThan(carrotRae);
    expect(scoreMicros(liver).score).toBeGreaterThan(scoreMicros(carrot).score);
  });

  it("absorbs more of each milligram of meat iron than of high-phytate non-heme iron", () => {
    const beef = requireFood("beef_mince_braised");
    const spinach = requireFood("spinach_raw");
    expect(beef.micros.ironForm).toBe("mixed");
    expect(spinach.micros.ironForm).toBe("nonheme");
    const mixed =
      HEME_SHARE_OF_MIXED_IRON * IRON_ABSORPTION.heme + (1 - HEME_SHARE_OF_MIXED_IRON) * IRON_ABSORPTION.nonhemeBase;
    expect(absorbableIronMg(beef)).toBeCloseTo(beef.micros.ironMg * mixed, 5);
    expect(absorbableIronMg(spinach)).toBeCloseTo(spinach.micros.ironMg * IRON_ABSORPTION.nonhemeHighPhytate, 5);
    expect(absorbableIronMg(beef) / beef.micros.ironMg).toBeGreaterThan(
      absorbableIronMg(spinach) / spinach.micros.ironMg,
    );
  });

  it("never treats egg or dairy iron as heme iron", () => {
    for (const id of ["egg_boiled", "milk_whole", "cheddar"]) {
      expect(requireFood(id).micros.ironForm).toBe("nonheme");
    }
  });

  it("zeroes algal B12 analogues", () => {
    const nori = requireFood("nori_roasted");
    expect(nori.micros.vitaminB12Ug).toBeGreaterThan(0);
    expect(nori.micros.b12IsAnalogue).toBe(true);
    expect(effectiveB12Ug(nori)).toBe(0);
    const egg = requireFood("egg_boiled");
    expect(effectiveB12Ug(egg)).toBe(egg.micros.vitaminB12Ug);
  });
});

describe("upper limits", () => {
  it("counts nori iodine and liver retinol as a cost, not a benefit", () => {
    expect(upperLimitExceedances(requireFood("nori_roasted"))).toContain("iodine");
    expect(upperLimitExceedances(requireFood("beef_liver_fried"))).toContain("vitaminA");
    const liver = scoreMicros(requireFood("beef_liver_fried"));
    expect(liver.flags.some((flag) => flag.en.includes("upper limit"))).toBe(true);
  });

  it("applies the vitamin A limit to preformed retinol only", () => {
    const carrot = requireFood("carrot_raw");
    expect(retinolActivityEquivalentsUg(carrot)).toBeGreaterThan(0);
    expect(upperLimitExceedances(carrot)).not.toContain("vitaminA");
  });

  it("only flags organs and algae in the current catalog", () => {
    const flagged = FOODS.filter((food) => upperLimitExceedances(food).length > 0);
    expect(flagged.length).toBeGreaterThan(0);
    for (const food of flagged) {
      expect(["organs", "algae"]).toContain(food.class);
    }
  });
});

describe("EFA / glycerides", () => {
  it("credits preformed EPA/DHA far above ALA-only plants", () => {
    const salmon = scoreEfa(requireFood("salmon_roasted"));
    const flaxLikeKale = scoreEfa(requireFood("kale_raw"));
    expect(salmon.score).toBeGreaterThan(flaxLikeKale.score);
    expect(salmon.flags.some((flag) => flag.en.includes("preformed long-chain"))).toBe(true);
  });

  it("applies ALA→DHA inefficiency", () => {
    const kale = requireFood("kale_raw");
    const effective = effectiveLongChainN3G(kale);
    expect(effective).toBeCloseTo(
      kale.fattyAcids.omega3Dha +
        kale.fattyAcids.omega3Epa +
        kale.fattyAcids.omega3Ala * ALA_TO_DHA_EFFICIENCY,
      8,
    );
  });
});

describe("fibre axis honesty", () => {
  it("gives animal foods 0 phytochemical baseline", () => {
    const beef = scoreFibre(requireFood("beef_mince_braised"));
    const kale = scoreFibre(requireFood("kale_raw"));
    expect(beef.score).toBeLessThan(15);
    expect(kale.score).toBeGreaterThan(beef.score);
  });
});

describe("composite and tiers", () => {
  it("is a weighted sum of axes", () => {
    const value = scoreComposite(
      { eaa: 100, efa: 0, carb: 0, micro: 0, fibre: 0, residue: 0, degradation: 0 },
      "eggs",
    );
    expect(value).toBeCloseTo(100 * CLASS_WEIGHTS.eggs.eaa, 5);
  });

  it("assigns S/A/B/C/D from documented cut-points", () => {
    expect(tierFromScore(80)).toBe("S");
    expect(tierFromScore(65)).toBe("A");
    expect(tierFromScore(50)).toBe("B");
    expect(tierFromScore(35)).toBe("C");
    expect(tierFromScore(34.9)).toBe("D");
  });

  it("ranks within class and never equates plant and animal protein quality", () => {
    const cards = scoreCatalog(FOODS);
    const egg = cards.find((card) => card.foodId === "egg_boiled");
    const lentil = cards.find((card) => card.foodId === "lentils_boiled");
    expect(egg).toBeDefined();
    expect(lentil).toBeDefined();
    if (!egg || !lentil) return;
    expect(egg.eaa.diaas).toBeGreaterThan(lentil.eaa.diaas);
    expect(egg.classRank).toBeGreaterThanOrEqual(1);
    expect(lentil.classSize).toBeGreaterThanOrEqual(2);
  });
});

describe("catalog coverage", () => {
  it("covers every required plant and animal class with at least one food", () => {
    const present = new Set(FOODS.map((food) => food.class));
    for (const foodClass of FOOD_CLASSES) {
      expect(present.has(foodClass)).toBe(true);
    }
  });

  it("keeps plant and animal kingdoms strictly separated", () => {
    for (const food of FOODS) {
      if (food.class === "leafy_salad" || food.class === "legumes") {
        expect(kingdomOf(food.class)).toBe("plant");
        expect(food.animalCompounds.creatineMg).toBe(0);
      }
      if (food.class.startsWith("muscle")) {
        expect(kingdomOf(food.class)).toBe("animal");
        expect(food.carbs.fibre).toBe(0);
      }
    }
  });
});

describe("recommendation engine", () => {
  it("never claims a plant-only diet is complete", () => {
    const rec = recommend({ pattern: "plant-only", selectedIds: ["lentils_boiled", "kale_raw"] });
    expect(rec.headline.en.toLowerCase()).toContain("not biochemically complete");
    expect(rec.headline.de).toContain("biochemisch nicht vollständig");
    const ids = rec.gaps.map((gap) => gap.id);
    expect(ids).toEqual(expect.arrayContaining(["b12", "complete-protein", "epa-dha", "heme-iron", "retinol"]));
    expect(rec.gaps.some((gap) => gap.severity === "required" && gap.id === "b12")).toBe(true);
  });

  it("hybrid without animal food flags the collapse to plant-only", () => {
    const rec = recommend({ pattern: "hybrid", selectedIds: ["kale_raw"] });
    expect(rec.gaps.some((gap) => gap.id === "hybrid-no-animal")).toBe(true);
  });
});

describe("export", () => {
  it("emits CSV and JSON with version stamps", () => {
    const cards = scoreCatalog(FOODS);
    const csv = matrixToCsv(cards);
    const json = matrixToJson(cards);
    expect(csv.split("\n")[0]).toContain("composite");
    expect(csv).toContain("spinach_raw");
    expect(json).toContain("datasetVersion");
    expect(toMatrixRows(cards).length).toBe(FOODS.length);
  });
});

describe("scoreFood determinism", () => {
  it("returns the same composite for the same food", () => {
    const food = requireFood("salmon_roasted");
    expect(scoreFood(food).composite).toBe(scoreFood(food).composite);
  });
});

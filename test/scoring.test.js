import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  FAO_2013_DIAAS_REF_MG_PER_G,
  ALA_TO_EPA_DHA_CONVERSION,
  CLASS_IDS,
  CLASS_WEIGHTS,
  scoreFood,
  scoreDataset,
  assignTiers,
  recommend,
  axisKeys,
} from "../lib/scoring/index.js";

function animalCompleteProtein(overrides = {}) {
  return {
    id: "test-beef",
    name: "Test ruminant muscle",
    classId: "muscle_ruminant",
    kingdom: "animal",
    fermented: false,
    serving: { grams: 100, kcal: 170 },
    protein: {
      grams: 26,
      eaaMgPerGProtein: {
        his: 34,
        ile: 45,
        leu: 81,
        lys: 84,
        met: 26,
        cys: 13,
        phe: 40,
        tyr: 34,
        thr: 44,
        trp: 11,
        val: 50,
      },
      ilealDigestibility: 0.95,
      fecalDigestibility: 0.94,
      qualitySource: "estimated_from_eaa",
    },
    lipids: {
      totalG: 8,
      sfaG: 3.2,
      mufaG: 3.4,
      pufaG: 0.4,
      omega3G: 0.08,
      omega6G: 0.25,
      alaG: 0.02,
      epaG: 0.02,
      dhaG: 0.01,
      oddChainG: 0.12,
      claG: 0.04,
    },
    carbs: {
      totalG: 0,
      sugarsG: 0,
      starchG: 0,
      fiberG: 0,
      resistantStarchG: 0,
    },
    micros: {
      ironMg: 2.6,
      hemeIronMg: 1.6,
      nonhemeIronMg: 1.0,
      zincMg: 6.3,
      vitaminARaeUg: 0,
      retinolUg: 0,
      carotenoidsUg: 0,
      b12Ug: 2.1,
      folateUg: 8,
      vitaminCMg: 0,
      vitaminDUg: 0.1,
      vitaminEMg: 0.3,
      vitaminKUg: 1,
      calciumMg: 12,
      seleniumUg: 22,
      iodineUg: 8,
      magnesiumMg: 22,
      potassiumMg: 330,
      cholineMg: 80,
      creatineG: 0.45,
      taurineMg: 40,
      carnosineMg: 350,
    },
    phytochemicals: { polyphenolsMg: 0, glucosinolatesMg: 0, uniquePigmentsMg: 0 },
    antinutrients: { phytateMg: 0, oxalateMg: 0, lectinFlag: false, goitrogenFlag: false },
    residues: { pesticideRisk: 0.12, heavyMetalRisk: 0.15, persistentOrganicRisk: 0.18 },
    degradation: {
      waterSolubleVitaminLoad: 0.15,
      cutSurfaceIndex: 0.2,
      heatLability: 0.25,
      pufaOxidationRisk: 0.2,
    },
    flags: { estimatedFields: [] },
    ...overrides,
  };
}

function incompleteLegume(overrides = {}) {
  return {
    id: "test-lentil",
    name: "Test boiled lentil",
    classId: "legumes",
    kingdom: "plant",
    fermented: false,
    serving: { grams: 100, kcal: 116 },
    protein: {
      grams: 9,
      eaaMgPerGProtein: {
        his: 28,
        ile: 43,
        leu: 72,
        lys: 70,
        met: 8,
        cys: 10,
        phe: 49,
        tyr: 26,
        thr: 36,
        trp: 9,
        val: 50,
      },
      ilealDigestibility: 0.78,
      fecalDigestibility: 0.80,
      qualitySource: "estimated_from_eaa",
    },
    lipids: {
      totalG: 0.4,
      sfaG: 0.05,
      mufaG: 0.06,
      pufaG: 0.18,
      omega3G: 0.04,
      omega6G: 0.14,
      alaG: 0.04,
      epaG: 0,
      dhaG: 0,
      oddChainG: 0,
      claG: 0,
    },
    carbs: {
      totalG: 20,
      sugarsG: 1.8,
      starchG: 11,
      fiberG: 7.9,
      resistantStarchG: 2.5,
    },
    micros: {
      ironMg: 3.3,
      hemeIronMg: 0,
      nonhemeIronMg: 3.3,
      zincMg: 1.3,
      vitaminARaeUg: 2,
      retinolUg: 0,
      carotenoidsUg: 20,
      b12Ug: 0,
      folateUg: 181,
      vitaminCMg: 1.5,
      vitaminDUg: 0,
      vitaminEMg: 0.11,
      vitaminKUg: 1.7,
      calciumMg: 19,
      seleniumUg: 2.8,
      iodineUg: 1,
      magnesiumMg: 36,
      potassiumMg: 369,
      cholineMg: 32,
      creatineG: 0,
      taurineMg: 0,
      carnosineMg: 0,
    },
    phytochemicals: { polyphenolsMg: 50, glucosinolatesMg: 0, uniquePigmentsMg: 0 },
    antinutrients: { phytateMg: 280, oxalateMg: 8, lectinFlag: true, goitrogenFlag: false },
    residues: { pesticideRisk: 0.22, heavyMetalRisk: 0.08, persistentOrganicRisk: 0.05 },
    degradation: {
      waterSolubleVitaminLoad: 0.35,
      cutSurfaceIndex: 0.1,
      heatLability: 0.4,
      pufaOxidationRisk: 0.15,
    },
    flags: { estimatedFields: ["protein.eaaMgPerGProtein"] },
    ...overrides,
  };
}

describe("FAO 2013 DIAAS reference pattern", () => {
  test("exposes the FAO 2013 scoring pattern in mg per g protein", () => {
    assert.equal(FAO_2013_DIAAS_REF_MG_PER_G.his, 16);
    assert.equal(FAO_2013_DIAAS_REF_MG_PER_G.ile, 30);
    assert.equal(FAO_2013_DIAAS_REF_MG_PER_G.leu, 61);
    assert.equal(FAO_2013_DIAAS_REF_MG_PER_G.lys, 48);
    assert.equal(FAO_2013_DIAAS_REF_MG_PER_G.saa, 23);
    assert.equal(FAO_2013_DIAAS_REF_MG_PER_G.aaa, 41);
    assert.equal(FAO_2013_DIAAS_REF_MG_PER_G.thr, 25);
    assert.equal(FAO_2013_DIAAS_REF_MG_PER_G.trp, 6.6);
    assert.equal(FAO_2013_DIAAS_REF_MG_PER_G.val, 40);
  });
});

describe("EAA completeness and digestibility", () => {
  test("marks ruminant muscle as complete animal protein with DIAAS above 100", () => {
    const scored = scoreFood(animalCompleteProtein());
    assert.equal(scored.protein.kind, "complete_animal");
    assert.equal(scored.protein.complete, true);
    assert.ok(scored.protein.diaas >= 100);
    assert.ok(scored.axes.eaa >= 80);
  });

  test("marks lentil as incomplete plant protein limited by SAA and never equivalent to animal", () => {
    const plant = scoreFood(incompleteLegume());
    const animal = scoreFood(animalCompleteProtein());
    assert.equal(plant.protein.kind, "incomplete_plant");
    assert.equal(plant.protein.complete, false);
    assert.equal(plant.protein.limitingAA, "saa");
    assert.ok(plant.protein.diaas < 100);
    assert.ok(plant.protein.diaas < animal.protein.diaas);
    assert.ok(plant.axes.eaa < animal.axes.eaa);
    assert.notEqual(plant.protein.kind, animal.protein.kind);
  });

  test("does not claim plant and animal proteins are equivalent even if scores are close", () => {
    const plant = scoreFood(incompleteLegume());
    const animal = scoreFood(animalCompleteProtein());
    assert.equal(plant.claims.proteinEquivalentToAnimal, false);
    assert.equal(animal.claims.proteinEquivalentToAnimal, false);
    assert.match(plant.claims.proteinNote, /incomplete/i);
  });

  test("PDCAAS is capped at 1.0 while DIAAS is not", () => {
    const animal = scoreFood(animalCompleteProtein());
    assert.ok(animal.protein.pdcaas <= 1);
    assert.ok(animal.protein.diaas > 100);
  });
});

describe("essential fatty acid and glyceride profile", () => {
  test("applies a low ALA conversion factor and does not treat ALA as EPA/DHA", () => {
    assert.ok(ALA_TO_EPA_DHA_CONVERSION <= 0.1);
    const alaOnly = scoreFood(
      incompleteLegume({
        lipids: {
          totalG: 2,
          sfaG: 0.2,
          mufaG: 0.3,
          pufaG: 1.5,
          omega3G: 1.4,
          omega6G: 0.1,
          alaG: 1.4,
          epaG: 0,
          dhaG: 0,
          oddChainG: 0,
          claG: 0,
        },
      }),
    );
    const epaDha = scoreFood(
      animalCompleteProtein({
        classId: "muscle_fish",
        lipids: {
          totalG: 12,
          sfaG: 2,
          mufaG: 4,
          pufaG: 5,
          omega3G: 2.2,
          omega6G: 0.4,
          alaG: 0.1,
          epaG: 0.9,
          dhaG: 1.1,
          oddChainG: 0,
          claG: 0,
        },
      }),
    );
    assert.ok(alaOnly.lipids.effectiveLongChainN3G < 0.2);
    assert.ok(epaDha.lipids.effectiveLongChainN3G > 1.8);
    assert.ok(epaDha.axes.efa > alaOnly.axes.efa);
  });

  test("credits ruminant odd-chain and conjugated fatty acids", () => {
    const withCla = scoreFood(animalCompleteProtein());
    const withoutCla = scoreFood(
      animalCompleteProtein({
        lipids: {
          totalG: 8,
          sfaG: 3.2,
          mufaG: 3.4,
          pufaG: 0.4,
          omega3G: 0.08,
          omega6G: 0.25,
          alaG: 0.02,
          epaG: 0.02,
          dhaG: 0.01,
          oddChainG: 0,
          claG: 0,
        },
      }),
    );
    assert.ok(withCla.axes.efa > withoutCla.axes.efa);
  });
});

describe("carbohydrate type score", () => {
  test("scores fibre and resistant starch separately from sugars and starch", () => {
    const scored = scoreFood(incompleteLegume());
    assert.ok(scored.carbs.activeG > 0);
    assert.ok(scored.carbs.passiveG > 0);
    assert.ok(scored.carbs.passiveG > scored.carbs.fiberG * 0.9);
    assert.ok(scored.axes.carbs > 40);
  });

  test("does not punish near-zero carbohydrate animal foods as empty carbs", () => {
    const meat = scoreFood(animalCompleteProtein());
    assert.equal(scoredNear(meat.carbs.activeG, 0), true);
    assert.ok(meat.axes.carbs >= 55);
  });
});

function scoredNear(value, target) {
  return Math.abs(value - target) < 1e-6;
}

describe("micronutrient density and bioavailability", () => {
  test("down-weights non-heme iron relative to heme iron", () => {
    const plant = scoreFood(incompleteLegume());
    const animal = scoreFood(animalCompleteProtein());
    assert.ok(plant.micros.bioavailableIronMg < plant.micros.ironMg * 0.5);
    assert.ok(animal.micros.bioavailableIronMg > animal.micros.hemeIronMg * 0.2);
    assert.ok(animal.micros.ironAbsorptionCoeff > plant.micros.ironAbsorptionCoeff);
  });

  test("applies a phytate penalty to zinc bioavailability", () => {
    const withPhytate = scoreFood(incompleteLegume());
    const noPhytate = scoreFood(
      incompleteLegume({
        antinutrients: { phytateMg: 0, oxalateMg: 0, lectinFlag: false, goitrogenFlag: false },
      }),
    );
    assert.ok(withPhytate.micros.zincAbsorptionCoeff < noPhytate.micros.zincAbsorptionCoeff);
  });

  test("treats carotenoid-derived vitamin A as lower bioavailability than retinol", () => {
    const carrotLike = scoreFood(
      incompleteLegume({
        classId: "roots_tubers",
        micros: {
          ...incompleteLegume().micros,
          vitaminARaeUg: 800,
          retinolUg: 0,
          carotenoidsUg: 8000,
          ironMg: 0.3,
          hemeIronMg: 0,
          nonhemeIronMg: 0.3,
          zincMg: 0.2,
          b12Ug: 0,
        },
        antinutrients: { phytateMg: 0, oxalateMg: 0, lectinFlag: false, goitrogenFlag: false },
      }),
    );
    const liverLike = scoreFood(
      animalCompleteProtein({
        classId: "organs",
        micros: {
          ...animalCompleteProtein().micros,
          vitaminARaeUg: 800,
          retinolUg: 800,
          carotenoidsUg: 0,
        },
      }),
    );
    assert.ok(liverLike.micros.effectiveVitaminARaeUg > carrotLike.micros.effectiveVitaminARaeUg);
  });
});

describe("fibre, phytochemicals, residues, degradation", () => {
  test("gives plants the fibre and phytochemical advantage", () => {
    const plant = scoreFood(incompleteLegume());
    const animal = scoreFood(animalCompleteProtein());
    assert.ok(plant.axes.fibrePhyto > animal.axes.fibrePhyto);
    assert.ok(animal.axes.fibrePhyto < 25);
  });

  test("returns a higher residue score for lower contaminant risk", () => {
    const clean = scoreFood(animalCompleteProtein());
    const dirty = scoreFood(
      animalCompleteProtein({
        residues: { pesticideRisk: 0.8, heavyMetalRisk: 0.7, persistentOrganicRisk: 0.6 },
      }),
    );
    assert.ok(clean.axes.residue > dirty.axes.residue);
  });

  test("scores cut leafy tissue as more degradation-sensitive than intact muscle", () => {
    const salad = scoreFood(
      incompleteLegume({
        classId: "leafy_salad",
        degradation: {
          waterSolubleVitaminLoad: 0.85,
          cutSurfaceIndex: 0.9,
          heatLability: 0.7,
          pufaOxidationRisk: 0.2,
        },
      }),
    );
    const meat = scoreFood(animalCompleteProtein());
    assert.ok(salad.axes.degradation < meat.axes.degradation);
  });
});

describe("class identity and weights", () => {
  test("keeps plant and animal biochemical classes distinct", () => {
    const expected = [
      "leafy_salad",
      "legumes",
      "sprouts",
      "cruciferous_kraut",
      "mushrooms",
      "algae",
      "roots_tubers",
      "other_vegetables",
      "muscle_ruminant",
      "muscle_monogastric",
      "muscle_poultry",
      "muscle_fish",
      "organs",
      "eggs",
      "dairy",
      "fermented_animal",
    ];
    assert.deepEqual([...CLASS_IDS].sort(), [...expected].sort());
    for (const id of expected) {
      assert.ok(CLASS_WEIGHTS[id], `missing weights for ${id}`);
      const sum = Object.values(CLASS_WEIGHTS[id]).reduce((a, b) => a + b, 0);
      assert.ok(Math.abs(sum - 1) < 1e-6, `${id} weights must sum to 1`);
    }
  });

  test("does not collapse mushrooms, algae, sprouts, or kraut into generic plants", () => {
    const mushroom = scoreFood(incompleteLegume({ classId: "mushrooms", kingdom: "fungi" }));
    const algae = scoreFood(incompleteLegume({ classId: "algae", kingdom: "algae" }));
    const sprouts = scoreFood(incompleteLegume({ classId: "sprouts" }));
    const kraut = scoreFood(incompleteLegume({ classId: "cruciferous_kraut", fermented: true }));
    assert.equal(mushroom.classId, "mushrooms");
    assert.equal(algae.classId, "algae");
    assert.equal(sprouts.classId, "sprouts");
    assert.equal(kraut.classId, "cruciferous_kraut");
    assert.notEqual(CLASS_WEIGHTS.mushrooms.fibrePhyto, CLASS_WEIGHTS.algae.efa);
    assert.ok(CLASS_WEIGHTS.algae.efa > CLASS_WEIGHTS.leafy_salad.efa);
    assert.ok(CLASS_WEIGHTS.organs.micros > CLASS_WEIGHTS.leafy_salad.eaa);
  });

  test("uses class-specific weights so organ composite is micros-led and salad is not protein-led", () => {
    assert.ok(CLASS_WEIGHTS.organs.micros > CLASS_WEIGHTS.organs.eaa);
    assert.ok(CLASS_WEIGHTS.leafy_salad.fibrePhyto > CLASS_WEIGHTS.leafy_salad.eaa);
    assert.ok(CLASS_WEIGHTS.muscle_ruminant.eaa > CLASS_WEIGHTS.muscle_ruminant.fibrePhyto);
    assert.ok(CLASS_WEIGHTS.legumes.eaa > CLASS_WEIGHTS.leafy_salad.eaa);
  });
});

describe("composite, tiers, and recommendation limits", () => {
  test("emits every required axis and a composite", () => {
    const scored = scoreFood(animalCompleteProtein());
    for (const key of axisKeys()) {
      assert.equal(typeof scored.axes[key], "number");
      assert.ok(scored.axes[key] >= 0 && scored.axes[key] <= 100);
    }
    assert.ok(scored.composite >= 0 && scored.composite <= 100);
  });

  test("assigns S/A/B/C/D tiers within a class, not across the whole matrix", () => {
    const legumes = [
      incompleteLegume({ id: "a", serving: { grams: 100, kcal: 116 } }),
      incompleteLegume({
        id: "b",
        phytochemicals: { polyphenolsMg: 5, glucosinolatesMg: 0, uniquePigmentsMg: 0 },
        carbs: { totalG: 20, sugarsG: 8, starchG: 10, fiberG: 2, resistantStarchG: 0 },
      }),
      incompleteLegume({
        id: "c",
        residues: { pesticideRisk: 0.9, heavyMetalRisk: 0.4, persistentOrganicRisk: 0.3 },
      }),
    ];
    const meats = [
      animalCompleteProtein({ id: "m1" }),
      animalCompleteProtein({
        id: "m2",
        residues: { pesticideRisk: 0.7, heavyMetalRisk: 0.6, persistentOrganicRisk: 0.5 },
      }),
    ];
    const scored = scoreDataset([...legumes, ...meats]);
    const ranked = assignTiers(scored);
    const legumeTiers = ranked.filter((f) => f.classId === "legumes").map((f) => f.tier);
    const meatTiers = ranked.filter((f) => f.classId === "muscle_ruminant").map((f) => f.tier);
    for (const tier of [...legumeTiers, ...meatTiers]) {
      assert.match(tier, /^[SABCD]$/);
    }
    assert.ok(legumeTiers.includes("S") || legumeTiers.includes("A"));
    assert.ok(meatTiers.includes("S") || meatTiers.includes("A"));
  });

  test("does not force a high-absolute food to D just because its class has two members", () => {
    const scored = scoreDataset([
      animalCompleteProtein({ id: "m1", classId: "muscle_fish" }),
      animalCompleteProtein({
        id: "m2",
        classId: "muscle_fish",
        residues: { pesticideRisk: 0.3, heavyMetalRisk: 0.28, persistentOrganicRisk: 0.25 },
      }),
    ]);
    const ranked = assignTiers(scored);
    assert.ok(ranked.every((food) => food.composite >= 50));
    assert.ok(ranked.every((food) => food.tier !== "D"));
  });

  test("plant-only recommendations require fortification or supplementation notes", () => {
    const scored = scoreDataset([
      incompleteLegume(),
      incompleteLegume({ id: "spinach", classId: "leafy_salad", name: "Spinach" }),
    ]);
    const rec = recommend(scored, "plant_only");
    assert.equal(rec.patternCompleteWithoutFortification, false);
    assert.ok(rec.requiredNotes.some((n) => /b12/i.test(n)));
    assert.ok(rec.requiredNotes.some((n) => /epa|dha/i.test(n)));
    assert.ok(rec.requiredNotes.some((n) => /creatine|taurine|carnosine/i.test(n)));
  });

  test("animal-inclusive recommendations still keep plant fibre as a distinct advantage", () => {
    const scored = scoreDataset([
      animalCompleteProtein(),
      incompleteLegume({ id: "kale", classId: "leafy_salad", name: "Kale" }),
    ]);
    const rec = recommend(scored, "animal_inclusive");
    assert.equal(rec.patternCompleteWithoutFortification, true);
    assert.ok(rec.picks.some((p) => p.kingdom === "plant" || p.classId === "leafy_salad"));
  });
});

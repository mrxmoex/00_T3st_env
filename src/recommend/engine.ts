import { ANIMAL_CLASSES, PLANT_CLASSES, classLabel } from "../data/labels";
import type { DietaryPattern, Food, FoodClass, FoodScores } from "../data/types";
import { assertNever } from "../lib/exhaustive";

export interface Gap {
  id: string;
  severity: "required" | "typical" | "context";
  title: string;
  detail: string;
}

export interface RecommendedItem {
  foodId: string;
  reason: string;
}

export interface RecommendationReport {
  pattern: DietaryPattern;
  headline: string;
  gaps: Gap[];
  picks: RecommendedItem[];
  pairings: { lead: string; complement: string; note: string }[];
  refusals: string[];
}

function topInClass(
  foods: Food[],
  scores: Map<string, FoodScores>,
  foodClass: FoodClass,
  axis: "composite" | "eaa" | "fibre" | "micro" | "fat" = "composite",
): Food | undefined {
  const members = foods.filter((food) => food.foodClass === foodClass);
  return [...members].sort((a, b) => {
    const sa = scores.get(a.id);
    const sb = scores.get(b.id);
    if (!sa || !sb) return 0;
    const av = axis === "composite" ? sa.composite : sa[axis].score;
    const bv = axis === "composite" ? sb.composite : sb[axis].score;
    return bv - av;
  })[0];
}

function plantOnlyGaps(): Gap[] {
  return [
    {
      id: "b12",
      severity: "required",
      title: "Vitamin B12 must be supplemented or fortified",
      detail:
        "Unfortified plants, including algae and mushrooms, do not supply reliable bioactive cobalamin. Algal analogs are scored 0. A plant-only pattern is not complete without B12.",
    },
    {
      id: "epa-dha",
      severity: "typical",
      title: "Long-chain EPA/DHA are typically absent",
      detail:
        "ALA conversion is inefficient (coefficient 0.08). Some algae contain EPA; spirulina does not replace fish or algal oil. Typical plant-only diets need a dedicated LC n-3 source.",
    },
    {
      id: "creatine",
      severity: "typical",
      title: "Creatine, taurine, and carnosine are animal-exclusive",
      detail:
        "They are not synthesised in useful dietary amounts from plants. Endogenous synthesis exists but is not dietary equivalence.",
    },
    {
      id: "protein-quality",
      severity: "typical",
      title: "Plant proteins remain incomplete as single foods",
      detail:
        "Complementary pairing raises the meal amino-acid ratio. It does not turn lentils into milk. DIAAS/PDCAAS stay lower than egg, dairy, and muscle.",
    },
    {
      id: "iron-zinc-a",
      severity: "typical",
      title: "Non-heme iron, phytate-zinc, carotenoid vitamin A",
      detail:
        "Amounts can look adequate on paper. Bioavailability coefficients cut them. Preformed retinol and heme iron are not present.",
    },
  ];
}

function animalInclusiveGaps(): Gap[] {
  return [
    {
      id: "fibre",
      severity: "context",
      title: "Fibre and phytochemicals are the plant advantage",
      detail:
        "Muscle, eggs, and dairy score near zero on that axis. That is expected. If the pattern is animal-only, the gap is real.",
    },
    {
      id: "fish-mercury",
      severity: "context",
      title: "Predatory fish carry methylmercury risk",
      detail:
        "Small pelagics (sardines) stay low. Large fatty fish are scored with an aquatic mercury overlay — not a reason to ignore EPA/DHA, a reason to choose species.",
    },
  ];
}

export function recommend(input: {
  pattern: DietaryPattern;
  foods: Food[];
  scores: FoodScores[];
}): RecommendationReport {
  const { pattern, foods, scores } = input;
  const scoreMap = new Map(scores.map((row) => [row.foodId, row]));
  const refusals = [
    "No forced equivalence between incomplete plant proteins and complete animal proteins.",
    "No claim that a pure plant diet is complete without fortification/supplementation.",
    "No black-box AI nutrition score — picks are highest within-class axis values.",
  ];

  switch (pattern) {
    case "plant-only": {
      const picks: RecommendedItem[] = [];
      for (const foodClass of PLANT_CLASSES) {
        const best = topInClass(foods, scoreMap, foodClass);
        if (!best) continue;
        picks.push({
          foodId: best.id,
          reason: `Highest composite inside ${classLabel(foodClass)} — not a stand-in for other plant classes.`,
        });
      }
      const tofu = foods.find((food) => food.id === "tofu-firm");
      const lentils = foods.find((food) => food.id === "lentils-boiled");
      return {
        pattern,
        headline:
          "Best-in-class plants only. Completeness requires B12 (and typically LC n-3 and creatine). Pairing ≠ equivalence.",
        gaps: plantOnlyGaps(),
        picks,
        pairings:
          tofu && lentils
            ? [
                {
                  lead: tofu.id,
                  complement: lentils.id,
                  note: "Soy + pulse pairing improves the meal amino-acid ratio. Both remain below egg/dairy DIAAS. Phytate still binds iron and zinc.",
                },
              ]
            : [],
        refusals,
      };
    }
    case "animal-inclusive": {
      const picks: RecommendedItem[] = [];
      for (const foodClass of ANIMAL_CLASSES) {
        const best = topInClass(foods, scoreMap, foodClass);
        if (!best) continue;
        picks.push({
          foodId: best.id,
          reason: `Highest composite inside ${classLabel(foodClass)}.`,
        });
      }
      const kale = topInClass(foods, scoreMap, "leafy_salad", "fibre");
      if (kale) {
        picks.push({
          foodId: kale.id,
          reason:
            "Fibre/phytochemical complement — not a protein substitute for the animal rows above.",
        });
      }
      return {
        pattern,
        headline:
          "Complete proteins and bioavailable micros first. Add plant classes for fibre/phytochemicals, not as replacements.",
        gaps: animalInclusiveGaps(),
        picks,
        pairings: [],
        refusals,
      };
    }
    case "hybrid": {
      const egg = topInClass(foods, scoreMap, "eggs", "eaa");
      const liver = topInClass(foods, scoreMap, "organs", "micro");
      const fish = topInClass(foods, scoreMap, "muscle_fish", "fat");
      const ruminant = topInClass(foods, scoreMap, "muscle_ruminant", "eaa");
      const leafy = topInClass(foods, scoreMap, "leafy_salad", "fibre");
      const kraut = topInClass(foods, scoreMap, "cruciferous_kraut", "fibre");
      const legume = topInClass(foods, scoreMap, "legumes", "fibre");
      const picks: RecommendedItem[] = [];
      const add = (food: Food | undefined, reason: string) => {
        if (food) picks.push({ foodId: food.id, reason });
      };
      add(egg, "Reference complete protein (DIAAS > 1.0).");
      add(ruminant, "Complete muscle protein, heme iron, zinc, creatine/carnosine.");
      add(liver, "Retinol, bioactive B12, heme iron — dose is small; UL is real.");
      add(fish, "Preformed EPA/DHA. Species choice matters for mercury.");
      add(leafy, "Fibre + carotenoids + vitamin C. Non-heme iron stays non-heme.");
      add(kraut, "Glucosinolates; fermented kraut is not fresh cabbage.");
      add(legume, "Passive carbohydrate and fibre. Protein remains incomplete.");
      return {
        pattern,
        headline:
          "Pair high-DIAAS animal foods with high-fibre plant classes. Pairing fills roles. It does not make the foods the same.",
        gaps: [...plantOnlyGaps().filter((gap) => gap.id !== "b12"), ...animalInclusiveGaps()],
        picks,
        pairings: [
          egg && leafy
            ? {
                lead: egg.id,
                complement: leafy.id,
                note: "Complete protein + fibre/carotenoids. The leaf does not complete an already complete egg; it supplies what egg lacks.",
              }
            : undefined,
          ruminant && legume
            ? {
                lead: ruminant.id,
                complement: legume.id,
                note: "Heme iron + pulse fibre. Do not average their EAA scores.",
              }
            : undefined,
        ].filter((row): row is { lead: string; complement: string; note: string } => Boolean(row)),
        refusals,
      };
    }
    default: {
      const _exhaustive: never = pattern;
      return assertNever(_exhaustive, "pattern");
    }
  }
}

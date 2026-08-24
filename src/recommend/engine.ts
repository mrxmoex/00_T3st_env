import { FOODS } from "../data/catalog";
import { scoreCatalog } from "../scoring/scoreFood";
import type { DietaryPattern, FoodRecord, ScoreCard } from "../scoring/types";
import { kingdomOf } from "../scoring/types";

export interface Gap {
  id: string;
  severity: "required" | "material" | "contextual";
  title: string;
  detail: string;
}

export interface Recommendation {
  pattern: DietaryPattern;
  headline: string;
  gaps: Gap[];
  practices: string[];
  suggestedFoodIds: string[];
}

export interface RecommendationInput {
  pattern: DietaryPattern;
  selectedIds: string[];
}

function selectedFoods(ids: string[]): FoodRecord[] {
  const set = new Set(ids);
  return FOODS.filter((food) => set.has(food.id));
}

function hasAnimal(foods: readonly FoodRecord[]): boolean {
  return foods.some((food) => kingdomOf(food.class) === "animal");
}

function hasClass(foods: readonly FoodRecord[], prefix: string): boolean {
  return foods.some((food) => food.class.startsWith(prefix) || food.class === prefix);
}

export function recommend(input: RecommendationInput): Recommendation {
  const foods = selectedFoods(input.selectedIds);
  switch (input.pattern) {
    case "plant-only":
      return plantOnly(foods);
    case "animal-inclusive":
      return animalInclusive(foods);
    case "hybrid":
      return hybrid(foods);
    default: {
      const _exhaustive: never = input.pattern;
      return _exhaustive;
    }
  }
}

function plantOnly(foods: readonly FoodRecord[]): Recommendation {
  const gaps: Gap[] = [
    {
      id: "b12",
      severity: "required",
      title: "Vitamin B12",
      detail:
        "No plant food in this matrix supplies bioavailable B12. Algal corrinoids are scored as inactive analogues. A plant-only pattern requires fortified food or cyanocobalamin/methylcobalamin supplementation. This is not optional.",
    },
    {
      id: "complete-protein",
      severity: "required",
      title: "Complete, digestible protein",
      detail:
        "Plant proteins are incomplete and have lower DIAAS/PDCAAS than animal proteins. Complementary pairing (legume + cereal) can raise the meal AAS; it does not make a lentil a steak. Isolated protein or a deliberately mixed plate is required if this is the sole pattern.",
    },
    {
      id: "epa-dha",
      severity: "required",
      title: "Long-chain EPA/DHA",
      detail:
        "ALA conversion is inefficient (documented 8% → EPA, 1% → DHA). Preformed EPA/DHA on a plant-only pattern come from microalgae oil, not from flax, walnut, or leafy ALA. Do not treat ALA foods as marine-fat equivalents.",
    },
    {
      id: "heme-iron",
      severity: "material",
      title: "Heme iron",
      detail:
        "Non-heme iron plus phytate is not heme iron. Vitamin C helps; it does not erase the gap. Ferritin monitoring is the honest control, not a recipe claim.",
    },
    {
      id: "retinol",
      severity: "material",
      title: "Preformed retinol",
      detail:
        "Carotenoid-derived vitamin A uses 1/12 (β-carotene) and 1/24 (other) food RAE factors. Conversion varies with genetics, fat, and thyroid status. Orange vegetables are not liver.",
    },
    {
      id: "animal-exclusives",
      severity: "material",
      title: "Creatine, taurine, carnosine",
      detail:
        "These are animal-tissue compounds. A plant-only pattern does not contain them unless they are supplemented. Absence is compositional, not a moral failure.",
    },
    {
      id: "zinc",
      severity: "material",
      title: "Phytate-bound zinc",
      detail:
        "Legume and grain zinc is poorly absorbed relative to animal zinc. Soaking, fermenting, and sprouting reduce phytate; they do not equal meat zinc.",
    },
  ];

  if (foods.some((food) => food.class === "algae")) {
    gaps.push({
      id: "iodine-excess",
      severity: "contextual",
      title: "Iodine swing from algae",
      detail:
        "Seaweed can cover iodine or overshoot it by an order of magnitude. It does not cover B12.",
    });
  }

  return {
    pattern: "plant-only",
    headline:
      "A plant-only pattern is not biochemically complete without fortification or supplementation. The matrix will not pretend otherwise.",
    gaps,
    practices: [
      "Supplement B12. Algae sheets do not count.",
      "If EPA/DHA is desired, use algal oil — not ALA hope.",
      "Pair legumes with a complementary cereal if protein completeness is a goal; still expect lower DIAAS than eggs or dairy.",
      "Ferment, soak, or sprout legumes to lower phytate; re-check iron and zinc status rather than assuming adequacy.",
      "Do not collapse leafy salads, legumes, sprouts, kraut, mushrooms, and algae into one 'plant' score.",
    ],
    suggestedFoodIds: [
      "lentils_boiled",
      "sauerkraut",
      "kale_raw",
      "nori_dried",
      "broccoli_sprouts",
    ],
  };
}

function animalInclusive(foods: readonly FoodRecord[]): Recommendation {
  const gaps: Gap[] = [];
  if (!hasAnimal(foods) && foods.length > 0) {
    gaps.push({
      id: "no-animal-selected",
      severity: "contextual",
      title: "No animal food selected",
      detail:
        "The filter is animal-inclusive but the current plate is not. Animal-inclusive advantages do not apply until an animal food is present.",
    });
  }
  gaps.push({
    id: "fibre",
    severity: "material",
    title: "Fibre and phytochemicals",
    detail:
      "Muscle, organs, eggs, and dairy score 0 on fibre/phytochemicals. That is compositionally true. An animal-only plate is not a plant plate and does not inherit plant axes.",
  });
  gaps.push({
    id: "vitamin-c",
    severity: "contextual",
    title: "Vitamin C",
    detail:
      "Most muscle meats have none. Organs and a few animal foods have little. If the plate is animal-only, C is a real gap unless organs or another source is included.",
  });
  if (hasClass(foods, "organs")) {
    gaps.push({
      id: "retinol-ul",
      severity: "contextual",
      title: "Preformed retinol upper limit",
      detail:
        "Liver is efficient, not harmless at unlimited frequency. Efficiency and toxicity can coexist.",
    });
  }

  return {
    pattern: "animal-inclusive",
    headline:
      "Animal foods close B12, complete protein, heme iron, retinol, and EPA/DHA gaps that plants cannot. They do not supply fibre.",
    gaps,
    practices: [
      "Prefer ruminant or fish when heme iron, zinc, or long-chain n-3 is the axis of interest.",
      "Organs are a different class from muscle — do not hide liver inside a 'meat' average.",
      "Eggs remain a protein-quality reference; they are not a fibre food.",
      "If the plate is only muscle, add a plant class for fibre/phytochemicals or accept that axis as empty.",
    ],
    suggestedFoodIds: [
      "egg_whole_cooked",
      "beef_liver_cooked",
      "salmon_atlantic_cooked",
      "beef_ground_85_cooked",
      "kefir_whole",
    ],
  };
}

function hybrid(foods: readonly FoodRecord[]): Recommendation {
  const plant = foods.filter((food) => kingdomOf(food.class) === "plant");
  const animal = foods.filter((food) => kingdomOf(food.class) === "animal");
  const gaps: Gap[] = [];

  if (animal.length === 0) {
    gaps.push({
      id: "hybrid-no-animal",
      severity: "required",
      title: "Hybrid plate missing animal foods",
      detail:
        "A hybrid pattern without animal foods collapses to plant-only, including the B12/EPA/heme/retinol gaps.",
    });
  }
  if (plant.length === 0) {
    gaps.push({
      id: "hybrid-no-plant",
      severity: "material",
      title: "Hybrid plate missing plants",
      detail: "A hybrid pattern without plants has no fibre/phytochemical axis.",
    });
  }

  return {
    pattern: "hybrid",
    headline:
      "Hybrid is the only pattern that can cover plant axes and animal-exclusive compounds without mandatory fortification — if both kingdoms are actually on the plate.",
    gaps,
    practices: [
      "Pair heme iron with a vitamin-C plant if non-heme plant iron is also being counted. Do not reverse the implication: plants do not create heme.",
      "Use oily fish or algal oil for EPA/DHA; use ruminant fat if odd-chain/CLA composition is the question.",
      "Keep fermented kraut and fermented dairy in separate columns. Shared fermentation is not shared biochemistry.",
      "Organs cover retinol/B12/choline at low mass; muscle covers creatine/carnosine; legumes cover fibre and incomplete protein.",
    ],
    suggestedFoodIds: [
      "egg_whole_cooked",
      "salmon_atlantic_cooked",
      "lentils_boiled",
      "sauerkraut",
      "kale_raw",
    ],
  };
}

export function topInClass(cards: readonly ScoreCard[], foodClass: string, n = 3): ScoreCard[] {
  return cards
    .filter((card) => {
      const food = FOODS.find((item) => item.id === card.foodId);
      return food?.class === foodClass;
    })
    .sort((a, b) => a.classRank - b.classRank)
    .slice(0, n);
}

export function scoredSuggestions(pattern: DietaryPattern): ScoreCard[] {
  const rec = recommend({ pattern, selectedIds: [] });
  const cards = scoreCatalog(FOODS);
  return rec.suggestedFoodIds
    .map((id) => cards.find((card) => card.foodId === id))
    .filter((card): card is ScoreCard => Boolean(card));
}

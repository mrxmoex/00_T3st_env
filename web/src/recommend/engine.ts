import type {
  DietaryPattern,
  Food,
  FoodEvaluation,
  Recommendation,
  RecommendationReport,
} from "../types/domain.ts";

const PLANT_ONLY_CANNOT_CLAIM = [
  "A plant-only pattern is not nutritionally complete without fortification or supplementation.",
  "Plant proteins are incomplete; complementary mixing improves the amino-acid score but does not equal animal DIAAS or digestibility.",
  "There is no reliable plant source of active vitamin B12, creatine, taurine, or carnosine.",
  "Long-chain EPA/DHA require algae oil or animal foods; ALA conversion is inefficient and is not treated as equivalent.",
  "Non-heme iron, phytate-bound zinc, and carotenoid vitamin A are not scored as equivalent to heme iron, animal zinc, or preformed retinol.",
] as const;

function topByAxis(
  foods: readonly Food[],
  evaluations: readonly FoodEvaluation[],
  axis: FoodEvaluation["scores"] extends infer S ? keyof S : never,
  kingdom: Food["kingdom"] | "any",
  n: number,
): string[] {
  return [...foods]
    .filter((food) => kingdom === "any" || food.kingdom === kingdom)
    .sort((a, b) => {
      const ea = evaluations.find((item) => item.foodId === a.id)?.scores[axis] ?? 0;
      const eb = evaluations.find((item) => item.foodId === b.id)?.scores[axis] ?? 0;
      return eb - ea;
    })
    .slice(0, n)
    .map((food) => food.id);
}

export function recommend(input: {
  pattern: DietaryPattern;
  foods: readonly Food[];
  evaluations: readonly FoodEvaluation[];
}): RecommendationReport {
  const { pattern, foods, evaluations } = input;
  const items: Recommendation[] = [];
  const suggested = new Set<string>();

  switch (pattern) {
    case "plant_only": {
      items.push(
        {
          id: "b12-required",
          severity: "required",
          title: "Active vitamin B12 must be fortified or supplemented",
          body: "No food in the plant kingdom in this dataset supplies active B12. Algal B12-like corrinoids are scored as analogs (coefficient 0), not as vitamin B12. A plant-only pattern without a reliable B12 source is deficient by construction.",
        },
        {
          id: "epa-dha",
          severity: "required",
          title: "Long-chain EPA/DHA need algae oil or are absent",
          body: "Nori and wakame contain some EPA; they do not replace oily fish or a measured algae-oil supplement. ALA from leaves or seeds is not scored as equivalent (conversion ≈ 8% to EPA, ≈ 0.5% to DHA).",
        },
        {
          id: "protein-quality",
          severity: "advised",
          title: "Combine legumes with other plants — still incomplete proteins",
          body: "Lentils, beans, and tofu can raise the limiting-amino-acid score when eaten together. Digestibility remains in the plant range. This engine will not label the combination a complete protein.",
        },
        {
          id: "iron-zinc",
          severity: "advised",
          title: "Plan iron and zinc around phytate, not around raw milligrams",
          body: "Leafy greens and legumes show high iron on the label; non-heme absorption and phytate binding are applied before the score. Vitamin C pairing helps non-heme iron; it does not create heme iron.",
        },
        {
          id: "creatine-etc",
          severity: "context",
          title: "Creatine, taurine, and carnosine stay animal-exclusive",
          body: "These are listed as animal advantages. A plant-only pattern either accepts their absence or uses isolated supplements — foods in the plant classes do not provide them.",
        },
      );
      for (const id of [
        ...topByAxis(foods, evaluations, "fibre_phyto", "plant", 3),
        ...topByAxis(foods, evaluations, "micronutrient_bioavail", "plant", 3),
        ...topByAxis(foods, evaluations, "efa_glyceride", "plant", 2),
      ]) {
        suggested.add(id);
      }
      break;
    }
    case "animal_inclusive": {
      items.push(
        {
          id: "organs-weekly",
          severity: "advised",
          title: "Organs cover retinol, B12, heme iron, and choline at low volume",
          body: "Braised beef liver in this dataset is an outlier on preformed vitamin A and B12. Small portions suffice; residue/contaminant concentration is why the residue axis is weighted higher for organs.",
        },
        {
          id: "oily-fish",
          severity: "advised",
          title: "Oily fish supply EPA/DHA that plants cannot match via ALA",
          body: "Farmed Atlantic salmon is the long-chain n-3 reference in this sample. Large predatory fish would raise the mercury term; salmon is scored as a lower-mercury species.",
        },
        {
          id: "ruminant-egg",
          severity: "advised",
          title: "Ruminant muscle and eggs for complete EAA plus distinctive fats",
          body: "Beef contributes heme iron, creatine, carnosine, and estimated CLA/odd-chain fat. Eggs add choline and a published DIAAS above 1.0. Neither is interchangeable with a legume serving.",
        },
        {
          id: "plants-for-fibre",
          severity: "advised",
          title: "Keep plants for fibre and phytochemicals — that is their job",
          body: "Animal foods score near zero on fibre/phytochemicals on purpose. Kraut, leafy salads, mushrooms, and legumes are the complementary classes, not protein substitutes.",
        },
      );
      for (const id of [
        ...topByAxis(foods, evaluations, "eaa_digestibility", "animal", 3),
        ...topByAxis(foods, evaluations, "efa_glyceride", "animal", 2),
        ...topByAxis(foods, evaluations, "fibre_phyto", "plant", 3),
      ]) {
        suggested.add(id);
      }
      break;
    }
    case "hybrid": {
      items.push(
        {
          id: "role-split",
          severity: "advised",
          title: "Assign roles instead of forcing equivalence",
          body: "Use animal foods for complete proteins, heme iron, retinol, B12, and long-chain n-3. Use plant classes for fibre, glucosinolates, carotenoids, and fungal/algal compounds. The composite is class-weighted so those roles stay visible.",
        },
        {
          id: "fermented-both",
          severity: "advised",
          title: "Fermented kraut and fermented dairy are different classes",
          body: "Sauerkraut is scored as cruciferous/kraut (phytochemicals, vitamin C lability, fermentation acids). Greek yogurt is fermented animal (complete dairy protein, calcium, active B12). They are not collapsed into a generic 'fermented' bucket.",
        },
        {
          id: "degrade-practice",
          severity: "context",
          title: "Cook and store for the labile vitamins you actually need",
          body: "Water-soluble vitamins fall on the degradation axis. Fresh leafy salads and sprouts are high-value and high-lability. Liver and eggs are more storage-stable for the fat-soluble and B12 package.",
        },
      );
      for (const id of [
        ...topByAxis(foods, evaluations, "composite", "animal", 3),
        ...topByAxis(foods, evaluations, "composite", "plant", 3),
      ]) {
        suggested.add(id);
      }
      break;
    }
    default: {
      const _exhaustive: never = pattern;
      return _exhaustive;
    }
  }

  return {
    pattern,
    cannotClaim: [...PLANT_ONLY_CANNOT_CLAIM],
    items,
    suggestedFoodIds: [...suggested],
  };
}

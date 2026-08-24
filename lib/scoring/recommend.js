const REQUIRED_PLANT_ONLY_NOTES = [
  "Vitamin B12: required fortification or supplementation on a plant-only pattern. There is no reliable unfortified plant source.",
  "Long-chain EPA/DHA: ALA conversion is inefficient (~8% combined in this model). Use algae oil or an animal source.",
  "Creatine, taurine, and carnosine are animal-tissue metabolites. A plant-only pattern does not supply them unless supplemented.",
  "Non-heme iron and phytate-bound zinc need dietary enhancers (ascorbate, soaking/fermentation) and still are not equivalent to heme iron or animal zinc.",
  "Preformed retinol is absent from plants. Carotenoid vitamin A conversion is variable and down-weighted in this engine.",
];

function bestByClass(foods) {
  const best = new Map();
  for (const food of foods) {
    const prev = best.get(food.classId);
    if (!prev || food.composite > prev.composite) best.set(food.classId, food);
  }
  return [...best.values()];
}

function pickSummary(food) {
  return {
    id: food.id,
    name: food.name,
    classId: food.classId,
    kingdom: food.kingdom,
    composite: food.composite,
    tier: food.tier ?? null,
  };
}

export function recommend(scoredFoods, pattern) {
  const foods = Array.isArray(scoredFoods) ? scoredFoods : [];
  const plantSide = foods.filter((f) => f.kingdom !== "animal");
  const animalSide = foods.filter((f) => f.kingdom === "animal");
  const hasCompleteAnimal = animalSide.some((f) => f.protein?.complete);

  if (pattern === "plant_only") {
    return {
      pattern,
      patternCompleteWithoutFortification: false,
      requiredNotes: [...REQUIRED_PLANT_ONLY_NOTES],
      picks: bestByClass(plantSide).map(pickSummary),
      rationale:
        "Best-in-class plants are listed for fibre, phytochemicals, and micronutrient density. This is not a complete diet. Fortification/supplementation remains mandatory for B12 and is strongly indicated for LC n-3 and several tissue metabolites.",
    };
  }

  if (pattern === "hybrid") {
    const plantPicks = bestByClass(plantSide).slice(0, 4);
    const animalPicks = bestByClass(animalSide).slice(0, 4);
    return {
      pattern,
      patternCompleteWithoutFortification: hasCompleteAnimal,
      requiredNotes: hasCompleteAnimal
        ? ["Hybrid patterns still need attention to iodine, vitamin D, and residue load (especially large fish and high-pesticide produce)."]
        : [...REQUIRED_PLANT_ONLY_NOTES],
      picks: [...animalPicks, ...plantPicks].map(pickSummary),
      rationale:
        "Hybrid recommendations pair complete animal proteins and preformed micros with plant fibre/phytochemical classes that animals do not replace.",
    };
  }

  const fibrePlant = [...plantSide].sort((a, b) => b.axes.fibrePhyto - a.axes.fibrePhyto)[0];
  const animalPicks = bestByClass(animalSide);
  const picks = [...animalPicks];
  if (fibrePlant) picks.push(fibrePlant);

  return {
    pattern: "animal_inclusive",
    patternCompleteWithoutFortification: hasCompleteAnimal,
    requiredNotes: [
      "Animal-inclusive patterns can cover EAA completeness, B12, retinol, heme iron, and LC n-3 from food. Plant foods remain the fibre/phytochemical class — that advantage is not claimed for muscle or organs.",
    ],
    picks: picks.map(pickSummary),
    rationale:
      "Prefer a complete-protein animal food (muscle, organ, egg, or dairy) plus at least one high-fibre plant class. Organs concentrate retinol, B12, and heme iron; they are not interchangeable with muscle.",
  };
}

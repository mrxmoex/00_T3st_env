import { kingdomOf } from "@/lib/ontology";
import type {
  AntiNutrientLoad,
  AxisId,
  AxisScore,
  EvaluatedFood,
  Localized,
  ResidueProfile,
  SeedFood,
  Tier,
} from "@/types/catalog";

export const AXIS_ORDER: AxisId[] = [
  "nutrientDensity",
  "proteinQuality",
  "efaProfile",
  "carbQuality",
  "bioavailability",
  "uniqueBioactives",
  "practicalEfficiency",
];

const TIER_CUTS: { tier: Tier; min: number }[] = [
  { tier: "S", min: 80 },
  { tier: "A", min: 68 },
  { tier: "B", min: 55 },
  { tier: "C", min: 42 },
  { tier: "D", min: 0 },
];

export function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

export function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

export function completenessMultiplier(diaas: number): number {
  if (diaas >= 1) return 1;
  if (diaas >= 0.75) return 0.9;
  return 0.75;
}

export function faoQualityBand(diaas: number): "excellent" | "high" | "no-claim" {
  if (diaas >= 1) return "excellent";
  if (diaas >= 0.75) return "high";
  return "no-claim";
}

function antiLevel(level: AntiNutrientLoad["phytate"]): number {
  switch (level) {
    case "none":
      return 0;
    case "low":
      return 4;
    case "moderate":
      return 10;
    case "high":
      return 18;
    default: {
      const exhaustive: never = level;
      return exhaustive;
    }
  }
}

function residuePenalty(residues: ResidueProfile): number {
  if (residues.typicalLoad === "not-applicable") return 0;
  const surface =
    residues.surfaceClass === "leafy" ? 10 : residues.surfaceClass === "thin-skin" ? 5 : 2;
  const load =
    residues.typicalLoad === "high" ? 1 : residues.typicalLoad === "moderate" ? 0.6 : 0.25;
  return surface * load;
}

function ironAbsorptionFactor(food: SeedFood): number {
  if (food.ironForm === "heme" || food.ironForm === "mixed-heme") return 0.16;
  const phytate = food.antiNutrients.phytate;
  const oxalate = food.antiNutrients.oxalate;
  if (phytate === "high" || oxalate === "high") return 0.06;
  if (phytate === "moderate" || oxalate === "moderate") return 0.08;
  return 0.1;
}

function zincAbsorptionFactor(food: SeedFood): number {
  if (!food.antiNutrients.phytate || food.antiNutrients.phytate === "none") return 0.3;
  if (food.antiNutrients.phytate === "low") return 0.24;
  if (food.antiNutrients.phytate === "moderate") return 0.18;
  return 0.12;
}

function pctRef(amount: number | null, ref: number): number {
  if (amount === null || amount <= 0) return 0;
  return clamp((amount / ref) * 100);
}

function loc(en: string, de: string): Localized {
  return { en, de };
}

function scoreProtein(food: SeedFood): AxisScore {
  const { diaas, limitingAA, complete, sourceIds } = food.proteinQuality;
  const raw = clamp((diaas / 1.18) * 100);
  const multiplier = completenessMultiplier(diaas);
  const adjusted = clamp(raw * multiplier);
  const band = faoQualityBand(diaas);
  return {
    axis: "proteinQuality",
    raw: round1(raw),
    adjusted: round1(adjusted),
    rationale: loc(
      `DIAAS ${diaas.toFixed(2)} (${band}; limiting ${limitingAA}; complete=${complete}). Completeness multiplier ${multiplier} applied before ranking. FAO does not truncate individual-food DIAAS >1.0.`,
      `DIAAS ${diaas.toFixed(2)} (${band}; limitierend ${limitingAA}; vollständig=${complete}). Vollständigkeitsfaktor ${multiplier} vor dem Ranking. FAO kappt DIAAS >1,0 für Einzellebensmittel nicht.`,
    ),
    sourceIds,
    tradeoffs: complete
      ? [
          loc(
            "High ileal completeness does not supply fiber.",
            "Hohe ileale Vollständigkeit liefert keine Ballaststoffe.",
          ),
        ]
      : [
          loc(
            "Complementarity can raise the meal DIAAS; it does not equal the ileal digestibility of egg, milk, or muscle.",
            "Komplementierung kann den Mahlzeiten-DIAAS heben; sie gleicht nicht die ileale Verdaulichkeit von Ei, Milch oder Muskel an.",
          ),
        ],
  };
}

function scoreDensity(food: SeedFood): AxisScore {
  const n = food.nutrients;
  const kcal = Math.max(n.energyKcal, 1);
  const feAbs = (n.feMg ?? 0) * ironAbsorptionFactor(food);
  const znAbs = (n.znMg ?? 0) * zincAbsorptionFactor(food);
  const retinolBonus = (n.retinolUg ?? 0) > 0 ? 1 : 0.7;
  const per100g =
    pctRef(n.proteinG, 56) * 0.6 +
    pctRef(n.fiberG, 30) +
    pctRef(n.vitCMg, 110) +
    pctRef(n.folateUg, 300) +
    pctRef(n.vitARaeUg, 750) * retinolBonus +
    pctRef(feAbs, 11) +
    pctRef(znAbs, 14) +
    pctRef(n.caMg, 1000) +
    pctRef(n.vitB12Ug, 4) +
    pctRef(n.kMg, 4000) * 0.4;
  const per100kcal = per100g * (100 / kcal);
  const sugarPenalty = pctRef(n.sugarsG, 50) * 0.35;
  const raw = clamp(per100g * 0.22 + Math.min(per100kcal, 220) * 0.18 - sugarPenalty);
  const bioMult =
    food.ironForm === "nonheme" &&
    (food.antiNutrients.phytate === "high" || food.antiNutrients.oxalate === "high")
      ? 0.88
      : 1;
  return {
    axis: "nutrientDensity",
    raw: round1(raw),
    adjusted: round1(clamp(raw * bioMult)),
    rationale: loc(
      `Indexed per 100 g and per 100 kcal against DGE/EFSA adult anchors. Iron and zinc enter after absorption factors (heme ~16%, high-phytate nonheme ~6–8%). Bioavailability multiplier ${bioMult}.`,
      `Indexiert je 100 g und je 100 kcal gegen DGE/EFSA-Anker. Eisen und Zink nach Absorptionsfaktoren (Häm ~16 %, Nicht-Häm bei hohem Phytat ~6–8 %). Bioverfügbarkeitsfaktor ${bioMult}.`,
    ),
    sourceIds: [...food.nutrientSourceIds, "dge-ref-2025", "nih-iron"],
    tradeoffs: [
      loc(
        "Density per kcal favours watery leaves; density of complete protein and retinol favours organs.",
        "Dichte je kcal begünstigt wässriges Blatt; Dichte an vollständigem Protein und Retinol begünstigt Innereien.",
      ),
    ],
  };
}

function scoreEfa(food: SeedFood): AxisScore {
  const n = food.nutrients;
  const epa = n.epaG ?? 0;
  const dha = n.dhaG ?? 0;
  const ala = n.alaG ?? 0;
  const n6 = n.omega6G ?? 0;
  const preformed = epa + dha;
  const effectiveFromAla = ala * 0.1;
  const longChain = preformed + effectiveFromAla;
  let raw = clamp(longChain * 48 + (preformed > 0 ? 18 : 0));
  if (n6 > 0 && longChain > 0) {
    const ratio = n6 / Math.max(preformed + ala, 0.001);
    if (ratio > 10) raw -= 8;
    if (ratio < 2) raw += 4;
  }
  if (preformed === 0 && ala > 0) {
    raw = clamp(raw);
  }
  return {
    axis: "efaProfile",
    raw: round1(clamp(raw)),
    adjusted: round1(clamp(raw)),
    rationale: loc(
      `Preformed EPA+DHA ${preformed.toFixed(3)} g/100 g. ALA ${ala.toFixed(3)} g counted at 10% conversion (NIH <15%). Omega-6 ${n6.toFixed(2)} g.`,
      `Präformiertes EPA+DHA ${preformed.toFixed(3)} g/100 g. ALA ${ala.toFixed(3)} g mit 10 % Konversion (NIH <15 %). Omega-6 ${n6.toFixed(2)} g.`,
    ),
    sourceIds: ["nih-omega3", ...food.nutrientSourceIds],
    tradeoffs: [
      loc(
        "ALA is essential; it is not a high-efficiency EPA/DHA source.",
        "ALA ist essenziell; es ist keine hocheffiziente EPA/DHA-Quelle.",
      ),
    ],
  };
}

function scoreCarb(food: SeedFood): AxisScore {
  const n = food.nutrients;
  const fiber = n.fiberG ?? 0;
  const rs = n.resistantStarchG ?? 0;
  const sugar = n.sugarsG ?? 0;
  const starch = n.starchG ?? Math.max((n.carbG ?? 0) - fiber - sugar, 0);
  const passive = fiber + rs;
  const active = sugar + starch;
  const total = passive + active;
  let raw: number;
  if (total < 1) {
    raw = 48;
  } else if (fiber === 0 && total < 8) {
    raw = clamp(48 - active * 1.4);
  } else {
    raw = clamp((passive / total) * 100 + Math.min(fiber * 2.2, 12));
  }
  return {
    axis: "carbQuality",
    raw: round1(raw),
    adjusted: round1(raw),
    rationale:
      total < 1
        ? loc(
            "No meaningful carbohydrate. Neutral: no active sugar/starch load and no fiber/resistant-starch advantage.",
            "Kein relevantes Kohlenhydrat. Neutral: keine aktive Zucker-/Stärkelast und kein Ballaststoff-/Resistente-Stärke-Vorteil.",
          )
        : loc(
            `Passive ${passive.toFixed(1)} g (fiber+RS) vs active ${active.toFixed(1)} g (sugars+digestible starch) per 100 g.`,
            `Passiv ${passive.toFixed(1)} g (Ballast+RS) vs. aktiv ${active.toFixed(1)} g (Zucker+verdauliche Stärke) je 100 g.`,
          ),
    sourceIds: [...food.nutrientSourceIds, "efsa-drv"],
    tradeoffs: [
      loc(
        "Animal foods score mid on this axis because they lack both active starch and fiber.",
        "Tierische Lebensmittel liegen auf dieser Achse in der Mitte, weil ihnen aktive Stärke und Ballaststoffe fehlen.",
      ),
    ],
  };
}

function scoreBioavailability(food: SeedFood): AxisScore {
  let raw = 62;
  if (food.ironForm === "heme" || food.ironForm === "mixed-heme") raw += 18;
  raw -= antiLevel(food.antiNutrients.phytate);
  raw -= antiLevel(food.antiNutrients.oxalate) * 0.9;
  raw -= antiLevel(food.antiNutrients.lectin) * 0.6;
  raw -= antiLevel(food.antiNutrients.polyphenolMineralBind) * 0.5;
  raw -= residuePenalty(food.residues);
  if (food.category === "fermented-plant" || food.category === "sprouts-microgreens") raw += 8;
  if (food.category === "dairy") raw += 6;
  const adjusted = clamp(raw);
  return {
    axis: "bioavailability",
    raw: round1(clamp(raw)),
    adjusted: round1(adjusted),
    rationale: loc(
      `Heme status ${food.ironForm}. Phytate ${food.antiNutrients.phytate}, oxalate ${food.antiNutrients.oxalate}, lectin ${food.antiNutrients.lectin}. Residue surface ${food.residues.surfaceClass}/${food.residues.typicalLoad}.`,
      `Häm-Status ${food.ironForm}. Phytat ${food.antiNutrients.phytate}, Oxalat ${food.antiNutrients.oxalate}, Lektin ${food.antiNutrients.lectin}. Rückstandsfläche ${food.residues.surfaceClass}/${food.residues.typicalLoad}.`,
    ),
    sourceIds: [
      "nih-iron",
      ...food.antiNutrients.sourceIds,
      ...food.residues.sourceIds,
    ],
    tradeoffs: [
      loc(
        "Preparation (soak, sprout, ferment, cook) is a partial recovery, not a full offset.",
        "Zubereitung (einweichen, keimen, fermentieren, garen) ist eine teilweise Erholung, kein voller Ausgleich.",
      ),
    ],
  };
}

function scoreBioactives(food: SeedFood): AxisScore {
  let raw = 20;
  for (const item of food.bioactives) {
    switch (item.presence) {
      case "characteristic":
        raw += 14;
        break;
      case "present":
        raw += 8;
        break;
      case "trace":
        raw += 3;
        break;
      case "analog-only":
        raw -= 6;
        break;
      case "absent":
        break;
      default: {
        const exhaustive: never = item.presence;
        throw new Error(`Unhandled bioactive presence: ${String(exhaustive)}`);
      }
    }
  }
  return {
    axis: "uniqueBioactives",
    raw: round1(clamp(raw)),
    adjusted: round1(clamp(raw)),
    rationale: loc(
      `Scored from documented unique compounds only (glucosinolates, ergothioneine, EPA, retinol, cultures, creatine). Analog-only compounds subtract.`,
      `Nur dokumentierte einzigartige Verbindungen (Glucosinolate, Ergothionein, EPA, Retinol, Kulturen, Kreatin). Nur-Analoga mindern.`,
    ),
    sourceIds: food.bioactives.flatMap((item) => item.sourceIds),
    tradeoffs: [
      loc(
        "A bioactive niche is not a complete nutrient profile.",
        "Eine bioaktive Nische ist kein vollständiges Nährstoffprofil.",
      ),
    ],
  };
}

function scorePractical(food: SeedFood): AxisScore {
  let raw = 70;
  switch (food.practical.prepBurden) {
    case "ready":
      raw += 16;
      break;
    case "light":
      raw += 8;
      break;
    case "cook":
      raw += 0;
      break;
    case "soak-cook":
      raw -= 10;
      break;
    case "specialized":
      raw -= 16;
      break;
    default: {
      const exhaustive: never = food.practical.prepBurden;
      throw new Error(String(exhaustive));
    }
  }
  if (food.practical.storageStability === "labile") raw -= 10;
  if (food.practical.storageStability === "high") raw += 4;
  if (food.practical.heatLabileLoss === "high") raw -= 8;
  if (food.practical.heatLabileLoss === "low") raw += 4;
  return {
    axis: "practicalEfficiency",
    raw: round1(clamp(raw)),
    adjusted: round1(clamp(raw)),
    rationale: loc(
      `Prep ${food.practical.prepBurden}; storage ${food.practical.storageStability}; heat-labile loss ${food.practical.heatLabileLoss}.`,
      `Zubereitung ${food.practical.prepBurden}; Lagerung ${food.practical.storageStability}; hitzelabile Verluste ${food.practical.heatLabileLoss}.`,
    ),
    sourceIds: ["usda-fdc"],
    tradeoffs: [food.practical.note],
  };
}

export function scoreFood(food: SeedFood): Record<AxisId, AxisScore> {
  return {
    nutrientDensity: scoreDensity(food),
    proteinQuality: scoreProtein(food),
    efaProfile: scoreEfa(food),
    carbQuality: scoreCarb(food),
    bioavailability: scoreBioavailability(food),
    uniqueBioactives: scoreBioactives(food),
    practicalEfficiency: scorePractical(food),
  };
}

export function combinedScore(scores: Record<AxisId, AxisScore>): number {
  const sum = AXIS_ORDER.reduce((acc, axis) => acc + scores[axis].adjusted, 0);
  return round1(sum / AXIS_ORDER.length);
}

export function tierFor(score: number): Tier {
  for (const cut of TIER_CUTS) {
    if (score >= cut.min) return cut.tier;
  }
  return "D";
}

export function evaluateFoods(foods: SeedFood[]): EvaluatedFood[] {
  const prelim = foods.map((food) => {
    const scores = scoreFood(food);
    return {
      food,
      kingdom: kingdomOf(food.category),
      scores,
      combined: combinedScore(scores),
    };
  });

  const byClass = new Map<string, typeof prelim>();
  for (const item of prelim) {
    const list = byClass.get(item.food.category) ?? [];
    list.push(item);
    byClass.set(item.food.category, list);
  }
  for (const list of byClass.values()) {
    list.sort((a, b) => b.combined - a.combined);
  }

  const across = [...prelim].sort((a, b) => b.combined - a.combined);

  return prelim.map((item) => {
    const classList = byClass.get(item.food.category) ?? [];
    const withinClassRank = classList.findIndex((row) => row.food.id === item.food.id) + 1;
    const acrossClassRank = across.findIndex((row) => row.food.id === item.food.id) + 1;
    return {
      ...item,
      withinClassTier: tierFor(item.combined),
      acrossClassTier: tierFor(item.combined),
      withinClassRank,
      acrossClassRank,
    };
  });
}

export function assertNoVegetableAverage(foods: SeedFood[]): void {
  const plants = foods.filter((food) => kingdomOf(food.category) !== "animal");
  const ids = new Set(plants.map((food) => food.category));
  if (ids.size < 6) {
    throw new Error("Plant-side categories collapsed; ontology requires six unequal classes.");
  }
}

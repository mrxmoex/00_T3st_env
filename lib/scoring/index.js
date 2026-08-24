import {
  ALA_TO_EPA_DHA_CONVERSION,
  AXIS_KEYS,
  CLASS_IDS,
  CLASS_META,
  CLASS_WEIGHTS,
  FAO_2013_DIAAS_REF_MG_PER_G,
} from "./constants.js";
import { scoreCarbs } from "./carbs.js";
import { round } from "./math.js";
import { scoreLipids } from "./lipids.js";
import { scoreMicros } from "./micros.js";
import { scoreDegradation, scoreFibrePhyto, scoreResidue } from "./other-axes.js";
import { scoreProtein } from "./protein.js";
import { recommend } from "./recommend.js";

export {
  ALA_TO_EPA_DHA_CONVERSION,
  AXIS_KEYS,
  CLASS_IDS,
  CLASS_META,
  CLASS_WEIGHTS,
  FAO_2013_DIAAS_REF_MG_PER_G,
  recommend,
};

export function axisKeys() {
  return [...AXIS_KEYS];
}

function compositeFrom(classId, axes) {
  const weights = CLASS_WEIGHTS[classId];
  if (!weights) {
    throw new Error(`Unknown food class: ${classId}`);
  }
  let sum = 0;
  for (const key of AXIS_KEYS) {
    sum += weights[key] * axes[key];
  }
  return round(sum, 2);
}

export function scoreFood(food) {
  if (!food || !CLASS_WEIGHTS[food.classId]) {
    throw new Error(`Unknown or missing food class: ${food?.classId}`);
  }
  const protein = scoreProtein(food);
  const lipids = scoreLipids(food);
  const carbs = scoreCarbs(food);
  const micros = scoreMicros(food);
  const fibrePhyto = scoreFibrePhyto(food);
  const residue = scoreResidue(food);
  const degradation = scoreDegradation(food);
  const axes = {
    eaa: protein.score,
    efa: lipids.score,
    carbs: carbs.score,
    micros: micros.score,
    fibrePhyto: fibrePhyto.score,
    residue: residue.score,
    degradation: degradation.score,
  };
  const composite = compositeFrom(food.classId, axes);
  axes.composite = composite;
  return {
    ...food,
    protein: { ...food.protein, ...protein },
    lipids: { ...food.lipids, ...lipids },
    carbs: { ...food.carbs, ...carbs },
    micros: { ...food.micros, ...micros },
    axes,
    composite,
    claims: protein.claims,
    trace: {
      protein: protein.formula,
      efa: lipids.formula,
      carbs: carbs.formula,
      micros: micros.formula,
      fibrePhyto: fibrePhyto.formula,
      residue: residue.formula,
      degradation: degradation.formula,
      composite: `class-weighted sum for ${food.classId}: ${JSON.stringify(CLASS_WEIGHTS[food.classId])}`,
    },
  };
}

export function scoreDataset(foods) {
  return foods.map((food) => scoreFood(food));
}

const TIER_RANK = Object.freeze({ S: 5, A: 4, B: 3, C: 2, D: 1 });
const TIER_FROM_RANK = Object.freeze({ 5: "S", 4: "A", 3: "B", 2: "C", 1: "D" });

function absoluteBand(score) {
  if (score >= 82) return "S";
  if (score >= 68) return "A";
  if (score >= 52) return "B";
  if (score >= 36) return "C";
  return "D";
}

function betterTier(a, b) {
  return TIER_RANK[a] >= TIER_RANK[b] ? a : b;
}

function relativeBand(norm) {
  if (norm >= 0.85) return "S";
  if (norm >= 0.6) return "A";
  if (norm >= 0.35) return "B";
  if (norm >= 0.15) return "C";
  return "D";
}

export function assignTiers(scoredFoods) {
  const groups = new Map();
  for (const food of scoredFoods) {
    const list = groups.get(food.classId) ?? [];
    list.push(food);
    groups.set(food.classId, list);
  }
  const ranked = [];
  for (const [, list] of groups) {
    const sorted = [...list].sort((a, b) => b.composite - a.composite);
    const max = sorted[0]?.composite ?? 0;
    const min = sorted[sorted.length - 1]?.composite ?? 0;
    for (const food of sorted) {
      const absolute = absoluteBand(food.composite);
      let tier = absolute;
      if (sorted.length > 1 && max !== min) {
        const norm = (food.composite - min) / (max - min);
        tier = betterTier(absolute, relativeBand(norm));
      }
      if (food === sorted[0] && TIER_RANK[tier] <= 2 && food.composite >= 50) {
        tier = "A";
      }
      if (food === sorted[sorted.length - 1] && tier === "S" && sorted.length > 1) {
        tier = TIER_FROM_RANK[Math.max(1, TIER_RANK[absolute])];
      }
      ranked.push({ ...food, tier });
    }
  }
  return ranked;
}

export function csvEscape(value) {
  const text = value == null ? "" : String(value);
  if (/[",\n]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

export function exportJson(foods, meta = {}) {
  return {
    meta: {
      title: "Du bist was du isst",
      exportedAt: new Date().toISOString(),
      ...meta,
    },
    foods,
  };
}

export function exportCsv(foods) {
  const headers = [
    "id",
    "name",
    "classId",
    "kingdom",
    "tier",
    "composite",
    "eaa",
    "efa",
    "carbs",
    "micros",
    "fibrePhyto",
    "residue",
    "degradation",
    "diaas",
    "pdcaas",
    "proteinKind",
    "limitingAA",
  ];
  const lines = [headers.join(",")];
  for (const food of foods) {
    lines.push(
      [
        food.id,
        food.name,
        food.classId,
        food.kingdom,
        food.tier ?? "",
        food.composite,
        food.axes?.eaa,
        food.axes?.efa,
        food.axes?.carbs,
        food.axes?.micros,
        food.axes?.fibrePhyto,
        food.axes?.residue,
        food.axes?.degradation,
        food.protein?.diaas,
        food.protein?.pdcaas,
        food.protein?.kind,
        food.protein?.limitingAA,
      ]
        .map(csvEscape)
        .join(","),
    );
  }
  return `${lines.join("\n")}\n`;
}

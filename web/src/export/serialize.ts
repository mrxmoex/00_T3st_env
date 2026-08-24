import { axisLabel, foodClassLabel, kingdomLabel } from "../catalog/labels.ts";
import { DATASET_META } from "../catalog/dataset-meta.ts";
import type { Food, FoodEvaluation, ScoreAxis } from "../types/domain.ts";
import { SCORE_AXES } from "../catalog/labels.ts";

export interface MatrixRow {
  id: string;
  name: string;
  nameDe: string;
  kingdom: string;
  foodClass: string;
  fdcId: number | null;
  completeness: string;
  limitingAminoAcid: string;
  diaasLike: number;
  scores: Record<ScoreAxis, number>;
  tiers: Record<ScoreAxis, string>;
}

export function matrixRows(
  foods: readonly Food[],
  evaluations: readonly FoodEvaluation[],
): MatrixRow[] {
  const byId = new Map(evaluations.map((item) => [item.foodId, item]));
  return foods.map((food) => {
    const evaluation = byId.get(food.id);
    if (!evaluation) {
      throw new Error(`Missing evaluation for ${food.id}`);
    }
    return {
      id: food.id,
      name: food.name,
      nameDe: food.nameDe,
      kingdom: kingdomLabel(food.kingdom),
      foodClass: foodClassLabel(food.foodClass),
      fdcId: food.fdcId,
      completeness: evaluation.eaa.completeness,
      limitingAminoAcid: evaluation.eaa.limitingAminoAcid,
      diaasLike: evaluation.eaa.diaasLike,
      scores: { ...evaluation.scores },
      tiers: { ...evaluation.tiers },
    };
  });
}

export function toJsonExport(foods: readonly Food[], evaluations: readonly FoodEvaluation[]): string {
  return `${JSON.stringify(
    {
      meta: DATASET_META,
      rows: matrixRows(foods, evaluations),
    },
    null,
    2,
  )}\n`;
}

function csvEscape(value: string | number | null): string {
  const text = value === null ? "" : String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

export function toCsvExport(foods: readonly Food[], evaluations: readonly FoodEvaluation[]): string {
  const rows = matrixRows(foods, evaluations);
  const headers = [
    "id",
    "name",
    "name_de",
    "kingdom",
    "class",
    "fdc_id",
    "protein_completeness",
    "limiting_aa",
    "diaas_like",
    ...SCORE_AXES.map((axis) => `${axis}_score`),
    ...SCORE_AXES.map((axis) => `${axis}_tier`),
  ];
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(
      [
        row.id,
        row.name,
        row.nameDe,
        row.kingdom,
        row.foodClass,
        row.fdcId,
        row.completeness,
        row.limitingAminoAcid,
        row.diaasLike.toFixed(3),
        ...SCORE_AXES.map((axis) => row.scores[axis].toFixed(1)),
        ...SCORE_AXES.map((axis) => row.tiers[axis]),
      ]
        .map((cell) => csvEscape(cell))
        .join(","),
    );
  }
  return `${lines.join("\n")}\n`;
}

export function exportFilename(kind: "csv" | "json"): string {
  return `du-bist-was-du-isst-${DATASET_META.version}.${kind}`;
}

export function axisHeader(axis: ScoreAxis): string {
  return axisLabel(axis);
}

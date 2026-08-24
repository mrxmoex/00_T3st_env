import { classLabel, kingdomLabel } from "../data/labels";
import { MANIFEST } from "../data/manifest";
import type { Food, FoodScores, ScoreAxis } from "../data/types";
import { activeCarbs, passiveCarbs } from "../scoring/carbs";

const AXES: ScoreAxis[] = [
  "eaa",
  "fat",
  "carb",
  "micro",
  "fibre",
  "residue",
  "degradation",
  "composite",
];

export interface ExportRow {
  id: string;
  name: string;
  kingdom: string;
  foodClass: string;
  tier: string;
  composite: number;
  eaa: number;
  fat: number;
  carb: number;
  micro: number;
  fibre: number;
  residue: number;
  degradation: number;
  proteinG: number;
  kcalPer100g: number;
  activeCarbsG: number;
  passiveCarbsG: number;
  formulaVersion: string;
  dataVersion: string;
  lastVerified: string;
}

export function toExportRows(foods: Food[], scores: FoodScores[]): ExportRow[] {
  const scoreMap = new Map(scores.map((row) => [row.foodId, row]));
  return foods.map((food) => {
    const score = scoreMap.get(food.id);
    if (!score) {
      throw new Error(`Missing scores for ${food.id}`);
    }
    return {
      id: food.id,
      name: food.name,
      kingdom: kingdomLabel(food.kingdom),
      foodClass: classLabel(food.foodClass),
      tier: score.tier,
      composite: round(score.composite),
      eaa: round(score.eaa.score),
      fat: round(score.fat.score),
      carb: round(score.carb.score),
      micro: round(score.micro.score),
      fibre: round(score.fibre.score),
      residue: round(score.residue.score),
      degradation: round(score.degradation.score),
      proteinG: food.proteinG,
      kcalPer100g: food.kcalPer100g,
      activeCarbsG: round(activeCarbs(food)),
      passiveCarbsG: round(passiveCarbs(food)),
      formulaVersion: MANIFEST.formulaVersion,
      dataVersion: MANIFEST.dataVersion,
      lastVerified: food.lastVerified,
    };
  });
}

export function toJsonPayload(foods: Food[], scores: FoodScores[]): string {
  return JSON.stringify(
    {
      manifest: MANIFEST,
      exportedAt: new Date().toISOString(),
      foods: foods.map((food) => ({
        food,
        scores: scores.find((row) => row.foodId === food.id),
      })),
      matrix: toExportRows(foods, scores),
    },
    null,
    2,
  );
}

export function toCsv(foods: Food[], scores: FoodScores[]): string {
  const rows = toExportRows(foods, scores);
  const headers = Object.keys(rows[0] ?? {}) as (keyof ExportRow)[];
  const escape = (value: string | number) => {
    const text = String(value);
    if (text.includes(",") || text.includes("\"") || text.includes("\n")) {
      return `"${text.replaceAll("\"", "\"\"")}"`;
    }
    return text;
  };
  return [
    headers.join(","),
    ...rows.map((row) => headers.map((key) => escape(row[key])).join(",")),
  ].join("\n");
}

export function downloadText(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function round(value: number): number {
  return Math.round(value * 10) / 10;
}

export { AXES };

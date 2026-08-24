import { FOODS } from "../data/catalog";
import { DATASET_VERSION, LAST_VERIFIED } from "../data/coefficients";
import type { ScoreCard } from "../scoring/types";
import { AXIS_KEYS } from "../scoring/types";

export interface MatrixRow {
  id: string;
  name: string;
  nameDe: string;
  class: string;
  fdcId: string;
  kcalPer100g: number;
  eaa: number;
  aas: number;
  diaas: number;
  efa: number;
  carb: number;
  micro: number;
  fibre: number;
  residue: number;
  degradation: number;
  composite: number;
  tier: string;
  classRank: number;
}

export function toMatrixRows(cards: readonly ScoreCard[]): MatrixRow[] {
  return cards.map((card) => {
    const food = FOODS.find((item) => item.id === card.foodId);
    if (!food) {
      throw new Error(`Missing food for scored id ${card.foodId}`);
    }
    return {
      id: food.id,
      name: food.name,
      nameDe: food.nameDe,
      class: food.class,
      fdcId: food.fdcId ?? "",
      kcalPer100g: food.kcalPer100g,
      eaa: card.eaa.score,
      aas: card.eaa.aas,
      diaas: card.eaa.diaas,
      efa: card.efa.score,
      carb: card.carb.score,
      micro: card.micro.score,
      fibre: card.fibre.score,
      residue: card.residue.score,
      degradation: card.degradation.score,
      composite: card.composite,
      tier: card.tier,
      classRank: card.classRank,
    };
  });
}

export function matrixToCsv(cards: readonly ScoreCard[]): string {
  const rows = toMatrixRows(cards);
  const headers = [
    "id",
    "name",
    "nameDe",
    "class",
    "fdcId",
    "kcalPer100g",
    ...AXIS_KEYS.filter((key) => key !== "composite"),
    "aas",
    "diaas",
    "composite",
    "tier",
    "classRank",
    "datasetVersion",
    "lastVerified",
  ];
  const lines = [headers.join(",")];
  for (const row of rows) {
    const values = [
      row.id,
      csvEscape(row.name),
      csvEscape(row.nameDe),
      row.class,
      row.fdcId,
      row.kcalPer100g,
      row.eaa,
      row.efa,
      row.carb,
      row.micro,
      row.fibre,
      row.residue,
      row.degradation,
      row.aas,
      row.diaas,
      row.composite,
      row.tier,
      row.classRank,
      DATASET_VERSION,
      LAST_VERIFIED,
    ];
    lines.push(values.join(","));
  }
  return `${lines.join("\n")}\n`;
}

export function matrixToJson(cards: readonly ScoreCard[]): string {
  return JSON.stringify(
    {
      datasetVersion: DATASET_VERSION,
      lastVerified: LAST_VERIFIED,
      rows: toMatrixRows(cards),
    },
    null,
    2,
  );
}

function csvEscape(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
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

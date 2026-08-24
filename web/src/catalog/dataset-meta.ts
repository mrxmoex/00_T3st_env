import type { DatasetMeta } from "../types/domain.ts";

export const DATASET_META: DatasetMeta = {
  name: "Du bist was du isst — EVN matrix",
  version: "2026.08.24",
  lastVerified: "2026-08-24",
  unitBasis: "per_100g",
  notes: [
    "Nutrient amounts are per 100 g edible portion as published.",
    "Scores are computed from raw tables plus documented coefficients — never from a model.",
    "Where FoodData Central lacks a field (CLA, odd-chain FA, resistant starch, iodine, phytate, DIAAS), the value is flagged estimate or literature.",
    "USDA FDC IDs point at SR Legacy records retrieved 2026-08-24 unless noted.",
  ],
};

import type { Messages } from "../i18n/messages";
import type { FoodRecord, ScoreCard } from "../scoring/types";
import { axisValue } from "./MatrixTable";

/** Display-only spokes for Compare axis radar: EAA axis split into pattern, digestibility, density. */
export const COMPARE_RADAR_KEYS = [
  "proteinPattern",
  "proteinDigest",
  "proteinDensity",
  "efa",
  "carb",
  "micro",
  "fibre",
  "residue",
  "degradation",
] as const;

export type CompareRadarKey = (typeof COMPARE_RADAR_KEYS)[number];

export function compareRadarLabels(t: Messages): Record<CompareRadarKey, { short: string; label: string }> {
  return {
    proteinPattern: { short: t.compare.radarProteinShort.pattern, label: t.compare.radarProteinLabels.pattern },
    proteinDigest: { short: t.compare.radarProteinShort.digest, label: t.compare.radarProteinLabels.digest },
    proteinDensity: { short: t.compare.radarProteinShort.density, label: t.compare.radarProteinLabels.density },
    efa: { short: t.axesShort.efa, label: t.axes.efa },
    carb: { short: t.axesShort.carb, label: t.axes.carb },
    micro: { short: t.axesShort.micro, label: t.axes.micro },
    fibre: { short: t.axesShort.fibre, label: t.axes.fibre },
    residue: { short: t.axesShort.residue, label: t.axes.residue },
    degradation: { short: t.axesShort.degradation, label: t.axes.degradation },
  };
}

function eaaPart(card: ScoreCard, part: "completeness" | "digestibility" | "proteinDensity"): number {
  return card.eaa.parts[part] ?? 0;
}

export function compareRadarValue(card: ScoreCard, key: CompareRadarKey): number {
  switch (key) {
    case "proteinPattern":
      return eaaPart(card, "completeness") * 100;
    case "proteinDigest":
      return eaaPart(card, "digestibility") * 100;
    case "proteinDensity":
      return eaaPart(card, "proteinDensity") * 100;
    case "efa":
      return axisValue(card, "efa");
    case "carb":
      return axisValue(card, "carb");
    case "micro":
      return axisValue(card, "micro");
    case "fibre":
      return axisValue(card, "fibre");
    case "residue":
      return axisValue(card, "residue");
    case "degradation":
      return axisValue(card, "degradation");
    default: {
      const _exhaustive: never = key;
      return _exhaustive;
    }
  }
}

export function compareRadarTip(
  card: ScoreCard,
  key: CompareRadarKey,
  foodLabel: string,
  t: Messages,
  food: FoodRecord,
): string {
  switch (key) {
    case "proteinPattern":
      return t.compare.radarProteinTips.pattern({ food: foodLabel, aas: card.eaa.aas, diaas: card.eaa.diaas });
    case "proteinDigest":
      return t.compare.radarProteinTips.digest({
        food: foodLabel,
        digestibility: eaaPart(card, "digestibility"),
        diaas: card.eaa.diaas,
      });
    case "proteinDensity":
      return t.compare.radarProteinTips.density({ food: foodLabel, proteinG: food.proteinG });
    default:
      return `${foodLabel}: ${compareRadarLabels(t)[key].label} ${compareRadarValue(card, key).toFixed(1)}`;
  }
}

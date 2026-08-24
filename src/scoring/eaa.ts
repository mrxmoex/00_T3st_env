import {
  DIAAS_SURPLUS_CAP,
  DIAAS_SURPLUS_POINTS,
  FAO_2007_PATTERN,
} from "../data/coefficients";
import type { AminoAcidProfile, AxisBreakdown, Food } from "../data/types";
import { clamp } from "../lib/math";

export interface AminoAcidRatios {
  his: number;
  ile: number;
  leu: number;
  lys: number;
  saa: number;
  aaa: number;
  thr: number;
  trp: number;
  val: number;
  limiting: keyof Omit<AminoAcidRatios, "limiting">;
  uncappedAas: number;
  completeness: number;
}

export function aminoAcidRatios(profile: AminoAcidProfile): AminoAcidRatios {
  const ratios = {
    his: profile.his / FAO_2007_PATTERN.his,
    ile: profile.ile / FAO_2007_PATTERN.ile,
    leu: profile.leu / FAO_2007_PATTERN.leu,
    lys: profile.lys / FAO_2007_PATTERN.lys,
    saa: (profile.met + profile.cys) / FAO_2007_PATTERN.saa,
    aaa: (profile.phe + profile.tyr) / FAO_2007_PATTERN.aaa,
    thr: profile.thr / FAO_2007_PATTERN.thr,
    trp: profile.trp / FAO_2007_PATTERN.trp,
    val: profile.val / FAO_2007_PATTERN.val,
  };
  const entries = Object.entries(ratios) as [
    keyof Omit<AminoAcidRatios, "limiting">,
    number,
  ][];
  let limiting: keyof Omit<AminoAcidRatios, "limiting"> = "lys";
  let uncappedAas = Number.POSITIVE_INFINITY;
  for (const [key, value] of entries) {
    if (value < uncappedAas) {
      uncappedAas = value;
      limiting = key;
    }
  }
  return {
    ...ratios,
    limiting,
    uncappedAas,
    completeness: Math.min(1, uncappedAas),
  };
}

export function scoreEaa(food: Food): AxisBreakdown {
  const ratios = aminoAcidRatios(food.aminoAcids);
  const quality = food.proteinQuality.value;
  const digest = Math.min(1, quality);
  const surplus = Math.max(0, Math.min(quality, DIAAS_SURPLUS_CAP) - 1);
  const surplusPoints =
    ratios.completeness >= 1 ? DIAAS_SURPLUS_POINTS * (surplus / 0.18) : 0;
  const raw = 100 * ratios.completeness * digest + surplusPoints;
  const notes: string[] = [
    `Limiting residue: ${ratios.limiting} (ratio ${ratios.uncappedAas.toFixed(2)} vs FAO 2007).`,
    `Completeness ${ratios.completeness.toFixed(2)} — ${
      ratios.completeness >= 1 ? "complete protein" : "incomplete protein"
    }.`,
    `Quality method ${food.proteinQuality.method} = ${quality.toFixed(2)}.`,
  ];
  if (ratios.completeness < 1) {
    notes.push(
      "Incomplete proteins are not rescaled toward animal complete proteins.",
    );
  }
  if (food.proteinG < 2) {
    notes.push(
      `Only ${food.proteinG.toFixed(1)} g protein / 100 g — completeness is about the protein that is present, not meal adequacy.`,
    );
  }
  return {
    score: clamp(raw, 0, 100),
    flags: [
      {
        key: "fao_2007_pattern",
        applied: true,
        value: 1,
        reason: "FAO/WHO/UNU 2007 adult amino-acid scoring pattern",
      },
      {
        key: "digestibility_cap",
        applied: true,
        value: digest,
        reason: "Quality score capped at 1.0 for the completeness product",
      },
      {
        key: "diaas_surplus",
        applied: surplusPoints > 0,
        value: surplusPoints,
        reason: "DIAAS > 100 adds at most 8 points, only if complete",
      },
    ],
    notes,
  };
}

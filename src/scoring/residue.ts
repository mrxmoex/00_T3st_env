import { clamp01, round1, round2 } from "./math";
import type {
  AxisBreakdown,
  FoodRecord,
  HeavyMetalClass,
  SurfaceAreaClass,
  VetResidueClass,
} from "./types";

function surfaceRisk(value: SurfaceAreaClass): number {
  switch (value) {
    case "high":
      return 0.85;
    case "medium":
      return 0.5;
    case "low":
      return 0.25;
    case "none":
      return 0.05;
    default: {
      const _exhaustive: never = value;
      return _exhaustive;
    }
  }
}

function metalRisk(value: HeavyMetalClass): number {
  switch (value) {
    case "low":
      return 0.15;
    case "moderate":
      return 0.45;
    case "elevated":
      return 0.8;
    default: {
      const _exhaustive: never = value;
      return _exhaustive;
    }
  }
}

function vetRisk(value: VetResidueClass): number {
  switch (value) {
    case "none":
      return 0;
    case "low":
      return 0.25;
    case "moderate":
      return 0.55;
    default: {
      const _exhaustive: never = value;
      return _exhaustive;
    }
  }
}

/**
 * Residue / contaminant risk. Higher score = lower risk.
 * Agricultural chemicals are real and vary by crop surface area and
 * systemic vs contact action. Animal foods carry veterinary / POP / metal
 * pathways instead. This is a classed risk model, not a lab certificate.
 */
export function scoreResidue(food: FoodRecord): AxisBreakdown {
  const r = food.residue;
  const surface = surfaceRisk(r.surfaceAreaClass);
  const systemic = clamp01(r.systemicPesticideLikelihood);
  const contact = clamp01(r.contactPesticideLikelihood);
  const mrl = clamp01(r.typicalMrlProximity);
  const metal = metalRisk(r.heavyMetalClass);
  const vet = vetRisk(r.veterinaryResidueClass);

  const risk =
    0.28 * surface +
    0.18 * systemic +
    0.14 * contact +
    0.14 * mrl +
    0.16 * metal +
    0.1 * vet;

  const score = 100 * (1 - clamp01(risk));
  const flags: string[] = [
    `Surface-area class ${r.surfaceAreaClass}`,
    `Heavy-metal class ${r.heavyMetalClass}`,
    `Veterinary-residue class ${r.veterinaryResidueClass}`,
  ];

  return {
    score: round1(score),
    parts: {
      risk: round2(risk),
      surface,
      systemic: round2(systemic),
      contact: round2(contact),
      mrl: round2(mrl),
      metal,
      vet,
    },
    flags,
  };
}

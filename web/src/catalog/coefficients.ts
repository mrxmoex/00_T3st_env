import type { ValueFlag } from "../types/domain.ts";

/** Documented conversion / bioavailability coefficients. Not food-specific scores. */
export const COEFFICIENTS = {
  /** Non-heme iron absorption relative to heme as the reference (Hurrell & Egli 2010 range). */
  nonHemeIronVsHeme: 0.3,
  nonHemeIronVsHemeFlag: "literature" satisfies ValueFlag,
  /** Extra phytate penalty applied to non-heme iron when phytate is present. */
  phytateIronFactor: 0.7,
  /** Phytate-bound zinc absorption relative to animal zinc (WHO/FAO zinc). */
  phytateZincVsAnimal: 0.4,
  phytateZincVsAnimalFlag: "literature" satisfies ValueFlag,
  /**
   * FAO/WHO vitamin A: 1 µg RAE = 1 µg retinol = 12 µg food beta-carotene.
   * FDC RAE already applies this; we keep the factor visible and apply a matrix caution.
   */
  betaCaroteneToRae: 1 / 12,
  otherCarotenoidToRae: 1 / 24,
  carotenoidMatrixCaution: 0.85,
  /** ALA → EPA conversion efficiency, typical adult mixed-diet estimates. */
  alaToEpa: 0.08,
  /** ALA → DHA conversion efficiency. */
  alaToDha: 0.005,
  alaConversionFlag: "literature" satisfies ValueFlag,
  /** Chemical score cap so surplus leucine does not inflate completeness. */
  aminoAcidScoreCap: 1.5,
  /** Minimum ileal digestibility to call an animal protein complete. */
  completeDigestibilityFloor: 0.9,
  /**
   * FAO DIAAS ≥ 1.00 means no complementary protein is required.
   * Used when an FDC amino-acid panel is incomplete (e.g. missing tryptophan).
   */
  completeDiaasFloor: 1,
  /** Display clamp for axis scores. Raw DIAAS is stored separately. */
  scoreCap: 100,
  /** Active-carb reference (g/100 g) at which the active-carb term saturates. */
  activeCarbSatG: 20,
  /** Passive-carb reference (g/100 g) at which the fibre/RS term saturates. */
  passiveCarbSatG: 8,
  /** Fibre reference (g/100 g) for the phytochemical-adjacent fibre term. */
  fibreSatG: 8,
} as const;

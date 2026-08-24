import type {
  AbsenceCompound,
  AbsenceFact,
  Bioactive,
  Confidence,
  FoodRecord,
  LocaleText,
  Sourced,
} from "@/lib/schema";

export function sourced(
  value: number,
  sourceId: string,
  year: number,
  options: {
    unit?: string;
    confidence?: Confidence;
    note?: LocaleText;
  } = {},
): Sourced<number> {
  return {
    value,
    sourceId,
    year,
    unit: options.unit,
    confidence: options.confidence ?? "high",
    note: options.note,
  };
}

export function absence(
  compound: AbsenceCompound,
  present: boolean,
  sourceId: string,
  year: number,
  note?: LocaleText,
): AbsenceFact {
  return { compound, present, sourceId, year, note };
}

export function bioactive(
  id: string,
  names: LocaleText,
  sourceId: string,
  year: number,
  detail: string,
  confidence: Confidence = "moderate",
): Bioactive {
  return {
    id,
    names,
    evidence: { value: detail, sourceId, year, confidence },
  };
}

export function usdaState(de: string, en: string): LocaleText {
  return { de, en };
}

export type FoodDraft = FoodRecord;

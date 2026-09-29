import type { NovaGroup, ProcessingEvidenceCategory } from "../scoring/types";
import evidence from "./sources/processing-evidence.json";

export interface CategoryStats {
  products: number;
  nova: Record<`${NovaGroup}`, number>;
  novaUnknown: number;
  additives: readonly { code: string; products: number }[];
}

export interface ProcessingEvidence {
  about: string;
  source: { title: string; url: string; license: string; attribution: string; api: string };
  retrieved: string;
  categories: Record<ProcessingEvidenceCategory, { all: CategoryStats; germany: CategoryStats }>;
}

export const PROCESSING_EVIDENCE = evidence as ProcessingEvidence;

/** Products with a NOVA group; the rest are unclassified in the source. */
export function classifiedProducts(stats: CategoryStats): number {
  return stats.nova["1"] + stats.nova["2"] + stats.nova["3"] + stats.nova["4"];
}

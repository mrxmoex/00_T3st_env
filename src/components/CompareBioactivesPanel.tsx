import type { FoodRecord } from "../scoring/types";
import { BioactivesProfile } from "./BioactivesProfile";

export function CompareBioactivesPanel({ foods }: { foods: readonly FoodRecord[] }) {
  return <BioactivesProfile foods={foods} />;
}

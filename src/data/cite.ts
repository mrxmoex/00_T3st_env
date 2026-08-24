import type { CitedValue, DataFlag } from "@/lib/types";

export function cite(
  amount: number,
  unit: string,
  sourceId = "usda-sr-legacy-2018",
  year = 2018,
  flag?: DataFlag,
): CitedValue {
  return flag ? { amount, unit, sourceId, year, flag } : { amount, unit, sourceId, year };
}

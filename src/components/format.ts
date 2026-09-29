/** Compact numbers for nutrient tables: more decimals for smaller amounts. */
export function formatAmount(value: number): string {
  const magnitude = Math.abs(value);
  const digits = magnitude >= 100 ? 0 : magnitude >= 10 ? 1 : magnitude >= 1 ? 2 : 3;
  return String(Number(value.toFixed(digits)));
}

/** Signed percent change, e.g. "−32 %"; null when the base is zero or missing. */
export function formatChange(value: number | null, base: number | null): string | null {
  if (value === null || base === null || base === 0) return null;
  const pct = Math.round(((value - base) / base) * 100);
  if (pct === 0) return "±0 %";
  return `${pct > 0 ? "+" : "−"}${Math.abs(pct)} %`;
}

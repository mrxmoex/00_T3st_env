export function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

export function per100Kcal(value: number, kcal: number): number {
  if (kcal <= 0) return 0;
  return (value / kcal) * 100;
}

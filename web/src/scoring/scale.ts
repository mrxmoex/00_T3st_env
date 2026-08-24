export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

export function safeDiv(numerator: number, denominator: number): number {
  if (denominator === 0) {
    return 0;
  }
  return numerator / denominator;
}

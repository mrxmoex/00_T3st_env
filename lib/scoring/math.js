export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function num(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function round(value, digits = 3) {
  const f = 10 ** digits;
  return Math.round(num(value) * f) / f;
}

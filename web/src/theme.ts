export type Theme = "dark" | "light";

export function readTheme(): Theme {
  const stored = window.localStorage.getItem("dbwdi-theme");
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem("dbwdi-theme", theme);
}

export function heatColor(score: number): string {
  const t = Math.min(1, Math.max(0, score / 100));
  const low = { r: 196, g: 106, b: 58 };
  const mid = { r: 212, g: 160, b: 23 };
  const high = { r: 143, g: 188, b: 113 };
  const from = t < 0.5 ? low : mid;
  const to = t < 0.5 ? mid : high;
  const local = t < 0.5 ? t * 2 : (t - 0.5) * 2;
  const r = Math.round(from.r + (to.r - from.r) * local);
  const g = Math.round(from.g + (to.g - from.g) * local);
  const b = Math.round(from.b + (to.b - from.b) * local);
  return `rgb(${r} ${g} ${b})`;
}

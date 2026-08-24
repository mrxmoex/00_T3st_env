export function heatColor(score: number, dark: boolean): string {
  const t = Math.max(0, Math.min(1, score / 100));
  const hue = 18 + t * 52;
  const sat = dark ? 42 + t * 18 : 48 + t * 16;
  const light = dark ? 16 + t * 28 : 88 - t * 36;
  return `hsl(${hue} ${sat}% ${light}%)`;
}

export function heatText(score: number, dark: boolean): string {
  if (!dark) return score >= 55 ? "#1a1410" : "#3f342c";
  return score >= 50 ? "#1a1410" : "#f3e6d4";
}

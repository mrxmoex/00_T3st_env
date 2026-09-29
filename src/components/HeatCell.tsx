export function heatColor(score: number): string {
  const t = Math.min(100, Math.max(0, score)) / 100;
  const hue = 12 + t * 148;
  const sat = 42 + t * 10;
  const light = 32 + t * 8;
  return `hsl(${hue} ${sat}% ${light}%)`;
}

/** Colour follows `score` (0–100); `label` replaces the printed number when given. */
export function HeatCell({
  score,
  label,
  warning = false,
}: {
  score: number | null;
  label?: string;
  warning?: boolean;
}) {
  if (score === null) {
    return <span className="heat heat-missing">—</span>;
  }
  const text = label ?? score.toFixed(1);
  if (warning) {
    return <span className="heat heat-warning">⚠ {text}</span>;
  }
  return (
    <span className="heat" style={{ background: heatColor(score) }}>
      {text}
    </span>
  );
}

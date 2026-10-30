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
  className,
  title,
}: {
  score: number | null;
  label?: string;
  warning?: boolean;
  className?: string;
  title?: string;
}) {
  const extra = className ? ` ${className}` : "";
  if (score === null) {
    return <span className={`heat heat-missing${extra}`}>—</span>;
  }
  const text = label ?? score.toFixed(1);
  if (warning) {
    return (
      <span className={`heat heat-warning${extra}`} title={title}>
        ⚠ {text}
      </span>
    );
  }
  return (
    <span className={`heat${extra}`} style={{ background: heatColor(score) }} title={title}>
      {text}
    </span>
  );
}

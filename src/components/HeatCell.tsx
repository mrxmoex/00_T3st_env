export function heatColor(score: number): string {
  const t = Math.min(100, Math.max(0, score)) / 100;
  const hue = 12 + t * 148;
  const sat = 42 + t * 10;
  const light = 32 + t * 8;
  return `hsl(${hue} ${sat}% ${light}%)`;
}

export function HeatCell({ score }: { score: number }) {
  return (
    <span className="heat" style={{ background: heatColor(score) }}>
      {score.toFixed(1)}
    </span>
  );
}

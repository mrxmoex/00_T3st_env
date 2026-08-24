import { heatColor } from "../theme.ts";
import type { Tier } from "../types/domain.ts";

export function HeatCell({ score, tier }: { score: number; tier: Tier }) {
  return (
    <span className="heat" style={{ background: heatColor(score) }}>
      {score.toFixed(0)}
      <span className="muted"> {tier}</span>
    </span>
  );
}

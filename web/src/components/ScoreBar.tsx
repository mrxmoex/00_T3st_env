import { axisLabel } from "../catalog/labels.ts";
import type { ScoreAxis, Tier } from "../types/domain.ts";
import { TierBadge } from "./TierBadge.tsx";

export function ScoreBar({
  axis,
  score,
  tier,
}: {
  axis: ScoreAxis;
  score: number;
  tier: Tier;
}) {
  return (
    <div className="score-row">
      <span className="small">{axisLabel(axis)}</span>
      <div className="bar" aria-hidden="true">
        <span style={{ width: `${Math.min(100, score)}%` }} />
      </div>
      <span>
        {score.toFixed(1)} <TierBadge tier={tier} />
      </span>
    </div>
  );
}

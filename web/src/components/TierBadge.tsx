import type { Tier } from "../types/domain.ts";

export function TierBadge({ tier }: { tier: Tier }) {
  return (
    <span className={`tier tier-${tier}`} title={`Within-class tier ${tier}`}>
      {tier}
    </span>
  );
}

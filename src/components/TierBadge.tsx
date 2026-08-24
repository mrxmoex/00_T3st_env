import type { Tier } from "../data/types";

const TONE: Record<Tier, string> = {
  S: "bg-copper-500 text-ink-950",
  A: "bg-plant-500 text-ink-950",
  B: "border border-stone-500 text-stone-700 dark:text-stone-300",
  C: "border border-stone-500 text-stone-500",
  D: "border border-stone-600 text-stone-500",
};

export function TierBadge({ tier }: { tier: Tier }) {
  return (
    <span className={`inline-flex h-7 w-7 items-center justify-center font-mono text-sm ${TONE[tier]}`}>
      {tier}
    </span>
  );
}

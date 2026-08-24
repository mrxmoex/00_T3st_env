import { cn } from "@/lib/cn";
import type { Tier } from "@/lib/schema";

const TONE: Record<Tier, string> = {
  S: "bg-copper/20 text-copper border-copper/40",
  A: "bg-ok/15 text-ok border-ok/30",
  B: "bg-bg-soft text-ink border-line",
  C: "bg-animal/10 text-animal border-animal/30",
  D: "bg-warn/10 text-warn border-warn/30",
};

export function TierBadge({
  tier,
  label,
}: {
  tier: Tier;
  label?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-xs",
        TONE[tier],
      )}
    >
      {tier}
      {label ? <span className="font-sans text-[10px] opacity-80">{label}</span> : null}
    </span>
  );
}

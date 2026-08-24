import { cn } from "@/lib/utils";
import type { Kingdom, Tier } from "@/lib/types";

const TIER_CLASS: Record<Tier, string> = {
  S: "bg-gold/20 text-gold border-gold/40",
  A: "bg-chlorophyll/15 text-chlorophyll border-chlorophyll/40",
  B: "bg-algae/15 text-algae border-algae/40",
  C: "bg-paper/10 text-mute border-line",
  D: "bg-rust/15 text-rust border-rust/40",
};

const KINGDOM_CLASS: Record<Kingdom, string> = {
  plant: "bg-chlorophyll/10 text-chlorophyll border-chlorophyll/30",
  animal: "bg-rust/10 text-rust border-rust/30",
  fungi: "bg-fungi/15 text-fungi border-fungi/30",
  algae: "bg-algae/15 text-algae border-algae/30",
};

export function TierBadge({ tier }: { tier: Tier }) {
  return (
    <span className={cn("inline-flex h-6 min-w-6 items-center justify-center rounded border px-1.5 text-xs font-semibold", TIER_CLASS[tier])}>
      {tier}
    </span>
  );
}

export function KingdomBadge({ kingdom, label }: { kingdom: Kingdom; label: string }) {
  return (
    <span className={cn("inline-flex items-center rounded border px-2 py-0.5 text-[11px] uppercase tracking-wide", KINGDOM_CLASS[kingdom])}>
      {label}
    </span>
  );
}

export function FlagBadge({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded border border-line bg-paper/5 px-2 py-0.5 text-[11px] text-mute">
      {children}
    </span>
  );
}

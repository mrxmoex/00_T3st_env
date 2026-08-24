"use client";

import { categoryLabel } from "@/lib/catalog";
import { cn } from "@/lib/cn";
import { t } from "@/lib/i18n";
import { useLocale } from "@/components/locale-provider";
import type { CategoryId, Kingdom } from "@/types/catalog";

const TONE: Record<Kingdom, string> = {
  plant: "text-plant border-plant/40",
  animal: "text-animal border-animal/40",
  fungi: "text-fungi border-fungi/40",
  algae: "text-algae border-algae/40",
};

export function KingdomBadge({ category }: { category: CategoryId }) {
  const { locale } = useLocale();
  const meta = categoryLabel(category);
  return (
    <span className={cn("rounded-full border px-2 py-0.5 text-[11px]", TONE[meta.kingdom])}>
      {t(meta.name, locale)}
    </span>
  );
}

export function TierMark({ tier }: { tier: string }) {
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-sm border border-line font-mono text-xs text-brass">
      {tier}
    </span>
  );
}

"use client";

import { TierList } from "@/components/tier-list";
import { useLocale } from "@/components/locale-provider";
import { getEvaluatedFoods } from "@/lib/catalog";

export default function TiersPage() {
  const { copy } = useLocale();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">{copy.nav.tiers}</h1>
      <p className="max-w-2xl text-sm text-muted">{copy.combinedNote}</p>
      <TierList foods={getEvaluatedFoods()} />
    </div>
  );
}

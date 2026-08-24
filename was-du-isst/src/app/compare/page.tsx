"use client";

import { CompareTool } from "@/components/compare-tool";
import { useLocale } from "@/components/locale-provider";
import { getEvaluatedFoods } from "@/lib/catalog";

export default function ComparePage() {
  const { copy } = useLocale();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">{copy.nav.compare}</h1>
      <CompareTool foods={getEvaluatedFoods()} />
    </div>
  );
}
